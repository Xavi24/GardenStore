import React,{Component} from 'react'
import {View,Text,StyleSheet,ScrollView,AsyncStorage} from 'react-native'
import config from '../API/config'
import ExpanableList from 'react-native-expandable-section-flatlist'
import {Thumbnail} from 'native-base'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'


var menu_data = [];
var menu_name = [];
export default class Menu extends Component<{}>{
  static navigationOptions = {
    header:null
  }

  constructor(props){
    super(props);
    this.state = {
      name:'',
      menu:'',
      menu_data : [],
      userAction : '',
      name : '',
      number : '',
      email : '',
      gender : '',
      profileName : ''
    }
  }
  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        this.setState({
          access_token : value,
        })
        this.getProfile();
      }
      } catch (error) {
    }
  }
  getProfile(){
    var url = config.API_URL+'profile'
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
      let sub = {}
      var url = config.API_URL+'getMenu'
      fetch(url)
        .then((response)=> response.json())
        .then((response)=> {
          if (response.data!=null) {
            // console.warn('response',response);
            menu_data.length = 0
            for(let cat of response.data){
              let subCatgry = []
              if (cat.sub_cat) {
                for(sub of cat.sub_cat){
                  subCatgry.push({name:sub.name})
                }
              }
              menu_data.push({name:cat.name,
                            sub_cat:subCatgry})
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
      <Text style = {{fontSize:16,color:'#369',marginLeft:20,marginTop:10}}
        onPress = {()=> this.props.navigation.navigate('shop',{name:rowItem.name})}>{rowItem.name}</Text>;
    _renderSection = (section, sectionId)  =>
      <Text style = {{marginLeft:10,marginTop:20,fontSize:18,color:'#363a42'}}>{section}</Text>;
  render(){
    return(
      <View style = {styles.container}>
        <View style = {styles.profileView}>
          <View style = {{width:'100%',marginLeft:20}}>
            <View style = {{height:60,width:60,borderRadius:60/2,backgroundColor:'#2fdab8',marginTop:20,alignItems:'center',justifyContent:'center'}}>
              <Text style = {{color:'#fff',fontSize:24,fontWeight:'bold'}}>{this.state.profileName}</Text>
             </View>
            <Text style = {{fontSize:14,color:'#fff',fontWeight:'bold',marginTop:10}}>{this.state.name}</Text>
            <Text style = {{fontSize:14,color:'#fff'}}>{this.state.email}</Text>
          </View>
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
              <Text style = {{fontSize:18,color:'#363a42',marginLeft:10,marginTop:20}}
                onPress = {()=> this.props.navigation.navigate('add_to_cart')}>Shopping Cart</Text>
                <Text style = {{fontSize:18,color:'#363a42',marginLeft:10,marginTop:20}}
                  onPress = {()=>this.props.navigation.navigate('wishList')}>Wishlist</Text>
                <Text style = {{fontSize:18,color:'#363a42',marginLeft:10,marginTop:20}}>Wallet</Text>
              <Text style = {{fontSize:18,color:'#363a42',marginLeft:10,marginTop:20,marginBottom:10}}
                onPress = {()=>this.props.navigation.navigate('settings')}>Settings</Text>
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
    backgroundColor:'#f5f5f5'
  },
  profileView:{
    height:'30%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#282a2d'
  }
})
