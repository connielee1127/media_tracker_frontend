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
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");
  const [editingMedia, setEditingMedia] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [mediaType, setMediaType] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [limit, setLimit] = useState(10);
  const [showRegister, setShowRegister] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    setUser(null);
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
    if (!user) return;

    const params = new URLSearchParams();

    if (search) {
      params.append("title", search);
    }   
    if (mediaType) {
      params.append("media_type", mediaType);
    }  
    if (stateFilter) {
      params.append("state", stateFilter);
    }
    
    params.append("sort_by", sortBy);
    params.append("sort_order", sortOrder);
    params.append("page", page);
    params.append("limit", limit);

    const url = `https://media-tracker-5bc6.onrender.com/media/?${params.toString()}`;

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
  }, [user, search, mediaType, stateFilter, sortBy, sortOrder, page, limit]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("user");
    if (!token || currentUser) return;

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 > Date.now()) {
        setUser(JSON.parse(currentUser));
      } else {
        logout(); 
      }
    } catch (err) {
      console.error("Invalid token");
      logout(); 
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

      {user && (
        <div>
        <span>Welcome, {user.username} </span>

        <button onClick={() => {
          if (window.confirm("Are you sure you want to logout?")) {
            logout();
          }
        }}>
          Logout
        </button>
        </div>
      )}
      </header>
      {user ? (
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
          mediaType={mediaType}
          setMediaType={setMediaType}
          stateFilter={stateFilter}
          setStateFilter={setStateFilter}
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
        onLogin={(userData) => {
          setUser(userData);
        }}
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



