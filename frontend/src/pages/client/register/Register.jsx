import React, { useState, useEffect } from "react";
import { registerUserApi } from "../../../api/Api";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  // State for errors and validation
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  // Password validation and strength check
  const validatePassword = (password) => {
    let isValid = true;
    let messages = [];

    if (!/[A-Z]/.test(password)) {
      messages.push("Does not contain a capital letter");
      isValid = false;
    }
    if (!/[a-z]/.test(password)) {
      messages.push("Does not contain a lowercase letter");
      isValid = false;
    }
    if (!/[0-9]/.test(password)) {
      messages.push("Does not contain a number");
      isValid = false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      messages.push("Does not contain a special character");
      isValid = false;
    }

    if (password.length < 6) {
      messages.push("Password must be at least 6 characters long");
      isValid = false;
    }

    // Password strength logic
    if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password) && /[!@#$%^&*]/.test(password)) {
      setPasswordStrength("Strong");
    } else if (password.length >= 6) {
      setPasswordStrength("Weak");
    } else {
      setPasswordStrength("");
    }

    return { isValid, messages };
  };

  // Validation function
  const validate = () => {
    let isValid = true;
    setFirstNameError('');
    setLastNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');

    if (firstName.trim() === '') {
      setFirstNameError('Please enter first name');
      isValid = false;
    }
    if (lastName.trim() === '') {
      setLastNameError('Please enter last name');
      isValid = false;
    }
    if (email.trim() === '') {
      setEmailError('Please enter email');
      isValid = false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.messages.join(", "));
      isValid = false;
    }

    if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  // Submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const data = { firstName, lastName, email, password };

    registerUserApi(data).then((res) => {
      if (res.data.success === false) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        navigate('/login');
      }
    });
  };

  return (
    <div className="container-fluid">
      <div className="row justify-content-center">
        <div className="col-md-6 p-4">
          <h2>Welcome to <span className="text text-primary font-bold">GlamAura</span></h2>
          <h3 className="mt-1 mb-2 text-center text-3xl m-8 font-bold">Register</h3>
          <form className="mt-3" onSubmit={handleSubmit}>
            <div className="form-outline mb-2">
              <label>First Name</label>
              <input
                type="text"
                className='form-control'
                placeholder="Enter your first name"
                onChange={(e) => setFirstName(e.target.value)}
              />
              {firstNameError && <p className="text-danger">{firstNameError}</p>}
            </div>

            <div className="form-outline mb-2">
              <label>Last Name</label>
              <input
                type="text"
                className='form-control'
                placeholder="Enter your last name"
                onChange={(e) => setLastName(e.target.value)}
              />
              {lastNameError && <p className="text-danger">{lastNameError}</p>}
            </div>

            <div className="form-outline mb-2">
              <label>Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter Email"
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && <small className="text-danger">{emailError}</small>}
            </div>

            <div className="form-outline mb-2">
              <label>Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter Password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
              />
              {passwordError && <small className="text-danger">{passwordError}</small>}
              {password && passwordStrength && (
                <small className={`text-${passwordStrength === "Strong" ? "Success" : "Danger"}`}>
                  Password Strength: {passwordStrength}
                </small>
              )}
            </div>

            <div className="form-outline mb-2">
              <label>Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {confirmPasswordError && <small className="text-danger">{confirmPasswordError}</small>}
            </div>

            <div className="text-center mt-3">
              <button type="submit" className="btn btn-primary w-50">Register</button>
            </div>
          </form>

          <div className="text-center mt-4">
            <h4>
              Already have an account? <Link to="/login">Login</Link>
            </h4>
          </div>
        </div>
        <div className="col-md-6 image-container p-4">
          <img src="assets/images/register.avif" className="rounded img-fluid" alt="Register"/>
        </div>
      </div>
    </div>
  );
};

export default Register;
