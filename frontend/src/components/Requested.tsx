import React, { useEffect, useState } from 'react'

interface Requestedprops {
    isAuthenticated: boolean;
}

const Requested: React.FC<Requestedprops> = ({ isAuthenticated }) => {

    interface User {
        id:string;
        name: string;
        email: string;
        age: number;
        picture: string;
        engYear: number;
        branch: string;
        gender: string;
        insta_id: string;
    }

    const [list, setList] = useState<User[]>([]);
    const [page, setPage] = useState(1)
    const [popupMessage, setPopupMessage] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthenticated) {
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/requested-array/${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    setList(data.users);
                    setPopupMessage(data.message);
                    setTimeout(() => setPopupMessage(null), 3000);
                });
        }
    }, [page]);

    return (
        <div className='w-full'>
            {/* List Section */}
            {popupMessage ? (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white py-2 px-4 rounded shadow-md z-50">
                    {popupMessage}
                </div>
            ) : null}
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
                                    <button
                                     onClick={()=>{
                                        window.open(`${item.insta_id}`)
                                      }}
                                     className="bg-white text-blue-500 px-2 py-1 rounded-full hover:bg-gray-100 transition duration-300 border border-gray-300">
                                        Instagram
                                    </button>
                                    <button
                                    onClick={()=>{
                                        fetch(`${import.meta.env.VITE_BACKEND_URL}/api/send-remove-request`, {
                                          method: 'PUT',
                                          headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                                          },
                                          body: JSON.stringify({
                                            requestedId: item.id
                                          })
                                        })
                                      }}
                                     className="bg-blue-500 text-white px-2 py-1 rounded-full hover:bg-blue-600 transition duration-300">
                                        remove
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
                        if (page < list.length) {
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

export default Requested