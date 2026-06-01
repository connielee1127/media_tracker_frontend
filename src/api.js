const BASE_URL = process.env.REACT_APP_API_URL;

export const API = {
  auth: `${BASE_URL}/users`,
  media: `${BASE_URL}/media`,
};

export default BASE_URL;