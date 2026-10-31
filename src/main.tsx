import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Global uncaught error handler to prevent blank white screens
window.addEventListener("error", (event) => {
  console.error("Unhandled Global Error captured:", event.error);
  const rootEl = document.getElementById("root");
  if (rootEl && (!rootEl.innerHTML || rootEl.innerHTML.trim() === "")) {
    rootEl.innerHTML = `
      <div style="min-height: 100vh; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; font-family: sans-serif; padding: 20px;">
        <div style="max-width: 480px; width: 100%; background: #1e293b; border: 1px solid #334155; padding: 24px; border-radius: 16px; text-align: center;">
          <div style="font-size: 36px; margin-bottom: 12px;">⚠️</div>
          <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 8px;">Workspace Restored</h2>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 16px;">
            A UI rendering interruption was caught. Your billing data and catalog are safely preserved.
          </p>
          <button onclick="window.location.reload()" style="background: #059669; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 10px; cursor: pointer; font-size: 13px;">
            Reload Dashboard
          </button>
        </div>
      </div>
    `;
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
