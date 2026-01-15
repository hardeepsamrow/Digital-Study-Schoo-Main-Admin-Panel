import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import App from "./Routes";

import { createTheme, ThemeProvider } from "@mui/material";
const theme = createTheme({
  palette: {
    primary: {
      main: "#283618",
    },
    secondary: {
      main: "#283618",
    },
  },
  typography: {
    fontFamily: "Outfit",
    fontWeightLight: 300,
    fontWeightRegular: 500,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    htmlFontSize: 16,
    fontSize: 14,
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
// Deployment trigger: 2026-01-14T13:06:00
