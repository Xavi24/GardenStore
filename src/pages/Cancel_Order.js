import React,{Component} from 'react'
import {View,
        Text,
        TextInput,
        Image,
        StyleSheet,
        TouchableHighlight,
        ScrollView,
        FlatList,
        AsyncStorage,
        BackHandler
  } from 'react-native'
import GridView from 'react-native-super-grid'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import {TabNavigator,TabBarBottom} from 'react-navigation'
import config from '../API/config'
import Spinner from 'react-native-loading-spinner-overlay'

let array = [1,2,3,4]
export default class Cancel_Order extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      cArray : []
    }
  }
  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value
        })
        this.getOrderDetails();
      }
    } catch (error) {
    }
  }
  getOrderDetails(){
    let c_data = {};
    let cArray = [];
    console.warn('entered into cancel method');
    var url = config.API_URL+'user/cancelledOrders'
    fetch(url,{
      headers : new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
    .then((response)=>response.json())
    .catch((error)=>console.warn(error))
    .then((response)=>{
      console.warn('response//cancelorder',response);
      if (response) {
        if (response.data) {
          if (response.data.data.length >0) {
            for(let data of response.data.data){
              // console.warn('data',data);
              c_data.order_id = data.order_id,
              c_data.date_purchased = data.date_purchased,
              c_data.amount = data.amount,
              c_data.fbin = data.fbin
              for(let innerData of data.orderproducts){
                c_data.order_product_id = innerData.order_product_id,
                c_data.name = innerData.product_name,
                c_data.price = innerData.product_price,
                c_data.product_qty = innerData.product_qty,
                c_data.img = innerData.single_var_img.variation_image,
                c_data.status = innerData.order_last_status.status,
                c_data.product_id = innerData.product_id,
                c_data.slug = innerData.variation.slug
                cArray.push({
                  order_id : c_data.order_id,
                  date : c_data.date_purchased,
                  amount : c_data.amount,
                  fbin : c_data.fbin,
                  order_product_id : c_data.order_product_id,
                  name : c_data.name,
                  price : c_data.price,
                  product_qty : c_data.product_qty,
                  img : c_data.img,
                  status : c_data.status,
                  slug : c_data.slug
                })
                this.setState({
                  cArray : cArray
                })
              }
            }
          }
        }
      }
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
            <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Canceled Order</Text>
          </View>
          <View style = {styles.iconView}></View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView
            showsVerticalScrollIndicator = {false}>
            <View style = {{alignItems:'center',justifyContent:'center'}}>
              <GridView
                itemDimension={360}
                items={this.state.cArray}
                renderItem={item => (
                  <View style = {{width:'100%',backgroundColor:'#fff',elevation:1}}>
                    <View style = {{width:'100%',padding:10,borderWidth:1,borderColor:'#eee'}}>
                      <Text style = {{fontSize:14}}>ORDER ID - {item.fbin}</Text>
                    </View>
                    <View style = {{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                      <View style = {{width:'75%',padding:10}}>
                        <Text style = {{color:'#360',fontSize:16,fontWeight:'bold'}}>{item.product_name}</Text>
                        <Text>PODUCT ID - {item.product_id}</Text>
                        <Text style = {{color:'#369'}}>RS. {item.price}</Text>
                        <Text>Quantity - {item.product_qty}</Text>
                        <Text>Status - {item.status}</Text>
                        <Text style = {{color:'#360'}}>Purchased on {item.date}</Text>
                      </View>
                      <View style = {{width:'25%',height:120,alignItems:'center',justifyContent:'center'}}>
                        <Image style = {styles.image}
                          source ={{uri:config.IMG_URL+item.img}}>
                        </Image>
                      </View>
                    </View>
                    <View style = {{width:'100%',padding:10,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                      <View style = {{width:'70%'}}></View>
                      <View style = {{width:'30%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                        <Text style = {{color:'#369',fontWeight:'bold'}}
                          onPress = {()=>this.props.navigation.navigate('details',{slug:item.slug,header_image:item.img})}>Buy Now</Text>
                      </View>
                    </View>
                  </View>
                )}
              />
            </View>
          </ScrollView>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container : {
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#eee'
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
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
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
  image:{
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    resizeMode:'stretch'
  }
});
