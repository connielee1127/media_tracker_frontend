import { useState } from "react";

function CreateMedia() {
    const [title, setTitle] = useState("");
    const [media_type, setType] = useState("");
    const [rating, setRating] = useState("");
    const [state, setState] = useState("");
    const [journal, setJournal] = useState("");
    const [message, setMessage] = useState("");

    const body = {
        title,
        media_type,
    };

    if (rating !== "") body.rating = Number(rating);
    if (state !== "") body.state = state;
    if (journal !== "") body.journal = journal;


    const resetForm = () => {
        setTitle("");
        setType("");
        setRating("");
        setState("");
        setJournal("");
      };

    const handleSubmit = async (e) => {
        e.preventDefault(); 

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("https://media-tracker-5bc6.onrender.com/media/", {
                method: "POST", 
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(body)
            }); 

            const data = await response.json();

            if (response.ok) {
                setMessage("Media created successfully!");
                resetForm();
            } else {
                setMessage(data.message || "Failed to create media");
            }
        
        } catch (error) {
            console.error(error);
            setMessage("Something went wrong");
        }     
    };

    return (
      <form onSubmit={handleSubmit}>
        <h2>Create Media</h2> 

        <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />

        <input
        placeholder="Media Type"
        value={media_type}
        onChange={(e) => setType(e.target.value)}
        />

        <input
        placeholder="Rating (optional) "
        value={rating}
        onChange={(e) => setRating(e.target.value)}
        />  

        <input
        placeholder="State (optional)"
        value={state}
        onChange={(e) => setState(e.target.value)}
        />

        <input
        placeholder="Journal (optional)"
        value={journal}
        onChange={(e) => setJournal(e.target.value)}
        />

        <button type="submit">Add Media</button>

        <p>{message}</p>  
      </form>
    );
}

export default CreateMedia