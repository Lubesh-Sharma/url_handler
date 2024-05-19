import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { GoogleLogin } from "react-google-login";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirect_login = () => {
    try {
      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    }
  };
  const handleSignUp = async (e) => {
    e.preventDefault();

    console.log("SignUp clicked with email:", email, "and password:", password);

    try {
      let resp = await axios.post(`${BACKEND_URL}/register`, {
        email: email,
        password: password,
        username: username,
      });
      console.log(resp);
      if (resp.status === 200) {
        alert("Successfully Signed Up please SignUp to Enjoy the services!!");
        window.location.href = "/login";
      }
    } catch (err) {
      console.log(err);
    }
  };
  const responseGoogle = async (response) => {
    console.log(response);
    if (response.error) {
      // Google login failed
      console.error("Google login error:", response.error);
      return;
    }
    const { email, givenName: username } = response.profileObj;

    try {
      let resp = await axios.post(`${BACKEND_URL}/register`, {
        email,
        username,
      });

      console.log(resp);

      if (resp.status === 200) {
        alert("Successfully Signed Up please SignUp to Enjoy the services!!");
        window.location.href = "/login";
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container className="signup-box">
      <h1>Sign Up</h1>
      <div className="google-loginbox">
        <GoogleLogin
          className="google-login"
          clientId="554645934751-n9n9vbk0f7pog6h0ff6mc21vqbr5dcej.apps.googleusercontent.com"
          buttonText="Signin with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
      <div className="login-form">
        <Form onSubmit={handleSignUp}>
          <Form.Group controlId="formBasicName">
            {/* <Form.Label>User Name</Form.Label> */}
            <Form.Control
              className="username"
              // type="text"
              placeholder="Enter User Name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            {/* <Form.Label>Email address</Form.Label> */}
            <Form.Control
              className="email"
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            {/* <Form.Label>Password</Form.Label> */}
            <Form.Control
              className="password"
              type={showPassword ? "email" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {/* <Button onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? "Hide" : "Show"} Password
          </Button> */}
          </Form.Group>

          <Button className="signup-button" type="submit" variant="primary">
            SignUp
          </Button>
        </Form>
      </div>
      <div className="noaccount">
        <p>
          Already have an account ?{" "}
          <span className="gotosignup" onClick={redirect_login}>
            Sign In
          </span>
        </p>
      </div>
    </Container>
  );
};

export default SignUp;
