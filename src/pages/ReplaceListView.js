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
  BackHandler
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import config from '../API/config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import Spinner from 'react-native-loading-spinner-overlay'
import GridView from 'react-native-super-grid'
import Toast from 'react-native-simple-toast'

let variationData = [];
export default class ReplaceListView extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      order_product_id : '',
      replaceValue:'',
      error_screen : false,
      success_screen : false,
      show : false,
      access_token : ''
    }
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    console.warn('params',params);
    variationData.length = 0;
    for (let data of params.data.data) {
      variationData.push({
        id:data.id,
        name:data.name,
        price:data.price,
        img:data.variation_image_single.variation_image,
        slug:data.slug
      })
    }
    this.setState({
      order_product_id : params.order_product_id,
      replaceValue : params.replaceValue
    });
    this._getAccessToken().done();
  }
  async _getAccessToken() {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token: value
        })
        // this.saveAddress();
      }
    } catch (error) {
      console.warn(error.message);
    }

  }
  replaceProduct(id){
    console.warn('replaceValue',this.state.replaceValue);
    console.warn('order_product_id',this.state.order_product_id);
    console.warn('id',id);
    let data = {};
    data.order_product_id = this.state.order_product_id;
    data.reason  = this.state.replaceValue;
    data.replaced_variation_id = id;
    var url = config.API_URL+'user/replaceRequestProduct';
    console.warn('url//replaceRequestProduct',data);
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization' : this.state.access_token
      })
    })
        .then((response)=>response.json())
        .catch((error)=>console.warn(error))
        .then((response)=>{
          this.setState({
            show : false
          });
          if (response.code == '200'){
            this.setState({
              success_screen:true
            });
          }
          if (response.code == '409') {
            this.setState({
              error_screen : true,
              error_message : response.message
            })
          }
          console.warn('response',response);

        })
  }
  render() {
    const {goBack} = this.props.navigation;
    return (
        <View style={styles.container}>
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
              <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Replace Product</Text>
            </View>
            <View style={styles.iconView}>

            </View>
          </View>
          <View style={styles.baseContainer}>
            <GridView
                itemDimension = {180}
                items = {variationData}
                style = {styles.gridView}
                spacing = {2}
                renderItem = {item =>
                    <View style = {{elevation:3,height:300,width:'100%',backgroundColor:'#fff'}}>
                      <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                          underlayColor = 'transparent'
                                          onPress = {()=>this.props.navigation.navigate('details',{slug:item.slug,img:item.img})}>
                        <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                          <Image style = {{height:'65%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                 source ={{uri:config.IMG_URL+item.img}}>
                          </Image>
                          <View style = {{height:'35%',width:'100%',alignItems:'center',justifyContent:'center',padding:5}}>
                            <View style = {{width:'100%',height:'75%'}}>
                              <Text style = {{color:'#595656',fontSize:12,marginLeft:5}}>{item.name}</Text>
                              <View style = {{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',
                                marginTop:6,marginBottom:5}}>
                                <View style = {{flexDirection:'row',marginLeft:5}}>
                                  <Image style = {{width:11,height:11,alignItems:'center',justifyContent:'center',resizeMode:'stretch',marginTop:4}}
                                         source = {require('../img/curr.png')}>
                                  </Image>
                                  <Text style = {{color:'#360',fontSize:12,marginLeft: 5}}>{item.price}</Text>
                                </View>
                              </View>
                            </View>
                            <View style={{width:'100%',height:'25%',backgroundColor:'#369'}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                underlayColor='transparent'
                                onPress = {()=>this.replaceProduct(item.id)}>
                                <Text style={{color:'#fff',fontSize:14,fontWeight:'bold'}}>Continue</Text>
                              </TouchableHighlight>
                            </View>
                          </View>
                        </View>
                      </TouchableHighlight>
                    </View>
                }
            />
          </View>
          <AnimatedHideView
              visible = {this.state.success_screen}
              style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',backgroundColor:'#fff'}}>
            <View style = {styles.toolbar}>
              <View style = {styles.menuView}>
                <TouchableHighlight underlayColor = 'transparent'
                                    onPress = {()=>goBack()}>
                  <MaterialIcons
                      name='close'
                      size={22}
                      style = {{color:'#fff'}}>
                  </MaterialIcons>
                </TouchableHighlight>
              </View>
              <View style = {styles.textView}>
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Close</Text>
              </View>
              <View style = {styles.iconView}>

              </View>
            </View>
            <View style = {styles.baseContainer}>
              <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Image style = {{width:60,height:60,alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                       source = {require('../img/checked.png')}>
                </Image>
                <Text style = {{marginTop:10,fontSize:16,fontWeight:'bold'}}>Your product ordered successfully</Text>
                <View style = {{width:'90%',height:40,backgroundColor:'#369',marginTop:20,alignItems:'center',justifyContent:'center'}}>
                  <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                                      underlayColor = 'transparent'
                                      onPress = {()=>this.props.navigation.navigate('open')}>
                    <Text style = {{color:'#fff',fontSize:16,fontWeight:'bold'}}>View Orders</Text>
                  </TouchableHighlight>
                </View>
                <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
            position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}
                            visible = {this.state.error_screen}>
            <View style = {{width:'80%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',elevation:2,height:150}}>
              <TouchableHighlight underlayColor='transparent'>
                <MaterialIcons
                    name='error'
                    size={36 }
                    style = {{color:'#800000'}}>
                </MaterialIcons>
              </TouchableHighlight>
              <Text style = {{fontSize:16,color:'#565959',marginTop:10,textAlign:'center'}}>{this.state.error_message}</Text>
              <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:10,marginBottom:10}}>
                <View>

                </View>
                <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                      onPress = {()=>this.setState({error_screen : false})}>OK</Text>
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
  }
});
