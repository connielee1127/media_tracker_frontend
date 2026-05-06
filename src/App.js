import { useEffect, useState } from "react";
import Login from "./components/Login";
import MediaList from "./components/MediaList";
import MediaForm from "./components/MediaForm";
import authFetch from "./utils/authFetch";


function App() {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [editingMedia, setEditingMedia] = useState(null);


  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMedia([]);
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

    const fetchMedia = async () => {
      const response = await authFetch(
        "https://media-tracker-5bc6.onrender.com/media/",
        {},
        logout
      );
    
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
  }, [isLoggedIn]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
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
      <h1>Media Tracker</h1>
      {isLoggedIn ? (
      <>
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

        {error && <p>{error}</p>}
        {message && <p>{message}</p>}

        {<MediaList 
          media={media} 
          onDelete={handleDelete} 
          onEdit={handleEdit}
          editingMedia={editingMedia}
          onUpdate={handleUpdate}
        />}
      </>
    ) : (
      <Login onLogin={() => setIsLoggedIn(true)} />
    )}
    </div>
  );
}

export default App;



