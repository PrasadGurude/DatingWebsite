import React from 'react';
import home from '../assets/home.avif';

function Home() {
  return (
    <div className="bg-gradient-to-r from-purple-500 to-pink-500  flex items-center justify-center p-8">
      <div className="bg-white bg-opacity-50 p-8 rounded-lg shadow-2xl text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-3">Welcome to Our Dating App</h1>
        <p className="text-lg text-white mb-3">Find your perfect match today!</p>
        <img src={home} alt="Home" className="w-full h-64 object-cover rounded-lg mb-3" />
        <button className="bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition duration-300">
          Get Started
        </button>
      </div>
    </div>
  );
}

export default Home;