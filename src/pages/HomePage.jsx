import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";
import { fetchProducts } from "../redux/slices/productsSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaSearch, FaStar, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import Spinner from "../components/Spinner";

const ProductModal = ({ show, handleClose, product }) => {
  if (!product) return null;
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{product.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img
          src={
            product.image || "https://via.placeholder.com/400x300?text=No+Image"
          }
          alt={product.title}
          className="img-fluid mb-3 rounded"
        />
        <p className="text-muted">{product.description}</p>
        <h5 className="text-primary">₹{product.price.toLocaleString()}</h5>
        <p className="mb-0">
          <FaStar className="text-warning" /> {product.rating || 4.2} / 5.0
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const products = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);
  const user = useSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(75000);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortOption, setSortOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).sort();

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPrice = product.price <= maxPrice;
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(product.category);
      return matchesSearch && matchesPrice && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-low-high":
          return a.price - b.price;
        case "price-high-low":
          return b.price - a.price;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddToCart = (product) => {
    if (!user) {
      navigate("/signin");
      return;
    }
    dispatch(addToCart(product));
    toast.success("Product added to cart!");
  };

  return (
    <div className="container-fluid px-4">
      <div className="row g-0">
        {/* Sidebar */}
        <div className="col-md-2 bg-white shadow-sm sidebar-fixed p-3">
          <h5 className="fw-bold mb-3 text-primary">Explore</h5>
          <div className="mb-4">
            <label className="form-label fw-semibold">
              Max Price: ₹{maxPrice}
            </label>
            <input
              type="range"
              className="form-range"
              min="1"
              max="100000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <h6 className="fw-semibold">Category</h6>
            {categories.map((category) => (
              <div key={category} className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() =>
                    setSelectedCategories((prev) =>
                      prev.includes(category)
                        ? prev.filter((c) => c !== category)
                        : [...prev, category]
                    )
                  }
                  id={`check-${category}`}
                />
                <label
                  className="form-check-label"
                  htmlFor={`check-${category}`}
                >
                  {category}
                </label>
              </div>
            ))}
            {categories.length > 0 && (
              <button
                className="btn btn-sm btn-outline-secondary mt-2"
                onClick={() => setSelectedCategories([])}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-10 px-5 py-4 main-content">
          {/* Top Controls */}
          <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
            <h5 className="fw-bold text-primary m-0">Explore Products</h5>
            <div className="d-flex align-items-center gap-3 flex-wrap">
              <select
                className="form-select w-auto"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="">Sort By</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
              <div className="input-group w-auto">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="input-group-text">
                  <FaSearch />
                </span>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="row g-4 mt-4">
            {loading ? (
              <div className="text-center py-5">
                <Spinner />
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="text-center py-5">
                <p className="text-muted">No products match your filters.</p>
              </div>
            ) : (
              paginatedProducts.map((product) => (
                <div key={product.id} className="col-md-4 fade-in">
                  <div
                    className="card h-100 border-0 product-card shadow-lg rounded-4"
                    style={{ minHeight: "420px" }}
                  >
                    {/* Image Container */}
                    <div className="image-container position-relative rounded-top">
                      <img
                        src={
                          product.image ||
                          "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={product.title}
                        className="hover-zoom"
                        onClick={() => {
                          setSelectedProduct(product);
                          setShowModal(true);
                        }}
                      />
                    </div>

                    {/* Card Body */}
                    <div className="card-body d-flex flex-column p-3">
                      <h5 className="card-title text-truncate fw-semibold text-dark">
                        {product.title}
                      </h5>
                      <p className="card-text text-muted small mb-2 text-truncate">
                        {product.description}
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-auto">
                        <span className="badge text-white px-3 py-2 rounded-pill">
                          ₹{product.price}
                        </span>
                        <button
                          className="btn btn-outline-primary btn-sm px-3 rounded-pill"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {!loading && filteredProducts.length > 0 && (
            <div className="d-flex justify-content-center mt-5">
              <ul className="pagination pagination-sm">
                <li
                  className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    <FaArrowLeft />
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => (
                  <li
                    key={i}
                    className={`page-item ${
                      currentPage === i + 1 ? "active" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </button>
                  </li>
                ))}
                <li
                  className={`page-item ${
                    currentPage === totalPages ? "disabled" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    <FaArrowRight />
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <ProductModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default HomePage;
