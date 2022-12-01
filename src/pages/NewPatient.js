import { Auth } from 'aws-amplify';
import { PatientData } from '../graphql/mutations';
import { FormDataFieldsFunc } from "../customlibraries/LibHooks";
import React, { useState, useEffect } from 'react';
import { isRoleAdmin } from '../components/CognitoUserRolesInfo';
import Form from "react-bootstrap/Form";
import { API } from 'aws-amplify';
import Button from "react-bootstrap/Button";
import "./NewPatient.css";
import { useHistory } from "react-router-dom";

export default function NewPatient() {
  const [adminRole, setAdminRole] = useState(false);
    const [userData, setUserData] = useState({ payload: { username: '' } });
    const [ setErrorMessages] = useState([]);
    const [fields, handleChange] = FormDataFieldsFunc({
      firstName: "",
      lastName: "",
      insuranceNumber: "",
      phone: "",
      address: "",
      birthDate: "",
      sex: "",
    
    });
    const history = useHistory();
  
    useEffect(() => {
      fetchUserData();
      fetchRoles();
      }, []);

    

    function validate() {
      try {
        return (
          fields.firstName.length > 0 &&
          fields.lastName.length > 0 &&
          fields.insuranceNumber.length > 0 &&
          fields.phone.length > 0 &&
          fields.address.length > 0 &&
          fields.birthDate.length > 0 &&
          fields.sex.length > 0 
          
        );
      } catch (e) {
        return false;
      }
    }
  
    async function handleSubmit(event) {
      event.preventDefault();
      try {
        await API.graphql({ query: PatientData, variables: { input: {firstName: fields.firstName, lastName: fields.lastName,insuranceNumber: fields.insuranceNumber,  id: userData.payload.username, phone: fields.phone, email: fields.email, address: fields.address,
            birthDate: fields.birthDate, sex: fields.sex} } });
      } catch (e) {
        console.error('error registering patient', e);
        setErrorMessages(e.errors);
      }
      history.push("/patient");
    }
    
    async function fetchRoles() {
      const admin = await isRoleAdmin();
      setAdminRole(admin);
  }
    
    async function fetchUserData() {
      await Auth.currentAuthenticatedUser()
        .then((userSession) => {
          console.log("userData: ", userSession);
          setUserData(userSession.signInUserSession.accessToken);
        })
        .catch((e) => console.log("Not signed in", e));
    }
    function renderForm() {
      return (
        <div>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="firstName" className='small'  size="md">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" value={fields.firstName} onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="lastName" className='small'  size="md">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" value={fields.lastName} onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="insuranceNumber" size="md">
            <Form.Label>Insurance Number</Form.Label>
            <Form.Control type="text" value={fields.insuranceNumber} onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="phone" size="md">
            <Form.Label>Phone</Form.Label>
            <Form.Control type="text" value={fields.phone} onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="email" size="md">
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" value={fields.email} onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="address" size="md">
            <Form.Label>Address</Form.Label>
            <Form.Control type="text" value={fields.address} onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="birthDate" size="md">
            <Form.Label>Birth date</Form.Label>
            <Form.Control type="date" value={fields.birthDate} onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="sex" size="md">
            <Form.Label>Sex</Form.Label>
            <Form.Control  type="text"value={fields.sex} onChange={handleChange}
            />
          </Form.Group>
         
          <Button block className="btn-theme" size="md" type="submit" disabled={!validate()}>
            Register
          </Button>
        </Form>
        </div>
      );
    }
  
    return <div className="createpatient"> <h5>REGISTRATION</h5> {renderForm()} </div>;
}
