import React,{Component} from 'react'
import {
        View,
        Text,
        StyleSheet,
        Image,
        TouchableHighlight,
        AsyncStorage,
        BackHandler
  } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import config from '../API/config'
import AnimatedHideView from 'react-native-animated-hide-view'
import Spinner from 'react-native-loading-spinner-overlay'

export default class Wallet extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      ponts : '',
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
        this.getPoints();
      } else {
        this.setState({
          error_screen : true
          })
        }
      } catch (error) {
    }
  }
  getPoints(){
    this.setState({
      show : true
    })
    var url = config.API_URL+'user/points'
    fetch(url, {
      headers : new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
    .then((response)=>response.json())
    .catch((error)=>console.warn(error))
    .then((response)=>{
      console.warn('response',response.data.points);
      if (response.code=='200') {
        this.setState({
          show : false
        })
        if (response.data.points!=null) {
          this.setState({
            points : response.data.points
          })
        } else if (response.data.points==null) {
          this.setState({
            points : '0',
            show : false
          })
        }
        console.warn('points',this.state.points);
      } else {
        this.setState({
          show : false
        })
      }
    })
  }
  componentWillMount(){
    this._getAccessToken();
  }
  render(){
    const {goBack} = this.props.navigation
    return(
      <View style = {styles.container}>
        <View style = {{height:'40%',width:'100%',alignItems:'center',justifyContent:'center'}}>
          <Image style = {{height:'100%',width:'100%',resizeMode:'stretch'}}
            source = {require('../img/wallet.jpg')}></Image>
          <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}>
            <View style = {{width:'100%',height:'20%'}}>
              <View style = {styles.menuView}>
                <TouchableHighlight underlayColor = 'transparent'
                  onPress = {()=>goBack()}>
                  <MaterialIcons
                    name='arrow-back'
                    size={25}
                    style = {{color:'#000'}}>
                  </MaterialIcons>
                </TouchableHighlight>
              </View>
              <View style = {styles.textView}></View>
              <View style = {styles.IconView}></View>
            </View>
            <View style = {{width:'100%',height:'80%',alignItems:'center',justifyContent:'center'}}>
              <View style = {{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <Text style = {{fontSize:46,fontWeight:'bold',color:'#000'}}>{this.state.points}</Text>
                <Text style = {{marginLeft:5,fontWeight:'bold',marginTop:20,fontSize:20}}>Points</Text>
              </View>
              <Text style = {{color:'#000',fontSize:26,fontWeight:'bold'}}>Total Reward</Text>
            </View>
          </View>
        </View>
        <View style = {{height:'60%',width:'100%',alignItems:'center',justifyContent:'center'}}>
          <Text style = {{color:'#369',fontSize:22,fontWeight:'bold'}}>Wants To Know the Details?</Text>
          <View style = {{width:'95%',alignItems:'center',justifyContent:'center'}}>
            <Text style = {{fontSize:16,textAlign:'center'}}>You can earn ponts buy purchasing products. It depends what you purchase from us.
                  You can use this points for another purchase.</Text>
          </View>
        </View>
        <AnimatedHideView
          visible = {this.state.error_screen}
          style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',backgroundColor:'#fff'}}>
          <View style = {styles.toolbar}>
            <TouchableHighlight underlayColor = 'transparent'
              onPress = {()=>{this.props.navigation.navigate('mainscreen')}}>
              <MaterialIcons
                name='arrow-back'
                size={22}
                style = {{color:'#fff'}}>
              </MaterialIcons>
            </TouchableHighlight>
            <View style = {{width:'100%',alignItems:'center'}}>
              <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Garden Store</Text>
            </View>
          </View>
          <View style = {{width:'100%',height:'92%'}}>
            <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <Image style = {{width:80,height:80,alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                source = {require('../img/dislike.png')}>
              </Image>
                <Text style = {{fontSize:30,color:'#000',marginTop:10}}>Oops!</Text>
                <Text style = {{fontSize:18,marginTop:20,textAlign:'center'}}>Seems like you are not a member here</Text>
                <Text style = {{fontSize:18,textAlign:'center'}}>Your Attempt has failed.</Text>
                <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                  <Text style = {{fontSize:16,marginTop:20}}>Already have an account ?</Text>
                  <Text style = {{color:'#369',marginLeft:10,fontSize:16,marginTop:20}}
                    onPress = {()=>this.props.navigation.navigate('logn',{page : 'mainscreen',next : 'wallet'})}>Login Here</Text>
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
  container:{
    height:'100%',
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
  IconView:{
    height:'100%',
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },
  toolbar:{
    height:'8%',
    width:'100%',
    justifyContent:'space-between',
    alignItems:'center',
    padding:10,
    flexDirection:'row',
    backgroundColor:'#282a2d'
  }
})
