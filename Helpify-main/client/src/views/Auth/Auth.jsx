/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import coverImage from '../../assets/images/bg/Cover.png';
function Auth() {
  return (
    <div
      style={{
        backgroundImage: `url(${coverImage})`,
        backgroundPosition: 'center', 
        backgroundRepeat: 'no-repeat', 
        backgroundSize: 'cover',
        height: '100vh', 
        width: '100vw', 
      }}
      className='d-flex justify-content-center align-content-center'
    >
      <Outlet/>
    </div>
  )
}

export default Auth;