import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeTheme } from "./components/theme-provider";

// Inicializar o tema do cache local o mais cedo possível para evitar flicker
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
