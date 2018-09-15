import React,{Component} from 'react'
import {View,
        ScrollView,
        Image,
        Text,
        StyleSheet,
        StatusBar,
        TouchableOpacity,
        TouchableHighlight,
        TextInput,
        BackHandler,
        BackAndroid,
        FlatList
  } from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Swiper from 'react-native-swiper'
import config from '../API/config'
import GridView from 'react-native-super-grid'
import Spinner from 'react-native-loading-spinner-overlay'
import AnimatedHideView from 'react-native-animated-hide-view'
import Toast from "react-native-simple-toast";

var menu_name = [];
var menu_data = [];
let CMS_layout = [];

export default class MainScreen extends Component<{}>{
  static navigationOptions = {
    header : null
  }

  constructor(props){
    super(props);
    this.state = {
      name: [],
      show: false,
      subCat: [],
      cat_name: [],
      menu_data: [],
      array: [],
      search_data: '',
      visible: false,
      pressed: 'true',
      total_sec: 0,
      sections: [],
      cms : [],

    }
  };
  // componentDidMount() {
  //   const {goBack} = this.props.navigation
  //   this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
  //     if (this.state.pressed == '') {
  //       goBack();
  //     } else {
  //       this.exitFunction();
  //     }
  //     console.warn('pressed');
  //     return true;
  //   });
  // }
  // componentWillUnmount() {
  //   BackHandler.removeEventListener('hardwareBackPress');
  // }

  // exitFunction(){
  //   this.setState({
  //     visible : true
  //   })
  // }
  //
  // kickOut(){
  //   BackAndroid.exitApp()
  // }

