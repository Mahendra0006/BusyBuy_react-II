import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaShoppingCart,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaPrint,
  FaDownload,
  FaArrowLeft,
  FaTrash,
  FaBan,
} from "react-icons/fa";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import {
  fetchOrders,
  cancelOrder,
  deleteOrder,
} from "../redux/slices/ordersSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);
  const user = useSelector((state) => state.auth.user);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders(user.uid));
    }
  }, [dispatch, user]);

  const order = orders.find((order) => order.id === id);

  const handleCancelOrder = async () => {
    if (order.status !== "pending") {
      toast.warning("This order cannot be cancelled");
      return;
    }

    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      setActionLoading(true);
      await dispatch(cancelOrder(order.id)).unwrap();
      toast.success("Order cancelled successfully");
      dispatch(fetchOrders(user.uid));
    } catch (error) {
      toast.error(error.message || "Failed to cancel order");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOrder = async () => {
    if (
      !window.confirm("Are you sure you want to delete this order permanently?")
    ) {
      return;
    }

    try {
      setActionLoading(true);
      await dispatch(deleteOrder(order.id)).unwrap();
      toast.success("Order deleted successfully");
      navigate("/myorders");
    } catch (error) {
      toast.error(error.message || "Failed to delete order");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaClock className="text-warning" />;
      case "completed":
        return <FaCheckCircle className="text-success" />;
      case "cancelled":
        return <FaTimesCircle className="text-danger" />;
      case "returned":
        return <FaShoppingCart className="text-info" />;
      default:
        return null;
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
      case "returned":
        return "info";
      default:
        return "secondary";
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <Spinner />
            <h6 className="mt-3">Fetching your order details...</h6>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger text-center">{error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info text-center">Order not found</div>
      </div>
    );
  }

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="row">
        {/* Left Card */}
        <div className="col-md-8 mb-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="text-primary fw-bold mb-0">Order #{order.id}</h4>
                <div
                  className={`badge bg-${getStatusColor(
                    order.status
                  )} p-2 rounded-pill shadow-sm d-flex align-items-center`}
                >
                  {getStatusIcon(order.status)}
                  <span className="ms-2">{order.status.toUpperCase()}</span>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="text-muted small mb-1">Order Date:</h6>
                <p className="mb-0">
                  {new Date(order.createdAt).toLocaleString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <div className="table-responsive">
                <table className="table table-striped table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="me-3"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                            <div>
                              <h6 className="mb-0">{item.title}</h6>
                              <small className="text-muted">
                                ID: {item.productId}
                              </small>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="badge bg-primary rounded-pill">
                            {item.quantity}
                          </span>
                        </td>
                        <td>
                          ₹
                          {item.price.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </td>
                        <td>
                          ₹
                          {(item.price * item.quantity).toLocaleString(
                            "en-IN",
                            { minimumFractionDigits: 2 }
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr className="table-light fw-bold">
                      <td colSpan="3" className="text-end">
                        Total Amount:
                      </td>
                      <td>
                        ₹
                        {order.total.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {order.returnReason && (
                <div className="alert alert-warning mt-4 shadow-sm">
                  <h6 className="mb-1">Return Reason:</h6>
                  <p className="mb-0">{order.returnReason}</p>
                </div>
              )}

              {/* Order Actions */}
              <div className="mt-4">
                <h6 className="text-muted mb-2">Order Actions</h6>
                <div className="d-flex flex-wrap gap-2">
                  <button
                    className="btn btn-outline-dark btn-sm shadow-sm"
                    onClick={() => window.print()}
                    disabled={actionLoading}
                  >
                    <FaPrint className="me-2" />
                    Print Invoice
                  </button>
                  <button
                    className="btn btn-outline-info btn-sm shadow-sm"
                    onClick={() => toast.info("PDF download coming soon!")}
                    disabled={actionLoading}
                  >
                    <FaDownload className="me-2" />
                    Download PDF
                  </button>
                  {order.status === "pending" && (
                    <>
                      <button
                        className="btn btn-outline-danger btn-sm shadow-sm"
                        onClick={handleCancelOrder}
                        disabled={actionLoading}
                      >
                        <FaBan className="me-2" />
                        Cancel Order
                      </button>
                      <button
                        className="btn btn-danger btn-sm shadow-sm"
                        onClick={handleDeleteOrder}
                        disabled={actionLoading}
                      >
                        <FaTrash className="me-2" />
                        Delete Order
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card - Summary */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body">
              <h5 className="text-primary fw-bold mb-4">Order Summary</h5>

              <div className="mb-3">
                <h6 className="text-muted small mb-1">Status:</h6>
                <div className={`badge bg-${getStatusColor(order.status)} p-2`}>
                  {order.status.toUpperCase()}
                </div>
              </div>

              <div className="mb-3">
                <h6 className="text-muted small mb-1">Order Date:</h6>
                <p className="mb-0">
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted small mb-1">Total Amount:</h6>
                <p className="fw-semibold">
                  ₹
                  {order.total.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>

              <div className="mb-3">
                <h6 className="text-muted small mb-1">Payment Status:</h6>
                <div
                  className={`badge bg-${
                    order.status === "completed" ? "success" : "warning"
                  } p-2`}
                >
                  {order.status === "completed" ? "Paid" : "Pending"}
                </div>
              </div>

              <div className="mt-4">
                <button
                  className="btn btn-outline-primary w-100 shadow-sm"
                  onClick={() => navigate("/myorders")}
                >
                  <FaArrowLeft className="me-2" />
                  Back to Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
