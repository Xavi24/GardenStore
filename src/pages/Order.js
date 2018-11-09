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
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
};

export default class Order extends Component<{}>{
    constructor(props){
      super(props);
      this.state = {
        access_token : '',
        myOrderArray : [],
        show : false,
        error_screen : false,
        next_page_url : ''
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
        } else {
          this.setState({
            show : false,
            error_screen : true
          })
        }
      } catch (error) {
      }
    }
    getOrderDetails(){
      let myOrderData = {};
      let myOrderArray = [];
      var url = config.API_URL+'user/orders';
      console.log('+++++++++++++?????????????????????',this.state.access_token);
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
        this.setState({
          show : false
        })
        this.setState({
          next_page_url : response.data.next_page_url
        })
        console.log('response//myorders........',response);
        if (response) {
          if (response.data) {
            if (response.data.data.length >0) {
              for(let data of response.data.data){
                console.warn('data',data);
                myOrderData.order_id = data.order_id;
                myOrderData.address_id = data.address_id;
                myOrderData.date = data.date_purchased;
                myOrderData.amount = data.amount;
                myOrderData.order_status = data.order_status;
                myOrderData.img = data.first_orderproduct.single_var_img.variation_image;
                myOrderData.name = data.first_orderproduct.product_name;
                myOrderData.product_order_id = data.first_orderproduct.order_product_id;
                myOrderData.product_count = data.orderproducts_count;
                myOrderData.fbin = data.fbin;

                myOrderArray.push({
                  order_id : myOrderData.order_id,
                  address_id : myOrderData.address_id,
                  date : myOrderData.date,
                  amount : myOrderData.amount,
                  order_status : myOrderData.order_status,
                  img : myOrderData.img,
                  name : myOrderData.name,
                  product_order_id : myOrderData.product_order_id,
                  product_count : myOrderData.product_count,
                  fbin : myOrderData.fbin
                });
                this.setState({
                  myOrderArray : myOrderArray
                });
                // console.warn('myOrderData',this.state.myOrderArray);
              }
            }
          }
        }
      })
    }
  handleScroll(){
      console.warn('reached to bottom');
      if (this.state.next_page_url !== null){
        let myOrderData = {};
        let myOrderArray = [];
        var url = this.state.next_page_url;
        console.log('+++++++++++++?????????????????????',this.state.access_token);
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
              this.setState({
                show : false
              })
              this.setState({
                next_page_url : response.data.next_page_url
              })
              console.log('response//myorders........',this.state.next_page_url);
              if (response) {
                if (response.data) {
                  if (response.data.data.length >0) {
                    for(let data of response.data.data){
                      console.warn('data',data);
                      myOrderData.order_id = data.order_id;
                      myOrderData.address_id = data.address_id;
                      myOrderData.date = data.date_purchased;
                      myOrderData.amount = data.amount;
                      myOrderData.order_status = data.order_status;
                      myOrderData.img = data.first_orderproduct.single_var_img.variation_image;
                      myOrderData.name = data.first_orderproduct.product_name;
                      myOrderData.product_order_id = data.first_orderproduct.order_product_id;
                      myOrderData.product_count = data.orderproducts_count;
                      myOrderData.fbin = data.fbin;

                      myOrderArray.push({
                        order_id : myOrderData.order_id,
                        address_id : myOrderData.address_id,
                        date : myOrderData.date,
                        amount : myOrderData.amount,
                        order_status : myOrderData.order_status,
                        img : myOrderData.img,
                        name : myOrderData.name,
                        product_order_id : myOrderData.product_order_id,
                        product_count : myOrderData.product_count,
                        fbin : myOrderData.fbin
                      });
                      this.setState({
                        myOrderArray : myOrderArray
                      });
                      // console.warn('myOrderData',this.state.myOrderArray);
                    }
                  }
                }
              }
            })
      }
  }
    componentWillMount(){
      this.setState({
        show : true
      });
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
            showsVerticalScrollIndicator = {false}
                      onScroll={({nativeEvent}) => {
                        if (isCloseToBottom(nativeEvent)) {
                          this.handleScroll();
                        }
                      }}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <GridView
                  itemDimension={360}
                  items={this.state.myOrderArray}
                  renderItem={item => (
                    <View style = {{width:'100%',elevation:3,backgroundColor:'#fff',height:200}}>
                    <TouchableHighlight style = {{height:'80%',width:'100%'}}
                      underlayColor = 'transparent'>
                      <View style = {{width:'100%',padding:10,height:'100%',alignItems:'center',justifyContent:'center',borderBottomWidth:1,
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
                        <View style = {{width:'100%',height:'30%',padding:10,flexDirection:'row'}}>
                          <View style = {{height:10,width:10,borderRadius:10/2,backgroundColor:'#360',marginTop:5}}></View>
                          <Text style = {{marginLeft:10,fontSize:12}}>Purchased on {item.date}</Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                    <TouchableHighlight  style = {{width:'100%',height:'20%'}}
                      underlayColor = 'transparent'
                      onPress = {()=>this.props.navigation.navigate('view_my_order',{order_id : item.order_id})}>
                      <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                        <Text style = {{color:'#369',fontSize:14,fontWeight:'bold'}}>View Order Details</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                )}
              />
            </View>
          </ScrollView>
          <View style = {{width:'100%',height:50,backgroundColor:'#282a2d',flexDirection:'row'}}>
            <TouchableHighlight style = {{width:'35%',height:'100%'}}>
              <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#525456'}}>
                <MaterialIcons
                  name='check-circle'
                  size={22}
                  style = {{color:'#2fdab8'}}>
                </MaterialIcons>
                <Text style = {{color:'#2fdab8'}}>Order</Text>
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
        <AnimatedHideView
            visible = {this.state.error_screen}
            style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',backgroundColor:'#fff'}}>
          <View style = {styles.toolbar}>
            <View style = {{height:'100%',width:'10%',alignItems:'center',justifyContent:'center'}}>
              <TouchableHighlight underlayColor = 'transparent'
                                  onPress = {()=>{this.props.navigation.navigate('mainscreen')}}>
                <MaterialIcons
                    name='arrow-back'
                    size={22}
                    style = {{color:'#fff'}}>
                </MaterialIcons>
              </TouchableHighlight>
            </View>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'center',height:'100%'}}>
              <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Garden Store</Text>
            </View>
          </View>
          <View style = {{width:'100%',height:'92%'}}>
            <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <Image style = {{width:80,height:80,alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                     source = {require('../img/dislike.png')}>
              </Image>
              <Text style = {{fontSize:30,color:'#000',marginTop:10}}>Oops!</Text>
              <Text style = {{fontSize:18,marginTop:20,textAlign:'center'}}>Seems like you are note a member here</Text>
              <Text style = {{fontSize:18,textAlign:'center'}}>Your Attempt has failed. An error has occured, back and try again</Text>
              <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <Text style = {{fontSize:16,marginTop:20}}>Already have an account ?</Text>
                <Text style = {{color:'#369',marginLeft:10,fontSize:16,marginTop:20}}
                      onPress = {()=>this.props.navigation.navigate('logn',{page:'mainscreen',next:'order'})}>Login Here</Text>
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
