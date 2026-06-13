import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import Login from './pages/Login';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<div>Register Coming Soon</div>} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <div>Dashboard Coming Soon</div>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default App;