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

export default class replaceProduct extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      replaceIcn1 : 'check-box-outline-blank',
      replaceIcn1Color : '#282a2d',
      replaceIcn2 : 'check-box-outline-blank',
      replaceIcn2Color : '#282a2d',
      replaceIcn3 : 'check-box-outline-blank',
      replaceIcn3Color : '#282a2d',
      access_token : '',
      img : '',
      price : '',
      replaceValue : '',
      name : ''
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

    replaceProduct(){
        console.warn('access_token',this.state.access_token);
        console.warn('rsn',this.state.replaceValue);
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
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Replace Product</Text>
            </View>
            <View style={styles.iconView}>

            </View>
          </View>
          <View style = {styles.baseContainer}>
            <ScrollView style = {{width:'100%',marginTop:20,marginBottom:20}}>
              <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'96%',height:300,backgroundColor:'#fff',borderColor:'#eee',borderWidth:1,alignItems:'center',
                  justifyContent:'center',elevation: 2}}>
                  <Image style = {{width:'90%',height:'70%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                    source = {{uri:config.IMG_URL+this.state.img}}>
                  </Image>
                  <Text style = {{color:'#369',fontSize:16,fontWeight:'bold',marginTop:5}}>{this.state.name}</Text>
                  <Text style = {{color:'#360',fontSize:16,fontWeight:'bold'}}>Price : {this.state.price}</Text>
                </View>
                <View style = {{width:'96%',backgroundColor:'#fff',borderColor:'#eee',borderWidth:1,alignItems:'center',
                  justifyContent:'center',marginTop:20,padding:10,elevation:2}}>
                  <View style = {{width:'100%'}}>
                    <Text style = {{fontSize:16,color:'#000',marginTop:5,marginBottom:10}}>Refond-Product</Text>
                  </View>
                  <TouchableHighlight style = {{width:'100%'}}
                    underlayColor = 'transparent'
                    onPress = {()=>this.setState({
                      replaceIcn1 : 'check-box',
                      replaceIcn1Color: '#360',
                      replaceIcn2  :'check-box-outline-blank',
                      replaceIcn2Color :'#282a2d',
                      replaceIcn3 : 'check-box-outline-blank',
                      replaceIcn3Color : '#282a2d',
                      replaceValue : 'Dont like the product'
                    })}>
                    <View style = {{width:'100%',flexDirection:'row'}}>
                      <MaterialIcons
                          name={this.state.replaceIcn1}
                          size={26}
                          style = {{color:this.state.replaceIcn1Color}}>
                      </MaterialIcons>
                      <Text style = {{marginLeft:10,color:'#000',fontSize:16,fontWeight:'bold'}}>Dont like the product</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight style = {{width:'100%'}}
                    underlayColor = 'transparent'
                    onPress = {()=>this.setState({
                      replaceIcn1 : 'check-box-outline-blank',
                      replaceIcn1Color: '#282a2d',
                      replaceIcn2  :'check-box',
                      replaceIcn2Color :'#360',
                      replaceIcn3 : 'check-box-outline-blank',
                      replaceIcn3Color : '#282a2d',
                      replaceValue : 'Wrong product'
                    })}>
                    <View style = {{width:'100%',flexDirection:'row'}}>
                      <MaterialIcons
                          name={this.state.replaceIcn2}
                          size={26}
                          style = {{color:this.state.replaceIcn2Color}}>
                      </MaterialIcons>
                      <Text style = {{marginLeft:10,color:'#000',fontSize:16,fontWeight:'bold'}}>Wrong product</Text>
                    </View>
                  </TouchableHighlight>
                  <TouchableHighlight style = {{width:'100%'}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.setState({
                    replaceIcn1 : 'check-box-outline-blank',
                    replaceIcn1Color: '#282a2d',
                    replaceIcn2  :'check-box-outline-blank',
                    replaceIcn2Color :'#282a2d',
                    replaceIcn3 : 'check-box',
                    replaceIcn3Color : '#360',
                    replaceValue : 'Damaged product'
                  })}>
                    <View style = {{width:'100%',flexDirection:'row'}}>
                      <MaterialIcons
                          name={this.state.replaceIcn3}
                          size={26}
                          style = {{color:this.state.replaceIcn3Color}}>
                      </MaterialIcons>
                      <Text style = {{marginLeft:10,color:'#000',fontSize:16,fontWeight:'bold'}}>Damaged product</Text>
                    </View>
                  </TouchableHighlight>

                  <View style = {{width:'100%',height:45,alignItems:'center',justifyContent:'center',backgroundColor:'#369',borderBottomRightRadius:6,
                    borderBottomLeftRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6,marginTop:20}}>
                    <TouchableHighlight style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
                      <View>
                        <Text style = {{color:'#fff',fontSize:16,fontWeight:'bold'}}>Refond-Product</Text>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>


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
  }
  });