import { useState, useId } from "react";
import styles from "./Input.module.css";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

const Input = ({
  id = "",
  type,
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

  // Common onChange handler
  const handleChange = (e) => setValue(e.target.value);

  if (role === "number") {
    return (
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
  }

  if (role === "password") {
    return (
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
  }

  if (role === "select") {
    return (
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
  }

  if (role === "date") {
    return (
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
  }

  // Default text-like inputs (text, email, etc.)
  return (
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
};

export default Input;
