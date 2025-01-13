import React from 'react';

function About() {
  return (
    <div className="bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 min-h-screen flex items-center justify-center p-8">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Our Dating App</h1>
        <p className="text-lg text-gray-600 mb-6">
          Welcome to our dating app, where you can find your perfect match! Our app is designed to help you connect with people who share your interests and values. Whether you're looking for a serious relationship or just want to meet new people, our app has something for everyone.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
        <p className="text-lg text-gray-600 mb-6">
          Getting started is easy! Simply sign up and create your profile. Once your profile is complete, you can start browsing through other profiles and find people who catch your interest. You can send messages, like profiles, and even set up dates through our app. Our advanced matching algorithm ensures that you are connected with people who are most compatible with you.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          We prioritize your safety and privacy. Our app includes features such as profile verification and secure messaging to ensure that your experience is safe and enjoyable.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Join our community today and start your journey to finding your perfect match!
        </p>
      </div>
    </div>
  );
}

export default About;
