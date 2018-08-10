import React,{Component} from 'react';
import {View,
        Text,
        StyleSheet,
        ScrollView,
        Image,
        TouchableHighlight,
        AsyncStorage,
        TextInput
      } from 'react-native'
import config from '../API/config'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import AnimatedHideView from 'react-native-animated-hide-view'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Spinner from 'react-native-loading-spinner-overlay'

var radio_props = [
  {label: 'Debit', value: 0 },
  {label: 'Credit', value: 1 },
  {label: 'Cash on Delivery', value: 2}
];

export default class extends Component<{}>{
  static navigationOptions = {
    header : null
  }

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
      pointViewHeight : 0,
      pointsBorder : 0,
      allPointColor : '#7a7979',
      partialPointColor : '#7a7979',
      allpointsubView : 0,
      partialpointSubView : 0,
      discountSize : 0,
      inputpoints : 0,
      inputPointBorder : 0,
      partialBtn : 0,
      convertedValue : '0',
      user_point : '',
      partialpoints : '',
      show : false,
      measurements : [],
      underlayColor : '#eee',
      ptrl_font : 0
    }
  }
  getAddress(){
    this.setState({
      show : true
    })
    this.getPoints();
    var url = config.API_URL+'userAddresses'
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
      console.warn('responseee',response);
      if(response.data!=null){
        this.setState({
          show:false
        })
        for(let data of response.data){
          this.setState({
            user_address_id : data.user_address_id,
            name : data.name,
            street_address : data.street_address,
            city : data.city,
            district : data.distric,
            state : data.state,
            country : data.country,
            landmark : data.landmark,
            phone_no : data.phone_no,
            postcode : data.postcode
          })
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
  placeOrder(){
    let checkOutData = {}
    console.warn('measurements',this.state.measurements);
    checkOutData.currency = 'INR',
    checkOutData.address_id = this.state.user_address_id,
    checkOutData.payment_method = this.state.payment_method,
    checkOutData.product = this.state.product_id,
    checkOutData.vendor = this.state.vendor_id,
    checkOutData.Points = this.state.user_point
    checkOutData.measurements = this.state.measurements
    console.warn('checkOutData',checkOutData);
    var url = config.API_URL+'user/checkout'
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
      if (response.code == '200') {
        this.setState({
          success_screen : true
        })
      } else {
        this.setState({
          error_screen : true
        })
      }
    })
  }
  getPoints(){
    var url = config.API_URL+'user/points'
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
          points : response.data.points
        })
        console.warn('points--->>>',this.state.points);
      }
    })
  }
  convertPoints(){
    this.setState({
      allPointColor:'#369',
      partialPointColor:'#7a7979',
      discountSize:16,
      allpointsubView:20,
      pointViewHeight:120,
      inputPointBorder:0,
      partialpointSubView:0,
      inputpoints:'0%',
      partialBtn:0,
      user_point:this.state.points,
      ptrl_font:0,
      underlayColor:'#eee'
    })
    var url = config.API_URL+'user/points/convertToInr/'+this.state.points
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
      console.warn('ConvertPointsresponse',response);
      if (response.code == '200') {
        console.warn('value',response.data.value);
        this.setState({
          convertedValue : response.data.value
        })
      }
    })
  }
  convertPartialPoints(){
    console.warn('Partialpoints---------',this.state.partialpoints);
    var url = config.API_URL+'user/points/convertToInr/'+this.state.partialpoints
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
      console.warn('ConvertPointsresponse',response);
      if (response.code == '200') {
        console.warn('value',response.data.value);
        this.setState({
          convertedValue : response.data.value
        })
      }
    })
  }
  componentWillMount(){
    this._getAccessToken().done();
    const {params} = this.props.navigation.state;
    console.warn('params',params);
    this.setState({
      product_image : params.img,
      price : params.prize,
      product_name : params.product_name,
      product_id : params.product,
      vendor_id : params.vendor,
      measurements : params.measurements
    })
    console.warn('product_image',this.state.product_image);
  }
  updateValue(text,field){
    if (field == 'points') {
      this.setState({
        partialpoints : text
      })
      console.warn('points....',this.state.partialpoints);
    }
  }
  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value
        })
        this.getAddress();
      }
    } catch (error) {
      console.warn('error',error.message);
    }
  }

  render(){
    const {goBack} = this.props.navigation
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
            <View style = {styles.iconView}></View>
          </View>
          <ScrollView style = {{width:'100%',height:'92%'}}>
            <View style = {styles.baseView}>
              <View style = {styles.topViewAdd}>
                <View style = {{flexDirection:'row'}}>
                  <Text style = {{color:'#000',fontSize:18,fontWeight:'bold'}}>{this.state.name}</Text>
                  <Text style = {{marginLeft:5}}>(Default)</Text>
                </View>
                <View style = {{flexDirection:'row',marginTop:10}}>
                  <Text>{this.state.street_address}</Text>
                </View>
                <View style = {{flexDirection:'row'}}>
                  <Text>{this.state.state}</Text>
                  <Text style = {{marginLeft:5}}>{this.state.country}</Text>
                  <Text style = {{marginLeft:5}}>{this.state.postcode}</Text>
                </View>
                <View style = {{flexDirection:'row',marginTop:10}}>
                  <Text>Mobile -</Text>
                  <Text style = {{marginLeft:5,color:'#000',fontWeight:'bold'}}>{this.state.phone_no}</Text>
                </View>
              </View>
              <View style = {styles.addFooter}>
                <TouchableHighlight underlayColor = 'transparent'
                  style = {styles.editAdd}>
                  <View style = {styles.editAdd}>
                    <Text style = {{color:'#369',fontWeight:'bold'}}
                      onPress = {()=>this.props.navigation.navigate('add_address')}>Edit/Change</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight underlayColor = 'transparent'
                  style = {styles.addNewAdd}
                  onPress = {()=>this.props.navigation.navigate('add_address',{
                    product_name:this.state.product_name,
                    prize:this.state.price,
                    img:this.state.product_image,
                    product:this.state.product_id,
                    vendor:this.state.vendor_id
                  })}>
                  <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{color:'#369',fontWeight:'bold'}}>Add New Address</Text>
                  </View>
                </TouchableHighlight>
              </View>
              <View style = {styles.topView}>
                <View style = {{padding:10,borderBottomColor:'#cccccc',borderBottomWidth:1}}>
                  <Text style = {{color:'#ffffff',color:'#369',fontWeight:'bold',fontSize:18}}>Order Details</Text>
                </View>
                <Text style = {{fontSize:16,color:'#000',marginTop:10}}>{this.state.product_name}</Text>
                <View style = {{flexDirection:'row',width:'100%'}}>
                  <Image style = {styles.imageView}
                    source = {{uri:config.IMG_URL+this.state.product_image}}></Image>
                    <View style = {{width:'60%',marginLeft:20}}>
                      <View style = {{flexDirection:'row',marginTop:10,width:'100%'}}>
                        <View style = {{width:'70%',justifyContent:'center'}}>
                          <Text style = {{fontSize:16}}>Prize</Text>
                        </View>
                        <View style = {{width:'30%'}}>
                          <Text style = {{color:'#006400',fontSize:16,textAlign: 'right'}}>{this.state.price}</Text>
                        </View>
                      </View>
                      <View style = {{flexDirection:'row',marginTop:10}}>
                        <View style = {{width:'70%',justifyContent:'center'}}>
                          <Text style = {{fontSize:16}}>Size</Text>
                        </View>
                        <View style = {{width:'30%'}}>
                          <Text style = {{fontSize:16,textAlign: 'right'}}>XL</Text>
                        </View>
                      </View>
                      <View style = {{flexDirection:'row',marginTop:10}}>
                        <View style = {{width:'70%',justifyContent:'center'}}>
                          <Text style = {{fontSize:16}}>Color</Text>
                        </View>
                        <View style = {{width:'30%'}}>
                          <Text style = {{fontSize:16,textAlign: 'right'}}>Blue</Text>
                        </View>
                      </View>
                    </View>
                </View>
                <View style = {{padding:5,borderTopColor:'#cccccc',borderTopWidth:1,flexDirection:'row',marginTop:20}}>
                  <View style = {{flexDirection:'row'}}>
                    <View style = {{width:'70%',justifyContent:'center'}}>
                      <Text style = {{fontSize:16,color:'#000',fontWeight:'bold'}}>Total Payable</Text>
                    </View>
                    <View style = {{width:'30%'}}>
                      <Text style = {{fontSize:16,textAlign: 'right',color:'#000',fontWeight:'bold'}}>Rs.{this.state.price}</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style = {{width:'95%',marginTop:10,marginBottom:10}}>
                <Text style = {{color:'#360',fontSize:18,fontWeight:'bold'}}>Your total point : {this.state.points}</Text>
                <TouchableHighlight style = {{width:'100%',height:40,borderColor:'#bbb',borderWidth:1,marginTop:10}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.setState({pointViewHeight:100,pointsBorder:1})}>
                  <View style = {{alignItems:'center',justifyContent:'center',flexDirection:'row',width:'100%',height:'100%'}}>
                    <Text style = {{fontSize:16,marginRight:10,color:'#000'}}>Want to use your point?</Text>
                    <MaterialIcons
                      name='keyboard-arrow-down'
                      size={26}
                      style = {{color:'#360'}}>
                    </MaterialIcons>
                  </View>
                </TouchableHighlight>
                <View style = {{width:'100%',height:this.state.pointViewHeight,borderColor:'#bbb',borderWidth:this.state.pointsBorder,
                    marginTop:5,padding:10}}>
                  <View style = {{width:'80%',flexDirection:'row',marginTop:10}}>
                  <TouchableHighlight underlayColor = 'transparent'
                    onPress = {()=>this.convertPoints()}>
                    <MaterialIcons
                      name='radio-button-checked'
                      size={26}
                      style = {{color:this.state.allPointColor}}>
                    </MaterialIcons>
                  </TouchableHighlight>
                    <Text style = {{fontSize:16,marginLeft:10,color:this.state.allPointColor}}>Use all Points</Text>
                  </View>
                  <View style = {{height:this.state.allpointsubView,width:'80%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                    <Text style = {{fontSize:this.state.discountSize,fontWeight:'bold',color:'#360'}}>Discount : </Text>
                    <Text style = {{fontSize:this.state.discountSize,fontWeight:'bold',color:'#800000'}}>Rs. {this.state.convertedValue}</Text>
                  </View>
                  <View style = {{width:'80%',flexDirection:'row',marginTop:10}}>
                    <TouchableHighlight underlayColor = 'transparent'
                      onPress = {()=>this.setState({
                          partialPointColor:'#369',
                          allPointColor:'#7a7979',
                          pointViewHeight:130,
                          inputPointBorder:1,
                          partialpointSubView:20,
                          inputpoints:40,
                          partialBtn:30,
                          discountSize:0,
                          allpointsubView:0,
                          underlayColor:'#bbb',
                          ptrl_font:16
                        })}>
                      <MaterialIcons
                        name='radio-button-checked'
                        size={26}
                        style = {{color:this.state.partialPointColor}}>
                      </MaterialIcons>
                    </TouchableHighlight>
                    <Text style = {{fontSize:16,marginLeft:10,color:this.state.partialPointColor}}>Use Partially</Text>
                  </View>
                  <View style = {{width:'80%',height:this.state.partialpointSubView,alignItems:'center',
                    justifyContent:'center',flexDirection:'row',marginTop:10}}>
                    <TextInput style = {{width:'30%',height:this.state.inputpoints,paddingLeft:16,borderColor:'#369',
                      borderWidth:this.state.inputPointBorder,color:'#000',marginRight:10}}
                      underlineColorAndroid={this.state.underlayColor}
                      placeholder="points"
                      placeholderTextColor="#369"
                      keyboardType={'numeric'}
                      onChangeText = {(txt_points)=>this.updateValue(txt_points,'points')}>
                    </TextInput>
                    <View style = {{width:50,height:this.state.partialBtn,alignItems:'center',justifyContent:'center',backgroundColor:'#360',
                      borderBottomLeftRadius:2,borderTopRightRadius:2,borderTopLeftRadius:2,borderTopRightRadius:2}}>
                      <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                        underlayColor = 'transparent'
                        onPress = {()=>this.convertPartialPoints()}>
                        <Text style = {{color:'#fff'}}>GO</Text>
                      </TouchableHighlight>
                    </View>
                    <Text style = {{marginLeft:10,color:'#800000',fontSize:this.state.ptrl_font}}>Rs. {this.state.convertedValue}</Text>
                  </View>
                </View>
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
              <Text style = {{color:'#000',fontSize:16,fontWeight:'bold'}}>RS,{this.state.price}</Text>
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
                onPress = {()=>goBack()}>OK</Text>
            </View>
          </View>
        </AnimatedHideView>
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
          position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}
          visible = {this.state.error_screen}>
          <View style = {{width:'95%',height:'30%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',
            borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
            <Image style = {{width:60,height:60}}
              source = {require('../img/attention.png')}>
            </Image>
            <Text style = {{fontSize:22,fontWeight:'bold',color:'#000'}}>Oops!</Text>
            <View style = {{width:'95%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{fontSize:16,textAlign:'center'}}>There is an error occured while ordering your product.
                Please go back and check all the details and try again</Text>
            </View>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:10}}>
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
  }
})
