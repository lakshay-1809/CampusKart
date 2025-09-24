import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Contact  from "./pages/Contact";
import About  from "./pages/About";

const App = () => {
    return (
        <Router>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/contact" element={<Contact />}></Route>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
