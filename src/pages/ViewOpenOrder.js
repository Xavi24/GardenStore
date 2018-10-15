import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    AsyncStorage,
    StatusBar,
    TouchableHighlight,
    Image,
    BackHandler,
    FlatList
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import config from '../API/config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import Spinner from 'react-native-loading-spinner-overlay'
import GridView from 'react-native-super-grid'
import Toast from 'react-native-simple-toast'

export default class ViewOpenOrder extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      order_id : '',
      productArray : [],
      address : {},
      cancel_item : '',
      show : false,
      removeScreen : false,
      order_product_id : '',
      mes : [],
      points : '',
      pointText : '',
      discount_text : '',
      discount : '',
      discountIcon  :'',
      total : 0,
      pay_amount : '',
      pay_product_mrp : '',
      pay_status : '',
      pay_date : '',
      pay_payment_method : ''

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
      console.warn('error',error.message);
    }
  }

  componentWillMount(){
    const {params} = this.props.navigation.state;
    this.setState({
      order_id : params.order_id
    });
    this.setState({
      show : true
    });
    this._getAccessToken();
  }
  getOrderDetails(){
    this.setState({
      show : true,
    });
    let orderProduct = {};
    let productArray = [];
    console.warn('id',this.state.order_id);
    var url = config.API_URL+'user/orderDetails/'+this.state.order_id;
    fetch(url, {
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
        console.log('..................',response.data);
        this.setState({
          address : response.data.address,
          show : false
        });
        console.warn('address',this.state.address);
        if (response) {
          if (response.data) {
            if (response.data.is_points == 1){
              this.setState({
                points : response.data.points,
                pointText : 'Points Used - '
              })
            }
            this.setState({
              pay_amount : response.data.amount,
              pay_date : response.data.date_purchased,
              pay_payment_method : response.data.payment_method
            })
            orderProduct.date = response.data.date_purchased;
            orderProduct.amount = response.data.amount;
            orderProduct.fbin = response.data.fbin;
            orderProduct.payment_method = response.data.payment_method;
            if (response.data.orderproducts) {
              if (response.data.orderproducts.length >0) {
                this.state.productArray.length = 0;
                for(let data of response.data.orderproducts){
                  for (let mesData of data.measurements){
                    this.state.mes.push({
                      name : mesData.measurement_name,
                      value : mesData.value
                    })
                  }
                  if (data.total_discount>0){
                    this.setState({
                      discount_text : 'Discount - ',
                      discount : data.total_discount,
                      discountIcon : ' %'
                    })
                  }
                  console.warn('{{{{{{{{}}}}}}}}}}}',this.state.mes);
                  console.warn('status/////',data.purchase_price);
                  console.warn('data',data);
                  if (data.order_last_status.status == 'Cancelled' || data.order_last_status.status == 'cancelled') {
                    orderProduct.btn_name = ''
                  } else if (data.order_last_status.status == 'processing' || data.order_last_status.status == 'Processing') {
                    orderProduct.btn_name = 'Cancel Item'
                  }
                  this.setState({
                    pay_product_mrp : data.product_mrp,
                    pay_status : data.order_last_status.status
                  });
                  orderProduct.order_product_id = data.order_product_id;
                  orderProduct.product_id = data.product_id;
                  orderProduct.product_name = data.product_name;
                  orderProduct.product_price = data.product_price;
                  orderProduct.product_qty = data.product_qty;
                  orderProduct.measurements = data.measurements;
                  orderProduct.img = data.single_var_img.variation_image;
                  orderProduct.status = data.order_last_status.status;
                  orderProduct.slug = data.variation.slug;
                  orderProduct.purchased_price = data.purchase_price;
                  orderProduct.total = data.product_mrp;

                  productArray.push({
                    date : orderProduct.date,
                    amount : orderProduct.amount,
                    order_product_id : orderProduct.order_product_id,
                    product_id : orderProduct.product_id,
                    product_name : orderProduct.product_name,
                    product_price : orderProduct.product_price,
                    product_qty : orderProduct.product_qty,
                    measurements : orderProduct.measurements,
                    img : orderProduct.img,
                    status : orderProduct.status,
                    btn_name : orderProduct.btn_name,
                    slug : orderProduct.slug,
                    mes : this.state.mes,
                    fbin : orderProduct.fbin,
                    points : this.state.points,
                    pointText : this.state.pointText,
                    purchase_price : orderProduct.purchased_price,
                    payment_method : orderProduct.payment_method,
                    discountText : this.state.discount_text,
                    discount : this.state.discount,
                    discountIcon : this.state.discountIcon,
                    total : orderProduct.total
                  });
                  this.setState({
                    productArray : productArray
                  })
                }
                console.warn('productArray',this.state.productArray);
              }
            }
          }
        }
      })
  }
  cancelItem(id){
    this.setState({
      show : true,
      removeScreen : false
    })
    console.warn('mainid',id);
    var url = config.API_URL+'user/cancelProduct/'+id
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
            this.props.navigation.navigate('cancel')
          }
        })
  }
  render(){
    const {goBack} = this.props.navigation;
    return(
      <View style = {styles.container}>
        <View style={styles.toolbar}>
          <View style={styles.menuView}>
              <TouchableHighlight underlayColor='transparent'
                  onPress = {()=>goBack()}>
                  <MaterialIcons
                      name='arrow-back'
                      size={22}
                      style = {{color:'#fff'}}>
                  </MaterialIcons>
              </TouchableHighlight>
          </View>
          <View style={styles.textView}>
              <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Order Details</Text>
          </View>
          <View style={styles.iconView}>

          </View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView
            showsVerticalScrollIndicator = {false}>
            <View style = {{alignItems:'center',justifyContent:'center'}}>
              <GridView
                itemDimension={360}
                items={this.state.productArray}
                renderItem={item => (
                    <View style = {{width:'100%',backgroundColor:'#fff',elevation:2}}>
                      <View style = {{width:'100%',padding:10,borderWidth:1,borderColor:'#eee'}}>
                        <Text style = {{fontSize:14}}>ORDER ID - {item.fbin}</Text>
                      </View>
                      <View style = {{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <View style = {{width:'75%',padding:10}}>
                          <Text style = {{color:'#360',fontSize:14,fontWeight:'bold'}}
                             onPress = {()=>this.props.navigation.navigate('details',{slug:item.slug,header_image:item.img})}>{item.product_name}</Text>
                          <Text style = {{color:'#369',fontSize:12}}>RS. {item.product_price}</Text>
                          <Text style = {{color:'#369',fontSize:12}}>Purchase Price - {item.amount}</Text>
                          <Text style={{fontSize:12}}>Quantity - {item.product_qty}</Text>
                          {/*<Text style={{fontSize:12}}>Payment Method - {item.payment_method}</Text>*/}
                          {/*<Text>{item.discountText+''+item.discount+""+item.discountIcon}</Text>*/}
                          {/*<Text style={{fontSize:12}}>{item.pointText} {item.points}</Text>*/}
                          {/*<Text style={{fontSize:12}}>Status - {item.status}</Text>*/}
                          <Text style = {{color:'#360',fontSize:12}}>Purchased on {item.date}</Text>
                          <View style = {{width:'100%'}}>
                            <View style = {{width:'100%',marginLeft:5}}>
                              <GridView
                                  itemDimension={360}
                                  items={item.mes}
                                  renderItem={item => (
                                      <View style = {{width:'100%',flexDirection:'row'}}>
                                        <View style = {{width:'70%'}}>
                                          <Text style = {{fontSize:12,color:'#000',fontWeight:'bold'}}>{item.name}</Text>
                                        </View>
                                        <View style = {{width:'30%',justifyContent:'center',marginLeft:5}}>
                                          <Text style = {{fontSize:12,fontWeight:'bold',color:'#006400',textAlign: 'left'}}>{item.value}</Text>
                                        </View>
                                      </View>
                                  )}
                              />
                            </View>
                          </View>
                        </View>
                        <View style = {{width:'25%',height:120,alignItems:'center',justifyContent:'center'}}>
                          <TouchableHighlight underlayColor='transparent'
                            style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                            onPress = {()=>this.props.navigation.navigate('details',{slug:item.slug,header_image:item.img})}>
                            <Image style = {styles.image}
                                   source ={{uri:config.IMG_URL+item.img}}>
                            </Image>
                          </TouchableHighlight>
                          <Text style={{fontSize : 12,color:'#360',marginTop:5}}>MRP - {item.total}</Text>
                        </View>
                      </View>
                      <View style = {{width:'100%',padding:10,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                        <View style = {{width:'70%'}}></View>
                        <View style = {{width:'30%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                          <Text style = {{color:'#369',fontWeight:'bold',fontSize:12}}
                            onPress = {()=>this.setState({order_product_id:item.order_product_id,removeScreen:true})}>{item.btn_name}</Text>
                        </View>
                      </View>
                    </View>
                )}
              />
              <View style = {{width:'95%',padding:10,backgroundColor:'#fff',marginBottom:10,elevation:2}}>
                <Text style = {{color:'#000',fontSize:16,fontWeight:'bold'}}>Shipping Details : </Text>
                <Text style = {{marginTop:10,color:'#369',fontSize:15,fontWeight:'bold'}}>{this.state.address.name}</Text>
                <Text>{this.state.address.street_address}</Text>
                <Text>{this.state.address.area+','+this.state.address.building}</Text>
                <Text>{this.state.address.country}</Text>
                <Text style = {{color:'#360',fontWeight:'bold'}}>Pin Code - {this.state.address.postcode}</Text>
                <Text style = {{color:'#000',fontWeight:'bold'}}>Mobile Number - {this.state.address.phone_no}</Text>
              </View>
              <View style = {{width:'95%',padding:10,backgroundColor:'#fff',marginBottom:10,elevation:1}}>
                <Text style = {{color:'#000',fontSize:16,fontWeight:'bold'}}>Payment Details : </Text>
                <Text style = {{marginTop:10,color:'#369',fontSize:15,fontWeight:'bold'}}>Payed - {this.state.pay_amount}</Text>
                <Text>{this.state.discount_text+''+this.state.discount+""+this.state.discountIcon}</Text>
                <Text>Status - {this.state.pay_status}</Text>
                <Text style = {{color:'#360',fontWeight:'bold'}}>Date - {this.state.pay_date}</Text>
                <Text style = {{color:'#000',fontWeight:'bold',fontSize:12}}>Payment Method - {this.state.pay_payment_method}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
        <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
          visible = {this.state.removeScreen}>
          <View style = {{backgroundColor:'#282a2d',width:'95%',alignItems:'center',justifyContent:'center'}}>
            <Text style = {{fontSize:18,fontWeight:'bold',color:'#fff',marginTop:30}}>Do u really wants cancel the order ?</Text>
            <View style = {{width:'100%',marginTop:20,marginBottom:10,flexDirection:'row'}}>
              <View style = {{width:'60%'}}></View>
              <View style = {{width:'40%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                  onPress = {()=>this.setState({removeScreen:false})}>No</Text>
                <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                  onPress = {()=>this.cancelItem(this.state.order_product_id)}>Yes</Text>
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
      flexDirection:'row',
      backgroundColor:'#282a2d'
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
  textView:{
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
