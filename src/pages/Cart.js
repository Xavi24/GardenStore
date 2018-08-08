import React,{Component} from 'react'
import {View,Text,StyleSheet,Image,TouchableHighlight,Picker,ScrollView,AsyncStorage} from 'react-native'
import config from '../API/config'
import GridView from 'react-native-super-grid'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import Spinner from 'react-native-loading-spinner-overlay'

const cartData = [];
var radio_props = [
  {label: 'Debit', value: 0 },
  {label: 'Credit', value: 1 },
  {label: 'Cash on Delivery', value: 2}
];
export default class Cart extends Component<{}>{
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
      emptyScreen : false
    }
  }
  updateSize = (size) => {
    this.setState({
      size:size
    })
  }
  updateQty = (qty) => {
    this.setState({
      qty:qty
    })
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
    console.warn('cartResponse--->>>',response);
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
            stock:data.variation_details.stock
          })
          this.setState({
            crtData:cartData
          })
          totalPrize = totalPrize+parseInt(data.variation_details.price)
        }
        this.setState({
          total : totalPrize
        })
      } else {
        console.warn('array is empty');
        this.setState({
          show : false,
          emptyScreen : true
        })
      }
    })
  }
  getAddress(){
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
        for(let data of response.data){
          this.setState({
            user_address_id : data.user_address_id,
          })
        }
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
    checkOutData.payment_method = this.state.payment_method
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
      console.warn('response',response);
      if (response.code == '200') {
        this.setState({
          success_screen : true
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
            <ScrollView
              showsVerticalScrollIndicator = {false}>
              <View style = {{alignItems:'center',justifyContent:'center'}}>
                <GridView
                  showsVerticalScrollIndicator={false}
                  itemDimension={360}
                  items={this.state.crtData}
                  renderItem={item => (
                    <View style ={styles.gridContainer}>
                      <View style = {styles.gridHeaderView}>
                        <View style = {styles.imageView}>
                          <Image style = {styles.image}
                            source ={{uri:config.IMG_URL+item.image}}>
                          </Image>
                        </View>
                        <View style = {styles.contentView}>
                          <Text style = {{color:'#369',fontSize:18,fontWeight:'bold',marginTop:5}}>{item.name}</Text>
                          <View style = {{flexDirection:'row'}}>
                            <Text style = {styles.textMain}>Sold by : </Text>
                            <Text style = {styles.text}>WanWagon</Text>
                          </View>
                          <View style = {{flexDirection:'row',marginTop:20}}>
                            <Text style = {styles.textMain}>RS.</Text>
                            <Text style = {styles.textPrice}>{item.price}</Text>
                          </View>
                        </View>
                      </View>
                      <View style = {styles.gridFooterView}>
                        <View style = {styles.leftFooter}>
                          <Text style = {{color:'#363a42',fontSize:16,fontWeight:'bold'}}>REMOVE</Text>
                        </View>
                        <View style = {styles.rightFooter}>
                          <Text style = {{color:'#369',fontSize:16,fontWeight:'bold'}}>MOVE TO WISHLIST</Text>
                        </View>
                      </View>
                    </View>
                    )}
                  />
                <View style = {{width:'100%',padding:15}}>
                  <Text style = {{fontSize:16}}>PRICE DETAILS</Text>
                </View>
                <View style = {styles.detailsView}>
                    <View style = {{flexDirection:'row',width:'100%',justifyContent:'space-between',padding:5}}>
                      <Text style = {{fontSize:16}}>Total</Text>
                      <View style = {{flexDirection:'row'}}>
                        <Text style = {{fontSize:16}}>Rs.</Text>
                        <Text style = {{fontSize:16}}>19,389</Text>
                      </View>
                    </View>
                    <View style = {{flexDirection:'row',width:'100%',justifyContent:'space-between',padding:5}}>
                      <Text style = {{fontSize:16}}>Discount</Text>
                      <View style = {{flexDirection:'row'}}>
                        <Text style = {{fontSize:16}}>Rs.</Text>
                        <Text style = {{fontSize:16,color:'#0cb038'}}>19,89</Text>
                      </View>
                    </View>
                    <View style = {{flexDirection:'row',width:'100%',justifyContent:'space-between',padding:5}}>
                      <Text style = {{fontSize:16}}>Sub Total</Text>
                      <View style = {{flexDirection:'row'}}>
                        <Text style = {{fontSize:16}}>Rs.</Text>
                        <Text style = {{fontSize:16}}>19,389</Text>
                      </View>
                    </View>
                    <View style = {{flexDirection:'row',width:'100%',justifyContent:'space-between',padding:5}}>
                      <Text style = {{fontSize:16}}>Estimated Tax</Text>
                      <View style = {{flexDirection:'row'}}>
                        <Text style = {{fontSize:16}}>Rs.</Text>
                        <Text style = {{fontSize:16}}>389</Text>
                      </View>
                    </View>
                    <View style = {{flexDirection:'row',width:'100%',justifyContent:'space-between',padding:5}}>
                      <Text style = {{fontSize:16}}>Delivery</Text>
                      <View style = {{flexDirection:'row'}}>
                        <Text style = {{fontSize:16,color:'#0cb038'}}>FREE</Text>
                      </View>
                    </View>
                    <View style = {{flexDirection:'row',width:'100%',justifyContent:'space-between',padding:5,marginTop:20}}>
                      <Text style = {{fontSize:18,fontWeight:'bold',color:'#000'}}>Total Payable</Text>
                      <View style = {{flexDirection:'row'}}>
                        <Text style = {{fontSize:18,fontWeight:'bold',color:'#000'}}>Rs.</Text>
                        <Text style = {{fontSize:18,color:'#000',fontWeight:'bold'}}>19,893</Text>
                      </View>
                    </View>
                </View>
              </View>
            </ScrollView>
            <View style = {styles.footer}>
              <View style = {{width:'50%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <Text style = {{fontSize:16,color:'#363a42',fontWeight:'bold'}}>RS.</Text>
                <Text style = {{fontSize:16,color:'#363a42',fontWeight:'bold'}}>{this.state.total}</Text>
              </View>
              <View style = {{width:'48%',height:'70%',borderTopLeftRadius:6,borderTopRightRadius: 6,
                borderBottomLeftRadius:6,borderBottomRightRadius:6, backgroundColor:'#48c7f0',
                alignItems:'center',justifyContent:'center'}}>
                <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.setState({placeOrderScreen:true})}>
                  <Text style = {{fontSize:16,color:'#fff'}}>Buy</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <AnimatedHideView
            visible = {this.state.error_screen}
            style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',backgroundColor:'#fff'}}>
            <View style = {styles.toolbar}>
              <TouchableHighlight underlayColor = 'transparent'
                onPress = {()=>{this.props.navigation.navigate('mainscreen')}}>
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
            <View style = {{width:'100%',height:'92%'}}>
              <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Image style = {{width:80,height:80,alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                  source = {require('../img/dislike.png')}></Image>
                  <Text style = {{fontSize:30,color:'#000',marginTop:10}}>Oops!</Text>
                  <Text style = {{fontSize:18,marginTop:20,textAlign:'center'}}>Seems like you are note a member here</Text>
                  <Text style = {{fontSize:18,textAlign:'center'}}>Your Attempt has failed. An error has occured, back and try again</Text>
                  <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                    <Text style = {{fontSize:16,marginTop:20}}>Already have an account ?</Text>
                    <Text style = {{color:'#369',marginLeft:10,fontSize:16,marginTop:20}}
                      onPress = {()=>this.props.navigation.navigate('logn')}>Login Here</Text>
                  </View>
                  <Text style = {{marginTop:10,marginBottom:10}}>OR</Text>
                  <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                    <Text style = {{fontSize:16}}>Dont have any account ?</Text>
                    <Text style = {{color:'#369',marginLeft:10,fontSize:16}}
                      onPress = {()=>this.props.navigation.navigate('reg')}>Register Here</Text>
                  </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{width:'100%',height:'100%',justifyContent:'center',position:'absolute',backgroundColor:'#fff'}}
            visible = {this.state.emptyScreen}>
            <View style = {styles.toolbar}>
              <TouchableHighlight underlayColor = 'transparent'
                onPress = {()=>{this.props.navigation.navigate('mainscreen')}}>
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
            <View style = {{width:'100%',height:'92%',justifyContent:'center',alignItems:'center'}}>
              <Image style = {{height:60,width:60,alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                source = {require('../img/emptyCart.png')}></Image>
              <Text style = {{marginTop:20,color:'#369'}}>Cart is Empty</Text>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
            position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}
            visible={this.state.placeOrderScreen}>
            <View style = {{width:'95%',height:'40%',backgroundColor:'100%',alignItems:'center',justifyContent:'center',
              borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6,backgroundColor:"#fff"}}>
              <Text style = {{color:'#000',fontWeight:'bold',fontSize:20,textAlign:'center'}}>Are you sure you want to buy these product?</Text>
              <View style = {{width:'95%'}}>
                <Text style = {{marginTop:30,fontSize:16,fontWeight:'bold',marginBottom:10}}>Choose your payment method</Text>
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
              <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:30}}>
                <View style = {{width:'50%'}}></View>
                <View style = {{width:'50%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                  <Text style = {{color:'#369',fontSize:18,fontWeight:'bold'}}
                    onPress = {()=>this.placeOrder()}>Proceed</Text>
                  <Text style = {{color:'#800000',fontSize:18,fontWeight:'bold'}}
                    onPress = {()=>this.setState({placeOrderScreen:false})}>Cancel</Text>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
            backgroundColor:'rgba(00, 00, 00, 0.7)',position:'absolute'}}
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
                  onPress = {()=>this.props.navigation.navigate('mainscreen')}>OK</Text>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
            position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}
            visible = {this.state.placeorder_error_screen}>
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
                  onPress = {()=>this.setState({placeorder_error_screen : false})}>OK</Text>
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
    width:'100%',
    height:'100%',
    backgroundColor:'#eeeeee'
  },
  gridContainer:{
    width:'100%',
    height:200,
    backgroundColor:'#fff',
    padding:5,
    borderTopLeftRadius:6,
    borderTopRightRadius:6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6,
    borderWidth:1,
    borderColor:'#cccccc'
  },
  gridHeaderView:{
    width:'100%',
    height:'80%',
    flexDirection:'row'
  },
  gridFooterView:{
    width:'100%',
    height:'20%',
    padding:5,
    borderTopColor:'#cccccc',
    borderTopWidth:1,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  leftFooter:{
    width:'50%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  rightFooter:{
    width:'50%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    borderLeftColor:'#cccccc',
    borderLeftWidth:1
  },
  imageView:{
    width:'40%',
    height:'100%',
  },
  contentView:{
    width:'60%',
    height:'100%',
    paddingLeft:5
  },
  image:{
    width:'100%',
    height:'80%',
    alignItems:'center',
    justifyContent:'center',
    resizeMode:'stretch'
  },
  textMain:{
    fontSize:16,
    color:'#363a42',
    fontWeight:'bold'
  },
  text:{
    fontSize:16,
    color:'#000',
    marginLeft:5,
    fontWeight:'bold'
  },
  dropdown:{
    width:'100%',
    height:'100%',
    position:'absolute',
    backgroundColor:'rgba(00, 00, 00, 0.5)',
    alignItems:'center',
    justifyContent:'center',
    padding:50
  },
  textPrice:{
    color:'#0cb038',
    fontSize:16,
    marginLeft:5,
    fontWeight:'bold'
  },
  detailsView:{
    width:'95%',
    backgroundColor:'#fff',
    padding:5,
    borderTopLeftRadius:6,
    borderTopRightRadius:6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6,
    borderWidth:1,
    borderColor:'#cccccc',
    marginBottom:20
  },
  footer:{
    width:'100%',
    height:60,
    backgroundColor:'#fff',
    elevation:3,
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  toolbar:{
    height:'8%',
    width:'100%',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
    flexDirection:'row',
    backgroundColor:'#282a2d'
  }
})
