import { API, Auth } from 'aws-amplify';
import ModalDoctor from "./ModalDoctor";
import React, { useState, useEffect } from 'react';
import ModalPrescription from "./ModalPrescription";
import { getDoctorInfo,  } from '../graphql/queries';
import AddPrescriptionModal from "./AddModalPrescription";
import * as FaIcons from 'react-icons/fa';
import { listDoctorAppointment } from '../graphql/customQueries';
import {  Row, Col } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function DoctorPortal() {

  useEffect(() => {
    fetchData();
    }, []);

    const [addModalShow, setAddModalShow] = React.useState(false);
    const [setData] = useState({ payload: { username: '' } });
    const [doctor, setDoctor] = useState({ });
    const [updateModalShow, setUpdateModal] = React.useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState([]);
    const [appntments, setAppntments] = useState([]);
    const [viewModalShow, setViewModal] = React.useState(false);
    const [appntment, setAppointment] = useState({});
    const [setErrorMessages] = useState([]);
    const history = useHistory();
    
    


    async function fetchAppntmnts(userName) {
      try {
        var date = new Date();
        var dateString = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                    .toISOString()
                    .split("T")[0];
        const apiData = await API.graphql({ query: listDoctorAppointment, variables: { doctorId: userName, appointmentDate: dateString }  });
        setAppntments(apiData.data.listAppointments.items);
      } catch (e) {
          console.error('error while fetching the appointments', e);
          setErrorMessages(e.errors);
      }
    }
    
    function openUpdateModal(doctor) {
      setSelectedDoctor(doctor);
      setUpdateModal(true);
    }


    async function getDoctorInformation(userName) {
      try {
        const apiData = await API.graphql({ query: getDoctorInfo, variables: { id: userName } } );
        if (apiData.data.getDoctorInfo == null) {
          history.push("/createdoctor")
        }
        setDoctor(apiData.data.getDoctorInfo);
      } catch (e) {
          console.error('error fetching doctor', e);
          setErrorMessages(e.errors);
      }
    }
    return (
        <div className='doctor'>
          <h3>Doctor Portal</h3>
              <div>
                    <div className='z-index-set'>
                      <Row className="align-items-center">
                        <Col style={{ fontSize: "1rem" }}>
                          <FaIcons.FaLaptopMedical style={{fontSize: '24px', marginRight: '5px',}} />
                          <b>First Name: </b> {doctor.firstName}
                        </Col>
                        <Col style={{ fontSize: "1rem" }}> <b>Last Name:</b> {doctor.lastName}</Col>
                        <Col style={{ fontSize: "1rem" }}> <b>Phone:</b> {doctor.phone}</Col>
                        <Col style={{ fontSize: "1rem" }}> <b>Address:</b> {doctor.address}</Col>
                        <Col><span style={{verticalAlign: 'text-bottom'}}><FaIcons.FaEdit style={{cursor: 'pointer'}} onClick={() => openUpdateModal(doctor)}/></span></Col>
                      </Row>
                    </div>
              </div>
              <ModalDoctor
                  show={updateModalShow}
                  doctor={selectedDoctor}
                  onUpdated={() => getDoctorInformation(doctor.id)}
                  onHide={() => setUpdateModal(false)}
                />
            <div className='header-container'>
             <h4 style={{marginTop: '10px'}}>Today's Appointments</h4>
            </div>
            <div >
              <table>
                <thead>
                  <tr>
                    <th> Date of Appointment </th>
                    <th> Time of Appointment </th>
                    <th>Patient</th>
                    <th>Reason for visit</th>
                    <th>Phone</th>
                    <th>View Prescription</th>
                    <th>Download Prescription</th>
                  </tr>
                </thead>
                <tbody>
                {
                appntments.map(appntment => (
                      <tr key={appntment.id || appntment.appointmentDate} >
                        <td>{appntment.appointmentDate}</td>
                        <td>{appntment.appointmentTime}</td>
                        <td> {appntment.patient != null ? appntment.patient.firstName +" "+appntment.patient.lastName : ""}</td>
                        <td>{appntment.description}</td>
                        <td>{appntment.patient.phone}</td>
                        <td><button onClick={() =>{ setAppointment(appntment);setAddModalShow(true)}}>Upload Prescription</button></td> 
                        <td><button onClick={() =>{ setAppointment(appntment);setViewModal(true)}}>View Prescription</button></td> 
                      </tr>
                    ))
                  }
                </tbody>
            </table>
          </div>
          <AddPrescriptionModal
                  show={addModalShow}
                  appointment={appntment}
                  onUploaded={() => fetchData()}
                  onHide={() => setAddModalShow(false)}
                />
           <ModalPrescription
                  show={viewModalShow}
                  appointment={appntment}
                  onFetched={() => fetchData()}
                  onHide={() => setViewModal(false)}
                />
      </div>
    );

    async function fetchData() {
      await Auth.currentAuthenticatedUser()
        .then((userSession) => {
          getDoctorInformation(userSession.signInUserSession.accessToken.payload.username);
          fetchAppntmnts(userSession.signInUserSession.accessToken.payload.username);
          setData(userSession.signInUserSession.accessToken);
        })
        .catch((e) => console.log("Not signed in", e));
    }
}

