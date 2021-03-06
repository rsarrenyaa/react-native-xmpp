import React from 'react';
import {View, Text, ScrollView, TextInput, ListView, Dimensions}  from 'react-native';
import styles from './styles';
import Button from 'react-native-button';
import ActivityIndicator from './ActivityIndicator';
import xmpp from '../stores/XmppStore';

export default class Login extends React.Component {
  constructor(props){
    super(props);
    this.state = {
	local: "sarrenyaa",
	localPassword: "P@ssw0rd",
	remote: "seri"
    };
  }
  componentDidMount() {
  
	xmpp.login(this.state)

  }
  render(){
    return (
      <View style={[styles.container,{alignItems:'center'}]}>
        {xmpp.loginError && <Text style={{color:'red'}}>{xmpp.loginError}</Text>}
        <Text style={styles.categoryLabel}>Please enter local and remote usernames and local password</Text>
        <Text style={styles.categoryLabel}>(rntestuserN, where N=1,2,3 or 4) </Text>
        <View style={styles.row}>
          <TextInput style={styles.rowInput}
                     autoCorrect={false}
                     autoCapitalize="none"
                     autoFocus={true}
                     placeholder="Local (@jabber.hylaa.net)"
                     value={this.state.local}
                     onChangeText={(local)=>this.setState({local})}
          />
        </View>
        <View style={styles.row}>
          <TextInput style={styles.rowInput}
                     autoCorrect={false}
                     autoCapitalize="none"
                     autoFocus={true}
                     placeholder="Local Password ('')"
                     value={this.state.localPassword}
                     onChangeText={(localPassword)=>this.setState({localPassword})}
          />
        </View>
        <View style={styles.lastRow}>
          <TextInput style={styles.rowInput}

                     autoCorrect={false}
                     autoCapitalize="none"
                     placeholder="Remote (@jabber.hylaa.net)"
                     value={this.state.remote}
                     onChangeText={(remote)=>this.setState({remote})}
          />
        </View>
          <View style={styles.button}><Button onPress={()=>xmpp.login(this.state)}>Login</Button></View>
        <ActivityIndicator active={xmpp.loading}/>
      </View>
    )
  }
}
