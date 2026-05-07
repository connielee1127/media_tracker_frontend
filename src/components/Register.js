import {useState} from "react";

function Register({ onClose, setLoginMessage }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        const response = await fetch("https://media-tracker-5bc6.onrender.com/users/register", {
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
      
        const data = await response.json();
      
        if (response.ok) {
          setLoginMessage("Account created! Please log in.");
          setUsername("");
          setEmail("");
          setPassword("");

          onClose(); 
        } else {
          setMessage(data.error || "Failed to register.");
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

      <p>{message}</p>

        <button onClick={onClose}>Close</button>
      </div>
    );
  }

  export default Register;