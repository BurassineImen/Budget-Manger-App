import React, { useState } from "react";
import { Form, useNavigate } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import illustration from "../assets/illustration.jpg";
import api from "../api";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialiser le hook de navigation

  const handleRegister = async (event) => {
  event.preventDefault();
  setLoading(true);

  const formData = new FormData(event.target);
  const data = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await api.post("/Auth/register", data); // Appel API pour enregistrer
    if (response.status === 200) {
      toast.success("Registration successful! Logging you in...");
      
      // Effectuez une connexion automatique après l'inscription
      const loginResponse = await api.post("/Auth/login", {
        email: data.email,
        password: data.password,
      });
      if (loginResponse.status === 200) {
        const token = loginResponse.data;
        localStorage.setItem("authToken", token); // Stocker le token
        setTimeout(() => {
          navigate("/"); // Redirection
        }, 2000);
      }
    }
  } catch (error) {
    console.error("Error during registration:", error);
    toast.error("Registration failed. Please try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="intro">
      <div>
        <h1>
          Welcome to <span className="accent">Your Financial Hub</span>
        </h1>
        <p>
          Join us and take the first step toward managing your finances effectively!
        </p>
        <Form method="post" onSubmit={handleRegister}>
          <input
            type="text"
            name="name"
            required
            placeholder="Enter your username"
            aria-label="Your Username"
            autoComplete="username"
          />
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
            {loading ? <span>Loading...</span> : <><span>Register</span><UserPlusIcon width={20} /></>}
          </button>
        </Form>
      </div>
      <img src={illustration} alt="Person planning finances" width={600} />
      <ToastContainer />
    </div>
  );
};

export default Register;
