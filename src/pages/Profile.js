import React,{Component} from 'react'
import {View,
        Text,
        StyleSheet,
        ScrollView,
        TouchableHighlight,
        AsyncStorage,
        TextInput,
        Image,
        BackHandler
  } from 'react-native'
  import Spinner from 'react-native-loading-spinner-overlay'
  import config from '../API/config'
  import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
  import {Thumbnail} from 'native-base'
  import AnimatedHideView from 'react-native-animated-hide-view'

export default class Profile extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      name : '',
      number : '',
      email : '',
      gender : '',
      profileName : '',
      editScreen : false,
      cc : 'IN',
      phone_no : '',
      error_screen : false,
      success_screen : false,
      value : '+91',
      show : false,
      male_color : '#282a2d',
      femal_color : '#282a2d'
    }
  }
  okProcess(){
    this.setState({
      success_screen : false,
      editScreen : false
    })
    this.getProfile();
  }
  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value
        })
        this.getProfile();
      }
    } catch (error) {
      console.warn('error',error.message);
    }
  }
  getProfile(){
    var url = config.API_URL+'profile';
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
      console.log('response//perofile',response);
      if (response.data!='') {
        this.setState({
          show : false
        });
        this.setState({
          name : response.data.name,
          number : response.data.phone_no,
          email : response.data.email,
          gender : response.data.gender
        });
        if (response.data.gender == 'female'||response.data.gender == 'Female') {
          this.setState({
            femal_color : '#360'
          })
        } else if (response.data.gender == 'Male'||response.data.gender == 'male') {
          this.setState({
            male_color : '#360'
          })
        }
        let str = response.data.name.charAt(0);
        console.warn('1st letter',str);
        this.setState({
          profileName : str
        })
        let str1 = response.data.phone_no.substring(3)
        console.warn('strl',str1);
        this.setState({
          phone_no : str1
        })
      } else {
        this.setState({
          show : false
        })
      }
    })
  }
  updateValue(text,field){
    if (field == 'name') {
      this.setState({
        name : text
      })
    } else if (field == 'email') {
      this.setState({
        email : text
      })
    } else if (field == 'number') {
      // let sub = text.substring(3)
      // console.warn('sub..',sub);
      this.setState({
        // phone_no : sub,
        phone_no : text
      })
    } else if (field == 'gender') {
      this.setState({
        gender : text
      })
    }
  }
  editAddress(){
    this.setState({
      show : true
    });
    let data = {};
    data.name = this.state.name,
    data.email = this.state.email,
    data.gender = this.state.gender,
    data.cc = this.state.cc,
    data.phone_no = this.state.phone_no
    console.warn('data',data);

    var url = config.API_URL+'updateUserDetails'
    fetch(url, {
      method : 'POST',
      body : JSON.stringify(data),
      headers : new Headers({
        'content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
    .then((response)=>response.json())
    .then((response)=>{
      console.warn('response///',response);
      if (response.message) {
        if (response.message == 'success') {
          this.setState({
            show : false,
            success_screen : true
          })
        }
      }
      if (response.errors) {
        if (response.errors!= '') {
          this.setState({
            show : false,
            error_screen : true
          })
        }
      }
    })
  }
  componentWillMount(){
    this.setState({
      show : true
    });
    this._getAccessToken();
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
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Profile</Text>
          </View>
          <View style = {styles.iconView}>

          </View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView style = {{width:'100%',height:'100%'}}>
            <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style = {{width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#282a2d'}}>
                <View style = {{height:120,width:120,borderRadius:120/2,backgroundColor:'#2fdab8',marginTop:20,alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'#fff',fontSize:40,fontWeight:'bold'}}>{this.state.profileName}</Text>
                </View>
                <Text style = {{fontSize:18,color:'#fff',fontWeight:'bold',marginTop:20,marginBottom:20}}>{this.state.name}</Text>
              </View>
              <View style = {{width:'95%'}}>
                <View style = {{width:'70%',alignItems:'center',flexDirection:'row',padding:15}}>
                  <MaterialIcons
                    name='email'
                    size={22}
                    style = {{color:'#369'}}>
                  </MaterialIcons>
                  <Text style = {{fontSize:18,color:'#369',marginTop:5,marginLeft:20}}>{this.state.email}</Text>
                </View>
                <View style = {{width:'70%',alignItems:'center',flexDirection:'row',padding:15}}>
                  <MaterialIcons
                    name='phone'
                    size={22}
                    style = {{color:'#369'}}>
                  </MaterialIcons>
                  <Text style = {{fontSize:18,color:'#369',marginTop:5,marginLeft:20}}>{this.state.number}</Text>
                </View>
                <View style = {{width:'70%',alignItems:'center',flexDirection:'row',padding:15}}>
                  <MaterialIcons
                    name='perm-identity'
                    size={22}
                    style = {{color:'#369'}}>
                  </MaterialIcons>
                  <Text style = {{fontSize:18,color:'#369',marginTop:5,marginLeft:20}}>{this.state.gender}</Text>
                </View>
                <View style = {{width:'70%',padding:15}}>
                  <TouchableHighlight style = {{width:'35%'}}
                    underlayColor = 'transparent'
                    onPress = {()=>this.setState({editScreen:true})}>
                    <View style = {{width:'100%',alignItems:'center',justifyContent:'center',height:40,borderColor:'#eee',borderWidth:1,flexDirection:'row',padding:10}}>
                      <MaterialIcons
                        name='edit'
                        size={22}
                        style = {{color:'#369'}}>
                      </MaterialIcons>
                      <Text style = {{color:'#369',marginLeft:5}}>Edit</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',position:'absolute'}}
          visible = {this.state.editScreen}>
          <View style = {styles.container}>
            <View style = {styles.toolbar}>
              <View style = {styles.menuView}>
                <TouchableHighlight underlayColor = 'transparent'
                  onPress = {()=>this.setState({editScreen:false})}>
                  <MaterialIcons
                    name='arrow-back'
                    size={22}
                    style = {{color:'#fff'}}>
                  </MaterialIcons>
                </TouchableHighlight>
              </View>
              <View style = {styles.textView}>
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Edit Profile</Text>
              </View>
              <View style = {styles.iconView}>
              </View>
            </View>
            <View style = {styles.baseContainer}>
              <ScrollView style = {{width:'100%'}}>
                <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'#000',fontSize:18,fontWeight:'bold',marginTop:40}}>Edit Your Address Here</Text>
                  <TextInput style = {{color:'#360',borderColor:'#eee',borderWidth:1,height:50,width:'90%',marginTop:30,padding:15}}
                    underlineColorAndroid='#369'
                    placeholder='Full Name'
                    value={this.state.name}
                    placeholderTextColor='#369'
                    onChangeText = {(text_name)=>this.updateValue(text_name,'name')}>
                  </TextInput>
                  <TextInput style = {{color:'#360',borderColor:'#eee',borderWidth:1,height:50,width:'90%',marginTop:20,padding:15}}
                    underlineColorAndroid='#369'
                    placeholder='E-mail id'
                    value={this.state.email}
                    placeholderTextColor='#369'
                    onChangeText = {(text_email)=>this.updateValue(text_email,'email')}>
                  </TextInput>
                  <TextInput style = {{color:'#360',borderColor:'#eee',borderWidth:1,height:50,width:'90%',marginTop:20,padding:15}}
                    underlineColorAndroid='#369'
                    placeholder='Phone Number'
                    placeholderTextColor='#369'
                    keyboardType = 'numeric'
                    value = {this.state.phone_no}
                    onChangeText = {(text_number)=>this.updateValue(text_number,'number')}>
                  </TextInput>

                  <View style = {{width:'90%',marginTop:20,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                    <View style = {{width:'50%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                      <TouchableHighlight underlayColor = 'transparent'
                        onPress = {()=>this.setState({
                          male_color : '#360',
                          femal_color : '#282a2d',
                          gender : 'male'
                        })}>
                        <MaterialIcons
                          name='radio-button-checked'
                          size={22}
                          style = {{color:this.state.male_color}}>
                        </MaterialIcons>
                      </TouchableHighlight>
                      <Text style = {{color:'#000',fontWeight:'bold',marginLeft:10}}>Male</Text>
                    </View>
                    <View style = {{width:'50%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                      <TouchableHighlight underlayColor = 'transparent'
                        onPress = {()=>this.setState({
                          male_color : '#282a2d',
                          femal_color : '#360',
                          gender : 'female'
                        })}>
                        <MaterialIcons
                          name='radio-button-checked'
                          size={22}
                          style = {{color:this.state.femal_color}}>
                        </MaterialIcons>
                      </TouchableHighlight>
                      <Text style = {{color:'#000',fontWeight:'bold',marginLeft:10}}>Female</Text>
                    </View>
                  </View>
                  <View style = {{width:'90%',backgroundColor:'#2fdab8',height:40,marginTop:40}}>
                    <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                      underlayColor = 'transparent'
                      onPress = {()=>this.editAddress()}>
                      <Text style = {{color:'#fff',fontSize:16,fontWeight:'bold'}}>Save</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        </AnimatedHideView>
        <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(00, 00, 00, 0.7)',position:'absolute'}}
          visible = {this.state.success_screen}>
          <View style = {{width:'95%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
            <Image style = {{height:100,width:100,alignItems:'center',justifyContent:'center',resizeMode:'stretch',marginTop:20}}
              source = {require('../img/thumbs.png')}>
            </Image>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'center',marginTop:20}}>
              <Text style = {{color:'#000',fontSize:16,textAlign:'center'}}>Your Profile Data Has been Updated Successfully</Text>
            </View>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:30,marginBottom:20}}>
              <View style = {{width:'80%'}}>
              </View>
              <View style = {{width:'20%',alignItems:'center',justifyContent:'center'}}>
                <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                  onPress = {()=>this.okProcess()}>OK</Text>
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
            <Text style = {{fontSize:22,fontWeight:'bold',color:'#000',marginTop:10,textAlign:'center'}}>There is some problem with saving your profile data. Please enter Your
                details correctly</Text>
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
  container : {
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
