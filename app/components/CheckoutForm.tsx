"use client";

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import PhoneNumberInput from './PhoneNumberInput';
import ProductSelection from './ProductSelection';
import PromotionCodeInput from './PromotionCodeInput';
import { products } from '../../data/products';

const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? '';
const stripePromise = loadStripe(stripeKey);

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [promotionError, setPromotionError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<string>(products[0].id);
  const [promotionCode, setPromotionCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const validatePhoneNumber = (phoneNumber: string): boolean => {
    const phoneRegex = /^(\+1|1)?\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleAddPhoneNumber = () => {
    setPhoneNumbers([...phoneNumbers, '']);
    setErrors([...errors, '']);
  };

  const handlePhoneNumberChange = (index: number, value: string) => {
    const newPhoneNumbers = [...phoneNumbers];
    const newErrors = [...errors];
    newPhoneNumbers[index] = value;
    newErrors[index] = validatePhoneNumber(value) ? '' : 'Invalid US phone number';
    setPhoneNumbers(newPhoneNumbers);
    setErrors(newErrors);
  };

  const handleDeletePhoneNumber = (index: number) => {
    const newPhoneNumbers = phoneNumbers.filter((_, i) => i !== index);
    const newErrors = errors.filter((_, i) => i !== index);
    setPhoneNumbers(newPhoneNumbers);
    setErrors(newErrors);
  };

  const handleProductChange = (productId: string) => {
    setSelectedProduct(productId);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card Element not found');
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      //setError(error.message);
      return;
    }

    try {
      const { data: clientSecret } = await axios.post('/api/payment_intent', {
        phoneNumbers,
        paymentMethod: paymentMethod.id,
        productId: selectedProduct,
        promotionCode,
      });

      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        //setError(confirmError.message);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setPaymentSuccess(true);
        setPhoneNumbers([]);
        setErrors([]);
        setError(null);
        setPromotionCode('');
        setDiscountAmount(0);
      }
    } catch (error: any) {
      setError(error.response?.data?.error || error.message);
    }
  };

  const allPhoneNumbersValid = errors.every(error => error === '');
  const selectedProductDetails = products.find(p => p.id === selectedProduct);
  const totalPrice = selectedProductDetails
    ? (selectedProductDetails.price * phoneNumbers.length - discountAmount) / 100
    : 0;

  return (
    <div>
      {paymentSuccess ? (
        <div>
          <h2>Payment succeeded!</h2>
          <p>Your payment has been processed successfully. Send the goats!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <ProductSelection
            products={products}
            selectedProduct={selectedProduct}
            handleProductChange={handleProductChange}
          />
          <h2>Enter Phone Numbers</h2>
          {phoneNumbers.map((phoneNumber, index) => (
            <PhoneNumberInput
              key={index}
              index={index}
              phoneNumber={phoneNumber}
              handlePhoneNumberChange={handlePhoneNumberChange}
              handleDeletePhoneNumber={handleDeletePhoneNumber}
              error={errors[index]}
            />
          ))}
          <button type="button" onClick={handleAddPhoneNumber}>
            Add Number
          </button>
          {process.env.NEXT_PUBLIC_SHOW_PROMOTION_CODE === 'true' && (
            <PromotionCodeInput
              promotionCode={promotionCode}
              setPromotionCode={setPromotionCode}
              setDiscountAmount={setDiscountAmount}
              promotionError={promotionError}
              setPromotionError={setPromotionError}
            />
          )}
          <CardElement />
          {phoneNumbers.length > 0 && <div>Total Price: ${totalPrice.toFixed(2)}</div>}
          <button type="submit" disabled={!stripe || !allPhoneNumbersValid || phoneNumbers.length === 0}>
            Pay
          </button>
          {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
      )}
    </div>
  );
};

const Checkout: React.FC = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;

