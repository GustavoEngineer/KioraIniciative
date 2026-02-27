import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './modules/main/components/Layout';
import FirstView from './modules/main/FirstView';
import AuthView from './modules/main/submodules/auth/authview';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<FirstView />} />
          <Route path="auth" element={<AuthView />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
