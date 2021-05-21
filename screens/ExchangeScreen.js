import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    ScrollView,
    Alert
} from 'react-native';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';
import {Input} from 'react-native-elements';
import {RFValue} from 'react-native-responsive-fontsize';

export default class ExchangeScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user_id:firebase.auth().currentUser.email,
            item_name:'',
            description:'',
            item_value:'',
            isActiveRequest:'',
            user_doc_id:'',
            doc_id:'',
            requested_item_name:'',
            requested_item_status:'',
            request_id:'',
            requested_item_value:'',
            currencyCode:'',
            currencyValue:''
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
            value:(this.state.item_value/this.state.currencyValue),
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
                    doc_id:doc.id,
                    requested_item_value:(doc.data().value*this.state.currencyValue)
                })
                console.log(this.state.request_id)
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
    
    getCurrencyCode=async()=>{
        db.collection("users").where("email_id", "==", this.state.user_id)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    currencyCode:doc.data().currencyCode
                })
                console.log("Currency Code", this.state.currencyCode)
            })
        })
        fetch("http://data.fixer.io/api/latest?access_key=356e72c560338820c6536705515f3894")
        .then(response=>{
            return response.json();
        })
        .then((responseData)=>{
            var currency = this.state.currencyCode
            var currencyValue = responseData.rates[currency]
            this.setState({
                currencyValue:currencyValue
            })
            console.log("Currency Value", this.state.currencyValue)
        })
    }

    componentDidMount=()=>{
        this.getActiveRequestDetails();
        this.getRequestedItemDetails();
        this.getCurrencyCode();
    }

    render(){
        if(!this.state.isActiveRequest){
            return(
                <KeyboardAvoidingView>
                    <MyHeader title="Exchange" navigation={this.props.navigation} />
                    <View style={{alignItems:'center', marginTop:RFValue(140)}}>
                        <Input 
                        style={styles.inputBox} 
                        label="Item Name"
                        placeholder="Item Name" 
                        onChangeText={(text)=>{this.setState({item_name:text})}}
                        ></Input>
                        <Input 
                        style={styles.inputBox} 
                        label="Value"
                        placeholder="Value of your item" 
                        onChangeText={(text)=>{this.setState({item_value:text})}}
                        ></Input>
                        <Input 
                        style={[styles.inputBox, {height:100}]} 
                        multiline numberOfLines={14}  
                        label="Description"
                        placeholder="Description" 
                        onChangeText={(text)=>{this.setState({description:text})}}
                        ></Input>
                    </View>
                    <View style={{alignItems:'center', marginBottom:RFValue(40)}}>
                        <TouchableOpacity style={styles.buttonStyle} onPress={()=>{this.addItemRequest()}}>
                            <Text style={styles.buttonText}>Add Item</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            );
        }else{
            return(
                <KeyboardAvoidingView>
                <ScrollView>
                <View style={{flex:1, alignItems:'center'}}>
                    <MyHeader title="Exchange Screen" navigation = {this.props.navigation} />
                    <Text style={{textAlign:'center', fontSize:RFValue(20), marginTop:RFValue(100)}}>Item Name</Text>
                    <Text style={{borderWidth:RFValue(2), width:RFValue(280), borderColor:"#ff5722", padding:6, fontSize:RFValue(18), textAlign:'center'}}>{this.state.requested_item_name}</Text>
                    <Text style={{textAlign:'center', fontSize:RFValue(20), marginTop:RFValue(40)}}>Status</Text>
                    <Text style={{borderWidth:RFValue(2), width:RFValue(280), borderColor:"#ff5722", padding:6, fontSize:RFValue(18), textAlign:'center'}} >{this.state.requested_item_status}</Text>
                    <Text style={{textAlign:'center', fontSize:RFValue(20), marginTop:RFValue(40)}}>Value</Text>
                    <Text style={{borderWidth:RFValue(2), width:RFValue(280), borderColor:"#ff5722", padding:6, fontSize:RFValue(18), textAlign:'center'}} >{this.state.requested_item_value}</Text>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>{
                        this.itemReceived();
                        this.sendNotification();
                        this.receivedItems()
                    }}>
                        <Text style={styles.buttonText}>I Received the Item</Text>
                    </TouchableOpacity>
                </View>
                </ScrollView>
                </KeyboardAvoidingView>
            );
        }
    }
}

const styles = StyleSheet.create({
    inputBox:{
        marginTop:RFValue(30),
        borderWidth:RFValue(1),
        borderRadius:RFValue(8),
        padding:RFValue(6),
        width:RFValue(280),
        borderColor:'#f8be85'
    },
    buttonStyle:{
        width:RFValue(280),
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
        fontSize:RFValue(20),
        fontWeight:'bold'
    }
})