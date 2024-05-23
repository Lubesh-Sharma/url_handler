import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../components/DashBoard";
import api from '../api/axiosConfig';
import axios from "axios";
import { BACKEND_URL } from "../constants";

const HomePageLoggedin = () => {
  const [url, setUrl] = useState("");
  const [listUrls, setListUrls] = useState([]);
  const [user, setUser] = useState(null);

  const getCookie = (name) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + '=')) {
        return Number(cookie.substring(name.length + 1));
      }
    }
    return null;
  };

  const [linkCount, setLinkCount] = useState(() => {
    const cookieValue = getCookie('linkCount');
    return cookieValue || 0;
  });

  useEffect(() => {
    document.cookie = `linkCount=${linkCount}; expires=Wed, 1 Jan 2025 00:00:00 UTC; path=/;`;
    console.log(document.cookie);
  }, [linkCount]);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("No token found");

        const response = await axios.get(`${BACKEND_URL}/authenticate`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          console.log("Authenticated");
          setUser(response.data.user);
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        console.log(err);
        window.location.href = "/login";
      }
    };
    authenticateUser();
  }, []);

  const addListUrl = (val) => {
    setListUrls((t) => [...t, val]);
  };

  const shortenUrl = async () => {
    if (linkCount >= 100) {
      alert(
        "You have reached the maximum number of links. Please register to create more links."
      );
      return;
    }
    try {
      if (url === "") {
        return;
      }
      const response = await api.post("/api/shorten", { long: url });
      if (response.status === 200) {
        const shortUrl = response.data.short;
        setUrl(`http://localhost:8000/${shortUrl}`);
        setLinkCount(linkCount + 1);
        addListUrl(response.data);
        console.log(listUrls);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
  };

  return (
    <div className="home-container">
      <div className="home-item-box">
        {user ? (
          <>
            <h1>Welcome, {user.username}!</h1>
            
            <h1>Shorten Your Loooong Links :)</h1>
          </>
        ) : (
          <h1>Loading...</h1>
        )}
        <p style={{ marginTop: "25px" }}>
          Linkly is an efficient and easy-to-use URL shortening service that
          streamlines your online experience.
        </p>
        <div className="wrapper">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Your URL here"
          />
          <button type="submit" className="abs-submit" onClick={shortenUrl}>
            Shorten Now!
          </button>
        </div>
        {user && (user.subscription === "Free" || user.subscription === null) && (
          <p>
            You can create{" "}
            <span
              style={{ color: "skyblue", fontSize: "1.1rem", fontWeight: "30" }}
            >
              {100 - linkCount}
            </span>{" "}
            more links.{" "}
            <Link to={`/loggedin/${user._id}/subscription`} className="register-link">
              Take Premium Now
            </Link>{" "}
            to enjoy Unlimited Usage
          </p>
        )}
      </div>
      {user && (user.subscription === "Free" || user.subscription === null) && (
        <div className="home-premium-box">
          <h2>Want More?</h2>
          <h1>Go Premium!</h1>
          <div className="button-container">
            <button className="create-free">Go Premium</button>
          </div>
        </div>
      )}
      <Dashboard />
    </div>
  );
};

export default HomePageLoggedin;
