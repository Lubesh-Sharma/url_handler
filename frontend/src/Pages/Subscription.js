import React from "react";
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
} from "mdb-react-ui-kit";
function Subscription() {
  return (
    <>
      <MDBContainer className="subs-container">
        <h1>Subscriptions</h1>
        <MDBRow className="cards-container">
          <MDBCol size="md" className="subs-card">
            <div className="subs-card-heading">
              <h2>Free </h2>
            </div>
            <p style={{ textAlign: "center", padding: "30px" }}>
              Free basic ad-supported shortening for individual users. Customize
              your links and keep track of your link history.
            </p>
            <div className="price-container">
              <h2>$0.00</h2>
              <h3>/mo</h3>
            </div>
            <p>Sign Up for free, just verify your email</p>
            <MDBBtn
              className="navbar-button"
              style={{ textAlign: "center", margin: "30px" }}
            >
              Sign Up
            </MDBBtn>
          </MDBCol>
          <MDBCol size="md" className="subs-card">
            <div className="subs-card-heading">
              <h2>Pro </h2>
            </div>
            <p style={{ textAlign: "center", padding: "30px" }}>
              Go Pro to take your branded links to the next level, with
              unlimited tracked clicks, link tagging, URL editing, and more.
            </p>
            {/* <p>$9.99 /mo</p> */}
            <div className="price-container">
              <h2>$9.99</h2>
              <h3>/mo</h3>
            </div>
            <p>$199.88 billed Annually</p>
            <MDBBtn
              className="navbar-button"
              style={{ textAlign: "center", margin: "30px" }}
            >
              Sign Up
            </MDBBtn>
          </MDBCol>
          <MDBCol size="md" className="subs-card">
            <div className="subs-card-heading">
              <h2>Pro Max </h2>
            </div>
            <p style={{ textAlign: "center", padding: "30px" }}>
              For those that need a massive amount of shortened URLs for your
              SMS or other campaigns.{" "}
            </p>
            {/* <p>$19.99 /mo</p> */}
            <div className="price-container">
              <h2>$19.99</h2>
              <h3>/mo</h3>
            </div>

            <p>$1199.88 billed Annually</p>
            <MDBBtn
              className="navbar-button"
              style={{ textAlign: "center", margin: "30px" }}
            >
              Sign Up
            </MDBBtn>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <MDBCard className="subs-container">
        <MDBCardBody className="subs-footer-card ">
          <MDBCardTitle className="subs-card-heading">
            <h2>Features </h2>
          </MDBCardTitle>
          <MDBCardText>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </MDBCardText>
        </MDBCardBody>
      </MDBCard>
    </>
  );
}

export default Subscription;
