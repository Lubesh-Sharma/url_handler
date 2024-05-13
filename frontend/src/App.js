// import logo from './logo.svg';
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import HomePageLoggedin from "./Pages/HomePageLoggedin";
import Subscription from "./Pages/Subscription";
import Navbar from "./components/navbar";
import NavbarLoggedin from "./components/navbarlogin";
import LoginPage from "./Pages/login";
import SignUp from "./Pages/signup";
function App() {
  return (
    <>
      <div>
        {window.location.href === "http://localhost:3000/loggedin" ? <NavbarLoggedin /> : <Navbar />}
      </div>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/loggedin" element={<HomePageLoggedin />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
