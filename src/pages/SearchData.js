import React,{Component} from 'react'
import {View,Text} from 'react-native'

export default class SearchData extends Component<{}>{
  constructor(props){
    super(props);
    this.state = {

    }
  }
  render(){
    componentWillMount(){
      const {params} = this.props.navigation.state;
      console.warn('params',params);
    }
    return(
      <View></View>
    );
  }
}
