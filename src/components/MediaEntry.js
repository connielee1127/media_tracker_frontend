import MediaForm from "./MediaForm";


function MediaEntry({ item, onDelete, onEdit, editingMedia, onUpdate }) {
    const isEditing = editingMedia?.id === item.id;

    return (
      <div>
        {isEditing ? (
          <MediaForm
              mode="edit"
              initialData={item}
              onSubmit={(body) => onUpdate(item.id, body)}
              onCancel={() => onEdit(null)}
          />
        ) : (
          <>
            <p><strong>Title:</strong> {item.title}</p>
            <p><strong>Type:</strong> {item.media_type}</p>
            <p><strong>Rating:</strong> {item.rating}</p>
            <p><strong>State:</strong> {item.state}</p>
            <p><strong>Journal:</strong> {item.journal}</p>

            <button onClick={() => onDelete(item.id)}>Delete</button>
            <button onClick={() => onEdit(item)}>Edit</button>

            <hr /> 
          </>
        )};
      </div>
    );
}

export default MediaEntry;