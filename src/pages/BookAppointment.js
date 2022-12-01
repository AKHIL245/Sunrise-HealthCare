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


    const formDataSubmit = async () =>{
      try {
        const backendData = await Backendcall.graphql({ query: getAllAppointments });
        var f=0;
        for (let x in backendData.data.listAppointments.items) {
          console.log("Prescrip1",backendData.data.listAppointments.items[x].appointmentDate);
          console.log("Prescrip1",backendData.data.listAppointments.items[x].appointmentTime);
          console.log("Prescrip1",backendData.data.listAppointments.items[x].doctorId);
          console.log("Prescrip22",appTime);
          console.log("Prescrip22",appDate);
          var j = appTime.split(":");
          j[0]=parseInt(j[0]);
          j[1]=parseInt(j[1]);
          var j1=[...j];
          console.log("appointmentTime1",j,j1);
          if(j[1]>=30){
            j[1]=j[1]-30;
            j[0]+=1;
          }
          else{
            j[1]+=30;
          }
          if(j1[1]<=30){
            j1[1]=j1[1]+30;
            j1[0]-=1;
          }
          else{
            j1[1]-=30;
          }
          // var j = appointmentTime + 0.5 * 60 * 60 * 1000;
          // appointmentTime.setTime(appointmentTime + 1 * 60 * 60 * 1000);
          console.log("appointmentTime2",j,j1,(j1[0]+":"+j1[1]),typeof(j1[0]+":"+j1[1]));
          if (backendData.data.listAppointments.items[x].appointmentDate === appDate && backendData.data.listAppointments.items[x].appointmentTime >(j1[0]+":"+j1[1]) && backendData.data.listAppointments.items[x].appointmentTime <(j[0]+":"+j[1]) && backendData.data.listAppointments.items[x].doctorId === prefDoc){
            f=1;
            alert("This time slot is already booked");
            break;
          }
          
        }
        if (f=== 0) {
        console.log("Prescrip2",backendData.data.listAppointments.items, backendData.data.listAppointments.items.length);
          await Backendcall.graphql({ query: createAppntment, variables: { input: {patientId:props.patient.id , doctorId:prefDoc, appointmentDate: appDate, appointmentTime: appTime,
             description:visitReason } } });
             alert("Appointment Done!");
             formData.description = "";
             formData.appointmentTime = date.getDate;
             formData.doctorId = "";
             formData.appointmentDate = date.getTime;
             props.onUpdated();
             props.onHide();
        }
        } catch (error) {
          setError(error.errors);
        }
    }
  

}