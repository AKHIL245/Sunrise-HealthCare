import { Auth as A } from 'aws-amplify';
//Function to add the userSession
async function sessionDetails() {
    return A.currentAuthenticatedUser()
        .catch((event) => console.log("Not yet signed in", event));
}
