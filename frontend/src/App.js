import "./App.css";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import HomePageLoggedin from "./Pages/HomePageLoggedin";
import Subscription from "./Pages/Subscription";
import Navbar from "./components/navbar";
import NavbarLoggedin from "./components/navbarlogin";
import LoginPage from "./Pages/login";
import SignUp from "./Pages/signup";
import { BACKEND_URL } from "./constants";

function App() {
  return (
    <>
      <Router>
        <Navbars />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loggedin/:user_id/subscription" element={<Subscription />} />
          <Route path="/loggedin/:user_id" element={<HomePageLoggedin />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

function Navbars() {
  const location = useLocation();
  
  // Display NavbarLoggedin only on the loggedin homepage route
  if (location.pathname.startsWith('/loggedin')) {
    return <NavbarLoggedin />;
  }

  // Display the default Navbar for all other routes
  return <Navbar />;
}

export default App;
