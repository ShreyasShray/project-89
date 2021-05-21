import * as React from 'react';
import {
  View,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  KeyboardAvoidingViewComponent
} from 'react-native';
import AppHeader from '../components/AppHeader';
import firebase from 'firebase';
import db from '../config';

export default class WelcomeScreen extends React.Component{
  constructor(){
    super();
    this.state={
      emailId:'',
      password:'',
      confirmPassword:'',
      first_name:'',
      last_name:'',
      user_name:'',
      mobile_number:'',
      address:'',
      isModalVisible:false,
      currencyCode:''
    }
  }
  signUp=async()=>{
    this.setState({isModalVisible:true});
  }
  userSignUp=async(email, password, confirmPassword)=>{
    if(password !== confirmPassword){
      return Alert.alert("Password Doesn't Match");
    }else{
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(()=>{
        db.collection("users").add({
          first_name:this.state.first_name,
          last_name:this.state.last_name,
          user_name:this.state.user_name,
          mobile_number:this.state.mobile_number,
          address:this.state.address,
          email_id:this.state.emailId,
          isActiveRequest:false,
          currencyCode:''
        });
        return Alert.alert("User Added Successfully")
      })
      .catch((error)=>{
        var errorMessage = error.message;
        return Alert.alert((errorMessage))
      })
    }
  }
  login=async(email, password)=>{
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(()=>{
      this.props.navigation.navigate("DrawerTab")
    })
    .catch((error)=>{
      var errorMessage = error.message;
      return Alert.alert(errorMessage);
    })
  }

  currencyCode=(currency)=>{
    db.collection("users").where("email_id", "==", firebase.auth().currentUser.email)
    .get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection("users").doc(doc.id).update({
          currencyCode:currency
        })
      })
    })
  }

  render(){
    return(
      <KeyboardAvoidingView style={{flex:1, backgroundColor:'#f7e0ff'}}>
        <Modal
          animationType="fade"
          transparent={false}
          visible={this.state.isModalVisible}
        >
          <View>
            <ScrollView>
              <KeyboardAvoidingView style={styles.modalInputBoxContainer}>
                <Text style={{textAlign:'center', marginTop:20, marginBottom:20, color:'orange', fontSize:20, fontWeight:'bold'}}>Registration</Text>
                <TextInput style={styles.modalInputBox} placeholder="First Name" maxLength={16} onChangeText={(text)=>{this.setState({first_name:text})}} />
                <TextInput style={styles.modalInputBox} placeholder="Last Name" maxLength={16} onChangeText={(text)=>{this.setState({last_name:text})}} />
                <TextInput style={styles.modalInputBox} placeholder="Mobile Number" keyboardType={'numeric'} maxLength={10} onChangeText={(text)=>{this.setState({mobile_number:text})}} />
                <TextInput style={styles.modalInputBox} placeholder="User Name" onChangeText={(text)=>{this.setState({user_name:text})}} />
                <TextInput style={styles.modalInputBox} placeholder="Eamil Address" keyboardType="email-address" onChangeText={(text)=>{this.setState({emailId:text})}} />
                <TextInput style={styles.modalInputBox} placeholder="Home Address"  multiline={true} onChangeText={(text)=>{this.setState({address:text})}} />
                <TextInput style={styles.modalInputBox} placeholder="Create Password" secureTextEntry={true} onChangeText={(text)=>{this.setState({password:text})}} />
                <TextInput style={styles.modalInputBox} placeholder="Confirm Password" secureTextEntry={true} onChangeText={(text)=>{this.setState({confirm_password:text})}} />
                <View style={styles.modalButtonContainer}>
                    <TouchableOpacity style={styles.modalButtonStyle} onPress={()=>{this.setState({isModalVisible:false})}}><Text style={{fontSize:20, fontWeight:'bold'}}>back</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.modalButtonStyle} onPress={()=>{this.userSignUp(this.state.emailId, this.state.password, this.state.confirm_password)}}><Text style={{fontSize:20, fontWeight:'bold'}}>Register</Text></TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </ScrollView>
          </View>
        </Modal>
        <AppHeader/>
        <View style={styles.boxContainer}>
          <TextInput style={styles.inputBox} placeholder="abc@example.com" keyboardType="email-address" onChangeText={(text)=>{this.setState({emailId:text})}}></TextInput>
          <TextInput style={styles.inputBox} placeholder="password" secureTextEntry={true} onChangeText={(text)=>{this.setState({password:text})}}></TextInput>
          <TextInput style={styles.inputBox} placeholder=" Country Currency Code " onChangeText={(text)=>{
            this.setState({currencyCode:text})
            }} ></TextInput>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.buttonStyle} onPress={()=>{
            this.login(this.state.emailId, this.state.password)
            this.currencyCode(this.state.currencyCode)
          }}>
            <Text style={{fontWeight:'bold', fontSize:20, textAlign:'center'}}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.signUp()}}>
            <Text style={{fontWeight:'bold', fontSize:20, textAlign:'center'}}>Sign Up</Text>
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
    borderBottomWidth:1.4,
    paddingLeft:10,
    marginTop:50,
    width:280,
    fontSize:18
  },
  buttonContainer:{
    alignItems:'center'
  },
  buttonStyle:{
    borderRadius:10,
    paddingLeft:5,
    paddingRight:5,
    backgroundColor:"#1c9cff",
    width:280,
    marginTop:50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16
  },
  modalInputBoxContainer:{
    alignItems:'center'
  },
  modalInputBox:{
      paddingLeft:5,
      borderWidth:1.4,
      borderRadius:4,
      width:280,
      marginTop:30
  },
  modalButtonStyle:{
      borderRadius:6,
      backgroundColor:"skyblue",
      paddingLeft:6,
      paddingRight:6,
      marginLeft:30,
      marginRight:30
  },
  modalButtonContainer:{
      display:'flex',
      flexDirection:'row',

      marginTop:40
  }
})