import React from 'react';
import './SweetCard.css';

const SweetCard = ({ sweet, onPurchase, purchasingId }) => {
    const isOutOfStock = sweet.quantity === 0;
    const isPurchasing = purchasingId === sweet._id; // Assuming _id from MongoDB

    return (
        <div className={`sweet-card ${isOutOfStock ? 'out-of-stock' : ''}`}>
            <div className="sweet-details">
                <h3>{sweet.name}</h3>
                <span className="category-tag">{sweet.category}</span>
                <p className="price">${sweet.price.toFixed(2)}</p>
                <p className="quantity">Stock: {sweet.quantity}</p>
            </div>
            <div className="sweet-actions">
                <button
                    className="purchase-btn"
                    disabled={isOutOfStock || isPurchasing}
                    onClick={() => onPurchase(sweet._id)}
                >
                    {isOutOfStock ? 'Out of Stock' : (isPurchasing ? 'Buying...' : 'Purchase')}
                </button>
            </div>
        </div>
    );
};

export default SweetCard;
