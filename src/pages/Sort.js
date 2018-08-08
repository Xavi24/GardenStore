import React,{Component} from 'react'
import {View,
        Text,
        TouchableHighlight,
        Image,
        ScrollView,
        StyleSheet
  } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import GridView from 'react-native-super-grid'
import Ionicons from 'react-native-vector-icons/Ionicons'
import config from '../API/config'
import Spinner from 'react-native-loading-spinner-overlay'
import AnimatedHideView from 'react-native-animated-hide-view'

export default class Sort extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {
      popularityColor : '#7a7979',
      relevenceColor : '#7a7979',
      phtlcolor : '#7a7979',
      arrivalscolor : '#7a7979',
      sortdata : '',
      plthcolor : '#7a7979',
      sortinput : '',
      url : '',
      name : ''
    }
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    console.warn('params',params);
    this.setState({
      url : params.url,
      name : this.state.name
    })
  }
  getsortData(){
    console.warn('input',this.state.sortinput);
    if (this.state.sortinput!='') {
      var url = this.state.url+'&'+'sort='+this.state.sortinput
      console.log('url',url);
      fetch(url)
       .then((response)=>response.json())
       .catch((error)=>console.warn(error))
       .then((response)=>{
         console.warn('response',response);
         if (response.data.length!=0) {
           this.props.navigation.navigate('filter_page',{data:response,url:this.state.url})
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
      return(
        <View style = {styles.container}>
          <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
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
          </View>
        </View>
      );
    }
 }
 const styles = StyleSheet.create({
   container : {
     height:'100%',
     width:'100%',
     alignItems:'center',
     justifyContent:'center'
   }
 })
