import { useEffect, useState } from "react";


function Login({ onLogin, onShowRegister, loginMessage, setStatus }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setStatus(null);
      }, [setStatus]);


    const handleSubmit = async(e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            setStatus(null);

            const response = await fetch("https://media-tracker-5bc6.onrender.com/users/login", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json"
                }, 
                body: JSON.stringify({email, password}), 
            });

            

            if (!response) {
                setStatus({ type: "error", text: "Network error" });
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                console.log(response);
                setStatus({
                  type: "error",
                  text: data.error || "Invalid credentials"
                });
                return;
            }

            if (response.ok && data.data.access_token) {
                localStorage.setItem("token", data.data.access_token);
                localStorage.setItem("user", JSON.stringify(data.data.user));
                onLogin(data.data.user);

                setStatus({ type: "success", text: "Login successful." });
            } 

        } catch (error) {
            console.log()
            console.error("Error logging in:", error);
            setStatus({ type: "error", text: "Something went wrong." })
        } finally {
            setLoading(false);
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
  
       <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
       </button> 

       <p>{loginMessage}</p>

       <button type="button" disabled={loading} onClick={onShowRegister}>
        Create new user
       </button>

      </form>
    );
  }
  
  export default Login;