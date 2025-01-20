import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg'
interface HeaderProps {
  isAuthenticated: boolean;
}

const Header: React.FC<HeaderProps> = ({ isAuthenticated }) => {
 
  return (
    <header className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 flex justify-between items-center shadow-lg rounded-md mb-4">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 mr-4 rounded-lg" />
        <nav className="flex space-x-6">
          <Link to="/home" className="hover:text-pink-200 transition duration-300">Home</Link>
          <Link to="/all-students" className="hover:text-pink-200 transition duration-300">All Students</Link>
          <Link to="/profile" className="hover:text-pink-200 transition duration-300 mr-4">Profile</Link>
          <Link to="/about" className="hover:text-pink-200 transition duration-300">About</Link>
        </nav>
      </div>
      <div className="flex items-center">        
       { isAuthenticated
        ? <button
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/home';
          }} 
        className="hover:text-pink-200 bg-red-400 p-2 rounded-xl hover:bg-red-500 transition duration-300 mr-4"> LogOut  
        </button>
        : null}
      </div>
    </header>
  );
};

export default Header;