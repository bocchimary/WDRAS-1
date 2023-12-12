// src/Settings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Settings = () => {
  const [settings, setSettings] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3002/stuffs');
        const data = response.data.map((stuff) => ({
          ipAddress: stuff.ip_address,
          location: stuff.location,
        }));
        setSettings(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const updateCurrentTime = () => {
      setCurrentTime(new Date());
    };

    fetchData();
    const intervalId = setInterval(updateCurrentTime, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div>
      <div className="cards-container" style={{ display: 'flex', gap: '20px' }}>
        {settings.map((setting) => (
          <CardSettings key={setting.ipAddress} setting={setting} />
        ))}
      </div>
    </div>
  );
};

const CardSettings = ({ setting }) => {
  const { ipAddress, location } = setting;
  const [limit, setLimit] = useState(() => {
    // Retrieve the limit value from localStorage or set a default value
    return parseInt(localStorage.getItem(`limit-${ipAddress}`), 10) || 3;
  });

  useEffect(() => {
    // Save the limit value to localStorage whenever it changes
    localStorage.setItem(`limit-${ipAddress}`, limit.toString());
  }, [limit, ipAddress]);

  const updateSettings = async () => {
    try {
      const response = await axios.post(`http://${ipAddress}/setparams`, {
        limit,
      });

      console.log(response.data);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <div className="card" style={{ width: '300px', height: '250px' }}>
      <h2>Location: {location}</h2>
      <label>Limit:</label>
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(parseInt(e.target.value, 10))}
        style={{ width: '50%' }}
      />
      <button
        onClick={updateSettings}
        disabled={!ipAddress}
        style={{ width: '50%', marginTop: '10px' }}
      >
        Set
      </button>
    </div>
  );
};

export default Settings;