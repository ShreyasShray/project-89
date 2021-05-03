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
            description:'',
            isActiveRequest:'',
            user_doc_id:'',
            doc_id:'',
            requested_item_name:'',
            requested_item_status:'',
            request_id:''
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
            request_id:requestId,
            item_status:"requested",
            date:firebase.firestore.FieldValue.serverTimestamp()
        })
        Alert.alert("Item Added");
        db.collection("users").where("email_id", "==", this.state.user_id)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("users").doc(doc.id).update({
                    isActiveRequest:true
                })
            })
        })
    }

    getActiveRequestDetails=async()=>{
        db.collection("users").where("email_id", "==", this.state.user_id)
        .onSnapshot((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    isActiveRequest:doc.data().isActiveRequest,
                    user_doc_id:doc.id
                })
            })
        })
    }

    getRequestedItemDetails=async()=>{
        db.collection("item_request").where("user_id", "==", this.state.user_id)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    requested_item_name:doc.data().item_name,
                    requested_item_status:doc.data().item_status,
                    request_id:doc.data().request_id,
                    doc_id:doc.id
                })
            })
        })
    }

    itemReceived=async()=>{
        db.collection("users").doc(this.state.user_doc_id).update({
            isActiveRequest:false
        });
        db.collection("item_request").where("user_id", "==", this.state.user_id)
        .where("request_id", this.state.request_id)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("item_request").doc(doc.id).update({
                    item_status:"received"
                })
            })
        })
    }

    sendNotification=async()=>{
        var name, lastName;
        db.collection("users").where("email_id", "==", this.state.user_id)
        .get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            name = doc.data().first_name;
            lastName = doc.data().last_name;
          })
        })
    
        db.collection("notifications").where("request_id", "==", this.state.request_id)
        .get()
        .then((snapshot)=>{
          snapshot.forEach((doc)=>{
            var donorId = doc.data().donor_id
            var itemName = doc.data().item_name
            db.collection("notifications").add({
              targeted_user_id:donorId,
              message: name + " " + lastName + " received " + itemName,
              notification_status:"unread",
              item_name:itemName
            })
          })
        })
      }

    receivedItems=async()=>{
        var userId = this.state.user_id;
        var requestId = this.state.request_id;
        db.collection("received_items").add({
            item_name:this.state.requested_item_name,
            item_status:"received",
            user_id:userId,
            request_id:requestId
        })
    }

    componentDidMount=()=>{
        this.getActiveRequestDetails();
        this.getRequestedItemDetails()
    }

    render(){
        if(!this.state.isActiveRequest){
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
        }else{
            return(
                <View style={{flex:1, alignItems:'center'}}>
                    <Text style={{textAlign:'center', fontSize:20, marginTop:100}}>Item Name</Text>
                    <Text style={{borderWidth:2, width:280, borderColor:"#ff5722", padding:6, fontSize:18, textAlign:'center'}}>{this.state.requested_item_name}</Text>
                    <Text style={{textAlign:'center', fontSize:20, marginTop:40}}>Description</Text>
                    <Text style={{borderWidth:2, width:280, borderColor:"#ff5722", padding:6, fontSize:18, textAlign:'center'}} >{this.state.requested_item_status}</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>{
                        this.itemReceived();
                        this.sendNotification();
                        this.receivedItems()
                    }}>
                        <Text style={styles.buttonText}>I Received the Item</Text>
                    </TouchableOpacity>
                </View>
            );
        }
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