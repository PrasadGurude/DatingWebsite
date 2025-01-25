
function About() {
  return (
    <div className="bg-gradient-to-r from-gray-100 via-blue-50 to-gray-100 min-h-screen flex items-center justify-center p-8">
      <div className="bg-white bg-opacity-90 p-8 rounded-lg shadow-lg text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">About Our Dating App</h1>
        <p className="text-lg text-gray-600 mb-6 text-justify">
        Welcome to our dating app! We help you connect with like-minded people, but keep in
        mind—you'll receive only one match from all the requests you send. To increase your
        chances of finding the right person, prioritize your requests by sending them to your
        top preferences first!
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Security</h2>
        <p className="text-lg mb-6 text-red-600 font-bold"> 
          We prioritize your safety and privacy. Our app includes features like profile
          verification and secure messaging to ensure a safe and enjoyable experience.
          Make sure your email isn't logged in on another device, as this could
          compromise your data.
        </p>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Getting Started</h2>
        <p className="text-lg text-gray-600 mb-6 text-justify">
        Getting started is easy! Simply sign up with your GHRCEM college email ID and
        create your profile. Once complete, you can browse through other profiles and
        send like requests to people who catch your interest. While messaging isn’t 
        supported, our matching algorithm ensures you connect with the most compatible 
        person.
        </p>
        <p className="text-lg text-gray-600 mb-6">
          Join our community today and start your journey to finding your perfect match!
        </p>
      </div>
    </div>
  );
}

export default About;
