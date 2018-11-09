import React,{Component} from 'react'
import {View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableHighlight,
  AsyncStorage,
  TextInput,
  Image
} from 'react-native'
import QRCode from 'react-native-qrcode'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export default class QRPage extends Component<{}>{
  constructor(props){
    super();
    this.state = {
      access_token : ''
    }
  }
  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value
        });
        console.warn('value',this.state.access_token);
      }
    } catch (error) {
      console.warn('error',error.message);
    }
  }
  componentWillMount(){
    this._getAccessToken();
  }
  render(){
    const {goBack} = this.props.navigation;
    return(
      <View style = {styles.container}>
        <View style = {{width:'100%',height:'10%',alignItems:'center',justifyContent:'center'}}>
          <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginBottom:20}}>
            <TouchableHighlight underlayColor = 'transparent'
                                onPress = {()=>goBack()}>
              <MaterialIcons
                  name='close'
                  size={30}
                  style = {{color:'#fff'}}>
              </MaterialIcons>
            </TouchableHighlight>
          </View>
        </View>
        <View style = {{width:'100%',height:'90%',alignItems:'center',justifyContent:'center'}}>
          <View style = {{height:'50%',width:'100%',backgroundColor:'#fff',alignItems:'center',justifyContent:'center',elevation:2}}>
            <QRCode
                value={this.state.access_token}
                size={255}
                bgColor='#000'
                fgColor='white'/>
          </View>
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
    backgroundColor:'#000000'
  }
})