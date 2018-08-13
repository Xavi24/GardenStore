import React,{Component} from 'react'
import {View,Text,StyleSheet,TouchableHighlight,ScrollView,AsyncStorage,Image} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import GridView from 'react-native-super-grid'
import config from '../API/config'
import LinearGradient from 'react-native-linear-gradient'
import AnimatedHideView from 'react-native-animated-hide-view'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-simple-toast'

export default class wishList extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      wishlistData : [],
      product_id : '',
      user_id : '',
      variation_id : '',
      product_name : '',
      prize : '',
      discount : '',
      img : '',
      error_screen : false,
      show : false,
      stock : '',
      vendor_id : ''
    }
  }
  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value
          })
          this.getWishListData();
        } else {
          this.setState({
            error_screen : true
          })
        }
      } catch (error) {
    }
  }
  getWishListData(){
    this.setState({
      show : true
    })
    var url = config.API_URL+'user/viewWishlist'
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
      console.warn('response',response);
      if (response.data!=null) {
        this.setState({
          show : false
        })
        console.warn('wishlistresponse--->>>',response.data);
        for (let data of response.data.data){
          console.log('data-->>>',data);
          this.setState({
            product_id : data.id,
            user_id : data.user_id,
            variation_id : data.variation_id,
            product_name : data.variation_detail.name,
            prize : data.variation_detail.sale_price,
            discount : data.variation_detail.total_discount,
            img : data.variation_detail.variation_image_single.variation_image,
            stock : data.variation_detail.stock,
            vendor_id : data.variation_detail.vendor_id
          })
          this.state.wishlistData.push({
            product_id : this.state.product_id,
            user_id : this.state.user_id,
            variation_id : this.state.variation_id,
            product_name : this.state.product_name,
            prize : this.state.prize,
            discount : this.state.discount,
            img: this.state.img,
            stock : this.state.stock,
            vendor_id : this.state.vendor_id
          })
        }
      }
    })
  }
  movToCart(var_id,v_id){
    this.setState({
      show:true
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
            this.getWishListData();
         }
       }
     })

  }
  removeFromWishList(p_id){
    this.setState({
      show:true
    })
    console.warn('variation_id',p_id);
    var url = config.API_URL+'user/wishlistCreate/'+p_id
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
      this.setState({
        show : false
      })
      if (response.code=='200') {
        Toast.show('Product Removed From Wishlist', Toast.LONG);
        this.getWishListData();
      }
    })
  }
  componentWillMount(){
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
          <View style = {styles.textView}>
            <Text style = {{color:'#fff',fontSize:18}}>Wishlist</Text>
          </View>
          <View style = {styles.IconView}></View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView style = {{width:'100%',height:'100%'}}>
          <GridView
            showsVerticalScrollIndicator={false}
            itemDimension={360}
            items={this.state.wishlistData}
            renderItem={item => (
              <View style ={styles.gridContainer}>
                <View style = {styles.gridHeaderView}>
                  <View style = {styles.imageView}>
                    <Image style = {styles.image}
                      source ={{uri:config.IMG_URL+item.img}}>
                    </Image>
                  </View>
                  <View style = {styles.contentView}>
                    <Text style = {{color:'#369',fontSize:18,fontWeight:'bold',marginTop:5}}>{item.product_name}</Text>
                    <View style = {{flexDirection:'row',marginTop:20}}>
                      <Text style = {styles.textMain}>RS.</Text>
                      <Text style = {styles.textPrice}>{item.prize}</Text>
                    </View>
                  </View>
                </View>
                <View style = {styles.gridFooterView}>
                  <View style = {styles.leftFooter}>
                    <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                      underlayColor = 'transparent'
                      onPress = {()=>this.removeFromWishList(item.variation_id)}>
                      <Text style = {{color:'#363a42',fontSize:16,fontWeight:'bold'}}>REMOVE</Text>
                    </TouchableHighlight>
                  </View>
                  <View style = {styles.rightFooter}>
                    <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                      underlayColor = 'transparent'
                      onPress = {()=>this.movToCart(item.variation_id,item.vendor_id)}>
                      <Text style = {{color:'#369',fontSize:16,fontWeight:'bold'}}>MOVE TO CART</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
              )}
            />
          </ScrollView>
          <AnimatedHideView
            visible = {this.state.error_screen}
            style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}>
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
          </AnimatedHideView>
        </View>
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
    alignItems:'center',
    justifyContent:'center'
  },
  toolbar:{
    height:'8%',
    width:'100%',
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row',
    backgroundColor:'#282a2d'
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
  IconView:{
    height:'100%',
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },
  gridView: {
    flex: 1,
    width:'100%'
  },
  grid_content:{
    width:'100%',
    height:'100%',
  },
  gridBaseView:{
    width:'100%',
    height:'100%',
    position:'absolute'
  },
  productDetails:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  productName:{
    color:'#fff',
    fontSize:16,
  },
  productPrice:{
    color:'#0cb038',
    fontSize:14,
  },
  productPrice_des:{
    color:'#fff',
    fontSize:14,
    marginRight:5
  },
  grid_icon_view:{
    marginBottom:10,
    width:'98%',
    flexDirection:'row',
    justifyContent:'space-between'
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
})
