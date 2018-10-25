import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

export default createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    type: 'light',
    primary: {
      light: '#407766',
      main: '#115540',
      dark: '#0b3b2c',
    },
    secondary: {
      light: '#43c498',
      main: '#15b67f',
      dark: '#0e7f58',
      contrastText: '#fff',
    },
    background: {
      default: '#ffffff',
    },
  },
  color: {
    dark: '#101517',
  },
  drawerWidth: {
    small: 300,
    medium: 400,
    large: '70%',
  },
})

export const darkTheme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    type: 'dark',
    primary: {
      light: '#ffffff',
      main: '#ffffff',
      dark: '#b2b2b2',
      contrastText: 'rgba(255, 255, 255, 0.5)',
    },
    secondary: {
      light: '#407766',
      main: '#115540',
      dark: '#0b3b2c',
      contrastText: '#fff',
    },
    text: {
      secondary: '#a7a7a7',
    },
  },
})
