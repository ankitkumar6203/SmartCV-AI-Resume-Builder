const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api/auth";

// Common fetch helper with JWT auto attach
const fetchAPI = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    // Try parsing JSON, but don't crash if it's plain text
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      // Auto-logout on 401
      if (res.status === 401) {
        localStorage.removeItem("token");
      }
      throw new Error(data?.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err) {
    console.error("API error:", err.message);
    throw err;
  }
};

// ✅ Register API
export const registerUser = (userData) =>
  fetchAPI(`${API_BASE}/register`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

// ✅ Login API
export const loginUser = async (email, password) => {
  const data = await fetchAPI(`${API_BASE}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  // Save token if login successful
  if (data?.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
};

// ✅ Logout API (frontend only)
export const logoutUser = () => {
  localStorage.removeItem("token");
};
