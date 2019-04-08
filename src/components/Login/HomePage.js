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
	Platform,
	BackHandler,
	NavigatorIOS
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import WebViewBridge from 'react-native-webview-bridge';
import RNExitApp from 'react-native-exit-app-no-history';

class HomePage extends Component {

		constructor(){
			super();
			this.state = {
				username: null,
				password: null,
				url: null,
				visible: true,
				message: null,
			}
		}

		loadInitialState = async () => {
			try {
					await AsyncStorage.getItem('username').then((username) => {
		 			 this.setState({ 'username': username});
		 		 });

		 		 await AsyncStorage.getItem('password').then((password) => {
		 			 this.setState({ 'password': password});
		 		 });

				 await AsyncStorage.getItem('url').then((url) => {
		 			 this.setState({ 'url': url});
		 		 });
			 } catch (error) {
			     	Alert.alert(error);
			 }
	  }

		onBridgeMessage(message){
    const { webviewbridge } = this.refs;

			switch (message) {
				case "valid":
				AsyncStorage.setItem('valid', JSON.stringify(true));
				this.hideSpinner();
	      break;
	      case "invalid":
				Alert.alert("Warning", "Username or Password was invalid.\nPlease try again");
				Actions.Authentication();
				AsyncStorage.setItem('valid', JSON.stringify(false));
				this.hideSpinner();
	      break;
				case "logout":
				AsyncStorage.setItem('valid', JSON.stringify(false));
				RNExitApp.exitApp();
				this.hideSpinner();
	      break;
	    }
			this.setState({ 'message': null });

   }

		componentDidMount() {
			this.setState({ 'message': 'Logging you in...'});
			this.loadInitialState().done()
		}

		showSpinner() {
        this.setState({ 'visible': true });
    }

    hideSpinner() {
        this.setState({ 'visible': false });
    }

		render() {
			const injectScript = `
			  (function () {
			       if (WebViewBridge) {
								if(document.getElementById('login_error')){
										WebViewBridge.send("invalid");
								}else if(document.getElementsByClassName('message').length == 1){
										WebViewBridge.send("logout");
										var nodes = document.getElementsByClassName('login');
										for(var i=0; i<nodes.length; i++) {
												nodes[i].style.opacity = 0.1;
												nodes[i].style.background = '#3f729b';
										}
										document.getElementById('loginform').style.opacity = 0.1;
								}else{
									  WebViewBridge.send("valid");
										var nodes = document.getElementsByClassName('login');
										for(var i=0; i<nodes.length; i++) {
												nodes[i].style.opacity = 0.1;
												nodes[i].style.background = '#3f729b';
										}
										document.getElementById('loginform').style.opacity = 0.1;
										document.getElementById('user_login').value = '`+ this.state.username + `';
										document.getElementById('user_pass').value = '`+ this.state.password + `';
										document.getElementById('loginform').submit();
								}
						 }
				  }());
			`;

			return (
			<View style={{ flex: 1 }}>
			{this.state.url && (
				<WebViewBridge
							useWebKit={true}
					    originWhitelist={["http://.*", "https://.*"]}
			        ref="webviewbridge"
			        onBridgeMessage={this.onBridgeMessage.bind(this)}
			        injectedJavaScript={injectScript}
							javaScriptEnabled={true}
							domStorageEnabled={true}
							bounces={false}
							startInLoadingState={true}
							scalesPageToFit={true}
			        source={{uri: this.state.url}}
							onLoadStart={() => (this.showSpinner())}
              //onLoad={() => (this.hideSpinner())}
					/>
					)}
							{this.state.visible && (
						   <View style={styles.loading}>
			          <ActivityIndicator
								  animating = {true}
			            style={{ position: "absolute" }}
			            size="large"
									color="white"
			          />
							  <Text style={styles.message}>{this.state.message}</Text>
							 </View>
			        )}
			</View>
				 );

		}
	}



	const styles = StyleSheet.create({
		container: {
			flex: 1,
			justifyContent: 'center'
		},
		message: {
			color : 'white',
			marginTop: 70
		},
		loading: {
	    position: 'absolute',
	    left: 0,
	    right: 0,
	    top: 0,
	    bottom: 0,
	    alignItems: 'center',
	    justifyContent: 'center',
			backgroundColor : '#3f729b'
	  }
	});

	export default HomePage;
