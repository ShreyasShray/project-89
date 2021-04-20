import React from 'react';
import {createDrawerNavigator} from 'react-navigation-drawer';
import MyDonations from '../screens/MyDonations';
import SetttingScreen from '../screens/SettingScreen';
import {AppTabNavigator} from './AppTabNavigator';
import SideBarMenu from './SideBarMenu';
import Notifications from '../screens/Notifications';

export const DrawerTab = createDrawerNavigator({
    Home:{screen:AppTabNavigator},
    Settings:{screen:SetttingScreen},
    MyDonation:{screen:MyDonations},
    Notifications:{screen:Notifications}
},{
    contentComponent:SideBarMenu
},{
    initialRouteName:"Home"
}
)