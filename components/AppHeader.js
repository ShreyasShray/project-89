import * as React from 'react';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

class AppHeader extends React.Component{
    render(){
        return(
            <View style={styles.container}>
                <Text style={styles.displayText}>Barter App</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        paddingTop:34,
        paddingBottom:4,
        backgroundColor:"#feb906"
    },
    displayText:{
        fontSize:20,
        fontWeight:'bold',
        textAlign:'center'
    }
});

export default AppHeader;