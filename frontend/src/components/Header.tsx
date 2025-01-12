import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg'

interface HeaderProps {
  status: boolean;
}

const Header: React.FC<HeaderProps> = ({status}) => {
  return (
    <header className="bg-pink-500 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 mr-4 rounded-lg" />
        <nav className="flex space-x-4">
          <Link to="/home" className="hover:text-pink-200">Home</Link>
          <Link to="/about" className="hover:text-pink-200">About</Link>
          <Link to="/all-students" className="hover:text-pink-200">All Students</Link>
          <Link to="/profile" className="hover:text-pink-200 mr-4">Profile</Link>
        </nav>
      </div>
      <div className="flex items-center">
        <div className=''>
          <Link to="/login" className="hover:text-pink-200">Login or singup</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;