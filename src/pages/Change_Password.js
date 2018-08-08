import React,{Component} from 'react'
import {View,
        Text,
        StyleSheet,
        TouchableHighlight,
        Image,
        StatusBar,
        ScrollView,
        TextInput,
        AsyncStorage
  } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import config from '../API/config'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'

export default class Change_Password extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      current_password : '',
      new_password : '',
      new_password_confirmation : '',
      success_screen : false,
      error_screen : false,
      error_message : '',
      show : false
    }
  }
  updateValue(text,field){
    if (field == 'current_password') {
      this.setState({
        current_password : text
      })
    } else if (field == 'new_password') {
      this.setState({
        new_password : text
      })
    } else if (field == 'new_password_confirmation') {
      this.setState({
        new_password_confirmation : text
      })
    }
  }
  changePassword(){
    this.setState({
      show : true
    })
    let data = {}
    data.current_password = this.state.current_password;
    data.new_password = this.state.new_password;
    data.new_password_confirmation = this.state.new_password_confirmation
    console.warn('access_token',this.state.access_token);
    console.warn('data',data);
    var url = config.API_URL+'changePassword'
    fetch(url, {
      method : 'PUT',
      body : JSON.stringify(data),
      headers : new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
     .then((response)=>response.json())
     .then((response)=> {
       console.warn('response',response);
       if (response.message == 'success') {
         this.setState({
           show : false
         })
         this.setState({
           success_screen : true
         })
       } else {
         console.warn('error',response.message);
         this.setState({
           error_message:response.message
         })
         this.setState({
           error_screen : true
         })
         this.setState({
           show : false
         })
       }
     })
  }
  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value
        })
        console.warn('access_token',this.state.access_token);
      } else {
        this.setState({
          error_screen : true
        })
      }
      this.changePassword();
      } catch (error) {
    }
  }
  componentWillMount(){
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
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Change Password</Text>
          </View>
          <View style = {styles.iconView}></View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView style = {{width:'100%',height:'100%'}}>
            <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{color:'#369',fontSize:20,fontWeight:'bold',marginTop:30}}>Change Your Password</Text>
              <View style = {{width:'90%',alignItems:'center',justifyContent:'center',borderColor:'#eee',borderWidth:1,padding:10,marginTop:30}}>
                <TextInput style = {styles.input}
                  underlineColorAndroid='#282a2d'
                  placeholder="Old Password"
                  placeholderTextColor="#282a2d"
                  onChangeText = {(old)=>this.updateValue(old,'current_password')}
                  secureTextEntry={true}>
                </TextInput>
                <TextInput style = {styles.input}
                  underlineColorAndroid='#282a2d'
                  placeholder="New Password"
                  placeholderTextColor="#282a2d"
                  onChangeText = {(New)=>this.updateValue(New,'new_password')}
                  secureTextEntry={true}>
                </TextInput>
                <TextInput style = {styles.input}
                  underlineColorAndroid='#282a2d'
                  placeholder="Confirm Password"
                  placeholderTextColor="#282a2d"
                  onChangeText = {(cnfrm)=>this.updateValue(cnfrm,'new_password_confirmation')}
                  secureTextEntry={true}>
                </TextInput>
                <View style = {{height:45,width:'90%',backgroundColor:'#369',marginTop:40,marginBottom:20}}>
                  <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                    underlayColor = 'transparent'
                    onPress = {()=>this._getAccessToken()}>
                    <Text style = {{color:'#fff',fontSize:16,fontWeight:'bold'}}>Save</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(00, 00, 00, 0.7)',position:'absolute'}}
          visible = {this.state.success_screen}>
          <View style = {{width:'95%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
            <Image style = {{height:100,width:100,alignItems:'center',justifyContent:'center',resizeMode:'stretch',marginTop:20}}
              source = {require('../img/thumbs.png')}></Image>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'center',marginTop:20}}>
              <Text style = {{color:'#000',fontSize:16,textAlign:'center'}}>Your Password Has been Changed Successfully</Text>
            </View>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:30,marginBottom:20}}>
              <View style = {{width:'80%'}}></View>
              <View style = {{width:'20%',alignItems:'center',justifyContent:'center'}}>
                <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                  onPress = {()=>this.setState({success_screen:false})}>OK</Text>
              </View>
            </View>
          </View>
        </AnimatedHideView>
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
          position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}
          visible = {this.state.error_screen}>
          <View style = {{width:'95%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',
            borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
            <Image style = {{width:60,height:60,marginTop:20}}
              source = {require('../img/attention.png')}>
            </Image>
            <Text style = {{fontSize:22,fontWeight:'bold',color:'#000',marginTop:10}}>{this.state.error_message}</Text>
            <View style = {{width:'95%',alignItems:'center',justifyContent:'center',marginTop:10}}>
              <Text style = {{fontSize:16,textAlign:'center'}}>There is an error occured while Changing your Password.
                Please go back and check all the details and try again</Text>
            </View>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:10,marginBottom:10}}>
              <View></View>
              <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                onPress = {()=>this.setState({error_screen : false})}>OK</Text>
            </View>
          </View>
        </AnimatedHideView>
        <Spinner visible = {this.state.show}
          textContent = {"Loading..."}
          color = {'#369'}
          textStyle = {{color: '#369'}}
          overlayColor = {'#fff'}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff'
  },
  toolbar:{
    height:'8%',
    width:'100%',
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row',
    backgroundColor:'#282a2d'
  },
  baseContainer:{
    height:'92%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  menuView:{
    width:'10%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  textView:{
    width:'80%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  iconView:{
    width:'10%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  input:{
    width:'100%',
    height:45,
    paddingLeft:16,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    color:'#360',
    marginTop:20
  }
})
