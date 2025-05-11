import { HashRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import AvalibleInitiatives from "./pages/AvalibleInitiatives";
import MyInitiatives from "./pages/MyInitiatives";
import About from "./pages/About";
import "./assets/styles/style.css";

import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';  


export default function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/available_initiatives" element={<AvalibleInitiatives />} />
          <Route path="/my_initiatives" element={<MyInitiatives />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer />
        
      </Router>
    </>
  );
}