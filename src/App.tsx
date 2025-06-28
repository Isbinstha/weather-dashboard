import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Data from './frontend/Data/data';
import Home from './frontend/Home/home';
import { SidebarProvider } from './components/ui/sidebar';

const App: React.FC = () => {
  return (
    <SidebarProvider>
      <Router>
        <div className="flex min-h-screen">
          <Sidebar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/data" element={<Data />} />
            </Routes>
        </div>
      </Router>
    </SidebarProvider>
  );
};

export default App;