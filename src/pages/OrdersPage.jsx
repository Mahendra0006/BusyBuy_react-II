import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  cancelOrder,
  returnOrder,
  deleteOrder,
} from "../redux/slices/ordersSlice";
import {
  FaShoppingCart,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items || []);
  const loading = useSelector((state) => state.orders.loading || false);
  const error = useSelector((state) => state.orders.error || null);
  const user = useSelector((state) => state.auth.user);

  const [returnReason, setReturnReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      toast.warning("Please log in to view your orders");
      navigate("/signin");
      return;
    }
    dispatch(fetchOrders(user.uid));
  }, [dispatch, user, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-warning me-1" />;
      case "completed":
        return <FaCheckCircle className="text-success me-1" />;
      case "cancelled":
        return <FaTimesCircle className="text-danger me-1" />;
      default:
        return <FaShoppingCart className="me-1" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "completed":
        return "success";
      case "cancelled":
        return "danger";
      default:
        return "primary";
    }
  };

  const handleCancelOrder = async (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      try {
        await dispatch(cancelOrder(id)).unwrap();
        toast.success("Order cancelled successfully");
      } catch (error) {
        toast.error(error.message || "Failed to cancel order");
      }
    }
  };

  const handleReturnOrder = async () => {
    if (!selectedOrder) {
      toast.warning("Please select an order to return");
      return;
    }
    if (!returnReason.trim()) {
      toast.warning("Please provide a reason for return");
      return;
    }
    try {
      await dispatch(
        returnOrder({ orderId: selectedOrder.id, reason: returnReason })
      ).unwrap();
      toast.success("Order returned successfully");
      setReturnReason("");
      setSelectedOrder(null);
      const closeButton = document.querySelector(
        '#returnOrderModal [data-bs-dismiss="modal"]'
      );
      closeButton?.click();
    } catch (error) {
      toast.error(error.message || "Failed to return order");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (
      window.confirm("Are you sure you want to delete this order permanently?")
    ) {
      try {
        await dispatch(deleteOrder(id)).unwrap();
        toast.success("Order deleted successfully");
      } catch (error) {
        toast.error(error.message || "Failed to delete order");
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-primary border-bottom pb-2">My Orders</h2>
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center my-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="Empty Cart"
            className="mb-3"
            style={{ width: "120px", opacity: 0.8 }}
          />
          <h5 className="text-muted">No orders found. Start shopping now!</h5>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div key={order.id} className="col-md-6 mb-4">
              <div className="card shadow border-0">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="mb-0">Order #{order.id}</h5>
                    <span
                      className={`badge bg-${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>
                  <small className="text-muted d-block mb-2">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </small>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.title}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price.toLocaleString()}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="2" className="text-end fw-bold">
                            Total:
                          </td>
                          <td className="fw-bold">
                            ₹{order.total.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 d-flex flex-wrap gap-2">
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/order/${order.id}`)}
                    >
                      View Details
                    </button>
                    {order.status === "pending" && (
                      <>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Cancel
                        </button>
                        <button
                          className="btn btn-sm btn-outline-dark"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                    {order.status === "completed" && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        data-bs-toggle="modal"
                        data-bs-target="#returnOrderModal"
                        onClick={() => setSelectedOrder(order)}
                      >
                        Return Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Return Modal */}
      <div
        className="modal fade"
        id="returnOrderModal"
        tabIndex="-1"
        aria-labelledby="returnOrderModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="returnOrderModalLabel">
                Return Order
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <textarea
                className="form-control"
                rows="4"
                placeholder="Reason for return..."
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleReturnOrder}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
