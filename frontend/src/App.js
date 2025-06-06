import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import InsectTrapMonitor from './InsectTrapMonitor';
import Notify from './pages/Notify';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<InsectTrapMonitor />} />
          <Route path="/notify" element={<Notify />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;//