import React,{Component} from 'react'
import {View,
        Text,
        TextInput,
        Image,
        StyleSheet,
        TouchableHighlight,
        ScrollView,
        FlatList,
        AsyncStorage,
        BackHandler
  } from 'react-native'
import GridView from 'react-native-super-grid'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import {TabNavigator,TabBarBottom} from 'react-navigation'
import config from '../API/config'
import Spinner from 'react-native-loading-spinner-overlay'

export default class AboutUs extends Component<{}>{

  render(){
    const {goBack} = this.props.navigation;
    return(
      <View style = {styles.container}>
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
          <View style = {styles.textView}>
            <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>About Us</Text>
          </View>
          <View style = {styles.iconView}>
          </View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView style = {{width:'100%',height:'100%'}}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style = {{width:'95%',alignItems:'center',justifyContent:'center'}}>
                <Text style = {{color:'#000',fontSize:20,fontWeight:'bold',marginTop:20}}>About Gardens Store</Text>

              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container : {
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#eee'
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
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
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
  }
});
