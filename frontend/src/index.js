import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./bootstrap.min.css";
import "./index.css";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="550114038806-0bh8bjlpetsde72imj7jehpe70v9t4m1.apps.googleusercontent.com">
    <Provider store={store}>
      <App />
    </Provider>
  </GoogleOAuthProvider>
);
