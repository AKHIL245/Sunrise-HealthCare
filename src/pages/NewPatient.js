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
    
}
