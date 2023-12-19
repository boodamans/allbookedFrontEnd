import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardTitle } from "reactstrap";
import UserContext from "../context/UserContext";
import './styles/Login.css';

function Login({ onLoginSuccess }) {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext); 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await loginUser(formData.username, formData.password);
      navigate("/")
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="login-container">
      <Card>
        <div>
          <CardTitle className="font-weight-bold text-center">
            <h2>Login</h2>
          </CardTitle>
          <form className="login-form" onSubmit={handleSubmit}>
            <label className="login-label">
              Username:
              <input
                className="login-input"
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <label className="login-label">
              Password:
              <input
                className="login-input"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </label>
            <br />
            <button className="login-button" type="submit">
              Login
            </button>
          </form>
        </div>
      </Card>
    </div>
  );
}

export default Login;