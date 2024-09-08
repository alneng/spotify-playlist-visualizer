import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Hero from "../pages/Hero";
import Explore from "../pages/Explore";
import NotFound from "../pages/NotFound";
import About from "../pages/About";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
