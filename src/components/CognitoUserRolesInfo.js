import { Auth as A } from 'aws-amplify';
//Function to add the userSession
async function sessionDetails() {
    return A.currentAuthenticatedUser()
        .catch((event) => console.log("Not yet signed in", event));
}
//Function to get the role info
async function RoleInfo(role) {
    var detailsofUser = await sessionDetails();
    const data = detailsofUser.signInUserSession.accessToken.payload
    return data && data['cognito:groups'] && data['cognito:groups'].includes(role);
}
//Function to get the role Admin
export async function isRoleAdmin() {
    return RoleInfo('Admins');
}
//Function to get the role Doctor
export async function isRoleDoctor() {
    return RoleInfo('Doctor');
}