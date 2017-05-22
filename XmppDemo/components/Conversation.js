import React from 'react';
import {Image, View, Text, ScrollView, TextInput, Keyboard, ListView, Dimensions}  from 'react-native';
import styles from './styles';
const height = Dimensions.get('window').height;
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import xmpp from '../stores/XmppStore';
const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Conversation extends React.Component {
    static title(props){
        return xmpp.remote;
    }
    constructor(props) {
        super(props);
        this.state = {height:0}
    }
    componentDidMount () {
    	this.state.message = "hello";
	xmpp.sendMessage(this.state.message);
    	this.state.message = "";
    }
    componentWillMount () {
        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this));
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this));
        this.mounted = true;
      //  xmpp.login({local:xmpp.local, remote:xmpp.remote});
    }
    
    componentWillUnmount(){
        this.mounted = false;
        Keyboard.removeListener('keyboardWillShow');
        Keyboard.removeListener('keyboardWillHide');
    }
    keyboardWillShow (e) {
        if (this.mounted) this.setState({height: e.endCoordinates.height});
    }
    
    keyboardWillHide (e) {
        if (this.mounted) this.setState({height: 0});
    }
    

    render(){
        const dataSource = ds.cloneWithRows(xmpp.conversation.map(x=>x));
	let self = this;
	let send = function() {
	    let body = self.state.message;
	    if(body.startsWith("http://") || body.startsWith("https://")) {
	        fetch(body).then(function(response){ 
	            return response.text();
	        }).then(function(text){
	                let match = text.match(/<title>.*<\/title>/);
	                if(match != null && match.length >= 1) {
	                        let title = match[0].replace("<title>", "").replace("</title>", "");
				xmpp.sendMessage(body + " " + title);
                		self.setState({message:''});
	                }
	        }).catch(function(e){
	                console.log(e);
	        });
	    } else {
		xmpp.sendMessage(self.state.message);
		self.setState({message:''});
	    }
	}
        let pickImage = function (){
            var ImagePicker = require('react-native-image-picker');
            var options = {
	        title: 'Select Avatar',
	        customButtons: [
	            {name: 'fb', title: 'Choose Photo from Facebook'},
	        ],
	        storageOptions: {
	        skipBackup: true,
	        path: 'images'
            }
        };

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info below in README)
 */
    ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);

  if (response.didCancel) {
    console.log('User cancelled image picker');
  }
  else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  }
  else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  }
  else {
    let source = { uri: response.uri };

    // You can also display the image using data:
    // let source = { uri: 'data:image/jpeg;base64,' + response.data };

    this.setState({
      avatarSource: source
    });
  }
});
    }
        return (
            <View style={styles.container}>
                <View style={{flex:1}}>
                    <ListView enableEmptySections
                        ref="messages"
                        renderScrollComponent={props => <InvertibleScrollView {...props} inverted />}
                        dataSource={dataSource}
                        renderRow={(row) => {
			    if(row.text.startsWith("data:")){
                              return (<Image style={[styles.imageItem, {alignSelf: row.own ? 'flex-end':'flex-start' }]} source={{uri: row.text}}></Image>);
			    }else{
                              return (<Text style={[styles.messageItem, {textAlign:row.own ? 'right':'left' }]}>{row.text}</Text>);
			    }

			}}
                        />
                </View>
                <View style={styles.messageBar}>
                    <View style={{flex:1}}>
                        <TextInput ref='message'
                                   value={this.state.message}
                                   onChangeText={(message)=>this.setState({message})}
                                   style={styles.message} placeholder="Enter message..."/>
                    </View>
                    <View style={styles.sendButton}>
			<Button onPress={send} disabled={!this.state.message || !this.state.message.trim()}>Send</Button>
                   	<Button onPress={pickImage}>Image</Button>
                   </View>
                </View>
                <View style={{height:this.state.height}}></View>
            </View>
        )
    }
}
