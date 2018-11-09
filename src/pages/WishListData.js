import React,{Component} from 'react'
import {View,
        Text,
        StyleSheet,
        Image,
        TouchableHighlight,
        Picker,
        ScrollView,
        AsyncStorage,
        BackHandler
  } from 'react-native'
import config from '../API/config'
import GridView from 'react-native-super-grid'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-simple-toast'

const W_data = [];
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
      WishListData : [],
      size:'',
      error_screen : false,
      total : 0,
      success_screen : false,
      show : false,
      emptyScreen : false,
      variation_id : '',
      product_id : '',
      user_id : '',
      product_name : '',
      prize : '',
      discount : '',
      img : '',
      stock : '',
      vendor_id : '',
      movetocartScreen:false,
      removeScreen:false
    }
  }
  getW_data(){
    this.setState({
      show : true
    })
    var totalPrize = 0
    var url = config.API_URL+'user/viewWishlist'
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
      if (response.data) {
        this.setState({
          show : false
        })
        W_data.length = 0;
        if (response.data.data) {
          for(let data of response.data.data){
            W_data.push({
              product_id : data.id,
              user_id : data.user_id,
              variation_id : data.variation_id,
              product_name : data.variation_detail.name,
              prize : data.variation_detail.sale_price,
              discount : data.variation_detail.total_discount,
              img : data.variation_detail.variation_image_single.variation_image,
              stock : data.variation_detail.stock,
              vendor_id : data.variation_detail.vendor_id,
              id : data.id,
              slug : data.variation_detail.slug
            })
            this.setState({
              WishListData:W_data
            })
            console.warn('WishListData',this.state.WishListData);
          }
        }
      } else {
        console.warn('array is empty');
        this.setState({
          show : false,
          emptyScreen : true
        })
      }
      if (response.data.length<1){
        this.setState({
          show : false,
          emptyScreen : true
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
        this.getW_data();
      } else {
        this.setState({
          error_screen : true
          })
        }
      } catch (error) {
    }
  }

  componentWillMount(){
    this._getAccessToken();
  }
  removeFromWishList(p_id){
    this.setState({
      show:true,
      removeScreen:false
    })
    console.warn('variation_id',p_id);
    var url = config.API_URL+'user/wishlistCreate/'+p_id;
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
      this.setState({
        show : false
      })
      if (response.code=='200') {
        Toast.show('Product Removed From Wishlist', Toast.LONG);
        this.getW_data();
      }
    })
  }
  movToCart(var_id,v_id){
    this.setState({
      show:true,
      movetocartScreen:false
    })
    console.warn('variation_id',var_id);
    console.warn('variation_id....',v_id);
    var url = config.API_URL+'user/wishlistToCart/'+var_id+'/'+v_id
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
            Toast.show('Product Moved To Cart', Toast.LONG);
            this.getW_data();
         }
         if (response.code == '409') {
           Toast.show(response.message, Toast.LONG);
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
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Wish List</Text>
              </View>
            </View>
            <ScrollView
              showsVerticalScrollIndicator = {false}>
              <View>
                <GridView
                  showsVerticalScrollIndicator={false}
                  itemDimension={150}
                  items={this.state.WishListData}
                  renderItem={item => (
                    <View style = {{width:'100%',height:300,elevation:2,backgroundColor:'#fff'}}>
                      <TouchableHighlight style = {{height:'100%',width:'100%'}}
                        underlayColor = 'transparent'
                        onPress = {()=>this.props.navigation.navigate('details',{
                          slug:item.slug,
                          img:item.img,
                          id:item.id,
                          vendor_id:item.vendor_id
                        })}>
                        <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                          <View style = {{width:'100%',height:'75%',alignItems:'center',justifyContent:'center'}}>
                            <Image style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                              source ={{uri:config.IMG_URL+item.img}}>
                            </Image>
                          </View>
                          <View style = {{width:'95%',height:'25%',alignItems:'center',justifyContent:'center'}}>
                            <Text style = {{color:'#595656',fontSize:12}}>{item.product_name}</Text>
                            <View style = {{width:'100%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginBottom:5,marginTop:5}}>
                              <View style = {{flexDirection:'row'}}>
                                <Image style = {{width:11,height:11,alignItems:'center',justifyContent:'center',resizeMode:'stretch',marginTop:4}}
                                  source = {require('../img/curr.png')}>
                                </Image>
                                <Text style = {{color:'#595656',marginLeft:2,fontSize:10}}>{item.prize}</Text>
                              </View>
                              <TouchableHighlight underlayColor = 'transparent'
                                onPress = {()=>this.setState({variation_id:item.variation_id,vendor_id:item.vendor_id,movetocartScreen:true})}>
                                <MaterialIcons
                                  name='add-shopping-cart'
                                  size={22}
                                  style = {{color:'#369'}}>
                                </MaterialIcons>
                              </TouchableHighlight>
                              <TouchableHighlight underlayColor = 'transparent'
                                onPress = {()=>this.setState({removeScreen:true,variation_id:item.variation_id})}>
                                <MaterialIcons
                                  name='delete'
                                  size={22}
                                  style = {{color:'#800000'}}>
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
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Wish List</Text>
              </View>
            </View>
            <View style = {{width:'100%',height:'92%'}}>
              <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Image style = {{width:80,height:80,alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                  source = {require('../img/dislike.png')}>
                </Image>
                  <Text style = {{fontSize:30,color:'#000',marginTop:10}}>Oops!</Text>
                  <Text style = {{fontSize:18,marginTop:20,textAlign:'center'}}>Seems like you are not a member here</Text>
                  <Text style = {{fontSize:18,textAlign:'center'}}>Your Attempt has failed.</Text>
                  <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                    <Text style = {{fontSize:16,marginTop:20}}>Already have an account ?</Text>
                    <Text style = {{color:'#369',marginLeft:10,fontSize:16,marginTop:20}}
                      onPress = {()=>this.props.navigation.navigate('logn',{page : 'mainscreen',next : 'wishList'})}>Login Here</Text>
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
              <View style={{width:'70%',height:'40%',alignItems:'center',justifyContent:'center',marginBottom:10}}>
                <Image style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                       source = {require('../img/productempty.png')}>
                </Image>
              </View>
              <View style = {{width:'42%',height:'6%',backgroundColor:'#282a2d',elevation:2,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#fff'}}
                      onPress = {()=>this.props.navigation.navigate('mainscreen')}>Continue Shopping</Text>
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
          <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
            visible = {this.state.removeScreen}>
            <View style = {{backgroundColor:'#282a2d',width:'95%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{fontSize:16,fontWeight:'bold',color:'#fff',marginTop:30}}>Do u really wants remove the product ?</Text>
              <View style = {{width:'100%',marginTop:20,marginBottom:10,flexDirection:'row'}}>
                <View style = {{width:'60%'}}></View>
                <View style = {{width:'40%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                  <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                    onPress = {()=>this.setState({removeScreen:false})}>No</Text>
                  <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                    onPress = {()=>this.removeFromWishList(this.state.variation_id)}>Yes</Text>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
            visible = {this.state.movetocartScreen}>
            <View style = {{backgroundColor:'#282a2d',width:'95%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{fontSize:18,fontWeight:'bold',color:'#fff',marginTop:30}}>Do u really wants move the product to cart ?</Text>
              <View style = {{width:'100%',marginTop:20,marginBottom:10,flexDirection:'row'}}>
                <View style = {{width:'60%'}}></View>
                <View style = {{width:'40%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                  <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                    onPress = {()=>this.setState({movetocartScreen:false})}>No</Text>
                  <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                    onPress = {()=>this.movToCart(this.state.variation_id,this.state.vendor_id)}>Yes</Text>
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
})
