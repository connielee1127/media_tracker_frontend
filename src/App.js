import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Login from "./components/Login";
import MediaList from "./components/MediaList";
import MediaForm from "./components/MediaForm";
import authFetch from "./utils/authFetch";
import FilterBar from "./components/FilterBar";
import Register from "./components/Register"


function App() {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [editingMedia, setEditingMedia] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [limit, setLimit] = useState(10);
  const [showRegister, setShowRegister] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");


  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMedia([]);
    setPage(1);

    setEditingMedia(null);
    setMessage("");

    setSearch("");
    setSortBy("title");
  };
  
  const handleDelete = async (id) => {
    const response = await authFetch(
      `https://media-tracker-5bc6.onrender.com/media/${id}`,
      { method: "DELETE" },
      logout
    );
  
    if (!response) return;
  
    if (response.ok) {
      setMedia(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleEdit = (item) => {
    setEditingMedia(item);
  };

  const handleUpdate = async (id, body) => {
    const response = await authFetch(
      `https://media-tracker-5bc6.onrender.com/media/${id}`,
      {
        method: "PUT", // or PATCH depending on backend
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      logout
    );

    if (!response) return;

    if (response.ok) {
      const data = await response.json();

      setMedia(prev =>
        prev.map(item =>
          item.id === id ? data.data.media : item
        )
      );

      setEditingMedia(null); 
    }
  };

  useEffect(() => {
    if (!isLoggedIn) return;

    const url = `https://media-tracker-5bc6.onrender.com/media/?title=${search}&sort_by=${sortBy}&sort_order=${sortOrder}&page=${page}&limit=${limit}`;

    const fetchMedia = async () => {
      const response = await authFetch(url,{},logout);
    
    if (!response) return; 

    try {
      const data = await response.json();

      const mediaData = data?.data?.media;
      let mediaArray = [];

      if (Array.isArray(mediaData)) {
        mediaArray = mediaData;
      } else if (mediaData) {
        mediaArray = [mediaData];
      }

      setMedia(mediaArray);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch data");
    }
    };
    fetchMedia();
  }, [isLoggedIn, search, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 < Date.now()) {
        logout(); // token expired 
      } else {
        setIsLoggedIn(true); // token still valid
      }
    } catch (err) {
      console.error("Invalid token");
      logout(); // corrupted token 
    }
  }, []);

  useEffect(() => {
    if (!message) return;
  
    const timer = setTimeout(() => {
      setMessage("");
    }, 3000); 
  
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div> 
      <header style={{ display: "flex", justifyContent: "space-between" }}>
      <h1>Media Tracker</h1>

      {isLoggedIn && (
        <button onClick={() => {
          if (window.confirm("Are you sure you want to logout?")) {
            logout();
          }
        }}>
          Logout
        </button>
      )}
      </header>
      {isLoggedIn ? (
      <>
        {error && <p>{error}</p>}
        {message && <p>{message}</p>}


        <MediaForm
          mode="create"
          onSubmit={async (body) => {
            const response = await authFetch(
              "https://media-tracker-5bc6.onrender.com/media/",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
              },
              logout
            );

            if (!response) return;

            if (response.ok) {
              const data = await response.json();
              setMedia(prev => [...prev, data.data.media]);
              setMessage("Media created!")
            }
          }}
        />
  
        <FilterBar
          search={search}
          setSearch={setSearch}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          page={page}
          setPage={setPage}
          limit={limit}
          setLimit={setLimit}
        />

        {<MediaList 
          media={media} 
          onDelete={handleDelete} 
          onEdit={handleEdit}
          editingMedia={editingMedia}
          onUpdate={handleUpdate}
        />}
      </>
    ) : (
      <>
      <Login 
        onLogin={() => setIsLoggedIn(true)}
        onShowRegister={() => setShowRegister(true)}
        loginMessage={loginMessage}
       />

      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)} 
          setLoginMessage={setLoginMessage}
        />
      )}  
      </>
    )}
    </div>
  );
}

export default App;



