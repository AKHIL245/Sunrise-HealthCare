import API from '@aws-amplify/api';
import React, { useEffect, useState } from 'react';
import { getDoctorInfo, getAllDoctors } from '../../graphql/queries';
import { Row,Table} from "react-bootstrap";
import ModalDoctor from '../ModalDoctor';
import * as FaIcons from 'react-icons/fa';

export default function AllDoctors()
{
  const [show] = useState(false);
  const [showAlert] = useState(false);
  const [fields, handleFieldChange] = FormDataFieldsFunc({
    fistName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const history = useHistory();

  const [listDoc, setListDoc] = useState([]);

  const [updateModal, setUpdateModal] = React.useState(false);

  const [singleDoctor, setEachDoctor] = useState({
    id: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: ""
    });
  const [errorMessages, setErrorMessages] = useState([]);

  useEffect(() => {
    list();

  },[]);

  return(
    <div>
      <h5 style={{marginTop: '10px', marginBottom: '10px'}}>Doctors</h5>
      <Row>
      <br/>
        <Table striped bordered hover>
        <thead>
          <tr>
            <th>username</th><th>Name</th><th>Created At</th>
            <th>Updated At</th><th>Phone Number</th><th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        { listDoc.map(element => (
          <tr key={element.id}>
            <td>{element.id}</td>
            <td>{element.firstName} {element.lastName}</td>
            <td>{element.createdAt}</td><td>{element.updatedAt}</td>
            <td>{element.phoneNumber}</td><td>{element.address}</td>
           
            <td>
              <FaIcons.FaUserEdit onClick={() => getDoctorInformation(element.id)} style={{fontSize: '24px', marginRight: '5px',}} />
              <FaIcons.FaTrash onClick={() => deleteDoctorInformation(element.id)} style={{fontSize: '24px', marginRight: '5px',}} />
            </td>
          </tr>
          )) }
        </tbody>
      </Table>
      <ModalDoctor
                  show={updateModal}
                  doctor={singleDoctor}
        onUpdated={() => list()}
        onHide={() => setUpdateModal(false)}
      />
      </Row>
    </div>
  )
  async function getDoctorInformation(id) {
    try {
      const apiData = await API.graphql({ query: getDoctorInfo, variables: { id: id } } );
      if (apiData.data.getDoctorInfo == null) {
      }
      setEachDoctor({
        id: apiData.data.getDoctorInfo.id,
        phoneNumber: apiData.data.getDoctorInfo.phoneNumber,
        address: apiData.data.getDoctorInfo.address,
        firstName: apiData.data.getDoctorInfo.firstName,
        lastName: apiData.data.getDoctorInfo.lastName
      
      });

      setUpdateModal(true)
    } catch (e) {
        console.error('error while fetching service', e);
        setErrorMessages(e.errors);
    }
  }
}