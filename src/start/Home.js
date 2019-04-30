import React,{Component} from 'react';
import {createStackNavigator,createDrawerNavigator  ,TabNavigator} from 'react-navigation'
import MainScreen from '../pages/MainScreen'
import Menu from '../pages/Menu'

const Pages_Function = createStackNavigator({
    mainscreen : {screen:MainScreen},
});
const Drawer_fuction = createDrawerNavigator ({
        home:{screen:Pages_Function}
    },
    {
        translucent:true,
        contentComponent: (props) => <Menu {...props}/>,
        drawerBackgroundColor :'#fff',
        contentOptions: {
            inactiveTintColor : '#000000'
        }
    });

export default Drawer_fuction;
