import Amplify from 'aws-amplify'

export default function configure(config) {
  Amplify.configure({
    Auth: {
      mandatorySignIn: true,
      region: config.cognito.REGION,
      userPoolId: config.cognito.USER_POOL_ID,
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
      userPoolWebClientId: config.cognito.APP_CLIENT_ID,
    },
    Storage: {
      identityPoolId: config.cognito.IDENTITY_POOL_ID,
    },
    API: {
      endpoints: [{
        name: 'dictionary',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      },{
        name: 'term',
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION,
      }],
    },
  })
}
