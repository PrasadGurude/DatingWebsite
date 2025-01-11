import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-pink-500 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src="/path/to/logo.png" alt="Logo" className="h-10 mr-4" />
        <nav className="flex space-x-4">
          <Link to="/home" className="hover:text-pink-200">Home</Link>
          <Link to="/about" className="hover:text-pink-200">About</Link>
          <Link to="/all-students" className="hover:text-pink-200">All Students</Link>
        </nav>
      </div>
      <div className="flex items-center">
        <Link to="/profile" className="hover:text-pink-200 mr-4">Profile</Link>
        <img src="/path/to/profile-image.jpg" alt="Profile" className="h-10 w-10 rounded-full" />
      </div>
    </header>
  );
};

export default Header;