import React from 'react';

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
}

const Slider: React.FC<SliderProps> = ({ value, onChange }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(event.target.value));
  };

  return(
    <div>
      <input 
        type="range" 
        min="0" 
        max="100" 
        value={value} 
        onChange={handleChange}
        className="slider" 
        id="myRange" 
      />
    </div>
  );
}

export default Slider;