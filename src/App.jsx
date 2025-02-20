import React from "react";
import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";  
import Welcome from "./Welcome";
import SlotMachine from "./SlotMachine";
import Blackjack from "./Blackjack";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="content"> {/* Add class to avoid overlap */}
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/slot-machine" element={<SlotMachine />} />
          <Route path="/blackjack" element={<Blackjack />} />
          <Route path="*" element={<Navigate to="/blackjack" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
