import { Auth } from 'aws-amplify';
import React, { useState, useEffect } from 'react';
import { API,Storage } from 'aws-amplify';
import ModalPatient from "./ModalPatient";
import Appointment from "./BookAppointment";
import { deleteAppntmnt } from '../graphql/mutations';
import { AmplifyS3Image } from '@aws-amplify/ui-react';
import {  retrievePatientById} from '../graphql/queries';
import Button from "react-bootstrap/Button";
import { listPatientAppointment, listPrescriptionOfPatient} from '../graphql/customQueries';
import { Container } from "react-bootstrap";
import { useHistory} from "react-router-dom";


import * as FaIcons from 'react-icons/fa';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

export default function Patient() {

  useEffect(() => {
    fetchUserData();
    
    }, []);

    const [ setUserData] = useState({ payload: { username: '' } });
    const [patient, setPatient]= useState({ });
    const [doctor]= useState({ }); 
    const history = useHistory();
    const [updateModalShow, setUpdateModalShow] = React.useState(false);
    const [updateAppointmentModal, setAppointmentModal] = React.useState(false);
    const [selectedPatient, setSelectedPatient] = useState([]);
    const [appntmnts, setAppntmnts]= useState([]);
    const [prescrriptions, setPrescrriptions]= useState([]);
    const [errorMessages, setErrorMessages] = useState([]);
   
  
    async function getPatientInformation(userName) {
        try {
          const apiData = await API.graphql({ query: retrievePatientById, variables: { id: userName } } );
          console.log(apiData.data.getPatient)
          if (apiData.data.getPatient == null) {
            history.push("/createpatient")
          }
          setPatient(apiData.data.getPatient);
        } catch (e) {
            console.error('error fetching patient', e);
            setErrorMessages(e.errors);
        }
      }
    
    function openUpdatePatientModal(patient) {
      setSelectedPatient(patient);
      setUpdateModalShow(true);
    }
    async function fetchPrescrriptionsByPatient(userName) {
      console.log("inside fetch prescrriptions" );
      try {
          const apiData = await API.graphql({ query: listPrescriptionOfPatient, variables: { patientId: userName }  });
          const prescriptionAPI  = apiData.data.listPrescrriptions.items
          await Promise.all(prescriptionAPI.map(async prescrription => {
            const content = await Storage.get(prescrription.fileName,{ level: "public", });
            prescrription.content = content;
            return prescrription;
            }))


          setPrescrriptions(apiData.data.listPrescrriptions.items);
      }catch(e){
          console.error('error fetching prescrription', e);
          setErrorMessages(e.errors);
      }
      
    }
    function onHideAppntmntModal(patient) {
      setSelectedPatient(patient);
      setAppointmentModal(false);
      fetchAppntmnts(patient.id);
    
    }

    function openAppointment(patient) {
      setSelectedPatient(patient);
      setAppointmentModal(true);
    }
    async function fetchUserData() {
      await Auth.currentAuthenticatedUser()
        .then((userSession) => {
          console.log("userData: ", userSession);
          getPatientInformation(userSession.signInUserSession.accessToken.payload.username);
         
          setUserData(userSession.signInUserSession.accessToken);
          fetchAppntmnts(userSession.signInUserSession.accessToken.payload.username);
          fetchPrescrriptionsByPatient(userSession.signInUserSession.accessToken.payload.username);
        })
        .catch((e) => console.log("Not signed in", e));
    }

    async function deleteAppntmntById({ id }) {

      try {
        console.log("inside delete appointment " + id);
        const newAppointmentArray = appntmnts.filter(appointment => appointment.id !== id);
        setAppntmnts(newAppointmentArray);
        await API.graphql({ query: deleteAppntmnt, variables: { input: { id } }});
 

      }catch (e) {
          console.error('error deleting appointment', e);
          setErrorMessages(e.errors);
      }
    
    }
    


}

