//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Button ,StyleSheet ,StatusBar,AsyncStorage, ActivityIndicator} from 'react-native';
import { StackNavigator } from 'react-navigation';
import {Actions} from 'react-native-router-flux';
import HomePage from './HomePage';

const cheerio = require('react-native-cheerio');

class LoginForm extends Component {

  constructor(){
    super();
    this.state = {
      baseUrl: null,
      username: null,
      password: null,
      loading: false
    }
  }


  loadInitialState = async () => {
    try {
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('password');

      await AsyncStorage.getItem('url').then((url) => {
        this.setState({ 'baseUrl': url});
      });
     } catch (error) {
          Alert.alert(error);
     }
  }

  componentDidMount() {
    this.loadInitialState().done()
  }

  _userLogin = async () => {
    let domain, dir, searchUrl, loginUrl, response = null;

    AsyncStorage.clear()
    this.setState({'loading': true})

    searchUrl = this.state.baseUrl;
    if(searchUrl == null){
      Alert.alert("Warning", "Please enter valid URL");
      this.setState({'loading': false})
    }
    else if (searchUrl != null && searchUrl.indexOf("//") > -1) {
      domain = searchUrl.split('/')[2];
      dir = searchUrl.split('/')[3];
      console.log(dir);
      if(dir == null){
        loginUrl = 'https://'+ domain +'/wp-login.php'
      }else{
        loginUrl = searchUrl
      }
      this.setState({'loading': false})
    }else if(searchUrl != null){
      domain = searchUrl;
      dir = searchUrl.split('/')[1];
      if(dir == null){
        loginUrl = 'https://'+ domain +'/wp-login.php'
      }else{
        loginUrl = 'https://'+ searchUrl
      }
      this.setState({'loading': false})
    }

    if(loginUrl != null){
      this.setState({'loading': true})
      console.log("url: " + loginUrl);
      try{
          response = await fetch(loginUrl);   // fetch page
      }catch (error) {
          Alert.alert("Warning", "Invalid URL");
          this.setState({'loading': false})
      }
      const htmlString = await response.text();  // get response text
  		const $ = cheerio.load(htmlString);

      const username = $("#user_login").length;
      const password = $("#user_pass").length;

      if(username == 1 && password == 1){
         if(this.state.username == null || this.state.password == null){
            Alert.alert("Warning", "Please enter valid Username and Password");
            this.setState({'loading': false})
         }else{
           await AsyncStorage.setItem('username', this.state.username);
           await AsyncStorage.setItem('password', this.state.password);
           await AsyncStorage.setItem('url', loginUrl);
           Actions.HomePage();
         }
      }else{
         Alert.alert("Warning", "Invalid URL");
         this.setState({'loading': false})
      }
    }

	}

    render() {

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <TextInput style = {styles.input}
                            autoCapitalize="none"
                            editable={true}
                						onChangeText={(baseUrl) => this.setState({baseUrl})}
                						placeholder='URL'
                						ref='url'
                						returnKeyType='next'
                            value={this.state.baseUrl}
                            selectTextOnFocus={true}
                            placeholderTextColor='rgba(225,225,225,0.7)'/>

                <TextInput style = {styles.input}
                            autoCapitalize="none"
                            editable={true}
                						onChangeText={(username) => this.setState({username})}
                						placeholder='Username'
                						ref='username'
                						returnKeyType='next'
                            value={this.state.username}
                            placeholderTextColor='rgba(225,225,225,0.7)'/>

                <TextInput style = {styles.input}
                           returnKeyType="go" ref={(input)=> this.passwordInput = input}
                           editable={true}
               						 onChangeText={(password) => this.setState({password})}
               						 placeholder='Password'
               						 ref='password'
               						 returnKeyType='next'
               						 secureTextEntry={true}
                           placeholderTextColor='rgba(225,225,225,0.7)'
                           value={this.state.password}
                           secureTextEntry/>

                <TouchableOpacity disabled={this.state.loading} style={styles.buttonContainer} onPress={this._userLogin.bind(this)}>
                {this.state.loading?<ActivityIndicator
                animating = {true} color = '#3f729b' size = 'small'/>:<Text style={styles.buttonText}>LOGIN</Text>}
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
     padding: 20,
     marginTop: 30
    },
    input:{
        height: 40,
        backgroundColor: '#fff',
        marginBottom: 10,
        padding: 10,
        color: '#000'
    },
    buttonContainer:{
        backgroundColor: '#b0ff4c',
        paddingVertical: 15
    },
    buttonText:{
        color: '#000',
        textAlign: 'center',
        fontWeight: '700'
    },
    loginButton:{
      backgroundColor: '#0075bc',
       color: '#000'
    }

});

//make this component available to the app
export default LoginForm;
