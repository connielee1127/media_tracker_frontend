import MediaEntry from "./MediaEntry";

function MediaList({ media, onDelete, onEdit, editingMedia, onUpdate }) {
  if (!media || media.length === 0) {
    return <p>No media yet</p>;
  }

  return (
    <div>
      {media.map(item => (
        <MediaEntry
          key={item.id}
          item={item}
          onDelete={onDelete}
          onEdit={onEdit}
          editingMedia={editingMedia}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default MediaList;