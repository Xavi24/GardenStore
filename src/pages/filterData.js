import React,{Component} from 'react'
import {View,
        Image,
        TouchableHighlight,
        Text,
        StatusBar,
        StyleSheet,
        ScrollView,
        TouchableOpacity,
        ActivityIndicator,
        BackHandler,
        AsyncStorage
  } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import GridView from 'react-native-super-grid'
import Ionicons from 'react-native-vector-icons/Ionicons'
import config from '../API/config'
import Spinner from 'react-native-loading-spinner-overlay'
import AnimatedHideView from 'react-native-animated-hide-view'

let product_data = []
let filterdata = []
export default class filterData extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      product_data : [],
      name : '',
      show : false,
      sort_view : false,
      cat_data : [],
      min : 0,
      max : 500,
      specdata : '',
      url : '',
      popularityColor : '#7a7979',
      relevenceColor : '#7a7979',
      phtlcolor : '#7a7979',
      arrivalscolor : '#7a7979',
      sortdata : '',
      plthcolor : '#7a7979',
      sortinput : ''
    }
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    let response = params.data
    this.setState({
      url :params.url
    })
    this.getFilterDetails(response);
  }
  getFilterDetails(response){
    let cat_name = []
    let brand_name = []
    let spec_name = []
    console.warn('params',response);
    if (response.data!= '') {
      this.setState({
        show : false
      })
      product_data.length = 0
      if (response.data.data) {
        for(let product of response.data.data){
          product_data.push({
            name:product.name,
            slug:product.slug,
            img:product.img,
            price:product.price,
            id:product.id,
            disc:product.total_discount,
            sale_price:product.sale_price,
            vendor_id:product.vendor_id
          })
          this.setState({
            product_data : product_data
          })
        }
      }
        if (response.filters.cat) {
          if (response.filters.cat.sub_cat) {
            for(let sub_cat of response.filters.cat.sub_cat){
              cat_name.push({name:sub_cat.name})
            }
            this.setState({
              cat_data : cat_name
            })
            // console.warn('cat_data',this.state.cat_data);
          }
          if (response.filters.brands) {
            for(let brands of response.filters.brands){
              brand_name.push({name:brands.brand_details.name})
            }
            this.setState({
              brand_data : brand_name
            })
            // console.warn('brand_data',this.state.brand_data);
          }
          if (response.filters.specs) {
            spec_keys = Object.keys(response.filters.specs)
            // console.warn('spec_keys',spec_keys);
            for (var i = 0; i < spec_keys.length; i++) {
              spec_name.push({
                name:spec_keys[i],
                spec:response.filters.specs[spec_keys[i]]
              })
            }
            this.setState({
              spec_data : spec_name
            })

            // console.warn('spec_name',spec_name);
          }
          if (response.filters.price) {
            // console.warn('price',response.filters.price);
            this.setState({
              min : parseInt(response.filters.price.min.split('.')[0]),
              max : parseInt(response.filters.price.max.split('.')[0]),
              url : this.state.url
            })
              // this.state.multiSliderValue[0] = parseInt(this.state.min),
              // this.state.multiSliderValue[1] = parseInt(this.state.max)
              // console.warn('multiSliderValue',this.state.min);
          }
        }
    } else {
      this.setState({
        show : false
      })
    }
  }
  getsortData(){
    console.warn('input',this.state.sortinput);
    if (this.state.sortinput!='') {
      var url = config.API_URL+'products/search?category='+this.state.name+'&'+'sort='+this.state.sortinput
      console.log('url',url);
      fetch(url)
       .then((response)=>response.json())
       .catch((error)=>console.warn(error))
       .then((response)=>{
         console.warn('response',response);
         if (response.data.length!=0) {
           this.props.navigation.navigate('sortdata',{data:response,url:this.state.url})
         }
       })
    }
  }
  getPopularityData(input){
    this.setState({
      sortinput : input,
      popularityColor:'#369',
      relevenceColor : '#7a7979',
      phtlcolor : '#7a7979',
      plthcolor : '#7a7979',
      arrivalscolor : '#7a7979'
    })
  }
  getrelevanceData(input){
    this.setState({
      sortinput : input,
      relevenceColor:'#369',
      arrivalscolor : '#7a7979',
      phtlcolor : '#7a7979',
      popularityColor : '#7a7979',
      plthcolor : '#7a7979'
    })
  }
  getpricehtlData(input){
    this.setState({
      sortinput : input,
      phtlcolor:'#369',
      relevenceColor : '#7a7979',
      arrivalscolor : '#7a7979',
      popularityColor : '#7a7979',
      plthcolor : '#7a7979'
    })
  }
  getpricelthData(input){
    this.setState({
      sortinput : input,
      plthcolor:'#369',
      relevenceColor : '#7a7979',
      arrivalscolor : '#7a7979',
      phtlcolor : '#7a7979',
      popularityColor : '#7a7979'
    })
  }
  getnewarrivalsData(input){
    this.setState({
      sortinput : input,
      arrivalscolor:'#369',
      relevenceColor : '#7a7979',
      phtlcolor : '#7a7979',
      popularityColor : '#7a7979',
      phtlcolor : '#7a7979'
    })
  }
  render(){
    const {goBack} = this.props.navigation
    return(
      <View style = {styles.container}>
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
          <View style = {styles.textView}>
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>GardenStore</Text>
          </View>
          <View style = {styles.iconView}></View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView style = {{height:'100%',width:'100%'}}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <GridView
                itemDimension = {180}
                items = {this.state.product_data}
                style = {styles.gridView}
                spacing = {4}
                renderItem = {item =>
                  <TouchableHighlight style = {{height:300,width:'100%'}}
                    underlayColor = 'transparent'
                    onPress = {()=>this.props.navigation.navigate('details',{slug:item.slug,img:item.img,id:item.id,vendor_id:item.vendor_id})}>
                    <View style = {styles.grid_content}>
                      <Image style = {styles.imageView}
                        source ={{uri:config.IMG_URL+item.img}}>
                      </Image>
                      <View style = {styles.gridBaseView}>
                        <ScrollView></ScrollView>
                        <LinearGradient
                          style = {{borderBottomLeftRadius:2,borderBottomRightRadius:2,width:'100%'}}
                          start={{x: 0.5, y: 0.0}} end={{x: 0.5, y: 1.0}}
                          locations={[0,0.7]}
                          colors={['rgba(00, 00, 00, 0.0)','rgba(00, 00, 00, 0.7)']}>
                          <View style = {styles.productDetails}>
                            <View style = {{width:'95%',alignItems:'center',justifyContent:'center'}}>
                              <Text style = {styles.productName}>{item.name}</Text>
                              <View style = {{width:'100%',flexDirection:'row'}}>
                                <Text style = {styles.productPrice_des}>Price : </Text>
                                <Text style = {styles.productPrice}>{item.price}</Text>
                                <Text style = {{color:'#48c7f0',fontSize:16,marginLeft:5}}>{item.disc}</Text>
                                <Text style = {{color:'#48c7f0',fontSize:16}}>%</Text>
                                <Text style = {{color:'#0cb038',fontSize:16,marginLeft:5}}>off</Text>
                              </View>
                              <View style = {{width:'100%'}}>
                                <Text style = {{color:'#48c7f0',fontSize:16}}>Explore Now!</Text>
                              </View>
                            </View>
                          </View>
                        </LinearGradient>
                      </View>
                    </View>
                  </TouchableHighlight>
                }
              />
            </View>
          </ScrollView>
        </View>
        <View style = {{height:'8%',width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:'#fff'}}>
          <TouchableHighlight style = {{height:'100%',width:'50%'}}
            underlayColor = 'transparent'
            onPress = {()=>this.setState({sort_view:true})}>
            <View style = {{height:'100%',width:'100%',flexDirection:'row',borderRightWidth:2,borderColor:'#eee',
               alignItems:'center',justifyContent:'center'}}>
               <MaterialIcons
                 name='swap-vert'
                 size={28}
                 style = {{color:'#282a2d'}}>
               </MaterialIcons>
               <Text style = {{fontSize:14,color:'#282a2d'}}>Sort</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight style = {{width:'50%',height:'100%'}}
            underlayColor = 'transparent'
            onPress = {()=>this.props.navigation.navigate('filter',
            {
              name:this.state.name,
              min:this.state.min,
              max:this.state.max,
              brand_data:this.state.brand_data,
              cat_data:this.state.cat_data,
              spec_data:this.state.spec_data,
              url:this.state.url
            })}>
            <View style = {{height:'100%',width:'100%',flexDirection:'row',borderLeftWidth:2,borderColor:'#eee',
               alignItems:'center',justifyContent:'center'}}>
              <MaterialIcons
                name='filter-list'
                size={28}
                style = {{color:'#282a2d'}}>
              </MaterialIcons>
              <Text style = {{color:'#282a2d',fontSize:14}}>Filter</Text>
            </View>
          </TouchableHighlight>
        </View>
        <AnimatedHideView style = {{backgroundColor:'rgba(00, 00, 00, 0.7)',height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
          visible = {this.state.sort_view}>
          <TouchableHighlight style = {{height:'100%',width:'100%'}}
            underlayColor = 'transparent'>
            <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
              <TouchableHighlight style = {{width:'100%',height:'50%'}}
                underlayColor = 'transparent'
                onPress = {()=>this.setState({sort_view:false})}>
                <View style = {{width:'100%',height:'100%'}}></View>
              </TouchableHighlight>
              <View style = {{width:'100%',backgroundColor:'#fff',alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'100%',paddingLeft:10,borderBottomColor:'#eee',borderBottomWidth:1,marginTop:10,paddingBottom:10}}>
                  <Text style = {{fontSize:16}}>Sort By</Text>
                </View>
                <TouchableHighlight style = {{width:'100%'}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.getPopularityData('popularity')}>
                  <View style = {{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:10,marginBottom:10}}>
                    <View style = {{width:'92%',paddingLeft:10}}>
                      <Text style = {{color:'#000',fontSize:16,fontWeight:'bold'}}>Popularity</Text>
                    </View>
                    <View style = {{width:'7%'}}>
                    <MaterialIcons
                      name='radio-button-checked'
                      size={18}
                      style = {{color:this.state.popularityColor}}>
                    </MaterialIcons>
                    </View>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style = {{width:'100%'}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.getrelevanceData('relevance')}>
                  <View style = {{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:10,marginBottom:10}}>
                    <View style = {{width:'92%',paddingLeft:10}}>
                      <Text style = {{color:'#000',fontSize:16,fontWeight:'bold'}}>Relevance</Text>
                    </View>
                    <View style = {{width:'7%'}}>
                    <MaterialIcons
                      name='radio-button-checked'
                      size={18}
                      style = {{color:this.state.relevenceColor}}>
                    </MaterialIcons>
                    </View>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style = {{width:'100%'}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.getpricelthData('price_lth')}>
                  <View style = {{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:10,marginBottom:10}}>
                    <View style = {{width:'92%',paddingLeft:10}}>
                      <Text style = {{color:'#000',fontSize:16,fontWeight:'bold'}}>Price low to high</Text>
                    </View>
                    <View style = {{width:'7%'}}>
                    <MaterialIcons
                      name='radio-button-checked'
                      size={18}
                      style = {{color:this.state.plthcolor}}>
                    </MaterialIcons>
                    </View>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style = {{width:'100%'}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.getpricehtlData('price_htl')}>
                  <View style = {{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:10,marginBottom:10}}>
                    <View style = {{width:'92%',paddingLeft:10}}>
                      <Text style = {{color:'#000',fontSize:16,fontWeight:'bold'}}>Price high to low</Text>
                    </View>
                    <View style = {{width:'7%'}}>
                    <MaterialIcons
                      name='radio-button-checked'
                      size={18}
                      style = {{color:this.state.phtlcolor}}>
                    </MaterialIcons>
                    </View>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style = {{width:'100%'}}
                  underlayColor = 'transparent'
                  onPress = {()=>this.getnewarrivalsData('new_arrival')}>
                  <View style = {{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:10,marginBottom:10}}>
                    <View style = {{width:'92%',paddingLeft:10}}>
                      <Text style = {{color:'#000',fontSize:16,fontWeight:'bold'}}>New Arrivals</Text>
                    </View>
                    <View style = {{width:'7%'}}>
                    <MaterialIcons
                      name='radio-button-checked'
                      size={18}
                      style = {{color:this.state.arrivalscolor}}>
                    </MaterialIcons>
                    </View>
                  </View>
                </TouchableHighlight>
                <View style = {{width:'100%',alignItems:'center',justifyContent:'center',marginBottom:10,marginTop:10,flexDirection:'row'}}>
                  <TouchableHighlight style = {{width:'90%'}}
                    underlayColor = 'transparent'
                    onPress = {()=>this.getsortData()}>
                    <View style = {{width:'100%',alignItems:'center',justifyContent:'center',height:40,backgroundColor:'#2fdab8'}}>
                      <Text style = {{color:'#fff',fontSize:18,color:'#fff',fontWeight:'bold'}}>Sort</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </TouchableHighlight>
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
    justifyContent:'center',
    backgroundColor:'#eee'
  },
  toolbar:{
    height:'8%',
    width:'100%',
    alignItems:'center',
    justifyContent:'space-between',
    flexDirection:'row',
    backgroundColor:'#282a2d'
  },
  baseContainer:{
    height:'84%',
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
  iconView:{
    height:'100%',
    width:'10%',
    justifyContent:'center',
    alignItems:'center'
  },
  gridView: {
    flex: 1,
    width:'100%'
  },
  grid_content:{
    width:'100%',
    height:'100%',
  },
  imageView:{
    height:'100%',
    width:'100%',
    resizeMode:'stretch'
  },
  gridBaseView:{
    width:'100%',
    height:'100%',
    position:'absolute'
  },
  productDetails:{
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  productName:{
    color:'#fff',
    fontSize:16,
  },
  productPrice:{
    color:'#0cb038',
    fontSize:14,
  },
  productPrice_des:{
    color:'#fff',
    fontSize:14,
    marginRight:5
  }
})
