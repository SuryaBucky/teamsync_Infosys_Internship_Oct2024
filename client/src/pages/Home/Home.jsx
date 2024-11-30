// imports
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { KeyboardArrowUp } from "@mui/icons-material";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Features from "./components/Features";
import Testimonials from "./components/Testimonials";
import Benefits from "./components/Benifits";
import About from "./components/About";
import SignUp from "../../components/SignUp";
import SignIn from "../../components/SignIn";
import Faq from "./components/Faq";
import { jwtDecode } from "jwt-decode";
import { Button } from "@mui/material"; // Added import for Button component
import '../../App.css';
 
//Theme Toggle Button at the left side of the page (desktop)
const ThemeToggle = styled.div`
  position: fixed;
  top: 50%;
  left: 10px; /* Position the button to the left */
  transform: translateY(-50%); /* Center the button vertically */
  background-color: transparent;
  border: none;
  cursor: pointer;
  z-index: 999;  /* Make sure it's above other elements */
  transition: left 0.3s ease; /* Smooth transition for moving the button */
  
  /* Optionally, you can also transition the color if desired */
  transition: color 0.3s ease;

  &:hover {
    transform: translateY(-50%) scale(1.1); /* Slightly enlarge the button on hover */
  }
`;

// Updated ScrollToTop button for a prominent desktop position
const ScrollToTop = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  height: 60px;
  width: 60px;
  background: #0288d1;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: left;
  justify-content: left;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.3);  /* Enhance shadow for visibility */
  opacity: ${({ show }) => (show ? "1" : "0")};
  visibility: ${({ show }) => (show ? "visible" : "hidden")};
  transform: translateY(${({ show }) => (show ? "0" : "20px")});
  transition: all 0.3s ease-in-out;
  z-index: 999;

  &:hover {
    background: #01579b;
    transform: translateY(-5px);
  }

  @media (max-width: 768px) {
    bottom: 30px;
    right: 30px;
    height: 50px;
    width: 50px;
  }
`;

const Body = styled.div`
  background: ${({ isLightMode }) => (isLightMode ? "white" : "#001f3d")}; /* Light mode background */
  color: ${({ isLightMode }) => (isLightMode ? "blue" : "white")}; /* Light mode text color */
  display: flex;
  justify-content: center;
  overflow-x: hidden;
`;

const Container = styled.div`
  width: 100%;
  background-image: ${({ isLightMode }) =>
    isLightMode
      ? "none"
      : `linear-gradient(38.73deg, rgba(0, 31, 61, 0.25) 0%, rgba(0, 31, 61, 0) 50%), linear-gradient(141.27deg, rgba(0, 26, 41, 0) 50%, rgba(0, 26, 41, 0.25) 100%)`}; /* Adjusted gradient for dark mode */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 1;
`;

const Top = styled.div`
  width: 100%;
  display: flex;
  padding-bottom: 50px;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(38.73deg, rgba(0, 123, 255, 0.15) 0%, rgba(0, 123, 255, 0) 50%), linear-gradient(141.27deg, rgba(0, 70, 209, 0) 50%, rgba(0, 70, 209, 0.15) 100%);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 95%, 0 100%);
  @media (max-width: 768px) {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 98%, 0 100%);
    padding-bottom: 0px;
  }
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ isLightMode }) => (isLightMode ? "white" : "#001f3d")}; /* Background changes for dark/light mode */
  color: ${({ isLightMode }) => (isLightMode ? "blue" : "white")}; /* Text color changes */
  display: flex;
  flex-direction: column;
`;

const Home = () => {
  const [SignInOpen, setSignInOpen] = useState(false);
  const [SignUpOpen, setSignUpOpen] = useState(false);
  const [showScroll, setShowScroll] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false); // State for light/dark mode

  useEffect(() => {
    const checkScrollTop = () => {
      if (!showScroll && window.scrollY > 400) {
        setShowScroll(true);
      } else if (showScroll && window.scrollY <= 400) {
        setShowScroll(false);
      }
    };

    window.addEventListener("scroll", checkScrollTop);
    return () => window.removeEventListener("scroll", checkScrollTop);
  }, [showScroll]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        localStorage.clear();
        window.location.href = "/";
      }
    } else {
      localStorage.clear();
    }
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleTheme = () => {
    setIsLightMode((prevMode) => !prevMode); // Toggle light/dark mode
  };

  return (
    <>
      <Navbar setSignInOpen={setSignInOpen} />
      <Body isLightMode={isLightMode}>
        <Container isLightMode={isLightMode}>
          <Top id="home">
            <Hero setSignInOpen={setSignInOpen} />
          </Top>
          <Content isLightMode={isLightMode}>
            <Features />
            <Benefits />
            <Testimonials />
            <Faq />
            <About />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Footer />
            </div>
          </Content>
          
          {/* Theme Toggle Button in the center */}
          <ThemeToggle onClick={toggleTheme}>
            {isLightMode ? (
              <span style={{ fontSize: "40px" }}>🌞</span>  // Sun emoji for light mode
            ) : (
              <span style={{ fontSize: "40px" }}>🌙</span>  // Moon emoji for dark mode
            )}
          </ThemeToggle>

          {SignUpOpen && <SignUp setSignUpOpen={setSignUpOpen} setSignInOpen={setSignInOpen} />}
          {SignInOpen && <SignIn setSignInOpen={setSignInOpen} setSignUpOpen={setSignUpOpen} />}
          <ScrollToTop show={showScroll} onClick={scrollToTop}>
            <KeyboardArrowUp style={{ color: "white", fontSize: "28px" }} />
          </ScrollToTop>
        </Container>
      </Body>
    </>
  );
};

export default Home;
