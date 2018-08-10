import React,{Component} from 'react';
import {View,
        Text,
        StyleSheet,
        ScrollView,
        TextInput,
        AsyncStorage,
        StatusBar,
        TouchableHighlight,
        Image
    } from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { CheckBox } from 'react-native-elements'
import config from '../API/config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'

export default class Add_Address extends Component<{}>{
  static navigationOptions = {
    title:'Address',
    headerTintColor: '#fff',
    headerStyle: {
          backgroundColor:'#282a2d',
          borderBottomColor:'#282a2d'
        }
  }

  constructor(props){
    super(props);
    this.state = {
      gender : '',
      checked : false,
      officeChecked : false,
      homeChecked : false,
      postcode : '',
      name : '',
      street_address : '',
      landmark : '',
      city : '',
      state : '',
      district : '',
      country : '',
      phone_no : '',
      type : '',
      default : '',
      access_token : '',
      error_screen:false,
      area:'',
      building:'',
      measurements:[],
      success_screen : false
    }
  }

  checkType(type){
    if (type === 'home') {
      if (!this.state.homeChecked) {
        if (this.state.officeChecked) {
          this.setState({
            homeChecked:true,
            type:'home',
            officeChecked:false
          })
        } else {
          this.setState({
            homeChecked:true,
            type:'home'
          })
        }
      }
    } else {
      if (!this.state.officeChecked) {
        if (this.state.homeChecked) {
          this.setState({
            homeChecked:false,
            officeChecked:true,
            type:'office'
          })
        } else {
          this.setState({
            officeChecked:true,
            type:'office'
          })
        }
      }
    }
  }

  updateValue(text,field){
    if (field == 'postcode') {
      this.setState({
        postcode:text
      })
    }
    else if (field == 'name') {
      this.setState({
        name:text
      })
    }
    else if (field == 'street_address') {
      this.setState({
        street_address:text
      })
    }
    else if (field == 'landmark') {
      this.setState({
        landmark:text
      })
    }
    else if (field == 'city') {
      this.setState({
        city:text
      })
    }
    else if (field == 'state') {
      this.setState({
        state:text
      })
    }
    else if (field == 'district') {
      this.setState({
        district:text
      })
    }
    else if (field == 'country') {
      this.setState({
        country:text
      })
    }
    else if (field == 'phone_no') {
      this.setState({
        phone_no:text
      })
    } else if (field == 'area') {
      this.setState({
        area:text
      })
    } else if (field == 'Building') {
      this.setState({
        building :text
      })
    }
  }

  saveAddress(){
    console.warn('access/////save',this.state.access_token);
    let addressData = {}
    addressData.postcode = this.state.postcode,
    addressData.name = this.state.name,
    addressData.street_address = this.state.street_address,
    addressData.landmark = this.state.landmark,
    addressData.city = this.state.city,
    addressData.state = this.state.state,
    addressData.district = this.state.district,
    addressData.country = this.state.country,
    addressData.type = this.state.type,
    addressData.default = (this.state.checked)?1:0,
    addressData.phone_no = this.state.phone_no,
    addressData.area = this.state.area,
    addressData.building = this.state.building

    var url = config.API_URL+'addAddress'
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(addressData),
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
    .then((response)=>response.json())
    .catch((error)=>console.warn('error',error))
    .then((response)=>{
      console.warn('response',response);
      if (response.code == '200') {
        this.setState({
          success_screen : true
        })
          this.props.navigation.navigate('buy_now',{
            product_name:this.state.product_name,
            prize:this.state.prize,
            img:this.state.header_image,
            product:this.state.product_id,
            vendor:this.state.vendor_id,
            measurements : []
          })
      } else {
        this.setState({
          error_screen : true
        })
      }
    })
  }

