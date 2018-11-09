import React,{Component} from 'react';
import {View,
        Text,
        StyleSheet,
        StatusBar,
        Image,
        TextInput,
        TouchableHighlight,
        ScrollView,
        AsyncStorage,
        ActivityIndicator,
        BackHandler
} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import config from '../API/config';
import NavigationActions from 'react-navigation'

export default class Login extends Component<{}>{
  static navigationOptions = {
     title:'Login',
     headerTintColor: '#ffffff',
     drawerLockMode: 'locked-closed',
      headerStyle: {
            backgroundColor:'#282a2d',
            borderBottomColor:'#282a2d'
          }
    };

    constructor(){
    super();
    this.state = {
      cred1 : '',cred2 : '',
      err_msg : '',
      show : false,
      page : '',
      next : ''
    }
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    console.warn('params',params);
    this.setState({
      page : params.page,
      next : params.next
    })
  }

  componentWillUnmount(){
    this.setState({
      show:false
    })
  }

  updateValue(text,field){
    if (field == 'cred1') {
      this.setState({
        cred1:text,
      })
    }

    else if (field == 'cred2') {
      this.setState({
        cred2:text,
      })
    }
  }

  login(){
    this.setState({
      show:true
    });
    this.textInput.clear();
    this.textInput2.clear();
    let data = {};
    data.cred1 = this.state.cred1;
    data.cred2 = this.state.cred2;

    var url = config.API_URL+'login'
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    })
      .then((response)=>response.json())
      .then((response)=> {
        console.warn('response',response);
        this.setState({
          show:false
        });

        if (response.code === 200) {
          let access_token = response.token;
          this._setAccessToken(access_token);
          this.props.navigation.navigate(this.state.next);
          this.navigateToLogin();
        }
        else {
          this.setState({
            err_msg :response.message
          })
        }
      })
    }
  navigateToLogin() {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        this.props.navigation.navigate({ routeName: this.state.page }),
        this.props.navigation.navigate({ routeName: this.state.next })
      ]
    });

    this.props.navigation.dispatch(resetAction);
  }
    reg(){
      this.textInput.clear();
      this.textInput2.clear();
      this.props.navigation.navigate('reg')
    }
    forgot(){
      this.textInput.clear();
      this.textInput2.clear();
      this.props.navigation.navigate('forgot')
    }

    async _setAccessToken(token) {
      try {
        await AsyncStorage.setItem('token', token);
      } catch (error) {
        console.warn(error.message);
      }
    }

  render(){
    const {goBack} = this.props.navigation
    return(
      <View style = {styles.container}>
        <StatusBar
          translucent = {false}
          barStyle="light-content"
          backgroundColor='#191a1c'/>
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
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Login</Text>
          </View>
          <View style = {styles.iconView}>

          </View>
        </View>
        <View style = {styles.baseContainer}>
          <Image style = {styles.background_img}
              source = {require('../img/login.jpg')}>
          </Image>
          <View style = {styles.base_view}>
            <ScrollView style = {{width:'100%'}}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={true}>
            <View style = {styles.content_view}>
              <TextInput style = {styles.input}
                underlineColorAndroid='transparent'
                placeholder="E-mail"
                placeholderTextColor="#ffffff"
                ref={input => { this.textInput = input }}
                onChangeText = {(text)=>this.updateValue(text,'cred1')}>
              </TextInput>
              <TextInput style = {styles.input}
                underlineColorAndroid='transparent'
                placeholder="Password"
                secureTextEntry={true}
                placeholderTextColor="#ffffff"
                ref={input => { this.textInput2 = input }}
                onChangeText = {(text)=>this.updateValue(text,'cred2')}>
              </TextInput>
              <View style = {{width:'90%',marginBottom:10}}>
                <Text style = {{color:'#c7011a',marginLeft:10}}>{this.state.err_msg}</Text>
              </View>
              <TouchableHighlight style = {{width:'90%',justifyContent:'center',alignItems:'center'}}
                underlayColor = 'transparent'
                onPress = {()=>this.login()}>
                <View style = {styles.btn}>
                  <Text style = {{color:'#ffffff'}}>LOGIN</Text>
                </View>
              </TouchableHighlight>
              <Text style = {{color:'#ffffff',marginTop:20}}>OR</Text>

              <Text style = {{color:'#369',marginTop:20,fontSize:16,textDecorationLine:'underline'}}
                onPress = {()=>this.forgot()}>
                Forgot Your Password</Text>
              <View style = {{flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center'}}>
                <Text style = {{marginTop:20,marginLeft:10,color:'#ffffff',fontSize:16}}>Dont have an account.?</Text>
                <Text style = {{marginTop:20,marginLeft:10,color:'#369',fontSize:16}}
                  onPress = {()=>this.reg()}>Register</Text>
              </View>
            </View>
            </ScrollView>
            <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
              <Spinner color = {'#369'} visible={this.state.show} textContent={"Loading..."} textStyle={{color: '#369'}}
                overlayColor = {'#fff'}/>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'100%'
  },
  background_img:{
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  base_view:{
    height:'100%',
    width:'100%',
    position:'absolute',
    backgroundColor:'rgba(00, 00, 00, 0.4)',
    justifyContent:'center',
    alignItems:'center'
  },
  content_view:{
    height:'80%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    marginTop:80
  },
  input:{
    width:'90%',
    height:45,
    backgroundColor:'rgba(255, 255, 255, 0.3)',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    color:'#ffffff',
    marginTop:20,
    paddingLeft:10
  },
  btn:{
    height:45,
    width:'100%',
    backgroundColor:'#369',
    alignItems:'center',
    justifyContent:'center',
    borderTopLeftRadius:6,
    borderTopRightRadius:6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6,
    marginTop:16,
    flexDirection:'row'
  },
  fb_btn:{
    height:45,
    width:'90%',
    alignItems:'center',
    justifyContent:'center',
    borderTopLeftRadius:6,
    borderTopRightRadius:6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6,
    marginTop:16,
    flexDirection:'row',
    backgroundColor:'#eeeeee'
  },
  google_btn:{
    height:45,
    width:'90%',
    backgroundColor:'#eeeeee',
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    borderTopLeftRadius:6,
    borderTopRightRadius:6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6,
    marginTop:16
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
