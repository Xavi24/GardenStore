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

export default class Cancel extends Component<{}>{
    constructor(props){
      super(props);
      this.state = {
        access_token : '',
        cArray : [],
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
            <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Order</Text>
          </View>
          <View style = {styles.iconView}>
          </View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView style = {{width:'100%',height:'100%'}}
            showsVerticalScrollIndicator = {false}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <GridView
                itemDimension={360}
                items={this.state.cArray}
                renderItem={item => (
                  <View style = {{width:'100%',elevation:3,backgroundColor:'#fff',height:250}}>
                    <View style = {{width:'100%',padding:10,height:'80%',alignItems:'center',justifyContent:'center',borderBottomWidth:1,
                      borderBottomColor:'#eee'}}>
                        <View style = {{width:'100%',height:'15%',borderBottomWidth:1,borderBottomColor:'#eee',alignItems:'center'}}>
                          <Text style = {{fontSize:12}}>ORDER ID - {item.fbin}</Text>
                        </View>
                        <View style = {{width:'100%',height:'60%',alignItems:'center',justifyContent:'center',flexDirection:'row',padding:10}}>
                          <View style = {{width:'70%',height:'100%'}}>
                            <Text style = {{color:'#000',fontSize:12}}>{item.name}</Text>
                            <Text style = {{color:'#360',fontSize:12}}>RS. {item.amount}</Text>
                            <Text style={{fontSize:12}}>Quantity - {item.product_qty}</Text>
                            <Text style={{fontSize:12}}>Status - {item.status}</Text>
                          </View>
                          <View style = {{width:'30%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                          <Image style = {{width:'80%',height:'99%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                            source ={{uri:config.IMG_URL+item.img}}>
                          </Image>
                          </View>
                        </View>
                        <View style = {{width:'100%',height:'25%',padding:10,flexDirection:'row'}}>
                          <View style = {{height:10,width:10,borderRadius:10/2,backgroundColor:'#360',marginTop:5}}></View>
                          <Text style = {{marginLeft:10,fontSize:12}}>Purchased on {item.date}</Text>
                        </View>
                      </View>
                      <TouchableHighlight style = {{width:'100%',height:'20%',alignItems:'center',justifyContent:'center'}}
                        underlayColor = 'transparent'
                        onPress = {()=>this.props.navigation.navigate('details',{slug:item.slug,header_image:item.img})}>
                        <View style = {{width:'100%',height:'20%',alignItems:'center',justifyContent:'center'}}>
                          <Text style = {{color:'#369',fontSize:12,fontWeight:'bold'}}>Buy this Product Again</Text>
                        </View>
                      </TouchableHighlight>
                  </View>
                )}
              />
            </View>
          </ScrollView>
          <View style = {{width:'100%',height:50,backgroundColor:'#282a2d',flexDirection:'row'}}>
          <TouchableHighlight style = {{width:'35%',height:'100%'}}
            underlayColor = 'transparent'
            onPress = {()=>this.props.navigation.navigate('order')}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <MaterialIcons
                name='check-circle'
                size={22}
                style = {{color:'#fff'}}>
              </MaterialIcons>
              <Text style = {{color:'#fff'}}>Order</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style = {{width:'30%',height:'100%'}}
            underlayColor = 'transparent'
            onPress = {()=>this.props.navigation.navigate('open')}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <MaterialIcons
                name='query-builder'
                size={22}
                style = {{color:'#fff'}}>
              </MaterialIcons>
              <Text style = {{color:'#fff'}}>Open Order</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style = {{width:'35%',height:'100%'}}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#525456'}}>
              <MaterialIcons
                name='replay'
                size={22}
                style = {{color:'#2fdab8'}}>
              </MaterialIcons>
              <Text style = {{color:'#2fdab8'}}>Cancel Order</Text>
            </View>
          </TouchableHighlight>
          </View>
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
})
