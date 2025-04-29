import React from 'react';
import "./Navbar.css";

const Categories = ({ sendValue, selected }) => {
    const categoriesOptions = [
        "All",
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

    const handleChange = (e) => {
        const selectedCategory = e.target.value;
        sendValue(selectedCategory);
    };

    return (
        <div>
            <select
                className="select-box"
                onChange={handleChange}
                value={selected || ""}
            >
                <option value="" disabled>
                    Categories
                </option>
                {categoriesOptions.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Categories;
