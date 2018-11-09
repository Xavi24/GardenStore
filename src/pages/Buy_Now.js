import React,{Component} from 'react';
import {View,
        Text,
        StyleSheet,
        ScrollView,
        Image,
        TouchableHighlight,
        AsyncStorage,
        TextInput,
        BackHandler,
        StatusBar,
        WebView
} from 'react-native'
import config from '../API/config'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import AnimatedHideView from 'react-native-animated-hide-view'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay'
import GridView from 'react-native-super-grid'
import Toast from 'react-native-simple-toast'
import { CheckBox } from 'react-native-elements'

var radio_props = [
  // {label: 'Debit', value: 0 },
  {label: 'Pay Online   ', value: 1 },
  {label: 'Cash on Delivery', value: 2}
];
let item = [];
let dataValue = {};
export default class Buy_Now extends Component<{}>{
  static navigationOptions = {
    header : null
  };

  constructor(props){
    super(props);
    this.state = {
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
      allpointsubView : 0,
      partialpointSubView : 0,
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
      removeScreen : false,
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
      add_new_screen : false,
      slug : '',
      p_name : '',
      p_price : '',
      p_sale_price: '',
      p_discount : '',
      p_brand : '',
      spec : [],
      spec_variation : [],
      point_screen : false,
      coupon : '',
      prizee : '',
      coupon_disc : '',
      value : '',
      mes_name : '',
      mes_value : '',
      web_redirect : '',
      web_redirect_screen : false,
      web_screen : '',
      address_height : 30,
      address_padding : 3,
      address_border_width : 1,
      purchased_price : 0,
      edit_add_screen : false,
      p_height : 0,
      p_width : 0,
      p_border : 0,
      p_padding : 0,
      p_icon : 'check-box-outline-blank',
      p_underline : 'transparent',
      checked : false,
      temp_prize :0,
      temp_points : '0',
      pay : true,
      pin_code_text : '',
      select_address : ''
    }
  }
  // componentDidMount(){
  //   this.props.getLea
  // }
  getAddress(){

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
          this.setState({
            address_height:30,
            address_padding : 3,
            address_border_width : 1
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
              area : data.area,
              pin_code_text : 'Pin Code :',
              select_address : 'Select Address'
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
                });
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
                });
                console.warn('dataaaaaaaaaaaaaaaaaaaaaaa',this.state.dataValue);
        } else {
          dataValue.user_address_id = '';
              dataValue.name = '';
              dataValue.street_address = '';
              dataValue.city = '';
              dataValue.district = '';
              dataValue.state = '';
              dataValue.country = '';
              dataValue.landmark = '';
              dataValue.phone_no = '';
              dataValue.postcode = '';
          this.setState({
            address_height:0,
            address_padding : 0,
            address_border_width : 0,
            pin_code_text : '',
            dataValue : dataValue,
            select_address : ''
          })
        }
      } else {
        this.setState({
          show : true
        })
      }
    })
  }
  pointCheck(){
    this.setState({
      checked:!this.state.checked,
      p_height : 45,
      p_width : '95%',
      p_border : 1,
      p_padding : 1,
      p_underline : 'transparent'
    });
    if(this.state.checked){
      this.setState({
        checked:!this.state.checked,
        p_height : 0,
        p_width : 0,
        p_border : 0,
        p_padding : 0,
        p_underline : 'transparent',
        points : '0',
        price : this.state.temp_prize,
        convertedValue : '0'
      })
    }
    // else {
    //   this.setState({
    //     checked:!this.state.checked,
    //     p_height : 45,
    //     p_width : '95%',
    //     p_border : 1,
    //     p_padding : 1,
    //     p_underline : '#360'
    //   });
    // }
  }
  payment_method(value){
    console.warn('===============',this.state.price);
    if (value == '1') {
      if (this.state.price == 0){
        Toast.show('Only COD is Available', Toast.LONG);
      } else {
        this.setState({
          payment_method : 'NOW'
        })
      }
    } else if (value == '2') {
      this.setState({
        payment_method : 'COD'
      })
    }
  }
  placeOrder(){
    let checkOutData = {};
    if(this.state.payment_method === ''){
      Toast.show('Select Your Payment Method', Toast.LONG);
    }
    console.warn('measurements',this.state.user_point);
    checkOutData.currency = 'INR',
    checkOutData.address_id = this.state.dataValue.user_address_id,
    checkOutData.payment_method = this.state.payment_method,
    checkOutData.product = this.state.product_id,
    checkOutData.vendor = this.state.vendor_id,
    checkOutData.points = this.state.user_point,
    checkOutData.measurements = JSON.stringify(this.state.measurements);
    console.warn('checkOutData',checkOutData);
    if (this.state.payment_method == 'NOW'){
      var url = config.API_URL+'user/checkout';
      fetch(url, {
        method: 'POST',
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
            console.warn('response',response);
            console.log('paymentgate---api//',response);
            if (response.code == '200') {
              // this.setState({
              //   web_redirect : response.redirect,
              //   web_redirect_screen : true,
              // });
              this.props.navigation.navigate('web',{api:response.redirect});
              console.warn('web_redirect',this.state.web_redirect);
            } if (response.errors) {
              Toast.show('Address Field is Empty', Toast.LONG);
            } if (response.code == '409') {
              console.warn('*********',response.errors.address_id);
              if(response.errors.address_id){
                this.setState({
                  error_msg : 'Address Field Is Empty'
                })
              }
            } else {
              this.setState({
                error_msg : 'Address Field Is Empty'
              })
            }
          })
    } else if (this.state.payment_method=='COD'){
      var url = config.API_URL+'user/checkout';
      fetch(url, {
        method: 'POST',
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
            console.warn('response',response);
            console.log('paymentgate---api//',response);
            if (response.code == '200') {
              this.setState({
                emptyScreen : true
              })
            } if (response.errors) {
              Toast.show('Address Field is Empty', Toast.LONG);
            } if (response.code == '409') {
              this.setState({
                error_msg : response.message
              })
            } else {
              this.setState({
                error_msg : 'Address Field Is Empty'
              })
            }
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
          points1 : response.data.points,
          temp_points : response.data.points
        });
        console.warn('points--->>>',this.state.points);
      }
    })
  }
  updatePointValue(data,value){
    if (value == 'point') {
      this.setState({
        points : data
      })
    }
  }
  convertPartialPoints(){
    this.textInputpoint.clear();
    if (this.state.points!=0) {
      if (this.state.price>0){
      }
      if (this.state.points<=this.state.points1) {
        this.setState({
          user_point:this.state.points
        });
        console.log('price',this.state.price);
        console.warn('Partialpoints---------',this.state.points);
        var url = config.API_URL+'user/points/convertToInr/'+this.state.points+'/'+this.state.temp_prize
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
                this.setState({
                  points : '0'
                });
                if (response.data) {
                  console.warn('value',response.data.value);
                  this.setState({
                    convertedValue : response.data.value,
                    price : parseInt(this.state.temp_prize) - response.data.value,
                    discPoints : 'You will get Rs. '+response.data.value+' of discount for this product',
                    points1 : this.state.points1 - this.state.points
                  });
                  Toast.show('You will get '+this.state.discPoints+' amount discount', Toast.LONG);
                  this.setState({
                    p_padding : 0,
                    p_icon : 'check-box-outline-blank',
                    p_underline : 'transparent'
                  })
                }
              }
              if (response.code == '409') {
                Toast.show(response.message, Toast.LONG);
              }
            })
      }
      else {
        Toast.show('Enter Valid Points', Toast.LONG);
      }
    } else {
      console.warn('field Empty')
    }
    console.warn('-------///////',this.state.points);
  }
  componentWillMount(){
    this.setState({
      show : true
    });
    this._getAccessToken().done();
    const {params} = this.props.navigation.state;
    console.warn('params',params);
    this.setState({
      product_image : params.img,
      price : params.prize,
      prizee : params.prize,
      product_name : params.product_name,
      product_id : params.product,
      vendor_id : params.vendor,
      measurements : params.measurements,
      slug : params.slug,
      spec : params.spec
    });
    this.setState({
      temp_prize : params.prize
    })
  }
  updateValue(text,field){
    if (field == 'points') {
      this.setState({
        points : text,
        value : text
      });
      console.warn('points....',this.state.points);
    }
  }
  updateValue3(text,field){
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
  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value
        });
        this.getAddress();
        this.getDetails();
      }
    } catch (error) {
      console.warn('error',error.message);
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
                            console.warn('addressArray',this.state.addressArray);
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
                        this.getAddress();
                        this.setState({
                          height : 0,
                          padding : 0
                        })
                    }
                }
            })
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
        });
        console.warn('access/////save',this.state.user_address_id);
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
        console.warn('address....',addressData);
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
                  this._getAccessToken();
                  this.textInput.clear();
                  this.textInput2.clear();
                  this.textInput3.clear();
                  this.textInput4.clear();
                  this.textInput5.clear();
                  this.textInput6.clear();
                  this.textInput7.clear();
                  this.textInput8.clear();
                  this.textInput9.clear();
                  this.textInput10.clear();
                  this.textInput11.clear();
                  this.setState({
                    homeChecked : false,
                    officeChecked : false,
                    checked : false
                  });
                  this.setState({add_new_screen:false});
                  // this.setState({
                  //   name : '',
                  //   street_address : '',
                  //   landmark : '',
                  //   city : '',
                  //   state : '',
                  //   district : '',
                  //   country : '',
                  //   phone_no : '',
                  //   area : '',
                  //   building : '',
                  //   postcode :''
                  // })
                } else {
                    this.setState({
                        // error_screen : true,
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
    updateCouponValue(text,field){
      if (field == 'coupon') {
        this.setState({
          coupon : text
        })
      }
    }
    ApplyCoupon(){
      if (this.state.points == '0') {
        let Data = {};
        Data.coupon_code = this.state.coupon,
        Data.product = this.state.product_id,
        Data.total_price = this.state.price,
        Data.vendor = this.state.vendor_id
        console.warn('Data',Data);
        var url = config.API_URL+'coupon/apply';
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
          if (response.code == '200') {
            if (response.data) {
              this.setState({
                coupon_disc : response.data.coupon_details.amount,
                price : parseInt(this.state.price) - parseInt(response.data.coupon_details.amount)
              });
              Toast.show('You will get '+this.state.coupon_disc+' amount discount', Toast.LONG);
              console.warn('coupon',this.state.coupon_disc);
            }
          }
          if (response.code == '409'){
            Toast.show(response.message, Toast.LONG);
          }
        })
      } else {
        this.setState({
          points : '0',
          point_screen : false,
          pointViewHeight : 0,
          pointsBorder : 0,
          partialPointColor : '#7a7979',
          allPointColor : '#7a7979',
          partialpointSubView : 0,
          inputpoints : 0,
          partialBtn : 0,
          placeholder : '',
          discountSize : 0,
          allpointsubView : 0,
          underlayColor : '#eee',
          ptrl_font : 0,
          convertedValue : '0',
          discPoints : '',
          price : this.state.prizee,
          value:''
        });
        this.getPoints();
        Toast.show('Applay the coupon first', Toast.LONG);
      }
      console.warn('ApplyCoupon=>points',this.state.points);
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
    getDetails(){
      console.warn('product_image',this.state.slug);
      var url = config.API_URL+'productDetail/'+this.state.slug
      fetch(url, {
        headers: new Headers({
          'Content-Type' : 'application/json',
          'Accept' : 'application/json',
          'Authorization' : this.state.access_token
        })
      })
      .then((response)=>response.json())
      .catch((error)=>console.warn(error))
      .then((response)=>{
        this.setState({
          show : false
        })
        console.warn('buy_now-->>slug-->>details',response.data);
        if (response.data) {
          this.setState({
            p_name : response.data.product_name,
            p_price : response.data.product_mrp,
          });
          for (let data of response.data.product_vendors) {
            this.setState({
              p_sale_price : data.product_price,
              p_discount : data.discount
            })
          }
        }
      })
    }
  cancelAddPage(){
    this.setState({
      add_new_screen : false,
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
    });
  }
  getEditData(postcode,area,building,landmark,city,district,state,country,name,type,phone_no,street,dflt,address_id){
    console.warn('default',dflt);
    this.setState({
      postcode : postcode,
      area : area,
      building : building,
      landmark : landmark,
      city : city,
      district : district,
      state : state,
      country : country,
      name : name,
      phone_no : phone_no,
      street_address : street,
      edit_add_screen : true,
      user_address_id : address_id
    });
    if (dflt){
      this.setState({
        checked : true
      })
    } else {
      this.setState({
        checked : false
      })
    }
    this.checkType(type);
  }
  updateAddress(){
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
      edit_add_screen : false
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
    console.warn('address....',addressData);
    if (addressData.postcode == '' || addressData.name == '' ||addressData.street_address == '' || addressData.landmark == '' ||
        addressData.city == '' || addressData.state == '' ||addressData.district == '' || addressData.country == '' ||
        addressData.type == '' || addressData.phone_no == '' ||addressData.area == '' || addressData.building == ''){
      this.setState({
        err_msg : 'seems like you have some problems with saving your address. Please go back and try again'
      })
    }

    var url = config.API_URL+'updateAddress/'+this.state.user_address_id;
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
            let dataValue = {};
            dataValue.user_address_id = this.state.user_address_id;
                dataValue.name = this.state.name;
                dataValue.street_address = this.state.street_address;
                dataValue.city = this.state.city;
                dataValue.building = this.state.building;
                dataValue.district = this.state.district;
                dataValue.state = this.state.state;
                dataValue.country = this.state.country;
                dataValue.landmark = this.state.landmark;
                dataValue.phone_no = this.state.phone_no;
                dataValue.postcode = this.state.postcode;
                console.warn("{{{{{}}}}}}}}",dataValue);
            this.setState({
              dataValue : dataValue,
              edit_add_screen : false,
              select_address_view : false
            });
            Toast.show('Address Updated', Toast.LONG);
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

  render(){
    const {goBack} = this.props.navigation;
    return(
      <View style = {{width:'100%',height:'100%'}}>
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
            <View style = {styles.titleView}>
              <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Check Out</Text>
            </View>
            <View style = {styles.iconView}>

            </View>
          </View>
          <ScrollView style = {{width:'100%',height:'92%'}}>
            <View style = {styles.baseView}>
                <View style={{width:'98%',backgroundColor:'#ffffff',justifyContent:'center',elevation:2,
                  padding:this.state.padding,height : this.state.height,marginTop:5}}>
                    <Text style={{color:'#000',fontSize:14,fontWeight:'bold',marginTop:10,marginBottom:10}}>
                        {this.state.dataValue.name}
                    </Text>
                    <Text style={{color:'#369',fontWeight:'bold',fontSize:12}}>
                      {this.state.pin_code_text}  {this.state.dataValue.postcode}
                    </Text>
                    <Text style = {{fontSize:12}}>
                        {this.state.dataValue.street_address+','+this.state.dataValue.city}
                    </Text>
                    <Text style={{fontWeight:'bold',color:'#360',fontSize:12}}>
                        Mobile Number : {this.state.dataValue.phone_no}
                    </Text>
                </View>
                <View style={{width:'98%', backgroundColor:'#ffffff',justifyContent:'space-between',elevation:2,padding:10,
                    alignItems:'center',flexDirection:'row',marginTop:2}}>
                    <TouchableHighlight style={{padding:this.state.address_padding,alignItems:'center',justifyContent:'center',borderWidth:this.state.address_border_width,borderColor:'#369',width:100,height:this.state.address_height}}
                      underlayColor='transparent'
                      onPress = {()=>this.getUserAddress()}>
                        <Text style={{color:'#369',fontWeight:'bold',fontSize:12}}>{this.state.select_address}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={{padding:3,alignItems:'center',justifyContent:'center',borderWidth:1,borderColor:'#369',width:100,height:30}}
                        underlayColor='transparent'
                         onPress = {()=>this.setState({add_new_screen:true})}>
                        <Text style={{color:'#369',fontWeight:'bold',fontSize:12}}>Add Address</Text>
                    </TouchableHighlight>
                </View>
              <View style = {styles.topView}>
                <View style = {{padding:10,borderBottomColor:'#cccccc',borderBottomWidth:1}}>
                  <Text style = {{color:'#369',fontWeight:'bold',fontSize:14}}>Order Details</Text>
                </View>
                <Text style = {{fontSize:12,color:'#000',marginTop:10,fontWeight:'bold'}}>{this.state.p_name}</Text>
                <View style = {{width:'60%',height:250,alignItems:'center',justifyContent:'center',marginTop:10}}>
                  <Image style = {styles.imageView}
                    source = {{uri:config.IMG_URL+this.state.product_image}}>
                  </Image>
                </View>
                <View style = {{width:'100%'}}>
                    <View style = {{width:'60%',marginLeft:5}}>
                      <GridView
                        itemDimension={360}
                        items={this.state.spec}
                        style={{paddingTop:10}}
                        renderItem={item => (
                          <View style = {{width:'100%',flexDirection:'row'}}>
                            <View style = {{width:'70%'}}>
                              <Text style = {{fontSize:12,color:'#000',fontWeight:'bold'}}>{item.spec_name}</Text>
                            </View>
                            <View style = {{width:'30%',justifyContent:'center'}}>
                              <Text style = {{fontSize:12,fontWeight:'bold',color:'#006400',textAlign: 'left'}}>{item.spec_value}</Text>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                </View>
                <View style = {{width:'100%'}}>
                    <View style = {{width:'60%',marginLeft:5}}>
                      <GridView
                        itemDimension={360}
                        items={this.state.measurements}
                        renderItem={item => (
                          <View style = {{width:'100%',flexDirection:'row'}}>
                            <View style = {{width:'70%'}}>
                              <Text style = {{fontSize:12,color:'#000',fontWeight:'bold'}}>{item.name}</Text>
                            </View>
                            <View style = {{width:'30%',justifyContent:'center'}}>
                              <Text style = {{fontSize:12,fontWeight:'bold',color:'#006400',textAlign: 'left'}}>{item.value}</Text>
                            </View>
                          </View>
                        )}
                      />
                    </View>
                </View>
                <View style = {{width:'100%'}}>
                  <View style = {{width:'60%',marginLeft:15}}>
                    <View style = {{width:'100%',flexDirection:'row'}}>
                      <View style = {{width:'60%'}}>
                        <Text style = {{fontSize:12,color:'#000',fontWeight:'bold'}}>Quantity</Text>
                      </View>
                      <View style = {{width:'40%',marginLeft:10}}>
                        <Text style = {{fontSize:12,fontWeight:'bold',color:'#006400',textAlign: 'left'}}>1</Text>
                      </View>
                    </View>
                  </View>
                </View>
                {/*<View style = {{padding:5,borderTopColor:'#cccccc',borderTopWidth:1,flexDirection:'row',marginTop:20}}>*/}
                  {/*/!*<View style = {{flexDirection:'row'}}>*!/*/}
                    {/*/!*<View style = {{width:'70%',justifyContent:'center'}}>*!/*/}
                      {/*/!*<Text style = {{fontSize:14,color:'#000',fontWeight:'bold'}}>Total Payable</Text>*!/*/}
                    {/*/!*</View>*!/*/}
                    {/*/!*<View style = {{width:'30%'}}>*!/*/}
                      {/*/!*<Text style = {{fontSize:14,textAlign: 'right',color:'#360',fontWeight:'bold'}}>Rs.{this.state.price}</Text>*!/*/}
                    {/*/!*</View>*!/*/}
                  {/*/!*</View>*!/*/}
                {/*</View>*/}
              </View>
              <View style = {{width:'100%',alignItems:'center',justifyContent:'center',marginTop:10}}>
                <View style = {{width:'97%',flexDirection:'row',backgroundColor:'#fff',elevation:2,alignItems:'center',justifyContent:'center'}}>
                  <TextInput style = {styles.input1}
                             underlineColorAndroid='transparent'
                             placeholderTextColor="#360"
                             placeholder='Your coupon'
                             onChangeText = {(text_coupon)=>this.updateCouponValue(text_coupon,'coupon')}>
                  </TextInput>
                  <View style = {{width:'20%',height:45,marginTop:10,backgroundColor:'#2fdab8',borderTopWidth:1,borderBottomWidth:1,marginBottom:20,
                    borderRightWidth:1,borderColor:'#363a42',alignItems:'center',justifyContent:'center'}}>
                    <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                        underlayColor = 'transparent'
                                        onPress = {()=>this.ApplyCoupon()}>
                      <Text style = {{color:'#fff'}}>GO</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
              <View style = {{width:'100%',alignItems:'center',justifyContent:'center',marginTop:10}}>
                <View style = {{width:'97%',backgroundColor:'#fff',elevation:2}}>
                  <View style = {{width:'95%',height:40,marginTop:20,marginBottom:10}}>
                    <Text style = {{color:'#360',fontSize:14,fontWeight:'bold',marginBottom:10,marginLeft:10}}>Your total point : {this.state.temp_points}</Text>
                    <CheckBox
                        title='Use Points'
                        checked={this.state.checked}
                        containerStyle={{backgroundColor:'#fff',borderColor:'#fff'}}
                        onPress = {()=>this.pointCheck()}
                    />
                  </View>
                  <View style = {{width:'100%',marginTop:10,marginBottom:10,alignItems:'center',justifyContent:'center'}}>
                    <View style = {{width:this.state.p_width,flexDirection:'row'}}>
                      <TextInput style = {{width:'80%',height:this.state.p_height,paddingLeft:16,color:'#363a42',borderColor:'#363a42',
                        marginTop:20, alignItems:'center',justifyContent:'center',borderTopWidth:this.state.p_border,borderBottomWidth:this.state.p_border,
                        borderLeftWidth:this.state.p_border}}
                                 ref={input => { this.textInputpoint = input }}
                                 underlineColorAndroid={this.state.p_underline}
                                 placeholderTextColor="#360"
                                 placeholder='Enter Your Points'
                                 keyboardType='numeric'
                                 onChangeText = {(text_point)=>this.updatePointValue(text_point,'point')}>
                      </TextInput>
                      <View style = {{width:'20%',height:this.state.p_height,marginTop:20,backgroundColor:'#2fdab8',borderTopWidth:this.state.p_border,
                        borderBottomWidth:this.state.p_border,borderRightWidth:this.state.p_border,borderColor:'#363a42',alignItems:'center',
                        justifyContent:'center'}}>
                        <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                            underlayColor = 'transparent'
                                            onPress = {()=>this.convertPartialPoints()}>
                          <Text style = {{color:'#fff'}}>Use</Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'97%',alignItems:'center',justifyContent:'center',marginTop:10,backgroundColor:'#fff',elevation:2}}>
                  <View style = {{width:'95%'}}>
                    <Text style={{color:'#565959',fontWeight:'bold',fontSize:16,marginTop:10,marginBottom:10}}>Summary : </Text>
                  </View>
                  <View style = {{width:'95%',flexDirection:'row'}}>
                    <View style = {{width:'70%'}}>
                      <Text>Total :</Text>
                    </View>
                    <View style = {{width:'30%'}}>
                      <Text>INR. {this.state.temp_prize}</Text>
                    </View>
                  </View>
                  <View style = {{width:'95%',flexDirection:'row',marginBottom:10}}>
                    <View style = {{width:'70%'}}>
                      <Text>Point Discount Amount :</Text>
                    </View>
                    <View style = {{width:'30%'}}>
                      <Text> - {this.state.convertedValue}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style = {styles.topView}>



                <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>

                </View>
                <View style = {{width:'95%'}}>
                  <Text style = {{color:'#000',fontSize:14,fontWeight:'bold'}}>Choose Your Payment Details</Text>
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
            </View>
          </ScrollView>
          <View style = {styles.footer}>
            <View style = {{width:'50%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{color:'#000',fontSize:14,fontWeight:'bold'}}>INR {this.state.price}</Text>
            </View>
            <TouchableHighlight style = {styles.paybtn}
              underlayColor = 'transparent'
              onPress = {()=>this.placeOrder()}>
              <View style = {{borderTopLeftRadius:6,borderTopRightRadius: 6,borderBottomLeftRadius:6, borderBottomRightRadius:6,
                height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                <Text style = {{color:'#fff',fontSize:14}}>Place Order</Text>
              </View>
            </TouchableHighlight>
          </View>
        </View>
        <AnimatedHideView
          visible = {this.state.emptyScreen}
          style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',backgroundColor:'#fff'}}>
          <View style = {styles.toolbar}>
            <View style = {styles.menuView}>
              <TouchableHighlight underlayColor = 'transparent'
                onPress = {()=>this.props.navigation.navigate('open')}>
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
                    onPress = {()=>this.props.navigation.navigate('open')}>
                    <Text style = {{color:'#fff',fontSize:16,fontWeight:'bold'}}>View Orders</Text>
                  </TouchableHighlight>
                </View>
                <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
              </View>
            </View>
          </View>
        </AnimatedHideView>
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
          position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}
          visible = {this.state.error_screen}>
          <View style = {{width:'95%',height:'30%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',
            borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
            <TouchableHighlight style={{marginTop:20}}
                underlayColor='transparent'>
              <MaterialIcons
                  name='error'
                  size={36 }
                  style = {{color:'#800000'}}>
              </MaterialIcons>
            </TouchableHighlight>
            <Text style = {{fontSize:16,fontWeight:'bold',color:'#000'}}>Oops!</Text>
            <View style = {{width:'95%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{fontSize:14,textAlign:'center'}}>{this.state.error_msg}</Text>
            </View>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:10}}>
              <View>

              </View>
              <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                onPress = {()=>this.setState({error_screen : false})}>OK</Text>
            </View>
          </View>
        </AnimatedHideView>


          <AnimatedHideView visible={this.state.select_address_view}
            style={{position:'absolute',height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style={styles.container}>
                  <View style = {styles.toolbar}>
                      <View style = {styles.menuView}>
                          <TouchableHighlight underlayColor = 'transparent'
                                              onPress = {()=>this.setState({select_address_view : false})}>
                              <MaterialIcons
                                  name='arrow-back'
                                  size={22}
                                  style = {{color:'#fff'}}>
                              </MaterialIcons>
                          </TouchableHighlight>
                      </View>
                      <View style = {styles.titleView}>
                          <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Saved Address</Text>
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
                                              <Text style={{color:'#000',fontSize:16,fontWeight:'bold'}}>{item.name}</Text>
                                              <View style={{backgroundColor:'#eee',padding:3,marginLeft:10}}>
                                                  <Text style={{fontSize:12}}>
                                                      {item.type}
                                                  </Text>
                                              </View>
                                          </View>
                                          <View style={{width:'100%',padding:10}}>
                                              <Text style={{color:'#000',fontWeight:'bold',fontSize:12}}>
                                                  Postcode : {item.postcode}
                                              </Text>
                                              <Text style={{fontSize:12}}>
                                                  {item.area+','+item.building}
                                              </Text>
                                              <Text style={{fontSize:12}}>
                                                  {item.street+','+item.city+','+item.district+','+item.state+','+item.country}
                                              </Text>
                                              <Text style={{fontSize:12,fontWeight:'bold',color:'#369'}}>
                                                  Mobile Number : {item.phone_no}
                                              </Text>
                                          </View>
                                          <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                                              <View style={{width:'70%'}}>
                                                  <Text style={{color:'#369',fontWeight:'bold',fontSize:12,marginLeft:10}}
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
                                                     onPress = {()=>this.getEditData(
                                                       item.postcode,
                                                       item.area,
                                                       item.building,
                                                       item.landmark,
                                                       item.city,
                                                       item.district,
                                                       item.state,
                                                       item.country,
                                                       item.name,
                                                       item.type,
                                                       item.phone_no,
                                                       item.street,
                                                       item.dflt,
                                                       item.address_id
                                                     )}>
                                                  <MaterialIcons
                                                     name='edit'
                                                     size={22}
                                                     style = {{color:'#369'}}>
                                                  </MaterialIcons>
                                                  </TouchableHighlight>
                                                  {/*<TouchableHighlight underlayColor='transparent'*/}
                                                     {/*onPress = {()=>this.setState({removeScreen:true,address_id:item.address_id})}>*/}
                                                      {/*<MaterialIcons*/}
                                                          {/*name='delete'*/}
                                                          {/*size={22}*/}
                                                          {/*style = {{color:'#369'}}>*/}
                                                      {/*</MaterialIcons>*/}
                                                  {/*</TouchableHighlight>*/}
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
            <View style = {{backgroundColor:'#282a2d',width:'95%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{fontSize:16,fontWeight:'bold',color:'#fff',marginTop:30}}>Do u really wants remove the address ?</Text>
              <View style = {{width:'100%',marginTop:20,marginBottom:10,flexDirection:'row'}}>
                <View style = {{width:'60%'}}>

                </View>
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
                                            onPress = {()=>this.setState({add_new_screen:false})}>
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
                                showsVerticalScrollIndicator={false}
                                keyboardDismissMode='on-drag'
                                keyboardShouldPersistTaps={true}>
                        <View>
                            <View style = {styles.baseView}>

                                <View style = {styles.topView}>
                                    <TextInput style = {styles.input}
                                               ref={input => { this.textInput = input }}
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
                                               ref={input => { this.textInput2 = input }}
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
                                               ref={input => { this.textInput3 = input }}
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
                                               ref={input => { this.textInput4 = input }}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="Locality/Town"
                                               onChangeText = {(text_landmark)=>this.updateValue2(text_landmark,'landmark')}>
                                    </TextInput>
                                    <TextInput style = {styles.input}
                                               ref={input => { this.textInput5 = input }}
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
                                               ref={input => { this.textInput6 = input }}
                                               underlineColorAndroid = '#bbbbbb'
                                               placeholder="District"
                                               onChangeText = {(text_district)=>this.updateValue2(text_district,'district')}>
                                    </TextInput>
                                    <TextInput style = {styles.input}
                                               ref={input => { this.textInput7 = input }}
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
                                               ref={input => { this.textInput8 = input }}
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
                                               ref={input => { this.textInput9 = input }}
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
                                               ref={input => { this.textInput10 = input }}
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
                                               ref={input => { this.textInput11 = input }}
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
                                                  onPress = {()=>this.cancelAddPage()}>CANCEL</Text>
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
                {/*<AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',*/}
                    {/*position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}*/}
                                  {/*visible = {this.state.error_screen}>*/}
                    {/*<View style = {{width:'95%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>*/}
                      {/*<TouchableHighlight style = {{marginTop:20}}*/}
                                          {/*underlayColor='transparent'>*/}
                        {/*<MaterialIcons*/}
                            {/*name='error'*/}
                            {/*size={36 }*/}
                            {/*style = {{color:'#800000'}}>*/}
                        {/*</MaterialIcons>*/}
                      {/*</TouchableHighlight>*/}
                        {/*<Text style = {{fontSize:16,fontWeight:'bold',color:'#000',marginTop:10,textAlign:'center'}}>*/}
                        {/*There is some problem with saving your address. Please enter Your*/}
                            {/*details correctly</Text>*/}
                        {/*<View style = {{width:'95%',alignItems:'center',justifyContent:'center',marginTop:10}}>*/}
                            {/*<Text style = {{fontSize:14,textAlign:'center'}}>{this.state.err_msg}</Text>*/}
                        {/*</View>*/}
                        {/*<View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:10,marginBottom:10}}>*/}
                            {/*<View>*/}

                            {/*</View>*/}
                            {/*<Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}*/}
                                  {/*onPress = {()=>this.setState({error_screen : false})}>OK</Text>*/}
                        {/*</View>*/}
                    {/*</View>*/}
                {/*</AnimatedHideView>*/}
                <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',
                    justifyContent:'center',backgroundColor:'rgba(00, 00, 00, 0.7)',position:'absolute'}}
                                  visible = {this.state.success_screen}>
                    <View style = {{width:'95%',backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}>
                        <Image style = {{height:80,width:80,marginTop:20}}
                               source = {require('../img/checked.png')}>
                        </Image>
                        <Text style = {{color:'#000',fontSize:16,fontWeight:'bold',marginTop:20}}>Your address added successfully</Text>
                        <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:30,marginBottom:20}}>
                            <View></View>
                            <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                                  onPress = {()=>this.setState({success_screen : false})}>OK</Text>
                        </View>
                    </View>
                </AnimatedHideView>
            </View>
          </AnimatedHideView>
        <AnimatedHideView visible={this.state.edit_add_screen}
          style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}>
          <View style = {styles.container}>
            <StatusBar
                translucent = {false}
                barStyle="light-content"
                backgroundColor='#191a1c'
            />
            <View style = {styles.toolbar}>
              <View style = {styles.menuView}>
                <TouchableHighlight underlayColor = 'transparent'
                                    onPress = {()=>this.setState({edit_add_screen:false})}>
                  <MaterialIcons
                      name='arrow-back'
                      size={22}
                      style = {{color:'#fff'}}>
                  </MaterialIcons>
                </TouchableHighlight>
              </View>
              <View style = {styles.textView}>
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Edit Address</Text>
              </View>
              <View style = {styles.iconView}>

              </View>
            </View>
            <View style = {styles.baseContainer}>
              <ScrollView style = {styles.scrollView}
                          showsVerticalScrollIndicator={false}
                          keyboardDismissMode='on-drag'
                          keyboardShouldPersistTaps={true}>
                <View>
                  <Text style = {{fontSize:18,marginTop:20,marginLeft:20,color:'#000'}}>Edit Your Address</Text>
                  <View style = {styles.baseView}>

                    <View style = {styles.topView}>
                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          Pin Code
                        </Text>
                      </View>

                      <TextInput style = {styles.input}
                                 underlineColorAndroid = '#bbbbbb'
                                 placeholder="Pin Code"
                                 keyboardType='numeric'
                                 value={this.state.postcode}
                                 onChangeText = {(text_postcode)=>this.updateValue3(text_postcode,'postcode')}>
                      </TextInput>
                      <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View>
                        </View>
                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_postcode}</Text>
                      </View>

                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          Area
                        </Text>
                      </View>
                      <TextInput style = {styles.input}
                                 underlineColorAndroid = '#bbbbbb'
                                 placeholder="Area"
                                 value={this.state.area}
                                 onChangeText = {(text_area)=>this.updateValue3(text_area,'area')}>
                      </TextInput>
                      <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View>
                        </View>
                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_area}</Text>
                      </View>
                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          Building
                        </Text>
                      </View>
                      <TextInput style = {styles.input}
                                 underlineColorAndroid = '#bbbbbb'
                                 placeholder="Building"
                                 value={this.state.building}
                                 onChangeText = {(text_building)=>this.updateValue3(text_building,'Building')}>
                      </TextInput>
                      <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View>
                        </View>
                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_building}</Text>
                      </View>
                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          Locality/Town
                        </Text>
                      </View>
                      <TextInput style = {styles.input}
                                 underlineColorAndroid = '#bbbbbb'
                                 placeholder="Locality/Town"
                                 value={this.state.landmark}
                                 onChangeText = {(text_landmark)=>this.updateValue3(text_landmark,'landmark')}>
                      </TextInput>
                      <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View>
                        </View>
                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_landmark}</Text>
                      </View>
                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          City
                        </Text>
                      </View>
                      <TextInput style = {styles.input}
                                 underlineColorAndroid = '#bbbbbb'
                                 placeholder="City"
                                 value={this.state.city}
                                 onChangeText = {(text_city)=>this.updateValue3(text_city,'city')}>
                      </TextInput>
                      <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View>
                        </View>
                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_city}</Text>
                      </View>
                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          District
                        </Text>
                      </View>
                      <TextInput style = {styles.input}
                                 underlineColorAndroid = '#bbbbbb'
                                 placeholder="District"
                                 value={this.state.district}
                                 onChangeText = {(text_district)=>this.updateValue3(text_district,'district')}>
                      </TextInput>
                      <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View>
                        </View>
                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_district}</Text>
                      </View>
                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          State
                        </Text>
                      </View>
                      <TextInput style = {styles.input}
                                 underlineColorAndroid = '#bbbbbb'
                                 placeholder="State"
                                 value={this.state.state}
                                 onChangeText = {(text_state)=>this.updateValue3(text_state,'state')}>
                      </TextInput>
                      <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View>
                        </View>
                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_state}</Text>
                      </View>
                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          Country
                        </Text>
                      </View>
                      <TextInput style = {styles.input}
                                 underlineColorAndroid = '#bbbbbb'
                                 placeholder="Country"
                                 value={this.state.country}
                                 onChangeText = {(text_country)=>this.updateValue3(text_country,'country')}>
                      </TextInput>
                      <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View>
                        </View>
                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_country}</Text>
                      </View>
                    </View>

                    <View style = {styles.topView}>
                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          Name
                        </Text>
                      </View>
                      <TextInput style = {styles.input}
                                 underlineColorAndroid = '#bbbbbb'
                                 placeholder="Name"
                                 value={this.state.name}
                                 onChangeText = {(text_name)=>this.updateValue3(text_name,'name')}>
                      </TextInput>
                      <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View>
                        </View>
                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_name}</Text>
                      </View>
                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          Address
                        </Text>
                      </View>
                      <TextInput style = {styles.addressBox}
                                 underlineColorAndroid = 'transparent'
                                 multiline={true}
                                 editable = {true}
                                 placeholder="Address"
                                 value={this.state.street_address}
                                 onChangeText = {(text_address)=>this.updateValue3(text_address,'street_address')}>
                      </TextInput>
                      <View style={{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <View>
                        </View>
                        <Text style={{color:'#800000',fontWeight:'bold'}}>{this.state.err_street}</Text>
                      </View>
                      <View style={{width:'95%',marginTop:10}}>
                        <Text style={{color:'#369'}}>
                          Mobile No
                        </Text>
                      </View>
                      <TextInput style = {styles.input}
                                 underlineColorAndroid = '#bbbbbb'
                                 placeholder="Mobile No"
                                 keyboardType='numeric'
                                 value={this.state.phone_no}
                                 onChangeText = {(text_phone_no)=>this.updateValue3(text_phone_no,'phone_no')}>
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
                                onPress = {()=>this.setState({edit_add_screen:false})}>CANCEL</Text>
                        </View>
                        <View style = {{width:'48%',height:'70%',borderTopLeftRadius:6,borderTopRightRadius: 6,
                          borderBottomLeftRadius:6,borderBottomRightRadius:6, backgroundColor:'#48c7f0',
                          alignItems:'center',justifyContent:'center'}}>
                          <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                                              underlayColor='transparent'
                                              onPress = {() =>this.updateAddress()}>
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
              <View style = {{width:'95%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
                <TouchableHighlight style = {{marginTop:20}}
                                    underlayColor='transparent'>
                  <MaterialIcons
                      name='error'
                      size={36 }
                      style = {{color:'#800000'}}>
                  </MaterialIcons>
                </TouchableHighlight>
                <Text style = {{fontSize:16,fontWeight:'bold',color:'#000',marginTop:10,textAlign:'center'}}>There is some problem with saving your address. Please enter Your
                  details correctly</Text>
                <View style = {{width:'95%',alignItems:'center',justifyContent:'center',marginTop:10}}>
                  <Text style = {{fontSize:14,textAlign:'center'}}>{this.state.err_msg}</Text>
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
              <View style = {{width:'95%',backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}>
                <Image style = {{height:80,width:80,marginTop:20}}
                       source = {require('../img/checked.png')}>
                </Image>
                <Text style = {{color:'#000',fontSize:16,fontWeight:'bold',marginTop:20}}>Your address updated successfully</Text>
                <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:30,marginBottom:20}}>
                  <View></View>
                  <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                        onPress = {()=>this.props.navigation.navigate('add_manage')}>OK</Text>
                </View>
              </View>
            </AnimatedHideView>
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
  topView:{
    width:'98%',
    backgroundColor:'#ffffff',
    justifyContent:'center',
    alignItems:'center',
    elevation:2,
    padding:10,
    marginTop:10
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
    width:'100%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center',
    resizeMode:'stretch'
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
  baseView:{
      width:'100%',
      alignItems:'center',
      justifyContent:'center',
      marginTop:10,
      marginBottom:10
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
    width:'70%',
    height:45,
    paddingLeft:16,
    color:'#363a42',
    borderColor:'#363a42',
    marginTop:10,
    alignItems:'center',
    justifyContent:'center',
    borderTopWidth:1,
    borderBottomWidth:1,
    borderLeftWidth:1,
    marginBottom:20
  },
});
