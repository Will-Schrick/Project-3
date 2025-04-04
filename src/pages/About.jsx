import React from 'react';
import Navbar from '../components/Navbar';

function About() {
  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="max-w-4xl mx-auto p-5">
        <h2 className="text-center text-gray-600 mb-20 mt-30 text-4xl">
          About Us!
        </h2>

        <div className="text-lg text-center text-gray-600 mb-5">
          <p>
            Welcome to Delicious Bites & Coffee, your go-to brunch spot in the
            heart of the city! Whether you're craving a savory breakfast burger,
            fluffy waffles, or a refreshing hot drink, we offer a variety of
            mouth-watering options to start your day right. With a cozy
            atmosphere and top-quality ingredients, we make sure every visit is
            a delightful experience.
          </p>
        </div>

        <p className="text-center text-gray-600">
          Join us for a meal that you'll love, served with a smile. See you
          soon!
        </p>
      </div>
    </div>
  );
}

export default About;
