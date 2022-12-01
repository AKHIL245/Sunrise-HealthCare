const AWS = require('aws-sdk')
const ses = new AWS.SES({ region: process.env.REGION });
const ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

exports.handler = async function(event) {
  //eslint-disable-line
  const record = event.Records[0];
  const op = record.eventName;
  console.log('process.env: ', JSON.stringify(process.env, null, 2));
  console.log('Incoming event: ', JSON.stringify(event, null, 2));
  console.log('DynamoDB Record: ', JSON.stringify(record.dynamodb, null, 2));

  if (op === "INSERT") {
    let docId = record.dynamodb.NewImage.doctorId.S;
    let patId = record.dynamodb.NewImage.patientId.S;
    let date = record.dynamodb.NewImage.appointmentDate.S;
    let time = record.dynamodb.NewImage.appointmentTime.S;

    // no luck - running into IAM permissions issue!!!
    // getUserdataFromCognito('larry').then((userdata) => {
    //   userdata ? console.log('email: ', userdata.Attributes.find((k, v) => k.Name === 'email')) : console.log('NOT FOUND');
    // });

    let patient = await getUserdataFromDynamoDB('Patient-3fpg5psmbbcuzbhfrnty72ryh4', patId);
    let doctor = await getUserdataFromDynamoDB('Doctor-3fpg5psmbbcuzbhfrnty72ryh4', docId);
    let subject = `New appointment with Dr. ${doctor.firstName.S} ${doctor.lastName.S}`;
    let body = `At ${date} ${time}`;

    console.log(subject);
    console.log(body);
    return sendMail(subject, body, patient.email.S);
  }
  return Promise.resolve('failed to send AppointmentEmail for DynamoDB record');
};

async function getUserdataFromDynamoDB(tablename, id) {
  var params = {
    TableName: tablename + '-' + process.env.ENV,
    Key: {
      'id': { S: id }
    }
  }

  // Call DynamoDB to read the item from the table
  const data = await ddb.getItem(params).promise()
  return data ? data.Item : null;
}

async function getUserdataFromCognito(username) {
  const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
  const params = {
    UserPoolId: process.env.userPoolId,
    Filter: `username = "${username}"`,
  }
  try {
    const data = await cognitoidentityserviceprovider.listUsers(params).promise()
    const existingUser = data.Users.filter(user => user.UserStatus !== 'EXTERNAL_PROVIDER')[0]
    if (existingUser == null) {
      console.log('Error', 'User not found')
    }
    return existingUser
  } catch (error) {
    console.log('Error: getUserByAttribute', error)
    return null;
  }
}

function sendMail(subject, data, email) {
  const params = {
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: { Data: data },
      },
      Subject: { Data: subject },
    },
    Source: "appointment@invinciblescmpe272.com",
  };

  try {
    return ses.sendEmail(params).promise();
  } catch (e) {
    console.log("FAILURE IN SENDING MAIL!!", e);
  }
  return;
}
