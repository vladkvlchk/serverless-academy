import React from "react";
import styles from "./App.module.scss";
import Home from "./pages/Home";
import { Route, Routes } from "react-router-dom";
import Features from "./pages/Features";
import Company from "./pages/Company";

function App() {
  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/features" element={<Features />} />
        <Route path="/company" element={<Company />} />
      </Routes>
    </div>
  );
}

export default App;
