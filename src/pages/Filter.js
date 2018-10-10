import React,{Component} from 'react'
import {View,
  Image,
  Text,
  StyleSheet,
  TouchableHighlight,
  ScrollView,
  BackHandler
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MultiSlider from '@ptomasroos/react-native-multi-slider'
import config from '../API/config'
import GridView from 'react-native-super-grid'
import AnimatedHideView from 'react-native-animated-hide-view'

let filterdata = [];
let product_data = [];
let arr = [];
export default class Filter extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      multiSliderValue : [0, 5000],
      cat_height : 0,
      cat_data : [],
      grid_data : [],
      grid_item_color : '#369',
      grid_brands : [],
      grid_brands_color : '#369',
      selected_cat : '',
      selected_item_color : '#360',
      brand_data : [],
      selected_brand_color : '#360',
      selected_brand : '',
      empty : [],
      grid_spec : [],
      spec_data : [],
      selected_spec_color : '#360',
      selected_spec : '',
      spec_show : false,
      item_value_data : [],
      customSelect : 'Select Your Choice',
      customselected : '',
      min : 0,
      max : 500,
      specdata : '',
      filterdata : [],
      sel_spec_data : '',
      url : '',
      arr : [],
      product_data : [],
      emptyScreen : false,
      pass_name : '',
      sel_data : [],
      height:45,
      animHeight:50,
      cat_screen : false,
      cat_grid_color : '#eee',
      brand_screen : false,
      brand_grid_color:'#eee'
    }
  }
  selFn(value){
    this.setState({
      sel_spec_data : value,
      customSelect : 'Your Choice Is : '
    });
  }
  multiSliderValuesChange = (values) => {
    this.setState({
      min : values[0],
      max : values[1]
    })
  };
  componentWillMount(){
    const {params} = this.props.navigation.state;
    this.getFilterData(params)
  }
  postFilterData(){
    console.warn('url//test',this.state.url);
    console.warn('url//name',this.state.pass_name);
    let cat_name = [];
    let brand_name = [];
    let spec_name = [];
    let price = '';
    price = '['+'min='+this.state.min+','+'max='+this.state.max+']';
    var url = this.state.url+'&'+'category='+this.state.selected_cat+'&'+'brand='+this.state.selected_brand+'&'+this.state.arr+'price[min]='+this.state.min+'&'+'price[max]='+this.state.max;
    console.log('url???????????',url);
    console.log('firstFilterurl??????',this.state.url);
    fetch(url)
        .then((response)=>response.json())
        .catch((error)=>console.warn(error))
        .then((response)=>{
          console.warn('response',response);
          if (response.data) {
            filterdata.length = 0;
            if (response.data.length!=0) {
              if (response.data.data.length == 0) {
                this.setState({
                  emptyScreen : true
                })
              } else {
                this.props.navigation.navigate('filter_page',{data:response,url:this.state.url});
              }
            }
          }
        })
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
    // if (filterdata.length != 0) {
    //   let flag = 0;
    //   let objIndex = filterdata.findIndex((obj => obj.name == this.state.specdata));
    //   if(objIndex>=0)
    //   {
    //     filterdata[objIndex].value = this.state.sel_spec_data;
    //     flag=1;
    //   }
    //   if(!flag) {
    //     filterdata.push({
    //       name : this.state.specdata,
    //       value : this.state.sel_spec_data
    //     })
    //   }
    // } else {
    //   filterdata.push({
    //     name : this.state.specdata,
    //     value : this.state.sel_spec_data
    //   })
    // }
    this.setState({
      filterdata : filterdata,
      spec_show : false
    })
    setTimeout(()=>{
      this.setState({
        customSelect : 'Select Your Choice',
        sel_spec_data : ''
      })
    }, 500)
    console.warn('filterdata',this.state.filterdata);
    let data = '';
    for(let key of this.state.filterdata){
      arr.length = 0;
      // data[key.name] = [key.value]
      // console.warn('name',key.name);
      // console.warn('value',key.value);
      data += 'specs'+'['+key.name +']'+ '=' + key.value + '&';
      arr.push(data)
    }
    this.setState({
      arr : arr
    });
    console.warn('arr',this.state.arr);
  }
  callfn(name,spc){
    this.setState({
      specdata : name,
      spec_show:true,
      item_value_data:spc
    })
  }
  getFilterData(params){
    console.log('paramsss////filter???',params);
    this.setState({
      cat_data:params.cat_data,
      min:params.min,
      max:params.max,
      brand_data:params.brand_data,
      spec_data:params.spec_data,
      url : params.url,
      pass_name : params.name
    });
  }
  render() {
    const {goBack} = this.props.navigation;
    return (
        <View style={styles.container}>
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
          <View style={styles.baseContainer}>
            <ScrollView style = {{width:'100%'}}
              showsVerticalScrollIndicator={false}>
              <View style={{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
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
                  <View style={{width:'98%',backgroundColor:'#fff',marginTop:5,elevation:2,height:this.state.height}}>
                    <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                        underlayColor='transparent'
                                        onPress = {()=>this.setState({cat_screen:true,grid_data:this.state.cat_data,cat_grid_color:'#fff'})}>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{color:'#595656',fontSize:14}}>Category</Text>
                        <MaterialIcons
                            style = {{marginLeft:10}}
                            name='keyboard-arrow-up'
                            size={24}
                            style = {{color:'#595656'}}>
                        </MaterialIcons>
                        <Text style = {{color:this.state.selected_item_color,fontSize:14,marginLeft:10}}>{this.state.selected_cat}</Text>
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
                            name='keyboard-arrow-down'
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
                  <View style={{width:'98%',backgroundColor:'#fff',marginTop:5,elevation:2,height:this.state.height}}>
                    <TouchableHighlight style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                        underlayColor='transparent'
                                        onPress = {()=>this.setState({brand_screen:true,grid_brands:this.state.brand_data,cat_grid_color:'#fff'})}>
                      <View style={{flexDirection:'row'}}>
                        <Text style={{color:'#595656',fontSize:14}}>Brands</Text>
                        <MaterialIcons
                            style = {{marginLeft:10}}
                            name='keyboard-arrow-up'
                            size={24}
                            style = {{color:'#595656'}}>
                        </MaterialIcons>
                        <Text style = {{color:this.state.selected_brand_color,fontSize:14,marginLeft:5}}>{this.state.selected_brand}</Text>
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
                            name='keyboard-arrow-down'
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
            <View style = {{width:'100%',height:55,alignItems:'center',justifyContent:'center',flexDirection:'row',backgroundColor:'#fff'}}>
              <View style = {{width:'50%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Text style = {{fontSize:14,color:'#363a42',fontWeight:'bold'}}
                      onPress = {()=>goBack()}>CANCEL</Text>
              </View>
              <View style = {{width:'48%',height:'70%',alignItems:'center',justifyContent:'center',
                backgroundColor:'#48c7f0',borderTopLeftRadius:6,borderTopRightRadius:6,borderBottomLeftRadius:6,borderBottomRightRadius:6}}>
                <TouchableHighlight style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                                    underlayColor = 'transparent'
                                    onPress = {()=>this.postFilterData()}>
                  <Text style = {{fontSize:14,color:'#fff'}}>FILTER</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
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
            <View style = {styles.baseContainer}>
              <View style = {{width:'95%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                <Image style = {{width:40,height:40,alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                       source = {require('../img/rotate.png')}>

                </Image>
                <Text>No product to show</Text>
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
  container :{
    width:'100%',
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#eee'
  },
  toolbar:{
    height:'8%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#282a2d',
    flexDirection:'row'
  },
  baseContainer:{
    height:'92%',
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
    alignItems:'center',
    justifyContent:'center'
  }
});