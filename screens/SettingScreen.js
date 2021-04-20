import * as React from 'react';
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import MyHeader from '../components/MyHeader'
import firebase from 'firebase';
import db from '../config';

export default class SetttingScreen extends React.Component{
    constructor(){
        super();
        this.state={
            first_name:'',
            last_name:'',
            address:'',
            contact:'',
            doc_id:'',
            emailId:''
        }
    }
    getUserDetail=async()=>{
        var user = firebase.auth().currentUser;
        var email = user.email;
        db.collection("users").where("email_id","==", email).get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var data = doc.data();
                this.setState({
                    emailId:data.email_id,
                    first_name:data.first_name,
                    last_name:data.last_name,
                    address:data.address,
                    contact:data.mobile_number,
                    doc_id:doc.id
                })
            
            })
        })
    }
    updateUserDetails=async()=>{
        db.collection("users").doc(this.state.doc_id).update({
            first_name:this.state.first_name,
            last_name:this.state.last_name,
            address:this.state.address,
            mobile_number:this.state.contact
        })
    }
    componentDidMount=()=>{
        this.getUserDetail()
    }
    render(){
        return(
            <KeyboardAvoidingView>
                <MyHeader title="Settings" navigation={this.props.navigation} ></MyHeader>
                <ScrollView>
                    <View style={{alignItems:'center'}}>
                        <TextInput style={styles.inputBox } value={this.state.first_name} placeholder="First Name" onChangeText={(text)=>{this.setState({first_name:text})}}></TextInput>
                        <TextInput style={styles.inputBox } value={this.state.last_name} placeholder="Last Name" onChangeText={(text)=>{this.setState({last_name:text})}}></TextInput>
                        <TextInput style={styles.inputBox } value={this.state.address} placeholder="Address" onChangeText={(text)=>{this.setState({address:text})}}></TextInput>
                        <TextInput style={styles.inputBox } value={this.state.contact} placeholder="Contact" keyboardType="numeric" maxLength={10} onChangeText={(text)=>{this.setState({contact:text})}}></TextInput>
                    </View>
                    <View style={{alignItems:'center'}}>
                        <TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.updateUserDetails()}}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    inputBox:{
        width:280,
        paddingLeft:6,
        borderWidth:1,
        borderRadius:4,
        marginTop:50
    },
    buttonStyle:{
        backgroundColor:"#ff5722",
        width:280,
        marginTop:40,
        borderRadius:10,
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:8
        },
        elevation:16,
        shadowOpacity:0.64,
        shadowRadius:10,
        marginBottom:40
    },
    buttonText:{
        textAlign:'center',
        fontSize:20,
        fontWeight:'bold',
        padding:8,
        color:'white'
    }
})