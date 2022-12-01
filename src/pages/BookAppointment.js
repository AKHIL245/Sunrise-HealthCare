import { API as Backendcall } from 'aws-amplify';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { FormDataFieldsFunc as FormData } from "../customlibraries/LibHooks";
import Modal from "react-bootstrap/Modal";
import { getAllAppointments } from '../graphql/queries';
import React, { useRef as Ref, useEffect , useState } from 'react';
import { createAppntment } from '../graphql/mutations';
import { getAllDoctors } from '../graphql/queries';

export default function BookAppointment(props) {
  const date =  new Date();
  const [formData, handleFieldChange] = FormData({
    appDate: date.getDate,
    appDate: date.getTime
  });
  const appointment = Ref(null);
  const [visitReason,setVisitReason] = useState("")
  const [error, setError] = useState([]);
  const [prefDoc,setPrefDoc] = useState("")
  const [doc, setDoc]= useState([]);
  const [appDate,setAppDate] = useState(null);
  const [appTime, setAppTime] = useState(null);
  

  useEffect(() => {
    getAllDoctors();
    }, []);



}