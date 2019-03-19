import React, {Component} from 'react';
import {
	ActivityIndicator,
	AsyncStorage,
	Alert,
	Image,
	Text,
	TouchableOpacity,
	View,
	WebView,
	StyleSheet,
	NavigatorIOS
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import WebViewBridge from 'react-native-webview-bridge';
//const cheerio = require('react-native-cheerio');

class HomePage extends Component {

		constructor(){
			super();
			this.state = {
				username: null,
				password: null,
				url: null,
			}
		}

		loadInitialState = async () => {
			await AsyncStorage.getItem('username').then((username) => {
 			 this.setState({ username: username});
 		 });

 		 await AsyncStorage.getItem('password').then((password) => {
 			 this.setState({ password: password,});
 		 });

		 await AsyncStorage.getItem('url').then((url) => {
 			 this.setState({ url: url,});
 		 });

	  }

		onBridgeMessage(message){
    const { webviewbridge } = this.refs;

			switch (message) {
	      case "invalid":
				Actions.Authentication();
				AsyncStorage.setItem('valid', true);
	      break;
	    }
   }

		componentDidMount() {
			this.loadInitialState().done()
			//this.checkLoggedin().done()
		}


		render() {

			const injectScript = `
			  (function () {
			       if (WebViewBridge) {
								if(document.getElementById('login_error')){
										WebViewBridge.send("invalid");
								}else{
										document.getElementById('user_login').value = '`+ this.state.username + `';
										document.getElementById('user_pass').value = '`+ this.state.password + `';
										document.getElementById('wp-submit').click();
								}
						 }
				  }());
			`;

			return (
			<WebViewBridge
				    originWhitelist={["http://.*", "https://.*"]}
		        ref="webviewbridge"
		        onBridgeMessage={this.onBridgeMessage.bind(this)}
		        injectedJavaScript={injectScript}
						bounces={false}
						startInLoadingState={true}
						scalesPageToFit={true}
		        source={{uri: this.state.url}}/>
			 );

		}
	}



	const styles = StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: 'center'
		},
		horizontal: {
			flexDirection: 'row',
			paddingVertical: 10,
			backgroundColor : 'white'
		}
	});

	export default HomePage;
