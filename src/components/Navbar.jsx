import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import {
  FaShoppingCart,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const [isOpen, setIsOpen] = useState(false);

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/signin");
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm"
      style={{ minHeight: "70px" }}
    >
      <div className="container">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center"
          to="/"
          style={{ fontSize: "1.3rem" }}
        >
          🛒 <span className="ms-2">E-Commerce</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link text-white fw-semibold fs-5" to="/">
                Home
              </Link>
            </li>

            {user && (
              <li className="nav-item">
                <Link
                  className="nav-link text-white fw-semibold fs-5"
                  to="/addproducts"
                >
                  Add Product
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center gap-2">
            {/* Cart Button */}
            <li className="nav-item me-1">
              <Link
                to="/cartproducts"
                className="btn btn-warning btn-sm d-flex align-items-center gap-2 position-relative px-3"
              >
                <FaShoppingCart />
                Cart
                {totalQuantity > 0 && (
                  <span className="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link
                    className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                    to="/myorders"
                  >
                    <FaUserCircle />
                    My Orders
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-danger btn-sm d-flex align-items-center gap-2"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    to="/signin"
                    className="btn btn-outline-light btn-sm d-flex align-items-center gap-2"
                  >
                    <FaSignInAlt />
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    to="/signup"
                    className="btn btn-primary btn-sm d-flex align-items-center gap-2"
                  >
                    <FaUserPlus />
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
