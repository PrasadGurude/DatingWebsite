import React, { useState } from 'react';

const Profile: React.FC = () => {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    age: 30,
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    gender: 'Male',
    instaProfile: 'https://instagram.com/johndoe',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = () => {
    setIsEditing(false);
    // Save the updated user information to the server or local storage here
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 min-h-screen flex items-center justify-center p-8">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Profile</h1>
        <div className="text-left">
          <label className="block text-gray-700 mb-2">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="bg-gray-100 p-2 mb-4 rounded-lg">{user.name}</p>
          )}

          <label className="block text-gray-700 mb-2">Email</label>
          <p className="bg-gray-100 p-2 mb-4 rounded-lg">{user.email}</p>

          <label className="block text-gray-700 mb-2">Age</label>
          {isEditing ? (
            <input
              type="number"
              name="age"
              value={user.age}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="bg-gray-100 p-2 mb-4 rounded-lg">{user.age}</p>
          )}

          <label className="block text-gray-700 mb-2">Bio</label>
          {isEditing ? (
            <textarea
              name="bio"
              value={user.bio}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="bg-gray-100 p-2 mb-4 rounded-lg">{user.bio}</p>
          )}

          <label className="block text-gray-700 mb-2">Gender</label>
          {isEditing ? (
            <select
              name="gender"
              value={user.gender}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p className="bg-gray-100 p-2 mb-4 rounded-lg">{user.gender}</p>
          )}

          <label className="block text-gray-700 mb-2">Instagram Profile</label>
          {isEditing ? (
            <input
              type="text"
              name="instaProfile"
              value={user.instaProfile}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <a
              href={user.instaProfile}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 p-2 mb-4 rounded-lg block text-blue-500 hover:text-blue-700 transition duration-300"
            >
              {user.instaProfile}
            </a>
          )}
        </div>
        <button
          onClick={isEditing ? handleSave : handleEditToggle}
          className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 transition duration-300"
        >
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>
    </div>
  );
};

export default Profile;
