import React,{Component} from 'react';
import {AppRegistry,View,Text,StyleSheet,StatusBar,Image,ScrollView,AsyncStorage} from 'react-native';
import Swiper from 'react-native-swiper';

export default class Getstarted extends Component<{}>{
  static navigationOptions = {
    header:null,
    drawerLockMode: 'locked-closed'
  }
  constructor(props){
    super(props);
    this.state = {
      access_token : ''
    }
  }
  async _getAccessToken() {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value
        })
        this.props.navigation.navigate('mainscreen')
      }
      else {
        this.props.navigation.navigate('homepage')
      }
    } catch (error) {
      console.warn(error.message);
    }
  }
  componentWillMount(){

  }
  render(){
    return(
      <View style  = {{width:'100%',height:'100%'}}>
        <View style = {{height:'70%'}}>
          <Swiper
            showsButtons={true}
            autoplay = {true}
            dot = {<View style = {styles.dotStyle} />}
            activeDot = {<View style = {styles.dotStyle} />}
            loop = {true}>
            <View style = {styles.container}>
                <StatusBar
                   translucent = {true}
                   backgroundColor='rgba(00, 00, 00, 0.5)'
                   barStyle="light-content"
                />
                <View style = {styles.base_view}>
                  <Image style = {styles.img}
                  source = {require('../img/garden_bg2.jpg')}>
                  </Image>
                </View>
            </View>
            <View style = {styles.container}>
              <View style = {styles.base_view}>
                <Image style = {{width:'100%',height:'100%',alignItems:'stretch',
                resizeMode: 'stretch',justifyContent:'center'}}
                source = {require('../img/garden_bg3.jpg')}>
                </Image>
              </View>

              </View>
            <View style = {styles.container}>
              <View style = {styles.base_view}>
                <Image style = {{width:'100%',height:'100%',alignItems:'stretch',
                resizeMode: 'stretch',justifyContent:'center'}}
                source = {require('../img/garden_bg6.jpg')}>
                </Image>
              </View>

              </View>
            <View style = {styles.container}>
              <View style = {styles.base_view}>
                <Image style = {{width:'100%',height:'100%',alignItems:'stretch',
                resizeMode: 'stretch',justifyContent:'center'}}
                source = {require('../img/swipe_7.jpeg')}>
                </Image>
                </View>

            </View>
          </Swiper>
        </View>
        <View style = {styles.topView}>
          <View style = {{height:'70%'}}></View>
          <View style = {styles.footer_view}>
            <View style = {{height:'50%',width:'100%',alignItems:'center'}}>
              <Text style = {styles.footer_text}>Discover New Trend You will Love</Text>
              <Text style = {{textAlign:'center',marginTop:5,marginLeft:5,marginRight:5}}>Create a new story with latest trends with us. Choose
                  the best one to tell who you are.</Text>
            </View>
            <View style = {{height:'50%',width:'100%',alignItems:'center'}}>
              <Text style = {{fontSize:20,fontWeight:'bold',color:'#369',marginTop:20,textDecorationLine:'underline'}}
                onPress = {()=>this._getAccessToken()}>Lets Get Started!</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'100%',
  },
  base_view:{
    height:'100%',
    width:'100%',
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center'
  },
  footer_view:{
    height:'30%',
    width:'100%',
    alignItems:'center'
  },
  footer_text:{
    fontSize:20,
    color:'#000000',
    marginTop:30
  },
  img:{
    width:'100%',
    height:'100%',
    alignItems:'stretch',
    resizeMode: 'stretch',
    justifyContent:'center'
  },
  topView:{
    width:'100%',
    height:'100%',
    position:'absolute'
  },
  dotStyle:{
    backgroundColor:'transparent',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  }
})
