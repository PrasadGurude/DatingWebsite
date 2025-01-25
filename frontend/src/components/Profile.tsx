import React, { useEffect, useState } from 'react';

interface ProfileProps {
  isAuthenticated: boolean;
}
interface User {
  name: string;
  email: string;
  picture: string;
  age: number;
  engYear: number;
  branch: string;
  gender: string;
  insta_id: string;
}

const Profile: React.FC<ProfileProps> = ({ isAuthenticated }) => {
  const [user, setUser] = useState<User>({
    name: '',
    email: '',
    age: 18,
    picture: '',
    engYear: 1,
    branch: '',
    gender: "",
    insta_id: ''
  });
  const [popupMessage, setPopupMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false)


  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true)
      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          setUser({ ...user, ...data.user })
          setPopupMessage(data.message);
          setLoading(false)
          setTimeout(() => setPopupMessage(null), 3000);
        })
    }
  }, [isAuthenticated])


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
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(user)
    })
      .then(res => res.json())
      .then(data => {
        setUser({ ...user, ...data.user })
        setPopupMessage(data.message);
        setTimeout(() => setPopupMessage(null), 3000);
      })
    setIsEditing(false);
    // Save the updated user information to the server or local storage here
  };

  if (loading) {
    return <h1 className="text-2xl text-center mt-4">Loading...</h1>
  }

  return (
    <div className="bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 min-h-screen flex items-center justify-center p-8">
      {popupMessage ? (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-bounce">
          {popupMessage}
        </div>
      ) : null}
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg text-center max-w-md w-full">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Profile</h1>
        <img
          src={user.picture}
          alt="Profile"
          className="w-28 h-28 rounded-full mx-auto mb-6"
        />
        <div className="text-left">
          <label className="block text-gray-700 mb-2">Name</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={user.name || ""}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="bg-gray-100 p-2 mb-4 rounded-lg">{user.name}</p>
          )}

          <label className="block text-gray-700 mb-2">Email</label>
          <p className="bg-gray-100 p-2 mb-4 rounded-lg">{user.email}</p>

          <div className="mb-4 flex justify-around">
            <div>
              <label className="block text-gray-700 mb-2">Age</label>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  min={18}
                  max={25}
                  value={user.age}
                  onChange={handleChange}
                  className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="bg-gray-100 p-2 mb-4 rounded-lg w-44">{user.age}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Engineering Year</label>
              {isEditing ? (
                <input
                  type="number"
                  name="engYear"
                  max={4}
                  min={1}
                  value={user.engYear}
                  onChange={handleChange}
                  className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              ) : (
                <p className="bg-gray-100 p-2 mb-4 rounded-lg">{user.engYear}</p>
              )}
            </div>
          </div>

          <label className="block text-gray-700 mb-2">Branch</label>
          {isEditing ? (
            <select
              name="branch"
              value={user.branch}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="CE">Computer Engineering</option>
              <option value="IT">Information & Technology</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="AIML">Artificial Intelligence and Machine Learning</option>
              <option value="AIDS">Artificial Intelligence and Data Science</option>
              <option value="CIVIL">Civil Engineering</option>
              <option value="ME">Mechanical Engineering</option>
              <option value="ENTC">Electronics and Telecommunication Engineering</option>
            </select>
          ) : (
            <p className="bg-gray-100 p-2 mb-4 rounded-lg">{user.branch}</p>
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
            <p className="bg-gray-100 p-2 mb-4 rounded-lg">{user.gender || "select your gender"}</p>
          )}

          <label className="block text-gray-700 mb-2">Instagram Profile</label>
          {isEditing ? (
            <input
              type="text"
              name="insta_id"
              value={user.insta_id}
              onChange={handleChange}
              className="w-full p-2 mb-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <a
              href={user.insta_id}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 p-2 mb-4 rounded-lg block text-blue-500 hover:text-blue-700 transition duration-300"
            >
              {user.insta_id || 'Add Instagram URL'}
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
