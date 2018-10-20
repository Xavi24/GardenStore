import React,{Component} from 'react'
import {View,
        Text,
        StyleSheet,
        TouchableHighlight,
        Image,
        ScrollView,
        TextInput,
        BackHandler
  } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import config from '../API/config'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'

export default class ForgotPassword extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      email : '',
      success_screen:false,
      error_message : ''
    }
  }
  updateValue(text,field){

  if(field == 'email'){
      this.setState({
        email:text,
      })
    }
  }
forgotPassword(){
  let collection = {};
  collection.name = this.state.email;
  console.warn('email',this.state.email);
  var url = config.API_URL+'forgot-password';
    fetch(url, {
    method: 'POST',
    body: JSON.stringify(collection),
    headers: new Headers({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    })
  })
  .then((response)=>response.json())
  .catch((error)=> console.warn("fetch error:",error))
  .then((response)=>{
  console.warn('response',response);
  if (response.code == '200') {
    this.setState({
      success_screen : true
    })
  }
    if (response.code == '409') {
      this.setState({
        error_screen : true,
        error_message : response.message
      })
    }
  })
}
  render(){
    const {goBack} = this.props.navigation
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
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Forgot Password</Text>
          </View>
          <View style = {styles.iconView}></View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView style = {{width:'100%',height:'100%'}}
                      keyboardDismissMode='on-drag'
                      keyboardShouldPersistTaps={true}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <Image style = {{height:120,width:120,alignItems:'center',justifyContent:'center',marginTop:30}}
                source = {require('../img/forgot_pass.png')}>
              </Image>
              <Text style = {{color:'#000',fontSize:20,fontWeight:'bold',marginTop:40}}>Forgot Your Password?</Text>
              <View style = {{width:'90%',alignItems:'center',justifyContent:'center'}}>
                <Text style = {{marginTop:30,fontSize:16,textAlign:'center'}}>Please Enter your registered email address below and  we will
                send your new password to your mail</Text>
              </View>
              <TextInput style = {{width:'90%',height:55,marginTop:40,borderColor:'#eee',borderWidth:1,color:'#369',padding:10}}
                underlineColorAndroid = '#369'
                placeholderTextColor = '#369'
                placeholder = 'Enter Your E-mail'
                onChangeText = {(email)=>this.updateValue(email,'email')}>
              </TextInput>
              <View style = {{width:'90%',height:55,backgroundColor:'#2fdab8',marginTop:30}}>
                <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.forgotPassword()}>
                 <Text style = {{fontSize:16,color:'#fff',fontWeight:'bold'}}>Send</Text>
                </TouchableHighlight>
              </View>
            </View>
          </ScrollView>
        </View>
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',
          justifyContent:'center',backgroundColor:'rgba(00, 00, 00, 0.7)',position:'absolute'}}
          visible = {this.state.success_screen}>
          <View style = {{width:'95%',height:'30%',backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}>
            <Image style = {{height:80,width:80}}
              source = {require('../img/thumbs.png')}>
            </Image>
            <Text style = {{color:'#000',fontSize:22,fontWeight:'bold',marginTop:10}}>Success</Text>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
              <View></View>
              <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                onPress = {()=>this.setState({success_screen : false})}>OK</Text>
            </View>
          </View>
        </AnimatedHideView>
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
          position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}
                          visible = {this.state.error_screen}>
          <View style = {{width:'80%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',elevation:2,height:150}}>
            <TouchableHighlight underlayColor='transparent'
                                onPress = {()=>goBack()}>
              <MaterialIcons
                  name='error'
                  size={36 }
                  style = {{color:'#800000'}}>
              </MaterialIcons>
            </TouchableHighlight>
            <Text style = {{fontSize:16,color:'#565959',marginTop:10,textAlign:'center'}}>{this.state.error_message}</Text>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:10,marginBottom:10}}>
              <View>

              </View>
              <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                    onPress = {()=>this.setState({error_screen : false})}>OK</Text>
            </View>
          </View>
        </AnimatedHideView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container : {
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff'
  },
  toolbar:{
    height:'8%',
    width:'100%',
    backgroundColor:'#282a2d',
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row'
  },
  menuView:{
    height:'100%',
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },
  textView:{
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
  baseContainer:{
    height:'92%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  }
})
