/*import axios from "axios";

const BASE_URL = "https://backend-project-sa6b.onrender.com/";

// LOGIN API
export const loginUser = async (data) => {
  // 🔹 Dummy (abhi ke liye)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, user: data });
    }, 1000);
  });

  // 🔹 FUTURE (backend ke liye)
  // return axios.post(${BASE_URL}/login, data);
};*/

import axios from "axios";

const BASE_URL = "https://backend-project-sa6b.onrender.com";

// ✅ TEST API
export const testAPI = () => {
  return axios.get(BASE_URL + "/");
};

// ✅ LOGIN (dummy)
export const loginUser = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        user: data,
      });
    }, 1000);
  });
};