import * as React from 'react';
import WelcomeScreen from './screens/WelcomeScreen';
import {createAppContainer} from 'react-navigation';
import { SwitchNavigator } from './components/SwitchNavigator';

export default class App extends React.Component{
  render(){
    return(
      <AppContainer/>
    );
  }
}

const AppContainer = createAppContainer(SwitchNavigator)