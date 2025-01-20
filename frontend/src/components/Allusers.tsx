import React, { useEffect, useState } from 'react'

interface User {
  name: string;
  email: string;
  age: number;
  picture: string;
  engYear: number;
  branch: string;
  gender: string;
  instaProfile: string;
}

interface AllusersProps {
  isAuthenticated: boolean;
  searchList: User[];
}

const Allusers: React.FC<AllusersProps> = ({ isAuthenticated , searchList }) => {

  

  const [list, setList] = useState<User[]>(searchList);
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (isAuthenticated && searchList.length == 0) {
      fetch(`http://localhost:8787/api/all-users/${page}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setList(data.users);
        });
    }
  }, [page]);

  return (
    <div>
      {/* List Section */}
      <div className="bg-white shadow-md p-2 rounded-lg w-full max-w-4xl">
        {
          list.map((item, index) => {
            return (
              <div key={index} className="flex items-center justify-between bg-blue-100 px-4 rounded-lg shadow-sm mb-1 " >
                <div className="flex items-center space-x-4 ">
                  <img
                    src={item.picture}
                    alt="User"
                    className="h-11 w-11 rounded-full border border-gray-200"
                  />
                  <p className="text-gray-800 font-medium text-lg">{item.name}</p>
                </div>
                <p className="text-gray-600"> {item.email} </p>
                <div className="flex space-x-2">
                  <button className="bg-white text-blue-500 px-2 py-1 rounded-full hover:bg-gray-100 transition duration-300 border border-gray-300">
                    Instagram
                  </button>
                  <button className="bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600 transition duration-300">
                    Send
                  </button>
                </div>
              </div>
            );
          })
        }
      </div>

      {/* Pagination Section */}
      <div className="flex justify-center items-center mt-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 w-24"
          onClick={() => {
            if (page > 1) {
              setPage(page - 1);
            }
          }}
        >
          Previous
        </button>
        <p className="mx-4"> {page}</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300  w-24"
          onClick={() => {
            if (10 == list.length) {
              setPage(page + 1);
            }
          }}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default Allusers