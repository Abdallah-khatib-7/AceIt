import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import CvReview from './pages/CvReview';
import Interview from './pages/Interview';
import Quiz from './pages/Quiz';
import Roadmap from './pages/Roadmap';
import Reports from './pages/Reports';


const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
  <ProtectedRoute>
    <Settings />
  </ProtectedRoute>
} />
<Route path="/cv" element={
  <ProtectedRoute>
    <CvReview />
  </ProtectedRoute>
} />
<Route path="/interview" element={
  <ProtectedRoute>
    <Interview />
  </ProtectedRoute>
} />

<Route path="/quiz" element={
  <ProtectedRoute>
    <Quiz />
  </ProtectedRoute>
} />

<Route path="/roadmap" element={
  <ProtectedRoute>
    <Roadmap />
  </ProtectedRoute>
} />

<Route path="/reports" element={
  <ProtectedRoute>
    <Reports />
  </ProtectedRoute>
} />
    </Routes>
       
    
  );
}

export default App;