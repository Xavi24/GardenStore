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
import MultiSlider from '@ptomasroos/react-native-multi-slider'

let product_data = [];
let filterdata = [];
let cat_name = [];
let arr = [];
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 20;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};
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
      sortinput : '',
      urlPass : '',
      off :' % 0ff',
      tem_disc : 1,
      next_page_off : '',
      next_page_url : '',
      out_of_stock_screen : false,
      out_of_stock_screen_padding : 0,
      search_container_style : 0,
      color : '#333',
      price : '',
      empty_product_screen : false,
      search_size : 0,
      filter_screen : false,
      selected_cat : '',
      selected_brand : '',
      arr : [],
      spec_data : [],
      spec_show : false,
      item_value_data : [],
      customSelect : 'Select Your Choice',
      sel_spec_data : '',
      filterdata : [],
      cat_screen : false,
      grid_data : [],
      cat_grid_color : '#eee',
      selected_item_color : '#fff',
      empty : [],
      grid_item_color : '#369',
      height:45,
      animHeight:50,
      brand_screen  :false,
      grid_brands : [],
      selected_brand_color : '#fff',
      grid_brands_color : '#369',
      sort_url : '',
      emptyScreen : false

    }
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    console.warn('params...',params.name);
    let response = params.data;
    let url = params.url;
    this.setState({
      name : params.name,
      selected_cat : params.name,
      sort_url : params.sort_url
    });
    this.getFilterDetails(response,url);
  }
  getFilterDetails(response,url){
    let brand_name = [];
    let spec_name = [];
    let price : '';
    let color : '';
    let stockColor : '';
    console.warn('params//',response);
    if (response.data!= '') {
      this.setState({
        show : false
      });
      product_data.length = 0
      this.setState({
        next_page_url : response.data.next_page_url
      });
      if (response.data.data!=0) {
        for(let product of response.data.data){
          let off ='% off',
          tem_disc = 1;
          console.warn('discccccccccc',product.total_discount);
          if (product.total_discount < 1) {
            console.warn('entered into the loop');
              tem_disc = ''
              price = '',
              color = '#fff'
          } else {
            console.warn('entered into the else loop');
              off ='% off',
              tem_disc = product.total_discount.toString()+this.state.off
              price = product.price,
              color = "#333"
          }
          let stk = ''
          if (product.stock == 0) {
            stk = true,
            stockColor='#800000',
            this.setState({
              out_of_stock_screen : true,
              out_of_stock_screen_padding :2
            })
          } else {
            stk = false,
            stockColor='#0cb038'
          }
          product_data.push({
            name:product.name,
            slug:product.slug,
            img:product.img,
            price:price,
            id:product.id,
            disc:tem_disc,
            sale_price:product.sale_price,
            vendor_id:product.vendor_id,
            stock:stk,
            color : color
          })
          this.setState({
            product_data : product_data
          })
        }
      } else {
        this.setState({
          empty_product_screen : true
        })
      }
        if (response.filters.cat) {
        console.warn('filterCat//..//',response.filters.cat);
          cat_name.length = 0;
          if (response.filters.cat.sub_cat) {
            for(let sub_cat of response.filters.cat.sub_cat){
              console.log('filter_subcat///////////?????',sub_cat);
              cat_name.push({name:sub_cat.name})
            }
            this.setState({
              cat_data : cat_name
            })
            console.log('catData??????????',cat_name)
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
              urlPass : url
            })
          }
        }
    } else {
      this.setState({
        show : false
      })
    }
  }
  // getsortData(){
  //   console.warn('input',this.state.sortinput);
  //   console.warn('.............',this.state.url);
  //   if (this.state.sortinput!='') {
  //     var url = config.API_URL+'products/search?category='+this.state.name+'&'+'sort='+this.state.sortinput
  //     console.log('url',url);
  //     fetch(url)
  //      .then((response)=>response.json())
  //      .catch((error)=>console.warn(error))
  //      .then((response)=>{
  //        console.warn('response',response);
  //        if (response.data.length!=0) {
  //          this.props.navigation.navigate('sortdata',{data:response,url:this.state.url})
  //        }
  //      })
  //   }
  // }
  handleScroll(){
    let price : '';
    let color : '';
    let stockColor : '';
    this.setState({
      bottom : 'true'
    })
    if (this.state.next_page_url) {
      console.warn('call url',this.state.next_page_url);
      let cat_name = [];
      let brand_name = [];
      let spec_name = [];
      var url = this.state.next_page_url;
      fetch(url)
       .then((response)=>response.json())
       .catch((error)=>console.warn(error))
       .then((response)=>{
         if (response.data!= '') {
           this.setState({
             show : false
           });
           this.setState({
             next_page_url : response.data.next_page_url
           });
           if (response.data.data) {
             for(let product of response.data.data){
               let off ='% off',
               tem_disc = 1
               console.warn('discccccccccc',product.total_discount);
               if (product.total_discount < 1) {
                 console.warn('entered into the loop');
                   tem_disc = ''
                   price = '',
                   color = '#fff'
               } else {
                 console.warn('entered into the else loop');
                   off ='% off',
                   tem_disc = product.total_discount.toString()+this.state.off
                   price = product.price,
                   color = '333'
               }
               let stk = ''
               if (product.stock == 0) {
                 stk = true,
                 stockColor='#800000',
                 this.setState({
                   out_of_stock_screen : true,
                   out_of_stock_screen_padding :2
                 })
               } else {
                 stk = false,
                 stockColor='#0cb038'
               }
               product_data.push({
                 name:product.name,
                 slug:product.slug,
                 img:product.img,
                 price:price,
                 id:product.id,
                 disc:tem_disc,
                 sale_price:product.sale_price,
                 vendor_id:product.vendor_id,
                 stock:stk,
                 color:color
               });
               this.setState({
                 product_data : product_data
               });
               console.warn('product_data',this.state.product_data);
             }
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
      })
      console.warn('delayed bottom',this.state.bottom);
    },500)
  }
  goToSearch(){
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
  multiSliderValuesChange = (values) => {
    this.setState({
      min : values[0],
      max : values[1]
    })
  };
  postFilterData(){
    this.setState({
      show : true
    })
    console.log('url//test',this.state.urlPass);
    console.warn('url//name',this.state.name);
    let cat_name = [];
    let brand_name = [];
    let spec_name = [];
    let price = '';
    price = '['+'min='+this.state.min+','+'max='+this.state.max+']';
    var url = this.state.urlPass+this.state.selected_cat+'&'+'brand='+this.state.selected_brand+'&'+this.state.arr+'price[min]='+this.state.min+'&'+'price[max]='+this.state.max;
    console.log('url???????????',url);
    this.setState({
      sort_url : url
    });
    // console.log('firstFilterurl??????..............>>',this.state.sort_url);
    fetch(url)
        .then((response)=>response.json())
        .catch((error)=>console.warn(error))
        .then((response)=>{
          this.setState({
            show : false
          });
          console.warn('response',response);
          if (response.data) {
            filterdata.length = 0;
              if (response.data.data.length === 0) {
                this.setState({
                  emptyScreen : true
                })
              } else {
                this.setState({
                  filter_screen : false
                });
                this.props.navigation.navigate('filter_page',{data:response,url:url,name:this.state.name});
                this.getFilterDetails(response,url);
              }
           }
        })
    }
  callfn(name,spc){
    this.setState({
      specdata : name,
      spec_show:true,
      item_value_data:spc
    })
  }
  selFn(value){
    this.setState({
      sel_spec_data : value,
      customSelect : 'Your Choice Is : '
    });
  }
  updateSpceValue(){
    this.setState({
      customselected:this.state.sel_spec_data
    })
    filterdata.push({
      name : this.state.specdata,
      value : this.state.sel_spec_data
    })
    console.warn('sel_spec_data',this.state.customselected);
    console.warn('filterdata',filterdata);
    this.setState({
      filterdata : filterdata,
      spec_show : false
    })
    setTimeout(()=>{
      this.setState({
        customSelect : 'Select Your Choice',
        sel_spec_data : ''
      })
    }, 500);
    console.warn('filterdata',this.state.filterdata);
    let data = '';
    for(let key of filterdata){
      arr.length = 0;
      data += 'specs'+'['+key.name +']'+ '=' + key.value + '&';
      arr.push(data)
    }
    this.setState({
      arr : arr
    });
    console.warn('arr',this.state.arr);
  }
  render(){
    const {goBack} = this.props.navigation;
    return(
        <View style = {{height:'100%',width:'100%'}}>
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
                      spacing = {4}
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
                                        urlPass:this.state.sort_url,
                                        name:this.state.name
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
                                  onPress = {()=>this.setState({filter_screen:true})}>
                                  {/*// onPress = {()=>this.props.navigation.navigate('filter',*/}
                                  {/*//     {*/}
                                  {/*//       name:this.state.name,*/}
                                  {/*//       min:this.state.min,*/}
                                  {/*//       max:this.state.max,*/}
                                  {/*//       brand_data:this.state.brand_data,*/}
                                  {/*//       cat_data:cat_name,*/}
                                  {/*//       spec_data:this.state.spec_data,*/}
                                  {/*//       url:this.state.urlPass*/}
                                  {/*//     })}>*/}
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

            <Spinner visible = {this.state.show}
                     textContent = {"Loading..."}
                     color = {'#369'}
                     textStyle = {{color: '#369'}}
                     overlayColor = {'#fff'}
            />
          </View>
          <AnimatedHideView style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
                            visible={this.state.empty_product_screen}>
            <View style = {{height:'100%',width:'100%',backgroundColor:'#eee'}}>
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
                                      onPress = {()=>this.setState({search_container_style:60})}>
                    <MaterialIcons
                        name='search'
                        size={22}
                        style = {{color:'#fff'}}>
                    </MaterialIcons>
                  </TouchableHighlight>
                </View>
              </View>
              <View style = {{height:'78%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                <View style = {{width:'100%',height:this.state.search_container_style,backgroundColor:'#282a2d',alignItems:'center',justifyContent:'center',
                  marginTop:40}}>
                  <View style = {{width:'95%',height:'80%',alignItems:'center',justifyContent:'space-between',backgroundColor:'#eee',flexDirection:'row',}}>
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
                <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                  <View style={{width:' 95%',height:'40%',alignItems:'center',justifyContent:'center',marginBottom:10}}>
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
            </View>
          </AnimatedHideView>
          <AnimatedHideView visible={this.state.filter_screen}
            style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',backgroundColor:'rgba(00,00,00,0.7)'}}>
            <View style = {{width:'95%',height:'80%',backgroundColor:'#eee'}}>
              <View style = {{width:'98%',height:'8%',alignItems:'center',flexDirection:'row'}}>
                <View style = {{width:'10%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                  <TouchableHighlight underlayColor = 'transparent'
                    onPress = {()=>this.setState({filter_screen : false})}>
                    <MaterialIcons
                        name='close'
                        size={26}
                        style = {{color:'#000'}}>
                    </MaterialIcons>
                  </TouchableHighlight>
                </View>
                <View style = {{width:'90%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:'#000',fontWeight:'bold',fontSize:18}}>FILTER</Text>
                </View>
              </View>
              <View style = {{width:'98%',height:'92%',alignItems:'center',justifyContent:'center'}}>
                <ScrollView style = {{width:'100%',height:'100%'}}
                            showsVerticalScrollIndicator={false}>
                  <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                    <View style={{width:'98%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff',padding:10,elevation:2,marginTop:5}}>
                      <View style={{width:'100%'}}>
                        <Text style={{color:'#282a2d',fontSize:14,marginTop:5}}>Price</Text>
                      </View>
                      <View style = {{width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
                        <View style = {{width:'94%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:5}}>
                          <View>
                            <Text style = {{color:'#595656',fontSize:16}}>Min</Text>
                            <Text style = {{color:'#369',fontSize:14,marginTop:5}}>{this.state.min}</Text>
                          </View>
                          <View>
                            <Text style = {{color:'#595656',fontSize:16}}>Max</Text>
                            <Text style = {{color:'#369',fontSize:14}}>{this.state.max}</Text>
                          </View>
                        </View>
                        <MultiSlider
                            values={[this.state.min, this.state.max]}
                            onValuesChange={this.multiSliderValuesChange}
                            min={this.state.min}
                            max={this.state.max}
                            step={100}
                            allowOverlap
                            snapped
                        />
                      </View>
                    </View>
                    <View style={{width:'98%',backgroundColor:'#fff',elevation:2,padding:10,marginTop:10}}>
                      <GridView
                          itemDimension={90}
                          items={this.state.spec_data}
                          renderItem={item => (
                              <TouchableHighlight style = {{height:40,width:100,backgroundColor:'#eee',borderWidth:1,borderColor:'#757272'}}
                                                  underlayColor = 'transparent'
                                                  onPress = {()=>this.callfn(item.name,item.spec)}>
                                <View style = {{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                                  <Text style = {{color:'#757272',fontWeight:'bold'}}>{item.name}</Text>
                                </View>
                              </TouchableHighlight>
                          )}
                      />
                    </View>
                    <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                      <View style={{width:'98%',backgroundColor:'#48c7f0',marginTop:5,elevation:2,height:this.state.height}}>
                        <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                            underlayColor='transparent'
                                            onPress = {()=>this.setState({cat_screen:true,grid_data:cat_name,cat_grid_color:'#fff'})}>
                          <View style={{flexDirection:'row'}}>
                            <Text style={{color:'#fff',fontSize:14}}>Category</Text>
                            <MaterialIcons
                                style = {{marginLeft:10}}
                                name='keyboard-arrow-down'
                                size={24}
                                style = {{color:'#fff'}}>
                            </MaterialIcons>
                            <Text style = {{color:this.state.selected_item_color,fontSize:12,marginLeft:10,marginTop:5}}>{this.state.selected_cat}</Text>
                          </View>
                        </TouchableHighlight>
                      </View>

                      <AnimatedHideView visible={this.state.cat_screen}
                                        style={{width:'98%',backgroundColor:'#360',marginTop:5,elevation:2,height:this.state.animHeight,position:'absolute'}}>
                        <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                            underlayColor='transparent'
                                            onPress = {()=>this.setState({cat_screen:false,grid_data:this.state.empty})}>
                          <View style={{flexDirection:'row'}}>
                            <Text style={{color:'#fff',fontSize:14}}>Category</Text>
                            <MaterialIcons
                                style = {{marginLeft:10}}
                                name='keyboard-arrow-up'
                                size={24}
                                style = {{color:'#fff'}}>
                            </MaterialIcons>
                          </View>
                        </TouchableHighlight>
                      </AnimatedHideView>
                    </View>
                    <View style={{width:'98%'}}>
                      <GridView
                          style = {{backgroundColor:this.state.cat_grid_color}}
                          itemDimension={360}
                          items={this.state.grid_data}
                          renderItem={item => (
                              <View style = {{width:'100%',flexDirection:'row',borderTopColor:'#eee',borderTopWidth:1}}>
                                <Text style = {{color:this.state.grid_item_color,fontSize:12,marginTop:5}}
                                      onPress = {()=>this.setState({pass_name:item.name,grid_data:this.state.empty,selected_cat:item.name,
                                        cat_screen : false,cat_grid_color:'#eee'})}>{item.name}</Text>
                              </View>
                          )}
                      />
                    </View>
                    <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                      <View style={{width:'98%',backgroundColor:'#48c7f0',marginTop:5,elevation:2,height:this.state.height}}>
                        <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                            underlayColor='transparent'
                                            onPress = {()=>this.setState({brand_screen:true,grid_brands:this.state.brand_data,cat_grid_color:'#fff'})}>
                          <View style={{flexDirection:'row'}}>
                            <Text style={{color:'#fff',fontSize:14}}>Brands</Text>
                            <MaterialIcons
                                style = {{marginLeft:10}}
                                name='keyboard-arrow-down'
                                size={24}
                                style = {{color:'#fff'}}>
                            </MaterialIcons>
                            <Text style = {{color:this.state.selected_brand_color,fontSize:12,marginLeft:5,marginTop:5}}>{this.state.selected_brand}</Text>
                          </View>
                        </TouchableHighlight>
                      </View>

                      <AnimatedHideView visible={this.state.brand_screen}
                                        style={{width:'98%',backgroundColor:'#360',marginTop:5,elevation:2,height:this.state.animHeight,position:'absolute'}}>
                        <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                            underlayColor='transparent'
                                            onPress = {()=>this.setState({brand_screen:false,grid_brands:this.state.empty})}>
                          <View style={{flexDirection:'row'}}>
                            <Text style={{color:'#fff',fontSize:14}}>Brands</Text>
                            <MaterialIcons
                                style = {{marginLeft:10}}
                                name='keyboard-arrow-up'
                                size={24}
                                style = {{color:'#fff'}}>
                            </MaterialIcons>
                          </View>
                        </TouchableHighlight>
                      </AnimatedHideView>
                    </View>
                    <View style={{width:'98%'}}>
                      <GridView
                          style = {{backgroundColor:this.state.brand_grid_color}}
                          itemDimension={360}
                          items={this.state.grid_brands}
                          renderItem={item => (
                              <View style = {{width:'100%',flexDirection:'row',borderTopColor:'#eee',borderTopWidth:1}}>
                                <Text style = {{color:this.state.grid_brands_color,fontSize:12,marginTop:5}}
                                      onPress = {()=>this.setState({selected_brand:item.name,grid_brands:this.state.empty,brand_screen:false,
                                        brand_grid_color:'#eee'})}>{item.name}</Text>
                              </View>
                          )}
                      />
                    </View>
                  </View>
                </ScrollView>
                <View style = {{height:'8%',width:'98%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginBottom:10}}>
                  <View style = {{width:'50%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{fontSize:16,fontWeight:'bold',color:'#000'}}
                      onPress = {()=>this.setState({filter_screen : false})}>CANCEL</Text>
                  </View>
                  <View style = {{width:'50%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                    <TouchableHighlight style = {{width:'90%',height:'95%',alignItems:'center',justifyContent:'center',backgroundColor:'#48c7f0'}}
                      underlayColor = 'transparent'
                      onPress = {()=>this.postFilterData()}>
                      <Text style={{color:'#fff',fontSize:16,fontWeight:'bold'}}>FILTER</Text>
                    </TouchableHighlight>
                  </View>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)'}}
                            visible = {this.state.spec_show}>
            <View style = {{width:'85%',alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
              <View style = {{width:'100%',padding:20,borderBottomColor:'#757272',borderBottomWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}>
                <Text style = {{fontSize:18,color:'#369'}}>{this.state.customSelect}</Text>
                <Text style = {{fontSize:16,color:'#360'}}>{this.state.sel_spec_data}</Text>
              </View>
              <GridView
                  itemDimension={90}
                  items={this.state.item_value_data}
                  renderItem={item => (
                      <View style = {{width:'100%',padding:10}}>
                        <Text style = {{fontSize:12,color:'#369'}}
                              onPress = {()=>this.selFn(item.value)}>{item.value}</Text>
                      </View>
                  )}
              />
              <View style = {{width:'95%',flexDirection:'row',marginTop:30,marginBottom:10}}>
                <View style = {{width:'50%'}}>

                </View>
                <View style = {{width:'50%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                  <Text style = {{fontSize:16,color:'#360',fontWeight:'bold'}}
                        onPress = {()=>this.updateSpceValue()}>Confirm</Text>
                  <Text style = {{fontSize:16,color:'#800000',fontWeight:'bold'}}
                        onPress = {()=>this.setState({spec_show:false})}>Close</Text>
                </View>
              </View>
            </View>
          </AnimatedHideView>
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
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Filter</Text>
              </View>
              <View style = {styles.iconView}>

              </View>
            </View>
            <View style = {{height:'92%',width:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <View style={{width:'40%',height:'40%',alignItems:'center',justifyContent:'center',marginBottom:10}}>
                  <Image style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                         source = {require('../img/productempty.png')}>
                  </Image>
                </View>
                <View style = {{width:'42%',height:'6%',backgroundColor:'#282a2d',elevation:2,alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:'#fff'}}
                        onPress = {()=>this.props.navigation.navigate('mainscreen')}>Continue Shopping</Text>
                </View>
                <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                </View>
              </View>
            </View>
          </AnimatedHideView>
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
    color:'#666',
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
  }
})
