import * as React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import {Card} from 'react-native-elements';
import { Alert } from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

export default class ReceiverDetailsScreen extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user_id:firebase.auth().currentUser.email,
            user_name:'',
            receiver_id:this.props.navigation.getParam("details")["user_id"],
            request_id:this.props.navigation.getParam("details")["request_id"],
            item_name:this.props.navigation.getParam("details")["item_name"],
            reason_to_request:this.props.navigation.getParam("details")["description"],
            item_value:this.props.navigation.getParam("details")["value"],
            receiver_name:'',
            receiver_contact:'',
            receiver_address:'',
            receiver_request_docId:'',
            currencyCode:'',
            currencyValue:''
        }
    }
    getReceiverDetails=async()=>{
        db.collection("users").where("email_id", "==", this.state.receiver_id)
        .get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiver_name:doc.data().first_name,
                    receiver_contact:doc.data().mobile_number,
                    receiver_address:doc.data().address
                })
            })
        })
        db.collection("item_request").where("request_id", "==", this.state.request_id)
        .get()
        .then(snapshot=>{
            snapshot.forEach(doc=>{
                this.setState({
                    receiver_request_docId:doc.id
                })
            })
        })
    }

    getUserName=async(userId)=>{
        db.collection("users").where("email_id", "==", userId)
        .get()
        .then(snapshot=>{
            snapshot.forEach((doc)=>{
                this.setState({
                    user_name: doc.data().first_name + " " + doc.data().last_name
                })
            })
        })
    }

    addItem=async()=>{
        db.collection("all_donations").add({
            item_name:this.state.item_name,
            request_id:this.state.request_id,
            requested_by:this.state.receiver_name,
            donor_id:this.state.user_id,
            request_status:"Donor Interested"
        })
        Alert.alert("Item added")
    }

    addNotification=async()=>{
        var message = this.state.user_name + " has shown interest in donationg the item"
        db.collection("notifications").add({
            targeted_user_id:this.state.receiver_id,
            donor_id:this.state.user_id,
            request_id:this.state.request_id,
            item_name:this.state.item_name,
            date:firebase.firestore.FieldValue.serverTimestamp(),
            notification_status:"unread",
            message:message
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
        this.getReceiverDetails();
        this.getUserName(this.state.user_id);
        this.getCurrencyCode();
    }
    render(){
        return(
            <ScrollView>
                <View>
                    <Card title="Item Details" titleStyle={{fontSize:20, fontWeight:'bold', textAlign:'center'}}>
                        <Card>
                            <Text>Item Name: {this.state.item_name}</Text>
                        </Card>
                        <Card>
                            <Text>Description: {this.state.reason_to_request}</Text>
                        </Card>
                        <Card>
                            <Text>Value: {Math.round(this.state.item_value*this.state.currencyValue)}</Text>
                        </Card>
                    </Card>
                    <Card title="Receiver Details" titleStyle={{fontSize:20, fontWeight:'bold', textAlign:'center'}}>
                        <Card>
                            <Text>Name: {this.state.receiver_name}</Text>
                        </Card>
                        <Card>
                            <Text>Contact: {this.state.receiver_contact}</Text>
                        </Card>
                        <Card>
                            <Text>Address: {this.state.receiver_address}</Text>
                        </Card>
                    </Card>
                    <View style={{alignItems:'center'}}>
                        {this.state.user_id===this.state.receiver_id?(undefined):(
                        <TouchableOpacity style={styles.buttonStyle} onPress={()=>{
                            this.addItem();
                            this.addNotification();
                            this.props.navigation.navigate("MyDonation")
                        }}>
                            <Text style={{fontSize:20, fontWeight:'bold', color:"#ffff"}}>Exchange</Text>
                        </TouchableOpacity>
                        )}
                    </View>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    buttonStyle:{
        backgroundColor:"#ff5722",
        alignItems:'center',
        padding:RFValue(10),
        width:RFValue(280),
        marginTop:RFValue(40),
        borderRadius:RFValue(10),
        marginBottom:RFValue(40),
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:8
        },
        elevation:16,
        shadowOpacity:0.44,
        shadowRadius:10
    }
})