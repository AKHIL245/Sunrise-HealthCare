import { API as Backendcall, Storage as S3Bucket } from 'aws-amplify';
import Modal from "react-bootstrap/Modal";
import React, { useRef as Ref } from "react";
import Button from "react-bootstrap/Button";
import { FormDataFieldsFunc as FormData } from "../customlibraries/LibHooks";
import { prescriptionData } from '../graphql/mutations';
import Form from "react-bootstrap/Form";

export default function AddModalPrescription(props) {
  const [formData, onChangeData] = FormData({
    description: "",
  });
  const refFile = Ref(null);
  const SIZEMAX = 10000000;
  async function formSubmit(e) {
    e.preventDefault();

     if (refFile.current) {
      var uniqueId = require("uuid").v4();
      var filepath = uniqueId +"/"+refFile.current.name
      await Backendcall.graphql({ query: prescriptionData, variables: { input: {"appointmentId": props.appointment.id, "patientId": props.appointment.patientId, "fileName": filepath, "description": formData.description,"doctorId": props.appointment.doctorId} } });
      await S3Bucket.put(filepath, refFile.current,{ level: "public", });
      alert("Successfully Uploaded Prescription!");
      formData.description = "";
      props.onUploaded();
      props.onHide();
    } 
    else if (refFile.current && refFile.current.size > SIZEMAX) {
      alert(
        `Please upload a smaller file ${SIZEMAX / 1000000} MB.`
      );
      return;
    }
     else {
      alert("Please select one file to upload.");
    }
  }

  function onFileUpload(e) {
    refFile.current = e.target.files[0];
  }


}