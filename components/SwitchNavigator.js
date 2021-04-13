import {createSwitchNavigator} from 'react-navigation';
import WelcomeScreen from '../screens/WelcomeScreen';
import { DrawerTab } from '../components/DrawerTab';

export const SwitchNavigator = createSwitchNavigator({
    WelcomeScreen:{screen:WelcomeScreen},
    DrawerTab:{screen:DrawerTab}
})