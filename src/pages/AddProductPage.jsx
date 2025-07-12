import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProduct } from "../redux/slices/productsSlice";
import { FaUpload } from "react-icons/fa";
import { toast } from "react-toastify";

const AddProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  });
  const [imagePreview, setImagePreview] = useState("");

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
    if (!formData.image) return toast.error("Please upload an image");

    const productData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      category: formData.category.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      quantity: 1,
    };

    try {
      await dispatch(addProduct(productData)).unwrap();
      toast.success("Product added successfully!");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to add product");
    }
  };

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
                📦 Add New Product
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
                    <label className="form-label">Price (INR)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="0.00"
                      required
                      min="0"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Fashion">Fashion</option>
                      <option value="Home">Home</option>
                      <option value="Books">Books</option>
                      <option value="Sports">Sports</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Product Image</label>
                    <div className="input-group">
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleImageUpload}
                        required
                      />
                      <label className="input-group-text bg-primary text-white">
                        <FaUpload />
                      </label>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="4"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter product description"
                      required
                    ></textarea>
                  </div>

                  {imagePreview && (
                    <div className="col-12 text-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-thumbnail shadow-sm"
                        style={{ maxWidth: "200px", borderRadius: "10px" }}
                      />
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-success w-100 mt-4 py-2 fs-5 shadow-sm rounded-pill"
                >
                  ✅ Add Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
