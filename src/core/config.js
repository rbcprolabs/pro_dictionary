import enviroment from '@core/utils/enviroment'

export default Object.assign(enviroment({
  development: {
    apiGateway: {
      REGION: 'eu-west-1',
      URL: 'https://56dlddtztj.execute-api.eu-west-1.amazonaws.com/dev',
    },
    cognito: {
      REGION: 'eu-west-1',
      USER_POOL_ID: 'eu-west-1_Sdi6ab4BE',
      APP_CLIENT_ID: '5448bk9lhf523vdu6ujoukv3g5',
      IDENTITY_POOL_ID: 'eu-west-1:35ded7cd-401d-4e10-acb7-66fa4f47b967',
    },
  },
  production: {
    apiGateway: {
      REGION: 'eu-west-1',
      URL: 'https://rkacu4zt66.execute-api.eu-west-1.amazonaws.com/prod',
    },
    cognito: {
      REGION: 'eu-west-1',
      USER_POOL_ID: 'eu-west-1_Qp1gbMSYi',
      APP_CLIENT_ID: '6nmlcp9t26n6f0avgfes9m56du',
      IDENTITY_POOL_ID: 'eu-west-1:d60acad9-fbca-44d1-92bf-12e37bcebbfd',
    },
  },
}), {
  // eslint-disable-next-line no-undef
  env: process.env.NODE_ENV,
})