  async _getAccessToken() {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value
        })
        // this.saveAddress();
      }
    } catch (error) {
      console.warn(error.message);
    }
  }

  componentWillMount(){
    this._getAccessToken().done();
    // const {params} = this.props.navigation.state;
    // console.warn('params',params);
    // this.setState({
    //   product_image : params.img,
    //   price : params.prize,
    //   product_name : params.product_name,
    //   product_id : params.product,
    //   vendor_id : params.vendor,
    //   measurements : params.measurements
    // })
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
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Add Address</Text>
          </View>
          <View style = {styles.iconView}></View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView style = {styles.scrollView}
            showsVerticalScrollIndicator={false}>
            <View>
              <Text style = {{fontSize:18,marginTop:20,marginLeft:20,color:'#000'}}>Add New Address</Text>
              <View style = {styles.baseView}>

                <View style = {styles.topView}>
                  <TextInput style = {styles.input}
                    underlineColorAndroid = '#bbbbbb'
                    placeholder="Pin Code"
                    keyboardType='numeric'
                    onChangeText = {(text_postcode)=>this.updateValue(text_postcode,'postcode')}>
                  </TextInput>
                  <TextInput style = {styles.input}
                    underlineColorAndroid = '#bbbbbb'
                    placeholder="Area"
                    onChangeText = {(text_area)=>this.updateValue(text_area,'area')}>
                  </TextInput>
                  <TextInput style = {styles.input}
                    underlineColorAndroid = '#bbbbbb'
                    placeholder="Building"
                    onChangeText = {(text_building)=>this.updateValue(text_building,'Building')}>
                  </TextInput>
                  <TextInput style = {styles.input}
                    underlineColorAndroid = '#bbbbbb'
                    placeholder="Locality/Town"
                    onChangeText = {(text_landmark)=>this.updateValue(text_landmark,'landmark')}>
                  </TextInput>
                  <TextInput style = {styles.input}
                    underlineColorAndroid = '#bbbbbb'
                    placeholder="City"
                    onChangeText = {(text_city)=>this.updateValue(text_city,'city')}>
                  </TextInput>
                  <TextInput style = {styles.input}
                    underlineColorAndroid = '#bbbbbb'
                    placeholder="District"
                    onChangeText = {(text_district)=>this.updateValue(text_district,'district')}>
                  </TextInput>
                  <TextInput style = {styles.input}
                    underlineColorAndroid = '#bbbbbb'
                    placeholder="State"
                    onChangeText = {(text_state)=>this.updateValue(text_state,'state')}>
                  </TextInput>
                  <TextInput style = {styles.input}
                    underlineColorAndroid = '#bbbbbb'
                    placeholder="Country"
                    onChangeText = {(text_country)=>this.updateValue(text_country,'country')}>
                  </TextInput>
                </View>

                <View style = {styles.topView}>
                  <TextInput style = {styles.input}
                    underlineColorAndroid = '#bbbbbb'
                    placeholder="Name"
                    onChangeText = {(text_name)=>this.updateValue(text_name,'name')}>
                  </TextInput>
                  <TextInput style = {styles.addressBox}
                    underlineColorAndroid = 'transparent'
                    multiline={true}
                    editable = {true}
                    placeholder="Address"
                    onChangeText = {(text_address)=>this.updateValue(text_address,'street_address')}>
                  </TextInput>
                  <TextInput style = {styles.input}
                    underlineColorAndroid = '#bbbbbb'
                    placeholder="Mobile No"
                    keyboardType='numeric'
                    onChangeText = {(text_phone_no)=>this.updateValue(text_phone_no,'phone_no')}>
                  </TextInput>
                  <View style = {{width:'100%'}}>
                    <Text style = {{fontSize:14,marginLeft:15,marginTop:10,marginBottom:5}}>Type of Address</Text>
                  </View>


                    <View style = {{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                      <CheckBox
                        center
                        title='Office/Commercial'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        textStyle={{color:'#369'}}
                        containerStyle={{backgroundColor:'#fff',borderColor:'#ffffff'}}
                        checked={this.state.officeChecked}
                        onPress = {() => this.checkType('office')}
                      />
                      <CheckBox
                        center
                        title='Home'
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        textStyle={{color:'#369'}}
                        containerStyle={{backgroundColor:'#fff',borderColor:'#ffffff'}}
                        checked={this.state.homeChecked}
                        onPress = {() => this.checkType('home')}
                      />
                  </View>
                  <CheckBox
                    title='Make this as your default address'
                    checked={this.state.checked}
                    containerStyle={{backgroundColor:'#fff',borderColor:'#ffffff'}}
                    onPress = {()=>this.setState({checked:!this.state.checked})}
                  />

                </View>

                <View style = {styles.topView}>
                  <View style = {styles.savebtn}>
                    <View style = {{width:'50%',alignItems:'center',justifyContent:'center'}}>
                      <Text style = {{fontSize:16,color:'#363a42',fontWeight:'bold'}}
                        onPress = {()=>this.props.navigation.navigate('buy_now')}>CANCEL</Text>
                    </View>
                    <View style = {{width:'48%',height:'70%',borderTopLeftRadius:6,borderTopRightRadius: 6,
                      borderBottomLeftRadius:6,borderBottomRightRadius:6, backgroundColor:'#48c7f0',
                        alignItems:'center',justifyContent:'center'}}>
                        <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                          <Text style = {{fontSize:16,color:'#fff'}}
                            onPress = {() =>this.saveAddress()}>SAVE</Text>
                        </TouchableHighlight>
                      </View>
                  </View>
                </View>

              </View>
            </View>
          </ScrollView>
        </View>
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
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',
          justifyContent:'center',backgroundColor:'rgba(00, 00, 00, 0.7)',position:'absolute'}}
          visible = {this.state.success_screen}>
          <View style = {{width:'95%',height:'30%',backgroundColor:'#fff',alignItems:'center',justifyContent:'center',
            borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
            <Image style = {{height:80,width:80}}
              source = {require('../img/order.png')}>
            </Image>
            <Text style = {{color:'#000',fontSize:22,fontWeight:'bold',marginTop:10}}>Success</Text>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
              <View></View>
              <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                onPress = {()=>this.setState({success_screen : false})}>OK</Text>
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
    backgroundColor:'#eeeeee'
  },
  scrollView:{
    height:'100%',
    width:'100%'
  },
  baseView:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    marginTop:10,
    marginBottom:10
  },
  topView:{
    width:'95%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    elevation:0,
    marginBottom:10,
    borderTopLeftRadius:6,
    borderTopRightRadius:6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6,
    borderWidth:1,
    borderColor:'#cccccc'
  },
  input:{
    width:'90%',
    height:45,
    padding:10,
    marginTop:10,
    marginBottom:10
},
  addressBox:{
    width:'90%',
    height:70,
    borderTopLeftRadius:6,
    borderTopRightRadius:6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6,
    borderWidth:1,
    borderColor:'#bbbbbb',
    padding:10,
    textAlignVertical: "top"
  },
  typeOfAdd:{
    width:'50%',
    height:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#363a42'
  },
  typeOfAdd1:{
    width:'50%',
    height:50,
    alignItems:'center',
    justifyContent:'center',
    borderLeftWidth:1,
    borderLeftColor:'#fff',
    backgroundColor:'#48c7f0'
  },
  savebtn:{
    width:'100%',
    height:65,
    borderTopLeftRadius:3,
    borderTopRightRadius:3,
    borderBottomLeftRadius:3,
    borderBottomRightRadius:3,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  toolbar:{
    width:'100%',
    height:'8%',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:'#282a2d',
    flexDirection:'row'
  },
  baseContainer:{
    width:'100%',
    height:'92%',
    alignItems:'center',
    justifyContent:'center'
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
  }
})
