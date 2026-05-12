import axios from "axios";

const test = async () => {
  try {
    const api = axios.create({ baseURL: "http://localhost:4000/api", withCredentials: true });
    let cookies = "";
    api.interceptors.request.use((config) => {
      if (cookies) config.headers.Cookie = cookies;
      return config;
    });
    api.interceptors.response.use((res) => {
      if (res.headers["set-cookie"]) {
        cookies = res.headers["set-cookie"].join("; ");
      }
      return res;
    });

    const loginRes = await api.post("/auth/login", { email: "luis@sportify.com", password: "123456" });
    console.log("Login response:", Object.keys(loginRes.data));

    const res = await api.get("/reservas/mis-reservas");
    console.log("Reservas response keys:", Object.keys(res.data));
    console.log("Is reservas array?", Array.isArray(res.data.reservas));
    if (res.data.reservas) {
      console.log("Num reservas:", res.data.reservas.length);
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
};

test();
