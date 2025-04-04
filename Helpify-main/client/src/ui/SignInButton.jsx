import React from 'react'
import { useNavigate } from 'react-router';

function SignInButton() {
  const navigate = useNavigate();
  const onLoginClick = () => {
    navigate('/auth');
  }
  return (
    <div onClick={onLoginClick} className="hstack gap-3 cursor-pointer">
      <div className="john-img">
        <i
          className="rounded-circle ti ti-user fs-3 bg-primary text-white p-2"
          alt=""
        />
      </div>
      <div className="john-title">
        <h6 className="mb-0 fs-4 fw-semibold">Signin</h6>
      </div>

    </div>
  )
}

export default SignInButton