async function authFetch(url, options = {}, onLogout) {
    const token = localStorage.getItem("token");
  
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (response.status === 401) {
      localStorage.removeItem("token");
      onLogout(); 
      return null;
    }
  
    return response;
  }

export default authFetch;
