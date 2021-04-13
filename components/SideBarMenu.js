import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import firebase from 'firebase';
import {DrawerItems} from 'react-navigation-drawer';

export default class SideBarMenu extends React.Component{
    render(){
        return(
            <View>
                <DrawerItems
                    {...this.props}
                />
                <View>
                    <TouchableOpacity style={styles.buttonStyle} onPress={()=>{
                        firebase.auth().signOut()
                        this.props.navigation.navigate("WelcomeScreen")
                    }}>
                        <Text style={styles.displayText}>LogOut</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    displayText:{
        textAlign:'center',
        fontSize:20,
        fontWeight:'bold'
    },
    buttonStyle:{
        margin:8,
        alignItems:'center',
        backgroundColor:'skyblue',
        padding:10
    }
})