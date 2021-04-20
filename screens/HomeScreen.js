import * as React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    FlatList
} from 'react-native';
import {ListItem} from 'react-native-elements';
import MyHeader from '../components/MyHeader';
import db from '../config';

export default class HomeScreen extends React.Component{
    constructor(){
        super();
        this.state={
            allItems:[]
        },
        this.requestRef = null;
    }
    getAllItemsList=async()=>{
        this.requestRef = db.collection("item_request")
        .onSnapshot(snapshot=>{
            var allItemsList = snapshot.docs.map(document=>document.data())
            this.setState({
                allItems:allItemsList
            })
        })
    }
    componentDidMount=()=>{
        this.getAllItemsList()
    }
    componentWillUnmount=()=>{
        this.requestRef()
    }
    keyExtractor = (item, index) => index.toString()

    renderItem = ( {item, i} ) =>{
      return (
        <ListItem
          key={i}
          title={item.item_name}
          subtitle={item.description}
          titleStyle={{ color: 'black', fontWeight: 'bold' }}
          rightElement={
              <TouchableOpacity style={styles.button} onPress={()=>{this.props.navigation.navigate("ReceiverDetails", {details:item})}}>
                <Text style={{color:'#ffff'}}>View</Text>
              </TouchableOpacity>
            }
            bottomDivider
        />
      )
    }

    render(){
        return(
            <KeyboardAvoidingView>
                <MyHeader title="Home Screen" navigation={this.props.navigation} />
                {
                    this.state.allItems.length === 0?(
                        <View>
                            <Text style={{textAlign:'center', marginTop:200}}>All Item Request</Text>
                        </View>
                    ):(
                        <FlatList 
                            keyExtractor={this.keyExtractor}
                            data={this.state.allItems} 
                            renderItem={this.renderItem}
                        ></FlatList>
                    )
                }
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    button:{
        width:100,
        height:30,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:"#ff5722"
    }
})