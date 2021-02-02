import React, { Component } from 'react';

import { Button } from '@material-ui/core';
import TestPageHeader from '../../components/Navigation/TestPageHeader';
import iceland from '../../../img/demo/Iceland.jpg';
import { formatDateToYearMonthDay } from '../../utils/dateFormat';
import { historyPush } from '../../utils/cordovaUtils';

export default class DetailsPage extends Component {
  render () {
    console.log('Render DetailsPage.jsx');
    // const rawDateString = new Date().toString();
    const fancyDate = formatDateToYearMonthDay('2020-01-11 17:10:45.599791+00');

    return (
      <div>
        <TestPageHeader />
        <h1>This is the Details (Iceland) page!</h1>
        <h3 style={{ padding: 20 }}>
          This is the date to prove lazy loading of moment.js:&nbsp;&nbsp;
          {fancyDate}
        </h3>
        <img src={iceland} alt="World" style={{ maxWidth: 500, height: 'auto', maxHeight: 600 }} />
        <br />
        <br />
        <Button
          // classes={{ root: classes.buttonRoot }}
          color="primary"
          variant="contained"
          onClick={() => historyPush('/test/home')}
        >
          Go to /test/home
        </Button>
      </div>
    );
  }
}
