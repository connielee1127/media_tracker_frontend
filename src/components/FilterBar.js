function FilterBar({
    search,
    setSearch,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    limit,
    setLimit,
    onApplyFilters
  }) {
    return (
      <div>
  
        {/* SEARCH */}
        <input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
  
        {/* SORT BY */}
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="created_at">Created At</option>
          <option value="title">Title</option>
          <option value="rating">Rating</option>
          <option value="media_type">Media Type</option>
        </select>
  
        {/* SORT ORDER */}
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
  
        {/* LIMIT */}
        <input
            type="number"
            min="1"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            />
  
        {/* APPLY BUTTON */}
        <button onClick={onApplyFilters}>
          Apply
        </button>
  
        {/* PAGINATION */}
        <button onClick={() => setPage(p => Math.max(p - 1, 1))}>
          Prev
        </button>
  
        <span> Page {page} </span>
  
        <button onClick={() => setPage(p => p + 1)}>
          Next
        </button>
  
      </div>
    );
  }
  
  export default FilterBar;