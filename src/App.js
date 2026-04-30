import { useEffect, useState } from "react";
import Login from "./Login"



function App() {
  const [media, setMedia] = useState([]);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetch("https://media-tracker-5bc6.onrender.com/media/", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      const mediaData = data?.data?.media;
      let mediaArray = [];

      if (Array.isArray(mediaData)) {
        mediaArray = mediaData;
      } else if (mediaData) {
        mediaArray = [mediaData];
      }
      setMedia(mediaArray);
    }).catch(err => {
      console.error(err);
      setError("Failed to fetch data");
    });
  }, []);

  return (
    <div> 
      <h1>Media Tracker</h1>
      <Login />

      {error && <p>{error}</p>}

      {media.map(item => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}

export default App;



