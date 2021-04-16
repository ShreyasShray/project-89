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

    componentDidMount=()=>{
        this.getAllDonations()
    }

    componentWillUnmount=()=>{
        this.allDonationRef()
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
                <TouchableOpacity style={{width:100, backgroundColor:"#ff5722", alignItems:'center', padding:6}}>
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
                <MyHeader title="My Donations" />
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