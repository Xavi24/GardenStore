import React,{Component} from 'react'
import {View,
  Text,
  Image,
  TouchableHighlight,
  StatusBar,
  ScrollView,
  StyleSheet,
  ListView,
  TextInput,
  AsyncStorage,
  BackHandler,
  FlatList
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import config from '../API/config'
import Swiper from 'react-native-swiper'
import GridView from 'react-native-super-grid'
import Spinner from 'react-native-loading-spinner-overlay'
import AnimatedHideView from 'react-native-animated-hide-view'
import ImageSlider from 'react-native-image-slider'
import Stars from 'react-native-stars-rating'
import StarRating from 'react-native-star-rating'
import Toast from 'react-native-simple-toast'

let count = 1;
let p_specs_container = [];
let p_spec_variation_container = [];
let measures = [];
let var_spec_data = [];
let slug_check_array = [];
let localCartData = [];

export default class SpecCheck extends Component<{}>{
 render(){
   const {goBack} = this.props.navigation;
   return(
       <View style={styles.container}>
         <View style = {styles.toolbar}>
           <View style = {styles.menuView}>
             <TouchableHighlight underlayColor = 'transparent'
                                 onPress = {()=>goBack()}>
               <MaterialIcons
                   name='arrow-back'
                   size={22}
                   style = {{color:'#fff'}}>
               </MaterialIcons>
             </TouchableHighlight>
           </View>
           <View style = {styles.titleView}>
             <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Select Variant</Text>
           </View>
           <View style = {styles.iconView}></View>
         </View>
         <View style={styles.baseContainer}>

         </View>
       </View>
   )
 }
}
const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  toolbar:{
    height:'8%',
    width:'100%',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:'#282a2d',
    flexDirection:'row'
  },
  baseContainer:{
    height:'92%',
    width:'100%'
  },
  menuView:{
    height:'100%',
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },
  titleView:{
    height:'100%',
    width:'80%',
    alignItems:'center',
    justifyContent:'center'
  },
  iconView:{
    height:'100%',
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },

});
