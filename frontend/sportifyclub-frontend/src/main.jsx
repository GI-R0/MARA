import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      closeOnClick
      pauseOnHover
      newestOnTop
      theme="colored"
    />
  </React.StrictMode>,
);
