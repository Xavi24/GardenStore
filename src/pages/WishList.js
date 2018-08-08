import React,{Component} from 'react'
import {View,Text,StyleSheet,TouchableHighlight,ScrollView,AsyncStorage,Image} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import GridView from 'react-native-super-grid'
import config from '../API/config'
import LinearGradient from 'react-native-linear-gradient'
import AnimatedHideView from 'react-native-animated-hide-view'
import Spinner from 'react-native-loading-spinner-overlay'

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
      show : false
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
          console.warn('data-->>>',data);
          this.setState({
            product_id : data.id,
            user_id : data.user_id,
            variation_id : data.variation_id,
            product_name : data.variation_detail.name,
            prize : data.variation_detail.price,
            discount : data.variation_detail.total_discount,
            img : data.variation_detail.variation_image_single.variation_image
          })
          this.state.wishlistData.push({
            product_id : this.state.product_id,
            user_id : this.state.user_id,
            variation_id : this.state.variation_id,
            product_name : this.state.product_name,
            prize : this.state.prize,
            discount : this.state.discount,
            img: this.state.img
          })
          console.warn('img',this.state.img);
          console.warn('wishlistData',this.state.wishlistData);
        }
      }
      console.warn('getWishListData--->>>',this.state.wishlistData);
    })
  }
  componentWillMount(){
    this._getAccessToken();
  }
  render(){
    return(
      <View style = {styles.container}>
        <View style = {styles.toolbar}>
          <View style = {styles.menuView}>
            <TouchableHighlight underlayColor = 'transparent'
              onPress = {()=>this.props.navigation.navigate('mainscreen')}>
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
              itemDimension = {180}
              items = {this.state.wishlistData}
              style = {styles.gridView}
              spacing = {4}
              renderItem = {item =>
                <TouchableHighlight style = {{height:300,width:'100%'}}
                  underlayColor = 'transparent'>
                  <View style = {styles.grid_content}>
                    <Image style = {styles.imageView}
                      source ={{uri:config.IMG_URL+item.img}}>
                    </Image>
                    <View style = {styles.gridBaseView}>
                      <ScrollView></ScrollView>
                      <LinearGradient
                        style = {{borderBottomLeftRadius:2,borderBottomRightRadius:2,width:'100%'}}
                        start={{x: 0.5, y: 0.0}} end={{x: 0.5, y: 1.0}}
                        locations={[0,0.7]}
                        colors={['rgba(00, 00, 00, 0.0)','rgba(00, 00, 00, 0.7)']}>
                        <View style = {styles.productDetails}>
                          <View style = {{width:'95%',alignItems:'center',justifyContent:'center'}}>
                            <Text style = {styles.productName}>{item.product_name}</Text>
                            <View style = {{width:'100%',flexDirection:'row'}}>
                              <Text style = {styles.productPrice_des}>Price : </Text>
                              <Text style = {styles.productPrice}>{item.price}</Text>
                              <Text style = {{color:'#48c7f0',fontSize:16,marginLeft:5}}>{item.discount}</Text>
                              <Text style = {{color:'#48c7f0',fontSize:16}}>%</Text>
                              <Text style = {{color:'#0cb038',fontSize:16,marginLeft:5}}>off</Text>
                            </View>
                            <View style = {{width:'100%'}}>
                              <Text style = {{color:'#48c7f0',fontSize:16}}>Explore Now!</Text>
                            </View>
                          </View>
                        </View>
                      </LinearGradient>
                    </View>
                  </View>
                </TouchableHighlight>
              }
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
  imageView:{
    height:'100%',
    width:'100%',
    resizeMode:'stretch'
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
  }
})
