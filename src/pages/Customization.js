import React,{Component} from 'react'
import {View,
        Text,
        TextInput,
        Image,
        StyleSheet,
        TouchableHighlight,
        ScrollView,
        FlatList,
        AsyncStorage
  } from 'react-native'
import GridView from 'react-native-super-grid'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button'

var radio_props = [
  {label: 'Debit', value: 0 },
  {label: 'Credit', value: 1 },
  {label: 'Cash on Delivery', value: 2}
];
let measures = [];
export default class Customization extends Component<{}>{
  static navigationOptions = {
    header:null
  }
  constructor(props){
    super(props);
    this.state = {
      Data : [],
      buynowScreen : false,
      success_screen : false,
      selectedData : [],
      measurements : [],
      product_name : '',
      prize : '',
      header_image : '',
      product_id : '',
      vendor_id : '',
      des_screen : false,
      des : '',
      login_cnfrm_screen:false,
      access_token : ''
    }
  }
  updateValue(text,field,index){
    console.warn('text',text);
    console.warn('field',field);
    console.warn('index',index);
    measures[index] = {
      product_measurement_id : field,
      value : text
    }
    this.setState({
      measurements : measures
    })
    console.warn('measures////',this.state.measurements);
  }
  placeOrder(){
    this.props.navigation.navigate('buy_now',{
      product_name:this.state.product_name,
      prize:this.state.prize,
      img:this.state.header_image,
      product:this.state.product_id,
      vendor:this.state.vendor_id,
      measurements:this.state.measurements
    })
    // this.setState({
    //   placeOrderScreen:false,
    //   success_screen:true
    // })
  }
  payment_method(value){
    if (value == '0') {
      this.setState({
        payment_method : 'DEBIT'
      })
    } else if (value == '1') {
      this.setState({
        payment_method : 'CREDIT'
      })
    } else if (value == '2') {
      this.setState({
        payment_method : 'COD'
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
      }
    } catch (error) {
      console.warn('error',error.message);
    }
  }
  componentWillMount(){
    this._getAccessToken();
    const {params} = this.props.navigation.state;
    console.warn('params',params);
    this.state.Data = params.data;
    for(let p_data of params.p_data){
      console.warn('p_data',p_data);
      this.setState({
        header_image : p_data.img,
        product_name : p_data.product_name,
        prize : p_data.prize,
        product_id : p_data.product,
        vendor_id : p_data.vendor
      })
    }
  }
  render(){
    const {goBack} = this.props.navigation
    return(
      <View style = {{width:'100%',height:'100%'}}>
        <View style = {styles.container}>
          <View style = {{width:'100%',height:'8%',alignItems:'center',justifyContent:'center'}}>
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
                <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Customisation</Text>
              </View>
              <View style = {styles.iconView}></View>
            </View>
          </View>
          <View style = {styles.baseContainer}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style = {{width:'93%',height:'95%',backgroundColor:'#fff',elevation:4,alignItems:'center',justifyContent:'center'}}>
                <Text style = {{color:'#000',fontSize:26,fontWeight:'bold'}}>Enter Your Requirements</Text>
                <View style = {{width:'90%',marginTop:20,alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{fontSize:18,textAlign:'center'}}> We providing an extream option for customising you dress with your
                    owm concepts. Enter your needed requirements below
                    according to the information provided</Text>
                </View>
                <View style = {{width:'100%',alignItems:'center',justifyContent:'center',marginTop:30}}>
                  <ScrollView style = {{width:'100%'}}>
                    <View style = {{alignItems:'center',justifyContent:'center'}}>
                      <View style = {{width:'95%',borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,
                        borderTopRightRadius:6,borderWidth:1,borderColor:'#bbb',alignItems:'center',justifyContent:'center'}}>
                        <FlatList
                          data={this.state.Data}
                          renderItem={({ item, index }) => (
                            <View style = {{width:'100%',alignItems:'center',flexDirection:'row',marginBottom:10}}>
                              <TextInput style = {styles.input}
                                underlineColorAndroid='#369'
                                placeholder={item.name}
                                placeholderTextColor="#369"
                                keyboardType = 'numeric'
                                onChangeText = {(text_data)=>this.updateValue(text_data, item.product_measurement_id, index)}>
                              </TextInput>
                              <TouchableHighlight underlayColor = 'transparent'
                                style = {{marginLeft:10}}
                                onPress = {()=>this.setState({des_screen:true,des:item.description})}>
                              <MaterialIcons
                                name='info'
                                size={30}
                                style = {{color:'#360'}}>
                              </MaterialIcons>
                            </TouchableHighlight>
                            </View>
                          )}
                        />
                      </View>
                    </View>
                  </ScrollView>
                </View>
                <TouchableHighlight underlayColor = 'transparent'
                  style = {{width:'50%',height:45,backgroundColor:'#48c7f0',marginTop:20,borderBottomLeftRadius:6,
                  borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}
                  onPress = {()=>{
                    if (this.state.access_token!='') {
                      this.placeOrder();
                    } else {
                      this.setState({
                        login_cnfrm_screen : true
                      })
                    }
                  }}>
                  <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{color:'#fff'}}>Buy Now</Text>
                  </View>
                </TouchableHighlight>
              </View>
            </View>
          </View>
        </View>
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(00, 00, 00, 0.7)',
          position:'absolute',borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}
          visible = {this.state.buynowScreen}>
          <View style = {{width:'95%',height:'40%',backgroundColor:'100%',alignItems:'center',justifyContent:'center',
            borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6,backgroundColor:"#fff"}}>
            <Text style = {{color:'#000',fontWeight:'bold',fontSize:20,textAlign:'center'}}>Are you sure you want to buy these product?</Text>
            <View style = {{width:'95%'}}>
              <Text style = {{marginTop:30,fontSize:16,fontWeight:'bold',marginBottom:10}}>Choose your payment method</Text>
              <RadioForm
                radio_props={radio_props}
                initial={false}
                buttonColor={'#2196f3'}
                selectedLabelColor={'#66023c'}
                buttonSize={10}
                selectedButtonColor={'#66023c'}
                buttonOuterSize={20}
                animation={true}
                formHorizontal={true}
                onPress={(value) => this.payment_method(value)}
              />
            </View>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:30}}>
              <View style = {{width:'50%'}}></View>
              <View style = {{width:'50%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                <Text style = {{color:'#369',fontSize:18,fontWeight:'bold'}}
                  onPress = {()=>this.placeOrder()}>Proceed</Text>
                <Text style = {{color:'#800000',fontSize:18,fontWeight:'bold'}}
                  onPress = {()=>this.setState({buynowScreen:false})}>Cancel</Text>
              </View>
            </View>
          </View>
        </AnimatedHideView>
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',
          backgroundColor:'rgba(00, 00, 00, 0.7)',position:'absolute'}}
          visible = {this.state.success_screen}>
          <View style = {{width:'95%',height:'30%',backgroundColor:'#fff',alignItems:'center',justifyContent:'center',
            borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
            <Image style = {{height:80,width:80}}
              source = {require('../img/order.png')}>
            </Image>
            <Text style = {{color:'#000',fontSize:22,fontWeight:'bold',marginTop:10}}>Success</Text>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
              <View></View>
              <Text style = {{fontSize:16,fontWeight:'bold',color:'#660000'}}
                onPress = {()=>this.props.navigation.navigate('mainscreen')}>OK</Text>
            </View>
          </View>
        </AnimatedHideView>
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
          visible = {this.state.des_screen}>
          <View style = {styles.container}>
            <View style = {{width:'100%',height:'8%',alignItems:'center',justifyContent:'center'}}>
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
                  <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Customisation</Text>
                </View>
                <View style = {styles.iconView}></View>
              </View>
            </View>
            <View style = {styles.baseContainer}>
              <View style = {{height:'80%',width:'95%',backgroundColor:'#fff',elevation:4}}>
                <ScrollView style = {{width:'100%',height:'100%'}}>
                  <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{textAlign:'center',fontSize:18,fontWeight:'bold',color:'#360',marginTop:20,marginBottom:20}}>Read The Below Content Carefully</Text>
                    <Text style = {{textAlign:'center',fontSize:16,fontWeight:'bold',color:'#000',marginTop:20,marginBottom:20}}>{this.state.des}</Text>
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        </AnimatedHideView>
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
          visible = {this.state.login_cnfrm_screen}>
          <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
            <View style = {{width:'100%',height:'80%'}}></View>
            <View style = {{width:'95%',height:'15%',backgroundColor:'rgba(00, 00, 00, 0.7)',alignItems:'center',justifyContent:'center',
              borderBottomRightRadius:6,borderBottomLeftRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
              <Text style = {{color:'#fff',fontWeight:'bold',fontSize:16,textAlign:'center'}}>Seems like you are not a member in here</Text>
              <View style = {{width:'100%',alignItems:'center',justifyContent:'center',marginTop:10,flexDirection:'row'}}>
                <View style = {{width:'60%',paddingLeft:10}}>
                  <Text style = {{color:'#369',fontWeight:'bold',fontSize:14}}
                    onPress = {()=>this.setState({login_cnfrm_screen:false})}>Cancel</Text>
                </View>
                <View style = {{width:'30%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                  <Text style = {{color:'#2fdab8',fontWeight:'bold',fontSize:14}}
                    onPress = {()=>this.props.navigation.navigate('reg')}>Sign Up</Text>
                  <Text style = {{color:'#2fdab8',fontWeight:'bold',fontSize:14}}
                    onPress = {()=>this.props.navigation.navigate('logn')}>Log In</Text>
                </View>
              </View>
            </View>
          </View>
        </AnimatedHideView>
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
    height:'100%',
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
  input:{
    width:'80%',
    height:45,
    paddingLeft:16,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    color:'#000',
    borderColor:'#bbb',
    borderWidth:1,
    marginTop:10,
    alignItems:'center',
    justifyContent:'center'
  },

})
