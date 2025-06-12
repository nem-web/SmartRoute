import React from "react";
import { useState, useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { LiaToggleOffSolid } from "react-icons/lia";
import { LiaToggleOnSolid } from "react-icons/lia";
import "./style.css";
import { Button } from "@mui/material";

export const Header = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Update body class when theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  return (
    <>
      <div className="container">
        <div className="header flex !flex-row justify-between align-center m-[10px]">
          <h1 className="title">SmartRoute - Shortest path visualiser</h1>
          <div className="comp mr-[10px] flex justify-center items-center">
            <FaGithub className="w-[30px] h-[50px]" />
            <div className="toggle-bar cursor-pointer" onClick={toggleTheme}>
              {isDarkMode ? (
                <LiaToggleOnSolid className="toggle dark-mode inset-0 transition-all duration-1000 ease-in-out" />
              ) : (
                <LiaToggleOffSolid className="toggle light-mode inset-0 transition-all duration-1000 ease-in-out" />
              )}
            </div>
          </div>
        </div>

        <hr />
        <div className="nav">
          <Button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="!capitalize !bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Reset & Reload
          </Button>
        </div>
        <hr />
      </div>
    </>
  );
};

export default Header;
