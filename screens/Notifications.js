import * as React from 'react';
import {
    ScrollView,
    Text,
    View,
    StyleSheet,
    FlatList
} from 'react-native';
import {ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import firebase from 'firebase';
import db from '../config';
import SwipeableFlatlist from '../components/SwipeableFlatlist';
import {RFValue} from 'react-native-responsive-fontsize';

export default class Notifications extends React.Component{
    constructor(){
        super();
        this.state={
            user_id:firebase.auth().currentUser.email,
            all_notifications:[]
        }
        this.notificationRef=null
    }

    getNotification=async()=>{
        this.notificationRef = db.collection("notifications")
        .where("notification_status", "==", "unread")
        .where("targeted_user_id", "==", this.state.user_id)
        .onSnapshot((snapshot)=>{
            var allNotification = []
            snapshot.docs.map((doc)=>{
                var notification = doc.data();
                notification["doc_id"] = doc.id;
                allNotification.push(notification)
            });
            this.setState({
                all_notifications : allNotification
            })
        })
    }

    componentDidMount=()=>{
        this.getNotification()
    }

    componentWillUnmount=()=>{
        this.notificationRef()
    }

    keyExtractor = (item, index)=>index.toString();

    renderItem=({item, i})=>{
        return(
            <ListItem
                key={i}
                title={item.item_name}
                titleStyle={{ color: 'black', fontWeight: 'bold' }}
                subtitle={item.message}
            ></ListItem>
        );
    }

    render(){
        return(
            <View>
                <MyHeader title="Notifications" navigation={this.props.navigation} />
                <ScrollView>
                    {
                        this.state.all_notifications.length!==0?(
                            <SwipeableFlatlist all_notifications={this.state.all_notifications} />
                        ):(
                            <View style={{alignItems:'center', marginTop:RFValue(200)}}>
                                <Text style={{fontSize:RFValue(20)}}>
                                    You have no notifications
                                </Text>
                            </View>
                        )
                    }
                </ScrollView>
            </View>
        );
    }
}