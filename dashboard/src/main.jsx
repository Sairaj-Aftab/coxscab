import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/router.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </StrictMode>
);
