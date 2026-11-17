import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./App.css";
import { resetProgressOnDevServerRestart } from "./devBootReset.js";

// Must run before App renders: if `npm run dev` was restarted since this
// page last loaded, this wipes all pybe_* localStorage keys so the
// learner starts over. A plain browser refresh in the same dev session
// leaves everything untouched. See devBootReset.js for details.
resetProgressOnDevServerRestart();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);