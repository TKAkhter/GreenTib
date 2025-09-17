import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import "./index.css";
import store from "./redux/store";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
import "react-phone-number-input/style.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" attribute="class">
      <Provider store={store}>
        <Toaster richColors />
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
);
