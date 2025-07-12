import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { store } from "./redux/store";

import Navbar from "./components/Navbar";
import AppRoutes from "./routes";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="app">
          <Navbar />
          <ToastContainer position="top-right" />
          <AppRoutes />
        </div>
      </Router>
    </Provider>
  );
}

export default App;
