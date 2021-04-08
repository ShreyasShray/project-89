import * as React from 'react';
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import AppHeader from '../components/AppHeader';
import firebase from 'firebase';
import db from '../config'

export default class WelcomeScreen extends React.Component{
  constructor(){
    super();
    this.state={
      emailId:'',
      password:'' 
    }
  }
  signUp=async(email, password)=>{
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((response)=>{
      return Alert.alert("User Added")
    })
    .catch((error)=>{
      var errorMessage = error.message;
      return Alert.alert(errorMessage)
    })
  }
  login=async(email, password)=>{
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(()=>{
      return Alert.alert("Login Successfully")
    })
    .catch((error)=>{
      var errorMessage = error.message;
      return Alert.alert(errorMessage);
    })
  }
  render(){
    return(
      <KeyboardAvoidingView>
        <AppHeader/>
        <View style={styles.boxContainer}>
          <TextInput style={styles.inputBox} placeholder="abc@example.com" keyboardType="email-address" onChangeText={(text)=>{this.setState({emailId:text})}}></TextInput>
          <TextInput style={styles.inputBox} placeholder="password" secureTextEntry={true} onChangeText={(text)=>{this.setState({password:text})}}></TextInput>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.signUp(this.state.emailId, this.state.password)}}>
            <Text style={{fontWeight:'bold', fontSize:20, textAlign:'center'}}>Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.login(this.state.emailId, this.state.password)}}>
            <Text style={{fontWeight:'bold', fontSize:20, textAlign:'center'}}>Login</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  boxContainer:{
    alignItems:'center'
  },
  inputBox:{
    borderWidth:1.4,
    borderRadius:4,
    paddingLeft:4,
    marginTop:40,
    width:280
  },
  buttonContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-around'
  },
  buttonStyle:{
    borderRadius:6,
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:"#1c9cff",
    width:100,
    marginTop:40,
    shadowOffset:{width:0, height:5},
    shadowColor:"gray"
  }
})