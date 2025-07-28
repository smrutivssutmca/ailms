import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Navbar from './components/Navbar';
import UserAnalytics from './pages/UserAnalytics';

function App() {
  // TODO: Replace with real user state from context/auth
  const user = null;
  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/quiz" element={<Quiz />} />
        <Route path="/user-analytics" element={<UserAnalytics />} />
      </Routes>
    </Router>
  );
}

export default App;
