import React, { useRef, useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { auth, db } from "../../firebase.jsx";
import { getAdditionalUserInfo } from "firebase/auth";
import { collection, setDoc, doc } from "firebase/firestore";

import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import "./signup.css";
import GoogleButton from "react-google-button";
import { useUserContext } from "../../context/userContext.jsx";
// import { useAuth } from "../../context/AuthContext.jsx";
const provider = new GoogleAuthProvider();
const Signup = () => {
  const emailRef = useRef();

  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { loadingCurrentUser, currentUserDB } = useUserContext();
  const [loading, setLoading] = useState(false);
  console.log(loadingCurrentUser);
  console.log(currentUserDB);

  useEffect(() => {
    console.log("CURRENT", currentUserDB);
    if (currentUserDB) {
      console.log("asdf");
      // navigate("/home");
    } else {
      console.log("EMPTY");
    }
  }, []);
  async function addNewUser(result) {
    console.log("step 3");
    console.log(result);
    const addUserData = {
      username: result.user.email.split("@")[0],
      id: result.user.uid,
      email: result.user.email,
      photoURL: result.user.photoURL,
      loggedIn: true,
    };

    const userDocRef = doc(db, "users", result.user.uid);
    await setDoc(userDocRef, addUserData);
  }
  async function googleSignIn() {
    console.log("STEP 2");
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("GOOD");
      // This gives you a Google Access Token. You can use it to access the Google API.

      // console.log(result);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const userData = getAdditionalUserInfo(result);
      console.log(userData);
      // make new instance in user collection if the user is new user

      if (userData.isNewUser) {
        addNewUser(result);
      }
      console.log("step 4");
      navigate("/home");
    } catch {
      (error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      };
    }
    // console.log("TESTES", googleResult);
    // cookies.set("auth-token", googleResult.user.refreshToken);
  }
  function Register(email, password) {
    console.log(email, password);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // // Signed up
        // const user = userCredential.user;
        // // ...
        console.log("USERCREDNETIAL", userCredential);
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        console.log(errorCode);
        console.log(errorMessage);
        return errorCode;
      });
  }

  const navigate = useNavigate();
  const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [googleSignedIn, setGoogleSignedIn] = useState(false);
  async function handleSubmit(e) {
    e.preventDefault();
    if (passwordConfirmRef.current.value !== passwordRef.current.value) {
      return setError("Passwords do not match");
    }
    if (passwordConfirmRef.current.value.length < 6) {
      return setError("Password must be at least 6 characters long");
    }
    try {
      setError("");
      // setLoading(true);
      await Register(
        emailRef.current.value,
        // usernameRef.current.value,
        passwordRef.current.value
      );

      console.log(showAlert);
      navigate("/login");
    } catch {
      console.log(showAlert);
      setError("Failed to Create Account");
    }
    // setLoading(false);
  }
  async function signInWithGoogle() {
    try {
      setError("");
      setLoading(true);
      console.log("STEP 1");
      await googleSignIn();
      // console.log(showAlert);
      setLoading(false);
    } catch {
      console.log(showAlert);
      setError("Failed to Create Account");
    }
  }
  return (
    <>
      {loading ? (
        <div>LOADING</div>
      ) : (
        <>
          {" "}
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
                <Form.Group id="passwordConfirom" className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control type="text" ref={passwordConfirmRef} required />
                </Form.Group>
                <Button className="w-100" type="submit" disabled={loading}>
                  Sign Up
                </Button>
              </Form>
              <div className="google" onClick={signInWithGoogle}>
                <GoogleButton />
              </div>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Already Have an Account? <Link to="/login">Login </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Signup;
