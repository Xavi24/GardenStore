import React,{Component} from 'react'
import {
        View,
        Text,
        StyleSheet,
        Image,
        StatusBar,
        TouchableHighlight,
        ScrollView,
        Alert,
        ActivityIndicator,
        BackHandler,
        TextInput
  } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import Spinner from 'react-native-loading-spinner-overlay'
import config from '../API/config'
import Toast from 'react-native-simple-toast'

var radio_props = [
  {label: 'Male', value: 'male' },
  {label: 'Female', value: 'female' }
];

export default class Register extends Component<{}>{
  static navigationOptions = {
     title:'Register',
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
      name : '',email : '',user_name : '', password : '',password_confirmation : '',phone_no : '',gender : '',cc : 'IN',
      err_name:'',err_email:'',err_pass:'',err_cnf_pass:'',err_user:'',err_ph:'',err_cc:'',err_gender:'',
      show:false
    }
  }
  updateValue(text,field){

  if(field == 'name'){
      this.setState({
        name:text,
      })
  }

  else if (field == 'email'){
    this.setState({
      email:text,
    })
  }
  else if (field == 'user_name'){
    this.setState({
      user_name:text,
    })
  }
  else if (field == 'password'){
    this.setState({
      password:text,
    })
  }
  else if (field == 'password_confirmation'){
    this.setState({
      password_confirmation:text,
    })
  }
  else if (field == 'phone_no'){
    this.setState({
      phone_no:text,
    })
  }
  else if (field == 'gender'){
    this.setState({
      gender:text,
    })
  }
}
componentWillUnmount(){
  this.setState({
    show:false
  })
}
  submit(){
    this.setState({
      show:true
    });
    let collection = {};
    collection.name = this.state.name;
    collection.email = this.state.email;
    collection.user_name = this.state.user_name;
    collection.password = this.state.password;
    collection.password_confirmation = this.state.password_confirmation;
    collection.gender = this.state.gender;
    collection.phone_no = this.state.phone_no;
    collection.cc = this.state.cc;
    console.warn('collection',collection);

        var url = config.API_URL+'register';
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
          this.setState({
            show:false
          });
          let res = Object.keys(response);
          if (res.indexOf('errors') > -1) {
              let obj = Object.keys(response.errors)
              if (obj.indexOf('name') > -1) {
                this.setState({
                  err_name:response.errors.name[0]
                })
              }
              if (obj.indexOf('email') > -1) {
                this.setState({
                  err_email:response.errors.email[0]
                })
              }
              if (obj.indexOf('user_name') > -1) {
                this.setState({
                  err_user:response.errors.user_name[0]
                })
              }
              if (obj.indexOf('gender') > -1) {
                this.setState({
                  err_gender:response.errors.gender[0]
                })
              }
              if (obj.indexOf('password') > -1) {
                this.setState({
                  err_pass:response.errors.password[0]
                })
              }
              if (this.state.phone_no === '') {
                this.setState({
                  err_ph : 'The phone number field is require'
                })
              }

          }

          else {
              Toast.show('Registration Completed successfully', Toast.LONG);
            this.props.navigation.navigate('logn')
          }
      })
    }


  render(){
    const {goBack} = this.props.navigation
    return(
      <View style = {styles.container}>
        <StatusBar
          translucent = {false}
          barStyle="light-content"
          backgroundColor='#191a1c'
        />
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
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Register</Text>
          </View>
          <View style = {styles.iconView}></View>
        </View>
        <View style = {styles.baseContainer}>
          <Image style = {styles.background_img}
            source = {require('../img/register.jpg')}>
          </Image>
          <View style = {styles.base_view}>
            <ScrollView style = {{width:'100%'}}
                        keyboardDismissMode='on-drag'
                        keyboardShouldPersistTaps={true}>
              <View style = {styles.content_view}>
                <TextInput style = {styles.input}
                  underlineColorAndroid='transparent'
                  placeholder="Full Name"
                  returnKeyType={ "done" }
                  placeholderTextColor="#ffffff"
                  onChangeText = {(text_name)=>this.updateValue(text_name,'name')}>
                </TextInput>
                <View style = {{width:'90%',marginBottom:10}}>
                  <Text style = {{color:'#c7011a'}}>{this.state.err_name}</Text>
                </View>
                <TextInput style = {styles.input}
                  underlineColorAndroid='transparent'
                  placeholder="E-mail"
                  returnKeyType={ "next" }
                  placeholderTextColor="#ffffff"
                  onChangeText = {(text_mail)=>this.updateValue(text_mail,'email')}>
                </TextInput>
                <View style = {{width:'90%',marginBottom:10}}>
                  <Text style = {{color:'#c7011a'}}>{this.state.err_email}</Text>
                </View>
                <TextInput style = {styles.input}
                  underlineColorAndroid='transparent'
                  placeholder="Username"
                  placeholderTextColor="#ffffff"
                  onChangeText = {(text_username)=>this.updateValue(text_username,'user_name')}>
                </TextInput>
                <View style = {{width:'90%',marginBottom:10}}>
                  <Text style = {{color:'#c7011a'}}>{this.state.err_user}</Text>
                </View>
                <TextInput style = {styles.input}
                  underlineColorAndroid='transparent'
                  placeholder="Password"
                  secureTextEntry={true}
                  placeholderTextColor="#ffffff"
                  onChangeText = {(text_password)=>this.updateValue(text_password,'password')}>
                </TextInput>
                <View style = {{width:'90%',marginBottom:10}}>
                  <Text style = {{color:'#c7011a'}}>{this.state.err_pass}</Text>
                </View>
                <TextInput style = {styles.input}
                  underlineColorAndroid='transparent'
                  placeholder="Confirm Password"
                  secureTextEntry={true}
                  placeholderTextColor="#ffffff"
                  onChangeText = {(text_cnfrm_pass)=>this.updateValue(text_cnfrm_pass,'password_confirmation')}>
                </TextInput>
                <View style = {{width:'90%',marginBottom:10}}>
                  <Text style = {{color:'#c7011a'}}>{this.state.err_cnf_pass}</Text>
                </View>
                <View style = {{width:'90%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'#ffffff',marginRight:20}}>Gender</Text>
                  <RadioForm
                    radio_props={radio_props}
                    initial={false}
                    formHorizontal={true}
                    labelColor={'#ffffff'}
                    selectedLabelColor={'#2196f3'}
                    onPress={(value) => {this.updateValue(value,'gender')}}
                  />
                </View>
                <View style = {{width:'90%',marginBottom:10}}>
                  <Text style = {{color:'#c7011a'}}>{this.state.err_gender}</Text>
                </View>
                  <TextInput style = {styles.input}
                    underlineColorAndroid='transparent'
                    placeholder="Mobile Number"
                    keyboardType='numeric'
                    placeholderTextColor="#ffffff"
                    onChangeText = {(text_phno) =>this.updateValue(text_phno,'phone_no')}>
                  </TextInput>
                <View style = {{flexDirection:'row',width:'90%'}}>
                  <Text style = {{color:'#c7011a',marginLeft:10}}>{this.state.err_cc}</Text>
                  <Text style = {{color:'#c7011a',marginLeft:20}}>{this.state.err_ph}</Text>
                </View>
                <TouchableHighlight style = {{width:'90%',alignItems:'center',justifyContent:'center'}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.submit()}>
                  <View style = {styles.btn}>
                    <Text style = {{color:'#ffffff'}}>REGISTER</Text>
                  </View>
                </TouchableHighlight>
                  <View style = {{flexDirection:'row',width:'100%',justifyContent:'center',alignItems:'center',marginBottom:40}}>
                    <Text style = {{color:'#ffffff',marginTop:20,fontSize:16}}>Already have an account.?</Text>
                    <Text style = {{marginTop:20,marginLeft:10,color:'#369',fontSize:16}}
                      onPress = {()=> this.props.navigation.navigate('logn')}>Login</Text>
                    </View>
                </View>
              </ScrollView>

            </View>
            <View style = {{width:'100%',height:'100%',position:'absolute', alignItems:'center',justifyContent:'center'}}>
                <Spinner color = {'#369'} visible={this.state.show} textContent={"Loading..."} textStyle={{color: '#369'}}
                overlayColor = {'#fff'}/>
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
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    marginTop:20
  },
  input:{
    width:'90%',
    height:45,
    backgroundColor:'rgba(255, 255, 255, 0.3)',
    paddingLeft:16,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    color:'#ffffff',
    marginTop:20
  },
  input_code:{
    width:'20%',
    height:45,
    backgroundColor:'rgba(255, 255, 255, 0.3)',
    paddingLeft:16,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    color:'#ffffff',
    marginTop:20,
    alignItems:'center',
    justifyContent:'center'
  },
  input_ph:{
    width:'70%',
    height:45,
    backgroundColor:'rgba(255, 255, 255, 0.3)',
    paddingLeft:16,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    color:'#ffffff',
    marginTop:20,
    marginLeft:10
  },
  btn:{
    height:45,
    width:'90%',
    backgroundColor:'#369',
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
