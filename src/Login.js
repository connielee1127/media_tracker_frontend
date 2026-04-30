import {useState} from "react";


function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

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
                setMessage("Login successful.");
            } else {
                setMessage("Invalid credentials");
            }
        } catch (error) {
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
      </form>
    );
  }
  
  export default Login;