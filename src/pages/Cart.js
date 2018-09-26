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
  FlatList
} from 'react-native'
import config from '../API/config'
import GridView from 'react-native-super-grid'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-simple-toast'

const cartData = [];
var radio_props = [
  {label: 'Debit', value: 0 },
  {label: 'Credit', value: 1 },
  {label: 'Cash on Delivery', value: 2}
];
let mes = [];
export default class Cart extends Component<{}>{
  static navigationOptions = {
    header :null
  };
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
      emptyScreen : false,
      variation_id : '',
      movetowishScreen : false,
      var_id : '',
      removeScreen : false,
      mes : [],
      quantity : 1,
      localCartData : {},
      local_cart_name : '',
      local_cart_sale_price : '',
      local_cart_discount : '',
      local_cart_product_id : '',
      local_cart_vendor_id : '',
      local_cart_img : '',
      local_cart_view : false,
      local_cart_check : [],
      local_mes : []
    }
  }
  updateSize = (size) => {
    this.setState({
      size:size
    })
  };
  updateQty = (qty) => {
    this.setState({
      qty:qty
    })
  };
  getCartData(){
    this.setState({
      show : true
    });

    var totalPrize = 0;
    var url = config.API_URL+'user/viewCart';
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
            });
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
                vendor_id : data.vendor_id,
                mes : data.measurements,
                quantity : data.count
              });
              console.warn('cartData',cartData);
              this.setState({
                crtData:cartData
              });
              console.log('cccccccc',this.state.crtData);
              totalPrize = totalPrize+parseInt(data.variation_details.price)*data.count
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
        });
        this.getCartData();
        this.getAddress();
        this.syncCart();
      } else {
        this.getLocalCart();
      }
    } catch (error) {
    }
  }
  async getLocalCart(){
    var totalPrize = 0;
    try {
      const localCartData = await AsyncStorage.getItem('@MySuperCart:key');
      if (localCartData !== null) {
        this.setState({
          local_cart_check : JSON.parse(localCartData),
          local_cart_view : true
        });
        for (let data of this.state.local_cart_check) {
          totalPrize = totalPrize+parseInt(data.sale_price)
        }
        this.setState({
          total : totalPrize
        });
        console.log('local_cart_check---------->>>>>>',this.state.local_cart_check);
      } else {
        this.setState({
          emptyScreen : true
        })
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  async syncCart(){
    try {
      const localCartData = await AsyncStorage.getItem('@MySuperCart:key');
      if (localCartData !== null) {
        this.setState({
          local_cart_check : JSON.parse(localCartData),
          local_cart_view : false
        });
      }
    } catch (error) {
      // Error retrieving data
    }
    let Data = [];
    console.log('entered into SYNCART method............>>>>',this.state.local_cart_check);
    for (let data of this.state.local_cart_check){
      console.log('data..........????<<<<',data);
      Data.push({
        variation_id: data.product_id,
        vendor_id:data.vendor_id,
        count : 1,
        measurements : JSON.stringify(this.state.local_mes)
      })
    }
    console.log('SyncCartData......???????>>>>>>>>>>????????',JSON.stringify(Data));


    var url = config.API_URL+'user/syncCart';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(Data),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization' : this.state.access_token
      })
    })
     .then((response)=>response.json())
     .catch((error)=> console.warn("fetch error:",error))
     .then((response)=>{
       console.log('syncCartResponse////////',response);
     });
    this.getCartData();
    this._removeCartData();
  }
  async _removeCartData() {
    this.setState({
      local_cart_check : []
    });

    try {
      await AsyncStorage.removeItem('@MySuperCart:key');
    } catch (error) {
      console.warn(error.message);
    }
  }

  placeOrder(){
    this.setState({
      placeOrderScreen:false
    });
    console.warn('access_token',this.state.access_token);
    console.warn('user_address_id',this.state.user_address_id);
    console.warn('payment_method',this.state.payment_method);
    let checkOutData = {};
    checkOutData.currency = 'INR',
        checkOutData.address_id = this.state.user_address_id,
        checkOutData.payment_method = this.state.payment_method
    console.warn('checkOutData',checkOutData);
    var url = config.API_URL+'user/checkout';
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
  addqty(val,id){
    console.warn('val',val);
    console.warn('id',id);
    var url = config.API_URL+'product/updateCartCount/'+id+'/'+val;
    fetch(url,{
      method : 'PUT',
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
    });
    console.warn('variation_id',var_id);
    var url = config.API_URL+'product/removeCart/'+var_id;
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
            });
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
    });
    console.warn('variation_id',var_id);
    var url = config.API_URL+'user/cartToWishlist/'+var_id;
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
            });
            if (response.code == '200') {
              Toast.show('Product Moved To Wishlist', Toast.LONG);
              this.getCartData();
            }
            if (response.code == '409') {
              Toast.show('Product Already in Wishlist', Toast.LONG);
            }
          }
        })
  }
  render(){
    const {goBack} = this.props.navigation;
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
              <View style={{width:'100%'}}>
                <GridView
                    showsVerticalScrollIndicator={false}
                    items={this.state.crtData}
                    itemDimension={180}
                    renderItem={item=> (
                        <View style = {{width:'100%',height:350,elevation:2,backgroundColor:'#fff',borderWidth:1,borderColor:'#eee'}}>
                          <TouchableHighlight style = {{height:'100%',width:'100%'}}>
                            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                              <View style = {{width:'100%',height:'70%',alignItems:'center',justifyContent:'center'}}>
                                <TouchableHighlight style={{width:'100%',height:'100%'}}
                                                    underlayColor = 'transparent'
                                                    onPress = {()=>this.props.navigation.navigate('details',{
                                                      slug:item.slug,
                                                      img:item.image,
                                                      id:item.id,
                                                      vendor_id:item.vendor_id
                                                    })}>
                                  <Image style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                         source ={{uri:config.IMG_URL+item.image}}>
                                  </Image>
                                </TouchableHighlight>
                              </View>
                              <View style = {{width:'95%',height:'30%',alignItems:'center',justifyContent:'center'}}>
                                <Text style = {{color:'#595656',fontSize:12}}>{item.name}</Text>
                                <View style={{flexDirection:'row',width:'95%',marginTop:10,alignItems:'center'}}>
                                  <Text style={{marginRight: 10}}>Quantity</Text>
                                  <TextInput style={{height:40,width:40,borderColor:'#595656',borderWidth:1,marginLeft:10,fontSize:12}}
                                             underlineColorAndroid='transparent'
                                             maxLength={1}
                                             keyboardType='numeric'
                                             onChangeText = {(text_name)=>{
                                               if (text_name<6){
                                                 this.addqty(text_name,item.var_id)
                                               } else {
                                                 Toast.show('Only 5 allowed', Toast.LONG);
                                               }
                                             }}>
                                  </TextInput>
                                  <Text style={{fontSize:12,color:'#595656',marginLeft:10}}>{item.quantity}</Text>
                                </View>
                                <View style = {{width:'100%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginBottom:5,marginTop:5}}>
                                  <View style = {{flexDirection:'row'}}>
                                    <Image style = {{width:11,height:11,alignItems:'center',justifyContent:'center',resizeMode:'stretch',marginTop:4}}
                                           source = {require('../img/curr.png')}>
                                    </Image>
                                    <Text style = {{color:'#595656',marginLeft:2,fontSize:10}}>{item.price}</Text>
                                  </View>
                                  <TouchableHighlight underlayColor = 'transparent'
                                                      onPress = {()=>this.setState({var_id:item.var_id,movetowishScreen:true})}>
                                    <MaterialIcons
                                        name='favorite-border'
                                        size={22}
                                        style = {{color:'#800000'}}>
                                    </MaterialIcons>
                                  </TouchableHighlight>
                                  <TouchableHighlight underlayColor = 'transparent'
                                                      onPress = {()=>this.setState({removeScreen:true,var_id:item.var_id})}>
                                    <MaterialIcons
                                        name='delete'
                                        size={22}
                                        style = {{color:'#369'}}>
                                    </MaterialIcons>
                                  </TouchableHighlight>
                                </View>
                              </View>
                            </View>
                          </TouchableHighlight>
                        </View>
                    )}
                />

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
                                    onPress = {()=>this.props.navigation.navigate('cart_buy_now')}>
                  <Text style = {{fontSize:16,color:'#fff'}}>Place Order</Text>
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
                       source = {require('../img/dislike.png')}>
                </Image>
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
            <View style = {{width:'100%',height:'92%',justifyContent:'center',alignItems:'center'}}>
              <Image style = {{height:60,width:60,alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                     source = {require('../img/emptyCart.png')}>
              </Image>
              <Text style = {{marginTop:20,color:'#369'}}>Cart is Empty</Text>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
            position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}
                            visible={this.state.placeOrderScreen}>
            <View style = {{width:'95%',height:'40%',alignItems:'center',justifyContent:'center',
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
                <View style = {{width:'50%'}}>
                </View>
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
                <View>
                </View>
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
                <View>

                </View>
                <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                      onPress = {()=>this.setState({placeorder_error_screen : false})}>OK</Text>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
                            visible = {this.state.movetowishScreen}>
            <View style = {{backgroundColor:'rgba(00,00,00,0.7)',borderBottomRightRadius:6,borderBottomLeftRadius:6,borderTopLeftRadius:6,
              borderTopRightRadius:6,width:'95%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{fontSize:18,fontWeight:'bold',color:'#fff',marginTop:30,marginLeft:10}}>Do u really wants move this product to wish list ?</Text>
              <View style = {{width:'100%',marginTop:20,marginBottom:10,flexDirection:'row'}}>
                <View style = {{width:'60%'}}></View>
                <View style = {{width:'40%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                  <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                        onPress = {()=>this.setState({movetowishScreen:false})}>No</Text>
                  <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                        onPress = {()=>this.movToWishlist(this.state.var_id)}>Yes</Text>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
                            visible = {this.state.removeScreen}>
            <View style = {{backgroundColor:'rgba(00,00,00,0.7)',borderBottomRightRadius:6,borderBottomLeftRadius:6,borderTopLeftRadius:6,
              borderTopRightRadius:6,width:'95%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{fontSize:18,fontWeight:'bold',color:'#fff',marginTop:30,marginLeft:10}}>Do u really wants remove the product ?</Text>
              <View style = {{width:'100%',marginTop:20,marginBottom:10,flexDirection:'row'}}>
                <View style = {{width:'60%'}}></View>
                <View style = {{width:'40%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                  <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                        onPress = {()=>this.setState({removeScreen:false})}>No</Text>
                  <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                        onPress = {()=>this.removeFromCart(this.state.var_id)}>Yes</Text>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style={{width:'100%',height:'100%',position:'absolute',alignItems:'center',justifyContent:'center',backgroundColor:'#eee'}}
              visible={this.state.local_cart_view}>
            <View style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style={{height:'8%',width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:'#282a2d'}}>
                <View style={{height:'100%',width:'10%',alignItems:'center',justifyContent:'center'}}>
                  <TouchableHighlight underlayColor = 'transparent'
                                      onPress = {()=>goBack()}>
                    <MaterialIcons
                        name='arrow-back'
                        size={22}
                        style = {{color:'#fff'}}>
                    </MaterialIcons>
                  </TouchableHighlight>
                </View>
                <View style={{height:'100%',width:'80%',alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Garden Store</Text>
                </View>
                <View style={{height:'100%',width:'10%',alignItems:'center',justifyContent:'center'}}>
                </View>
              </View>
              <View style={{height:'92%',width:'100%'}}>
                <ScrollView>
                  <View style={{width:'100%'}}>
                    <GridView
                        showsVerticalScrollIndicator={false}
                        items={this.state.local_cart_check}
                        itemDimension={180}
                        renderItem={item=> (
                            <View style = {{width:'100%',height:320,elevation:2,backgroundColor:'#fff',borderWidth:1,borderColor:'#eee'}}>
                              <TouchableHighlight style = {{height:'100%',width:'100%'}}>
                                <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                                  <View style = {{width:'100%',height:'70%',alignItems:'center',justifyContent:'center'}}>
                                    <TouchableHighlight style={{width:'100%',height:'100%'}}
                                                        underlayColor = 'transparent'
                                                        onPress = {()=>this.props.navigation.navigate('details',{
                                                          slug:item.slug,
                                                          img:item.header_image,
                                                          id:item.product_id,
                                                          vendor_id:item.vendor_id
                                                        })}>
                                      <Image style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                             source ={{uri:config.IMG_URL+item.header_image}}>
                                      </Image>
                                    </TouchableHighlight>
                                  </View>
                                  <View style = {{width:'95%',height:'30%',alignItems:'center',justifyContent:'center'}}>
                                    <Text style = {{color:'#595656',fontSize:12}}>{item.product_name}</Text>
                                    <View style = {{width:'100%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginBottom:5,marginTop:5}}>
                                      <View style = {{flexDirection:'row',marginLeft:10}}>
                                        <Image style = {{width:11,height:11,alignItems:'center',justifyContent:'center',resizeMode:'stretch',marginTop:4}}
                                               source = {require('../img/curr.png')}>
                                        </Image>
                                        <Text style = {{color:'#595656',marginLeft:2,fontSize:12,}}>{item.sale_price}</Text>
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </TouchableHighlight>
                            </View>
                        )}
                    />

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
                                        onPress = {()=>this.props.navigation.navigate('sync_login')}>
                      <Text style = {{fontSize:16,color:'#fff'}}> login & Place Order</Text>
                    </TouchableHighlight>
                  </View>
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
});
