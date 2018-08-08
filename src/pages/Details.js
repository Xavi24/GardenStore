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
        AsyncStorage} from 'react-native'
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

let count = 1
p_specs_container = [];
p_spec_variation_container = []
export default class Details extends Component<{}>{
  static navigationOptions = {
   header : null
  }
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      slug : '',
      header_image : '',
      is_in_cart : '',
      is_in_wishlist : '',
      has_bought : '',
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
      custom_nav_data : []
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
        feedback : 'Excelent'
      })
    }
  }
  addReview(){
    let Data = {}
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
      if (value !== null) {
        this.setState({
          access_token : value
        })
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
    var url = config.API_URL+'userAddresses'
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
      console.warn('GetAddressResponse',response);
      if (response.data!= '') {
        this.props.navigation.navigate('buy_now',{
          product_name:this.state.product_name,
          prize:this.state.prize,
          img:this.state.header_image,
          product:this.state.product_id,
          vendor:this.state.vendor_id,
          measurements : []
        })
      }
      else {
        this.props.navigation.navigate('add_address',{
          product_name:this.state.product_name,
          prize:this.state.prize,
          img:this.state.header_image,
          product:this.state.product_id,
          vendor:this.state.vendor_id
        })
      }
    })
  }
  customNavigation(){
    this.state.custom_nav_data.push({
      product_name:this.state.product_name,
      prize:this.state.prize,
      img:this.state.header_image,
      product:this.state.product_id,
      vendor:this.state.vendor_id
    })
    this.props.navigation.navigate('customization',{data:this.state.measurementData,p_data:this.state.custom_nav_data})
    console.warn('custom_nav_data',this.state.custom_nav_data);
    console.warn('measurementData',this.state.measurementData);
  }
  getDetails(){
    this.setState({
      show : true
    })
    console.log('slug//details :',this.state.slug);
    spec_datas = [];
    spec_variation_datas = [];
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
       if (response.data!=null) {
         this.setState({
           show : false
         })
         console.log('productDetailresponse',response);

         this.setState({
           is_in_cart : response.data.is_in_cart,
           is_in_wishlist : response.data.is_in_wishlist,
           product_name : response.data.product_name,
           prize : response.data.product_mrp,
           product_note : response.data.product_notes,
           brand : response.data.brand,
           product_id : response.data.product_variation_id,
           product_details : response.data.product_details.product_description,
           starCount : response.data.product_rating
         })
         for(let product_images of response.data.product_images){
           this.state.slider_Images.push(product_images.img)
         }
         for(let product_vendors of response.data.product_vendors){
           this.setState({
             vendor_id : product_vendors.vendor_id
           })
         }
           p_specs_container.length = 0;
          for (let product_specs of response.data.product_details.product_specs){
            product_specs_keys = Object.keys(product_specs)
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
          })
          for(let product_spec_variation of response.data.product_variation_items){
            product_spec_variation_key = Object.keys(product_spec_variation)
            p_spec_variation_container.push({
              spec_title : product_spec_variation_key[0],
              specs : product_spec_variation[product_spec_variation_key[0]]
            })
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
          })
          console.log('spec_variation',this.state.spec_variation);
           if (response.data.is_in_cart) {
            this.setState({
              show_cart:false
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
            })
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
     })
  }
  addToWishList(){
    var url = config.API_URL+'user/wishlistCreate/'+this.state.product_id
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
      if(response.message=='success'){
        this.setState({
          show_fav : false
        })
      }
    })
  }
  removeWishList(){
    var url = config.API_URL+'user/wishlistCreate/'+this.state.product_id
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
    var url = config.API_URL+'product/addToCart/'+this.state.product_id+'/'+this.state.vendor_id
    fetch(url, {
      method : 'POST',
      headers : new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
    .then((response)=>response.json())
    .catch((error)=>console.warn(error))
    .then((response)=>{
      if (response.message=='success') {
        this.setState({
          show_cart : false
        })
      }
    })
  }
  componentDidMount(){
    const {params} = this.props.navigation.state;
    this.setState({
      slug : params.slug,
      show : true,
      header_image : params.img
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
          <View style = {styles.titleView}>
            <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Product Details</Text>
          </View>
          <View style = {styles.iconView}></View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView>
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
                            <Text style={position === index && styles.buttonSelected}>
                              {index + 1}
                            </Text>
                          </TouchableHighlight>
                        );
                      })}
                    </View>
                  )}
                />
                <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}>
                  <View style = {{width:'100%',height:'50%'}}></View>
                  <View style = {{width:'100%',height:'50%'}}>
                    <LinearGradient
                      style = {{width:'100%',height:'100%'}}
                      start={{x: 0.5, y: 0.0}} end={{x: 0.5, y: 1.0}}
                      locations={[0,0.7]}
                      colors={['rgba(00, 00, 00, 0.0)','rgba(00, 00, 00, 0.7)']}>
                        <View style = {{width:'100%',justifyContent:'center',alignItems:'center'}}>
                          <Text style = {{fontSize:20,fontWeight:'bold',color:'#0cb038'}}>{this.state.prize}</Text>
                          <Text style = {styles.cover_img}>{this.state.product_name}</Text>
                          <View style = {{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <Text style = {{color:'#fff',marginTop:10}}>Product Brand : </Text>
                            <Text style = {styles.cover_img_des}>{this.state.brand}</Text>
                          </View>
                        </View>
                        <View style = {{marginLeft:5,justifyContent:'center',alignItems:'center'}}>
                          <View style = {styles.function_icon_view}>
                            <TouchableHighlight underlayColor = 'transparent'
                              onPress = {()=>this.setState({ratingView:true})}>
                              <MaterialIcons
                                name='star-border'
                                size={25}
                                style = {{color:'#ffffff'}}>
                              </MaterialIcons>
                            </TouchableHighlight>
                            <View>
                              <TouchableHighlight
                                underlayColor = 'transparent'
                                onPress = {()=>this.removeWishList()}>
                                <MaterialIcons
                                  name='favorite'
                                  size={25}
                                  style = {{color:'#e50000'}}>
                                </MaterialIcons>
                              </TouchableHighlight>
                              <AnimatedHideView
                                visible = {this.state.show_fav}
                                style = {{position:'absolute'}}>
                                <TouchableHighlight
                                  underlayColor = 'transparent'
                                  onPress = {()=>this.addToWishList()}>
                                  <MaterialIcons
                                    name='favorite'
                                    size={25}
                                    style = {{color:'#fff'}}>
                                  </MaterialIcons>
                                </TouchableHighlight>
                              </AnimatedHideView>
                            </View>
                            <MaterialIcons
                              name='share'
                              size={25}
                              style = {{color:'#ffffff'}}>
                            </MaterialIcons>
                            <View>
                              <TouchableHighlight underlayColor = 'transparent'
                                onPress = {()=>this.props.navigation.navigate('add_to_cart')}>
                                <MaterialIcons
                                  name='add-shopping-cart'
                                  size={25}
                                  style = {{color:'#48c7f0'}}>
                                </MaterialIcons>
                              </TouchableHighlight>
                              <AnimatedHideView
                                visible = {this.state.show_cart}
                                style = {{position:'absolute'}}>
                                <TouchableHighlight
                                  underlayColor = 'transparent'
                                  onPress = {()=>this.addToCart()}>
                                  <MaterialIcons
                                    name='add-shopping-cart'
                                    size={25}
                                    style = {{color:'#fff'}}>
                                  </MaterialIcons>
                                </TouchableHighlight>
                              </AnimatedHideView>
                            </View>
                          </View>
                        </View>
                    </LinearGradient>
                  </View>
                </View>
              </View>

              <View style = {{width:'100%',flexDirection:'row',padding:5}}>
                <View style = {{width:'40%',borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,
                  borderTopRightRadius:6,padding:5}}>
                  <StarRating
                    disabled={true}
                    maxStars={5}
                    rating={this.state.starCount}
                    starSize={30}
                    fullStarColor={'#D4AF37'}
                    emptyStarColor={'#D4AF37'}
                  />
                </View>
                <View style = {{width:'60%'}}></View>
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
              <View style = {{width:'100%'}}>
                <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>

                  <View style = {{width:'95%',alignItems:'center',justifyContent:'center',borderColor:'#bbb',borderWidth:1,
                    borderTopLeftRadius:6,borderTopRightRadius:6,borderBottomLeftRadius:6,borderBottomRightRadius:6,paddingLeft:5,
                    marginTop:10,marginBottom:10,paddingTop:5,paddingBottom:5,paddingRight:2}}>
                    <View style = {{width:'100%'}}>
                      <Text style = {{color:'#000',fontSize:16,fontWeight:'bold',marginTop:5,marginBottom:10}}>About : </Text>
                    </View>
                    <Text style = {{fontSize:16}}>{this.state.product_details}</Text>
                  </View>
                </View>
              </View>
              <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'95%',alignItems:'center',justifyContent:'center'}}>
                  <View style = {{width:'100%'}}>
                    <Text style = {{color:'#000',fontSize:16,fontWeight:'bold'}}>Product Details</Text>
                  </View>
                  <GridView
                    itemDimension={360}
                    items={this.state.spec}
                    style={{paddingTop:25}}
                    renderItem={item => (
                      <View style = {{width:'100%',flexDirection:'row'}}>
                        <View style = {{width:'40%',marginLeft:1}}>
                          <Text style = {{color:'#363a42'}}>{item.spec_name}</Text>
                        </View>
                        <View style = {{width:'50%'}}>
                          <Text style = {{color:'#369'}}>{item.spec_value}</Text>
                        </View>
                      </View>
                    )}
                  />
                  <View style = {{width:'100%'}}>
                    <Text style = {{fontSize:16,marginTop:10,marginBottom:5,color:'#000',fontWeight:'bold'}}>Model & Care</Text>
                    <Text style = {{color:'#363a42'}}>100% Pure Material</Text>
                    <Text style = {{color:'#363a42'}}>Machine-wash</Text>
                    <Text style = {{color:'#363a42',marginTop:10}}>Cash on delivery might be available</Text>
                    <Text style = {{color:'#363a42'}}>Easy 30 days return & 30 days exchange</Text>
                    <Text style = {{color:'#363a42',marginBottom:10}}>Try & buy might be available</Text>
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
            <View style = {{width:'50%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#48c7f0'}}>
              <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                underlayColor = 'transparent'
                onPress = {()=>this.getAddressDetails()}>
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
        </AnimatedHideView>
        <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
          <Spinner color = {'#369'} visible={this.state.show} textContent={"Loading..."} textStyle={{color: '#369'}}
            overlayColor = {'#fff'}/>
        </View>
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
    height:300,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#369'
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
    backgroundColor: '#fff',
    opacity: 0.9,
  },
  buttonSelected: {
    opacity: 1,
    backgroundColor: '#369',
  },
  cover_img:{
    color:'#ffffff',
    fontSize:18
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
  }
})
