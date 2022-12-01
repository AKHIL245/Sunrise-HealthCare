import Modal from "react-bootstrap/Modal";
import { API as Backendcall } from 'aws-amplify';
import Form from "react-bootstrap/Form";
import React, { useRef as Ref , useState } from 'react';
import Button from "react-bootstrap/Button";
import { FormDataFieldsFunc as FormData } from "../customlibraries/LibHooks";
import { doctorUpdate } from '../graphql/mutations';

export default function ModalDoctor(props) {
  const [error, setError] = useState([]);
  const [formData, onChangeData] = FormData({
    phone: "",
    address: ""
  });
  const doctor = Ref(null);
  async function formDataSubmit(data) {
    data.preventDefault();
    try {
      await Backendcall.graphql({ query: doctorUpdate, variables: { input: {id: props.doctor.id, phone: formData.phone, address: formData.address} } });
    } 
    catch (event) {
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

    </Modal>
  );
}