import React,{Component} from 'react';
import {View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableHighlight,
  AsyncStorage,
  TextInput,
  BackHandler,
  StatusBar,
  WebView
} from 'react-native'
import MaterialIcons from "react-native-vector-icons/MaterialIcons";


export default class ViedioWeb extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      api : ''
    }
  }
  _onNavigationStateChange(webViewState){
    console.log('?????????????',webViewState.url);
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    console.warn('api',params);
    this.setState({
      api : params.api
    });
    console.log('test//api',this.state.api)
  }
  render(){
    const {goBack} = this.props.navigation;
    return(
        <View style={{height:'100%',width:'100%'}}>
          <View style={{height:'8%',width:'100%',backgroundColor:'#282a2d',justifyContent:'space-between',flexDirection:'row'}}>
            <View style={{height:'100%',width:'10%',alignItems:'center',justifyContent:'center'}}>
              <TouchableHighlight underlayColor = 'transparent'
                                  onPress = {()=>goBack()}>
                <MaterialIcons
                    name='close'
                    size={22}
                    style = {{color:'#fff'}}>
                </MaterialIcons>
              </TouchableHighlight>
            </View>
            <View style={{height:'100%',width:'80%',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Garden Store</Text>
            </View>
            <View style={{height:'100%',width:'10%',alignItems:'center',justifyContent:'center'}}>
            </View>
          </View>
          <View style={{height:'92%',width:'100%'}}>
            <WebView
                style={{height:'100%',width:'100%'}}
                source={{uri: this.state.api}}
                onNavigationStateChange={this._onNavigationStateChange.bind(this)}
                javaScriptEnabled={true}
                domStorageEnabled={true} >
            </WebView>
          </View>
        </View>
    )
  }
}
