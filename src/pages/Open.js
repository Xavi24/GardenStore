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

const cartData = [{'one':1,'two':2,'three':3}];
let openData = {};
export default class Open extends Component<{}>{
    constructor(props){
      super(props);
      this.state = {
        access_token : '',
        order_id : '',
        total_price : '',
        order_status : '',
        product_price : '',
        product_name : '',
        product_quantity : '',
        product_img : '',
        openData : [],
        cancel_order : '',
        id : '',
        show : false
      }
    }
    async _getAccessToken(){
      try {
        const value = await AsyncStorage.getItem('token');
        if (value !== null) {
          this.setState({
            access_token : value
          });
          this.getOrderDetails();
        }
      } catch (error) {
      }
    }
    getOrderDetails(){
      this.setState({
        show : true
      })
      let openDataArray = [];
      // console.warn('entered into opn order method');
      var url = config.API_URL+'user/openOrders';
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
        // console.warn('response//open orders............',response);
        this.setState({
          show : false
        })
        if (response.data){
          if (response.data.data){
            if (response.data.data.length > 0){
              this.state.openData.length = 0;
              for (let data of response.data.data){
                // console.warn('data',data);
                if (data.order_status == 'processing' || data.order_status == 'Processing') {
                  this.setState({
                    cancel_order : 'Cancel Order'
                  })
                }
                openData.order_id = data.order_id,
                openData.address_id = data.address_id,
                openData.date = data.date_purchased,
                openData.amount = data.amount,
                openData.order_status = data.order_status,
                openData.img = data.first_orderproduct.single_var_img.variation_image,
                openData.name = data.first_orderproduct.product_name,
                openData.product_order_id = data.first_orderproduct.order_product_id,
                openData.product_count = data.orderproducts_count

                openDataArray.push({
                  order_id : openData.order_id,
                  address_id : openData.address_id,
                  date : openData.date,
                  amount : openData.amount,
                  order_status : openData.order_status,
                  img : openData.img,
                  name : openData.name,
                  product_order_id : openData.product_order_id,
                  product_count : openData.product_count
                })
                this.setState({
                  openData : openDataArray
                })
              }
            }
          }
        }
      })
    }
    cancelOrder(id){
      this.setState({
        show : true
      })
      console.warn('mainid',id);
      var url = config.API_URL+'user/cancelOrder/'+id
      fetch(url, {
        method : 'PUT',
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
              show : false
            })
            console.warn('response',response);
            if (response.code == '200') {
              this.getOrderDetails();
            }
          })
    }
    componentWillMount(){
      this.setState({
        show : true
      })
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
            <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Open Order</Text>
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
                  items={this.state.openData}
                  renderItem={item => (
                    <View style = {{width:'100%',elevation:3,backgroundColor:'#fff',height:200}}>
                      <View style = {{width:'100%',padding:10,height:'80%',alignItems:'center',justifyContent:'center',borderBottomWidth:1,
                        borderBottomColor:'#eee'}}>
                          <View style = {{width:'100%',height:'70%',alignItems:'center',justifyContent:'center',flexDirection:'row',padding:10}}>
                            <View style = {{width:'70%',height:'100%'}}>
                              <Text style = {{color:'#000',fontSize:12}}>{item.name}</Text>
                              <Text style = {{color:'#360',fontSize:12}}>RS. {item.amount}</Text>
                            </View>
                            <View style = {{width:'30%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                            <Image style = {{width:'70%',height:'95%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                              source ={{uri:config.IMG_URL+item.img}}>
                            </Image>
                            </View>
                          </View>
                          <View style = {{width:'100%',height:'30%',padding:10,flexDirection:'row',alignItems:'center'}}>
                            <View style = {{height:10,width:10,borderRadius:10/2,backgroundColor:'#360',marginTop:5}}>

                            </View>
                            <Text style = {{marginLeft:10,fontSize:12}}>Purchased on {item.date}</Text>
                          </View>
                        </View>
                      <View style = {{width:'100%',height:'20%',alignItems:'center',justifyContent:'center'}}>
                        <Text style = {{color:'#369',fontSize:12,fontWeight:'bold'}}
                          onPress={()=>this.props.navigation.navigate('view_open_order',{order_id : item.order_id})}>View Order Details</Text>
                      </View>
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

          <TouchableHighlight style = {{width:'30%',height:'100%'}}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#525456'}}>
              <MaterialIcons
                name='query-builder'
                size={22}
                style = {{color:'#2fdab8'}}>
              </MaterialIcons>
              <Text style = {{color:'#2fdab8'}}>Open Order</Text>
            </View>
          </TouchableHighlight>

          <TouchableHighlight style = {{width:'35%',height:'100%'}}
            underlayColor = 'transparent'
            onPress = {()=>this.props.navigation.navigate('cancel')}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <MaterialIcons
                name='replay'
                size={22}
                style = {{color:'#fff'}}>
              </MaterialIcons>
              <Text style = {{color:'#fff'}}>Cancel Order</Text>
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
  }
})
