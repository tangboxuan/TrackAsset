import React from "react";
import { Link } from "react-router-dom";

export default () => (
  <div className="vw-100 vh-100 primary-color d-flex align-items-center justify-content-center">
    <div className="jumbotron jumbotron-fluid bg-transparent">
      <div className="container secondary-color">
        <h1 className="display-4">Track Asset</h1>
        <p className="lead">
          An improved portfolio tracker that includes currency flutuations, transaction costs and non-listed assets.
        </p>
        <hr className="my-4" />
        <Link
          to="/login"
          className="btn btn-lg custom-button"
          role="button"
        >
          Log In
        </Link> &ensp;
        <Link
          to="/signup"
          className="btn btn-lg custom-button"
          role="button"
        >
          Sign Up
        </Link>
      </div>
    </div>
  </div>
);