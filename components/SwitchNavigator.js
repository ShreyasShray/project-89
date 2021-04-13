import {createSwitchNavigator} from 'react-navigation';
import WelcomeScreen from '../screens/WelcomeScreen';
import {AppTabNavigator} from './AppTabNavigator';

export const SwitchNavigator = createSwitchNavigator({
    WelcomeScreen:{screen:WelcomeScreen},
    TabNavigator:{screen:AppTabNavigator}
})