import React,{Component} from 'react'
import {View,
        Text,
        TouchableHighlight,
        StyleSheet,
        ScrollView,
        AsyncStorage,
        BackHandler
  } from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import config from '../API/config'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {Thumbnail} from 'native-base'
import AnimatedHideView from 'react-native-animated-hide-view'
import Toast from 'react-native-simple-toast'

// BackAndroid.addEventListener('hardwareBackPress', function() {
//   if (!this.onMainScreen()) {
//     // this.goBack();
//     console.warn('pressed');
//     return true;
//   }
//   return true;
// });

export default class Settings extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      userAction : '',
      name : 'GardenStore User',
      number : '',
      email : '',
      gender : '',
      profileName : '!',
      login_cnfrm_screen : false,
      change_password_View_height : 0,
      addres_view_height : 0,
      logConformscreen : false
    }
  }

  async _removeAccessToken() {
    this.setState({
      access_token : '',
      userAction : 'Login',
      name : 'GardenStore User',
      profileName : '!',
      email : '',
      logConformscreen : false
    });
      Toast.show('Logged Out', Toast.LONG);
    try {
      await AsyncStorage.removeItem('token');
    } catch (error) {
      console.warn(error.message);
    }
    // if (this.state.userAction == 'Login') {
    //   this.props.navigation.navigate('logn')
    // }
    // this.props.navigation.navigate('logn')
    // this.setState({
    //   userAction : 'Logout'
    // })
 }
 async _getAccessToken(){
   try {
     const value = await AsyncStorage.getItem('token');
     if (value !== null) {
       this.setState({
         access_token : value,
         userAction : 'Logout',
         change_password_View_height : 65,
         addres_view_height : 65
       });
       this.getProfile();
       console.warn('access_token',this.state.access_token);
     } else {
       this.setState({
         userAction:'Login'
       })
     }
     this.getPoints();
     } catch (error) {
   }
 }
 getProfile(){
   var url = config.API_URL+'profile'
   fetch(url, {
     headers : new Headers({
       'Content-Type' : 'application/json',
       'Accept' : 'application/json',
       'Authorization' : this.state.access_token
     })
   })
   .then((response)=>response.json())
   .catch((error)=>console.warn(error))
   .then((response)=>{
     console.log('response',response);
     if (response.data!=null) {
       this.setState({
         name : response.data.name,
         number : response.data.phone_no,
         email : response.data.email,
         gender : response.data.gender
       })
       let str = response.data.name.charAt(0);
       console.warn('1st letter',str);
       this.setState({
         profileName : str
       })
     }
   })
 }
 componentWillMount(){
   this._getAccessToken();
   // BackHandler.addEventListener('hardwareBackPress', function() {
   //   const { dispatch, navigation, nav } = this.props;
   //          dispatch({ type: 'Navigation/BACK' });
   //          return true;
   //      }.bind(this));
  }

