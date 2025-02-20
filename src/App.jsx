import React from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";  
import Welcome from "./Welcome";
import SlotMachine from "./SlotMachine";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="content"> {/* Add class to avoid overlap */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/slot-machine" element={<SlotMachine />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
