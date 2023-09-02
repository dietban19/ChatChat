import React, { useRef, useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/");
    } catch {
      setError("Failed to log in");
    }

    setLoading(false);
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Sign Up</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            {/* <Form.Group id="username">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" ref={usernameRef} required />
            </Form.Group> */}
            <Form.Group id="password" className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control type="text" ref={passwordRef} required />
            </Form.Group>

            <Button className="w-100" type="submit" disabled={loading}>
              Log In
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
};

export default Login;
