import React from 'react';
import kakaoLoginButton from '../../asset/loginButtons/kakao_login_large_narrow.png';

const LoginButton = () => {
  return (
    <button>
      <img
        src={kakaoLoginButton}
        alt="kakao login button"
        aria-label="kakao login button"
        onClick={() => {
          window.location.pathname = '/api/auth/kakao';
        }}
      />
    </button>
  );
};

export default LoginButton;
