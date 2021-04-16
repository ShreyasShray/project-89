import React from 'react'
import {createBottomTabNavigator} from 'react-navigation-tabs';
import ExchangeScreen from '../screens/ExchangeScreen';
import {StackNavigator} from '../components/StackNavigator';
import {
    Image
} from 'react-native';

export const AppTabNavigator = createBottomTabNavigator({
    HomeScreen:{screen:StackNavigator,
            navigationOptions:{
            tabBarIcon:<Image source={require("../assets/home.png")} style={{width:30, height:30}}></Image>,
        tabBarLabel:"Home Screen"
        }
    },
    Exchange:{screen:ExchangeScreen,
        navigationOptions:{
            tabBarIcon:<Image source={require("../assets/barter.png")} style={{width:40, height:40}}></Image>,
            tabBarLabel:"Exchange"
        }
    }
})