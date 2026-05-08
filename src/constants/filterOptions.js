export const STATE_OPTIONS = [
    { label: "In Progress", value: "in_progress" },
    { label: "Finished", value: "finished" },
    { label: "Planned", value: "planned" }
  ];
  
export const MEDIA_TYPE_OPTIONS = [
    { label: "Movie", value: "movie" },
    { label: "Book", value: "book" },
    { label: "Music", value: "music" }
  ];

export const STATE_LABEL_MAP = Object.fromEntries(
    STATE_OPTIONS.map(opt => [opt.value, opt.label])
);

export const MEDIA_TYPE_LABEL_MAP = Object.fromEntries(
    MEDIA_TYPE_OPTIONS.map(opt => [opt.value, opt.label])
);