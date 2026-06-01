import {useState, useEffect} from "react";
import { API } from "../api";

function Register({ onClose, setLoginMessage, setStatus }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
            setStatus(null);
          }, [setStatus]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setStatus(null);

            const response = await fetch(`${API.BASE_URL.media}/register`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  username,
                  email,
                  password
                })
            });

            if (!response) {
                setStatus({ type: "error", text: "Network error" });
                return;
            }

            const data = await response.json();
            console.log(data)

            if (!response.ok) {
                setStatus({
                  type: "error",
                  text: data.error || "Invalid input"
                });
                return;
            }
      
            if (response.ok) {
                setLoginMessage("Account created! Please log in.");
                setUsername("");
                setEmail("");
                setPassword("");
        
                onClose(); 
                setStatus({
                    type: "success",
                    text: ""
                  });
            }
        } catch (error) {
            console.error("Error logging in:", error);
            setStatus({ type: "error", text: "Something went wrong." })
        }
    };

    return (
      <div className="modal">
        <h2>Create Account</h2>
  
        <form onSubmit={handleSubmit}>
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Register</button>
      </form>

        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  export default Register;