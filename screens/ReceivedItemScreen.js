import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList
} from 'react-native';
import {ListItem} from 'react-native-elements';
import firebase from 'firebase';
import db from '../config'
import MyHeader from '../components/MyHeader';

export default class ReceivedItemScreen extends React.Component{
    constructor(){
        super();
        this.state={
            user_id:firebase.auth().currentUser.email,
            allReceivedItems:[]
        }
    }

    getAllReceivedItems=async()=>{
        db.collection("received_items").where("user_id", "==", this.state.user_id)
        .onSnapshot((snapshot)=>{
            snapshot.docs.map(doc=>{
                var allItemsList = []
                allItemsList.push(doc.data())
                this.setState({
                    allReceivedItems:allItemsList
                })
                console.log(this.state.allReceivedItems)
            })
        })
    }

    keyExtractor=(item, index)=>index.toString()

    renderItem=({item, index})=>{
        return(
            <ListItem
                key={index}
                title={item.item_name}
                subtitle={item.item_status}
                titleStyle={{fontSize:RFValue(20), fontWeight:'bold', color:"#000", textAlign:'center'}}
                bottomDivider
            ></ListItem>
        );
    }

    componentDidMount=()=>{
        this.getAllReceivedItems()
    }

    render(){
        return(
            <View>
                <MyHeader title="My Received Items" navigation={this.props.navigation} />
                <View>
                    {
                        this.state.allReceivedItems.length===0?(
                            <View>
                                <Text>No Received Items</Text>
                            </View>
                        ):(
                            <FlatList
                                keyExtractor={this.keyExtractor}
                                data={this.state.allReceivedItems}
                                renderItem={this.renderItem}
                            ></FlatList>
                        )
                    }
                </View> 
            </View>
        );
    }
}