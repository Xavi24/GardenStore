import React,{Component} from 'react';
import {StackNavigator,DrawerNavigator,TabNavigator} from 'react-navigation'
import MainScreen from '../pages/MainScreen'
import Menu from '../pages/Menu'

const Pages_Function = StackNavigator({
  mainscreen : {screen:MainScreen},
});
const Drawer_fuction = DrawerNavigator({
  home:{screen:Pages_Function}
},
{
    translucent:true,
    contentComponent:props => <Menu {...props}/>,
    drawerBackgroundColor :'#fff',
    contentOptions: {
    inactiveTintColor : '#000000'
  }
});

export default Drawer_fuction;
