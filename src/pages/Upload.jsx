/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import PocketBase from "pocketbase";
import "./Upload.css";
import { useNavigate } from "react-router-dom";

const pb = new PocketBase("https://pocketbase-render-ycpw.onrender.com");

const categoriesOptions = [
  "Accessories",
  "Sports",
  "Art & Collectibles",
  "Bath & Beauty",
  "Clothing",
  "Craft Supplies & Tools",
  "Electronics & Accessories",
  "Gifts",
  "Home & Living",
  "Jewelry",
  "Paper & Party Supplies",
  "Pet Supplies",
  "Shoes",
  "Toys & Games",
];

const UploadProduct = async (data) => {
  try {
    const record = await pb.collection("items").create(data);
    console.log("Product uploaded successfully:", record);
    return record;
  } catch (error) {
    console.error("Error uploading product:", error);
    throw error;
  }
};

const ProductUploadForm = () => {
  const navigate = useNavigate()
  const loggedInUserame = localStorage.getItem("loggedInUsername");
  const [formData, setFormData] = useState({
    uploaded_by: loggedInUserame,
    item: "",
    amount: "",
    initial_price: "",
    categories: categoriesOptions[0],
    image: null,
  });
  const [placeholder] = useState("300 X 300")

  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { image, ...data } = formData;

    if (!image) {
      alert("Please select an image.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("uploaded_by", data.uploaded_by);
      formDataToSend.append("item", data.item);
      formDataToSend.append("amount", data.amount);
      formDataToSend.append("initial_price", data.initial_price);
      formDataToSend.append("categories", data.categories);
      formDataToSend.append("field", image);

      await UploadProduct(formDataToSend);

      setFormData({
        uploaded_by: "",
        item: "",
        amount: "",
        initial_price: "",
        categories: categoriesOptions[0],
        image: null,
      });
      setImagePreview(null);
    } catch (error) {
      alert("Failed to upload product. Please try again.");
    }
    navigate("/")
  };

  return (
    <>
      <div className="parent-upload">
        <form onSubmit={handleSubmit} className="form">
          <div>
            <div className="input-field">
              <label>product name</label>
              <input
                type="text"
                name="item"
                value={formData.item}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-field">
              <label>quantity</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
            <div className="input-field">
              <label>starting bid</label>
              <input
                type="number"
                name="initial_price"
                value={formData.initial_price}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="categories-label">categories </label>
              <select
                className="select-form"
                name="categories"
                value={formData.categories}
                onChange={handleChange}
                required
              >
                {categoriesOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="upload-container">
            <div>
              <label >upload image</label>
              <input
                className="upload-imapge-field"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
            </div>

            <div className="image-previews">
              <img src={imagePreview} alt={placeholder} />
            </div>

            <button type="submit" className="upload-button">Upload Product</button>
          </div>
        </form>
      </div>
    </>
  );
};

export default ProductUploadForm;
