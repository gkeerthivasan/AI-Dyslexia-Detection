import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import AccessibilityToolbar from './components/AccessibilityToolbar';

// Pages
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';

// Lazy load pages for better performance
const ReadPage = React.lazy(() => import('./pages/ReadPage'));
const ResumePage = React.lazy(() => import('./pages/ResumePage'));
const ExercisePage = React.lazy(() => import('./pages/ExercisePage'));
const ReportPage = React.lazy(() => import('./pages/ReportPage'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-bg-light">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading...</p>
    </div>
  </div>
);

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <div className="App">
      <Routes>
        {/* Public Route */}
        <Route 
          path="/" 
          element={
            isAuthenticated ? <Navigate to="/home" replace /> : <AuthPage />
          } 
        />
        
        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />
        
        <Route
          path="/read"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-bg-light">
                <Navbar />
                <AccessibilityToolbar />
                <React.Suspense fallback={<PageLoader />}>
                  <ReadPage />
                </React.Suspense>
              </div>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/resume"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-bg-light">
                <Navbar />
                <AccessibilityToolbar />
                <React.Suspense fallback={<PageLoader />}>
                  <ResumePage />
                </React.Suspense>
              </div>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/exercises"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-bg-light">
                <Navbar />
                <AccessibilityToolbar />
                <React.Suspense fallback={<PageLoader />}>
                  <ExercisePage />
                </React.Suspense>
              </div>
            </PrivateRoute>
          }
        />
        
        <Route
          path="/report"
          element={
            <PrivateRoute>
              <div className="min-h-screen bg-bg-light">
                <Navbar />
                <AccessibilityToolbar />
                <React.Suspense fallback={<PageLoader />}>
                  <ReportPage />
                </React.Suspense>
              </div>
            </PrivateRoute>
          }
        />
        
        {/* 404 Route */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center bg-bg-light">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-400 mb-4">404</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Page not found
                </p>
                <a
                  href="/home"
                  className="btn btn-primary"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
