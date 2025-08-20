import React from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar/NavBar';

function Landing() {
  const navigate = useNavigate();

  return (
    <>
   
        <h1>Welcome Landing!</h1>
    
    </>
  );
}

export default Landing;
