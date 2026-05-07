import { useEffect, useState } from "react";


function Login({ onLogin, onShowRegister, loginMessage }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        setMessage("");
      }, []);

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("https://media-tracker-5bc6.onrender.com/users/login", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({email, password}), 
            });

            const data = await response.json();

            if (data.data.access_token) {
                localStorage.setItem("token", data.data.access_token);
                onLogin();
                setMessage("Login successful.");
            } else {
                setMessage("Invalid credentials");
            }
        } catch (error) {
            console.log()
            console.error("Error logging in:", error);
            setMessage("Something went wrong");
        }
    };
  
    return (
      <form onSubmit={handleSubmit}>
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
  
       <button type="submit">Login</button> 

       <p>{message}</p>
       <p>{loginMessage}</p>

       <button type="button" onClick={onShowRegister}>
        Create new user
       </button>
      </form>
    );
  }
  
  export default Login;