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

}