componentWillUnmount() {
  BackHandler.removeEventListener('hardwareBackPress');
}

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
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Settings</Text>
          </View>
          <View style = {styles.iconView}>
          </View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView style = {{height:'100%',width:'100%'}}>
            <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style = {{width:'100%',borderColor:'#eee',borderBottomWidth:1,justifyContent:'center',alignItems:'center'}}>
                <View style = {{height:80,width:80,borderRadius:80/2,backgroundColor:'#282a2d',marginTop:20,alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'#fff',fontSize:24,fontWeight:'bold'}}>{this.state.profileName}</Text>
                 </View>
                <Text style = {{color:'#369',fontSize:16,fontWeight:'bold',marginTop:5}}>{this.state.name}</Text>
                <Text style = {{color:'#000',fontSize:14,marginBottom:10}}>{this.state.email}</Text>
              </View>
              <View style = {{width:'100%',height:65,borderColor:'#eee',borderBottomWidth:1,alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'85%',flexDirection:'row'}}>
                  <MaterialIcons
                    name='perm-identity'
                    size={22}
                    style = {{color:'#369'}}>
                  </MaterialIcons>
                  <Text style = {{fontSize:16,color:'#369',marginLeft:30}}
                  onPress = {()=>{
                    if (this.state.access_token!='') {
                      this.props.navigation.navigate('profile')
                    } else {
                      this.setState({
                        login_cnfrm_screen:true
                      })
                    }
                  }}>Profile</Text>
                </View>
              </View>
              <View style = {{width:'100%',height:65,borderColor:'#eee',borderBottomWidth:1,alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'85%',flexDirection:'row'}}>
                  <MaterialIcons
                    name='home'
                    size={22}
                    style = {{color:'#369'}}>
                  </MaterialIcons>
                  <Text style = {{fontSize:16,color:'#369',marginLeft:30}}
                    onPress={()=>this.props.navigation.navigate('about')}>About Us</Text>
                </View>
              </View>
              <View style = {{width:'100%',height:65,borderColor:'#eee',borderBottomWidth:1,alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'85%',flexDirection:'row'}}>
                  <MaterialIcons
                      name='record-voice-over'
                    size={22}
                    style = {{color:'#369'}}>
                  </MaterialIcons>
                  <Text style = {{fontSize:16,color:'#369',marginLeft:30}}
                   onPress = {()=>this.props.navigation.navigate('contact')}>Contact Us</Text>
                </View>
              </View>
              <View style = {{width:'100%',height:this.state.change_password_View_height,borderColor:'#eee',borderBottomWidth:1,alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'85%',flexDirection:'row'}}>
                  <MaterialIcons
                      name='vpn-key'
                    size={22}
                    style = {{color:'#369'}}>
                  </MaterialIcons>
                  <Text style = {{fontSize:16,color:'#369',marginLeft:30}}
                    onPress = {()=>this.props.navigation.navigate('change_password')}>Change Password</Text>
                </View>
              </View>
              <View style = {{width:'100%',height:this.state.addres_view_height,borderColor:'#eee',borderBottomWidth:1,alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'85%',flexDirection:'row'}}>
                  <MaterialIcons
                      name='location-on'
                    size={22}
                    style = {{color:'#369'}}>
                  </MaterialIcons>
                  <Text style = {{fontSize:16,color:'#369',marginLeft:30}}
                    onPress = {()=>this.props.navigation.navigate('add_manage')}>Address Management</Text>
                </View>
              </View>
              <View style = {{width:'100%',height:65,borderColor:'#eee',borderBottomWidth:1,alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'85%',flexDirection:'row'}}>
                  <MaterialIcons
                    name='lock'
                    size={22}
                    style = {{color:'#369'}}>
                  </MaterialIcons>
                  <Text style = {{fontSize:16,color:'#369',marginLeft:30}}
                    onPress ={()=>{
                      if (this.state.userAction == 'Login') {
                      this.props.navigation.navigate('logn')
                    } else {
                      this.setState({logConformscreen:true})
                    }
                   }
                  }>{this.state.userAction}</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
          visible = {this.state.login_cnfrm_screen}>
          <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
            <View style = {{width:'100%',height:'80%'}}></View>
            <View style = {{width:'95%',height:'15%',backgroundColor:'#282a2d',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{color:'#fff',fontWeight:'bold',fontSize:16,textAlign:'center'}}>Seems like you are not a member in here</Text>
              <View style = {{width:'100%',alignItems:'center',justifyContent:'center',marginTop:10,flexDirection:'row'}}>
                <View style = {{width:'60%',paddingLeft:10}}>
                  <Text style = {{color:'#369',fontWeight:'bold',fontSize:14}}
                    onPress = {()=>
                      this.setState({login_cnfrm_screen:false})}>Cancel</Text>
                </View>
                <View style = {{width:'30%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                  <Text style = {{color:'#2fdab8',fontWeight:'bold',fontSize:14}}
                    onPress = {()=>this.props.navigation.navigate('reg')}>Sign Up</Text>
                  <Text style = {{color:'#2fdab8',fontWeight:'bold',fontSize:14}}
                    onPress = {()=>this.props.navigation.navigate('logn')}>Log In</Text>
                </View>
              </View>
            </View>
          </View>
        </AnimatedHideView>
        <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
          visible = {this.state.logConformscreen}>
          <View style = {{backgroundColor:'#282a2d',width:'95%',alignItems:'center',justifyContent:'center'}}>
            <Text style = {{fontSize:18,fontWeight:'bold',color:'#fff',marginTop:30}}>Do u really wants to go out ?</Text>
            <View style = {{width:'100%',marginTop:20,marginBottom:10,flexDirection:'row'}}>
              <View style = {{width:'50%'}}></View>
              <View style = {{width:'50%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:10}}>
                <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                  onPress = {()=>this.setState({logConformscreen:false})}>Stay</Text>
                <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                  onPress ={()=>
                    {
                      if (this.state.userAction == 'Login') {
                      this.props.navigation.navigate('logn')
                    } else {
                      this._removeAccessToken();
                    }
                  }
                }>Logout</Text>
              </View>
            </View>
          </View>
        </AnimatedHideView>
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
  profileView:{
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  }
})
