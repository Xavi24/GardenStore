import React,{Component} from 'react'
import {View,
        Image,
        Text,
        StyleSheet,
        TouchableHighlight,
        ScrollView
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
    }
  }
  multiSliderValuesChange = (values) => {
    this.setState({
      min : values[0],
      max : values[1]
    })
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    this.getFilterData(params)
  }
  postFilterData(){
    let cat_name = []
    let brand_name = []
    let spec_name = []
    let price = '';
    price = '['+'min='+this.state.min+','+'max='+this.state.max+']'
    var url = this.state.url+'&'+'&'+'brand='+this.state.selected_brand+'&'+'specs='+this.state.arr+'&'+'&'+'price[min]='+'&'+
      this.state.Min+'&'+'price[max]'+this.state.max
    console.log('url',url);
    fetch(url)
     .then((response)=>response.json())
     .catch((error)=>console.warn(error))
     .then((response)=>{
       if (response.data.length!=0) {
         this.props.navigation.navigate('filter_page',{data:response,url:this.state.url});
       }
     })
  }
  updateSpceValue(){
    this.setState({
      customselected:this.state.sel_spec_data
    })
    if (filterdata.length != 0) {
      let flag = 0
      objIndex = filterdata.findIndex((obj => obj.name == this.state.specdata));
      if(objIndex>=0)
      {
          filterdata[objIndex].value = this.state.sel_spec_data;
           flag=1;
      }
      if(!flag) {
        filterdata.push({
          name : this.state.specdata,
          value : this.state.sel_spec_data
        })
      }
    } else {
      filterdata.push({
        name : this.state.specdata,
        value : this.state.sel_spec_data
      })
    }
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
      data += key.name + '[' + key.value + ']' + ','
      arr.push(data)
    }
    this.setState({
      arr : arr
    })
  }
  callfn(name,spc){
    this.setState({
      specdata : name,
      spec_show:true,
      item_value_data:spc
    })
  }
  getFilterData(params){
    console.warn('params',params.spec_data);
    this.setState({
      cat_data:params.cat_data,
      min:params.min,
      max:params.max,
      brand_data:params.brand_data,
      spec_data:params.spec_data,
      url : params.url
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
            <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Filter</Text>
           </View>
          <View style = {styles.iconView}></View>
        </View>
        <View style = {styles.baseContainer}>
          <ScrollView style = {{width:'100%'}}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style = {{width:'98%',height:100,alignItems:'center',justifyContent:'center',backgroundColor:'#fff',elevation:2,marginTop:5}}>
                <View style = {{width:'94%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:5}}>
                  <View>
                    <Text style = {{color:'#282a2d',fontSize:16}}>Min</Text>
                    <Text style = {{color:'#369',fontSize:14,marginTop:5}}>{this.state.min}</Text>
                  </View>
                  <View>
                  <Text style = {{color:'#282a2d',fontSize:16}}>Max</Text>
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
              <TouchableHighlight style = {{width:'98%',alignItems:'center',justifyContent:'center'}}
                underlayColor = 'transparent'
                onPress = {()=>this.setState({grid_data:this.state.cat_data})}>
                <View style = {{width:'100%',height:50,backgroundColor:'#fff',elevation:1,marginTop:20,flexDirection:'row',alignItems:'center'}}>
                  <Text style = {{color:'#369',fontSize:16,marginLeft:10}}>Category</Text>
                  <View style = {{marginTop:5,marginLeft:10}}>
                    <MaterialIcons
                      name='keyboard-arrow-down'
                      size={26}
                      style = {{color:'#360'}}>
                    </MaterialIcons>
                  </View>
                  <Text style = {{color:this.state.selected_item_color,fontSize:16,marginLeft:5}}>{this.state.selected_cat}</Text>
                </View>
              </TouchableHighlight>
              <View style = {{width:'98%'}}>
                <GridView style = {{backgroundColor:'#fff'}}
                  itemDimension={360}
                  items={this.state.grid_data}
                  renderItem={item => (
                    <View style = {{width:'100%',flexDirection:'row',borderTopColor:'#eee',borderTopWidth:1}}>
                      <Text style = {{color:this.state.grid_item_color,fontSize:16,marginTop:5}}
                        onPress = {()=>this.setState({selected_cat:item.name,grid_data:this.state.empty})}>{item.name}</Text>
                    </View>
                  )}
                />
              </View>
              <TouchableHighlight style = {{width:'98%',alignItems:'center',justifyContent:'center'}}
                underlayColor = 'transparent'
                onPress = {()=>this.setState({grid_brands:this.state.brand_data})}>
                <View style = {{width:'100%',height:50,backgroundColor:'#fff',elevation:1,marginTop:5,alignItems:'center',flexDirection:'row'}}>
                  <Text style = {{color:'#369',fontSize:16,marginLeft:10}}>Brands</Text>
                  <View style = {{marginTop:5,marginLeft:10}}>
                    <MaterialIcons
                      name='keyboard-arrow-down'
                      size={26}
                      style = {{color:'#360'}}>
                    </MaterialIcons>
                  </View>
                  <Text style = {{color:this.state.selected_brand_color,fontSize:16,marginLeft:5}}>{this.state.selected_brand}</Text>
                </View>
              </TouchableHighlight>
              <View style = {{width:'98%'}}>
                <GridView style = {{backgroundColor:'#fff'}}
                  itemDimension={360}
                  items={this.state.grid_brands}
                  renderItem={item => (
                    <View style = {{width:'100%',flexDirection:'row',borderTopColor:'#eee',borderTopWidth:1}}>
                      <Text style = {{color:this.state.grid_brands_color,fontSize:16,marginTop:5}}
                      onPress = {()=>this.setState({selected_brand:item.name,grid_brands:this.state.empty
                      })}>{item.name}</Text>
                    </View>
                  )}
                />
              </View>
              <View style = {{width:'98%',marginTop:5}}>
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
              itemDimension={360}
              items={this.state.item_value_data}
              renderItem={item => (
                <View style = {{width:'100%',padding:10}}>
                  <Text style = {{fontSize:16,color:'#369'}}
                    onPress = {()=>this.setState({sel_spec_data : item.value,customSelect : 'Your Choice Is : '})}>{item.value}</Text>
                </View>
              )}
            />
            <View style = {{width:'95%',flexDirection:'row',marginTop:30,marginBottom:10}}>
              <View style = {{width:'50%'}}></View>
              <View style = {{width:'50%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                <Text style = {{fontSize:16,color:'#360',fontWeight:'bold'}}
                  onPress = {()=>this.updateSpceValue()}>Confirm</Text>
                <Text style = {{fontSize:16,color:'#800000',fontWeight:'bold'}}
                  onPress = {()=>this.setState({spec_show:false})}>Close</Text>
              </View>
            </View>
          </View>
        </AnimatedHideView>
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
    backgroundColor:'#eee'
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
})
