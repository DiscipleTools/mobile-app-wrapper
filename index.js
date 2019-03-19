import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import App from './src/components/Login/App';

export default class Login extends Component {
  render() {
    return (
     <App />
    );
  }
}

AppRegistry.registerComponent('Disciple', () => Login);
