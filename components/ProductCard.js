"use client";

import React from "react";

function ProductCard({ product, increaseQuantity, decreaseQuantity, addToCart }) {
  return (
    <div className="product-card">

      <img
        src={product.image}
        alt={product.name}
      />

      <h2>{product.name}</h2> 

      <p>{product.description}</p>

      <p className="product-category">
        <strong>Category:</strong> {product.category_name}
      </p>

      <p className="product-price">
        <strong className="price">Price:</strong> RS {product.price}
      </p>
      <p>
        <strong>Available:</strong> {product.quantity}
      </p>

      <div className="quantity">

        <strong>Quantity:</strong>

        <button
          onClick={() => decreaseQuantity(product)}
        >
          -
        </button>

        {/* <span>{product.quantity}</span> */}
        <span>{product.selectedQuantity}</span>

        <button
          onClick={() => increaseQuantity(product)}
        >
          +
        </button>

      </div>

      <button
        className="cart-button"
        onClick={() => addToCart(product)}
      >
        Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;