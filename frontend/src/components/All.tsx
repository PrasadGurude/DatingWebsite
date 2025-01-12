import React, { useEffect, useState } from 'react'

function All() {

  const [list, setList] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/students')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setList(data)
      })
  })
  return (
    <div className='bg-gradient-to-r from-purple-500 to-pink-500  flex items-center justify-center p-8'>
      <div className='bg-white bg-opacity-50 p-8 rounded-lg shadow-2xl text-center max-w-md '>
        <div className='flex justify-between w-96'>
          <button className="bg-pink-600 text-white  py-1 rounded-full hover:bg-pink-700 transition duration-300 w-28">
            All
          </button>
          <button className="bg-pink-600 text-white  py-1 rounded-full hover:bg-pink-700 transition duration-300 w-28 text-center">
            Requested
          </button>
        </div>
        <div className='p-4 flex justify-center '>
        <div className='flex items-center justify-between w-full bg-pink-400 p-4 rounded-md'>
            <div className='flex items-center'>
              <img src="/path/to/image.jpg" className='h-12 w-12 rounded-full mr-4' />
              <p className='text-white font-bold'>Name</p>
            </div>
            <button className='bg-white text-pink-600 px-4 py-1 rounded-full hover:bg-gray-200 transition duration-300'>
              instagram
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default All