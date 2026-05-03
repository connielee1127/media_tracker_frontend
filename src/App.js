import { useEffect, useState } from "react";
import Login from "./components/Login"
import CreateMedia from "./components/CreateMedia"

async function authFetch(url, options = {}, onLogout) {
  const token = localStorage.getItem("token");

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    onLogout(); 
    return null;
  }

  return response;
}

function App() {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchMedia = async () => {
      const response = await authFetch(
        "https://media-tracker-5bc6.onrender.com/media/",
        {},
        () => setIsLoggedIn(false)
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

  return (
    <div> 
      <h1>Media Tracker</h1>
      {isLoggedIn ? (
      <>
        <CreateMedia />

        {error && <p>{error}</p>}

        {media.map(item => (
          <div key={item.id}>
            <p><strong>Title:</strong> {item.title}</p>
            <p><strong>Type:</strong> {item.media_type}</p>
            <p><strong>Rating:</strong> {item.rating}</p>
            <p><strong>State:</strong> {item.state}</p>
            <p><strong>Journal:</strong> {item.journal}</p>
            <hr /> 
          </div>
        ))}
      </>
    ) : (
      <Login onLogin={() => setIsLoggedIn(true)} />
    )}
    </div>
  );
}

export default App;



