import React, { useEffect, useState } from 'react';

function All() {
  const [list, setList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/students')
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setList(data);
      });
  }, []);

  return (
    <div className="bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 min-h-screen flex flex-col items-center justify-start py-6 px-4">
      {/* Header Section */}
      <div className="bg-white shadow-md p-4 rounded-lg w-full max-w-4xl mb-6 flex justify-between items-center">
        <div className="flex space-x-4">
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300">
            All
          </button>
          <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300">
            Requested
          </button>
        </div>
        <input
          type="text"
          placeholder="Search"
          className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-60"
        />
      </div>

      {/* List Section */}
      <div className="bg-white shadow-md p-6 rounded-lg w-full max-w-4xl">
        <div className="flex items-center justify-between bg-blue-100 px-4 py-3 rounded-lg shadow-sm mb-4">
          <div className="flex items-center space-x-4">
            <img
              src="/path/to/image.jpg"
              alt="User"
              className="h-14 w-14 rounded-full border border-gray-200"
            />
            <p className="text-gray-800 font-medium text-lg">Name</p>
          </div>
          <p className="text-gray-600">Email</p>
          <div className="flex space-x-3">
            <button className="bg-white text-blue-500 px-6 py-2 rounded-full hover:bg-gray-100 transition duration-300 border border-gray-300">
              Instagram
            </button>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default All;
