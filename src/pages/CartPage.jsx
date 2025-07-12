import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  removeFromCart,
  updateQuantity,
} from "../redux/slices/cartSlice";
import { createOrder } from "../redux/slices/ordersSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner"; // Spinner or BunnySpinner

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      toast.warn("Please log in to place an order");
      navigate("/signin");
      return;
    }

    if (cartItems.length === 0) {
      toast.warning("Your cart is empty!");
      return;
    }

    try {
      setLoading(true);
      const orderItems = cartItems.map((item) => ({
        productId: item.id,
        title: item.title,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: item.image,
      }));

      const total = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      await dispatch(
        createOrder({
          userId: user.uid,
          items: orderItems,
          total: parseFloat(total.toFixed(2)),
        })
      ).unwrap();

      dispatch(clearCart());
      toast.success("Order placed successfully!");
      navigate("/myorders");
    } catch (error) {
      toast.error(error?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="container my-5">
      <h3 className="mb-4 fw-bold">Your Cart</h3>

      {loading ? (
        <div className="text-center py-5">
          <Spinner />
        </div>
      ) : cartItems.length === 0 ? (
        <div className="text-center py-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="img-fluid"
            style={{ maxWidth: "200px" }}
          />
          <p className="mt-3 text-muted fs-5">Your cart is empty.</p>
        </div>
      ) : (
        <>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="row bg-light border rounded p-3 mb-3 shadow-sm align-items-center"
            >
              {/* Product Info */}
              <div className="col-md-4 d-flex align-items-center gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                  }}
                  className="rounded"
                />
                <div>
                  <h6 className="mb-1">{item.title}</h6>
                  <p className="mb-0 text-muted">Price: ₹{item.price}</p>
                </div>
              </div>

              {/* Quantity Section */}
              <div className="col-md-4 text-center">
                <div className="d-flex justify-content-center align-items-center gap-3">
                  <button
                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      borderRadius: '50%',
                      lineHeight: '1'
                    }}
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity - 1,
                        })
                      )
                    }
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="fw-bold" style={{ fontSize: '1.25rem' }}>
                    {item.quantity}
                  </span>
                  <button
                    className="btn btn-outline-secondary d-flex align-items-center justify-content-center"
                    style={{
                      width: '40px',
                      height: '40px',
                      fontSize: '1.5rem',
                      fontWeight: '600',
                      borderRadius: '50%',
                      lineHeight: '1'
                    }}
                    onClick={() =>
                      dispatch(
                        updateQuantity({
                          id: item.id,
                          quantity: item.quantity + 1,
                        })
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Remove Button */}
              <div className="col-md-4 text-end">
                <button
                  className="btn btn-danger btn-sm rounded-pill px-3"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* Checkout Section */}
          <div className="mt-5 p-4 bg-light rounded-3">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex align-items-center">
                <i className="fas fa-shopping-cart me-2" style={{ fontSize: '1.5rem', color: '#007bff' }}></i>
                <h5 className="mb-0">Order Summary</h5>
              </div>
              <div className="d-flex flex-column align-items-end">
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">Subtotal:</span>
                  <span className="fw-bold">₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</span>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <span className="me-2">Shipping:</span>
                  <span className="fw-bold text-success">Free</span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="me-2">Total:</span>
                  <span className="fw-bold text-primary h4 mb-0">
                    ₹{cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <hr className="my-3" />
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <i className="fas fa-credit-card me-2" style={{ fontSize: '1.5rem', color: '#228be6' }}></i>
                <span>Secure Payment</span>
              </div>
              <button
                className="btn btn-lg px-4 py-2 rounded-pill"
                style={{
                  background: "linear-gradient(135deg, #48bb78, #38a169)",
                  color: "white",
                  fontWeight: "600",
                  fontSize: "1.1rem",
                  boxShadow: "0 4px 12px rgba(72, 187, 120, 0.2)",
                  transition: "all 0.3s ease"
                }}
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    Placing Order...
                    <span className="ms-2">
                      <Spinner className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                    </span>
                  </>
                ) : (
                  "Proceed to Checkout"
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
