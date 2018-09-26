import React,{Component} from 'react'
import {StackNavigator} from 'react-navigation'
import {TabNavigator,TabBarBottom} from 'react-navigation'

import Getstarted from './src/start/Getstarted'
import HomePage from './src/start/HomePage'
import Home from './src/start/Home'
import Register from './src/pages/Register'
import Login from './src/pages/Login'
import WishList from './src/pages/WishListData'
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
import AboutUs from './src/pages/AboutUs'
import ContactUs from './src/pages/ContactUs'
import AddressManagement from './src/pages/AddressManagement'
import ViewAddress from './src/pages/ViewAddress'
import Add_New_Address from "./src/pages/Add_New_Address"
import ViewOpenOrder from './src/pages/ViewOpenOrder'
import ViewMyOrderProduct from './src/pages/ViewMyOrderProduct'
import ReturnProduct from './src/pages/ReturnProduct'
import CartBuynow from './src/pages/CartBuynow'
import ReplaceProduct from './src/pages/ReplaceProduct'
import Order from './src/pages/Order'
import Open from './src/pages/Open'
import Cancel from './src/pages/Cancel'
import WebViewClass from './src/pages/WebViewClass'
import ReplaceListView from './src/pages/ReplaceListView'
import ViedioWeb from './src/pages/ViedioWeb'
import SyncCartLogin from './src/pages/SyncCartLogin'

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
  about : {screen:AboutUs},
  contact : {screen:ContactUs},
  add_manage : {screen:AddressManagement},
  view_address : {screen:ViewAddress},
  add_new : {screen:Add_New_Address},
  view_open_order : {screen:ViewOpenOrder},
  view_my_order : {screen:ViewMyOrderProduct},
  return_product : {screen:ReturnProduct},
  cart_buy_now : {screen:CartBuynow},
  replace_product : {screen : ReplaceProduct},
  order : {screen : Order},
  open : {screen : Open},
  cancel : {screen : Cancel},
  web : {screen : WebViewClass},
  replacelist_view : {screen : ReplaceListView},
  video_web : {screen:ViedioWeb},
  sync_login : {screen:SyncCartLogin}
  },
{
  headerMode:'none'
});
export default StackNavigator_Function;
