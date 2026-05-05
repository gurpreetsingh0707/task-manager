import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b px-6 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        📋 ProjectHub
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/" className="text-sm text-gray-600 hover:text-indigo-600">Dashboard</Link>
        <Link to="/projects" className="text-sm text-gray-600 hover:text-indigo-600">Projects</Link>
        <Link to="/tasks" className="text-sm text-gray-600 hover:text-indigo-600">Tasks</Link>

        <div className="flex items-center gap-2 ml-4">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">
            {getInitials(user?.name)}
          </div>
          <span className="text-sm text-gray-700 hidden sm:block">{user?.name}</span>
          <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 ml-1">
            <FiLogOut size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
}