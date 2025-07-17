import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { GlobalStyles } from '@mui/material';

import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import ProjectsPage from './pages/ProjectsPage';
import ResultPage from './pages/ResultPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import Header from './components/Layout/Header';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { overlordTheme, overlordKeyframes } from './theme/overlordTheme';
import './i18n/i18n';

function App() {
  return (
    <ThemeProvider theme={overlordTheme}>
      <CssBaseline />
      <GlobalStyles styles={overlordKeyframes} />
      <Router>
        <AuthProvider>
          <div className="App">
            <Header />
            <Routes>
              {/* 公开路由 */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* 受保护的路由 */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
              <Route path="/projects" element={
                <ProtectedRoute>
                  <ProjectsPage />
                </ProtectedRoute>
              } />
              <Route path="/project/new" element={
                <ProtectedRoute>
                  <ProjectPage />
                </ProtectedRoute>
              } />
              <Route path="/project/:id" element={
                <ProtectedRoute>
                  <ProjectPage />
                </ProtectedRoute>
              } />
              <Route path="/result/:id" element={
                <ProtectedRoute>
                  <ResultPage />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;