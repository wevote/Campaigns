import React, { Component } from 'react';

import home from '../../img/demo/home.png';

export default class HomeTest extends Component {
  render () {
    console.log('Render HomeTest.jsx');

    return (
      <div>
        <h1>This is the Home  page!</h1>
        <img src={home} alt="World" />
      </div>
    );
  }
}
