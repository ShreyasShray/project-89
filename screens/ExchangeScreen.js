import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView
} from 'react-native';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';
import { Alert } from 'react-native';

export default class ExchangeScreen extends React.Component{
    constructor(){
        super();
        this.state={
            user_id:firebase.auth().currentUser.email,
            item_name:'',
            description:''
        }
    }
    createUniqueId(){
        return Math.random().toString(36).substring(7);
    }
    addItemRequest=async()=>{
        var userId = this.state.user_id;
        var requestId = this.createUniqueId();
        db.collection("item_request").add({
            item_name:this.state.item_name,
            description:this.state.description,
            user_id:userId,
            request_id:requestId
        })
        Alert.alert("Item Added")
    }
    render(){
        return(
            <KeyboardAvoidingView>
                <MyHeader title="Exchange" navigation={this.props.navigation} />
                <View style={{alignItems:'center', marginTop:140}}>
                    <TextInput style={styles.inputBox} placeholder="Item Name" onChangeText={(text)=>{this.setState({item_name:text})}}></TextInput>
                    <TextInput style={[styles.inputBox, {height:100}]} multiline numberOfLines={14}  placeholder="Description" onChangeText={(text)=>{this.setState({description:text})}}></TextInput>
                </View>
                <View style={{alignItems:'center', marginBottom:40}}>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.addItemRequest()}}>
                        <Text style={styles.buttonText}>Add Item</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    inputBox:{
        marginTop:30,
        borderWidth:1,
        borderRadius:8,
        padding:6,
        width:280,
        borderColor:'#f8be85'
    },
    buttonStyle:{
        width:280,
        padding:10,
        borderRadius:10,
        backgroundColor:"#fb5722",
        shadowColor: "black",
        shadowOffset: {
           width: 0,
           height: 8,
        },
        shadowOpacity:0.44,
        elevation:18,
        marginTop:40,
        alignItems:'center'
    },
    buttonText:{
        color:'white',
        fontSize:20,
        fontWeight:'bold'
    }
})