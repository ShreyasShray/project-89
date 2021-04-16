import React from 'react';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from '../screens/HomeScreen';
import ReceiverDetailsScreen from '../screens/ReceiverDetailsScreen';

export const StackNavigator = createStackNavigator({
    DonateScreen:{screen:HomeScreen,
        navigationOptions:{
            headerShown:false
        }
    },
    ReceiverDetails:{screen:ReceiverDetailsScreen,
        navigationOptions:{
            headerTitle:"Receiver and Item Details"
        }
    }
},{
    initialRouteName:"DonateScreen"
});