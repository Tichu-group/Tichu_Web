import React from 'react';
import './App.css';
import LoginButton from './components/button/loginButton';

function App() {
  return (
    <div
      style={{
        backgroundColor: 'black',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <LoginButton />
      <button
        style={{ backgroundColor: 'white', padding: '3px' }}
        onClick={() => {
          window.location.pathname = '/api/auth/google';
        }}
      >
        Google Login
      </button>
      <button
        style={{ backgroundColor: 'white' }}
        onClick={() => {
          window.location.pathname = '/api/auth/facebook';
        }}
      >
        FB Login
      </button>
    </div>
  );
}

export default App;
