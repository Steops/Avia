import React from "react";
import styles from "../Checkbox/index.module.scss";

interface ICheckbox {
  checkboxName: string; name?: string; type: string; onChange: () => void
}

const Checkbox = ({ checkboxName, name, type, onChange } : ICheckbox) => {
  return (
    <label onChange={onChange}>
      <input type={type} name={name} className={styles.checkbox}></input>
      {checkboxName}
    </label>
  );
};

export default Checkbox;
// event - объект события(чекбокса) onChange, event
