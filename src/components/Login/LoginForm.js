//import liraries
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Button ,StyleSheet ,StatusBar,AsyncStorage} from 'react-native';
import { StackNavigator } from 'react-navigation';
import {Actions} from 'react-native-router-flux';
import HomePage from './HomePage';

const cheerio = require('react-native-cheerio');

class LoginForm extends Component {

  constructor(){
    super();
    this.state = {
      url: null,
      username: null,
      password: null
    }
  }

  _userLogin = async () => {
    console.log("login...");

	  let searchUrl = this.state.url;
    let domain;

    if (searchUrl.indexOf("//") > -1) {
      domain = searchUrl.split('/')[2];
    }else{
      domain = searchUrl;
    }

    const loginUrl = 'http://'+ domain +'/wp-login.php';
    let response = '';
    try{
		    response = await fetch(loginUrl);   // fetch page
    }catch (error) {
        Alert.alert(error.toString())
    }
	  const htmlString = await response.text();  // get response text
		const $ = cheerio.load(htmlString);

    const username = $("#user_login").length;
    const password = $("#user_pass").length;

    if(username == 1 && password == 1){
       if(this.state.username == null || this.state.password == null){
          Alert.alert("Please enter valid username and Password");
       }else{
         AsyncStorage.setItem('username', this.state.username);
         AsyncStorage.setItem('password', this.state.password);
         AsyncStorage.setItem('url', loginUrl);
         Actions.HomePage();
       }
    }else{
       Alert.alert("Invalid URL");
    }
	}

    render() {

        return (
            <View style={styles.container}>
                <StatusBar barStyle="light-content"/>
                <TextInput style = {styles.input}
                            autoCapitalize="none"
                            editable={true}
                						onChangeText={(url) => this.setState({url})}
                						placeholder='URL'
                						ref='url'
                						returnKeyType='next'
                            value={this.state.url}
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
                 {/*   <Button onPress={onButtonPress} title = 'Login' style={styles.loginButton} /> */}
              <TouchableOpacity style={styles.buttonContainer} onPress={this._userLogin.bind(this)} >
                    <Text  style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
     padding: 20
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
