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

export default class ReturnProduct extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      returnIcn1 : 'check-box-outline-blank',
      returnIcn1Color : '#282a2d',
      returnIcn2 : 'check-box-outline-blank',
      returnIcn2Color : '#282a2d',
      returnIcn3 : 'check-box-outline-blank',
      returnIcn3Color : '#282a2d',
      replaceIcn1 : 'check-box-outline-blank',
      access_token : '',
      img : '',
      price : '',
      returnValue : '',
      name : '',
      removeScreen : false,
      show : false,
      success_screen : false
    }
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
    reFundProduct(){
      this.setState({
        removeScreen : false,
        show : true
      })
      console.warn('access_token',this.state.access_token);
      console.warn('rsn',this.state.returnValue);
      console.warn('order_product_id',this.state.order_product_id);
      let data = {};
      data.order_product_id = this.state.order_product_id,
      data.reason  = this.state.returnValue
        var url = config.API_URL+'user/refundProduct'
        console.warn('url//reFundProduct',data);
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
              })
              if (response.code == '200') {
                this.setState({
                  success_screen : true
                })
              }
                console.warn('response',response)
                if (response.errors) {
                  this.setState({
                    error_screen : true
                  })
                }
            })
    }
    replaceProduct(){
        console.warn('access_token',this.state.access_token);
        console.warn('rsn',this.state.replaceReason);
    }
    componentWillMount(){
        const {params} = this.props.navigation.state;
        this.setState({
            order_product_id : params.order_product_id,
            img : params.img,
            price : params.price,
            name : params.name
        });
        console.warn('params',params);
      this._getAccessToken().done();
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
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Refund Product</Text>
            </View>
            <View style={styles.iconView}>

            </View>
          </View>
          <View style = {styles.baseContainer}>
            <ScrollView style = {{width:'100%',marginTop:20,marginBottom:20}}>
              <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'96%',height:300,backgroundColor:'#fff',borderColor:'#eee',borderWidth:1,alignItems:'center',
                  justifyContent:'center',elevation:2}}>
                  <Image style = {{width:'90%',height:'70%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                    source = {{uri:config.IMG_URL+this.state.img}}>
                  </Image>
                  <Text style = {{color:'#369',fontSize:16,fontWeight:'bold',marginTop:5}}>{this.state.name}</Text>
                  <Text style = {{color:'#360',fontSize:16,fontWeight:'bold'}}>Price : {this.state.price}</Text>
                </View>
                <View style = {{width:'96%',backgroundColor:'#fff',borderColor:'#eee',borderWidth:1,alignItems:'center',
                  justifyContent:'center',marginTop:20,padding:10,elevation:2}}>
                  <View style = {{width:'100%'}}>
                    <Text style = {{fontSize:16,color:'#000',marginTop:5,marginBottom:10}}>Refund-Product</Text>
                  </View>
                  <TouchableHighlight style = {{width:'100%'}}
                    underlayColor = 'transparent'
                    onPress = {()=>this.setState({
                      returnIcn1 : 'check-box',
                      returnIcn1Color: '#360',
                      returnIcn2  :'check-box-outline-blank',
                      returnIcn2Color :'#282a2d',
                      returnIcn3 : 'check-box-outline-blank',
                      returnIcn3Color : '#282a2d',
                      returnValue : 'Dont like the product'
                    })}>
                    <View style = {{width:'100%',flexDirection:'row'}}>
                      <MaterialIcons
                          name={this.state.returnIcn1}
                          size={26}
                          style = {{color:this.state.returnIcn1Color}}>
                      </MaterialIcons>
                      <Text style = {{marginLeft:10,color:'#000',fontSize:16,fontWeight:'bold'}}>Dont like the product</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight style = {{width:'100%'}}
                    underlayColor = 'transparent'
                    onPress = {()=>this.setState({
                      returnIcn1 : 'check-box-outline-blank',
                      returnIcn1Color: '#282a2d',
                      returnIcn2  :'check-box',
                      returnIcn2Color :'#360',
                      returnIcn3 : 'check-box-outline-blank',
                      returnIcn3Color : '#282a2d',
                      returnValue : 'Wrong product'
                    })}>
                    <View style = {{width:'100%',flexDirection:'row'}}>
                      <MaterialIcons
                          name={this.state.returnIcn2}
                          size={26}
                          style = {{color:this.state.returnIcn2Color}}>
                      </MaterialIcons>
                      <Text style = {{marginLeft:10,color:'#000',fontSize:16,fontWeight:'bold'}}>Wrong product</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight style = {{width:'100%'}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.setState({
                    returnIcn1 : 'check-box-outline-blank',
                    returnIcn1Color: '#282a2d',
                    returnIcn2  :'check-box-outline-blank',
                    returnIcn2Color :'#282a2d',
                    returnIcn3 : 'check-box',
                    returnIcn3Color : '#360',
                    returnValue : 'Damaged product'
                  })}>
                    <View style = {{width:'100%',flexDirection:'row'}}>
                      <MaterialIcons
                          name={this.state.returnIcn3}
                          size={26}
                          style = {{color:this.state.returnIcn3Color}}>
                      </MaterialIcons>
                      <Text style = {{marginLeft:10,color:'#000',fontSize:16,fontWeight:'bold'}}>Damaged product</Text>
                    </View>
                  </TouchableHighlight>

                  <View style = {{width:'100%',height:45,alignItems:'center',justifyContent:'center',backgroundColor:'#369',borderBottomRightRadius:6,
                    borderBottomLeftRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6,marginTop:20}}>
                    <TouchableHighlight style = {{width:'100%',alignItems:'center',justifyContent:'center'}}
                      underlayColor = 'transparent'
                      onPress = {()=>this.setState({removeScreen:true})}>
                      <View>
                        <Text style = {{color:'#fff',fontSize:16,fontWeight:'bold'}}>Refond-Product</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
                <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
                  visible = {this.state.removeScreen}>
                  <View style = {{backgroundColor:'rgba(00,00,00,0.7)',borderBottomRightRadius:6,borderBottomLeftRadius:6,borderTopLeftRadius:6,
                    borderTopRightRadius:6,width:'95%',alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{fontSize:18,fontWeight:'bold',color:'#fff',marginTop:30,marginLeft:10}}>Do u really wants re-fund this product ?</Text>
                    <View style = {{width:'100%',marginTop:20,marginBottom:10,flexDirection:'row'}}>
                      <View style = {{width:'60%'}}></View>
                      <View style = {{width:'40%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                        <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                          onPress = {()=>this.setState({removeScreen:false})}>No</Text>
                        <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                          onPress = {()=>this.reFundProduct()}>Yes</Text>
                      </View>
                    </View>
                  </View>
                </AnimatedHideView>
              </View>
            </ScrollView>
          </View>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',
            justifyContent:'center',backgroundColor:'rgba(00, 00, 00, 0.7)',position:'absolute'}}
            visible = {this.state.success_screen}>
            <View style = {{width:'95%',height:'30%',backgroundColor:'#fff',alignItems:'center',justifyContent:'center',
              borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
              <Image style = {{height:80,width:80}}
                source = {require('../img/thumbs.png')}>
              </Image>
              <Text style = {{color:'#000',fontSize:22,fontWeight:'bold',marginTop:10}}>Success</Text>
              <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                <View></View>
                <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                  onPress = {()=>this.props.navigation.navigate('my_order')}>OK</Text>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
              position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}
                            visible = {this.state.error_screen}>
              <View style = {{width:'95%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',
                  borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
                  <Image style = {{width:60,height:60,marginTop:20}}
                         source = {require('../img/attention.png')}>
                  </Image>
                  <Text style = {{fontSize:22,fontWeight:'bold',color:'#000',marginTop:10,textAlign:'center'}}>
                  There is some problem with re-fund your Product. Please select Your
                      reson </Text>
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
});
