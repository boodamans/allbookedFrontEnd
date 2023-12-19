import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Card, CardBody, CardTitle } from "reactstrap";
import allbookedApi from "../api/allbookedApi";
import UserContext from "../context/UserContext";
import "./styles/EditProfile.css";

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
    <div className="edit-profile-container">
      {currentUser ? (
        <CardBody>
          <Card>
            <CardTitle className="font-weight-bold text-center">
              <h2>Edit Profile</h2>
            </CardTitle>
            <Form className="edit-profile-form" onSubmit={handleSubmit}>
              <FormGroup>
                <Label className="edit-profile-label" for="password">
                  Password
                </Label>
                <Input
                  className="edit-profile-input"
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label className="edit-profile-label" for="firstName">
                  First Name
                </Label>
                <Input
                  className="edit-profile-input"
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label className="edit-profile-label" for="lastName">
                  Last Name
                </Label>
                <Input
                  className="edit-profile-input"
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </FormGroup>
              <FormGroup>
                <Label className="edit-profile-label" for="email">
                  Email
                </Label>
                <Input
                  className="edit-profile-input"
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </FormGroup>
              <Button
                className="edit-profile-submit-button"
                type="submit"
                color="primary"
              >
                Save Changes
              </Button>
            </Form>
          </Card>
        </CardBody>
      ) : (
        <div>{/* empty div lol */}</div>
      )}
    </div>
  );
}

export default EditProfile;