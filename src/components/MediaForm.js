import { useState } from "react";

function MediaForm( {initialData = {}, onSubmit, mode, onCancel } ) {
    const [title, setTitle] = useState(initialData.title ?? "");
    const [mediaType, setType] = useState(initialData.media_type ?? "");
    const [rating, setRating] = useState(initialData.rating ?? "");
    const [state, setState] = useState(initialData.state ?? "");
    const [journal, setJournal] = useState(initialData.journal ?? "");

    const handleSubmit = (e) => {
        e.preventDefault();

        const body = {};

        // create mode only
        if (mode === "create") {
            if (!title.trim() || !mediaType.trim()) {
              alert("Title and media type are required");
              return;
            }
        }

        if (title !== "") body.title = title;
        if (mediaType !== "") body.media_type = mediaType;
        if (rating !== "") body.rating = Number(rating);
        if (state !== "") body.state = state;
        if (journal !== "") body.journal = journal;
    
        onSubmit(body); 
    };

    return (
      <form onSubmit={handleSubmit}>
        <h2>{mode === "create" ? "Create Media" : "Edit Media"}</h2> 

        <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        />

        <input
        placeholder="Media Type"
        value={mediaType}
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

        <button type="submit">
            {mode === "create" ? "Add Media" : "Save Changes"}
        </button> 

        {mode === "edit" && (
          <button type="button" onClick={onCancel}>
              Cancel
          </button>
          )}
      </form>
    );
}

export default MediaForm;