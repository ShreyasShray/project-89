import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import MyDonations from '../screens/MyDonations';
import SetttingScreen from '../screens/SettingScreen';
import {AppTabNavigator} from './AppTabNavigator';
import SideBarMenu from '../components/SideBarMenu';
import Notifications from '../screens/Notifications';
import ReceivedItemScreen from '../screens/ReceivedItemScreen';
import {Icon} from 'react-native-elements';

export const DrawerTab = createDrawerNavigator({
    Home:{
        screen:AppTabNavigator,
        navigationOptions:{
            drawerIcon:<Icon name="home" type="font-awesome5" ></Icon>
        }
    },
    Settings:{
        screen:SetttingScreen,
        navigationOptions:{
            drawerIcon:<Icon name="settings" type="font-awesome5" ></Icon>,
            drawerLabel:"Settings"
        }
    },
    MyDonation:{
        screen:MyDonations,
        navigationOptions:{
            drawerIcon:<Icon name="gift" type="font-awesome" ></Icon>,
            drawerLabel:"My Donations"
        }
    },
    Notifications:{
        screen:Notifications,
        navigationOptions:{
            drawerIcon:<Icon name="bell" type="font-awesome" ></Icon>,
            drawerLabel:"Notifications"
        }
    },
    ReceivedItems:{
        screen:ReceivedItemScreen,
        navigationOptions:{
            drawerIcon:<Icon name="gift" type="font-awesome" ></Icon>,
            drawerLabel:"Received Items"
        }
    }
},{
    contentComponent:SideBarMenu
},{
    initialRouteName:"Home"
}
)