import { AmplifyS3Image } from '@aws-amplify/ui-react';
import React, { useEffect , useState} from "react";
import { listPrescriptionWithAppntment as  customQueryAllPrescriptionByAppointmentId} from '../graphql/customQueries';
import Modal from "react-bootstrap/Modal";
import { prescriptionDelete as mutationPrescriptionDelete } from '../graphql/mutations';
import { API as Backendcall, Storage as S3Bucket } from 'aws-amplify';

export default function ModalPrescription(props) {
  
  const [error1, setError] = useState([]);
  const [presc, setPresc] = useState([]);

    useEffect(() => {
      async function getPrescriptionDetails() {
        getPrescriptionByAppointmentId(props.appointment.id, props.appointment.patientId);
      }
      
      if (props.show){
        getPrescriptionDetails();
      }
  }, [props.show]);
  async function removePresc(presc) {
    await Backendcall.graphql({ query: mutationPrescriptionDelete, variables: { input: { id: presc } } });

    await S3Bucket.remove(presc.fileName,{ level: "public", });
    props.onFetched();
    props.onHide();
  }

  async function getPrescriptionByAppointmentId(apmntId, pId) {
    try {
      const backendData = await Backendcall.graphql({ query: customQueryAllPrescriptionByAppointmentId, variables: { appointmentId: apmntId, patientId: pId }  });
      const allPrescriptions = backendData.data.listPrescriptions.items;
      await Promise.all(allPrescriptions.map(async prescription => {
      const data = await S3Bucket.get(prescription.fileName,{ level: "public", });
      prescription.content = data;

      return prescription;
      }))
      setPresc(backendData.data.listPrescriptions.items);
    } 
    catch (event) {
        console.error('There was issue in fetching prescriptions', event);
        setError(event.errors);
    }
  }
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >

      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
         Prescription
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
      <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Uploaded Date</th>
              <th>Download</th>
              <th>Delete</th>
            </tr>
          </thead>
         <tbody>
            {
              presc.map(items => (
                <tr key={items.id}>
                  <td>{items.description}</td>
                  <td>{items.createdAt}</td>
                  <td>
                    {
                      items.content && <a href={items.content} download={items.fileName}>
                        {
                          <AmplifyS3Image level="public" imgKey={items.fileName} alt={items.fileName.slice(items.fileName.lastIndexOf('/') + 1)} /> 
                        }
                      </a>
                    }
                  </td>
                  <td><button onClick={() => removePresc(items.id)}>Delete</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </Modal.Body>

    </Modal>
  );
}