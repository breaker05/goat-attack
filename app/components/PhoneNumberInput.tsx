import React from 'react';

interface PhoneNumberInputProps {
  index: number;
  phoneNumber: string;
  handlePhoneNumberChange: (index: number, value: string) => void;
  handleDeletePhoneNumber: (index: number) => void;
  error?: string;
}

const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({ index, phoneNumber, handlePhoneNumberChange, handleDeletePhoneNumber, error }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="Phone Number"
        value={phoneNumber}
        onChange={(e) => handlePhoneNumberChange(index, e.target.value)}
      />
      <button type="button" onClick={() => handleDeletePhoneNumber(index)}>Delete</button>
      {error && <div style={{color: 'red'}}>{error}</div>}
    </div>
  );
};

export default PhoneNumberInput;
