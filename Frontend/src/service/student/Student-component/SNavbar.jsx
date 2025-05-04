import React, { useState } from 'react'

const SNavbar = ({ onNavigate }) => {
    const [activeButton, setActiveButton] = useState(""); // State to track the active button

    const handleButtonClick = (buttonName) => {
      setActiveButton(buttonName); // Set the active button
      onNavigate(buttonName); // Call the onNavigate function
    };
  
    return (
      <div
        className="main"
        style={{ boxShadow: "0 1px 30px 2px rgb(0, 0, 23)" }}
      >
        {/* Faculty Panel Heading */}
        <div
          style={{
            fontWeight: "bold",
            fontSize: "3rem",
            textShadow: "2px 2px 5px rgba(0, 0, 0, 0.5)",
            letterSpacing: "3px",
          }}
          className="heading  text-black text-center"
        >
         E R P
        </div>
  
        {/* Navbar Options */}
        <div className="options list-none">
          <ul className="flex justify-around m-4 p-1 font-semibold text-xl text-white">
            {["Attendance", "Marks", "Assignment"].map((item) => (
              <li
                key={item}
                className={`p-2 mb-4 border rounded-md border-b-2 border-black shadow-[2px_2px_3px_black] transition-all transform active:scale-95 active:translate-y-0.5 ${
                  activeButton === item
                    ? "bg-slate-100 text-black font-extrabold" // Styles for active button
                    : "bg-gray-900 hover:bg-black hover:scale-110 hover:translate-y-1 font-extrabold" // Styles for non-active button
                }`}
                onClick={() => handleButtonClick(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };
  
  


export default SNavbar