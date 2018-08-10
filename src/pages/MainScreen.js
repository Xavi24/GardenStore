import React,{Component} from 'react'
import {View,
        ScrollView,
        Image,
        Text,
        StyleSheet,
        StatusBar,
        TouchableOpacity,
        TouchableHighlight,
        TextInput
  } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Swiper from 'react-native-swiper'
import config from '../API/config'
import GridView from 'react-native-super-grid'
import Spinner from 'react-native-loading-spinner-overlay'

var menu_name = [];
var menu_data = [];
export default class MainScreen extends Component<{}>{
  static navigationOptions = {
    header : null
  }

  constructor(props){
    super(props);
    this.state = {
      name : [],
      show : false,
      subCat : [],
      cat_name : [],
      menu_data : [],
      array : [],
      search_data : ''
    }
  }

  getMenu(){
      let sub = {}
      var url = config.API_URL+'getMenu'
      fetch(url)
        .then((response)=> response.json())
        .then((response)=> {
          if (response.data!=null) {
            this.setState({
              show : false
            })
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
    goToSearch(){
      if (this.state.search_data!='') {
          this.props.navigation.navigate('searchData',{name:this.state.search_data})
      }
    }
    updateValue(text,field){
      if (field == 'search') {
        this.setState({
          search_data : text
        })
      }
    }
  componentWillMount(){
    this.setState({
      show:true
    })
    this.getMenu();
  }
  render(){
    return(
      <View style = {styles.container}>
        <StatusBar
          translucent = {false}
          barStyle="light-content"
          backgroundColor='#191a1c'
        />
        <View style = {styles.toolbar}>
          <View style = {styles.menuView}>
            <TouchableHighlight underlayColor = 'transparent'
              onPress = {()=>this.props.navigation.openDrawer()}>
              <MaterialIcons
                name='menu'
                size={22}
                style = {{color:'#fff'}}>
              </MaterialIcons>
            </TouchableHighlight>
          </View>
          <View style = {styles.textView}>
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>GardenStore</Text>
          </View>
          <View style = {styles.wishlistView}>
            <TouchableHighlight underlayColor = 'transparent'
              onPress = {()=>this.props.navigation.navigate('wishList')}>
              <MaterialIcons
                name='favorite'
                size={26}
                style = {{color:'#fff'}}>
              </MaterialIcons>
            </TouchableHighlight>
          </View>
          <View style = {styles.cartView}>
            <TouchableHighlight underlayColor = 'transparent'
              onPress = {()=>this.props.navigation.navigate('add_to_cart')}>
              <MaterialIcons
                name='shopping-cart'
                size={22}
                style = {{color:'#fff'}}>
              </MaterialIcons>
            </TouchableHighlight>
          </View>
          <View style = {styles.walletView}>
            <TouchableHighlight underlayColor = 'transparent'
              onPress = {()=>this.props.navigation.navigate('wallet')}>
              <MaterialIcons
                name='payment'
                size={20}
                style = {{color:'#fff'}}>
              </MaterialIcons>
            </TouchableHighlight>
          </View>
        </View>
        <View style = {{width:'100%',height:60,backgroundColor:'#282a2d',alignItems:'center',justifyContent:'center'}}>
          <View style = {{width:'95%',height:'80%',alignItems:'center',justifyContent:'space-between',backgroundColor:'#eee',flexDirection:'row'}}>
            <View style = {{width:'85%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <TextInput style = {{height:'95%',width:'95%',fontSize:14,color:'#000'}}
                placeholder = 'Search'
                placeholderTextColor = '#bbb'
                underlineColorAndroid = 'transparent'
                onChangeText = {(text_search) => this.updateValue(text_search,'search')}>
              </TextInput>
            </View>
            <View style = {{width:'15%',height:'100%',backgroundColor:'#2fdab8'}}>
              <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                underlayColor = 'transparent'
                onPress = {()=>this.goToSearch()}>
                <MaterialIcons
                  name='search'
                  size={26}
                  style = {{color:'#fff'}}>
                </MaterialIcons>
              </TouchableHighlight>
            </View>
          </View>
        </View>
        <View style = {{width:'100%',height:'92%',alignItems:'center',justifyContent:'center'}}>
          <ScrollView style = {{marginBottom:10}}
            showsVerticalScrollIndicator = {false}>
            <View style = {styles.scrollContainer}>
              <View style = {styles.baseContainer}>
                <View style = {{height:200,width:'100%'}}>
                  <Swiper
                    showsButtons={false}
                    autoplay = {true}
                    loop = {true}>
                    <View style = {styles.hederContainer}>
                      <Image style = {styles.containerImage}
                        source = {require('../img/offer4.jpg')}>
                      </Image>
                    </View>
                    <View style = {styles.hederContainer}>
                      <Image style = {styles.containerImage}
                        source = {require('../img/add8.png')}>
                      </Image>
                    </View>
                    <View style = {styles.hederContainer}>
                      <Image style = {styles.containerImage}
                        source = {require('../img/add7.jpg')}>
                      </Image>
                    </View>
                  </Swiper>
                </View>
                  <View style = {styles.gridContainer}>
                    <GridView
                      itemDimension={90}
                      spacing = {2}
                      items={this.state.menu_data}
                      renderItem={item => (
                        <TouchableHighlight style = {{height:40,width:100,backgroundColor:'#2fdab8'}}
                          underlayColor = 'transparent'
                          onPress = {()=>this.props.navigation.navigate('cms',{sub:item.sub_cat})}>
                          <View style = {{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                            <Text style = {{color:'#fff',fontWeight:'bold'}}>{item.name}</Text>
                          </View>
                        </TouchableHighlight>
                      )}
                    />
                  </View>
                <View style = {styles.quatsView}>
                  <View style = {{flexDirection:'row'}}>
                    <MaterialIcons
                      name='local-offer'
                      size={30}
                      style = {{color:'#2fdab8'}}>
                    </MaterialIcons>
                    <Text  style = {{fontSize:18,fontWeight:'bold',color:'#000',marginLeft:20}}>Offers That Only Made For You</Text>
                  </View>
                  <Text style = {{fontSize:18,marginLeft:20,marginTop:10}}>We have selected some products that only for you</Text>
                </View>
                <View style = {styles.offerView1}>
                  <View style = {styles.offerHeader1}>
                  <Image style = {styles.img}
                    source = {require('../img/add5.jpg')}>
                  </Image>
                  </View>
                  <View style = {styles.offerFooter1}>
                    <View style = {{width:'70%',height:'100%',justifyContent:'center'}}>
                      <Text style = {{fontSize:18,fontWeight:'bold',color:'#000',marginLeft:20}}>New Arrivals</Text>
                      <Text style = {{fontSize:18,marginLeft:20,marginTop:5}}>New Summer Collections</Text>
                    </View>
                    <View style = {{width:'30%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                      <View style = {styles.btn}>
                        <Text style = {{color:'#fff',fontWeight:'bold'}}>Shop Now</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
        <Spinner visible = {this.state.show}
          textContent = {"Loading..."}
          textStyle = {{color: '#369'}}
          color = {'#369'}
          overlayColor = {'#fff'}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container:{
    width:'100%',
    height:'100%',
    backgroundColor:'#fff'
  },
  scrollContainer:{
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  baseContainer:{
    width:'98%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  containerImage:{
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    resizeMode:'stretch',
    marginTop:4
  },
  CircleShapeView: {
    width: 18,
    height: 13,
    borderRadius: 13/2,
    backgroundColor:'#fe1414',
    alignItems:'center',
    justifyContent:'center'
  },
  hederContainer:{
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  iconImage:{
    height:30,
    width:30,
    alignItems:'center',
    justifyContent:'center'
  },
  quatsView:{
    height:110,
    width:'100%',
    backgroundColor:'#eeeeee',
    marginTop:5,
    padding:10
  },
  offerView1:{
    height:300,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#eeeeee',
    marginTop:5
  },
  offerHeader1:{
    width:'100%',
    height:'80%',
    alignItems:'center',
    justifyContent:'center'
  },
  offerFooter1:{
    width:'100%',
    height:'20%',
    flexDirection:'row',
    padding:5
  },
  img:{
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    resizeMode:'stretch'
  },
  gridContainer:{
    width:'100%',
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    marginLeft:5,
    marginRight:5,
    marginTop:5
  },
  toolbar:{
    width:'100%',
    height:'8%',
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row',
    backgroundColor:'#282a2d'
  },
  menuView:{
    height:'100%',
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },
  textView:{
    height:'100%',
    width:'60%',
    alignItems:'center',
    justifyContent:'center'
  },
  wishlistView:{
    height:'100%',
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },
  cartView:{
    height:'100%',
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },
  walletView:{
    height:'100%',
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },
  badge:{
    height:'90%',
    width:'100%',
    position:'absolute',
    flexDirection:'row',
    justifyContent:'space-between',
    marginTop:8
  }
})
