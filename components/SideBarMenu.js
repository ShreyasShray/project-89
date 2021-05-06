import * as React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Platform,
} from 'react-native';
import firebase from 'firebase';
import {DrawerItems} from 'react-navigation-drawer';
import { Avatar } from "react-native-elements";
import db from '../config';
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import * as Permissions from "expo-permissions";

export default class SideBarMenu extends React.Component{
    state = {
        userId: firebase.auth().currentUser.email,
        image: "#",
        name: "",
        docId: "",
    };
    
    selectPicture = async () => {
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!cancelled) {
          this.uploadImage(uri, this.state.userId);
        }
    };
    
    uploadImage = async (uri, imageName) => {
        var response = await fetch(uri);
        var blob = await response.blob();
    
        var ref = firebase
            .storage()
            .ref()
            .child("user_profiles/" + imageName);
    
        return ref.put(blob).then((response) => {
          this.fetchImage(imageName);
        });
    };
    
    fetchImage = (imageName) => {
        var storageRef = firebase
            .storage()
            .ref()
            .child("user_profiles/" + imageName);
    
        // Get the download URL
        storageRef
            .getDownloadURL()
            .then((url) => {
              this.setState({ image: url });
            })
            .catch((error) => {
              this.setState({ image: "#" });
            });
    };
    
    getUserProfile() {
        db.collection("users")
          .where("email_id", "==", this.state.userId)
          .onSnapshot((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.setState({
                name: doc.data().first_name + " " + doc.data().last_name,
                docId: doc.id,
                image: doc.data().image,
              });
            });
          });
      }
    
    componentDidMount() {
        this.fetchImage(this.state.userId);
        this.getUserProfile();
    }

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
                <View style={{flex: 0.5,alignItems: "center",backgroundColor: "orange"}}>
                    <Avatar
                        rounded
                        source={{
                            uri: this.state.image,
                        }}
                        size="medium"
                        onPress={() => this.selectPicture()}
                        containerStyle={styles.imageContainer}
                        showEditButton
                    />
                    
                    <Text style={{ fontWeight: "100", fontSize: 20, paddingTop: 10 }}>
                        {this.state.name}
                    </Text>
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
    },
    imageContainer: {
        flex: 0.75,
        width: "40%",
        height: "20%",
        marginLeft: 20,
        marginTop: 30,
        borderRadius: 40,
      }
})