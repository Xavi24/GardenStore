import React,{Component} from 'react'
import {View,
  Text,
  Image,
  TouchableHighlight,
  StatusBar,
  ScrollView,
  StyleSheet,
  ListView,
  TextInput,
  AsyncStorage,
  BackHandler,
  FlatList
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import LinearGradient from 'react-native-linear-gradient'
import config from '../API/config'
import Swiper from 'react-native-swiper'
import GridView from 'react-native-super-grid'
import Spinner from 'react-native-loading-spinner-overlay'
import AnimatedHideView from 'react-native-animated-hide-view'
import ImageSlider from 'react-native-image-slider'
import Stars from 'react-native-stars-rating'
import StarRating from 'react-native-star-rating'
import Toast from 'react-native-simple-toast'

let count = 1;
let p_specs_container = [];
let p_spec_variation_container = [];
let measures = [];
let var_spec_data = [];
let slug_check_array = [];
export default class SelectDetails extends Component<{}>{
  static navigationOptions = {
    header : null
  };
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      slug : '',
      header_image : '',
      is_in_cart : '',
      is_in_wishlist : '',
      has_bought : false,
      prize : '',
      product_note : '',
      brand : '',
      product_rating : '',
      product_name : '',
      slider_Images: [],
      show_fav : true,
      show_cart : true,
      product_id : '',
      vendor_id : '',
      product_details : '',
      ratingView : false,
      review : '',
      myrating : 1,
      starCount : 0,
      startShowCount : 0,
      feedback: 'Poor',
      customButton : false,
      spec : [],
      spec_variation : [],
      product_meassurment_id : '',
      name : '',
      description : '',
      video : '',
      measurementData : [],
      show : false,
      custom_nav_data : [],
      login_cnfrm_screen : false,
      rating_Success : true,
      out_of_stock_screen : false,
      out_of_stock_screen_temp : false,
      customising_screen : false,
      Data : [],
      measurements : [],
      cart_text : 'Add To Cart',
      discount : '',
      sale_price : '',
      p_color : '#369',
      d_color : '#360',
      emptyScreen : false,
      show_rate : false,
      rate_view_width:'25%',
      rate_icon_size:22,
      rate_text_size :12,
      slug_check_Data : [],
      cardViewBorder : '#a09f9f',
      cardBorder : 1,
      des_screen : false
    }
  }
  addMyrating(rating){
    count = rating
    this.fetchRating()
  }
  fetchRating(){
    if (count == '1') {
      this.setState({
        feedback : 'Poor'
      })
    } else if (count == '2') {
      this.setState({
        feedback : 'Good'
      })
    } else if (count == '3') {
      this.setState({
        feedback : 'Very Good'
      })
    } else if (count == '4') {
      this.setState({
        feedback : 'Awsome'
      })
    } else if (count == '5') {
      this.setState({
        feedback : 'Excellent'
      })
    }
  }
  addReview(){
    let Data = {};
    Data.value = count,
        Data.title = this.state.feedback,
        Data.review = this.state.review,
        Data.variation_id = this.state.product_id
    var url = config.API_URL+'product/addReview'
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(Data),
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
            ratingView : false
          })
        })
  }
  ViewReview(){
    var url = config.API_URL+'product/my-review/'+this.state.product_id
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
          if (response.code!=null) {


          }
        })
  }
  updateValue(text,field){
    if (field == 'comment') {
      this.setState({
        review : text
      })
    }
  }

  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      console.warn('value',value);
      if (value !== null) {
        this.setState({
          access_token : value
        });
        this.getDetails();
      } else {
        this.getDetails();
      }
    } catch (error) {
      console.warn('error',error.message);
    }
  }
  getAddressDetails(){
    // console.warn('getAddressDetails product_id',this.state.product_id);
    // console.warn('getAddressDetails vendor_id',this.state.vendor_id);
    var url = config.API_URL+'userAddresses';
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
          console.log('GetAddressResponse',response);
          if (response.data!= '') {
            this.props.navigation.navigate('buy_now',{
              product_name:this.state.product_name,
              prize:this.state.prize,
              img:this.state.header_image,
              product:this.state.product_id,
              vendor:this.state.vendor_id,
              measurements : this.state.measurements,
              slug : this.state.slug,
              spec : this.state.spec
            })
          }
          else {
            this.props.navigation.navigate('add_address',{
              product_name:this.state.product_name,
              prize:this.state.prize,
              img:this.state.header_image,
              product:this.state.product_id,
              vendor:this.state.vendor_id,
              measurements : this.state.measurements
            })
          }
        })
  }
  updateValue1(text,field,name,index){
    console.warn('text',text);
    console.warn('field',field);
    console.warn('index',index);
    console.warn('name',name);
    measures[index] = {
      product_measurement_id : field,
      value : text,
      name : name
    };
    this.setState({
      measurements : measures
    });
    console.warn('measures////',this.state.measurements);
  }
  customNavigation(){
    this.state.custom_nav_data.push({
      product_name:this.state.product_name,
      prize:this.state.prize,
      img:this.state.header_image,
      product:this.state.product_id,
      vendor:this.state.vendor_id,
      slug : this.state.slug,
      spec : this.state.spec
    });
    this.setState({
      customising_screen : true,
      Data : this.state.measurementData
    });
    // this.props.navigation.navigate('customization',{data:this.state.measurementData,p_data:this.state.custom_nav_data})
    // console.warn('custom_nav_data',this.state.custom_nav_data);
    console.warn('measurementData........',this.state.measurementData);
  }
  getDetails(){
    let item;
    let v_item = [];
    this.setState({
      show : true
    });
    console.log('slug//details :',this.state.slug);
    let spec_datas = [];
    let spec_variation_datas = [];
    var url = config.API_URL+'productDetail/'+this.state.slug
    fetch(url, {
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
        .then((response)=>response.json())
        .catch((error)=>console.log(error))
        .then((response)=>{
          if (response.code){
            if (response.code == 200){
              if (response.data) {
                this.state.slider_Images.length = 0;
                console.log('productDetailresponse',response);

                this.setState({
                  is_in_cart : response.data.is_in_cart,
                  is_in_wishlist : response.data.is_in_wishlist,
                  product_name : response.data.product_name,
                  product_note : response.data.product_notes,
                  brand : response.data.brand,
                  product_id : response.data.product_variation_id,
                  product_details : response.data.product_details.product_description,
                  starCount : response.data.product_rating,
                  sale_price : response.data.product_mrp
                });
                for(let product_images of response.data.product_images){
                  this.state.slider_Images.push(product_images.img)
                }
                for(let product_vendors of response.data.product_vendors){
                  this.setState({
                    vendor_id : product_vendors.vendor_id,
                    prize : product_vendors.product_price,
                    discount : product_vendors.discount
                  })
                  if (this.state.discount == 0) {
                    this.setState({
                      d_color : '#fff',
                      p_color : '#fff'
                    })
                  }
                  if (product_vendors.quantity < 1) {
                    this.setState({
                      out_of_stock_screen_temp : true
                    })
                  }
                  console.warn('out_of_stock_screen_temp',this.state.out_of_stock_screen_temp);
                }
                p_specs_container.length = 0;
                for (let product_specs of response.data.product_details.product_specs){
                  let product_specs_keys = Object.keys(product_specs)
                  p_specs_container.push({
                    spec_title : product_specs_keys[0],
                    specs : product_specs[product_specs_keys[0]]
                  })
                }
                spec_datas.length = 0;
                for(let spec_data of p_specs_container){
                  for(let val of spec_data.specs){
                    spec_datas.push({
                      spec_name : val.spec_name,
                      spec_value : val.spec_value
                    })
                  }
                }
                this.setState({
                  spec : spec_datas
                });
                v_item.length = 0;
                let v_data = [];
                for(let product_spec_variation of response.data.product_variation_items){
                  let product_spec_variation_key = Object.keys(product_spec_variation);
                  p_spec_variation_container.push({
                    spec_title : product_spec_variation_key[0],
                    specs : product_spec_variation[product_spec_variation_key[0]]
                  });
                  let output = [];
                  let flags = [];
                  let key = Object.keys(product_spec_variation);
                  console.log('key.......',key);
                  let length = product_spec_variation[key].length;
                  console.log('length..........',length);
                  for (var i = 0; i <length; i++) {
                    if (flags[product_spec_variation[key][i].variation_spec_value] >= 0) {
                      output[flags[product_spec_variation[key][i].variation_spec_value]].variation_slug.push(product_spec_variation[key][i].variation_slug);
                      continue;
                    }
                    flags[product_spec_variation[key][i].variation_spec_value] = i;
                    const arr = [];
                    arr.push(product_spec_variation[key][i].variation_slug);
                    if (arr.includes(this.state.slug)){
                      this.setState({
                        cardViewBorder : '#369',
                        cardBorder : 2
                      })
                    } else {
                      this.setState({
                        cardViewBorder : '#595656',
                        cardBorder : 1
                      });
                    }
                    output.push({
                      'variation_slug':arr,
                      'variation_spec_value':product_spec_variation[key][i].variation_spec_value,
                      'img':product_spec_variation[key][i].img,
                      'cardViewBorder':this.state.cardViewBorder,
                      'cardBorder':this.state.cardBorder
                    });
                    console.log('output',output);

                  }
                  v_data.push({
                    v_category:key,
                    var_data:output
                  });
                  this.setState({
                    slug_check_Data : v_data
                  });
                  var_spec_data.length = 0;
                  let varArray = [];
                  let slugCheck = {};
                  slug_check_array.length = 0;
                  console.log('v_data.....',this.state.slug_check_Data);
                  for (let data of v_data) {
                    // for (let slug_check of data.var_data){
                    //   console.log('>>>>>>>>>>>>>>>>',slug_check);
                    //   if (slug_check.variation_slug.includes(this.state.slug)){
                    //     this.setState({
                    //       cardViewBorder : '#369',
                    //       cardBorder : 2
                    //     })
                    //   } else {
                    //     this.setState({
                    //       cardViewBorder : '#595656',
                    //       cardBorder : 1
                    //     });
                    //   }
                    //   slugCheck.variation_slug = slug_check.variation_slug;
                    //   slugCheck.variation_spec_value = slug_check.variation_spec_value;
                    //   slugCheck.img = slug_check.img;
                    //   slugCheck.cardViewBorder = this.state.cardViewBorder;
                    //   slugCheck.cardBorder = this.state.cardBorder;
                    //  varArray.push({
                    //    name : slugCheck
                    //  });
                    //   console.warn('////////',varArray)
                    // }
                    var_spec_data.push({
                      name : data.v_category[0],
                      value : data.var_data
                    })
                  }
                  console.log('............',var_spec_data)
                  // for(let slug_check of v_data){
                  //  console.log('slug_check',slug_check);
                  // }
                }
                spec_variation_datas.length = 0;
                for(let spec_variation_data of p_spec_variation_container){
                  for(let val of spec_variation_data.specs){
                    spec_variation_datas.push({
                      spec_name : val.variation_spec_value,
                      spec_slug : val.variation_slug,
                      spec_img : val.img
                    })
                  }
                }
                this.setState({
                  spec_variation : spec_variation_datas
                });
                console.warn('spec_variation',this.state.spec_variation);
                if (response.data.is_in_cart) {
                  this.setState({
                    show_cart:false,
                    cart_text : 'Move To Cart'
                  })
                } else {
                  this.setState({
                    show_cart:true
                  })
                }
                if (response.data.is_in_wishlist) {
                  this.setState({
                    show_fav:false
                  })
                } else {
                  this.setState({
                    show_fav:true
                  })
                } if (response.data.has_bought){
                  this.setState({
                    rate_view_width:'25%',
                    rate_icon_size:22,
                    rate_text_size :12
                  })
                } else {
                  this.setState({
                    rate_text_size : 0,
                    rate_view_width : '0%',
                    rate_icon_size : 0
                  })
                }
                this.ViewReview();
                if (response.data.measurements!= '') {
                  this.setState({
                    customButton : true
                  })
                }
                for(let customdata of response.data.measurements){
                  console.warn('customdata',customdata);
                  this.setState({
                    product_meassurment_id : customdata.product_measurement_id,
                    name : customdata.name,
                    description : customdata.description,
                    video : customdata.video
                  });
                  this.state.measurementData.push({
                    product_measurement_id : this.state.product_meassurment_id,
                    name : this.state.name,
                    description : this.state.description,
                    video : this.state.video,
                    product_id : this.state.product_id,
                    vendor_id : this.state.vendor_id
                  })
                }
                console.warn('measurementData',this.state.measurementData);
              }
            } else {
              this.setState({
                emptyScreen : true
              })
            }
          }
          this.setState({
            show : false
          });
        })
  }
  slug_check_function(){

  }
  SelectedSpec(slug){

    console.warn('slggggggg',slug);
    this.props.navigation.navigate('sel_details2',{slug:slug[0],header_image:this.state.header_image});
  }
  addToWishList(){
    console.warn('enterd into add to wishlist page');
    var url = config.API_URL+'user/wishlistCreate/'+this.state.product_id;
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
          if(response.message=='success'){
            this.setState({
              show_fav : false
            })
          }
        })
  }
  removeWishList(){
    var url = config.API_URL+'user/wishlistCreate/'+this.state.product_id;
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
          if (response.code=='200') {
            this.setState({
              show_fav : true
            })
          }
        })
  }
  addToCart(){
    if (this.state.cart_text == 'Add To Cart') {
      let cartData = {};
      cartData.measurements = JSON.stringify(this.state.measurements);
      console.warn('cart,measurements',this.state.measurements);
      this.setState({
        customising_screen : false
      });
      var url = config.API_URL+'product/addToCart/'+this.state.product_id+'/'+this.state.vendor_id;
      fetch(url, {
        method : 'POST',
        body : JSON.stringify(cartData),
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
            if (response.message=='success') {
              Toast.show('Product Added To Cart', Toast.LONG);
              this.getDetails();
              this.setState({
                show_cart : false
              })
            } if (response.code == '409'){
              Toast.show(response.message, Toast.LONG);
            }
          })
    } else if (this.state.cart_text == 'Move To Cart') {
      this.setState({
        customising_screen : false
      });
      this.props.navigation.navigate('add_to_cart')
    }
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    this.setState({
      slug : params.slug,
      show : true,
      header_image : params.img
    });
    this._getAccessToken();
  }
  // async localCart(){
  //   console.warn('You are not logged in');
  //   console.warn('product_name',this.state.product_name);
  //   console.warn('sale_price',this.state.sale_price);
  //   console.warn('discount',this.state.discount);
  //   console.warn('slider_Images',this.state.slider_Images[0]);
  //   this.setState({
  //     show_cart : false
  //   });
  //   try {
  //     await AsyncStorage.setItem('product_name', this.state.product_name);
  //     await AsyncStorage.setItem('sale_price', this.state.sale_price);
  //     await AsyncStorage.setItem('discount',this.state.discount);
  //     await AsyncStorage.setItem('slider_Images',this.state.slider_Images[0]);
  //     await AsyncStorage.setItem('product_id',this.state.product_id);
  //     await AsyncStorage.setItem('vendor_id',this.state.vendor_id);
  //   } catch (error) {
  //     console.warn(error.message);
  //   }
  // }
  render(){
    const {goBack} = this.props.navigation;
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
            <View style = {styles.titleView}>
              <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Product Details</Text>
            </View>
            <View style = {styles.iconView}></View>
          </View>
          <View style = {styles.baseContainer}>
            <ScrollView showsVerticalScrollIndicator = {false}>
              <View style = {styles.scrollContainer}>
                <View style = {styles.headerImage}>
                  <ImageSlider
                      style = {{height:"100%",width:'100%'}}
                      autoPlayWithInterval={3000}
                      images={this.state.slider_Images}
                      customSlide={({ index, item, style, width }) => (
                          <View key={index} style={[style, styles.customSlide]}>
                            <Image source={{uri:config.IMG_URL+item}} style={styles.customImage} />
                          </View>
                      )}
                      customButtons={(position, move) => (
                          <View style={styles.buttons}>
                            {this.state.slider_Images.map((image, index) => {
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
                </View>
                <View style = {{width:'98%',padding:10,backgroundColor:'#fff',marginTop:5,elevation:2}}>
                  <Text style = {styles.cover_img}>{this.state.product_name}</Text>
                  <View style = {{width:'100%',alignItems:'center',flexDirection:'row'}}>
                    <Image style = {{width:13,height:13,alignItems:'center',justifyContent:'center',resizeMode:'stretch',marginTop:4}}
                           source = {require('../img/curr.png')}>
                    </Image>
                    <Text style = {{color:'#595656',fontSize:14,marginLeft:4}}>{this.state.prize}</Text>
                    <Text style = {{color:this.state.p_color,fontSize:12,marginLeft:10,textDecorationLine:'line-through'}}>{this.state.sale_price}</Text>
                    <Text style = {{color:this.state.d_color,fontSize:12,marginLeft:10}}>{this.state.discount}% off</Text>
                  </View>
                  <View style = {{width:'100%',flexDirection:'row',padding:5}}>
                    <View style = {{width:'50%',borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,
                      borderTopRightRadius:6,padding:5}}>
                      <StarRating
                          disabled={true}
                          maxStars={5}
                          rating={this.state.starCount}
                          starSize={25}
                          fullStarColor={'#D4AF37'}
                          emptyStarColor={'#D4AF37'}
                      />
                    </View>
                    <View style = {{width:'50%'}}></View>
                    <AnimatedHideView style = {{position:'absolute',width:'100%',height:30,
                      alignItems:'center',justifyContent:'center',marginTop:10}}
                                      visible = {this.state.customButton}>
                      <View style = {{width:'100%',alignItems:'center',
                        justifyContent:'space-between',flexDirection:'row'}}>
                        <View></View>
                        <TouchableHighlight style = {{width:100,alignItems:'center',justifyContent:'center'}}
                                            underlayColor = 'transparent'
                                            onPress = {()=>this.customNavigation()}>
                          <View style = {{width:'100%',height:40,backgroundColor:'#48c7f0',alignItems:'center',justifyContent:'center'}}>
                            <Text style = {{color:'#fff'}}>Customise</Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    </AnimatedHideView>
                  </View>
                </View>
                <View style = {{width:'98%',backgroundColor:'#fff',elevation:2,flexDirection:'row',alignItems:'center',height:60,
                  justifyContent:'space-between',padding:10,borderTopColor:'#eee',borderTopWidth:1}}>
                  <View style = {{width:this.state.rate_view_width,height:'100%',borderRightWidth:1,borderRightColor:'#eee'}}>
                    <TouchableHighlight underlayColor = 'transparent'
                                        style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                                        onPress = {()=>{
                                          if (this.state.access_token!='') {
                                            this.setState({ratingView:true})
                                          } else {
                                            this.setState({
                                              login_cnfrm_screen : true
                                            })
                                          }
                                        }}>
                      <View style = {{flexDirection:'row'}}>
                        <MaterialIcons
                            name='star-border'
                            size={this.state.rate_icon_size}
                            style = {{color:'#605e5e'}}>
                        </MaterialIcons>
                        <Text style = {{marginLeft:3,color:'#605e5e',marginTop:3,fontSize:this.state.rate_text_size}}>Rate us</Text>
                      </View>
                    </TouchableHighlight>

                  </View>
                  <View style = {{width:'25%',height:'100%',borderRightWidth:1,borderRightColor:'#eee',alignItems:'center',justifyContent:'center'}}>
                    <View style = {{flexDirection:'row'}}>
                      <View>
                        <TouchableHighlight
                            underlayColor = 'transparent'
                            onPress = {()=>this.removeWishList()}>
                          <MaterialIcons
                              name='favorite'
                              size={22}
                              style = {{color:'#e50000'}}>
                          </MaterialIcons>
                        </TouchableHighlight>
                        <AnimatedHideView
                            visible = {this.state.show_fav}
                            style = {{position:'absolute'}}>
                          <TouchableHighlight
                              underlayColor = 'transparent'
                              onPress = {()=>{
                                if (this.state.access_token!='') {
                                  this.addToWishList()
                                } else {
                                  this.setState({
                                    login_cnfrm_screen:true
                                  })
                                }
                              }}>
                            <MaterialIcons
                                name='favorite'
                                size={22}
                                style = {{color:'#605e5e'}}>
                            </MaterialIcons>
                          </TouchableHighlight>
                        </AnimatedHideView>
                      </View>
                      <Text style = {{marginLeft:5,color:'#605e5e',marginTop:3,fontSize:12}}>Wishlist</Text>
                    </View>
                  </View>
                  <View style = {{width:'25%',height:'100%',borderRightWidth:1,borderRightColor:'#eee'}}>
                    <TouchableHighlight underlayColor = 'transparent'
                                        style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                      <View style = {{flexDirection:'row'}}>
                        <MaterialIcons
                            name='share'
                            size={22}
                            style = {{color:'#605e5e'}}>
                        </MaterialIcons>
                        <Text style = {{marginLeft:5,color:'#605e5e',marginTop:3,fontSize:12}}>Share</Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                  <View style = {{width:'25%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                    <View style = {{flexDirection:'row'}}>
                      <View>
                        <TouchableHighlight underlayColor = 'transparent'
                                            onPress = {()=>this.props.navigation.navigate('add_to_cart')}>
                          <MaterialIcons
                              name='add-shopping-cart'
                              size={22}
                              style = {{color:'#48c7f0'}}>
                          </MaterialIcons>
                        </TouchableHighlight>
                        <AnimatedHideView
                            visible = {this.state.show_cart}
                            style = {{position:'absolute'}}>
                          <TouchableHighlight
                              underlayColor = 'transparent'
                              onPress = {()=>{
                                if(this.state.access_token!=''){
                                  this.addToCart();
                                } else {
                                  this.localCart();
                                }
                              }}>
                            <MaterialIcons
                                name='add-shopping-cart'
                                size={22}
                                style = {{color:'#605e5e'}}>
                            </MaterialIcons>
                          </TouchableHighlight>
                        </AnimatedHideView>
                      </View>
                      <Text style = {{marginLeft:5,color:'#605e5e',marginTop:3,fontSize:12}}>Cart</Text>
                    </View>

                  </View>
                </View>
                <View style={{width:'100%',backgroundColor:'#fff'}}>
                  <GridView
                      itemDimension = {360}
                      items = {var_spec_data}
                      style = {styles.gridView}
                      spacing = {1}
                      renderItem = {item =>
                          <View style = {{elevation:3,height:150,width:'100%'}}>
                            <Text style={{marginBottom:5,marginLeft:10}}>{item.name}</Text>
                            <ScrollView
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                              <FlatList
                                  data={item.value}
                                  numColumns={item.value.length}
                                  renderItem={({ item, index })=> (
                                      <View style = {{width:80,height:100,backgroundColor:'#fff',marginLeft:10,alignItems:'center',justifyContent:'center'}}>
                                        <TouchableHighlight style={{borderWidth:item.cardBorder,borderColor:item.cardViewBorder,height:'60%',width:'70%',borderTopRightRadius:6,borderTopLeftRadius:6,
                                          borderBottomRightRadius:6,borderBottomLeftRadius:6}}
                                                            underlayColor='transparent'
                                                            onPress = {()=>this.SelectedSpec(item.variation_slug)}>
                                          <Image style = {{height:'100%',width:'100%',justifyContent:'center',alignItems:'center',resizeMode:'stretch'}}
                                                 source={{uri:config.IMG_URL+item.img}}>
                                          </Image>
                                        </TouchableHighlight>
                                        <View style={{height:'20%',alignItems:'center',justifyContent:'center'}}>
                                          <Text style={{marginTop:5}}>{item.variation_spec_value}</Text>
                                        </View>
                                      </View>
                                  )}
                              />
                            </ScrollView>
                          </View>
                      }
                  />
                </View>
                <View style = {{width:'100%'}}>
                  <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
                    <View style = {{width:'98%',alignItems:'center',justifyContent:'center',elevation:2,backgroundColor:'#fff',
                      marginTop:5,padding:10}}>
                      <View style = {{width:'100%'}}>
                        <Text style = {{color:'#000',fontSize:14,fontWeight:'bold',marginTop:5,marginBottom:10}}>About : </Text>
                      </View>
                      <Text style = {{fontSize:12}}>{this.state.product_details}</Text>
                    </View>
                  </View>
                </View>
                <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
                  <View style = {{width:'98%',alignItems:'center',justifyContent:'center',elevation:2,backgroundColor:'#fff',
                    marginTop:5,marginBottom:5,padding:10}}>
                    <View style = {{width:'100%'}}>
                      <Text style = {{color:'#000',fontSize:14,fontWeight:'bold'}}>Product Details</Text>
                    </View>
                    <GridView
                        itemDimension={360}
                        items={this.state.spec}
                        style={{paddingTop:25}}
                        renderItem={item => (
                            <View style = {{width:'100%',flexDirection:'row'}}>
                              <View style = {{width:'40%',marginLeft:1}}>
                                <Text style = {{color:'#363a42',fontSize:12}}>{item.spec_name}</Text>
                              </View>
                              <View style = {{width:'50%'}}>
                                <Text style = {{color:'#369',fontSize:12}}>{item.spec_value}</Text>
                              </View>
                            </View>
                        )}
                    />
                    <View style = {{width:'100%'}}>
                      <Text style = {{fontSize:14,marginTop:5,marginBottom:5,color:'#000',fontWeight:'bold'}}>Model & Care</Text>
                      <Text style = {{color:'#363a42',fontSize:12}}>100% Pure Material</Text>
                      <Text style = {{color:'#363a42',fontSize:12}}>Machine-wash</Text>
                      <Text style = {{color:'#363a42',marginTop:10,fontSize:12}}>Cash on delivery might be available</Text>
                      <Text style = {{color:'#363a42',fontSize:12}}>Easy 30 days return & 30 days exchange</Text>
                      <Text style = {{color:'#363a42',marginBottom:10,fontSize:12}}>Try & buy might be available</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style = {styles.footer}>
              <View style = {{width:'50%',height:'100%',backgroundColor:'#363a42'}}>
                <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                    underlayColor = 'transparent'
                                    onPress = {()=>goBack()}>
                  <Text style = {{color:'#fff'}}>Cancel</Text>
                </TouchableHighlight>
              </View>
              <View style = {{width:'50%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#2fdab8'}}>
                <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                    underlayColor = 'transparent'
                                    onPress = {()=>
                                    {
                                      if (this.state.access_token!=''&&this.state.out_of_stock_screen_temp == false) {
                                        this.props.navigation.navigate('buy_now',{
                                          product_name:this.state.product_name,
                                          prize:this.state.prize,
                                          img:this.state.header_image,
                                          product:this.state.product_id,
                                          vendor:this.state.vendor_id,
                                          measurements : this.state.measurements,
                                          slug : this.state.slug,
                                          spec : this.state.spec
                                        })
                                      } else if (this.state.access_token == ''){
                                        this.setState({
                                          login_cnfrm_screen : true
                                        })
                                      } else if (this.state.out_of_stock_screen_temp == true) {
                                        this.setState({out_of_stock_screen : true})
                                      }
                                    }
                                    }>
                  <Text style = {{color:'#fff'}}>Buy Now</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <AnimatedHideView
              visible = {this.state.ratingView}
              style = {{width:'100%',height:'100%',position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)',alignItems:'center',justifyContent:'center'}}>
            <View style = {{width:'89%',height:'65%',backgroundColor:'#fff',borderBottomLeftRadius:8,borderBottomRightRadius:8,
              borderTopLeftRadius:8,borderTopRightRadius:8,alignItems:'center',justifyContent:'center'}}>
              <ScrollView style = {{width:'100%',height:'100%'}}>
                <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'#000',fontSize:22,fontWeight:'bold'}}>Wants to Rate Us Now ?</Text>
                  <Image style = {{width:80,height:80,alignItems:'center',justifyContent:'center',marginTop:20}}
                         source = {require('../img/thumbs.png')}>
                  </Image>
                  <View style = {{width:'90%',alignItems:'center',justifyContent:'center',marginTop:20}}>
                    <Text style = {{fontSize:16,textAlign:'center'}}>Rate the product it will incredibly helpful to other user to select the best one</Text>
                  </View>
                  <View style = {{width:'100%',marginTop:10,alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{color:'#800000',fontSize:20,marginTop:5,marginBottom:10,fontWeight:'bold'}}>{this.state.feedback}</Text>
                    <Stars
                        isActive={true}
                        rateMax={5}
                        isHalfStarEnabled={false}
                        onStarPress={(rating) => this.addMyrating(rating)}
                        rate={1}
                        size={35}
                    />
                    <TextInput style = {styles.input}
                               underlineColorAndroid='#bbb'
                               placeholder="Your Comment"
                               placeholderTextColor="#000"
                               onChangeText = {(user_comment)=>this.updateValue(user_comment,'comment')}>
                    </TextInput>
                  </View>
                  <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:10}}>
                    <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                          onPress = {()=>this.addReview()}>SUBMIT</Text>
                    <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                          onPress = {()=>this.setState({ratingView:false})}>DISMISS</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </AnimatedHideView>
          <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
            <Spinner color = {'#369'} visible={this.state.show} textContent={"Loading..."} textStyle={{color: '#369'}}
                     overlayColor = {'#fff'}/>
          </View>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
                            visible = {this.state.login_cnfrm_screen}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style = {{width:'100%',height:'80%'}}>

              </View>
              <View style = {{width:'95%',height:'15%',backgroundColor:'rgba(00, 00, 00, 0.7)',alignItems:'center',justifyContent:'center',
                borderBottomRightRadius:6,borderBottomLeftRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
                <Text style = {{color:'#fff',fontWeight:'bold',fontSize:16,textAlign:'center'}}>Seems like you are not a member in here</Text>
                <View style = {{width:'100%',alignItems:'center',justifyContent:'center',marginTop:10,flexDirection:'row'}}>
                  <View style = {{width:'60%',paddingLeft:10}}>
                    <Text style = {{color:'#369',fontWeight:'bold',fontSize:14}}
                          onPress = {()=>this.setState({login_cnfrm_screen:false})}>Cancel</Text>
                  </View>
                  <View style = {{width:'30%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <Text style = {{color:'#2fdab8',fontWeight:'bold',fontSize:14}}
                          onPress = {()=>this.props.navigation.navigate('reg')}>Sign Up</Text>
                    <Text style = {{color:'#2fdab8',fontWeight:'bold',fontSize:14}}
                          onPress = {()=>this.props.navigation.navigate('logn')}>Log In</Text>
                  </View>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',
            position : 'absolute'}}
                            visible = {this.state.out_of_stock_screen}>
            <View style = {{width:'95%',backgroundColor:'rgba(00,00,00,0.7)',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold',marginTop:30,marginBottom:20}}>Sorry This Product Not in Stock</Text>
              <View style = {{width:'100%',padding:10,flexDirection:'row'}}>
                <View style = {{width:'90%'}}></View>
                <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                      onPress = {()=>this.setState({out_of_stock_screen:false})}>OK</Text>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(00,00,00,0.5)',
            position:'absolute'}}
                            visible = {this.state.customising_screen}>
            <View style = {{width:'95%',borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,backgroundColor:'#fff',
              borderTopRightRadius:6,alignItems:'center',justifyContent:'center'}}>
              <View style = {{height:50,width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#5a5a5a',flexDirection:'row'}}>
                <View style = {{width:'85%',alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'#fff',fontSize:14}}>Customise</Text>
                </View>
                <View style = {{width:'15%',alignItems:'center',justifyContent:'center'}}>
                  <TouchableHighlight underlayColor = 'transparent'
                                      onPress = {()=>this.setState({customising_screen:false,measurements : []})}>
                    <MaterialIcons
                        name='close'
                        size={22}
                        style = {{color:'#fff'}}>
                    </MaterialIcons>
                  </TouchableHighlight>
                </View>
              </View>
              <FlatList
                  data={this.state.Data}
                  renderItem={({ item, index }) => (
                      <View style = {{width:'100%'}}>
                        <Text style = {{color:'#363a42',fontSize:14,fontWeight:'bold',marginTop:10}}>{item.name} (inches)</Text>
                        <View style = {{width:'100%',alignItems:'center',flexDirection:'row',marginBottom:10}}>
                          <TextInput style = {styles.input1}
                                     placeholderTextColor="#eee"
                                     keyboardType = 'numeric'
                                     onChangeText = {(text_data)=>this.updateValue1(text_data, item.product_measurement_id, item.name, index)}>
                          </TextInput>
                          <TouchableHighlight underlayColor = 'transparent'
                                              style = {{marginLeft:10}}
                                              onPress = {()=>this.setState({des_screen:true,des:item.description})}>
                            <MaterialIcons
                                name='info'
                                size={30}
                                style = {{color:'#363a42'}}>
                            </MaterialIcons>
                          </TouchableHighlight>
                        </View>
                      </View>
                  )}
              />
              <View style = {{width:'100%',height:50,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <TouchableHighlight style = {{width:'50%',height:'100%'}}
                                    underlayColor = 'transparent'
                                    onPress = {()=>this.addToCart()}>
                  <View style = {{width:'100%',height:'100%',backgroundColor:'#363a42',alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{color:'#fff'}}>{this.state.cart_text}</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style = {{width:'50%',height:'100%'}}>
                  <View style = {{width:'100%',height:'100%',backgroundColor:'#2fdab8',alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{color:'#fff'}}
                          onPress = {()=>this.props.navigation.navigate('buy_now',{
                            product_name:this.state.product_name,
                            prize:this.state.prize,
                            img:this.state.header_image,
                            product:this.state.product_id,
                            vendor:this.state.vendor_id,
                            measurements : this.state.measurements,
                            slug : this.state.slug,
                            spec : this.state.spec
                          })}>Buy Now</Text>
                  </View>
                </TouchableHighlight>
              </View>
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
                      name='arrow-back'
                      size={22}
                      style = {{color:'#fff'}}>
                  </MaterialIcons>
                </TouchableHighlight>
              </View>
              <View style = {styles.textView}>
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Garden Store</Text>
              </View>
              <View style = {styles.iconView}>

              </View>
            </View>
            <View style = {styles.baseContainer2}>
              <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Image style = {{width:40,height:40,alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                       source = {require('../img/rotate.png')}>

                </Image>
                <Text>No product to show</Text>
                <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
                            visible = {this.state.des_screen}>
            <View style = {styles.container}>
              <View style = {styles.toolbar}>
                <View style = {styles.menuView}>
                  <TouchableHighlight underlayColor = 'transparent'
                                      onPress = {()=>this.setState({des_screen:false})}>
                    <MaterialIcons
                        name='arrow-back'
                        size={22}
                        style = {{color:'#fff'}}>
                    </MaterialIcons>
                  </TouchableHighlight>
                </View>
                <View style = {styles.titleView}>
                  <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Customisation</Text>
                </View>
                <View style = {styles.iconView}></View>
              </View>
              <View style = {styles.baseContainer}>
                <View style = {{height:'100%',width:'100%',backgroundColor:'#fff',elevation:4}}>
                  <ScrollView style = {{width:'100%',height:'100%'}}>
                    <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                      <Text style = {{textAlign:'center',fontSize:18,fontWeight:'bold',color:'#360',marginTop:20,marginBottom:20}}>Read The Below Content Carefully</Text>
                      <Text style = {{textAlign:'center',fontSize:16,fontWeight:'bold',color:'#000',marginTop:20,marginBottom:20}}>{this.state.des}</Text>
                    </View>
                  </ScrollView>
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
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  toolbar:{
    height:'8%',
    width:'100%',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:'#282a2d',
    flexDirection:'row'
  },
  baseContainer:{
    height:'92%',
    width:'100%'
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
  footer:{
    width:'100%',
    height:55,
    flexDirection:'row'
  },
  scrollContainer:{
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  headerImage:{
    height:450,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    elevation:2
  },
  customSlide: {
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center'
  },
  customImage: {
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    resizeMode:'stretch'
  },
  buttons: {
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: 3,
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    backgroundColor: '#bbb',
    opacity: 1,
  },
  buttonSelected: {
    opacity: 1,
    backgroundColor: '#369',
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    elevation:3
  },
  cover_img:{
    color:'#595656',
    fontSize:12
  },
  cover_img_des:{
    color:'#ffffff',
    marginTop:10
  },
  function_icon_view:{
    width:'90%',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:10,
    flexDirection:'row',
    marginBottom:10
  },
  input:{
    width:'90%',
    height:45,
    color:'#000',
    marginTop:20
  },
  input1:{
    width:'80%',
    height:45,
    paddingLeft:16,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    color:'#363a42',
    borderColor:'#363a42',
    borderWidth:1,
    marginTop:10,
    alignItems:'center',
    justifyContent:'center'
  },
  baseContainer2:{
    height:'92%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  }
});
