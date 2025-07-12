import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaUser } from "react-icons/fa";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error } = useSelector((state) => state.auth);

  const validateForm = () => {
    let errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      const res = await dispatch(signupUser(formData));
      if (!res.error) {
        toast.success("Account created successfully. Please sign in.");
        navigate("/signin");
      }
    } else {
      toast.error("Please enter valid data!");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(135deg,rgb(191, 51, 44),rgb(14, 67, 158))",
        padding: "20px",
      }}
    >
      <div
        className="row shadow-lg overflow-hidden rounded-4 bg-white bg-opacity-75 backdrop-blur w-100"
        style={{ maxWidth: "700px", minHeight: "450px" }}
      >
        {/* Left Image Section */}
        <div
          className="col-md-6 d-none d-md-flex justify-content-center align-items-center p-0"
          style={{
            backgroundImage: `url('https://plus.unsplash.com/premium_photo-1677094310956-7f88ae5f5c6b?w=600&auto=format&fit=crop&q=60')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Right Form Section */}
        <div
          className="col-md-6 d-flex align-items-center p-4"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.75)",
            color: "#fff",
          }}
        >
          <div className="w-100">
            <h3 className="text-center mb-4 text-white fw-bold">Sign Up</h3>
            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaUser />
                  </span>
                  <input
                    type="text"
                    className={`form-control ${
                      formErrors.name && "is-invalid"
                    }`}
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>
                {formErrors.name && (
                  <div className="invalid-feedback d-block">
                    {formErrors.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className={`form-control ${
                      formErrors.email && "is-invalid"
                    }`}
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
                {formErrors.email && (
                  <div className="invalid-feedback d-block">
                    {formErrors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="mb-3">
                <div className="input-group">
                  <span className="input-group-text bg-light">
                    <FaLock />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className={`form-control ${
                      formErrors.password && "is-invalid"
                    }`}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                  <span
                    className="input-group-text bg-light"
                    role="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {formErrors.password && (
                  <div className="invalid-feedback d-block">
                    {formErrors.password}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn btn-primary w-100 fw-semibold"
              >
                Sign Up
              </button>
            </form>

            {error && <p className="text-danger text-center mt-3">{error}</p>}

            <p className="text-center mt-3 mb-0 text-white">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-decoration-none fw-semibold text-info"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
