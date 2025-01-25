import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  picture: string;
  engYear: number;
  branch: string;
  gender: string;
  insta_id: string;
  matchId: string;
  matchStatus: string;
}

const MatchStatus: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false)


  useEffect(() => {
    // Fetch match data from the server
    setLoading(true)
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/status`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setUser(data.user);
        setPopupMessage(data.message);
        setLoading(false)
        setTimeout(() => setPopupMessage(null), 3000);
      })
      .catch(error => {
        console.error('Error fetching match data:', error);
        setPopupMessage('Failed to fetch match data');
        setTimeout(() => setPopupMessage(null), 3000);
      });
  }, []);

  if (loading) {
    return <h1 className="text-2xl text-center mt-4">Loading...</h1>
  }

  return (
    <div className="bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 flex items-center justify-center p-8 min-h-screen">
      {popupMessage && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-bounce">
          {popupMessage}
        </div>
      )}
      {user ? (
        <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-2xl text-center max-w-lg w-full">
          <img src={user?.picture} alt={user?.name} className="h-24 w-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{user?.name}</h2>
          <div className="text-left">
            <p className="text-lg text-gray-600 mb-2"><strong>Email:</strong> {user?.email}</p>
            <p className="text-lg text-gray-600 mb-2"><strong>Age:</strong> {user?.age}</p>
            <p className="text-lg text-gray-600 mb-2"><strong>Branch:</strong> {user?.branch}</p>
            <p className="text-lg text-gray-600 mb-2"><strong>Engineering Year:</strong> {user?.engYear}</p>
            <p className="text-lg text-gray-600 mb-2"><strong>Gender:</strong> {user?.gender}</p>
            <p className="text-lg text-gray-600 mb-2"><strong>Instagram:</strong> <a href={`${user?.insta_id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500">{user?.insta_id}</a></p>
          </div>
        </div>
      ) : (
        <div className="bg-white bg-opacity-75 p-8 rounded-lg shadow-2xl text-center max-w-lg w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">No match found</h2>
          <p className="text-lg text-gray-600 mb-2">Please check back later.</p>
        </div>
      )}
    </div>
  );
};

export default MatchStatus;