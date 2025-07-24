import React from 'react';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import './Logo.css';

const Logo = () => {
  return (
    <div className="umami-logo">
      <RestaurantIcon className="restaurant-icon" />
      <div className="logo-text">
        <span className="umami-text">UMAMI</span>
        <span className="app-text">APP</span>
      </div>
      <div className="logo-animation"></div>
    </div>
  );
};

export default Logo;