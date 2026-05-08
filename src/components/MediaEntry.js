import MediaForm from "./MediaForm";
import { MEDIA_TYPE_LABEL_MAP, STATE_LABEL_MAP } from "../constants/filterOptions";


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
            <p><strong>Type:</strong> {MEDIA_TYPE_LABEL_MAP[item.media_type]}</p>
            <p><strong>Rating:</strong> {item.rating}</p>
            <p><strong>State:</strong> {STATE_LABEL_MAP[item.state]}</p>
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