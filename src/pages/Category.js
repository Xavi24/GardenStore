import React,{Component} from 'react'
import {View,Text,StyleSheet} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class Category extends Component<{}>{
  constructor(props){
    super(props);
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    console.warn('params');
  }
  render(){
    return(
      <View style = {styles.container}>
        <View style = {styles.toolbar}>
          <MaterialIcons
            name='arrow-back'
            size={30}
            style = {{color:'#282a2d'}}>
          </MaterialIcons>
          <Text style = {{color:'#282a2d',marginLeft:10,fontSize:18,fontWeight:'bold'}}>category</Text>
        </View>
        <View style = {styles.baseContainer}></View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#fff'
  },
  toolbar:{
    height:'20%',
    width:'100%',
    flexDirection:'row',
    alignItems:'center',
    padding:10,
    borderBottomWidth:1,
    borderBottomColor:'#bbb'
  },
  baseContainer:{
    height:'80%',
    width:'100%'
  }
})
