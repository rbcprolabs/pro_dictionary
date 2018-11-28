import enviroment from '@core/utils/enviroment'

export default Object.assign(enviroment({
  development: {
    apiGateway: {
      REGION: 'us-east-2',
      URL: 'https://8lg6p4tah2.execute-api.us-east-2.amazonaws.com/dev',
    },
    cognito: {
      REGION: 'us-east-2',
      USER_POOL_ID: 'us-east-2_FtTbZMZmZ',
      APP_CLIENT_ID: '120eigfev7l69ps3iumput8p0p',
      IDENTITY_POOL_ID: 'us-east-2:8d516545-d21e-4674-9ecf-8052d1845372',
    },
  },
  production: {
    apiGateway: {
      REGION: 'us-east-2',
      URL: 'https://wm7k1b4g57.execute-api.us-east-2.amazonaws.com/prod',
    },
    cognito: {
      REGION: 'us-east-2',
      USER_POOL_ID: 'us-east-2_B7WYsFrmv',
      APP_CLIENT_ID: '6hqa21cc7ut0oretqoe20qi9o6',
      IDENTITY_POOL_ID: 'us-east-2:5bde78dd-71dd-4597-8818-a3c1cd1bc245',
    },
  },
}), {
  // eslint-disable-next-line no-undef
  env: process.env.NODE_ENV,
})
