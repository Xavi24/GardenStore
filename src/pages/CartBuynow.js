import React,{Component} from 'react'
import {View,
        Text,
        StyleSheet,
        Image,
        TouchableHighlight,
        Picker,
        ScrollView,
        AsyncStorage,
        BackHandler,
        TextInput,
        StatusBar
  } from 'react-native'
import config from '../API/config'
import GridView from 'react-native-super-grid'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-simple-toast'
import { CheckBox } from 'react-native-elements'

const cartData = [];
var radio_props = [
  {label: 'Debit', value: 0 },
  {label: 'Credit', value: 1 },
  {label: 'Cash on Delivery', value: 2}
];
let item = [];
let dataValue = {};
export default class CartBuynow extends Component<{}>{
  static navigationOptions = {
    header :null
  }
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      crtData : [],
      size:'',
      qty:'',
      error_screen : false,
      total : 0,
      placeOrderScreen : false,
      user_address_id : '',
      success_screen : false,
      placeorder_error_screen : false,
      show : false,
      variation_id : '',
      movetowishScreen : false,
      var_id : '',
      removeScreen : false,
      user_address_id : '',
      name : '',
      street_address : '',
      city : '',
      district : '',
      postcode : '',
      state : '',
      country : '',
      landmark : '',
      ph_no : '',
      access_token : '',
      product_name : '',
      price : '',
      product_image : '',
      payment_method : '',
      currency : '',
      product_id : '',
      vendor_id : '',
      success_screen : false,
      error_screen : false,
      points : '0',
      points1 : '0',
      pointViewHeight : 0,
      pointsBorder : 0,
      allPointColor : '#7a7979',
      partialPointColor : '#7a7979',
      discountSize : 0,
      inputpoints : 0,
      partialBtn : 0,
      convertedValue : '0',
      user_point : '',
      partialpoints : '',
      show : false,
      measurements : [],
      underlayColor : '#eee',
      ptrl_font : 0,
      emptyScreen : false,
      error_msg : '',
      dataValue : {},
      building : '',
      area : '',
      select_address_view : false,
      addressArray : [],
      height : 0,
      width : 0,
      padding  :0,
      placeholder : '',
      discPoints : '',
      address_id : '',
      add_new_screen : false,
      address_id : '',
      gender : '',
      checked : false,
      officeChecked : false,
      homeChecked : false,
      err_msg : '',
      err_postcode : '',
      err_ph : '',
      err_name : '',
      err_type : '',
      err_street : '',
      err_city : '',
      err_state : '',
      err_country : '',
      err_area : '',
      err_building : '',
      err_landmark : '',
      err_district : '',
      point_screen : false,
      coupon : ''
    }
  }
  ApplyCoupon(){
    let Data = {};
    Data.coupon_code = this.state.coupon,
    Data.product = this.state.product_id,
    Data.total_price = this.state.price,
    Data.vendor = this.state.vendor_id
    console.warn('Data',Data);
    var url = config.API_URL+'coupon/apply'
    console.log('url',url);
    fetch(url,{
      method : 'POST',
      body : JSON.stringify(Data),
      headers : new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
    .then((response)=>response.json())
    .catch((error)=>console.warn(error))
    .then((response)=>{
      console.warn('response',response);
    })
  }
  getAddress(){
    this.setState({
      show : true
    });
    this.getPoints();
    var url = config.API_URL+'userAddresses';
    fetch(url, {
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
    .then((response)=>response.json())
    .catch((error)=>console.warn('error',error))
    .then((response)=>{
      console.warn('responseee///',response);
      if(response.data){
        this.setState({
          show:false
        });
        if (response.data.length>0) {
          this.setState({
            height:150,
            width:1,
            padding:10
          })
          for(let data of response.data){
            this.setState({
              user_address_id : data.user_address_id,
              name : data.name,
              street_address : data.street_address,
              city : data.city,
              district : data.district,
              state : data.state,
              country : data.country,
              landmark : data.landmark,
              phone_no : data.phone_no,
              postcode : data.postcode,
              building : data.building,
              area : data.area
            })
          }

                dataValue.user_address_id = this.state.user_address_id,
                dataValue.name = this.state.name,
                dataValue.street_address = this.state.street_address,
                dataValue.city = this.state.city,
                dataValue.district = this.state.district,
                dataValue.state = this.state.state,
                dataValue.country = this.state.country,
                dataValue.landmark = this.state.landmark,
                dataValue.phone_no = this.state.phone_no,
                dataValue.postcode = this.state.postcode,
                this.setState({
                    dataValue : dataValue
                })
                this.setState({
                  name : '',
                  street_address : '',
                  landmark : '',
                  city : '',
                  state : '',
                  district : '',
                  country : '',
                  phone_no : '',
                  area : '',
                  building : '',
                  postcode :''
                })
                console.warn('dataaaaaaaaaaaaaaaaaaaaaaa',this.state.dataValue);
        }
      } else {
        this.setState({
          show : true
        })
      }
    })
  }
  payment_method(value){
    if (value == '0') {
      this.setState({
        payment_method : 'DEBIT'
      })
    } else if (value == '1') {
      this.setState({
        payment_method : 'CREDIT'
      })
    } else if (value == '2') {
      this.setState({
        payment_method : 'COD'
      })
    }
  }
  getPoints(){
    var url = config.API_URL+'user/points';
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
      console.warn('response',response);
      if (response.code == '200') {
        this.setState({
          points1 : response.data.points
        });
        console.warn('points--->>>',this.state.points);
      }
    })
  }
  convertPartialPoints(){
    if (this.state.points<=this.state.points1) {
      this.setState({
        user_point:this.state.points
      })
      console.warn('price',this.state.total);
      console.warn('Partialpoints---------',this.state.points1);
      var url = config.API_URL+'user/points/convertToInr/'+this.state.points+'/'+this.state.total
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
        console.log('ConvertPointsresponse',response);
        if (response.code == '200') {
          if (response.data) {
            console.warn('value',response.data.value);
            this.setState({
              convertedValue : response.data.value,
              price : parseInt(this.state.price) - response.data.value,
              discPoints : 'You will get Rs. '+response.data.value+' of discount for this product',
              points1 : this.state.points1 - this.state.points
            })
          } else {
            this.setState({
              discPoints : response.message
            })
          }
        }
      })
    } else {
      this.setState({
        discPoints : 'Insufficient Points'
      })
    }
  }
  getCartData(){
    this.setState({
      show : true
    })
    var totalPrize = 0
    var url = config.API_URL+'user/viewCart'
    fetch(url, {
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
    .then((response)=>response.json())
    .then((response)=> {
    console.log('cartResponse--->>>',response);
      if (response.data.length > 0) {
        this.setState({
          show : false
        })
        cartData.length = 0;
        for(let data of response.data){
          cartData.push({
            name:data.variation_details.name,
            price:data.variation_details.price,
            image:data.variation_details.variation_image_single.variation_image,
            stock:data.variation_details.stock,
            var_id:data.variation_id,
            slug : data.variation_details.slug,
            id : data.id,
            vendor_id : data.vendor_id
          })
          this.setState({
            crtData:cartData,
          })
          console.log('cccccccc',this.state.crtData);
          totalPrize = totalPrize+parseInt(data.variation_details.price)*data.count
        }
        this.setState({
          total : totalPrize
        })
      } else {
        console.warn('array is empty');
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
        this.getCartData();
        this.getAddress();
      } else {
        this.setState({
          error_screen : true
          })
        }
      } catch (error) {
    }
  }
  placeOrder(){
    this.setState({
      placeOrderScreen:false
    })
    console.warn('access_token',this.state.access_token);
    console.warn('user_address_id',this.state.user_address_id);
    console.warn('payment_method',this.state.payment_method);
    let checkOutData = {}
    checkOutData.currency = 'INR',
    checkOutData.address_id = this.state.user_address_id,
    checkOutData.payment_method = this.state.payment_method,
    checkOutData.measurements = this.state.measurements,
    checkOutData.Points = this.state.points
    console.warn('checkOutData',checkOutData);
    var url = config.API_URL+'user/checkout'
    fetch(url, {
      method : 'POST',
      body : JSON.stringify(checkOutData),
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
    .then((response)=>response.json())
    .catch((error)=>console.warn(error))
    .then((response)=>{
      console.warn('responseCart',response);
      if (response.code == '200') {
        this.setState({
          emptyScreen : true
        })
      } else {
        this.setState({
          placeorder_error_screen : true
        })
      }
    })
  }
  payment_method(value){
    if (value == '0') {
      this.setState({
        payment_method : 'DEBIT'
      })
    } else if (value == '1') {
      this.setState({
        payment_method : 'CREDIT'
      })
    } else if (value == '2') {
      this.setState({
        payment_method : 'COD'
      })
    }
  }
  componentWillMount(){
    this._getAccessToken();
  }
  getView(){
    this.setState({
      visible:!this.state.visible
    })
  }
  removeFromCart(var_id){
    this.setState({
      show:true,
      removeScreen : false
    })
    console.warn('variation_id',var_id);
    var url = config.API_URL+'product/removeCart/'+var_id
    fetch(url,{
      method : 'DELETE',
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
     .then((response)=>response.json())
     .catch((error)=>console.warn(error))
     .then((response)=>{
       console.warn('response',response);
       if (response) {
         this.setState({
           show : false
         })
         if (response.code == '200') {
            Toast.show('Product Removed From Cart', Toast.LONG);
            this.getCartData();
         }
       }
     })
  }
  movToWishlist(var_id){
    this.setState({
      show:true,
      movetowishScreen:false
    })
    console.warn('variation_id',var_id);
    var url = config.API_URL+'user/cartToWishlist/'+var_id
    fetch(url,{
      method : 'GET',
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
     .then((response)=>response.json())
     .catch((error)=>console.warn(error))
     .then((response)=>{
       console.warn('response',response);
       if (response) {
         this.setState({
           show : false
         })
         if (response.code == '200') {
            Toast.show('Product Moved To Wishlist', Toast.LONG);
            this.getCartData();
         }
       }
     })
  }
  updateValue(text,field){
    if (field == 'points') {
      this.setState({
        points : text
      });
    }
  }
  getUserAddress(){
  this.setState({
      select_address_view : true,
      show : true
  });
      var url = config.API_URL+'userAddresses';
      fetch(url, {
          headers: new Headers({
              'Content-Type' : 'application/json',
              'Accept' : 'application/json',
              'Authorization' : this.state.access_token
          })
      })
          .then((response)=>response.json())
          .catch((error)=>console.warn('error',error))
          .then((response)=>{
              console.log('user address',response);
              if (response){
                  if (response.code == '200') {
                      this.setState({
                          show : false
                      });
                      if (response.data){
                          this.state.addressArray.length = 0;
                          item.length = 0;
                          for (data of response.data){
                              item.push({
                                  address_id : data.user_address_id,
                                  name : data.name,
                                  street : data.street_address,
                                  city : data.city,
                                  district : data.district,
                                  postcode : data.postcode,
                                  state : data.state,
                                  country : data.country,
                                  landmark : data.landmark,
                                  area : data.area,
                                  building : data.building,
                                  phone_no : data.phone_no,
                                  type : data.type,
                                  dflt : data.default
                              })
                          }
                          this.setState({
                              addressArray : item
                          });
                      }
                  }
              }
          })
  }
  selectedAddress(address_id,name,street,city,district,postcode,state,country,landmark,area,building,phone_no,type,dflt){
      let dataValue = {};
          dataValue.user_address_id = address_id,
          dataValue.name = name,
          dataValue.street_address = street,
          dataValue.city = city,
          dataValue.building = building,
          dataValue.district = district,
          dataValue.state = state,
          dataValue.country = country,
          dataValue.landmark = landmark,
          dataValue.phone_no = phone_no,
          dataValue.postcode = postcode
      this.setState({
          select_address_view : false,
          dataValue : dataValue
      })
      console.warn('datavalue..',this.state.dataValue);
  }
  deleteAddress(id){
      this.setState({
          show : true,
          removeScreen : false
      })
      var url = config.API_URL+'deleteAddress/'+id;
      fetch(url, {
          method:'DELETE',
          headers: new Headers({
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization' : this.state.access_token
          })
      })
          .then((response)=>response.json())
          .catch((error)=>console.warn(error))
          .then((response)=>{
              if (response){
                  if (response.code == '200'){
                      this.setState({
                          show : false
                      });
                      Toast.show('Address Deleted', Toast.LONG);
                      this.getUserAddress();
                  }
              }
          })
  }
  updateCouponValue(text,field){
    if (field == 'coupon') {
      this.setState({
        coupon : text
      })
    }
  }
  saveAddress(){
      this.setState({
          err_msg : '',
          err_postcode : '',
          err_ph : '',
          err_name : '',
          err_type : '',
          err_street : '',
          err_city : '',
          err_state : '',
          err_country : '',
          err_area : '',
          err_building : '',
          err_landmark : '',
          err_district : '',
          postcode : '',
          name : '',
          street_address : '',
          landmark : '',
          city : '',
          state : '',
          district : '',
          country : '',
          phone_no : '',
          area : '',
          building : ''
      });
      console.warn('access/////save',this.state.access_token);
      let addressData = {};
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
      console.log('address....',addressData);
      if (addressData.postcode == '' || addressData.name == '' ||addressData.street_address == '' || addressData.landmark == '' ||
          addressData.city == '' || addressData.state == '' ||addressData.district == '' || addressData.country == '' ||
          addressData.type == '' || addressData.phone_no == '' ||addressData.area == '' || addressData.building == ''){
          this.setState({
              err_msg : 'seems like you have some problems with saving your address. Please go back and try again'
          })
      }

      var url = config.API_URL+'addAddress';
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
                  this.setState({add_new_screen:false})
              } else {
                  this.setState({
                      error_screen : true,
                      err_postcode : response.errors.postcode,
                      err_ph : response.errors.phone_no,
                      err_name : response.errors.name,
                      err_type : response.errors.type,
                      err_street : response.errors.street_address,
                      err_city : response.errors.city,
                      err_state : response.errors.state,
                      err_country : response.errors.country,
                      err_area : response.errors.area,
                      err_building : response.errors.building
                  })
              }
          })
  }
  updateValue2(text,field){
      if (field == 'postcode') {
        dataValue.postcode = text
          this.setState({
              postcode:text,
          })
      }
      else if (field == 'name') {
        dataValue.name = text
          this.setState({
              name:text,
          })
      }
      else if (field == 'street_address') {
        dataValue.street_address = text
          this.setState({
              street_address:text,
          })
      }
      else if (field == 'landmark') {
          this.setState({
              landmark:text
          })
      }
      else if (field == 'city') {
        dataValue.city = text
          this.setState({
              city:text
          })
      }
      else if (field == 'state') {
        dataValue.state = text
          this.setState({
              state:text
          })
      }
      else if (field == 'district') {
        dataValue.district = text
          this.setState({
              district:text
          })
      }
      else if (field == 'country') {
        dataValue.country = text
          this.setState({
              country:text
          })
      }
      else if (field == 'phone_no') {
        dataValue.phone_no = text
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
      this.setState({
          dataValue : dataValue
      })
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
  render(){
    const {goBack} = this.props.navigation
    let data = [{value: '32'},{value: '38'},{value: '40'}];
    return(
        <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
          <View style = {styles.container}>
            <View style = {styles.toolbar}>
              <TouchableHighlight underlayColor = 'transparent'
                onPress = {()=>goBack()}>
                <MaterialIcons
                  name='arrow-back'
                  size={22}
                  style = {{color:'#fff'}}>
                </MaterialIcons>
              </TouchableHighlight>
              <View style = {{width:'100%',alignItems:'center'}}>
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Garden Store</Text>
              </View>
            </View>
            <ScrollView style = {{width:'100%',height:'100%'}}
              showsVerticalScrollIndicator = {false}>
              <View style = {{alignItems:'center',justifyContent:'center',width:'100%'}}>
                <View style={{width:'95%',backgroundColor:'#ffffff',justifyContent:'center',elevation:0,marginBottom:10,
                  borderTopLeftRadius:6,borderTopRightRadius:6,borderBottomLeftRadius:6,borderBottomRightRadius:6,  borderWidth:this.state.width,
                  borderColor:'#cccccc',padding:this.state.padding,height : this.state.height,marginTop:5}}>
                    <Text style={{color:'#000',fontSize:16,fontWeight:'bold',marginTop:10,marginBottom:10}}>
                        {this.state.dataValue.name}
                    </Text>
                    <Text style={{color:'#369',fontWeight:'bold'}}>
                        Pin Code : {this.state.dataValue.postcode}
                    </Text>
                    <Text>
                        {this.state.dataValue.street_address+','+this.state.dataValue.city}
                    </Text>
                    <Text>
                        {this.state.dataValue.district+','+this.state.state+','+this.state.country}
                    </Text>
                    <Text style={{fontWeight:'bold',color:'#360'}}>
                        Mobile Number : {this.state.dataValue.phone_no}
                    </Text>
                </View>
                <View style={{width:'95%', backgroundColor:'#ffffff',justifyContent:'space-between',elevation:0,marginBottom:10,borderTopLeftRadius:6,
                    borderTopRightRadius:6,borderBottomLeftRadius:6,borderBottomRightRadius:6,borderWidth:1,borderColor:'#cccccc',padding:10,
                    alignItems:'center',flexDirection:'row',marginTop:2}}>
                    <TouchableHighlight style={{padding:3,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#369'}}
                      underlayColor='transparent'
                      onPress = {()=>this.getUserAddress()}>
                        <Text style={{color:'#369',fontWeight:'bold',fontSize:14}}>Select Address</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={{padding:3,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#369'}}
                        underlayColor='transparent'
                         onPress = {()=>this.setState({add_new_screen:true})}>
                        <Text style={{color:'#369',fontWeight:'bold',fontSize:14}}>Add Address</Text>
                    </TouchableHighlight>
                </View>
                <GridView
                  showsVerticalScrollIndicator={false}
                  itemDimension={120}
                  items={this.state.crtData}
                  renderItem={item => (
                    <TouchableHighlight underlayColor = 'transparent'>
                      <View style ={{width:120,borderColor:'#eee',borderWidth:1,borderTopLeftRadius:6,padding:5,height:220,
                        borderTopRightRadius:6,borderBottomRightRadius:6,borderBottomLeftRadius:6,elevation:1,backgroundColor:'#fff'}}>
                        <View style = {{height:100,width:'100%',alignItems:'center',justifyContent:'center'}}>
                          <Image style = {{height:'100%',width:'100%',alignItems:'center',resizeMode:'stretch',justifyContent:'center'}}
                            source = {{uri:config.IMG_URL+item.image}}>
                          </Image>
                        </View>
                        <Text style = {{color:'#360',fontWeight:'bold',marginTop:5}}>{item.name}</Text>
                        <Text style = {{color:'#369',fontWeight:'bold',marginTop:5,marginBottom:5}}>RS.{item.price}</Text>
                      </View>
                    </TouchableHighlight>
                    )}
                  />

              </View>
              <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'95%',flexDirection:'row'}}>
                  <TextInput style = {styles.input1}
                    underlineColorAndroid='transparent'
                    placeholderTextColor="#360"
                    placeholder='Your coupon'
                    onChangeText = {(text_coupon)=>this.updateCouponValue(text_coupon,'coupon')}>
                  </TextInput>
                  <View style = {{width:'20%',height:45,marginTop:10,backgroundColor:'#2fdab8',borderTopWidth:1,borderBottomWidth:1,
                    borderRightWidth:1,borderColor:'#363a42',alignItems:'center',justifyContent:'center'}}>
                    <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                      underlayColor = 'transparent'
                      onPress = {()=>this.ApplyCoupon()}>
                      <Text style = {{color:'#fff'}}>GO</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
              <View style = {{width:'100%',marginTop:10,marginBottom:10,alignItems:'center',justifyContent:'center',padding:10}}>
                <Text style = {{color:'#360',fontSize:18,fontWeight:'bold'}}>Your total point : {this.state.points1}</Text>
                <TouchableHighlight style = {{width:'100%',height:40,borderColor:'#bbb',borderWidth:1,marginTop:10}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.setState({pointViewHeight:100,pointsBorder:1,partialPointColor:'#369',
                    allPointColor:'#7a7979',partialpointSubView:20,inputpoints:40,  partialBtn:30,placeholder:'Enter the points here',
                    discountSize:0,allpointsubView:0,underlayColor:'#bbb',ptrl_font:16,convertedValue:0})}>
                  <View style = {{alignItems:'center',justifyContent:'center',flexDirection:'row',width:'100%',height:'100%'}}>
                    <Text style = {{fontSize:16,marginRight:10,color:'#000'}}>Want to use your point?</Text>
                    <MaterialIcons
                      name='keyboard-arrow-down'
                      size={26}
                      style = {{color:'#360'}}>
                    </MaterialIcons>
                  </View>
                </TouchableHighlight>
                <AnimatedHideView style = {{position:'absolute',width:'100%',height:45,borderColor:'#bbb',borderWidth:1,marginTop:10,backgroundColor:'#360',
                  marginTop:30}}
                  visible = {this.state.point_screen}>
                  <TouchableHighlight style = {{alignItems:'center',justifyContent:'center'}}
                    underlayColor = 'transparent'
                    onPress = {()=>this.setState({pointViewHeight:0,pointsBorder:0,partialpointSubView:0,inputpoints:0,partialBtn:0,
                        ptrl_font:0,point_screen:false,placeholder:''})}>
                    <View style = {{alignItems:'center',justifyContent:'center',flexDirection:'row',width:'100%',height:'100%'}}>
                      <Text style = {{fontSize:16,marginRight:10,color:'#fff'}}>Want to use your point?</Text>
                      <MaterialIcons
                        name='keyboard-arrow-down'
                        size={26}
                        style = {{color:'#fff'}}>
                      </MaterialIcons>
                    </View>
                  </TouchableHighlight>
                </AnimatedHideView>
                <View style = {{width:'100%',height:this.state.pointViewHeight,borderColor:'#bbb',borderWidth:this.state.pointsBorder,
                    marginTop:5,padding:10}}>
                  <View style = {{width:'80%',height:this.state.partialpointSubView,alignItems:'center',
                    justifyContent:'center',flexDirection:'row',marginTop:10}}>
                    <TextInput style = {{width:'90%',height:40,paddingLeft:10,color:'#000',marginRight:10,
                      marginLeft:10}}
                      placeholder={this.state.placeholder}
                      placeholderTextColor="#369"
                      keyboardType={'numeric'}
                      onChangeText = {(txt_points)=>this.updateValue(txt_points,'points')}>
                    </TextInput>
                    <View style = {{width:50,height:this.state.partialBtn,alignItems:'center',justifyContent:'center',backgroundColor:'#360',
                      borderBottomLeftRadius:2,borderBottomRightRadius:2,borderTopLeftRadius:2,borderTopRightRadius:2}}>
                      <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                        underlayColor = 'transparent'
                        onPress = {()=>this.convertPartialPoints()}>
                        <Text style = {{color:'#fff'}}>GO</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                  <Text style = {{marginLeft:3,color:'#360',fontSize:this.state.ptrl_font,marginTop:15,marginBottom:10}}>{this.state.discPoints}</Text>
                </View>
                <View style = {{width:'95%'}}>
                  <Text style = {{color:'#000',fontSize:18,fontWeight:'bold'}}>Choose Your Payment Details</Text>
                  <View style = {{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                    <View style = {{width:'100%',marginTop:10}}>
                      <RadioForm
                        radio_props={radio_props}
                        initial={false}
                        buttonColor={'#2196f3'}
                        selectedLabelColor={'#66023c'}
                        buttonSize={10}
                        selectedButtonColor={'#66023c'}
                        buttonOuterSize={20}
                        animation={true}
                        formHorizontal={true}
                        onPress={(value) => this.payment_method(value)}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style = {styles.footer}>
              <View style = {{width:'50%',alignItems:'center',justifyContent:'center'}}>
                <Text style = {{color:'#000',fontSize:16,fontWeight:'bold'}}>RS,{this.state.total}</Text>
              </View>
              <TouchableHighlight style = {styles.paybtn}
                underlayColor = 'transparent'
                onPress = {()=>this.placeOrder()}>
                <View style = {{borderTopLeftRadius:6,borderTopRightRadius: 6,borderBottomLeftRadius:6, borderBottomRightRadius:6,
                  height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'#fff',fontSize:16}}>CONTINUE</Text>
                </View>
              </TouchableHighlight>
            </View>
          </View>
          <AnimatedHideView visible={this.state.select_address_view}
            style={{position:'absolute',height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
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
                          <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Check Out</Text>
                      </View>
                      <View style = {styles.iconView}>

                      </View>
                  </View>
                  <View style={{width:'100%',height:'92%'}}>
                      <ScrollView
                          showsVerticalScrollIndicator = {false}>
                          <View style={{alignItems:'center',justifyContent:'center'}}>
                              <GridView
                                  itemDimension={360}
                                  items={this.state.addressArray}
                                  renderItem={item => (
                                      <View style={{width:'100%',padding:10,backgroundColor:'#fff',elevation:1}}>
                                          <View style={{width:'100%',flexDirection:'row'}}>
                                              <Text style={{color:'#000',fontSize:18,fontWeight:'bold'}}>{item.name}</Text>
                                              <View style={{backgroundColor:'#eee',padding:3,marginLeft:10}}>
                                                  <Text>
                                                      {item.type}
                                                  </Text>
                                              </View>
                                          </View>
                                          <View style={{width:'100%',padding:10}}>
                                              <Text style={{color:'#000',fontWeight:'bold',fontSize:16}}>
                                                  Postcode : {item.postcode}
                                              </Text>
                                              <Text style={{fontSize:16}}>
                                                  {item.area+','+item.building}
                                              </Text>
                                              <Text style={{fontSize:16}}>
                                                  {item.street+','+item.city+','+item.district+','+item.state+','+item.country}
                                              </Text>
                                              <Text style={{fontSize:16,fontWeight:'bold',color:'#369'}}>
                                                  Mobile Number : {item.phone_no}
                                              </Text>
                                          </View>
                                          <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                                              <View style={{width:'70%'}}>
                                                  <Text style={{color:'#369',fontWeight:'bold',fontSize:16,marginLeft:10}}
                                                    onPress = {()=>this.selectedAddress(
                                                        item.address_id,
                                                        item.name,
                                                        item.street,
                                                        item.city,
                                                        item.district,
                                                        item.postcode,
                                                        item.state,
                                                        item.country,
                                                        item.landmark,
                                                        item.area,
                                                        item.building,
                                                        item.phone_no,
                                                        item.type,
                                                        item.dflt
                                                    )}>
                                                      Use
                                                  </Text>
                                              </View>
                                              <View style={{width:'30%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',
                                                  padding:10}}>
                                                  <TouchableHighlight underlayColor='transparent'
                                                     onPress = {()=>this.props.navigation.navigate('edit_address',
                                                        {
                                                           id:item.address_id,
                                                           name : item.name,
                                                           street : item.street,
                                                           city : item.city,
                                                           district : item.district,
                                                           postcode : item.postcode,
                                                           state : item.state,
                                                           country : item.country,
                                                           landmark : item.landmark,
                                                           area : item.area,
                                                           building : item.building,
                                                           phone_no : item.phone_no,
                                                           type : item.type,
                                                           dflt : item.dflt
                                                         }
                                                     )}>
                                                  <MaterialIcons
                                                     name='edit'
                                                     size={22}
                                                     style = {{color:'#369'}}>
                                                  </MaterialIcons>
                                                  </TouchableHighlight>
                                                  <TouchableHighlight underlayColor='transparent'
                                                     onPress = {()=>this.setState({removeScreen:true,address_id:item.address_id})}>
                                                      <MaterialIcons
                                                          name='delete'
                                                          size={22}
                                                          style = {{color:'#369'}}>
                                                      </MaterialIcons>
                                                  </TouchableHighlight>
                                              </View>
                                          </View>
                                      </View>
                                  )}
                              />
                          </View>
                      </ScrollView>
                  </View>
              </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
            visible = {this.state.removeScreen}>
            <View style = {{backgroundColor:'rgba(00,00,00,0.7)',borderBottomRightRadius:6,borderBottomLeftRadius:6,borderTopLeftRadius:6,
              borderTopRightRadius:6,width:'95%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{fontSize:18,fontWeight:'bold',color:'#fff',marginTop:30}}>Do u really wants remove the address ?</Text>
              <View style = {{width:'100%',marginTop:20,marginBottom:10,flexDirection:'row'}}>
                <View style = {{width:'60%'}}></View>
                <View style = {{width:'40%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                  <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                    onPress = {()=>this.setState({removeScreen:false})}>No</Text>
                  <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                    onPress = {()=>this.deleteAddress(this.state.address_id)}>Yes</Text>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
            visible = {this.state.add_new_screen}>
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
                    <View style = {styles.iconView}>

                    </View>
                </View>
                <View style = {styles.baseContainer}>
                    <Text style = {{fontSize:18,marginBottom:10,color:'#369'}}>Add New Address</Text>
                    <ScrollView style = {styles.scrollView}
                                showsVerticalScrollIndicator={false}>
                        <View>
                            <View style = {styles.baseView}>

                                <View style = {styles.topView}>
                                    <TextInput style = {styles.input}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="Pin Code"
                                               keyboardType='numeric'
                                               onChangeText = {(text_postcode)=>this.updateValue2(text_postcode,'postcode')}>
                                    </TextInput>
                                    <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                                        <View>
                                        </View>
                                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_postcode}</Text>
                                    </View>
                                    <TextInput style = {styles.input}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="Area"
                                               onChangeText = {(text_area)=>this.updateValue2(text_area,'area')}>
                                    </TextInput>
                                    <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                                        <View>
                                        </View>
                                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_area}</Text>
                                    </View>
                                    <TextInput style = {styles.input}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="Building"
                                               onChangeText = {(text_building)=>this.updateValue2(text_building,'Building')}>
                                    </TextInput>
                                    <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                                        <View>
                                        </View>
                                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_building}</Text>
                                    </View>
                                    <TextInput style = {styles.input}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="Locality/Town"
                                               onChangeText = {(text_landmark)=>this.updateValue2(text_landmark,'landmark')}>
                                    </TextInput>
                                    <TextInput style = {styles.input}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="City"
                                               onChangeText = {(text_city)=>this.updateValue2(text_city,'city')}>
                                    </TextInput>
                                    <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                                        <View>
                                        </View>
                                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_city}</Text>
                                    </View>
                                    <TextInput style = {styles.input}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="District"
                                               onChangeText = {(text_district)=>this.updateValue2(text_district,'district')}>
                                    </TextInput>
                                    <TextInput style = {styles.input}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="State"
                                               onChangeText = {(text_state)=>this.updateValue2(text_state,'state')}>
                                    </TextInput>
                                    <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                                        <View>
                                        </View>
                                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_state}</Text>
                                    </View>
                                    <TextInput style = {styles.input}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="Country"
                                               onChangeText = {(text_country)=>this.updateValue2(text_country,'country')}>
                                    </TextInput>
                                    <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginBottom:10}}>
                                        <View>
                                        </View>
                                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_country}</Text>
                                    </View>
                                </View>

                                <View style = {styles.topView}>
                                    <TextInput style = {styles.input}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="Name"
                                               onChangeText = {(text_name)=>this.updateValue2(text_name,'name')}>
                                    </TextInput>
                                    <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                                        <View>
                                        </View>
                                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_name}</Text>
                                    </View>
                                    <TextInput style = {styles.addressBox}
                                               underlineColorAndroid = 'transparent'
                                               multiline={true}
                                               editable = {true}
                                               placeholder="Address"
                                               onChangeText = {(text_address)=>this.updateValue2(text_address,'street_address')}>
                                    </TextInput>
                                    <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                                        <View>
                                        </View>
                                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_street}</Text>
                                    </View>
                                    <TextInput style = {styles.input}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="Mobile No"
                                               keyboardType='numeric'
                                               onChangeText = {(text_phone_no)=>this.updateValue2(text_phone_no,'phone_no')}>
                                    </TextInput>
                                    <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                                        <View>
                                        </View>
                                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_ph}</Text>
                                    </View>
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
                                    <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                                        <View>
                                        </View>
                                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_type}</Text>
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
                                                  onPress = {()=>goBack()}>CANCEL</Text>
                                        </View>
                                        <View style = {{width:'48%',height:'70%',borderTopLeftRadius:6,borderTopRightRadius: 6,
                                            borderBottomLeftRadius:6,borderBottomRightRadius:6, backgroundColor:'#48c7f0',
                                            alignItems:'center',justifyContent:'center'}}>
                                            <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                                                                underlayColor='transparent'
                                                                onPress = {()=>this.saveAddress()}>
                                                <Text style = {{fontSize:16,color:'#fff'}}>SAVE</Text>
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
                        <Text style = {{fontSize:22,fontWeight:'bold',color:'#000',marginTop:10,textAlign:'center'}}>There is some problem with saving your address. Please enter Your
                            details correctly</Text>
                        <View style = {{width:'95%',alignItems:'center',justifyContent:'center',marginTop:10}}>
                            <Text style = {{fontSize:16,textAlign:'center'}}>{this.state.err_msg}</Text>
                        </View>
                        <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:10,marginBottom:10}}>
                            <View>

                            </View>
                            <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                                  onPress = {()=>this.setState({error_screen : false})}>OK</Text>
                        </View>
                    </View>
                </AnimatedHideView>
                <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',
                    justifyContent:'center',backgroundColor:'rgba(00, 00, 00, 0.7)',position:'absolute'}}
                                  visible = {this.state.success_screen}>
                    <View style = {{width:'95%',backgroundColor:'#fff',alignItems:'center',justifyContent:'center',
                        borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
                        <Image style = {{height:80,width:80,marginTop:20}}
                               source = {require('../img/checked.png')}>
                        </Image>
                        <Text style = {{color:'#000',fontSize:22,fontWeight:'bold',marginTop:20}}>Your address added successfully</Text>
                        <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:30,marginBottom:20}}>
                            <View></View>
                            <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                                  onPress = {()=>this.setState({success_screen : false})}>OK</Text>
                        </View>
                    </View>
                </AnimatedHideView>
            </View>
          </AnimatedHideView>
          <AnimatedHideView
            visible = {this.state.emptyScreen}
            style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',backgroundColor:'#fff'}}>
            <View style = {styles.toolbar}>
              <View style = {styles.menuView}>
                <TouchableHighlight underlayColor = 'transparent'
                  onPress = {()=>goBack()}>
                  <MaterialIcons
                    name='close'
                    size={22}
                    style = {{color:'#fff'}}>
                  </MaterialIcons>
                </TouchableHighlight>
               </View>
               <View style = {styles.textView}>
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Close</Text>
               </View>
              <View style = {styles.iconView}>

              </View>
            </View>
            <View style = {styles.baseContainer}>
              <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Image style = {{width:60,height:60,alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                  source = {require('../img/checked.png')}>
                </Image>
                  <Text style = {{marginTop:10,fontSize:16,fontWeight:'bold'}}>Your product ordered successfully</Text>
                  <View style = {{width:'90%',height:40,backgroundColor:'#369',marginTop:20,alignItems:'center',justifyContent:'center'}}>
                    <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                      underlayColor = 'transparent'
                      onPress = {()=>this.props.navigation.navigate('my_order')}>
                      <Text style = {{color:'#fff',fontSize:16,fontWeight:'bold'}}>View Orders</Text>
                    </TouchableHighlight>
                  </View>
                  <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                </View>
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
      backgroundColor:'#eeeeee'
    },
    baseView:{
      height:'100%',
      width:'100%',
      alignItems:'center',
      justifyContent:'center'
    },
    topView:{
      width:'95%',
      backgroundColor:'#ffffff',
      justifyContent:'center',
      elevation:0,
      marginBottom:10,
      borderTopLeftRadius:6,
      borderTopRightRadius:6,
      borderBottomLeftRadius:6,
      borderBottomRightRadius:6,
      borderWidth:1,
      borderColor:'#cccccc',
      padding:10,
      marginTop:5
    },
    topViewAdd:{
      width:'95%',
      backgroundColor:'#ffffff',
      justifyContent:'center',
      elevation:0,
      borderTopLeftRadius:6,
      borderTopRightRadius:6,
      borderWidth:1,
      borderColor:'#cccccc',
      padding:10,
      marginTop:5
    },
    addFooter:{
      width:'95%',
      height:55,
      backgroundColor:'#fff',
      borderWidth:1,
      borderColor:'#cccccc',
      borderBottomLeftRadius:6,
      borderBottomRightRadius:6,
      flexDirection:'row',
      marginBottom:10
    },
    editAdd:{
      width:'50%',
      height:'100%',
      alignItems:'center',
      justifyContent:'center',
    },
    addNewAdd:{
      width:'50%',
      height:'100%',
      alignItems:'center',
      justifyContent:'center',
      borderLeftColor:'#cccccc',
      borderLeftWidth:1
    },
    imageView:{
      width:'30%',
      height:100,
      justifyContent:'center',
      alignItems:'center',
      resizeMode:'stretch',
      marginTop:10
    },
    footer:{
      height:65,
      width:'100%',
      backgroundColor:'#ffffff',
      elevation:3,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center'
    },
    paybtn:{
      width:'48%',
      alignItems:'center',
      justifyContent:'center',
      height:'70%',
      backgroundColor:'#48c7f0',
      borderTopLeftRadius:6,
      borderTopRightRadius: 6,
      borderBottomLeftRadius:6,
      borderBottomRightRadius:6
    },
    toolbar:{
      height:'8%',
      width:'100%',
      alignItems:'center',
      justifyContent:'space-between',
      backgroundColor:'#282a2d',
      flexDirection:'row'
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
    baseContainer:{
      height:'92%',
      width:'100%',
      alignItems:'center',
      justifyContent:'center'
    },
    scrollView:{
        height:'100%',
        width:'100%'
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
    input1:{
      width:'80%',
      height:45,
      paddingLeft:16,
      color:'#363a42',
      borderColor:'#363a42',
      marginTop:10,
      alignItems:'center',
      justifyContent:'center',
      borderTopWidth:1,
      borderBottomWidth:1,
      borderLeftWidth:1
    }
});
