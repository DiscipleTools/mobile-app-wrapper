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

class HomePage extends Component {

		constructor(){
			super();
			this.state = {
				username: null,
				password: null,
				url: null,
				visible: true,
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
				AsyncStorage.setItem('valid', "true");
	      break;

	      case "invalid":
				Alert.alert("Warning", "Username or Password was invalid.\nPlease try again");
				Actions.Authentication();
				AsyncStorage.setItem('valid', "false");
	      break;
	    }
   }

		componentDidMount() {
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
								}else{
									  WebViewBridge.send("valid");
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
							bounces={false}
							startInLoadingState={true}
							scalesPageToFit={true}
			        source={{uri: this.state.url}}
							onLoadStart={() => (this.showSpinner())}
              onLoad={() => (this.hideSpinner())}
					/>
					)}
							{this.state.visible && (
						   <View style={styles.loading}>
			          <ActivityIndicator
								  animating = {true}
			            style={{ position: "absolute" }}
			            size="large"
									color="#3f729b"
			          />
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
		horizontal: {
			flexDirection: 'row',
			paddingVertical: 10,
			backgroundColor : 'white'
		},
		loading: {
	    position: 'absolute',
	    left: 0,
	    right: 0,
	    top: 0,
	    bottom: 0,
	    alignItems: 'center',
	    justifyContent: 'center'
	  }
	});

	export default HomePage;
