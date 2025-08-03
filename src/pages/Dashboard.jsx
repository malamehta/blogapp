// src/pages/Dashboard.jsx
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Welcome back, {user?.email}!</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      
      <main className="dashboard-content">
         all blog
      </main>
    </div>
  );
};

export default Dashboard;
