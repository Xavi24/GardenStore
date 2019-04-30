import React,{Component} from 'react'
import {View,
        Text,
        Image
  } from 'react-native'

export default class Reload extends Component<{}>{
  constructor(props){
    super();
  }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    console.warn('.......>>>>>><<<<',params);
    this.props.navigation.navigate('filter');
  }
  render(){
    return(
        <View></View>
    );
  }
}