import React, { Component } from 'react';

import home from '../../../img/demo/home.png';
import TestPageHeader from '../../components/Navigation/TestPageHeader';

export default class HomeTest extends Component {
  render () {
    console.log('Render HomeTest.jsx');

    return (
      <div>
        <TestPageHeader />
        <h1>This is the Home  page!</h1>
        <img src={home} alt="World" />
      </div>
    );
  }
}
