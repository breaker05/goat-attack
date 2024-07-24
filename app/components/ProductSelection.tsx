import React from 'react';
import { Product } from '../../types/product';

interface ProductSelectionProps {
  products: Product[];
  selectedProduct: string;
  handleProductChange: (productId: string) => void;
}

const ProductSelection: React.FC<ProductSelectionProps> = ({ products, selectedProduct, handleProductChange }) => {
  return (
    <div>
      <h2>Select a Product</h2>
      {products.map((product) => (
        <div key={product.id}>
          <input
            type="radio"
            id={product.id}
            name="product"
            value={product.id}
            checked={selectedProduct === product.id}
            onChange={() => handleProductChange(product.id)}
          />
          <label htmlFor={product.id}>
            {product.label} - {product.description} - ${(product.price / 100).toFixed(2)}
          </label>
        </div>
      ))}
    </div>
  );
};

export default ProductSelection;
