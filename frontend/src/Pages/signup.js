import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { BACKEND_URL } from "../constants";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async(e) => {
    e.preventDefault();

    console.log("SignUp clicked with email:", email, "and password:", password);
    try{
      let resp=await axios.post(`${BACKEND_URL}/register`,{
        email: email,
        password: password
      });
      console.log(resp);
      if(resp.status === 200){
        alert("Successfully Signed Up please SignUp to Enjoy the services!!");
        window.location.href="/login";
      }
    }catch(err){
      console.log(err);
    }
  };

  return (
    <Container className="login-box">
      <h1>Sign Up</h1>
      <Form onSubmit={handleSignUp}>
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
          SignUp
        </Button>
      </Form>
    </Container>
  );
};

export default SignUp;
