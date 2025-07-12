import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const SigninForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, loading } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await dispatch(loginUser(formData));
      if (res.error) throw new Error(res.error.message);
      navigate("/");
      toast.success("Logged in successfully!");
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, rgb(191, 51, 44), rgb(14, 67, 158))",
        padding: "20px",
      }}
    >
      <div
        className="row shadow-lg rounded-4 bg-dark text-white bg-opacity-75 backdrop-blur w-100"
        style={{ maxWidth: "700px", minHeight: "400px" }}
      >
        {/* Left image and text */}
        <div
          className="col-md-6 d-none d-md-flex flex-column justify-content-center align-items-center text-white p-4"
          style={{
            backgroundImage:
              "url('https://plus.unsplash.com/premium_photo-1675283555385-8cab763245bb?auto=format&fit=crop&w=600&q=60')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Right form */}
        <div className="col-md-6 d-flex align-items-center p-4">
          <div className="w-100">
            <h3 className="text-center mb-4 text-primary fw-bold">Sign In</h3>
            <form onSubmit={handleSubmit}>
              {/* Email Input */}
              <div className="mb-3 position-relative">
                <label htmlFor="email" className="form-label fw-semibold">
                  Email address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-3 position-relative">
                <label htmlFor="password" className="form-label fw-semibold">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    required
                  />
                  <span
                    className="input-group-text bg-light"
                    role="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 rounded-3 fw-semibold"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            {error && (
              <div className="alert alert-danger text-center mt-3">{error}</div>
            )}

            <p className="text-center mt-3">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-decoration-none fw-semibold text-primary"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
