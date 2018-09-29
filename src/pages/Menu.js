import React,{Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  AsyncStorage,
  TouchableHighlight,
  StatusBar, Image
} from 'react-native'
import config from '../API/config'
import ExpanableList from 'react-native-expandable-section-flatlist'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


var menu_data = [];
var menu_name = [];
export default class Menu extends Component<{}>{
  static navigationOptions = {
    header:null
  };

  constructor(props){
    super(props);
    this.state = {
      menu:'',
      menu_data : [],
      userAction : '',
      name : 'Garden Store User',
      number : '',
      email : '',
      gender : '',
      profileName : '!',
      my_order : 'Order',
      my_order_color : '#363a42',
      my_order_size : 22
    }
  }
  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value,
        });
        this.getProfile();
      } else {
        this.setState({
          my_order : '',
          my_order_color : '#f5f5f5',
          my_order_size: 0
        })
      }
      } catch (error) {
    }
  }
  getProfile(){
    var url = config.API_URL+'profile';
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
      console.log('response',response);
      if (response.data!=null) {
        this.setState({
          name : response.data.name,
          number : response.data.phone_no,
          email : response.data.email,
          gender : response.data.gender
        })
        let str = response.data.name.charAt(0);
        console.warn('1st letter',str);
        this.setState({
          profileName : str
        })
      }
    })
  }
  getMenu(){
      let sub = {};
      var url = config.API_URL+'getMenu';
      fetch(url)
        .then((response)=> response.json())
        .then((response)=> {
          if (response.data!=null) {
            // console.warn('response',response);
            menu_data.length = 0;
            for(let cat of response.data){
              let subCatgry = [];
              if (cat.sub_cat) {
                for(sub of cat.sub_cat){
                  subCatgry.push({name:sub.name})
                }
              }
              menu_data.push({name:cat.name,
                            sub_cat:subCatgry});
              this.setState({
                menu_data : menu_data
              })
            }
          }
        })
      }

    componentWillMount(){
        this.getMenu();
        this._getAccessToken();
      }

    _renderRow = (rowItem, rowId, sectionId) =>
      <Text style = {{fontSize:14,marginLeft:20,marginTop:10}}
        onPress = {()=> this.props.navigation.navigate('shop',{name:rowItem.name})}>{rowItem.name}</Text>;
    _renderSection = (section, sectionId)  =>
      <Text style = {{marginLeft:10,marginTop:20,fontSize:16,color:'#363a42'}}>{section}</Text>;
  render(){
    return(
      <View style = {styles.container}>
        <StatusBar
          translucent = {false}
          barStyle='light-content'
          backgroundColor='#282a2d'
        />
        <View style = {styles.profileView}>
          <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',marginBottom:10}}>
            <Image style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                   source = {require('../img/garden_logo.png')}>
            </Image>
          </View>
          {/*<View style = {{width:'95%',alignItems:'center',flexDirection:'row'}}>*/}
            {/*<MaterialIcons*/}
                {/*name='home'*/}
                {/*size={22}*/}
                {/*style = {{color:'#fff'}}>*/}
            {/*</MaterialIcons>*/}
            {/*<Text style={{color:'#fff',fontSize:14,marginLeft:7}}>Home</Text>*/}
          {/*</View>*/}
        </View>
        <ScrollView>
          <View style = {{width:'100%',borderBottomColor:'#1d3461',borderBottomWidth:0.5}}>
            <ExpanableList
              style = {{marginBottom:20}}
              dataSource={this.state.menu_data}
              headerKey="name"
              memberKey="sub_cat"
              renderRow={this._renderRow}
              renderSectionHeaderX={this._renderSection}
              // openOptions={[1,2,]}
            />
          </View>
          <View>
            <View>
              <View style = {{flexDirection:'row',width:'100%',marginTop:20}}>
                <TouchableHighlight style = {{alignItems:'center',justifyContent:'center',marginLeft:10}}
                    underlayColor = 'transparent'>
                    <MaterialIcons
                      name='shopping-cart'
                      size={22}
                      style = {{color:'#363a42'}}>
                    </MaterialIcons>
                </TouchableHighlight>
              <Text style = {{fontSize:16,color:'#363a42',marginLeft:10}}
                onPress = {()=> this.props.navigation.navigate('add_to_cart')}>My Cart</Text>
              </View>
              <View style = {{flexDirection:'row',width:'100%',marginTop:20}}>
                <TouchableHighlight style = {{alignItems:'center',justifyContent:'center',marginLeft:10}}
                    underlayColor = 'transparent'>
                    <MaterialIcons
                      name='favorite'
                      size={22}
                      style = {{color:'#363a42'}}>
                    </MaterialIcons>
                </TouchableHighlight>
                <Text style = {{fontSize:16,color:'#363a42',marginLeft:10}}
                  onPress = {()=>this.props.navigation.navigate('wishList')}>Wishlist</Text>
              </View>
              <View style = {{flexDirection:'row',width:'100%',marginTop:20}}>
                <TouchableHighlight style = {{alignItems:'center',justifyContent:'center',marginLeft:10}}
                    underlayColor = 'transparent'>
                    <MaterialIcons
                      name='payment'
                      size={22}
                      style = {{color:'#363a42'}}>
                    </MaterialIcons>
                </TouchableHighlight>
                <Text style = {{fontSize:16,color:'#363a42',marginLeft:10}}
                  onPress = {()=>this.props.navigation.navigate('wallet')}>Wallet</Text>
              </View>
              <View style = {{flexDirection:'row',width:'100%',marginTop:20}}>
                <TouchableHighlight style = {{alignItems:'center',justifyContent:'center',marginLeft:10}}
                    underlayColor = 'transparent'>
                    <MaterialIcons
                      name='settings'
                      size={22}
                      style = {{color:'#363a42'}}>
                    </MaterialIcons>
                </TouchableHighlight>
                <Text style = {{fontSize:16,color:'#363a42',marginLeft:10}}
                 onPress = {()=>this.props.navigation.navigate('settings')}>Settings</Text>
              </View>
              <View style = {{flexDirection:'row',width:'100%',marginTop:20,marginBottom:10}}>
                <TouchableHighlight style = {{alignItems:'center',justifyContent:'center',marginLeft:10}}
                    underlayColor = 'transparent'>
                    <MaterialIcons
                      name='shopping-cart'
                      size={22}
                      style = {{color:'#363a42'}}>
                    </MaterialIcons>
                </TouchableHighlight>
                <Text style = {{fontSize:16,color:'#363a42',marginLeft:10}}
                  onPress = {()=>this.props.navigation.navigate('order')}>Oders</Text>
              </View>
              <View style = {{flexDirection:'row',width:'100%',marginTop:20}}>
                <TouchableHighlight style = {{alignItems:'center',justifyContent:'center',marginLeft:10}}
                                    underlayColor = 'transparent'>
                  <MaterialIcons
                      name='group'
                      size={22}
                      style = {{color:'#363a42'}}>
                  </MaterialIcons>
                </TouchableHighlight>
                <Text style = {{fontSize:16,color:'#363a42',marginLeft:10}}
                      onPress = {()=>this.props.navigation.navigate('about')}>About Us</Text>
              </View>
              <View style = {{flexDirection:'row',width:'100%',marginTop:20}}>
                <TouchableHighlight style = {{alignItems:'center',justifyContent:'center',marginLeft:10}}
                                    underlayColor = 'transparent'>
                  <MaterialIcons
                      name='ring-volume'
                      size={22}
                      style = {{color:'#363a42'}}>
                  </MaterialIcons>
                </TouchableHighlight>
                <Text style = {{fontSize:16,color:'#363a42',marginLeft:10}}
                      onPress = {()=>this.props.navigation.navigate('contact')}>Contact Us</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    height:'100%',
    width:'100%',
    backgroundColor:'#fff'
  },
  profileView:{
    height:'20%',
    width:'100%',
    justifyContent:'center',
    paddingBottom: 10,
    backgroundColor:'#fff',
    borderBottomColor: '#1d3461',
    borderBottomWidth: 0.5
  }
});
