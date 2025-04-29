/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import PocketBase from "pocketbase";
import './Navbar.css'

const pb = new PocketBase("https://pocketbase-render-ycpw.onrender.com");

const ManageAssets = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionItemId, setActionItemId] = useState(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const loggedInUsername = localStorage.getItem("loggedInUsername");

  useEffect(() => {
    fetchItems();
  }, [loggedInUsername]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const records = await pb.collection("items").getFullList({
        filter: `uploaded_by = "${loggedInUsername}"`,
      });
      setItems(records);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async (itemId) => {
    const confirmSell = window.confirm("Do you really wanna make the final call?");
    if (confirmSell) {
      try {
        await pb.collection("items").delete(itemId);
        fetchItems();
      } catch (error) {
        console.error("Failed to sell item:", error);
      }
    }
  };

  const handleDelete = async (itemId) => {
    const userInput = prompt("Type CONFIRM to remove this item permanently:");
    if (userInput === "CONFIRM") {
      try {
        await pb.collection("items").delete(itemId);
        fetchItems();
      } catch (error) {
        console.error("Failed to remove item:", error);
      }
    } else {
      alert("Removal cancelled. You did not type CONFIRM exactly.");
    }
  };

  if (loading) {
    return <div className='eyes' style={{ paddingTop: "20px" }}>
      <div>
        <div class="loader"></div>
        <div class="loader"></div>
      </div>
      <p>Loading your assets...</p>
    </div>;
  }

  if (items.length === 0) {
    return <div className='eyes' style={{ paddingTop: "20px" }}>
      <div>
        <div class="loader"></div>
        <div class="loader"></div>
      </div>
      <p>You dont have any</p>
    </div>;
  }

  return (
    <div style={{ padding: "20px 50px 20px 50px" }}>
      <p className="manage-text">Manage Your Assets</p>
      <div className="manage-parent">
        {items.map((item) => (
          <div key={item.id} className="manage-card">
            <img
              className="manage-image"
              src={`https://pocketbase-render-ycpw.onrender.com/api/files/items/${item.id}/${item.field}`}
              alt={item.item}
            />
            <div className="le-info">
              <p className="manage-title">{item.item}</p>
              <p><strong>Current Bid:</strong> ${item.current_price ? item.current_price : item.initial_price}</p>
              <p><strong>First Bid:</strong> ${item.initial_price}</p>
              <p><strong>Last bid by:</strong> {item.last_bid || "No bids yet"}</p>
              <p><strong>Total bids:</strong> {item.bids}</p>

              <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => handleSell(item.id)}
                  className="login-button-2"
                >
                  Sell
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="login-button-2"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAssets;
