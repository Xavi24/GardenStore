import React,{Component} from 'react';
import {View,Text,Image,TouchableHighlight,StyleSheet,StatusBar} from 'react-native';
import Swiper from 'react-native-swiper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default class HomePage extends Component<{}>{
  static navigationOptions = {
    header:null
   }
  render(){
    return(
      <View style = {styles.container}>
        <StatusBar
          translucent = {false}
          barStyle="light-content"
          backgroundColor='#191a1c'
        />
        <Image style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
          source = {require('../img/garden_bg4.jpg')}>
        </Image>
        <View style = {styles.base_view}>
          <View style = {styles.header_view}>
          <View style = {{height:'20%',width:'100%',justifyContent:'center',alignItems:'center'}}>
              <View style = {styles.skip_container}>
                <View style = {{width:'70%'}}></View>
                <View style = {{width:'30%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                    <Text style = {{color:'#48c7f0',fontSize:16}}
                      onPress = {()=>this.props.navigation.navigate('mainscreen')}>Skip>></Text>
                </View>
              </View>
            </View>
            <Swiper style = {{height:'80%'}}
                autoplay = {true}>
                <View style = {styles.swiper_view}>
                  <View style = {styles.text_container}>
                    <Text style = {{fontSize:24,color:'#ffffff',fontWeight:'bold'}}>Choose Your Own Style
                    </Text>
                    <Text style = {styles.txt}>Dont follow trends. Start Your own trends with us, For be your own way
                    </Text>
                  </View>
                </View>
                <View style = {styles.swiper_view}>
                  <View style = {styles.text_container}>
                    <Text style = {{fontSize:24,color:'#ffffff',fontWeight:'bold'}}>Choose Your Own Style
                    </Text>
                    <Text style = {styles.txt}>Dont follow trends. Start Your own trends with us, For be your own way
                    </Text>
                  </View>
                </View>
                <View style = {styles.swiper_view}>
                  <View style = {styles.text_container}>
                    <Text style = {{fontSize:24,color:'#ffffff',fontWeight:'bold'}}>Choose Your Own Style
                    </Text>
                    <Text style = {styles.txt}>Dont follow trends. Start Your own trends with us, For be your own way
                    </Text>
                  </View>
                </View>
            </Swiper>
          </View>
          <View style = {styles.footer_view}>
            <View style = {styles.footer_container}>
              <Text style = {{fontSize:18,fontWeight:'bold',color:'#ffffff'}}>Login or Register</Text>
              <View style = {styles.btn_container}>
                <View style = {styles.btn_view}>
                  <TouchableHighlight underlayColor = 'transparent'
                    onPress = {()=>this.props.navigation.navigate('reg')}>
                    <View style = {styles.btn}>
                      <View style = {styles.register_icon_view}>
                        <MaterialIcons
                          name='lock-outline'
                          size={25}
                          style = {{color:'#ffffff'}}>
                        </MaterialIcons>
                      </View>
                      <View style = {styles.register_view}>
                        <Text style = {{fontSize:16,color:'#ffffff'}}>REGISTER</Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                    </View>
                    <View style = {styles.btn_container}>
                      <View style = {styles.btn_view}>
                      <TouchableHighlight underlayColor = 'transparent'
                          onPress ={()=>this.props.navigation.navigate('logn')}>
                      <View style = {styles.btn}>
                        <View style = {styles.register_icon_view}>
                          <MaterialIcons
                            name='perm-identity'
                            size={25}
                            style = {{color:'#ffffff'}}>
                          </MaterialIcons>
                        </View>
                        <View style = {styles.register_view}>
                          <Text style = {{fontSize:16,color:'#ffffff'}}>LOGIN</Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
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
    width:'100%'
  },
  base_container:{
    width:'100%',
    height:'100%',
    backgroundColor:'rgba(00, 00, 00, 0.5)',
    position:'absolute',
    alignItems:'center',
    justifyContent:'center'
  },
  header_view:{
    width:'100%',
    height:'70%',
  },
  footer_view:{
    width:'100%',
    height:'30%',
    alignItems:'center',
    justifyContent:'center'
  },
  base_view:{
    position:'absolute',
    backgroundColor:'rgba(00, 00, 00, 0.5)',
    height:'100%',
    width:'100%'
  },
  swiper_view:{
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  btn_view:{
    height:'100%',
    width:'50%',
    alignItems:'center',
    justifyContent:'center',
  },
  btn_container:{
    width:'100%',
    flexDirection:'row'
  },
  btn:{
    height:45,
    width:'90%',
    backgroundColor:'#369',
    alignItems:'center',
    justifyContent:'center',
    flexDirection:'row',
    borderTopLeftRadius:6,
    borderTopRightRadius:6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6
  },
  register_view:{
    width:'65%',
    height:'100%',
    justifyContent:'center'
  },
  register_icon_view:{
    width:'35%',
    height:'100%',
    justifyContent:'center',
    alignItems:'center'
  },
  skip_container:{
    width:'100%',
    height:'20%',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  text_container:{
    width:'100%',
    height:'80%',
    alignItems:'center',
    justifyContent:'center'
  },
  txt:{
    fontSize:16,
    color:'#ffffff',
    textAlign:'center',
    marginTop:20,
    marginLeft:15,
    marginRight:15
  },
  skip_btn:{
    height:'100%',
    width:'50%',
    backgroundColor:'#ffffff',
    borderTopLeftRadius:3,
    borderTopRightRadius:3,
    borderBottomLeftRadius:3,
    borderBottomRightRadius:3,
    alignItems:'center',
    justifyContent:'center'
  },
  footer_container:{
    height:'70%',
    width:'95%',
    backgroundColor:'rgba(00, 00, 00, 0.5)',
    borderTopLeftRadius:6,
    borderTopRightRadius:6,
    borderBottomLeftRadius:6,
    borderBottomRightRadius:6,
    alignItems:'center',
    justifyContent:'center'
  }
})
