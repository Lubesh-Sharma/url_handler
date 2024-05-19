import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async(e) => {
    e.preventDefault();

    console.log("Login clicked with email:", email, "and password:", password);
    try{
      let resp=await axios.post(`${BACKEND_URL}/login`,{
        email: email,
        password: password
      });
      console.log(resp);
      if(resp.status === 200){
        alert("You have been Logged in!!");
        window.location.href="/loggedin/"+resp.data.user._id;
      }
    }catch(err){
      console.log(err);
    }
  };

  return (
    <Container className="login-box">
      <h1>Sign in</h1>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            className="email"
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            className="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button className="submit" type="submit" variant="primary">
          Login
        </Button>
      </Form>
    </Container>
  );
};

export default LoginPage;
