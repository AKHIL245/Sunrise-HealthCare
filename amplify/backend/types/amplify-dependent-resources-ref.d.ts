export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "invinciblescmpe2726173a9cd": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string",
            "CreatedSNSRole": "string"
        },
        "userPoolGroups": {
            "UsersGroupRole": "string",
            "AdminsGroupRole": "string"
        }
    },
    "api": {
        "invinciblescmpe272": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "function": {
        "S3Triggerc8c424e6": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "AdminQueriesf1ae536e": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "jwtauth": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        },
        "AppointmentEmail": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "storage": {
        "contentStore": {
            "BucketName": "string",
            "Region": "string"
        }
    },
    "interactions": {
        "DoctorBot": {
            "Region": "string",
            "BotName": "string",
            "FunctionArn": "string"
        }
    }
}