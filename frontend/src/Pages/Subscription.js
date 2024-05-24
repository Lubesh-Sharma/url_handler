import React from "react";
import axios from "axios";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
} from "mdb-react-ui-kit";
import { BACKEND_URL } from "../constants";
import { useState, useEffect } from "react";

function Subscription() {
  const [user, setUser] = useState(null);

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

  const handleApplyNow = async (subscriptionType, price) => {
    const token = localStorage.getItem("jwtToken");

    if (!token) {
      alert("No token found. Please log in.");
      window.location.href = "/login";
      return;
    }

    if (!user) {
      alert("User information not found.");
      return;
    }

    try {
      const transactionId = 'T' + Date.now();

      await axios.post(
        `${BACKEND_URL}/order`,
        {
          name: subscriptionType,
          amount: price,
          phone: user.phone,  // Assuming user object contains phone number
          MID: 'MID' + Date.now(),
          transactionId: transactionId,
          userId: user._id,  // Pass user ID
          token: token  // Pass token
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then(res => {
        if (res.data.success === true) {
          window.location.href = res.data.data.instrumentResponse.redirectInfo.url;
        }
      }).catch(err => {
        console.log(err);
      });

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <MDBContainer className="subs-container">
        <h1>Subscriptions</h1>
        <MDBRow className="cards-container">
          <MDBCol size="md" className="subs-card">
            <div className="subs-card-heading">
              <h2>Free</h2>
            </div>
            <p style={{ textAlign: "center", padding: "30px" }}>
              Free basic ad-supported shortening for individual users. Customize your links and keep track of your link history.
            </p>
            <div className="price-container">
              <h2>Rs.0</h2>
              <h3>/mo</h3>
            </div>
            <p>Apply Now for free</p>
            <MDBBtn
              className="navbar-button"
              style={{ textAlign: "center", margin: "30px" }}
              onClick={() => handleApplyNow('Free', 0)}
            >
              Apply Now
            </MDBBtn>
          </MDBCol>
          <MDBCol size="md" className="subs-card">
            <div className="subs-card-heading">
              <h2>Standard</h2>
            </div>
            <p style={{ textAlign: "center", padding: "30px" }}>
              Go Pro to take your branded links to the next level, with unlimited tracked clicks, link tagging, URL editing, and more.
            </p>
            <div className="price-container">
              <h2>Rs.100</h2>
              <h3>/mo</h3>
            </div>
            <p>Rs.1200 billed Annually</p>
            <MDBBtn
              className="navbar-button"
              style={{ textAlign: "center", margin: "30px" }}
              onClick={() => handleApplyNow('Standard', 100)}
            >
              Apply Now
            </MDBBtn>
          </MDBCol>
          <MDBCol size="md" className="subs-card">
            <div className="subs-card-heading">
              <h2>Premium</h2>
            </div>
            <p style={{ textAlign: "center", padding: "30px" }}>
              For those that need a massive amount of shortened URLs for your SMS or other campaigns.
            </p>
            <div className="price-container">
              <h2>Rs.200</h2>
              <h3>/mo</h3>
            </div>
            <p>Rs.2400 billed Annually</p>
            <MDBBtn
              className="navbar-button"
              style={{ textAlign: "center", margin: "30px" }}
              onClick={() => handleApplyNow('Premium', 200)}
            >
              Apply Now
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <MDBCard className="subs-container">
        <MDBCardBody className="subs-footer-card">
          <MDBCardTitle className="subs-card-heading">
            <h2>Features</h2>
          </MDBCardTitle>
          <MDBCardText>
            Some quick example text to build on the card title and make up the bulk of the card's content.
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </>
  );
}

export default Subscription;
