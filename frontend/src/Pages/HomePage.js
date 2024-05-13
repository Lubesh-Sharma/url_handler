import React, { useState,useEffect,useMemo } from "react";
import { Link } from "react-router-dom";
import Dashboard from "../components/DashBoard";
import api from '../api/axiosConfig';

const HomePage = () => {
  const [url, setUrl] = useState("");
  // const getAllUrls=async()=>{
  //   return [];
  // };
  const [listUrls,setListUrls]=useState([]);
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
  const [linkCount, setLinkCount] = useState(()=>{
    const cookieValue = getCookie('linkCount');
    return cookieValue || 0;
  });

  useEffect(() => {
    document.cookie = `linkCount=${linkCount}; expires=Wed, 1 Jan 2025 00:00:00 UTC; path=/;`;
    console.log(document.cookie);
  },[linkCount]);
  // const retA=(listUrl)=>{
  //   let a=[];
  //   for(let i=0;i<listUrl.length;i++){
  //     a=[...a,{shortLink: listUrl[i]["short"],longLink: listUrl[i]["long"],qrCode: "QR Code 1",clicks: listUrl[i]["counter"],del: "",}];
  //   }
  //   return a;
  // }
  // const data = useMemo(() => retA(listUrls),[listUrls]);
  const addListUrl=(val)=>{
    setListUrls((t)=>[...t,val]);
  }
  const shortenUrl = async () => {
    if (linkCount >= 15) {
      alert(
        "You have reached the maximum number of links. Please register to create more links."
      );
      return;
    }
    try
        {   if(url === ""){
              return url;
            }
            const response = await api.post("/shorten",{long:url});
            const resp=await api.post("/api/getShortUrl",{long:url});
            console.log(resp);
            console.log(response);
            if (resp.status === 200){
              setUrl("http://localhost:4000/"+resp.data.short);
              setLinkCount(linkCount + 1);
              if(response.status === 200){
                addListUrl(resp.data);
                console.log(listUrls);
              }
            }

        }
        catch(err)
        {
            console.error(err);
        }
  };

  return (
    <div className="home-container">
      <div className="home-item-box">
        <h1>Shorten Your Loooong Links :)</h1>
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
        <p>
          You can create{" "}
          <span
            style={{ color: "skyblue", fontSize: "1.1rem", fontWeight: "30" }}
          >
            {15 - linkCount}
          </span>{" "}
          more links.{" "}
          <Link to="/subscription" className="register-link">
            Register Now
          </Link>{" "}
          to enjoy Unlimited Usage
        </p>

        {/* Add more features like copy to clipboard etc. */}
      </div>
      <div className="home-premium-box">
        <h2>Want More?</h2>
        <h1>Go Premium!</h1>
        <div className="button-container">
          <button className="create-free">Create Free Account</button>
          <button className="view">View</button>
        </div>
      </div>
      <Dashboard />

      <p className="home-bottom">
        <Link to="/subscription" className="register-link">
          Register Now
        </Link>{" "}
        to enjoy Unlimited History
      </p>
    </div>
  );
};

export default HomePage;
