import React,{Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableHighlight,
  Picker,
  ScrollView,
  AsyncStorage,
  BackHandler,
  TextInput,
  FlatList, StatusBar
} from 'react-native'
import config from '../API/config'
import GridView from 'react-native-super-grid'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-simple-toast'
import ImageSlider from "react-native-image-slider";

const cartData = [];
var radio_props = [
  {label: 'Debit', value: 0 },
  {label: 'Credit', value: 1 },
  {label: 'Cash on Delivery', value: 2}
];
let mes = [];
let Maindata = [];
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
      local_cart : false
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
      } else {
        // this.localCart();
      }
    } catch (error) {
    }
  }
  // async localCart(){
  //   this.setState({
  //     local_cart : true
  //   });
  //   var totalPrize = 0;
  //   try {
  //     const localCartData = await AsyncStorage.getItem('@MySuperCart:key');
  //     console.log('localcartData',localCartData);
  //     if (localCartData) {
  //       console.warn(JSON.parse(localCartData));
  //        Maindata = JSON.parse(localCartData);
  //        cartData.length = 0;
  //        mes.length = 0;
  //       for (let data of Maindata){
  //         mes = data.measurements;
  //         console.warn('data.......',data);
  //         cartData.push({
  //           name:data.product_name,
  //           price:data.sale_price,
  //           image:data.header_image,
  //           slug : data.slug,
  //           id : data.product_id,
  //           vendor_id : data.vendor_id,
  //           mes : mes
  //         });
  //         totalPrize = totalPrize+parseInt(data.sale_price);
  //         console.warn('>>>>>>>>>>>>>>><<<<<<<<<<<<<<',mes);
  //
  //       }
  //       this.setState({
  //         total : totalPrize
  //       })
  //     } else {
  //       this.setState({
  //         emptyScreen : true,
  //         local_cart : false
  //       })
  //     }
  //   } catch (error) {
  //     // Error retrieving data
  //   }
  // }
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
        <View style = {{width:'100%',height:'100%'}}>
          <View style = {styles.container}>
            <StatusBar
                translucent = {false}
                barStyle="light-content"
                backgroundColor='#191a1c'
            />
            <View style = {styles.toolbar}>
              <View style = {styles.menuView}>
                <TouchableHighlight underlayColor = 'transparent'
                                    onPress = {()=>this.props.navigation.openDrawer()}>
                  <MaterialIcons
                      name='menu'
                      size={22}
                      style = {{color:'#fff'}}>
                  </MaterialIcons>
                </TouchableHighlight>
              </View>
              <View style = {styles.textView}>
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>GardenStore</Text>
              </View>
              <View style = {styles.wishlistView}>
                <TouchableHighlight underlayColor = 'transparent'
                                    onPress = {()=>this.setState({search_container_style:60})}>
                  <MaterialIcons
                      name='search'
                      size={22}
                      style = {{color:'#fff'}}>
                  </MaterialIcons>
                </TouchableHighlight>
              </View>
              <View style = {styles.cartView}>
                <TouchableHighlight underlayColor = 'transparent'
                                    onPress = {()=>this.props.navigation.navigate('add_to_cart')}>
                  <MaterialIcons
                      name='shopping-cart'
                      size={22}
                      style = {{color:'#fff'}}>
                  </MaterialIcons>
                </TouchableHighlight>
              </View>
              <View style = {styles.walletView}>
                <TouchableHighlight underlayColor = 'transparent'
                                    onPress = {()=>this.props.navigation.navigate('wallet')}>
                  <MaterialIcons
                      name='payment'
                      size={20}
                      style = {{color:'#fff'}}>
                  </MaterialIcons>
                </TouchableHighlight>
              </View>
            </View>
            <View style = {{width:'100%',height:this.state.search_container_style,backgroundColor:'#282a2d',alignItems:'center',justifyContent:'center'}}>
              <View style = {{width:'95%',height:'80%',alignItems:'center',justifyContent:'space-between',backgroundColor:'#eee',flexDirection:'row'}}>
                <View style = {{width:'85%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                  <TextInput style = {{height:'95%',width:'95%',fontSize:14,color:'#000'}}
                             placeholder = 'Search'
                             placeholderTextColor = '#bbb'
                             underlineColorAndroid = 'transparent'
                             onChangeText = {(text_search) => this.updateValue(text_search,'search')}>
                  </TextInput>
                </View>
                <View style = {{width:'15%',height:'100%',backgroundColor:'#2fdab8'}}>
                  <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                                      underlayColor = 'transparent'
                                      onPress = {()=>this.goToSearch()}>
                    <MaterialIcons
                        name='search'
                        size={26}
                        style = {{color:'#fff'}}>
                    </MaterialIcons>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
            <View style = {{width:'100%',height:'92%',alignItems:'center',justifyContent:'center'}}>
              <ScrollView style = {{marginBottom:5,width:'100%'}}
                          showsVerticalScrollIndicator = {false}>
                <View style = {styles.scrollContainer}>
                  <View style = {styles.baseContainer}>
                    <View style = {styles.headerImage}>
                      <ImageSlider
                          style = {{height:"100%",width:'100%'}}
                          autoPlayWithInterval={3000}
                          images={sliderData}
                          customSlide={({ index, item, style, width }) => (
                              <View key={index} style={[style, styles.customSlide]}>
                                <Image source={{uri:config.IMG_URL+item.image}} style={styles.customImage} />
                              </View>
                          )}
                          customButtons={(position, move) => (
                              <View style={styles.buttons}>
                                {sliderData.map((image, index) => {
                                  return (
                                      <TouchableHighlight
                                          key={index}
                                          underlayColor="#ccc"
                                          onPress={() => move(index)}
                                          style={styles.button}>
                                        <View style={position === index && styles.buttonSelected}>
                                        </View>
                                      </TouchableHighlight>
                                  );
                                })}
                              </View>
                          )}
                      />
                      <AnimatedHideView visible={this.state.color_check_screen}
                                        style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}>
                        <View style={{height:'85%',width:'100%'}}>
                        </View>
                        <View style={{height:'15%',width:'100%',flexDirection:'row'}}>
                          <View style={{width:'80%'}}>
                          </View>
                          <View style={{width:'20%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                            <View style={{height:40,width:40,alignItems:'center',justifyContent:'center',borderRadius:40/2,backgroundColor:'#fff',
                              elevation:2,borderColor: '#eee',borderWidth:1}}>
                              <TouchableHighlight style={{height:'70%',width:'70%',alignItems:'center',justifyContent:'center'}}
                                                  underlayColor='transparent'
                                                  onPress = {()=>this.SelectedSpec()}>
                                <Image style = {{width:'80%',height:'80%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source = {require('../img/rgb.png')}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                          </View>
                        </View>
                      </AnimatedHideView>
                    </View>
                    {/*<View style = {styles.gridContainer}>*/}
                    {/*<GridView*/}
                    {/*itemDimension={90}*/}
                    {/*spacing = {2}*/}
                    {/*items={this.state.menu_data}*/}
                    {/*renderItem={item => (*/}
                    {/*<View style={{width:100,height:40,elevation: 2}}>*/}
                    {/*<TouchableHighlight style = {{height:'100%',width:'100%',backgroundColor:'#2fdab8'}}*/}
                    {/*underlayColor = 'transparent'*/}
                    {/*onPress = {()=>this.props.navigation.navigate('shop',{name:item.name})}>*/}
                    {/*<View style = {{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>*/}
                    {/*<Text style = {{color:'#fff',fontWeight:'bold'}}>{item.name}</Text>*/}
                    {/*</View>*/}
                    {/*</TouchableHighlight>*/}
                    {/*</View>*/}
                    {/*)}*/}
                    {/*/>*/}
                    {/*</View>*/}

                    <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                      <GridView
                          itemDimension = {360}
                          items = {CMS_layout}
                          spacing = {1}
                          renderItem = {item =>
                              <View style={{width:'100%',elevation:2}}>
                                {item.value}
                              </View>
                          }
                      />
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
            <Spinner visible = {this.state.show}
                     textContent = {"Loading..."}
                     textStyle = {{color: '#369'}}
                     color = {'#369'}
                     overlayColor = {'#fff'}
            />
          </View>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',
            backgroundColor:'rgba(00, 00, 00, 0.4)'}}
                            visible = {this.state.visible}>
            <View style = {{width:'90%',backgroundColor:'rgba(00, 00, 00, 0.8)',alignItems:'center',justifyContent:'center',
              borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
              <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold',marginTop:30}}>Wants to exit your application?</Text>
              <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:40,marginBottom:20}}>
                <View style = {{width:'50%'}}></View>
                <View style = {{width:'50%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                  <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                        onPress = {()=>this.setState({visible:false})}>Not now</Text>
                  <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                        onPress = {()=>this.kickOut()}>Exit</Text>
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

