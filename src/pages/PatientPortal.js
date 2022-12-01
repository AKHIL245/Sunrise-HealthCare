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
    

    return (
        <div className='patient'>
          <div className='container info-holder'>
            <div className="name-container">
              <p className='name'>
                {patient.firstName} {patient.lastName}
                <span style={{verticalAlign: 'text-bottom'}}><FaIcons.FaEdit style={{cursor: 'pointer'}} onClick={() => openUpdatePatientModal(patient)}/></span>
              </p>
              <p className='name'>Email - {patient.email}</p>
              <p>Phone - {patient.phone}</p>
              <p>Address - {patient.address}</p>
              <p>DOB - {patient.birthDate ? patient.birthDate.substring(0,"yyy-mm-dd".length+1) : ""}</p>
              <p>Insurance - {patient.insuranceNumber}</p>
            </div>
          </div>
              <ModalPatient
                  show={updateModalShow}
                  patient={selectedPatient}
                  onUpdated={() => getPatientInformation(patient.id)}
                  onHide={() => setUpdateModalShow(false)}
                />

        <div className='container'>
          <h5 className='text-left'>Treatments</h5>
          <Button 
            className='appointment-btn'
            variant="success"
            size="sm"
            onClick={() => openAppointment(patient)}
          >
            Take Another Appointment
          </Button>
          <Tabs
            defaultActiveKey="upcoming"
            id="uncontrolled-tab-example"
            className="mb-3"
          >
            <Tab eventKey="ongoing" title="Ongoing">
              <div className="home">
              <table>
                <thead>
                  <tr>
                    <th>Treated by</th>
                    <th>Prescription</th>
                    <th>Description</th>
                  </tr>
                </thead>
              <tbody>
              {
              prescrriptions.map(prescrription => (
                
                    <tr key={prescrription.id} >
                      <td>{prescrription.doctor != null ? prescrription.doctor.firstName +" "+prescrription.doctor.lastName : ""}</td>
                      <td>
                            {
                              prescrription.content && <a href={prescrription.content} download={prescrription.fileName}>
                                {
                                
                                  <AmplifyS3Image level="public" imgKey={prescrription.fileName} alt={prescrription.fileName.slice(prescrription.fileName.lastIndexOf('/') + 1)} /> 
                                }
                              </a>
                            }
                          </td>
                      <td>{prescrription.description != null ?  prescrription.description : ""} </td>              
                    </tr>
                  ))
                }
              </tbody>
              </table>
              </div>
            </Tab>
            <Tab eventKey="upcoming" title="Upcoming">
              <div className="profile">
              <table>
                <thead>
                  <tr>
                  <th>Time of Appointment</th><th>Date of Appointment</th><th>Doctor Appointed</th><th> Condition</th>
                    <th>Action to taken</th>
                  </tr>
                </thead>
                <tbody>
                {
                appntmnts.map(appntmnt => (
                      <tr key={appntmnt.id || appntmnt.appointmentDate} >
                        <td>{appntmnt.appointmentDate}</td>
                        <td>{appntmnt.appointmentTime}</td>
                        <td> {appntmnt.doctor != null ? appntmnt.doctor.firstName +" "+appntmnt.doctor.lastName : ""}</td>
                        <td>{appntmnt.description != null ?  appntmnt.description : ""} </td>
                        <td><button onClick={() => deleteAppntmntById(appntmnt)}>Delete</button></td>
                        
                      </tr>
                    ))
                  }
                </tbody>
              </table>
              </div>
            </Tab>
          </Tabs>
        </div>
            <div style={{marginTop: '10px'}}>
              <Container>
              
              </Container>
          
            </div>

            <Appointment
                  show={updateAppointmentModal}
                  patient={selectedPatient}
                  onUpdated={() => getPatientInformation(patient.id)}
                  onHide={() => onHideAppntmntModal(patient)}
                />
        </div>
    );


    async function fetchAppntmnts(userName) {
      try {
        var date = new Date();
        var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
          const apiData = await API.graphql({ query: listPatientAppointment, variables: { patientId: userName ,appointmentDate: dateString }  });
          console.log(apiData.data.listAappntmnts.items);
          function sortFunction(a, b) {
            return a.appointmentDate < b.appointmentDate ? 1 : -1;
          }
          const sortedData = apiData.data.listAappntmnts.items.sort(sortFunction);
          setAppntmnts(sortedData);
      }catch(e){
          console.error('error while fetching appntmnts', e);
          setErrorMessages(e.errors);
      }
      
    }
}

