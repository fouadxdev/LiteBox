const API_URL = "http://localhost:3000/api/health";

export const fetchBackend = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    const data = await response.json();
    console.log(data);
  } catch (e) {
    console.error("connection failed", e);
  }
};
