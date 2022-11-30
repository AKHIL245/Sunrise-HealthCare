import React, { State, Effect } from 'react';
import * as GiIcons from "react-icons/gi";
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import { useHistory } from 'react-router';
import * as AiIcons from 'react-icons/ai';
import { AmplifySignOut } from '@aws-amplify/ui-react';
import * as User from './CognitoUserRolesInfo';
import { onAuthUIStateChange } from '@aws-amplify/ui-components';
import './Navbar.css'

let admin;
let doctor;

const Navbar = (props) => {

    const SidebarData = function (isRoleDoctor, isRoleAdmin) {
        return [
            {
                title: 'Doctor', path: '/', icon: <AiIcons.AiFillHeart />, cName: 'nav-text', show: isRoleDoctor
            },
            {
                title: 'Patient', path: '/patient', icon: <GiIcons.GiHealthNormal />, cName: 'nav-text', show: !isRoleDoctor && !isRoleAdmin
            },
            {
                title: 'List Doctors', path: '/listdoctor', icon: <FaIcons.FaUserLock />, cName: 'nav-text', show: isRoleAdmin
            },
            {
                title: 'List Patients', path: '/listpatient', icon: <AiIcons.AiFillSetting />, cName: 'nav-text', show: isRoleAdmin
            }
        ]
    };

    const [sidebar, setSidebar] = State(false);
    const [sidebarData, setSidebarData] = State(SidebarData());
    const showSidebar = () => setSidebar(!sidebar);
    const history = useHistory();
   

    Effect(() => {
        fetchInfoRoles();
        return onAuthUIStateChange((nextAuthState, authData) => {
            if (nextAuthState === 'signedin') {
                if (doctor) {
                    history.push('/');
                }
                else if (admin) {
                    history.push('/listdoctor')
                }
                else {
                    history.push('/patient')
                }
            }
        });
    }, [sidebar]);

    async function fetchInfoRoles() {
       
        doctor = await User.isRoleDoctor();
        admin = await User.isRoleAdmin();
        const updatedSideBar = SidebarData(doctor, admin);
        setSidebarData(updatedSideBar);
    }

    return (
        <>
            <div className='navbar'>
                <Link to='#' className='menu-bars'>
                    <FaIcons.FaBars onClick={showSidebar} />
                </Link>
                <div className='title'>SUNRISE HEALTH CARE </div>
                <div id="LoginSignOut">
                    <AmplifySignOut id="SignOutButton"/>
                </div>
            </div>
            <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
                <ul className='nav-menu-items' onClick={showSidebar}>
                    <li className='navbar-toggle'>
                        <Link to='#' className='menu-bars'>
                            <AiIcons.AiOutlineClose />
                        </Link>
                    </li>
                    {sidebarData.map((item, index) => {
                        return (item.show ?
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    <span>{item.title}</span>
                                </Link>
                            </li> : ""
                        );
                    })}
                </ul>
            </nav>
        </>
    );
}

export default Navbar;