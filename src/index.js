import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LangProvider } from "./context/langContext";
import MyListProvider from "./context/MyListContext";

ReactDOM.render(
  <LangProvider>
    <MyListProvider>
      <App />
    </MyListProvider>
  </LangProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
