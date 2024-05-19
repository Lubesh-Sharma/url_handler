import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { BACKEND_URL } from "../constants";
import { GoogleLogin } from "react-google-login";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const redirect_register = () => {
    try {
      window.location.href = "/signup";
    } catch (err) {
      console.log(err);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Login clicked with email:", email, "and password:", password);
    try {
      let resp = await axios.post(`${BACKEND_URL}/login`, {
        email: email,
        password: password,
      });
      console.log(resp);
      if (resp.status === 200) {
        alert("You have been Logged in!!");
        window.location.href="/loggedin/"+resp.data.user._id;
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
    <Container className="login-box">
      <h1>Welcome Back</h1>
      <div className="google-loginbox">
        <GoogleLogin
          className="google-login"
          clientId="554645934751-n9n9vbk0f7pog6h0ff6mc21vqbr5dcej.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </div>
      <div className="login-form">
        <h3 className="emailSignin">Sign in with your email</h3>
        <Form onSubmit={handleLogin}>
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
          <div className="forgot-password">
            <p>Forgot password?</p>
          </div>
          {/* <div className="login-container"> */}
          <Button className="login-button" type="submit" variant="primary">
            Login
          </Button>
          {/* </div> */}
        </Form>
      </div>
      <div className="noaccount">
        <p>
          Don't have an account ?{" "}
          <span className="gotosignup" onClick={redirect_register}>
            Sign Up
          </span>
        </p>
      </div>
    </Container>
  );
};

export default LoginPage;
