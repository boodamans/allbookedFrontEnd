import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Card, CardBody, CardTitle } from "reactstrap";
import allbookedApi from "../api/allbookedApi";
import UserContext from "../context/UserContext";

function Signup({ onSignupSuccess }) {
  const navigate = useNavigate();
  const { loginUser } = useContext(UserContext); 
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await allbookedApi.signup(formData);
      allbookedApi.token = token;
      onSignupSuccess(token);
      loginUser(formData.username, formData.password);
      console.log(token)
      navigate("/")
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <CardBody>
      <Card>
        <CardTitle className="font-weight-bold text-center">
          <h2>Sign Up!</h2>
        </CardTitle>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="username">Username</Label>
            <Input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label for="firstName">First Name</Label>
            <Input
              type="text"
              name="firstName"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="lastName">Last Name</Label>
            <Input
              type="text"
              name="lastName"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </FormGroup>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
            />
          </FormGroup>
          <Button type="submit" color="primary">
            Sign Up
          </Button>
        </Form>
      </Card>
    </CardBody>
  );
}

export default Signup;