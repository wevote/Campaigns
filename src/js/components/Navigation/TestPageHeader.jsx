import React from 'react';
import { useHistory } from 'react-router-dom';
import { AppBar, Tab, Tabs, Toolbar } from '@material-ui/core';
import { createMuiTheme, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import startsWith from '../../common/utils/startsWith';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));


export default function TestPageHeader () {
  const [value, setValue] = React.useState(0);
  const classes = useStyles();
  const history = useHistory();
  // const { location: { pathname } } = window;
  // if (value === undefined) {
  //   if (typeof pathname !== 'undefined' && pathname) {
  //     console.log('TestPageHeader initialization at path ', pathname);
  //     if (startsWith('/test/details', pathname.toLowerCase()) && value !== 0) {
  //       value = 0;
  //     } else if (startsWith('/test/comments', pathname.toLowerCase()) && value !== 1) {
  //       value = 1;
  //     } else if (startsWith('/test/updates', pathname.toLowerCase()) && value !== 2) {
  //       value = 2;
  //     }
  //   }
  // }

  const theme = createMuiTheme({
    typography: {
      button: {
        textTransform: 'none',
      },
    },
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { location: { pathname } } = window;
  if (startsWith('/test/details', pathname) && value !== 0) {
    console.log('Render TestPageHeader, initial value set to 0');
    setValue(0);
  } else if (startsWith('/test/comments', pathname) && value !== 1) {
    console.log('Render TestPageHeader, initial value set to 1');
    setValue(1);
  } else if (startsWith('/test/updates', pathname) && value !== 2) {
    console.log('Render TestPageHeader, initial value set to 2');
    setValue(2);
  }


  console.log('Render TestPageHeader.jsx');

  return (
    <div className={classes.root}>
      <AppBar position="relative"
              color="default"
              className=""
      >
        <ThemeProvider theme={theme}>
          <Toolbar className="header-toolbar" disableGutters>
            <Tabs value={value} onChange={handleChange} aria-label="Tab menu">
              <Tab id="weTarget-0" label="Details" onClick={() => history.push('/test/details')} />
              <Tab id="weTarget-1" label="Comments" onClick={() => history.push('/test/comments')} />
              <Tab id="weTarget-2" label="Updates" onClick={() => history.push('/test/updates')} />
            </Tabs>
          </Toolbar>
        </ThemeProvider>
      </AppBar>
    </div>
  );
}
