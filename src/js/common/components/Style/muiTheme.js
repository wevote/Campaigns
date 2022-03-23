import { createTheme } from '@mui/material/styles';
import components from '../../../components/Style/muiStyleOverrides';

// See also styled-theme.js
// I recommend being cautious about using 'md' for transitions relating explicitly to mobile, tablet, desktop
const breakpoints = {
  keys: ['xs', 'sm', 'md', 'lg', 'xl'],
  values: {
    xs: 320,
    sm: 576,
    md: 768,
    lg: 960,
    xl: 1280,
  },
};

const theme = createTheme({
  components,
  palette: {
    primary: {
      // main: "#25536D",
      main: '#2E3C5D', // brandBlue
    },
    secondary: {
      main: '#ffffff',
      dark: '#f7f7f7',
      contrastText: '#2e3c5d',
    }, // Feel free to change this
  },
  breakpoints,
  typography: {
    useNextVariants: true,
  },
  colors: {
    grayPale: '#f8f8f8', // $gray-pale:    #f8f8f8 !default;
    grayLighter: '#eee', // $gray-lighter: #eee !default;
    grayLighter2: '#e7e7e7',
    grayBorder: '#ddd', // $gray-border:  #ddd !default;
    grayChip: '#dee2eb',
    grayLight: '#ccc', // $gray-light:   #ccc !default;
    grayMid: '#999', // $gray-mid:     #999 !default;
    grayDark: '#555', // $gray-dark:    #555 !default;
    grayDarker: '#333', // $gray-darker:  #333 !default;
    linkHoverBorder: '#3771c8',
    opposeRedRgb: 'rgb(255, 73, 34)',
    supportGreenRgb: 'rgb(31, 192, 111)',
    brandBlue: '#2e3c5d',
  },
});

export default theme;
