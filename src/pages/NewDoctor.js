import React, { useEffect , useState } from 'react';
import { useHistory } from "react-router-dom";
import { API as Backendcall } from 'aws-amplify';
import Form from "react-bootstrap/Form";
import { FormDataFieldsFunc as FormData } from "../customlibraries/LibHooks";
import { Auth as auth } from 'aws-amplify';
import Button from "react-bootstrap/Button";
import { isRoleAdmin } from '../components/CognitoUserRolesInfo';
import { doctorData } from '../graphql/mutations';
import { AmplifyChatbot } from "@aws-amplify/ui-react";
import "./NewDoctor.css";

export default function NewDoctor(props) {
  
  const [formData, onChangeData] = FormData({
    fistName: "",
    lastName: "",
    phone: "",
    address: "",
  });
  const [roleAdmin, setRoleAdmin] = useState(false);
  const history = useHistory();
  const [error, setError] = useState([]);
  const [doctorData, setDoctorData] = useState({ payload: { username: '' } });

  useEffect(() => {
    getSesssionDetails();
    getUserRole();
  }, []);

  async function getUserRole() {
    const admin = await isRoleAdmin();
    setRoleAdmin(admin);
}
  async function getSesssionDetails() {
    await auth.currentAuthenticatedUser().then((userInfo) => {
        setDoctorData(userInfo.signInUserSession.accessToken);
      }).catch((error) => console.log("There was an issue", error));
  }
  function RenderListDoctorButton()
  {
    if(roleAdmin)
    {
      return (
        <Button variant="primary" onClick={() => {
          history.push('/listdoctor')
        }}>
          List Doctor
        </Button>
      )
    }
    return (
      <></>
    )
  }
  async function formDataSubmit(data) {
    data.preventDefault();
    try {
      await Backendcall.graphql({ query: doctorData, variables: { input: { firstName: formData.firstName, lastName: formData.lastName, id: doctorData.payload.username, phone: formData.phone, address: formData.address } } });
    } catch (error) {
      setError(error.errors);
    }
    history.push("/");
  }

  function triggerForm() {
    return (
      <div>
        <RenderListDoctorButton />
        <Form onSubmit={formDataSubmit}>
          <Form.Group controlId="firstName" size="lg">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              value={formData.firstName}
              onChange={onChangeData}
              type="text"
            />
          </Form.Group>
          <Form.Group controlId="lastName" size="lg">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              value={formData.lastName}
              onChange={onChangeData}
              type="text"
            />
          </Form.Group>
          <Form.Group controlId="address" size="lg">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={formData.address}
              onChange={onChangeData}
              type="text"
            />
          </Form.Group>
          <Form.Group controlId="phone" size="lg">
            <Form.Label>Mobile Phone</Form.Label>
            <Form.Control
              value={formData.phone}
              onChange={onChangeData}
              type="text"
            />
          </Form.Group>

          <Button block size="lg" type="submit" >
            Register
          </Button>
        </Form>
      </div>
    );
  }
return <div className="createdoctor"> <h1>Register Doctor</h1> {triggerForm()} </div>;
}
