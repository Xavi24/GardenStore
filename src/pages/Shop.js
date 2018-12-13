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
        AsyncStorage,
        BackHandler,
        TextInput
  } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import GridView from 'react-native-super-grid'
import Ionicons from 'react-native-vector-icons/Ionicons'
import config from '../API/config'
import Spinner from 'react-native-loading-spinner-overlay'
import AnimatedHideView from 'react-native-animated-hide-view'

let product_data = [];
let filterdata = [];
let stockColor  = '';
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};
export default class Shop extends Component<{}>{
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
      bottom : '',
      next_page_url : '',
      urlPass : '',
      sortUrl : '',
      pressed : '',
      off :'% off',
      tem_disc : 1,
      next_page_off : '',
      emptyScreen : false,
      out_of_stock_screen : false,
      out_of_stock_screen_padding : 0,
      color : '#333',
      search_container_style : 0,
      price : '',
      show_fav : false,
      like : false,
      access_token : '',
      search_size : 0,
      urlCalled : false,
      size : 12
    }
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    console.warn('params',params);
    // this.setState({
    //   name : params.name
    // })
    this.getProductdata(params.name);
    this._getAccessToken();
  }

  getProductdata(name){
    let cat_name = [];
    let brand_name = [];
    let spec_name = [];
    this.setState({
      show : true
    });
    var url = config.API_URL+'products/search?category='+name;
    console.warn('name//pass//filter',name);
    fetch(url)
     .then((response)=>response.json())
     .catch((error)=>console.warn(error))
     .then((response)=>{
       console.log('response//shop',response);
       if (response.data) {
         this.setState({
           show : false
         });
         product_data.length = 0;
         this.setState({
           next_page_url : response.data.next_page_url
         });
         if (response.data.data.length > 0) {
           for(let product of response.data.data){
             let stock = product.stock
             if (product.total_discount < 1) {
               console.warn('entered into the loop');
               this.setState({
                 tem_disc : '',
                 price : '',
                 color : '#fff',
                 size : 0
               })
             } else {
               console.warn('entered into the else loop');
               this.setState({
                 off :'% off',
                 tem_disc : product.total_discount.toString()+this.state.off,
                 price : product.price,
                 color : '#333',
                 size : 10
               })
             }
             console.warn('discccccccccc',this.state.price);
             let stk = '';
             stockColor = '';
             if (product.stock == 0) {
               stk = true,
               stockColor = '#800000'
               this.setState({
                 out_of_stock_screen : true,
                 out_of_stock_screen_padding :2
               })
             } else {
               stk = false;
               stockColor='#0cb038'
               this.setState({
                 out_of_stock_screen : false
               })

             }
             product_data.push({
               name:product.name,
               slug:product.slug,
               img:product.img,
               price:this.state.price,
               id:product.id,
               disc:this.state.tem_disc,
               sale_price:product.sale_price,
               vendor_id:product.vendor_id,
               stock:stk,
               color : this.state.color,
               size : this.state.size
             });

           }
           this.setState({
             product_data : product_data
           });
           console.warn("Products list",product_data);
         } else {
           this.setState({
             emptyScreen : true
           })
         }
           if (response.filters.cat) {
             if (response.filters.cat.sub_cat) {
               for(let sub_cat of response.filters.cat.sub_cat){
                 console.log('filter---->>>>subcat',sub_cat);
                 cat_name.push({name:sub_cat.name})
               }
               this.setState({
                 cat_data : cat_name
               })
             }
             if (response.filters.brands) {
               for(let brands of response.filters.brands){
                 brand_name.push({name:brands.brand_details.name})
               }
               this.setState({
                 brand_data : brand_name
               })
             }
             if (response.filters.specs) {
              let spec_keys = Object.keys(response.filters.specs)
               for (var i = 0; i < spec_keys.length; i++) {
                 spec_name.push({
                   name:spec_keys[i],
                   spec:response.filters.specs[spec_keys[i]]
                 })
               }
               this.setState({
                 spec_data : spec_name
               })
             }
             if (response.filters.price) {
               this.setState({
                 min : parseInt(response.filters.price.min.split('.')[0]),
                 max : parseInt(response.filters.price.max.split('.')[0]),
                 urlPass : config.API_URL+'products/search?category=',
                 name : name,
                 sortUrl : url
               })
               console.warn('url//pass-->filter',this.state.urlPass);
               console.warn('url//pass-->name',this.state.name);
               console.warn('sortUrl//',this.state.sortUrl);
             }
           }
       } else {
         this.setState({
           show : false
         })
       }
     })
  }
  handleScroll(){
    this.setState({
      bottom : 'true'
    });

    if (this.state.next_page_url && !this.state.urlCalled) {
      console.warn('call url',this.state.next_page_url);
      this.setState({
        urlCalled :  true
      });
      let cat_name = [];
      let brand_name = [];
      let spec_name = [];
      var url = this.state.next_page_url;
      fetch(url)
       .then((response)=>response.json())
       .catch((error)=>console.warn(error))
       .then((response)=>{
         this.setState({
           urlCalled :  false
         });

         if (response.data!= '') {
           this.setState({
             show : false
           });
           this.setState({
             next_page_url : response.data.next_page_url
           });
           if (response.data.data) {
             for(let product of response.data.data){
               if (product.total_discount < 1) {
                 console.warn('entered into the loop');
                 this.setState({
                   tem_disc : '',
                   price : '',
                   color :'#fff'
                 })
               } else {
                 console.warn('entered into the else loop');
                 this.setState({
                   off :'% off',
                   tem_disc : product.total_discount.toString()+this.state.off,
                   price : product.price,
                   color  :'#333'
                 })
               }
               let stk = '';
               if (product.stock == 0) {
                 stk = true,
                 stockColor='#800000',
                 this.setState({
                   out_of_stock_screen : true,
                   out_of_stock_screen_padding :2
                 })
               } else {
                 stk = false,
                 stockColor='#0cb038',
                 this.setState({
                    out_of_stock_screen : false
                 })
               }
               product_data.push({
                 name:product.name,
                 slug:product.slug,
                 img:product.img,
                 price:this.state.price,
                 id:product.id,
                 disc:this.state.tem_disc,
                 sale_price:product.sale_price,
                 vendor_id:product.vendor_id,
                 stock:stk,
                 color:this.state.color,
                 like : false
               });

               console.warn('product_data',this.state.product_data);
             }
             this.setState({
               product_data : product_data
             });
           }
             // if (response.filters.cat) {
             //   if (response.filters.cat.sub_cat) {
             //     for(let sub_cat of response.filters.cat.sub_cat){
             //       cat_name.push({name:sub_cat.name})
             //     }
             //     this.setState({
             //       cat_data : cat_name
             //     })
             //   }
             //   if (response.filters.brands) {
             //     for(let brands of response.filters.brands){
             //       brand_name.push({name:brands.brand_details.name})
             //     }
             //     this.setState({
             //       brand_data : brand_name
             //     })
             //   }
             //   if (response.filters.specs) {
             //    let spec_keys = Object.keys(response.filters.specs)
             //     for (var i = 0; i < spec_keys.length; i++) {
             //       spec_name.push({
             //         name:spec_keys[i],
             //         spec:response.filters.specs[spec_keys[i]]
             //       })
             //     }
             //     this.setState({
             //       spec_data : spec_name
             //     })
             //   }
             //   if (response.filters.price) {
             //     this.setState({
             //       min : parseInt(response.filters.price.min.split('.')[0]),
             //       max : parseInt(response.filters.price.max.split('.')[0]),
             //       url : url
             //     })
             //   }
             // }
         }
       })
    }
    setTimeout(()=>{
      this.setState({
        bottom : ''
      });
      console.warn('delayed bottom',this.state.bottom);
    },500)
  }

  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      console.warn('value',value);
      if (value !== null) {
        this.setState({
          access_token : value
        });
      } else {
      }
    } catch (error) {
      console.warn('error',error.message);
    }
  }
  goToSearch(){
    console.warn(';;;;;;;;;;;;;;;;;',this.state.search_data);
    if (this.state.search_data) {
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
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Gardens Store</Text>
          </View>
          <View style = {styles.iconView}>
            <TouchableHighlight underlayColor = 'transparent'
              onPress = {()=>this.setState({search_container_style:60,search_size:24})}>
              <MaterialIcons
                name='search'
                size={22}
                style = {{color:'#fff'}}>
              </MaterialIcons>
            </TouchableHighlight>
          </View>
        </View>
        <View style = {styles.baseContainer}>
          <View style = {{width:'100%',height:this.state.search_container_style,backgroundColor:'#282a2d',alignItems:'center',justifyContent:'center'}}>
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
                    size={this.state.search_size}
                    style = {{color:'#fff'}}>
                  </MaterialIcons>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <ScrollView style = {{height:'100%',width:'100%'}}
            onScroll={({nativeEvent}) => {
              if (isCloseToBottom(nativeEvent)) {
                this.handleScroll();
              }
            }}
            scrollEventThrottle={400}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <GridView
                itemDimension = {150}
                items = {this.state.product_data}
                style = {styles.gridView}
                spacing = {2}
                renderItem = {item =>
                  <View style = {{elevation:3,height:300,width:'100%',backgroundColor:'#fff'}}>
                    <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                      underlayColor = 'transparent'
                      onPress = {()=>this.props.navigation.navigate('details',{slug:item.slug,img:item.img,id:item.id,vendor_id:item.vendor_id})}>
                      <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                        <Image style = {{height:'75%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                          source ={{uri:config.IMG_URL+item.img}}>
                        </Image>
                        <AnimatedHideView style = {{height:'100%',width:'95%',position:'absolute'}}
                          visible = {item.stock}>
                          <View style = {{width:'100%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                            <View></View>
                            <View style = {{backgroundColor:'#800000',padding:this.state.out_of_stock_screen_padding,alignItems:'center',
                              justifyContent:'center',borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
                              <Text style = {{fontSize:10,color:'#fff',marginLeft:1,marginRight:1}}>out of stock</Text>
                            </View>
                          </View>
                        </AnimatedHideView>
                        <View style = {{height:'25%',width:'98%',alignItems:'center',justifyContent:'center',padding:5}}>
                          <View style = {{width:'100%',height:'100%'}}>
                            <Text style = {styles.productName}>{item.name}</Text>
                            <View style = {{width:'100%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',
                              marginTop:6,marginBottom:5}}>
                              <View style = {{flexDirection:'row'}}>
                                <Image style = {{width:11,height:11,alignItems:'center',justifyContent:'center',resizeMode:'stretch',marginTop:4}}
                                  source = {require('../img/curr.png')}>
                                </Image>
                                <Text style = {styles.productPrice}>{item.sale_price}</Text>
                                <Text style = {{color:item.color,fontSize:10,marginLeft:5,textDecorationLine:'line-through',
                                  marginTop:2}}>{item.price}</Text>
                                <Text style = {{color:'#0cb038',fontSize:10,marginLeft:5,marginTop:2}}>{item.disc}</Text>
                              </View>
                              <View>
                              </View>
                            </View>
                          </View>
                        </View>
                      </View>
                    </TouchableHighlight>
                  </View>
                }
              />
            </View>
          </ScrollView>
        </View>
        <View style = {{height:'8%',width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:'#fff'}}>
          <TouchableHighlight style = {{height:'100%',width:'50%'}}
            underlayColor = 'transparent'
            onPress = {()=>this.props.navigation.navigate('sort',
              {
                // url:this.state.sortUrl,
                name:this.state.name,
                urlPass : this.state.sortUrl
              })}>
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
              url:this.state.urlPass
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
        <AnimatedHideView
          visible = {this.state.emptyScreen}
          style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',backgroundColor:'#fff'}}>
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
              <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Garden Store</Text>
             </View>
            <View style = {styles.iconView}>

            </View>
          </View>
          <View style = {styles.baseContainer2}>
            <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style={{width:'95%',height:'40%',alignItems:'center',justifyContent:'center',marginBottom:10}}>
                <Image style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                       source = {require('../img/productempty.png')}>
                </Image>
              </View>
              <View style = {{width:'42%',height:'6%',backgroundColor:'#282a2d',elevation:2,alignItems:'center',justifyContent:'center'}}>
                <Text style={{color:'#fff'}}
                      onPress = {()=>this.props.navigation.navigate('mainscreen')}>Continue Shopping</Text>
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
    height:'70%',
    width:'95%',
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
    color:'#595656',
    fontSize:12,
  },
  productPrice:{
    color:'#48c7f0',
    fontSize:12,
  },
  productPrice_des:{
    color:'#333',
    fontSize:14,
    marginRight:5
  },
  baseContainer2:{
    height:'92%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  }
});
