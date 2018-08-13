import React,{Component} from 'react'
import {StackNavigator} from 'react-navigation'
import {TabNavigator,TabBarBottom} from 'react-navigation'

import Getstarted from './src/start/Getstarted'
import HomePage from './src/start/HomePage'
import Home from './src/start/Home'
import Register from './src/pages/Register'
import Login from './src/pages/Login'
import WishList from './src/pages/WishList'
import Cart from './src/pages/Cart'
import Wallet from './src/pages/Wallet'
import Filter from './src/pages/Filter'
import Details from './src/pages/Details'
import Add_Address from './src/pages/Add_Address'
import Buy_Now from './src/pages/Buy_Now'
import Customization from './src/pages/Customization'
import Shop from './src/pages/Shop.js'
import SearchData from './src/pages/SearchData'
import Settings from './src/pages/Settings'
import Change_Password from './src/pages/Change_Password'
import ForgotPassword from './src/pages/ForgotPassword'
import Profile from './src/pages/Profile'
import Edit_Address from './src/pages/Edit_Address'
import filterData from './src/pages/filterData'
import Sort from './src/pages/Sort'
import SortData from './src/pages/SortData'
import CMS from './src/pages/CMS'
import My_Order from './src/pages/My_Order'
import Open_Order from './src/pages/Open_Order'
import Cancel_Order from './src/pages/Cancel_Order'
import AboutUs from './src/pages/AboutUs'
import ContactUs from './src/pages/ContactUs'

const tab_function = TabNavigator({
  myorder : {screen:My_Order,
    navigationOptions: {
      tabBarLabel: 'My Order',
    }
  },
  open_order : {screen:Open_Order,
    navigationOptions: {
        tabBarLabel: 'Open Order',
      }
    },
  cancel_order: {screen:Cancel_Order,
    navigationOptions: {
        tabBarLabel: 'Canceled Order',
      }
    }
},
{
  tabBarOptions:
    {
      activeTintColor:'#369',
      inactiveTintColor:'#fff',
      style:{
        backgroundColor:'#282a2d',
        borderTopColor:'#282a2d'
      },
      labelStyle:{
        fontSize:12
      },
      indicatorStyle:{
        backgroundColor:'transparent'
      }
    },
    tabBarPosition: 'bottom',
  })


const StackNavigator_Function = StackNavigator({
  get_started :{screen:Getstarted},
  home:{screen:Home},
  homepage:{screen:HomePage},
  reg:{screen:Register},
  logn:{screen:Login},
  wishList:{screen:WishList},
  add_to_cart : {screen:Cart},
  wallet : {screen:Wallet},
  filter : {screen:Filter},
  details:{screen:Details},
  add_address : {screen:Add_Address},
  buy_now : {screen:Buy_Now},
  customization : {screen:Customization},
  shop : {screen:Shop},
  searchData : {screen:SearchData},
  settings : {screen:Settings},
  change_password : {screen:Change_Password},
  forgot : {screen:ForgotPassword},
  profile : {screen:Profile},
  edit_address : {screen:Edit_Address},
  filter_page : {screen:filterData},
  sort : {screen:Sort},
  sort_page : {screen:SortData},
  cms : {screen:CMS},
  my_order : {screen:tab_function},
  about : {screen:AboutUs},
  contact : {screen:ContactUs}
  },
{
  headerMode:'none'
});
export default StackNavigator_Function;
