import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearCart, removeFromCart } from "../redux/slices/cartSlice";
import { createOrder } from "../redux/slices/ordersSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";

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
        quantity: parseInt(item.quantity),
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
      console.error("Error placing order:", error);
      toast.error(error?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (parseFloat(item.price) || 0),
    0
  );

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
              className="d-flex justify-content-between align-items-center bg-light border rounded p-3 mb-3 shadow-sm"
            >
              <div className="d-flex align-items-center">
                <img
                  src={item.image}
                  alt={item.title}
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  className="rounded"
                />
                <div className="ms-3">
                  <h6 className="mb-1">{item.title}</h6>
                  <p className="mb-0 text-muted">₹{item.price}</p>
                </div>
              </div>
              <button
                className="btn btn-danger btn-sm rounded-pill px-3"
                onClick={() => handleRemove(item.id)}
              >
                Remove
              </button>
            </div>
          ))}
          <div className="d-flex justify-content-between align-items-center mt-4">
            <h5 className="fw-bold">Total: ₹{(totalPrice || 0).toFixed(2)}</h5>
            <button
              className="btn btn-primary btn-lg px-4 rounded-pill"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;
