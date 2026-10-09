"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiUrl } from "../lib/api";
import { isAdminLoggedIn } from "../lib/auth";

function AddProduct() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [categoryId, setCategoryId] = useState("");

  const router = useRouter();
  const API_URL = getApiUrl();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          `${API_URL}/categories`
        );

        const data = await response.json();

        console.log("Categories:", data);

        setCategories(data);
      } catch (error) {
        console.log("Categories error:", error);
      }
    };

    getCategories();
  }, [API_URL]);

  useEffect(() => {
    if (!isAdminLoggedIn()) {
      router.push("/admin-login");
    }
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    setImageFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please select a product image");
      return;
    }

    try {
      // Create FormData
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category_id", categoryId);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("image", imageFile);

      // Send product to FastAPI
      const response = await fetch(
        // "http://127.0.0.1:8000/products",
        `${API_URL}/products`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      console.log(
        "FastAPI product response:",
        data
      );

      if (!response.ok) {
        alert(
          data.message ||
          "Product could not be added"
        );
        return;
      }

      alert("Product added successfully!");

      // Clear form
      setName("");
      setDescription("");
      setImageFile(null);
      setImagePreview("");
      setPrice("");
      setQuantity("");
      setCategory("");
      setCategoryId("");

      router.push("/");
    } catch (error) {
      console.log(
        "Add product error:",
        error
      );

      alert("Unable to connect to server");
    }
  };

  return (
    <div className="add-product-container">

      <div className="add-product-box">

        <div className="add-product-header">
          <h1>Add Product</h1>
          <p>Add a new product to your store</p>
        </div>

        <form onSubmit={handleAddProduct}>

          <div className="form-group">
            <label>Product Name</label>

            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              placeholder="Enter product description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
            />
          </div>

          {/* <div className="form-group">
            <label>Category</label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              required
            >
              <option value="">
                Select Category
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Clothing">
                Clothing
              </option>

              <option value="Shoes">
                Shoes
              </option>

              <option value="Accessories">
                Accessories
              </option>

              <option value="Beauty">
                Beauty
              </option>

              <option value="Home">
                Home
              </option>
            </select>
          </div> */}

          <div className="form-group">
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="">
                Select Category
              </option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Product Image</label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              required
            />
          </div>

          {imagePreview && (
            <div className="image-preview">
              <img
                src={imagePreview}
                alt="Product Preview"
              />
            </div>
          )}

          <div className="form-row">

            <div className="form-group">
              <label>Price</label>

              <input
                type="number"
                placeholder="Rs. 0"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                placeholder="0"
                value={quantity}
                onChange={(e) =>
                  setQuantity(e.target.value)
                }
                min="0"
                required
              />
            </div>

          </div>

          <button
            type="submit"
            className="add-product-btn"
          >
            Add Product
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => router.push("/")}
          >
            Cancel
          </button>

        </form>

      </div>

    </div>
  );
}

export default AddProduct;
