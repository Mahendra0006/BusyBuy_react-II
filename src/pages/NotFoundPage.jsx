import React from "react";
import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="container mt-5 text-center">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="mb-4">
                <FaExclamationTriangle size={64} className="text-danger" />
              </div>
              <h1 className="display-1 text-danger mb-3">404</h1>
              <h2 className="mb-4">Page Not Found</h2>
              <p className="lead mb-4">
                The page you're looking for doesn't exist.
              </p>
              <Link to="/" className="btn btn-primary btn-lg">
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
