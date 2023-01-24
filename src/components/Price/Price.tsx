import React, { forwardRef } from "react";
import styles from "../../components/Price/index.module.scss";

interface IPrice {
onChange : (event: React.ChangeEvent<HTMLInputElement>) => void; 
placeholder: string; 
size: number;
}

const Price = forwardRef<HTMLInputElement, IPrice>(({ placeholder, onChange, size }, ref) => {
  return (
    <label>
      <input
        type="text"
        className={styles.price}
        size={size}
        ref={ref}
        placeholder={placeholder}
        onChange={(event) => onChange(event)}
      ></input>
    </label>
  );
});

export default Price;
