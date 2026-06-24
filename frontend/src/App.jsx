import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import ProtectedRoute from './components/layout/ProtectedRoute';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile/Profile';
import PublicProfile from './pages/Profile/PublicProfile';
import Projects from './pages/Projects';
import Intelligence from './pages/Intelligence';
import Network from './pages/Network';
import Chat from './pages/Chat';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Jobs from './pages/Jobs/Jobs';
import JobDetails from './pages/Jobs/JobDetails';
import MyApplications from './pages/Jobs/MyApplications';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-text flex flex-col">
        <Navbar />
        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><PublicProfile /></ProtectedRoute>} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/intelligence" element={<ProtectedRoute><Intelligence /></ProtectedRoute>} />
            <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
            <Route path="/chat/:id" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
            <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
            <Route path="/jobs/:id" element={<ProtectedRoute><JobDetails /></ProtectedRoute>} />
            <Route path="/applications" element={<ProtectedRoute><MyApplications /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
