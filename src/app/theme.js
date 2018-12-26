import createMuiTheme from '@material-ui/core/styles/createMuiTheme'

const mixins = {
  scrollbar: {
    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.3)',
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar': {
      width: 6,
      backgroundColor: '#F5F5F5',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#407766',
    },
  },
}

const lightTheme = createMuiTheme({
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
  },
  mixins,
})

export default lightTheme

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
  mixins,
})
