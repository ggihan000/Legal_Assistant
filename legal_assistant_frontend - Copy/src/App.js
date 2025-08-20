// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/NavBar/NavBar';
import Landing from './pages/Landing';
import Home from './pages/Home';
import Chat from './pages/ChatPage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

// Layout component with Navbar at top
const Layout = ({ children }) => (
  <div className="app-layout">
    <Navbar />
    
    <div className="content-container">
      {children}
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* All routes wrapped with Layout that includes Navbar */}
        <Route path="/" element={
          <Layout>
            <Landing />
          </Layout>
        } />
        
        <Route path="/home" element={
          <Layout>
              <Home />
          </Layout>
        } />

        <Route path="/chat" element={
          <Layout>
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          </Layout>
        } />
        
        <Route path="/login" element={
          <Layout>
            <Login />
          </Layout>
        } />
        
        <Route path="/register" element={
          <Layout>
            <Register />
          </Layout>
        } />
      </Routes>
    </Router>
  );
}

export default App;