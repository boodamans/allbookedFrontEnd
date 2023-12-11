import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Card, CardBody, CardTitle } from "reactstrap";
import allbookedApi from "../api/allbookedApi";
import UserContext from "../context/UserContext";

function EditProfile() {
  const navigate = useNavigate();
  const { currentUser, loginUser } = useContext(UserContext);
  const initialFormData = currentUser
    ? {
        password: "",
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
      }
    : null;

  const [formData, setFormData] = useState(initialFormData);
  
  // Effect to update form data when currentUser changes
  useEffect(() => {
    if (!currentUser) {
      navigate("/"); // Redirect to home if no user is logged in
    } else {
      // Update form data when currentUser changes
      setFormData({
        password: "",
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
      });
    }
  }, [currentUser, navigate]);

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
      const updatedUser = await allbookedApi.saveProfile(currentUser.username, formData);
      loginUser(updatedUser.username, formData.password);
      navigate("/");
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  return (
    <div>
      {currentUser ? (
        <CardBody>
          <Card>
            <CardTitle className="font-weight-bold text-center">
              <h2>Edit Profile</h2>
            </CardTitle>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label for="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
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
                Save Changes
              </Button>
            </Form>
          </Card>
        </CardBody>
      ) : (
        <div>
            {/* empty div lol */}
        </div>
      )}
    </div>
  );
  
}

export default EditProfile;