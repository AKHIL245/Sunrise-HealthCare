import React, { useEffect , useState} from 'react';
import AddDoctor from './pages/NewDoctor';
import './App.css';
import NavBar from './components/Navbar';
import DoctorPage from './pages/DoctorPortal';
import { Hub as Listener } from 'aws-amplify';
import { withAuthenticator } from '@aws-amplify/ui-react';
import AllPatients from './pages/Admin/AllPatients';
import { Switch as Change, HashRouter as Routes , Route } from 'react-router-dom';
import PatientPage from './pages/PatientPortal';
import * as userdetails from './components/CognitoUserRolesInfo';
import AllDoctors from './pages/Admin/AllDoctors';
import ListPharmacy from './pages/Admin/ListPharmacy';
import AddPatient from './pages/NewPatient';
function App() {
  const authlistner = (info) => {
    switch (info.payload.event) {
      case 'signOut':
        console.info('user signed out');
        window.location = '/';
        break;
      
    }
  }
  Listener.listen('auth', authlistner);
  const [sessionInfo, setSessionInfo] = useState("");
  useEffect(() => {
    userdetails.sessionInfo().then(event => setSessionInfo(event));
  }, []);

  if(sessionInfo[0] == "Doctor")
  {
   return( 
   <div className="App">
            <Routes>
              <NavBar />
              <Change>
              <Route path='/' exact component={DoctorPage} />
                <Route path='/createdoctor' component={AddDoctor} />
              </Change>
            </Routes>
        <hr />
        <>
            {sessionInfo[1]} 
        </>
      </div>
   )
  }
  else if(sessionInfo[0] == "Admin")
  {
    return (
      <div className="App">
            <Routes>
              <NavBar />
              <Change>
              <Route path='/listdoctor' component={AllDoctors} />
              <Route path="/listpatient" component={AllPatients} />
              </Change>
            </Routes>
        <hr />
        <>
            {sessionInfo[1]} 
        </>
      </div>
    );
  }
  else{
    return(
      <div className="App">
            <Routes>
              <NavBar />
              <Change>
                <Route path='/patient' component={PatientPage} />
                <Route path='/createpatient' component={AddPatient} />
                <Route path='/listpharmacy' component={ListPharmacy} />
              </Change>
            </Routes>
        <hr />
        <>
            {sessionInfo[1]} 
        </>
      </div>
    )
  }
}
export default withAuthenticator(App);
