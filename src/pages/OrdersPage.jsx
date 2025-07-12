import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  cancelOrder,
  deleteOrder,
  returnOrder,
} from "../redux/slices/ordersSlice";
import {
  FaShoppingCart,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const user = useSelector((state) => state.auth.user);

  const [returnReason, setReturnReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!user) {
      toast.warning("Please log in to view orders");
      navigate("/signin");
    } else {
      dispatch(fetchOrders(user.uid));
    }
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

  const handleCancelOrder = (id) => {
    if (window.confirm("Are you sure you want to cancel this order?")) {
      dispatch(cancelOrder(id)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Order cancelled successfully");
        } else {
          toast.error(res.payload || "Failed to cancel order");
        }
      });
    }
  };

  const handleDeleteOrder = (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteOrder(id)).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          toast.success("Order deleted successfully");
        } else {
          toast.error(res.payload || "Failed to delete order");
        }
      });
    }
  };

  const handleReturnOrder = () => {
    if (!selectedOrder) return toast.warning("No order selected");
    if (!returnReason.trim())
      return toast.warning("Please enter return reason");

    dispatch(
      returnOrder({ orderId: selectedOrder.id, reason: returnReason })
    ).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Order returned successfully");
        setReturnReason("");
        setSelectedOrder(null);
        document
          .querySelector('#returnOrderModal [data-bs-dismiss="modal"]')
          ?.click();
      } else {
        toast.error(res.payload || "Failed to return order");
      }
    });
  };

  return (
    <div className="container mt-5">
      <h2 className="text-primary mb-4">My Orders</h2>

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : orders.length === 0 ? (
        <div className="text-center my-5">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
            alt="No Orders"
            style={{ width: "100px", opacity: 0.7 }}
          />
          <h5 className="mt-3 text-muted">No orders found.</h5>
        </div>
      ) : (
        <div className="row">
          {orders.map((order) => (
            <div className="col-md-6 mb-4" key={order.id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h5>Order #{order.id}</h5>
                    <span
                      className={`badge bg-${getStatusColor(order.status)}`}
                    >
                      {getStatusIcon(order.status)} {order.status}
                    </span>
                  </div>
                  <small className="text-muted">
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </small>
                  <div className="table-responsive mt-3">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items.map((item, i) => (
                          <tr key={i}>
                            <td>{item.title}</td>
                            <td>{item.quantity}</td>
                            <td>₹{item.price.toLocaleString()}</td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="2" className="fw-bold text-end">
                            Total:
                          </td>
                          <td className="fw-bold">
                            ₹{order.total.toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mt-3">
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
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Return Order</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
              />
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
              <button className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button className="btn btn-primary" onClick={handleReturnOrder}>
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
