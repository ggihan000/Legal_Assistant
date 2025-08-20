import { Outlet } from 'react-router-dom';
import NavBar from './components/NavBar/NavBar';

export default function LayoutWithNavbar() {
  return (
    <div className="layout">
      <NavBar />
      <main className="content">
        {/* This will render either <Landing> or <Home> */}
        <Outlet />
      </main>
    </div>
  );
}