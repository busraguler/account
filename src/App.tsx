import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import { Create } from "./screens/Account/Create";
import { List } from "./screens/Account/List";

function App() {
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/" element={<List />}></Route>
          <Route path="/new-account" element={<Create />}></Route>
        </Routes>
      </Router>
    </React.StrictMode>
  );
}

export default App;
