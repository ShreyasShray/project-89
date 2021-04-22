import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList
} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import {ListItem, Icon} from 'react-native-elements'
import MyHeader from '../components/MyHeader';

export default class MyDonations extends React.Component{
    constructor(){
        super();
        this.state={
            user_id:firebase.auth().currentUser.email,
            user_name:'',
            allDonations:[]
        }
        this.allDonationRef=null
    }
    getAllDonations=async()=>{
        this.allDonationRef= db.collection("all_donations")
        .where("donor_id", "==", this.state.user_id)
        .onSnapshot(snapshot=>{
            var all_donations = snapshot.docs.map(document=>document.data());
            this.setState({
                allDonations:all_donations
            });
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

    sendItem=async(itemDetails)=>{
        if(itemDetails.request_status==="Item Sent"){
            var requestStatus = "Donor Interested";
            db.collection("all_donations").where("donor_id", "==", itemDetails.donor_id)
            .where("request_status", "==", itemDetails.request_status)
            .get()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    db.collection("all_donations").doc(doc.id).update({
                        request_status: "Donor Interested"
                    });
                    this.sendNotification(itemDetails, requestStatus)
                })
            })
        }else{
            var requestStatus = "Item Sent";
            db.collection("all_donations").where("donor_id", "==", itemDetails.donor_id)
            .where("request_id", "==", itemDetails.request_id)
            .get()
            .then((snapshot)=>{
                snapshot.forEach((doc)=>{
                    db.collection("all_donations").doc(doc.id).update({
                        request_status:"Item Sent"
                    });
                    this.sendNotification(itemDetails, requestStatus)
                })
            })
        }
    }

    sendNotification=async(itemDetails, request_status)=>{
        var request_id = itemDetails.request_id;
        var donor_id = itemDetails.donor_id;
        db.collection("notifications").where("request_id", "==", request_id)
        .where("donor_id", "==", donor_id)
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                var message = "";
                if(request_status==="Item Sent"){
                    message = this.state.user_name + " has sent the item"
                }else{
                    message = this.state.user_name + " has shown interest in donating the item"
                }
                db.collection("notifications").doc(doc.id).update({
                    message:message,
                    notification_status:"unread",
                    date:firebase.firestore.FieldValue.serverTimestamp()
                })
            })
        })
    }

    componentDidMount=()=>{
        this.getAllDonations();
        this.getUserName(this.state.user_id);
    }

    componentWillUnmount=()=>{
        this.allDonationRef();
    }

    keyExtractor=(item, index) => index.toString()
 
    renderItem=({item, i})=>{
        return(
        <ListItem
            key={i}
            title={item.item_name}
            subtitle={"Requested by: " + item.requested_by + "\nStatus: " + item.request_status}
            titleStyle={{textAlign:'center', fontSize:20, fontWeight:'bold'}}
            rightElement={
                <TouchableOpacity 
                    onPress={()=>{
                        this.sendItem(item);
                    }}
                    style={{width:100, backgroundColor:"#ff5722", alignItems:'center', padding:6}}>
                    <Text style={{fontSize:16, color:'white'}}>Send Item</Text>
                </TouchableOpacity>
            }
            bottomDivider
        />
        );
    }
    render(){
        return(
            <View>
                <MyHeader title="My Barters" navigation={this.props.navigation} />
                <View>
                    {this.state.allDonations.length===0?(
                        <View>
                            <Text style={{textAlign:'center', marginTop:200, fontSize:18}}>No Donations</Text>
                        </View>
                    ):(
                        <FlatList
                            keyExtractor={this.keyExtractor}
                            data={this.state.allDonations}
                            renderItem={this.renderItem}
                        ></FlatList>
                    )}
                </View>
            </View>
        );
    }
}