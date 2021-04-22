import * as React from 'react';
import {
    Animated,
    View,
    Text,
    Dimensions,
    StyleSheet
} from 'react-native';
import firebase from 'firebase';
import db from '../config';
import {ListItem} from 'react-native-elements';
import {SwipeListView} from 'react-native-swipe-list-view';

export default class SwipeableFlatlist extends React.Component{
    constructor(props){
        super(props);
        this.state={
            user_id:firebase.auth().currentUser.email,
            all_notification:this.props.all_notifications
        }
    }

    updateMarkAsRead=async()=>{
        db.collection("notifications").where("targated_user_id", "==", this.state.user_id)
        .where("notification_status", "==", "unread")
        .get()
        .then((snapshot)=>{
            snapshot.forEach((doc)=>{
                db.collection("notifications").doc(doc.id).update({
                    notification_status:"read"
                })
            })
        })
    }

    onSwipeValueChange=swipeData=>{
        var all_notification = this.state.all_notification;
        const {key, value} = swipeData
        if( value < -Dimensions.get("window").width){
            const newData = [...all_notification]
            this.updateMarkAsRead()
            newData.splice(key, 1)
            this.setState({
                all_notification:newData
            })
        }
    }

    renderItem=data=>(
        <Animated.View>
            <ListItem
                title={data.item.item_name}
                titleStyle={{textAlign:'center', fontWeight:'bold', color:'black'}}
                subtitle={data.item.message}
                bottomDivider
            ></ListItem>
        </Animated.View>
    )

    renderHiddenItem=()=>(
        <View style={styles.viewStyle}>
            <View style={styles.view2}>
                <Text style={styles.textStyle}>
                    Mark As Read
                </Text>
            </View>
        </View>
    )

    render(){
        return(
            <View>
                <SwipeListView
                    disableRightSwipe
                    data={this.state.all_notification}
                    renderItem={this.renderItem}
                    renderHiddenItem={this.renderHiddenItem}
                    rightOpenValue={-Dimensions.get("window").width}
                    previewRowKey={0}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                    onSwipeValueChange={this.onSwipeValueChange}
                ></SwipeListView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewStyle:{
        alignItems:'center',
        backgroundColor:"#ff5722",
        flex:1,
        flexDirection:'row',
        justifyContent:"space-between",
        paddingLeft:15
    },
    view2:{
        alignItems:'center',
        bottom:0,
        justifyContent:'center',
        position:'absolute',
        top:0,
        width:100
    },
    textStyle:{
        fontSize:14,
        fontWeight:"bold",
        textAlign:'center',
        color:"#000",
        textAlign:'center'
    }
})