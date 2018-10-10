import React,{Component} from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    AsyncStorage,
    StatusBar,
    TouchableHighlight,
    Image,
    BackHandler
} from 'react-native'
import { CheckBox } from 'react-native-elements'
import config from '../API/config';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import AnimatedHideView from 'react-native-animated-hide-view'
import Spinner from 'react-native-loading-spinner-overlay'
import GridView from 'react-native-super-grid'
import Toast from 'react-native-simple-toast'

let item = [];
export default class ViewAddress extends Component<{}>{
    constructor(props){
        super(props);
        this.state = {
            access_token : '',
            addressArray : [],
            show : false,
            removeScreen : false,
            address_id:''
        }
    }
    async _getAccessToken(){
        try {
            const value = await AsyncStorage.getItem('token');
            if (value !== null) {
                this.setState({
                    access_token : value
                });
                this.getUserAddress();
            }
        } catch (error) {
            console.warn('error',error.message);
        }
    }
    getUserAddress(){
        var url = config.API_URL+'userAddresses';
        fetch(url, {
            headers: new Headers({
                'Content-Type' : 'application/json',
                'Accept' : 'application/json',
                'Authorization' : this.state.access_token
            })
        })
            .then((response)=>response.json())
            .catch((error)=>console.warn('error',error))
            .then((response)=>{
                console.log('user address',response);
                if (response){
                    if (response.code == '200') {
                        this.setState({
                            show : false
                        });
                        if (response.data){
                            this.state.addressArray.length = 0;
                            item.length = 0;
                            for (data of response.data){
                                item.push({
                                    address_id : data.user_address_id,
                                    name : data.name,
                                    street : data.street_address,
                                    city : data.city,
                                    district : data.district,
                                    postcode : data.postcode,
                                    state : data.state,
                                    country : data.country,
                                    landmark : data.landmark,
                                    area : data.area,
                                    building : data.building,
                                    phone_no : data.phone_no,
                                    type : data.type,
                                    dflt : data.default
                                })
                            }
                            this.setState({
                                addressArray : item
                            });
                        }
                    }
                }
            })
    }
    deleteAddress(id){
        this.setState({
            show : true,
            removeScreen : false
        })
        var url = config.API_URL+'deleteAddress/'+id;
        fetch(url, {
            method:'DELETE',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization' : this.state.access_token
            })
        })
            .then((response)=>response.json())
            .catch((error)=>console.warn(error))
            .then((response)=>{
                if (response){
                    if (response.code == '200'){
                        this.setState({
                            show : false
                        });
                        Toast.show('Address Deleted', Toast.LONG);
                        this.getUserAddress();
                    }
                }
            })
    }
    componentWillMount(){
        this.setState({
            show : true
        });
        this._getAccessToken().done();
    }
    render(){
        const {goBack} = this.props.navigation;
        return(
            <View style={styles.container}>
                <View style={styles.toolbar}>
                    <View style={styles.menuView}>
                        <TouchableHighlight underlayColor='transparent'
                            onPress = {()=>goBack()}>
                            <MaterialIcons
                                name='arrow-back'
                                size={22}
                                style = {{color:'#fff'}}>
                            </MaterialIcons>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.textView}>
                        <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>View Address</Text>
                    </View>
                    <View style={styles.iconView}>

                    </View>
                </View>
                <View style={styles.baseContainer}>
                    <ScrollView
                        showsVerticalScrollIndicator = {false}>
                        <View style={{alignItems:'center',justifyContent:'center'}}>
                            <GridView
                                itemDimension={360}
                                items={this.state.addressArray}
                                renderItem={item => (
                                    <View style={{width:'100%',padding:10,backgroundColor:'#fff',elevation:1}}>
                                        <View style={{width:'100%',flexDirection:'row'}}>
                                            <Text style={{color:'#000',fontSize:16,fontWeight:'bold'}}>{item.name}</Text>
                                            <View style={{backgroundColor:'#eee',padding:3,marginLeft:10}}>
                                                <Text style={{fontSize:12}}>
                                                    {item.type}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{width:'100%',padding:10}}>
                                            <Text style={{color:'#000',fontWeight:'bold',fontSize:16}}>
                                                Postcode : {item.postcode}
                                            </Text>
                                            <Text style={{fontSize:12}}>
                                                {item.area+','+item.building}
                                            </Text>
                                            <Text style={{fontSize:12}}>
                                                {item.street+','+item.city+','+item.district+','+item.state+','+item.country}
                                            </Text>
                                            <Text style={{fontSize:12,fontWeight:'bold',color:'#369'}}>
                                                Mobile Number : {item.phone_no}
                                            </Text>
                                        </View>
                                        <View style={{width:'100%',alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                                            <View style={{width:'70%'}}>

                                            </View>
                                            <View style={{width:'30%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',
                                                padding:10}}>
                                                <TouchableHighlight underlayColor='transparent'
                                                    onPress = {()=>this.props.navigation.navigate('edit_address',
                                                        {
                                                            id:item.address_id,
                                                            name : item.name,
                                                            street : item.street,
                                                            city : item.city,
                                                            district : item.district,
                                                            postcode : item.postcode,
                                                            state : item.state,
                                                            country : item.country,
                                                            landmark : item.landmark,
                                                            area : item.area,
                                                            building : item.building,
                                                            phone_no : item.phone_no,
                                                            type : item.type,
                                                            dflt : item.dflt
                                                        }
                                                        )}>
                                                    <MaterialIcons
                                                        name='edit'
                                                        size={22}
                                                        style = {{color:'#369'}}>
                                                    </MaterialIcons>
                                                </TouchableHighlight>
                                                <TouchableHighlight underlayColor='transparent'
                                                    onPress = {()=>this.setState({removeScreen:true,address_id:item.address_id})}>
                                                    <MaterialIcons
                                                        name='delete'
                                                        size={22}
                                                        style = {{color:'#369'}}>
                                                    </MaterialIcons>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                    </View>
                                )}
                            />
                        </View>
                    </ScrollView>
                </View>
                <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
                  visible = {this.state.removeScreen}>
                  <View style = {{backgroundColor:'#282a2d',width:'95%',alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{fontSize:18,fontWeight:'bold',color:'#fff',marginTop:30}}>Do u really wants remove the address ?</Text>
                    <View style = {{width:'100%',marginTop:20,marginBottom:10,flexDirection:'row'}}>
                      <View style = {{width:'60%'}}></View>
                      <View style = {{width:'40%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20}}>
                        <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                          onPress = {()=>this.setState({removeScreen:false})}>No</Text>
                        <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                          onPress = {()=>this.deleteAddress(this.state.address_id)}>Yes</Text>
                      </View>
                    </View>
                  </View>
                </AnimatedHideView>
                <View style = {{width:'100%',height:'100%',position:'absolute', alignItems:'center',justifyContent:'center'}}>
                    <Spinner color = {'#369'} visible={this.state.show} textContent={"Loading..."} textStyle={{color: '#369'}}
                             overlayColor = {'#fff'}/>
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
