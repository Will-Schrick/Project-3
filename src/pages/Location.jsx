import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function Location() {
  const [map, setMap] = useState(null);

  const position = [40.424509, -3.691289]; // Coordinates for P.º de Recoletos, 15, Centro, 28004 Madrid

  // Center the map based on the coordinates and handle responsive resizing
  const containerStyle = {
    width: '100%',
    height: '400px', // You can adjust height to suit your preference
  };

  // This will fix the default marker issue
  useEffect(() => {
    if (map) {
      map.invalidateSize();
    }
  }, [map]);

  return (
    <div>
      {/* Navbar */}
      <Navbar />

      {/* Main Section */}
      <div className="max-w-4xl mx-auto p-5">
        <h1 className="text-4xl font-bold text-center mb-5">Our Location</h1>
        <h1 className="text-center text-gray-600 mb-20 mt-20 text-4xl">
          Come Visit Us Soon!
        </h1>

        {/* Map */}
        <MapContainer
          center={position}
          zoom={15}
          style={containerStyle}
          whenCreated={setMap} // Store the map object to be used for resizing later
        >
          {/* OpenStreetMap Tiles */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {/* Marker for the restaurant */}
          <Marker position={position}>
            <Popup>
              Delicious Bites & Coffee
              <br />
              P.º de Recoletos, 15, Centro, 28004 Madrid
              <br />
              Call us: 919017257
            </Popup>
          </Marker>
        </MapContainer>

        {/* Contact Information */}
        <div className="text-center mt-5">
          <p className="text-lg">
            <strong>Address:</strong> P.º de Recoletos, 15, Centro, 28004 Madrid
          </p>
          <p className="text-lg">
            <strong>Phone:</strong> 919017257
          </p>
        </div>
      </div>
    </div>
  );
}

export default Location;
