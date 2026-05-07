import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FormInput = ({ label, type, name, value, onChange, required, minLength }) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="mb-3">
      <label className="form-label text-secondary fw-500">{label}</label>
      <div className="input-group">
        <input
          type={inputType}
          className="form-control p-2"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          minLength={minLength}
        />
        {isPassword && (
          <button
            type="button"
            className="btn btn-outline-secondary d-flex align-items-center"
            onClick={togglePasswordVisibility}
            tabIndex="-1"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
};

export default FormInput;
