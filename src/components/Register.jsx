// Register.jsx
import React from "react";
import { Form } from "react-router-dom";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import illustration from "../assets/illustration.jpg";

const Register = () => {
  return (
    <div className="intro">
      <div>
        <h1>
          Welcome to <span className="accent">Your Financial Hub</span>
        </h1>
        <p>
          Join us and take the first step toward managing your finances effectively!
        </p>
        <Form method="post">
          <input
            type="text"
            name="userName"
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
          <input type="hidden" name="_action" value="registerUser" />
          <button type="submit" className="btn btn--dark">
            <span>Register</span>
            <UserPlusIcon width={20} />
          </button>
        </Form>
      </div>
      <img src={illustration} alt="Person planning finances" width={600} />
    </div>
  );
};

export default Register;
