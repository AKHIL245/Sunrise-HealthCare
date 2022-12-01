import React, { useRef as Ref , useState } from 'react';
import Modal from "react-bootstrap/Modal";
import { FormDataFieldsFunc as FormData } from "../customlibraries/LibHooks";
import { API as Backendcall } from 'aws-amplify';
import Form from "react-bootstrap/Form";
import { patientUpdate } from '../graphql/mutations';
import Button from "react-bootstrap/Button";

export default function ModalPatient(props) {
  const [error, setError] = useState([]);
  const [formData, onChangeData] = FormData({
    phone: "",
    address: ""
  });
  const patient = Ref(null);
  async function formDataSubmit(data) {
    data.preventDefault();
    try {
      await Backendcall.graphql({ query: patientUpdate, variables: { input: {id: props.patient.id,firstName: formData.firstName,lastName: formData.lastName, phone: formData.phone,email: formData.email, address: formData.address,sex: formData.sex, ssn: formData.ssn,
      insuranceNumber: formData.insuranceNumber, birthDate: formData.birthDate+'T00:00:00.000Z'} } });
    } catch (event) {
      console.error('There is an issue', event);
      setError(event.errors);
    }
    
      alert("Successfully Updated!");
      formData.description = "";
      formData.address = "";
      props.onUpdated();
      props.onHide();
  }
  return (
    <Modal
      {...props}
      centered
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Edit Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formDataSubmit}>
        <Form.Group controlId="firstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
            type="text"
            placeholder={props.patient.firstName}
            onChange={onChangeData}
            value={formData.firstName}
            />
          </Form.Group>
          <Form.Group controlId="lastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              onChange={onChangeData}
              placeholder={props.patient.lastName}
              value={formData.lastName}
            />
          </Form.Group>
          <Form.Group controlId="sex">
            <Form.Label>Gender</Form.Label>
            <Form.Control
              placeholder={props.patient.sex}
              onChange={onChangeData}
              value={formData.sex}
              type="text"
            />
          </Form.Group>
          <Form.Group controlId="birthDate">
            <Form.Label>Birth Date</Form.Label>
            <Form.Control
              placeholder={props.patient.birthDate}
              onChange={onChangeData}
              value={formData.birthDate}
              type="date"
            />
          </Form.Group>
          <Form.Group controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={formData.address}
              placeholder={props.patient.address}
              type="text"
              onChange={onChangeData}
            />
          </Form.Group>
          <Form.Group controlId="phone">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              placeholder={props.patient.phone}
              onChange={onChangeData}
              value={formData.phone}
            />
          </Form.Group>
          <Form.Group controlId="email">
            <Form.Label>Email Id</Form.Label>
            <Form.Control
              value={formData.email}
              placeholder={props.patient.email}
              type="text"
              onChange={onChangeData}
            />
          </Form.Group>
          <Form.Group controlId="ssn">
            <Form.Label>SSN</Form.Label>
            <Form.Control
            placeholder={props.patient.ssn}
              onChange={onChangeData}
              value={formData.ssn}
              type="text"
            />
          </Form.Group>
          
          <Form.Group controlId="insuranceNumber">
            <Form.Label>Insurance Number</Form.Label>
            <Form.Control
              placeholder={props.patient.insuranceNumber}
              onChange={onChangeData}
              value={formData.insuranceNumber}
              type="text"
            />
          </Form.Group>

          <Button block type="submit" size="lg" >
            Update 
          </Button>

        </Form>

      </Modal.Body>

    </Modal>
  );
}