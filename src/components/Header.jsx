// src/components/Header.jsx
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import '../assets/scss/components/_header.scss';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <header className="dashboard-header">
      <div className="dashboard-title">
        <h1 className="dashboard-title__heading">Dashboard</h1>
        <p className="dashboard-title__subtitle">Welcome back, {user?.email}!</p>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </header>
  );
};

export default Header;