  getMenu(){
      let sub = {};
      var url = config.API_URL+'getMenu';
      fetch(url)
        .then((response)=> response.json())
        .then((response)=> {
          if (response.data!=null) {
            this.setState({
              show : false
            });
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
      twoblockresponse(key,value){
        console.log('key',key);
        console.warn('value',value);
        if (value == 'product_detail') {
          this.props.navigation.navigate('details',{slug:key});
        } else if (value == 'product_list'){
          var api = config.API_URL+'products/search?'+key;
          console.log('api//twoblock',api);
          fetch(api)
              .then((response)=>response.json())
              .catch((error)=>console.warn(error))
              .then((response)=>{
                console.warn('twoBlockResponse',response);
                if (response.data.length>0){
                  this.props.navigation.navigate('filter_page',{data:response,url:config.API_URL+'products/search?category='});
                }
              })
        }
      }
      threeBlockresponse(key,value){
        console.warn('key',key);
        console.warn('value',value);
        if (value == 'product_detail') {
          this.props.navigation.navigate('details',{slug:key});
        } else if (value == 'product_list'){
          var api = config.API_URL+'products/search?'+key;
          console.log('api//threeblock',api);
          fetch(api)
              .then((response)=>response.json())
              .catch((error)=>console.warn(error))
              .then((response)=>{
                if (response.data.length>0){
                  this.props.navigation.navigate('filter_page',{data:response,url:config.API_URL+'products/search?category='});
                }
                console.warn('threeBlockResponse',response);
              })
        }
      }
      leftbigresponse(key,value){
        console.warn('key',key);
        console.warn('value',value);
        if (value == 'product_detail') {
          this.props.navigation.navigate('details',{slug:key});
        } else if (value == 'product_list'){
          var api = config.API_URL+'products/search?'+key;
          console.log('api//threeblock',api);
          fetch(api)
              .then((response)=>response.json())
              .catch((error)=>console.warn(error))
              .then((response)=>{
                if (response.data.length>0){
                  this.props.navigation.navigate('filter_page',{data:response,url:config.API_URL+'products/search?category='});
                }
                console.warn('threeBlockResponse',response);
              })
        }
      }
      threeBlockverticalResponse(key,value){
        console.warn('key',key);
        console.warn('value',value);
        if (value == 'product_detail') {
          this.props.navigation.navigate('details',{slug:key});
        } else if (value == 'product_list'){
          var api = config.API_URL+'products/search?'+key;
          console.log('api//threeblock',api);
          fetch(api)
              .then((response)=>response.json())
              .catch((error)=>console.warn(error))
              .then((response)=>{
                if (response.data.length>0){
                  this.props.navigation.navigate('filter_page',{data:response,url:config.API_URL+'products/search?category='});
                }
                console.warn('threeBlockResponse',response);
              })
        }
      }
      getCMSData(){

        var url = config.API_URL+'mobile/home';
        fetch(url)
            .then((response)=>response.json())
            .catch((error)=>console.warn(error))
            .then((response)=>{
              console.warn('CMS response',response);
              if (response.data) {
                this.setState({
                  total_sec : response.data.total_sections
                });
                if (response.data.contents){
                  let key = Object.keys(response.data.contents);
                  let i = 0;
                  let j = 0;
                  this.state.sections.length = 0;
                  this.state.cms.length = 0;
                    for (j=0;j<this.state.total_sec;j++){
                      this.state.sections.push({
                        sec : key[j],
                        cms : response.data.contents[key[j]]
                      });
                      // console.warn('sections-->'+j,this.state.sections);
                    }
                    CMS_layout.length = 0;
                    for (let cmsdata of this.state.sections){
                      let main_cat_data = [];
                      let sub_cat_data = [];
                      if (cmsdata.cms.temp_name == 'main-category-list-mobile'){
                          for (let data of cmsdata.cms.elements.element_1.data){
                            console.warn('data',data);
                            main_cat_data.push({
                              name : data.name,
                              img : data.img
                            })
                          }
                          CMS_layout.push({
                            name : 'layout',
                            value : <View style={{width:'100%',alignItems:'center',justifyContent:'center',elevation:2}}>
                              <ScrollView horizontal={true}
                                showsHorizontalScrollIndicator={false}>
                                <FlatList
                                    data={main_cat_data}
                                    numColumns={cmsdata.cms.elements.element_1.data.length}
                                    renderItem={({item, index })=>(
                                        <View style={{alignItems:'center',justifyContent:'space-between'}}>
                                          <View style = {{height:100,width:130,alignItems:'center',justifyContent:'center',elevation:4,borderColor:'#eee',borderWidth:1,
                                            marginRight: 5}}>
                                            <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                              underlayColor='transparent'
                                              onPress = {()=>this.props.navigation.navigate('shop',{name:item.name})}>
                                              <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                                     source={{uri:config.IMG_URL+item.img}}/>
                                            </TouchableHighlight>
                                          </View>
                                          <Text style={{color:'#595656',fontSize:12,fontWeight:'bold',marginTop:5}}>{item.name}</Text>
                                        </View>

                                    )}
                                />
                              </ScrollView>
                            </View>
                          })
                      }
                      if (cmsdata.cms.temp_name == 'single-banner-layout-mobile'){
                        let img = cmsdata.cms.elements.element_1.data;
                        console.warn('single-banner-img',img);
                        CMS_layout.push({
                          name : 'layout',
                          value: <View style={{width:'100%',height:200,alignItems:'center',justifyContent:'center'}}>
                            <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                source={{uri:config.IMG_URL+img}}>
                            </Image>
                          </View>
                        })
                      }
                      if (cmsdata.cms.temp_name == 'three-block-layout-mobile'){
                        let firstParams = {};
                        let firstBlockRedirect_3 = '';
                        let secondBlockRedirect_3 = '';
                        let thirdBlockRedirect_3 = '';
                        let field_1 = '';
                        let field_2 = '';
                        let field_3 = '';
                        let cat_3 = '';
                        let brand_3 = '';
                        let discount_3 = '';
                        let api_3 = '';
                        let firstBlockImg = cmsdata.cms.elements.element_1.data;
                        let secondBlockImg = cmsdata.cms.elements.element_2.data;
                        let thirdBlockImg = cmsdata.cms.elements.element_3.data;
                        if (cmsdata.cms.elements.element_1.redirect == 'product_list') {
                          field_1 = cmsdata.cms.elements.element_1.redirect;
                          for(let params1 of cmsdata.cms.elements.element_1.params){
                            if (params1.param == 'category') {
                              cat_3 = 'category='+params1.value+'&';
                            }
                            if (params1.param == 'brand'){
                              brand_3 = 'brand='+params1.value+'&';
                            }
                            if (params1.param == 'discount'){
                              discount_3 = 'discount[min]='+params1.value.min+'&'+'discount[max]='+params1.value.max;
                            }
                          }
                          api_3 = cat_3+brand_3+discount_3;
                          firstBlockRedirect_3 = api_3;
                        } else if (cmsdata.cms.elements.element_1.redirect == 'product_detail') {
                          field_1 = cmsdata.cms.elements.element_1.redirect;
                          firstBlockRedirect_3 = cmsdata.cms.elements.element_1.slug;
                        }
                        if (cmsdata.cms.elements.element_2.redirect == 'product_list'){
                          field_2 = cmsdata.cms.elements.element_2.redirect;
                          for(let params1 of cmsdata.cms.elements.element_2.params){
                            if (params1.param == 'category') {
                              cat_3 = 'category='+params1.value+'&';
                            }
                            if (params1.param == 'brand'){
                              brand_3 = 'brand='+params1.value+'&';
                            }
                            if (params1.param == 'discount'){
                              discount_3 = 'discount[min]='+params1.value.min+'&'+'discount[max]='+params1.value.max;
                            }
                          }
                          api_3 = cat_3+brand_3+discount_3;
                          secondBlockRedirect_3 = api_3;
                        } else if (cmsdata.cms.elements.element_2.redirect == 'product_detail') {
                          field_2 = cmsdata.cms.elements.element_2.redirect;
                          secondBlockRedirect_3 = cmsdata.cms.elements.element_2.slug;
                        }
                        if (cmsdata.cms.elements.element_3.redirect == 'product_list') {
                          field_3 = cmsdata.cms.elements.element_3.redirect;
                          for(let params1 of cmsdata.cms.elements.element_3.params){
                            if (params1.param == 'category') {
                              cat_3 = 'category='+params1.value+'&';
                            }
                            if (params1.param == 'brand'){
                              brand_3 = 'brand='+params1.value+'&';
                            }
                            if (params1.param == 'discount'){
                              discount_3 = 'discount[min]='+params1.value.min+'&'+'discount[max]='+params1.value.max;
                            }
                          }
                          api_3 = cat_3+brand_3+discount_3;
                          thirdBlockRedirect_3 = api_3;
                        } else if (cmsdata.cms.elements.element_3.redirect == 'product_detail') {
                          field_3 = cmsdata.cms.elements.element_3.redirect;
                          thirdBlockRedirect_3 = cmsdata.cms.elements.element_3.slug;
                        }
                        console.warn('firstparams',firstParams);
                        CMS_layout.push({
                          name : 'layout',
                          value : <View style={{width:'100%',height:100,alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                            <View style={{height:'100%',width:'33%',alignItems:'center',justifyContent:'center'}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                underlayColor='transparent'
                                onPress = {()=>this.threeBlockresponse(firstBlockRedirect_3,field_1)}>
                                <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source={{uri:config.IMG_URL+firstBlockImg}}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                            <View style={{height:'100%',width:'33%',alignItems:'center',justifyContent:'center'}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                                  underlayColor='transparent'
                                                  onPress = {()=>this.threeBlockresponse(secondBlockRedirect_3,field_2)}>
                                <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source={{uri:config.IMG_URL+secondBlockImg}}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                            <View style={{height:'100%',width:'33%',alignItems:'center',justifyContent:'center'}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                                  underlayColor='transparent'
                                                  onPress = {()=>this.threeBlockresponse(thirdBlockRedirect_3,field_3)}>
                                <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source={{uri:config.IMG_URL+thirdBlockImg}}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                          </View>
                        })
                      }
                      if (cmsdata.cms.temp_name == 'two-block-layout-mobile'){
                        let firstBlockImg = cmsdata.cms.elements.element_1.data;
                        let secondBlockImg = cmsdata.cms.elements.element_2.data;
                        let firstBlockRedirect = '';
                        let secondBlockRedirect = '';
                        let field = '';
                        let field2 = '';
                        let cat = '';
                        let brand = '';
                        let discount = '';
                        let api_1 = '';
                        if (cmsdata.cms.elements.element_1.redirect == 'product_detail'){
                          field = cmsdata.cms.elements.element_1.redirect;
                          firstBlockRedirect = cmsdata.cms.elements.element_1.slug;
                        } else if (cmsdata.cms.elements.element_1.redirect == 'product_list') {
                          field = cmsdata.cms.elements.element_1.redirect;
                          for(let params1 of cmsdata.cms.elements.element_1.params){
                           if (params1.param == 'category') {
                             cat = 'category='+params1.value+'&';
                           }
                           if (params1.param == 'brand'){
                             brand = 'brand='+params1.value+'&';
                           }
                           if (params1.param == 'discount'){
                             discount = 'discount[min]='+params1.value.min+'&'+'discount[max]='+params1.value.max;
                           }
                          }
                          api_1 = cat+brand+discount;
                          firstBlockRedirect = api_1;
                        }
                        if (cmsdata.cms.elements.element_2.redirect == 'product_detail'){
                          field2 = cmsdata.cms.elements.element_2.redirect;
                          secondBlockRedirect = cmsdata.cms.elements.element_2.slug;
                        } else if (cmsdata.cms.elements.element_2.redirect == 'product_list') {
                          field2 = cmsdata.cms.elements.element_2.redirect;
                          for (let params1 of cmsdata.cms.elements.element_2.params) {
                            if (params1.param == 'category') {
                              cat = 'category=' + params1.value + '&';
                            }
                            if (params1.param == 'brand') {
                              brand = 'brand=' + params1.value + '&';
                            }
                            if (params1.param == 'discount') {
                              discount = 'discount[min]=' + params1.value.min + '&' + 'discount[max]=' + params1.value.max;
                            }
                          }
                          api_1 = cat + brand + discount;
                          secondBlockRedirect = api_1;
                        }
                        CMS_layout.push({
                          name : 'layout',
                          value : <View style={{width:'100%',height:150,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <View style={{width:'70%',height:'100%',backgroundColor:'#fff',elevation:2,borderColor:'#eee',borderRightWidth: 2}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                underlayColor='transparent'
                                onPress = {()=>this.leftbigresponse(firstBlockRedirect,field)}>
                                <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source={{uri:config.IMG_URL+firstBlockImg}}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                            <View style={{width:'30%',height:'100%',backgroundColor:'#fff',elevation:2,borderColor:'#eee',borderLeftWidth: 2}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                underlayColor='transparent'
                                onPress = {()=>this.leftbigresponse(secondBlockRedirect,field2)}>
                                <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source={{uri:config.IMG_URL+secondBlockImg}}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                          </View>
                        })
                      }
                      if (cmsdata.cms.temp_name == 'sub-category-list-mobile'){
                        for (let data of cmsdata.cms.elements.element_1.data){
                          console.warn('data',data);
                          sub_cat_data.push({
                            name : data.name,
                            img : data.img
                          })
                        }
                        CMS_layout.push({
                          name : 'layout',
                          value : <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                            <ScrollView horizontal={true}
                                        showsHorizontalScrollIndicator={false}>
                              <FlatList
                                  data={sub_cat_data}
                                  numColumns={cmsdata.cms.elements.element_1.data.length}
                                  renderItem={({item, index })=>(
                                      <View style={{alignItems:'center',justifyContent:'space-between'}}>
                                        <View style = {{height:100,width:130,alignItems:'center',justifyContent:'center',elevation:4,borderColor:'#eee',borderWidth:1,
                                          marginRight: 5}}>
                                          <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                                              underlayColor='transparent'
                                                              onPress = {()=>this.props.navigation.navigate('shop',{name:item.name})}>
                                            <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                                   source={{uri:config.IMG_URL+item.img}}/>
                                          </TouchableHighlight>
                                        </View>
                                        <Text style={{color:'#595656',fontSize:12,fontWeight:'bold',marginTop:5}}>{item.name}</Text>
                                      </View>

                                  )}
                              />
                            </ScrollView>
                          </View>
                        })
                      }
                      if (cmsdata.cms.temp_name == 'three-block-vertical-layout-mobile'){
                        let firstBlockVerticalRedirect_3 = '';
                        let secondBlockVerticalRedirect_3 = '';
                        let thirdBlockVerticalRedirect_3 = '';
                        let fieldVertical_1 = '';
                        let fieldVertical_2 = '';
                        let fieldVertical_3 = '';
                        let catVertical_3 = '';
                        let brandVertical_3 = '';
                        let discountVertical_3 = '';
                        let apiVertical_3 = '';
                        let firstBlockVerticalImg = cmsdata.cms.elements.element_1.data;
                        let secondBlockVerticalImg = cmsdata.cms.elements.element_2.data;
                        let thirdBlockVerticalImg = cmsdata.cms.elements.element_3.data;
                        if (cmsdata.cms.elements.element_1.redirect == 'product_list') {
                          fieldVertical_1 = cmsdata.cms.elements.element_1.redirect;
                          for(let params1 of cmsdata.cms.elements.element_1.params){
                            if (params1.param == 'category') {
                              catVertical_3 = 'category='+params1.value+'&';
                            }
                            if (params1.param == 'brand'){
                              brandVertical_3 = 'brand='+params1.value+'&';
                            }
                            if (params1.param == 'discount'){
                              discountVertical_3 = 'discount[min]='+params1.value.min+'&'+'discount[max]='+params1.value.max;
                            }
                          }
                          apiVertical_3 = catVertical_3+brandVertical_3+discountVertical_3;
                          firstBlockVerticalRedirect_3 = api_3;
                        } else if (cmsdata.cms.elements.element_1.redirect == 'product_detail') {
                          fieldVertical_1 = cmsdata.cms.elements.element_1.redirect;
                          firstBlockVerticalRedirect_3 = cmsdata.cms.elements.element_1.slug;
                        }
                        if (cmsdata.cms.elements.element_2.redirect == 'product_list'){
                          fieldVertical_2 = cmsdata.cms.elements.element_2.redirect;
                          for(let params1 of cmsdata.cms.elements.element_2.params){
                            if (params1.param == 'category') {
                              catVertical_3 = 'category='+params1.value+'&';
                            }
                            if (params1.param == 'brand'){
                              brandVertical_3 = 'brand='+params1.value+'&';
                            }
                            if (params1.param == 'discount'){
                              discountVertical_3 = 'discount[min]='+params1.value.min+'&'+'discount[max]='+params1.value.max;
                            }
                          }
                          apiVertical_3 = catVertical_3+brandVertical_3+discountVertical_3;
                          secondBlockVerticalRedirect_3 = api_3;
                        } else if (cmsdata.cms.elements.element_2.redirect == 'product_detail') {
                          fieldVertical_2 = cmsdata.cms.elements.element_2.redirect;
                          secondBlockVerticalRedirect_3 = cmsdata.cms.elements.element_2.slug;
                        }
                        if (cmsdata.cms.elements.element_3.redirect == 'product_list') {
                          fieldVertical_3 = cmsdata.cms.elements.element_3.redirect;
                          for(let params1 of cmsdata.cms.elements.element_3.params){
                            if (params1.param == 'category') {
                              catVertical_3 = 'category='+params1.value+'&';
                            }
                            if (params1.param == 'brand'){
                              brandVertical_3 = 'brand='+params1.value+'&';
                            }
                            if (params1.param == 'discount'){
                              discountVertical_3 = 'discount[min]='+params1.value.min+'&'+'discount[max]='+params1.value.max;
                            }
                          }
                          apiVertical_3 = cat_3+brand_3+discount_3;
                          thirdBlockVerticalRedirect_3 = api_3;
                        } else if (cmsdata.cms.elements.element_3.redirect == 'product_detail') {
                          fieldVertical_3 = cmsdata.cms.elements.element_3.redirect;
                          thirdBlockVerticalRedirect_3 = cmsdata.cms.elements.element_3.slug;
                        }
                        CMS_layout.push({
                          name : 'layout',
                          value : <View style={{width:'100%',backgroundColor:'#471239',alignItems:'center',justifyContent:'center'}}>
                            <View style={{height:200,width:'100%',alignItems:'center',justifyContent:'center',borderColor:'#eee',borderWidth:2}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                                  underlayColor='transparent'
                                                  onPress = {()=>this.threeBlockverticalResponse(firstBlockVerticalRedirect_3,fieldVertical_1)}>
                                <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source={{uri:config.IMG_URL+firstBlockVerticalImg}}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                            <View style={{height:200,width:'100%',alignItems:'center',justifyContent:'center',borderColor:'#eee',borderWidth:2}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                                  underlayColor='transparent'
                                                  onPress = {()=>this.threeBlockverticalResponse(secondBlockVerticalRedirect_3,fieldVertical_2)}>
                                <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source={{uri:config.IMG_URL+secondBlockVerticalImg}}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                            <View style={{height:200,width:'100%',alignItems:'center',justifyContent:'center',borderColor:'#eee',borderWidth:2}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                                  underlayColor='transparent'
                                                  onPress = {()=>this.threeBlockverticalResponse(thirdBlockVerticalRedirect_3,fieldVertical_3)}>
                                <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source={{uri:config.IMG_URL+thirdBlockVerticalImg}}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                          </View>
                        })
                      }
                      if(cmsdata.cms.temp_name == 'single-text-layout-mobile'){
                        let text = cmsdata.cms.elements.element_1.data;
                        CMS_layout.push({
                          name : 'layout',
                          value : <View style={{width:'100%',height:100,alignItems:'center',justifyContent:'center'}}>
                            <Text style={{color:'#565959',fontSize:22,fontWeight:'bold'}}>{text}</Text>
                          </View>
                        })
                      }
                      if (cmsdata.cms.temp_name == 'left-block-big-right-block-small-layout'){
                        let firstlftbigBlockImg = cmsdata.cms.elements.element_1.data;
                        let secondlftbigBlockImg = cmsdata.cms.elements.element_2.data;
                        let firstBlocklftbigRedirect = '';
                        let secondBlocklftbigRedirect = '';
                        let fieldlftbig = '';
                        let fieldlftbig2 = '';
                        let catlftbig = '';
                        let brandlftbig = '';
                        let discountlftbig = '';
                        let api_1lftbig = '';
                        if (cmsdata.cms.elements.element_1.redirect == 'product_detail'){
                          fieldlftbig = cmsdata.cms.elements.element_1.redirect;
                          firstBlocklftbigRedirect = cmsdata.cms.elements.element_1.slug;
                        } else if (cmsdata.cms.elements.element_1.redirect == 'product_list') {
                          fieldlftbig = cmsdata.cms.elements.element_1.redirect;
                          for(let params1 of cmsdata.cms.elements.element_1.params){
                            if (params1.param == 'category') {
                              catlftbig = 'category='+params1.value+'&';
                            }
                            if (params1.param == 'brand'){
                              brandlftbig = 'brand='+params1.value+'&';
                            }
                            if (params1.param == 'discount'){
                              discountlftbig = 'discount[min]='+params1.value.min+'&'+'discount[max]='+params1.value.max;
                            }
                          }
                          api_1lftbig = catlftbig+brandlftbig+discountlftbig;
                          firstBlocklftbigRedirect = api_1;
                        }
                        if (cmsdata.cms.elements.element_2.redirect == 'product_detail'){
                          fieldlftbig2 = cmsdata.cms.elements.element_2.redirect;
                          secondBlocklftbigRedirect = cmsdata.cms.elements.element_2.slug;
                        } else if (cmsdata.cms.elements.element_2.redirect == 'product_list') {
                          fieldlftbig2 = cmsdata.cms.elements.element_2.redirect;
                          for (let params1 of cmsdata.cms.elements.element_2.params) {
                            if (params1.param == 'category') {
                              catlftbig = 'category=' + params1.value + '&';
                            }
                            if (params1.param == 'brand') {
                              brandlftbig = 'brand=' + params1.value + '&';
                            }
                            if (params1.param == 'discount') {
                              discountlftbig = 'discount[min]=' + params1.value.min + '&' + 'discount[max]=' + params1.value.max;
                            }
                          }
                          api_1lftbig = catlftbig + brandlftbig + discountlftbig;
                          secondBlocklftbigRedirect = api_1;
                        }
                        CMS_layout.push({
                          name : 'layout',
                          value : <View style={{width:'100%',height:200,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                            <View style={{width:'50%',height:'100%',backgroundColor:'#fff',elevation:2,borderColor:'#eee',borderRightWidth: 2}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                                  underlayColor='transparent'
                                                  onPress = {()=>this.twoblockresponse(firstBlocklftbigRedirect,fieldlftbig)}>
                                <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source={{uri:config.IMG_URL+firstlftbigBlockImg}}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                            <View style={{width:'50%',height:'100%',backgroundColor:'#fff',elevation:2,borderColor:'#eee',borderLeftWidth: 2}}>
                              <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                                  underlayColor='transparent'
                                                  onPress = {()=>this.twoblockresponse(secondBlocklftbigRedirect,fieldlftbig2)}>
                                <Image style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                       source={{uri:config.IMG_URL+secondlftbigBlockImg}}>
                                </Image>
                              </TouchableHighlight>
                            </View>
                          </View>
                        })
                      }
                    }
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
    });
    this.getMenu();
    this.getCMSData();
  }
  render(){

    return(
      <View style = {{width:'100%',height:'100%'}}>
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
          <View style = {{width:'100%',height:'10%',backgroundColor:'#282a2d',alignItems:'center',justifyContent:'center'}}>
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
          <View style = {{width:'100%',height:'82%',alignItems:'center',justifyContent:'center'}}>
            <ScrollView style = {{marginBottom:5,width:'100%'}}
              showsVerticalScrollIndicator = {false}>
              <View style = {styles.scrollContainer}>
                <View style = {styles.baseContainer}>
                    <View style = {styles.gridContainer}>
                      <GridView
                        itemDimension={90}
                        spacing = {2}
                        items={this.state.menu_data}
                        renderItem={item => (
                            <View style={{width:100,height:40,elevation: 2}}>
                              <TouchableHighlight style = {{height:'100%',width:'100%',backgroundColor:'#2fdab8'}}
                                                  underlayColor = 'transparent'
                                                  onPress = {()=>this.props.navigation.navigate('shop',{name:item.name})}>
                                <View style = {{width:'100%',height:'100%',justifyContent:'center',alignItems:'center'}}>
                                  <Text style = {{color:'#fff',fontWeight:'bold'}}>{item.name}</Text>
                                </View>
                              </TouchableHighlight>
                            </View>
                        )}
                      />
                    </View>

                <View style={{width:'100%',alignItems:'center',justifyContent:'center'}}>
                  <GridView
                      itemDimension = {360}
                      items = {CMS_layout}
                      spacing = {1}
                      renderItem = {item =>
                          <View style={{width:'100%',elevation:2}}>
                            {item.value}
                          </View>
                      }
                  />
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
        <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute',
          backgroundColor:'rgba(00, 00, 00, 0.4)'}}
          visible = {this.state.visible}>
          <View style = {{width:'90%',backgroundColor:'rgba(00, 00, 00, 0.8)',alignItems:'center',justifyContent:'center',
            borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold',marginTop:30}}>Wants to exit your application?</Text>
            <View style = {{width:'90%',alignItems:'center',justifyContent:'center',flexDirection:'row',marginTop:40,marginBottom:20}}>
              <View style = {{width:'50%'}}></View>
              <View style = {{width:'50%',alignItems:'center',justifyContent:'space-between',flexDirection:'row'}}>
                <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                  onPress = {()=>this.setState({visible:false})}>Not now</Text>
                <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                  onPress = {()=>this.kickOut()}>Exit</Text>
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
    width:'100%',
    height:'100%',
    backgroundColor:'#eee'
  },
  scrollContainer:{
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    marginBottom:10
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
