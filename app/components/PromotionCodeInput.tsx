import React, { useState } from 'react';
import axios from 'axios';

interface PromotionCodeInputProps {
  promotionCode: string;
  setPromotionCode: React.Dispatch<React.SetStateAction<string>>;
  setDiscountAmount: React.Dispatch<React.SetStateAction<number>>;
  promotionError: string | null;
  setPromotionError: React.Dispatch<React.SetStateAction<string | null>>;
}

const PromotionCodeInput: React.FC<PromotionCodeInputProps> = ({
  promotionCode,
  setPromotionCode,
  setDiscountAmount,
  promotionError,
  setPromotionError,
}) => {
  const [promotionAttempts, setPromotionAttempts] = useState<number>(0);

  const handlePromotionCodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPromotionCode(event.target.value);
  };

  const validatePromotionCode = async () => {
    if (promotionAttempts >= 5) {
      setPromotionError('Maximum promotion code attempts reached');
      return;
    }

    try {
      const response = await axios.post('/api/validate_promotion_code', {
        code: promotionCode,
      });
      if (response.data.valid) {
        setDiscountAmount(response.data.amount_off);
        setPromotionError(null);
      } else {
        setPromotionError('Invalid promotion code');
        setDiscountAmount(0);
      }
    } catch (error: any) {
      setPromotionError('Error validating promotion code');
      setDiscountAmount(0);
    } finally {
      setPromotionAttempts(promotionAttempts + 1);
    }
  };

  const handleRemovePromotionCode = () => {
    setPromotionCode('');
    setDiscountAmount(0);
    setPromotionError(null);
    setPromotionAttempts(0);
  };

  return (
    <div>
      <h2>Promotion Code</h2>
      <input
        type="text"
        value={promotionCode}
        onChange={handlePromotionCodeChange}
        disabled={promotionAttempts >= 5}
      />
      <button type="button" onClick={validatePromotionCode} disabled={promotionAttempts >= 5}>
        Apply
      </button>
      <button type="button" onClick={handleRemovePromotionCode} disabled={!promotionCode}>
        Remove
      </button>
      {promotionError && <div style={{ color: 'red' }}>{promotionError}</div>}
    </div>
  );
};

export default PromotionCodeInput;
