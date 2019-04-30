import React,{Component} from 'react'
import {createStackNavigator} from 'react-navigation'
import Shop from './Shop.js'
import Details from './Details'
import Add_Address from './Add_Address'
import Buy_Now from './Buy_Now'
import Customization from './Customization'

const Shop_Pages = createStackNavigator({
  shp : {screen:Shop},
  // product_details:{screen:Details},
  // add_address : {screen:Add_Address},
  // buy_now : {screen:Buy_Now},
  // customization : {screen:Customization}
});
export default Shop_Pages;
