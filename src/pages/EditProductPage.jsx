import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { editProduct } from "../redux/slices/productsSlice";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";
import "../styles/EditProductPage.css";

const EditProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const products = useSelector((state) => state.products.items);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const product = products.find((p) => p.id === id);
    if (product) {
      setFormData({
        title: product.title,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        image: product.image,
      });
      setImagePreview(product.image);
    }
    setLoading(false);
  }, [id, products]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({
          ...formData,
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) return toast.error("Title is required");
    if (!formData.description.trim())
      return toast.error("Description is required");
    if (!formData.price || isNaN(formData.price))
      return toast.error("Please enter a valid price");
    if (!formData.category.trim()) return toast.error("Category is required");

    const productData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category.trim(),
    };

    try {
      await dispatch(editProduct({ id, product: productData })).unwrap();
      toast.success("Product updated successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to update product");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="container py-5"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      <div className="row justify-content-center">
        <div className="col-lg-10 col-md-12">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-5">
              <h2 className="card-title text-center mb-4 text-primary fw-bold">
                📦 Edit Product
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter product title"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Price</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      required
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                      rows="3"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Enter category"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Product Image</label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        id="inputGroupFileAddon04"
                      >
                        <FaUpload />
                      </button>
                    </div>
                    {imagePreview && (
                      <div className="mt-3">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="img-fluid"
                          style={{ maxWidth: "200px" }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-primary px-4 py-2"
                      style={{
                        backgroundColor: "#0d6efd",
                        border: "none",
                        borderRadius: "5px",
                        padding: "10px 20px",
                        fontSize: "16px",
                        fontWeight: "bold",
                        width: "100%",
                      }}
                    >
                      Update Product
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
