import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { API } from "./api";
import Login from "./components/Login";
import MediaList from "./components/MediaList";
import MediaForm from "./components/MediaForm";
import authFetch from "./utils/authFetch";
import FilterBar from "./components/FilterBar";
import Register from "./components/Register"


function App() {
  const [media, setMedia] = useState([]);
  const [status, setStatus] = useState(null);
  const [user, setUser] = useState(null);
  const [editingMedia, setEditingMedia] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("title");
  const [mediaType, setMediaType] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); 
  const [limit, setLimit] = useState(10);
  const [showRegister, setShowRegister] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");

  
  const getStatusText = (status) => {
    if (!status) return "";
  
    return status.type === "error"
      ? `Error: ${status.text}`
      : status.text;
  };

  // logout of current user session
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user")
    setUser(null);
    setMedia([]);
    setPage(1);
    setLimit(10);
    setPagination(null);

    setEditingMedia(null);

    setSearch("");
    setSortBy("title");
    setSortOrder("asc");
  };
  
  // Delete media entry
  const handleDelete = async (id) => {
    try {
      setStatus(null);

      const response = await authFetch(
        `${API.media}/${id}`,
        { method: "DELETE" },
        logout
      );

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          text: data.error || "Failed to delete"
        });
        return;
      }

      if (response.ok) {
        setMedia(prev => prev.filter(item => item.id !== id));
        setStatus({ 
          type: "success", 
          text: data.message || "Deleted successfully" 
        });
      }
       
    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        setStatus({
          type: "error",
          text: "Your session has expired. Please log in again."
        });
    
        return;
      }
      console.error(err);
      setStatus({
        type: "error",
        text: "Something went wrong"
      });
    }

  };

  const handleEdit = (item) => {
    setEditingMedia(item);
  };


// Update media entry
  const handleUpdate = async (id, body) => {
    try {
      setStatus(null);

      const response = await authFetch(
        `${API.media}/${id}`,
        {
          method: "PUT", // or PATCH depending on backend
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
        logout
      );

      const data = await response.json();

      if (!response.ok) {
        setStatus({
          type: "error",
          text: data.error || "Failed to update"
        });
        return;
      }

      if (response.ok) {

        setMedia(prev =>
          prev.map(item =>
            item.id === id ? data.data.media : item
          )
        );
        
        setStatus({
          type: "success", 
          text: data.message || "Edited succesffully" 
        })
  
        setEditingMedia(null); 
      }

    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        setStatus({
          type: "error",
          text: "Your session has expired. Please log in again."
        });
    
        return;
      }
      console.error(err);
      setStatus({
        type: "error",
        text: "Something went wrong"
      });
    }
  };


// Get all media entries
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

    const url = `${API.media}/?${params.toString()}`;

    const fetchMedia = async () => {
    try {
      const response = await authFetch(url,{},logout);
      const data = await response.json();

      const mediaData = data?.data?.media;
      let mediaArray = [];

      if (Array.isArray(mediaData)) {
        mediaArray = mediaData;
      } else if (mediaData) {
        mediaArray = [mediaData];
      }

      setMedia(mediaArray);
      setPagination(data.data.pagination);
    } catch (err) {
      if (err.message === "SESSION_EXPIRED") {
        setStatus({
          type: "error",
          text: "Your session has expired. Please log in again."
        });
    
        return;
      }
      console.error(err);

      setStatus({
        type: "error",
        text: "Something went wrong"
      });
    }
    };
    fetchMedia();
  }, [user, search, mediaType, stateFilter, sortBy, sortOrder, page, limit]);

  // User authentication - validate current session's token
  useEffect(() => {
    const token = localStorage.getItem("token");
    const currentUser = localStorage.getItem("user");

    if (!token || !currentUser) return;

    try {
      const decoded = jwtDecode(token);

      if (decoded.exp * 1000 > Date.now()) {
        setUser(JSON.parse(currentUser));

      } else {
        logout(); 

        setStatus({
          type: "error",
          text: "Your session has expired. Please log in again."
        });
      }
    } catch (err) {
      console.error("Invalid token");
      logout(); 

      setStatus({
        type: "error",
        text: "Session error. Please log in again."
      });
    }
  }, []);

  // Clear status message after a while 
  useEffect(() => {
    if (!status) return;

    const timeout = status.type === "error" ? 5000 : 3000;
  
    const timer = setTimeout(() => {
      setStatus(null);
    }, timeout); 
  
    return () => clearTimeout(timer);
  }, [status]);

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

      {status && <p className={status.type}>{getStatusText(status)}</p>}

      {user ? (
      <>
        <MediaForm
          mode="create"
          onSubmit={async (body) => {
            try {
              setStatus(null);
              const response = await authFetch(
                `${API.media}/`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(body),
                },
                logout
              );
          
              const data = await response.json();
          
              if (!response.ok) {
                setStatus({
                  type: "error",
                  text: data.error || "Failed to create media"
                });
                return;
              }

              if (response.ok) {
                setMedia(prev => [...prev, data.data.media]);
                setStatus({
                  type: "success",
                  text: data.message || "Successfully created media"
                });
              }
            } catch (err) {
              if (err.message === "SESSION_EXPIRED") {
                setStatus({
                  type: "error",
                  text: "Your session has expired. Please log in again."
                });
            
                return;
              }
              console.error(err);

              setStatus({
                type: "error",
                text: "Something went wrong while creating media"
              });
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
          pagination={pagination}
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
        setStatus={setStatus}
       />

      {showRegister && (
        <Register 
          onClose={() => setShowRegister(false)} 
          setLoginMessage={setLoginMessage}
          setStatus={setStatus}
        />
      )}  
      </>
    )}
    </div>
  );
}

export default App;



