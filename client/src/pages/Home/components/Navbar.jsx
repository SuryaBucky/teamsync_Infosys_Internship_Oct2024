import React, { useState } from "react";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../redux/userSlice";

const Navbar = ({ setSignInOpen }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const { currentUser, isLoggedIn } = useSelector((state) => state.user);

  return (
    <>
      {/* Main Navbar Container */}
      <div className="w-full max-w-[1320px] h-[80px] px-5 py-0 mx-auto my-3 flex items-center justify-between bg-transparent shadow-md rounded-lg transition-all duration-300 ease-in-out">
        {/* Left Section: Logo */}
        <div className="font-bold text-2xl bg-gradient-to-r from-[#4caf50] to-[#00bcd4] bg-clip-text text-transparent cursor-pointer transition-transform duration-300 ease-in-out hover:scale-110">
          Team Sync
        </div>

        {/* Center Menu - Hidden on Mobile */}
        <ul className="hidden md:flex items-center gap-10 list-none mx-auto">
          <li className="group relative">
            <a href="#home" className="font-semibold text-lg text-white transition-colors duration-300 group-hover:text-[#6B5BCD]">
              Home
            </a>
            <span className="absolute bottom-[-6px] left-1/2 w-0 h-[2px] bg-[#6B5BCD] group-hover:w-full transition-all duration-300 ease-in-out origin-center group-hover:left-0"></span>
          </li>
          <li className="group relative">
            <a href="#features" className="font-semibold text-lg text-white transition-colors duration-300 group-hover:text-[#6B5BCD]">
              Features
            </a>
            <span className="absolute bottom-[-6px] left-1/2 w-0 h-[2px] bg-[#6B5BCD] group-hover:w-full transition-all duration-300 ease-in-out origin-center group-hover:left-0"></span>
          </li>
          <li className="group relative">
            <a href="#benefits" className="font-semibold text-lg text-white transition-colors duration-300 group-hover:text-[#6B5BCD]">
              Benefits
            </a>
            <span className="absolute bottom-[-6px] left-1/2 w-0 h-[2px] bg-[#6B5BCD] group-hover:w-full transition-all duration-300 ease-in-out origin-center group-hover:left-0"></span>
          </li>
          <li className="group relative">
            <a href="#about" className="font-semibold text-lg text-white transition-colors duration-300 group-hover:text-[#6B5BCD]">
              About Us
            </a>
            <span className="absolute bottom-[-6px] left-1/2 w-0 h-[2px] bg-[#6B5BCD] group-hover:w-full transition-all duration-300 ease-in-out origin-center group-hover:left-0"></span>
          </li>
        </ul>

        {/* Right Section: Avatar + Logout or Sign In */}
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <img
                src="https://i.pravatar.cc/150"
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover"
              />
              <button
                onClick={() => dispatch(logout())}
                className="py-2 px-6 bg-[#6B5BCD] text-white font-bold rounded-full hover:bg-white hover:text-[#6B5BCD] border-2 border-[#6B5BCD] transition-all duration-300 transform hover:translate-y-[-3px] shadow-lg hover:shadow-2xl"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSignInOpen(true)}
              className="py-2 px-6 bg-[#6B5BCD] text-white font-bold rounded-full hover:bg-white hover:text-[#6B5BCD] border-2 border-[#6B5BCD] transition-all duration-300 transform hover:translate-y-[-3px] shadow-lg hover:shadow-2xl flex items-center gap-2"
            >
              <AccountCircleOutlinedIcon />
              Sign In
            </button>
          )}

          {/* Hamburger Menu for Mobile */}
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="block md:hidden cursor-pointer"
          >
            {menuOpen ? (
              <CloseIcon fontSize="large" className="text-white" />
            ) : (
              <MenuIcon fontSize="large" className="text-white" />
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="flex flex-col gap-5 absolute top-[80px] right-0 bg-white p-5 rounded-lg shadow-lg md:hidden w-[85%] z-50 transition-all duration-300">
          <li className="group relative">
            <a href="#home" onClick={() => setMenuOpen(false)} className="font-semibold text-lg text-gray-700 transition-colors duration-300 group-hover:text-[#6B5BCD]">
              Home
            </a>
            <span className="absolute bottom-[-6px] left-1/2 w-0 h-[2px] bg-[#6B5BCD] group-hover:w-full transition-all duration-300 ease-in-out origin-center group-hover:left-0"></span>
          </li>
          <li className="group relative">
            <a href="#features" onClick={() => setMenuOpen(false)} className="font-semibold text-lg text-gray-700 transition-colors duration-300 group-hover:text-[#6B5BCD]">
              Features
            </a>
            <span className="absolute bottom-[-6px] left-1/2 w-0 h-[2px] bg-[#6B5BCD] group-hover:w-full transition-all duration-300 ease-in-out origin-center group-hover:left-0"></span>
          </li>
          <li className="group relative">
            <a href="#benefits" onClick={() => setMenuOpen(false)} className="font-semibold text-lg text-gray-700 transition-colors duration-300 group-hover:text-[#6B5BCD]">
              Benefits
            </a>
            <span className="absolute bottom-[-6px] left-1/2 w-0 h-[2px] bg-[#6B5BCD] group-hover:w-full transition-all duration-300 ease-in-out origin-center group-hover:left-0"></span>
          </li>
          <li className="group relative">
            <a href="#about" onClick={() => setMenuOpen(false)} className="font-semibold text-lg text-gray-700 transition-colors duration-300 group-hover:text-[#6B5BCD]">
              About Us
            </a>
            <span className="absolute bottom-[-6px] left-1/2 w-0 h-[2px] bg-[#6B5BCD] group-hover:w-full transition-all duration-300 ease-in-out origin-center group-hover:left-0"></span>
          </li>
          {isLoggedIn ? (
            <button
              onClick={() => dispatch(logout())}
              className="py-2 px-6 bg-[#6B5BCD] text-white font-bold rounded-full hover:bg-white hover:text-[#6B5BCD] border-2 border-[#6B5BCD] transition-all duration-300 transform hover:translate-y-[-3px] shadow-lg hover:shadow-2xl"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setSignInOpen(true)}
              className="py-2 px-6 bg-[#6B5BCD] text-white font-bold rounded-full hover:bg-white hover:text-[#6B5BCD] border-2 border-[#6B5BCD] transition-all duration-300 transform hover:translate-y-[-3px] shadow-lg hover:shadow-2xl flex items-center gap-2"
            >
              <AccountCircleOutlinedIcon />
              Sign In
            </button>
          )}
        </ul>
      )}
    </>
  );
};

export default Navbar;