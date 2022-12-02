import API from '@aws-amplify/api';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import {  retrievePatientById,listInfoOfPatients } from '../../graphql/queries';
import {Row,Table} from "react-bootstrap";
import { deletePatient } from '../../graphql/mutations';
import { FormDataFieldsFunc } from '../../customlibraries/LibHooks';
import ModalPatient from '../ModalPatient';
import * as FaIcons from 'react-icons/fa';

export default function AllPatients() {
  const [show] = useState(false);
  const [showAlert] = useState(false);
  const [fields, handleFieldChange] = FormDataFieldsFunc({
    firstName: "",lastName: "",birthDate: "",phoneNumber: "",sex: "",ssn: "",insuranceNumber: "",address: "",
   
  });
  const history = useHistory();

  const [singlePatient, setSinglePatient] = useState({
    firstName: "",lastName: "",birthDate: "",phoneNumber: "",sex: "",ssn: "",insuranceNumber: "",address: "",
  });

  const [listPat, setListPat] = useState([]);

  const [updateModal, setUpdateModal] = React.useState(false);

  
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    listInfoOfPatients();

  }, []);


  async function getPatientInformation(id) {
    try {
      const apiData = await API.graphql({ query: retrievePatientById, variables: { id: id } });
      //console.log(apiData);
      if (apiData.data.getPatient == null) {
        history.push("/createpatient")
      }
      setSinglePatient({
        id: apiData.data.getPatient.id,
        firstName: apiData.data.getPatient.firstName,
        lastName: apiData.data.getPatient.lastName,
        birthDate: apiData.data.getPatient.birthDate,
        phoneNumber: apiData.data.getPatient.phoneNumber,
        insuranceNumber: apiData.data.getPatient.insuranceNumber,
        address: apiData.data.getPatient.address
      });

      setUpdateModal(true)
    } catch (e) {
      console.error('error fetching Patient...', e);
      setErrorMessages(e.errors);
    }
  }

  

  return (
    <div>
      <h5 >Patients</h5>
      <Row>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>id</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Address</th>
              <th>Birth Date</th>
              <th>Sex</th>
              {/* <th>SSN</th> */}
              <th>Insurance Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {listPat.map(element => (
              <tr key={element.id}>
                <td>{element.id}</td>
                <td>{element.firstName} {element.lastName}</td>
                <td>{element.phoneNumber}</td>
                <td>{element.createdAt.split('T')[0]}</td>
                <td>{element.updatedAt.split('T')[0]}</td>
                <td>{element.address}</td>
                <td>{element.birthDate}</td>
                <td>{element.sex}</td>
                {/* <td>{element.ssn}</td> */}
                <td>{element.insuranceNumber}</td>
                <td colSpan={2}>
                  <FaIcons.FaUserEdit onClick={() => getPatientInformation(element.id)} style={{fontSize: '24px', marginRight: '5px',}} />
                  <FaIcons.FaTrash onClick={() => deletePatientInformation(element.id)} style={{fontSize: '24px', marginRight: '5px',}} />
                  
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <ModalPatient
          show={updateModal}
          patient={singlePatient}
          onUpdated={() => listInfoOfPatients()}
          onHide={() => setUpdateModal(false)}
        />
      </Row>
    </div>
  )
  async function deletePatientInformation(id) {
    try {
      await API.graphql({ query: deletePatientInformation, variables: { input: { id: id } } });
    } catch (e) {
      console.error('error while deleting patient', e);
      setErrorMessages(e.errors);
    }
    listInfoOfPatients();
    alert("Patient record has been Deleted");

  }
  async function listInfoOfPatients() {
    try {
      const apiData = await API.graphql({ query: listInfoOfPatients });

      console.log(apiData);

      if (apiData.data.listInfoOfPatients.items == null) {
        history.push('/createpatient')
      }

      setListPat(apiData.data.listInfoOfPatients.items);

    } catch (e) {
      console.log("Error while fetching Patient Information", e);
    }

  }
 
  
}