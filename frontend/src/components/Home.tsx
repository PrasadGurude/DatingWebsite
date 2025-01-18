import React, { useState } from 'react';
import home from '../assets/home.avif';
import { GoogleLogin } from '@react-oauth/google';


interface HomeProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated, setIsAuthenticated }) => {


  return (
    <div className="bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100  flex items-center justify-center p-8">
      <div className="bg-pink-600 bg-opacity-50 p-8 rounded-lg shadow-2xl text-center max-w-md">
        <h1 className="text-4xl font-bold text-white mb-3">Welcome to Our Dating App</h1>
        {isAuthenticated ? <p className="text-lg text-white mb-3">Find your perfect match today!</p> : <p className="text-lg text-white mb-3">Login with GHRCEM college email ID</p> }
        <img src={home} alt="Home" className="w-full h-64 object-cover rounded-lg mb-3" />
        <button className="bg-zinc-400  text-white px-6 py-2 rounded-full hover:bg-pink-700 transition duration-300">
          <GoogleLogin onSuccess={cred => {
            fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${cred.credential}`)
              .then(res => res.json())
              .then(async data => {
                console.log(data)
                if (data.email && data.email.endsWith('@ghrcem.raisoni.net')) {
                  fetch(`http://localhost:8787/api/signup`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      email: data.email,
                      name: data.name,
                      picture: data.picture
                    })
                  })
                    .then(res => res.json())
                    .then(data => {
                      console.log(data)
                      if (data.success) {
                        localStorage.setItem('token', data.token)
                        setIsAuthenticated(true)
                      }
                    })
                }
              })
          }} />
        </button>
      </div>
    </div>
  );
}

export default Home;