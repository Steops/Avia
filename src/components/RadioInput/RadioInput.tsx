import React from "react";
import styles from "./index.module.scss";

interface IRadioInput {
  setSortType: React.Dispatch<React.SetStateAction<string>>;
  sortType: string;
  type: string;
  name: string;
  checkboxName: string;
  setFlightsToShow:React.Dispatch<React.SetStateAction<number>>;
}

const RadioInput = ({
  setSortType,
  sortType,
  type,
  name,
  checkboxName,
  setFlightsToShow,
} : IRadioInput) => {
  return (
    <label
      onClick={() => {
        setSortType(sortType);
        setFlightsToShow(2);
      }}
    >
      <input type={type} name={name} className={styles.radioinput}></input>
      {checkboxName}
    </label>
  );
};

export { RadioInput };
