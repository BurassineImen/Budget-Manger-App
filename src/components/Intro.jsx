import React, { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import illustration from "../assets/illustration.jpg";
import api from "../api"; // Instance Axios
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Intro = () => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null); // État pour stocker les données utilisateur
  const navigate = useNavigate(); // Pour redirection

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const formData = new FormData(event.target);
    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };
  
    try {
      const response = await api.post("/Auth/login", data);
      console.log("API response:", response.data);
      if (response.status === 200) {
        const token = response.data.token;
        const userData = response.data.user;
  
        localStorage.setItem("authToken", token);
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log("Saved userData:", JSON.parse(localStorage.getItem("userData")));

        setUser(userData);
  
        toast.success("Login successful! Redirecting to dashboard...");
        navigate("/blanco");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="intro">
      <div>
        <h1>
          Take Control of <span className="accent">Your Money</span>
        </h1>
        <p>
          Personal budgeting is the secret to financial freedom. Start your journey today.
        </p>

        {/* Formulaire de connexion */}
        <Form method="post" onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            aria-label="Your Email"
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Enter your password"
            aria-label="Your Password"
            autoComplete="new-password"
          />
          <button type="submit" className="btn btn--dark" disabled={loading}>
            {loading ? <span>Loading...</span> : <><span>Login</span><UserPlusIcon width={20} /></>}
          </button>
        </Form>

        {/* Lien vers la page d'inscription */}
        <Link to="/register" className="btn btn--light">
          <span>Create New Account</span>
        </Link>
      </div>
      <img src={illustration} alt="Person with money" width={600} />
      <ToastContainer />

      {/* Affichage des données utilisateur si connecté */}
      {user && (
        <div className="user-info">
          <h2>Welcome, {user.name}!</h2>
          <p>Email: {user.email}</p>
        </div>
      )}
    </div>
  );
};

export default Intro;
