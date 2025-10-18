import { useState, useId } from "react";
import styles from "./Input.module.css";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const Input = ({
  id = "",
  type,
  label,
  role,
  required,
  placeholder,
  value,
  setValue,
  name,
  options = [],
  min,
  max,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const generatedId = useId();
  const finalId = id + generatedId;

  const inputClass = styles[`input${type}`] || styles.input3;
  const filterInput = type === 3 ? styles.input3 : styles.filterInput;

  const handleChange = (e) => setValue(e.target.value);

  let inputElement;

  if (role === "number") {
    inputElement = (
      <input
        id={finalId}
        type="text"
        inputMode="numeric"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          const newValue = e.target.value;
          if (/^\d*$/.test(newValue)) {
            setValue(Number(newValue));
          }
        }}
        className={inputClass}
        required={required}
      />
    );
  } else if (role === "password") {
    inputElement = (
      <div className={styles.passwordContainer}>
        <input
          id={finalId}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={inputClass}
          required={required}
        />
        <button
          type="button"
          className={styles.passwordToggle}
          style={{ opacity: value.length ? 1 : 0 }}
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? (
            <IoEyeOutline size={26} color="#5f6365" />
          ) : (
            <IoEyeOffOutline size={26} color="#5f6365" />
          )}
        </button>
      </div>
    );
  } else if (role === "select") {
    inputElement = (
      <select
        id={finalId}
        name={name}
        value={value}
        required={required}
        onChange={handleChange}
        className={filterInput}
      >
        <option value="">{placeholder || "Select"}</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  } else if (role === "date") {
    inputElement = (
      <input
        id={finalId}
        name={name}
        type="date"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={filterInput}
        required={required}
        min={min}
        max={max}
      />
    );
  } else if (role === "image") {
    inputElement = (
      <input
        id={finalId}
        name={name}
        className={filterInput}
        type="file"
        accept="image/*"
        onChange={ setValue}
        required={required}
      />
    );
  } else {
    inputElement = (
      <input
        id={finalId}
        type={role}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={inputClass}
        required={required}
      />
    );
  }

  return (
    <div className={styles.inputWrapper}>
      {label && (
        <label
          htmlFor={finalId}
          className="block mb-1 ml-1 text-sm font-medium text-gray-900 cursor-pointer"
        >
          {label}
        </label>
      )}
      {inputElement}
    </div>
  );
};

export default Input;
