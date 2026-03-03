import React from "react";
import { useNavigate } from "react-router-dom";
import "./BackButton.css";

const BackButton = ({ onClick }) => {
  const navigate = useNavigate();
  
  // Use the provided onClick (for state-based navigation) or fallback to navigate(-1)
  const handleClick = onClick || (() => navigate(-1));

  return (
    <button className="back-btn" onClick={handleClick}>
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
      >
        <path
          d="M15 18L9 12L15 6"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackButton;
