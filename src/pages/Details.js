import React,{Component} from 'react'
import {View,
  Text,
  Image,
  TouchableHighlight,
  StatusBar,
  ScrollView,
  StyleSheet,
  ListView,
  TextInput,
  AsyncStorage,
  BackHandler,
  FlatList
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import config from '../API/config'
import GridView from 'react-native-super-grid'
import Spinner from 'react-native-loading-spinner-overlay'
import AnimatedHideView from 'react-native-animated-hide-view'
import ImageSlider from 'react-native-image-slider'
import Stars from 'react-native-stars-rating'
import StarRating from 'react-native-star-rating'
import Toast from 'react-native-simple-toast'

let count = 1;
let p_specs_container = [];
let p_spec_variation_container = [];
let measures = [];
let var_spec_data = [];
let slug_check_array = [];
let localCartData = [];
let temp_slg_array = [];
let id = 0;
export default class Details extends Component<{}>{
  static navigationOptions = {
    header : null
  };
  constructor(props){
    super(props);
    this.state = {
      access_token : '',
      slug : '',
      header_image : '',
      is_in_cart : '',
      is_in_wishlist : '',
      has_bought : false,
      prize : '',
      product_note : '',
      brand : '',
      product_rating : '',
      product_name : '',
      slider_Images: [],
      show_fav : true,
      show_cart : true,
      product_id : '',
      vendor_id : '',
      product_details : '',
      ratingView : false,
      review : '',
      myrating : 1,
      starCount : 0,
      startShowCount : 0,
      feedback: 'Poor',
      customButton : false,
      spec : [],
      spec_variation : [],
      product_meassurment_id : '',
      name : '',
      description : '',
      video : '',
      measurementData : [],
      show : false,
      custom_nav_data : [],
      login_cnfrm_screen : false,
      rating_Success : true,
      out_of_stock_screen : false,
      out_of_stock_screen_temp : false,
      customising_screen : false,
      Data : [],
      measurements : [],
      cart_text : 'Add To Cart',
      discount : '',
      sale_price : '',
      p_color : '#369',
      d_color : '#360',
      emptyScreen : false,
      show_rate : false,
      rate_view_width:'25%',
      rate_icon_size:22,
      rate_text_size :12,
      slug_check_Data : [],
      cardViewBorder : '#a09f9f',
      cardBorder : 1,
      des_screen : false,
      slug_array : [],
      color:'#595656',
      border : 1,
      local_cart_check : [],
      api : '',
      color_check_screen : true,
      color_size_screen : false,
      selected_size : '',
      selected_size_value : '',
      selected_size_array : [],
      sec_selected_array : [],
      backgroundColor : '#eee',
      contentArray : [],
      out_of_stock_count : 0,
      foo_color : '#2fdab8',
      foo_text : 'Buy Now',
      availability_text : 'Product Available'
    }
  }
  addMyrating(rating){
    count = rating;
    this.fetchRating()
  }
  fetchRating(){
    if (count == '1') {
      this.setState({
        feedback : 'Poor'
      })
    } else if (count == '2') {
      this.setState({
        feedback : 'Good'
      })
    } else if (count == '3') {
      this.setState({
        feedback : 'Very Good'
      })
    } else if (count == '4') {
      this.setState({
        feedback : 'Awsome'
      })
    } else if (count == '5') {
      this.setState({
        feedback : 'Excellent'
      })
    }
  }
  addReview(){
    let Data = {};
    Data.value = count;
    Data.title = this.state.feedback;
    Data.review = this.state.review;
    Data.variation_id = this.state.product_id;
    var url = config.API_URL+'product/addReview';
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(Data),
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
        .then((response)=>response.json())
        .catch((error)=>console.warn(error))
        .then((response)=>{
          this.setState({
            ratingView : false
          })
        })
  }
  ViewReview(){
    var url = config.API_URL+'product/my-review/'+this.state.product_id;
    fetch(url, {
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
        .then((response)=>response.json())
        .catch((error)=>console.warn(error))
        .then((response)=>{
          if (response.code!=null) {


          }
        })
  }
  updateValue(text,field){
    if (field == 'comment') {
      this.setState({
        review : text
      })
    }
  }

  async _getAccessToken(){
    try {
      const value = await AsyncStorage.getItem('token');
      console.warn('value',value);
      if (value !== null) {
        this.setState({
          access_token : value
        });
        this.getDetails();
      } else {
        this.getDetails();
      }
    } catch (error) {
      console.warn('error',error.message);
    }
  }
  getAddressDetails(){
    // console.warn('getAddressDetails product_id',this.state.product_id);
    // console.warn('getAddressDetails vendor_id',this.state.vendor_id);
    var url = config.API_URL+'userAddresses';
    fetch(url, {
      headers : new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
        .then((response)=>response.json())
        .catch((error)=>console.warn(error))
        .then((response)=>{
          console.log('GetAddressResponse',response);
          if (response.data!= '') {
            this.props.navigation.navigate('buy_now',{
              product_name:this.state.product_name,
              prize:this.state.prize,
              img:this.state.header_image,
              product:this.state.product_id,
              vendor:this.state.vendor_id,
              measurements : this.state.measurements,
              slug : this.state.slug,
              spec : this.state.spec
            })
          }
          else {
            this.props.navigation.navigate('add_address',{
              product_name:this.state.product_name,
              prize:this.state.prize,
              img:this.state.header_image,
              product:this.state.product_id,
              vendor:this.state.vendor_id,
              measurements : this.state.measurements
            })
          }
        })
  }
  updateValue1(text,field,name,index){
    console.warn('text',text);
    console.warn('field',field);
    console.warn('index',index);
    console.warn('name',name);
    measures[index] = {
      product_measurement_id : field,
      value : text,
      name : name
    };
    this.setState({
      measurements : measures
    });
    console.warn('measures////',this.state.measurements);
  }
  customNavigation(){
    this.state.custom_nav_data.push({
      product_name:this.state.product_name,
      prize:this.state.prize,
      img:this.state.header_image,
      product:this.state.product_id,
      vendor:this.state.vendor_id,
      slug : this.state.slug,
      spec : this.state.spec
    });
    this.setState({
      customising_screen : true,
      Data : this.state.measurementData
    });
    // this.props.navigation.navigate('customization',{data:this.state.measurementData,p_data:this.state.custom_nav_data})
    // console.warn('custom_nav_data',this.state.custom_nav_data);
    console.warn('measurementData........',this.state.Data);
  }
  getDetails(){
    let item;
    let v_item = [];
    this.setState({
      show : true
    });
    console.log('slug//details :',this.state.slug);
    let spec_datas = [];
    let spec_variation_datas = [];
    var url = config.API_URL+'productDetail/'+this.state.slug;
    fetch(url, {
      headers: new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
        .then((response)=>response.json())
        .catch((error)=>console.log(error))
        .then((response)=>{
          if (response.code){
            if (response.code == 200){
              if (response.data) {
                id = response.data.product_variation_id
                console.warn('id.......?????',id);
                this.state.slider_Images.length = 0;
                console.log('productDetailresponse',response);

                this.setState({
                  is_in_cart : response.data.is_in_cart,
                  is_in_wishlist : response.data.is_in_wishlist,
                  product_name : response.data.product_name,
                  product_note : response.data.product_notes,
                  brand : response.data.brand,
                  product_id : response.data.product_variation_id,
                  product_details : response.data.product_details.product_description,
                  starCount : response.data.product_rating,
                  sale_price : response.data.product_mrp
                });
                for(let product_images of response.data.product_images){
                  this.state.slider_Images.push(product_images.img)
                }
                for(let product_vendors of response.data.product_vendors){
                  this.setState({
                    vendor_id : product_vendors.vendor_id,
                    prize : product_vendors.product_price,
                    discount : product_vendors.discount
                  });
                  if (this.state.discount == 0) {
                    this.setState({
                      d_color : '#fff',
                      p_color : '#fff'
                    })
                  }
                  this.setState({
                    out_of_stock_count : product_vendors.quantity
                  });
                  if (product_vendors.quantity < 1) {
                    this.setState({
                      out_of_stock_screen_temp : true,
                      foo_text : 'Out of Stock',
                      foo_color : '#800000',
                      availability_text : ''
                    })
                  }
                  console.warn('out_of_stock_screen_temp',this.state.out_of_stock_screen_temp);
                }
                p_specs_container.length = 0;
                for (let product_specs of response.data.product_details.product_specs){
                  let product_specs_keys = Object.keys(product_specs);
                  p_specs_container.push({
                    spec_title : product_specs_keys[0],
                    specs : product_specs[product_specs_keys[0]]
                  })
                }
                spec_datas.length = 0;
                for(let spec_data of p_specs_container){
                  console.warn('Previousssssssssssss',spec_data.specs[0].spec_value);
                  this.setState({
                    selected_size : spec_data.specs[0].spec_name,
                    selected_size_value : spec_data.specs[0].spec_value
                  });
                  for(let val of spec_data.specs){
                    console.warn('Vallllllllllllllllllll',val);
                    spec_datas.push({
                      spec_name : val.spec_name,
                      spec_value : val.spec_value
                    })
                  }
                }
                this.setState({
                  spec : spec_datas
                });
                console.log('SSSSSSSSSSSSSSSSSSSS',this.state.spec);
                v_item.length = 0;
                let v_data = [];
                for(let product_spec_variation of response.data.product_variation_items){
                  let product_spec_variation_key = Object.keys(product_spec_variation);
                  p_spec_variation_container.push({
                    spec_title : product_spec_variation_key[0],
                    specs : product_spec_variation[product_spec_variation_key[0]]
                  });
                  let output = [];
                  let flags = [];
                  let Trial = [];
                  let key = Object.keys(product_spec_variation);
                  console.log('key.......',key);
                  let length = product_spec_variation[key].length;
                  console.log('length..........',length);
                  for (var i = 0; i <length; i++) {
                    if (flags[product_spec_variation[key][i].variation_spec_value] >= 0) {
                      output[flags[product_spec_variation[key][i].variation_spec_value]].variation_slug.push(product_spec_variation[key][i].variation_slug);
                      continue;
                    }
                    flags[product_spec_variation[key][i].variation_spec_value] = i;
                    const arr = [];
                    arr.push(product_spec_variation[key][i].variation_slug);
                    output.push({
                      'variation_slug':arr,
                      'variation_spec_value':product_spec_variation[key][i].variation_spec_value,
                      'img':product_spec_variation[key][i].img
                    });
                  }
                  v_data.push({
                    v_category:key,
                    var_data:output
                  });
                  var_spec_data.length = 0;
                  slug_check_array.length = 0;
                  for (let data of v_data) {
                    var_spec_data.push({
                      name : data.v_category[0],
                      value : data.var_data
                    })
                  }
                }
                this.state.selected_size_array.length = 0;
                this.state.selected_size_array.push(var_spec_data[0]);
                console.warn('?????????',var_spec_data);
                console.log('............',this.state.selected_size_array);
                spec_variation_datas.length = 0;
                for(let spec_variation_data of p_spec_variation_container){
                  for(let val of spec_variation_data.specs){
                    spec_variation_datas.push({
                      spec_name : val.variation_spec_value,
                      spec_slug : val.variation_slug,
                      spec_img : val.img
                    })
                  }
                }
                this.getLocalCart();


                this.setState({
                  spec_variation : spec_variation_datas
                });
                console.warn('spec_variation',this.state.spec_variation);
                if (response.data.is_in_cart) {
                  this.setState({
                    show_cart:false,
                    cart_text : 'Go To Cart'
                  })
                } else {
                  this.setState({
                    show_cart:true
                  })
                }
                if (response.data.is_in_wishlist) {
                  this.setState({
                    show_fav:false
                  })
                } else {
                  this.setState({
                    show_fav:true
                  })
                } if (response.data.has_bought){
                  this.setState({
                    rate_view_width:'25%',
                    rate_icon_size:22,
                    rate_text_size :12
                  })
                } else {
                  this.setState({
                    rate_text_size : 0,
                    rate_view_width : '0%',
                    rate_icon_size : 0
                  })
                }
                this.ViewReview();
                if (response.data.measurements!= '') {
                  this.setState({
                    customButton : true
                  })
                }
                for(let customdata of response.data.measurements){
                  console.log('customdata////////\\\\\\\\\\',customdata);
                  this.setState({
                    product_meassurment_id : customdata.product_measurement_id,
                    name : customdata.name,
                    description : customdata.description,
                    video : customdata.video
                  });
                  this.state.measurementData.push({
                    product_measurement_id : this.state.product_meassurment_id,
                    name : this.state.name,
                    description : this.state.description,
                    video : this.state.video,
                    product_id : this.state.product_id,
                    vendor_id : this.state.vendor_id
                  })
                }
                console.warn('measurementData',this.state.measurementData);
              }
            } else {
              this.setState({
                emptyScreen : true
              })
            }
          }
          this.setState({
            show : false
          });
        })
  }
  async localCart(){
    console.warn('entered into the local cart method');
    Toast.show('Product added to cart', Toast.LONG);
    console.warn('stock--------->>>',this.state.out_of_stock_count);
    if (this.state.out_of_stock_count<1){
      Toast.show('Product is out of stock', Toast.LONG);
    } else {
      this.setState({
        show_cart : false
      });
      localCartData.push({
        product_id : this.state.product_id,
        vendor_id : this.state.vendor_id,
        sale_price : this.state.sale_price,
        product_name : this.state.product_name,
        header_image : this.state.header_image,
        slug : this.state.slug
      });
      console.log('localCartData---------->>>>',localCartData);
      try {
        await AsyncStorage.setItem('@MySuperCart:key', JSON.stringify(localCartData));
      } catch (error) {
        // Error saving data
      }
      // try {
      //   const localCartData = await AsyncStorage.getItem('@MySuperCart:key');
      //   if (localCartData !== null) {
      //     this.setState({
      //       local_cart_check : JSON.parse(localCartData)
      //     });
      //     console.log('local_cart_check---------->>>>>>',this.state.local_cart_check);
      //   }
      // } catch (error) {
      //   // Error retrieving data
      // }
    }
  }
  async getLocalCart(){
    try {
      const localCartData = await AsyncStorage.getItem('@MySuperCart:key');
      if (localCartData !== null) {
        this.setState({
          local_cart_check : JSON.parse(localCartData),
          local_cart_view : true
        });
        console.log('local_cart_check---------->>>>>>',this.state.local_cart_check);
        for (let data of this.state.local_cart_check) {
          console.warn('local product_id-------->>', data.product_id);
          console.warn('product_id-------->>', id);
          if (id === data.product_id){
            this.setState({
              show_cart : false
            })
          }
        }
      } else {
        // this.setState({
        //   emptyScreen : true
        // })
      }
    } catch (error) {
      // Error retrieving data
    }
  }
  // async Cus_LocalCart(){
  //   this.setState({
  //     show_cart : false,
  //   });
  //   let cartData = {};
  //   cartData.measurements = JSON.stringify(this.state.measurements);
  //   console.warn('cart,measurements',this.state.measurements);
  //   if (this.state.cart_text == 'Add To Cart'){
  //     this.setState({
  //       show_cart : false,
  //       cart_text : 'Move To Cart'
  //     });
  //     console.warn('you are not logged in');
  //     localCartData.push({
  //       product_id : this.state.product_id,
  //       vendor_id : this.state.vendor_id,
  //       sale_price : this.state.sale_price,
  //       product_name : this.state.product_name,
  //       header_image : this.state.header_image,
  //       slug : this.state.slug,
  //       measurements : cartData.measurements
  //     });
  //     console.warn('localCartData',localCartData);
  //     try {
  //       await AsyncStorage.setItem('@MySuperCart:key', JSON.stringify(localCartData));
  //     } catch (error) {
  //       // Error saving data
  //     }
  //     try {
  //       await AsyncStorage.push('@MySuperCart:key', JSON.stringify(localCartData));
  //     } catch (error) {
  //       // Error saving data
  //     }
  //
  //     try {
  //       const localCartData = await AsyncStorage.getItem('@MySuperCart:key');
  //       if (localCartData !== null) {
  //         this.setState({
  //           local_cart_check : JSON.parse(localCartData)
  //         });
  //         console.warn('local_cart_check',this.state.local_cart_check);
  //       }
  //     } catch (error) {
  //       // Error retrieving data
  //     }
  //   } if (this.state.cart_text == 'Move To Cart') {
  //     this.setState({
  //       customising_screen : false
  //     });
  //     this.props.navigation.navigate('add_to_cart')
  //   }
  // }
  //  async localCart(){
  //   this.setState({
  //     show_cart : false
  //   });
  //     console.warn('you are not logged in');
  //     localCartData.push({
  //       product_id : this.state.product_id,
  //       vendor_id : this.state.vendor_id,
  //       sale_price : this.state.sale_price,
  //       product_name : this.state.product_name,
  //       header_image : this.state.header_image,
  //       slug : this.state.slug
  //     });
  //     console.warn('localCartData',localCartData);
  //       try {
  //         await AsyncStorage.setItem('@MySuperCart:key', JSON.stringify(localCartData));
  //       } catch (error) {
  //         // Error saving data
  //       }
  //       try {
  //         await AsyncStorage.push('@MySuperCart:key', JSON.stringify(localCartData));
  //       } catch (error) {
  //         // Error saving data
  //       }
  //
  //    try {
  //      const localCartData = await AsyncStorage.getItem('@MySuperCart:key');
  //      if (localCartData !== null) {
  //        this.setState({
  //          local_cart_check : JSON.parse(localCartData)
  //        });
  //        console.warn('local_cart_check',this.state.local_cart_check);
  //      }
  //    } catch (error) {
  //      // Error retrieving data
  //    }
  //   }


  SelectedSpec(){
    this.state.contentArray.length = 0;
    temp_slg_array.length = 0;
    let slug_name : '';
    let slug : [];
    temp_slg_array.length = 0;
    console.log('>>>>>>>><<<<<<<',this.state.slug);
    console.log('var_spec_data-------->>', var_spec_data);
    for (let data of var_spec_data){
      let temp_array = [];
      slug_name = data.name;
      console.warn('slug_name..............>>',slug_name);
      for (let slugz of data.value){
        console.log('slugz----->>',slugz);
          if (slugz.variation_slug.includes(this.state.slug)) {
            temp_array.push({
              variation_slug : slugz.variation_slug,
              variation_spec_value : slugz.variation_spec_value,
              img : slugz.img,
              color:'#369'
            })
          } else {
            temp_array.push({
              variation_slug : slugz.variation_slug,
              variation_spec_value : slugz.variation_spec_value,
              img : slugz.img,
              color:'#eee'
            })
          }

      }
      temp_slg_array.push({
        spec : slug_name,
        detail : temp_array
      });
      this.state.contentArray = temp_slg_array;

        console.log('temp_slg_array------>>>',temp_slg_array)
    }
    this.setState({
      color_size_screen : true
    });


      console.log('temp_slg_array----->>', temp_slg_array);
      // console.log('[[[[[[[[[[[[[[[]]]]]]]]]]]]]',temp_slg_array);
  }
  addToWishList(){
    console.warn('enterd into add to wishlist page');
    var url = config.API_URL+'user/wishlistCreate/'+this.state.product_id;
    fetch(url, {
      headers : new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
        .then((response)=>response.json())
        .catch((error)=>console.warn(error))
        .then((response)=>{
          console.warn('response',response);
          if(response.message=='success'){
            this.setState({
              show_fav : false
            })
          }
        })
  }
  speckChoose(slug,index){
    let slug_name : '';
    console.log('////------------>>>>',slug);
    console.log('?????????--------->>>>>',temp_slg_array);
    this.setState({
      slug : slug[0],
      color_size_screen : false
    });
    this._getAccessToken();
    // for (let i=0;i<slug;i++){
    //   for (let data of temp_slg_array){
    //     let temp_array = [];
    //     slug_name = data.name;
    //     for (let slug_check of data.detail){
    //
    //       if (slug_check.variation_slug.includes(slug[i])){
    //         console.warn('true');
    //         temp_array.push({
    //           variation_slug : slug_check.variation_slug,
    //           variation_spec_value : slug_check.variation_spec_value,
    //           img : slug_check.img,
    //           color:'#369'
    //         })
    //       } else {
    //         temp_array.push({
    //           variation_slug : slug_check.variation_slug,
    //           variation_spec_value : slug_check.variation_spec_value,
    //           img : slug_check.img,
    //           color:'#eee'
    //         })
    //       }
    //     }
    //     temp_slg_array.push({
    //       spec : slug_name,
    //       detail : temp_array
    //     });
    //     this.state.contentArray = temp_slg_array;
    //     console.log('/////////////////----->>', this.state.contentArray);
    //
    //   }
    // }
  }
  removeWishList(){
    var url = config.API_URL+'user/wishlistCreate/'+this.state.product_id;
    fetch(url, {
      headers : new Headers({
        'Content-Type' : 'application/json',
        'Accept' : 'application/json',
        'Authorization' : this.state.access_token
      })
    })
        .then((response)=>response.json())
        .catch((error)=>console.warn(error))
        .then((response)=>{
          if (response.code=='200') {
            this.setState({
              show_fav : true
            })
          }
        })
  }
  addToCart(){
    if (this.state.cart_text == 'Add To Cart') {
      let cartData = {};
      cartData.measurements = JSON.stringify(this.state.measurements);
      console.warn('cart,measurements',this.state.measurements);
      this.setState({
        customising_screen : false
      });
      var url = config.API_URL+'product/addToCart/'+this.state.product_id+'/'+this.state.vendor_id;
      fetch(url, {
        method : 'POST',
        body : JSON.stringify(cartData),
        headers : new Headers({
          'Content-Type' : 'application/json',
          'Accept' : 'application/json',
          'Authorization' : this.state.access_token
        })
      })
          .then((response)=>response.json())
          .catch((error)=>console.warn(error))
          .then((response)=>{
            console.warn('response',response);
            if (response.message=='success') {
              Toast.show('Product Added To Cart', Toast.LONG);
              this.getDetails();
              this.setState({
                show_cart : false
              })
            } if (response.code == '409'){
              Toast.show(response.message, Toast.LONG);
            }
          })
    } else if (this.state.cart_text == 'Go To Cart') {
      this.setState({
        customising_screen : false
      });
      this.props.navigation.navigate('add_to_cart')
    }
  }
  // async getlocalCart(){
  //   try {
  //     const value = await AsyncStorage.getItem('@MySuperCart:key');
  //     console.warn('value//',value);
  //     if (value) {
  //       for (let val of value){
  //         console.warn('valllllllllllllllll',val);
  //         if (val.product_id == this.state.product_id){
  //           this.setState({
  //             show_cart : false,
  //             cart_text : 'Move To Cart'
  //           });
  //         }
  //       }
  //     } else {
  //     }
  //   } catch (error) {
  //     console.warn('error',error.message);
  //   }
  // }
  componentWillMount(){
    const {params} = this.props.navigation.state;
    console.warn('params',params);
    this.setState({
      slug : params.slug,
      show : true,
      header_image : params.img
    });
    this._getAccessToken();
  }

  render(){
    const {goBack} = this.props.navigation;
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
            <View style = {styles.titleView}>
              <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Product Details</Text>
            </View>
            <View style = {styles.iconView}></View>
          </View>
          <View style = {styles.baseContainer}>
            <ScrollView showsVerticalScrollIndicator = {false}>
              <View style = {styles.scrollContainer}>
                <View style = {styles.headerImage}>
                  <ImageSlider
                      style = {{height:"100%",width:'100%'}}
                      autoPlayWithInterval={3000}
                      images={this.state.slider_Images}
                      customSlide={({ index, item, style, width }) => (
                          <View key={index} style={[style, styles.customSlide]}>
                            <Image source={{uri:config.IMG_URL+item}} style={styles.customImage} />
                          </View>
                      )}
                      customButtons={(position, move) => (
                          <View style={styles.buttons}>
                            {this.state.slider_Images.map((image, index) => {
                              return (
                                  <TouchableHighlight
                                      key={index}
                                      underlayColor="#ccc"
                                      onPress={() => move(index)}
                                      style={styles.button}>
                                    <View style={position === index && styles.buttonSelected}>
                                    </View>
                                  </TouchableHighlight>
                              );
                            })}
                          </View>
                      )}
                  />
                  <AnimatedHideView visible={this.state.color_check_screen}
                                    style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}>
                    <View style={{height:'85%',width:'100%'}}>
                    </View>
                    <View style={{height:'15%',width:'100%',flexDirection:'row'}}>
                      <View style={{width:'80%'}}>
                      </View>
                      <View style={{width:'20%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                        <View style={{height:40,width:40,alignItems:'center',justifyContent:'center',borderRadius:40/2,backgroundColor:'#fff',
                          elevation:2,borderColor: '#eee',borderWidth:1}}>
                          <TouchableHighlight style={{height:'70%',width:'70%',alignItems:'center',justifyContent:'center'}}
                                              underlayColor='transparent'
                                              onPress = {()=>this.SelectedSpec()}>
                            <Image style = {{width:'80%',height:'80%',alignItems:'center',justifyContent:'center',resizeMode:'stretch'}}
                                   source = {require('../img/rgb.png')}>
                            </Image>
                          </TouchableHighlight>
                        </View>
                      </View>
                    </View>
                  </AnimatedHideView>
                </View>
                <View style = {{width:'98%',padding:10,backgroundColor:'#fff',marginTop:5,elevation:2}}>
                  <Text style = {styles.cover_img}>{this.state.product_name}</Text>
                  <View style = {{width:'100%',alignItems:'center',flexDirection:'row'}}>
                    <Image style = {{width:13,height:13,alignItems:'center',justifyContent:'center',resizeMode:'stretch',marginTop:4}}
                           source = {require('../img/curr.png')}>
                    </Image>
                    <Text style = {{color:'#595656',fontSize:14,marginLeft:4}}>{this.state.prize}</Text>
                    <Text style = {{color:this.state.p_color,fontSize:12,marginLeft:10,textDecorationLine:'line-through'}}>{this.state.sale_price}</Text>
                    <Text style = {{color:this.state.d_color,fontSize:12,marginLeft:10}}>{this.state.discount}% off</Text>
                  </View>
                  <View>
                    <Text style={{fontSize:12,color:'#360',fontWeight:'bold',marginTop:6}}>{this.state.availability_text}</Text>
                  </View>
                  <View style = {{width:'100%',flexDirection:'row',padding:5}}>
                    <View style = {{width:'50%',borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,
                      borderTopRightRadius:6,padding:5}}>
                      <StarRating
                          disabled={true}
                          maxStars={5}
                          rating={this.state.starCount}
                          starSize={25}
                          fullStarColor={'#D4AF37'}
                          emptyStarColor={'#D4AF37'}
                      />
                    </View>
                    <View style = {{width:'50%'}}></View>
                    <AnimatedHideView style = {{position:'absolute',width:'100%',height:30,
                      alignItems:'center',justifyContent:'center',marginTop:10}}
                                      visible = {this.state.customButton}>
                      <View style = {{width:'100%',alignItems:'center',
                        justifyContent:'space-between',flexDirection:'row'}}>
                        <View></View>
                        <TouchableHighlight style = {{width:100,alignItems:'center',justifyContent:'center'}}
                                            underlayColor = 'transparent'
                                            onPress = {()=>this.customNavigation()}>
                          <View style = {{width:'100%',height:40,backgroundColor:'#48c7f0',alignItems:'center',justifyContent:'center'}}>
                            <Text style = {{color:'#fff'}}>Customise</Text>
                          </View>
                        </TouchableHighlight>
                      </View>
                    </AnimatedHideView>
                  </View>
                </View>
                <View style = {{width:'98%',backgroundColor:'#fff',elevation:2,flexDirection:'row',alignItems:'center',height:60,
                  justifyContent:'space-between',padding:10,borderTopColor:'#eee',borderTopWidth:1}}>
                  <View style = {{width:this.state.rate_view_width,height:'100%',borderRightWidth:1,borderRightColor:'#eee'}}>
                    <TouchableHighlight underlayColor = 'transparent'
                                        style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}
                                        onPress = {()=>{
                                          if (this.state.access_token!='') {
                                            this.setState({ratingView:true})
                                          } else {
                                            this.setState({
                                              login_cnfrm_screen : true
                                            })
                                          }
                                        }}>
                      <View style = {{flexDirection:'row'}}>
                        <MaterialIcons
                            name='star-border'
                            size={this.state.rate_icon_size}
                            style = {{color:'#605e5e'}}>
                        </MaterialIcons>
                        <Text style = {{marginLeft:3,color:'#605e5e',marginTop:3,fontSize:this.state.rate_text_size}}>Rate us</Text>
                      </View>
                    </TouchableHighlight>

                  </View>
                  <View style = {{width:'25%',height:'100%',borderRightWidth:1,borderRightColor:'#eee',alignItems:'center',justifyContent:'center'}}>
                    <View style = {{flexDirection:'row'}}>
                      <View>
                        <TouchableHighlight
                            underlayColor = 'transparent'
                            onPress = {()=>this.removeWishList()}>
                          <MaterialIcons
                              name='favorite'
                              size={22}
                              style = {{color:'#e50000'}}>
                          </MaterialIcons>
                        </TouchableHighlight>
                        <AnimatedHideView
                            visible = {this.state.show_fav}
                            style = {{position:'absolute'}}>
                          <TouchableHighlight
                              underlayColor = 'transparent'
                              onPress = {()=>{
                                if (this.state.access_token!='') {
                                  this.addToWishList()
                                } else {
                                  this.setState({
                                    login_cnfrm_screen:true
                                  })
                                }
                              }}>
                            <MaterialIcons
                                name='favorite'
                                size={22}
                                style = {{color:'#605e5e'}}>
                            </MaterialIcons>
                          </TouchableHighlight>
                        </AnimatedHideView>
                      </View>
                      <Text style = {{marginLeft:5,color:'#605e5e',marginTop:3,fontSize:12}}>Wishlist</Text>
                    </View>
                  </View>
                  <View style = {{width:'25%',height:'100%',borderRightWidth:1,borderRightColor:'#eee'}}>
                    <TouchableHighlight underlayColor = 'transparent'
                                        style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                      <View style = {{flexDirection:'row'}}>
                        <MaterialIcons
                            name='share'
                            size={22}
                            style = {{color:'#605e5e'}}>
                        </MaterialIcons>
                        <Text style = {{marginLeft:5,color:'#605e5e',marginTop:3,fontSize:12}}>Share</Text>
                      </View>
                    </TouchableHighlight>
                  </View>

                  <View style = {{width:'25%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                    <View style = {{flexDirection:'row'}}>
                      <View>
                        <TouchableHighlight underlayColor = 'transparent'
                                            onPress = {()=>this.props.navigation.navigate('add_to_cart')}>
                          <MaterialIcons
                              name='add-shopping-cart'
                              size={22}
                              style = {{color:'#48c7f0'}}>
                          </MaterialIcons>
                        </TouchableHighlight>
                        <AnimatedHideView
                            visible = {this.state.show_cart}
                            style = {{position:'absolute'}}>
                          <TouchableHighlight
                              underlayColor = 'transparent'
                              onPress = {()=>{
                                if(this.state.access_token!=''){
                                  this.addToCart();
                                } else {
                                  this.localCart();
                                }
                              }}>
                            <MaterialIcons
                                name='add-shopping-cart'
                                size={22}
                                style = {{color:'#605e5e'}}>
                            </MaterialIcons>
                          </TouchableHighlight>
                        </AnimatedHideView>
                      </View>
                      <Text style = {{marginLeft:5,color:'#605e5e',marginTop:3,fontSize:12}}>Cart</Text>
                    </View>

                  </View>
                </View>
                <View style={{width:'100%',backgroundColor:'#fff'}}>
                  {/*<View style={{width:'100%',marginTop:20}}>*/}
                  {/*<GridView*/}
                  {/*itemDimension = {360}*/}
                  {/*items = {this.state.selected_size_array}*/}
                  {/*style = {styles.gridView}*/}
                  {/*spacing = {1}*/}
                  {/*renderItem = {item =>*/}
                  {/*<View style = {{elevation:3,height:150,width:'100%'}}>*/}
                  {/*<Text style={{marginBottom:5,marginLeft:10,color:'#369',fontWeight:'bold'}}>{item.name}</Text>*/}
                  {/*<ScrollView*/}
                  {/*horizontal={true}*/}
                  {/*showsHorizontalScrollIndicator={false}>*/}
                  {/*<FlatList style = {{marginTop:10}}*/}
                  {/*data={item.value}*/}
                  {/*numColumns={item.value.length}*/}
                  {/*renderItem={({ item, index })=> (*/}
                  {/*<TouchableHighlight underlayColor='transparent'*/}
                  {/*onPress={()=>this.SelectedSpec(item.variation_slug)}*/}
                  {/*style = {{width:60,height:60,borderRadius:60/2,backgroundColor:'#fff',marginLeft:10,alignItems:'center',justifyContent:'center',elevation:3}}>*/}
                  {/*<Text style={{fontWeight:'bold',fontSize:18,color:'#360'}}>{item.variation_spec_value}</Text>*/}
                  {/*</TouchableHighlight>*/}
                  {/*)}*/}
                  {/*/>*/}
                  {/*</ScrollView>*/}
                  {/*</View>*/}
                  {/*}*/}
                  {/*/>*/}
                  {/*</View>*/}
                  {/*<GridView*/}
                  {/*itemDimension = {360}*/}
                  {/*items = {var_spec_data}*/}
                  {/*style = {styles.gridView}*/}
                  {/*spacing = {1}*/}
                  {/*renderItem = {item =>*/}
                  {/*<View style = {{elevation:3,height:150,width:'100%'}}>*/}
                  {/*<Text style={{marginBottom:5,marginLeft:10}}>{item.name}</Text>*/}
                  {/*<ScrollView*/}
                  {/*horizontal={true}*/}
                  {/*showsHorizontalScrollIndicator={false}>*/}
                  {/*<FlatList*/}
                  {/*data={item.value}*/}
                  {/*numColumns={item.value.length}*/}
                  {/*renderItem={({ item, index })=> (*/}
                  {/*<View style = {{width:80,height:100,backgroundColor:'#fff',marginLeft:10,alignItems:'center',justifyContent:'center'}}>*/}
                  {/*<TouchableHighlight style={{borderWidth:item.cardBorder,borderColor:item.cardViewBorder,height:'60%',width:'70%',borderTopRightRadius:6,borderTopLeftRadius:6,*/}
                  {/*borderBottomRightRadius:6,borderBottomLeftRadius:6}}*/}
                  {/*underlayColor='transparent'*/}
                  {/*onPress = {()=>this.SelectedSpec(item.variation_slug)}>*/}
                  {/*<Image style = {{height:'100%',width:'100%',justifyContent:'center',alignItems:'center',resizeMode:'stretch'}}*/}
                  {/*source={{uri:config.IMG_URL+item.img}}>*/}
                  {/*</Image>*/}
                  {/*</TouchableHighlight>*/}
                  {/*<View style={{height:'20%',alignItems:'center',justifyContent:'center'}}>*/}
                  {/*<Text style={{marginTop:5}}>{item.variation_spec_value}</Text>*/}
                  {/*</View>*/}
                  {/*</View>*/}
                  {/*)}*/}
                  {/*/>*/}
                  {/*</ScrollView>*/}
                  {/*</View>*/}
                  {/*}*/}
                  {/*/>*/}
                </View>
                <View style = {{width:'100%'}}>
                  <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
                    <View style = {{width:'98%',alignItems:'center',justifyContent:'center',elevation:2,backgroundColor:'#fff',
                      marginTop:5,padding:10}}>
                      <View style = {{width:'100%'}}>
                        <Text style = {{color:'#000',fontSize:14,fontWeight:'bold',marginTop:5,marginBottom:10}}>About : </Text>
                      </View>
                      <Text style = {{fontSize:12}}>{this.state.product_details}</Text>
                    </View>
                  </View>
                </View>
                <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
                  <View style = {{width:'98%',alignItems:'center',justifyContent:'center',elevation:2,backgroundColor:'#fff',
                    marginTop:5,marginBottom:5,padding:10}}>
                    <View style = {{width:'100%'}}>
                      <Text style = {{color:'#000',fontSize:14,fontWeight:'bold'}}>Product Details</Text>
                    </View>
                    <GridView
                        itemDimension={360}
                        items={this.state.spec}
                        style={{paddingTop:25}}
                        renderItem={item => (
                            <View style = {{width:'100%',flexDirection:'row'}}>
                              <View style = {{width:'40%',marginLeft:1}}>
                                <Text style = {{color:'#363a42',fontSize:12}}>{item.spec_name}</Text>
                              </View>
                              <View style = {{width:'50%'}}>
                                <Text style = {{color:'#369',fontSize:12}}>{item.spec_value}</Text>
                              </View>
                            </View>
                        )}
                    />
                    <View style = {{width:'100%'}}>
                      <Text style = {{fontSize:14,marginTop:5,marginBottom:5,color:'#000',fontWeight:'bold'}}>Model & Care</Text>
                      <Text style = {{color:'#363a42',fontSize:12}}>100% Pure Material</Text>
                      <Text style = {{color:'#363a42',fontSize:12}}>Machine-wash</Text>
                      <Text style = {{color:'#363a42',marginTop:10,fontSize:12}}>Cash on delivery might be available</Text>
                      <Text style = {{color:'#363a42',fontSize:12}}>Easy 30 days return & 30 days exchange</Text>
                      <Text style = {{color:'#363a42',marginBottom:10,fontSize:12}}>Try & buy might be available</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style = {styles.footer}>
              {/*<View style = {{width:'50%',height:'100%',backgroundColor:'#363a42'}}>*/}
                {/*<TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}*/}
                                    {/*underlayColor = 'transparent'*/}
                                    {/*onPress = {()=>goBack()}>*/}
                  {/*<Text style = {{color:'#fff'}}>Cancel</Text>*/}
                {/*</TouchableHighlight>*/}
              {/*</View>*/}
              <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',backgroundColor:this.state.foo_color}}>
                <TouchableHighlight style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}
                                    underlayColor = 'transparent'
                                    onPress = {()=>
                                    {
                                      if (this.state.access_token!=''&&this.state.out_of_stock_screen_temp == false) {
                                        this.props.navigation.navigate('buy_now',{
                                          product_name:this.state.product_name,
                                          img:this.state.header_image,
                                          prize:this.state.prize,
                                          product:this.state.product_id,
                                          vendor:this.state.vendor_id,
                                          measurements : this.state.measurements,
                                          slug : this.state.slug,
                                          spec : this.state.spec
                                        })
                                      } else if (this.state.access_token == ''){
                                        this.setState({
                                          login_cnfrm_screen : true
                                        })
                                      } else if (this.state.out_of_stock_screen_temp == true) {
                                        this.setState({out_of_stock_screen : true})
                                      }
                                    }
                                    }>
                  <Text style = {{color:'#fff'}}>{this.state.foo_text}</Text>
                </TouchableHighlight>
              </View>
            </View>
          </View>
          <AnimatedHideView
              visible = {this.state.ratingView}
              style = {{width:'100%',height:'100%',position:'absolute',backgroundColor:'rgba(00, 00, 00, 0.7)',alignItems:'center',justifyContent:'center'}}>
            <View style = {{width:'89%',height:'65%',backgroundColor:'#fff',borderBottomLeftRadius:8,borderBottomRightRadius:8,
              borderTopLeftRadius:8,borderTopRightRadius:8,alignItems:'center',justifyContent:'center'}}>
              <ScrollView style = {{width:'100%',height:'100%'}}>
                <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'#000',fontSize:22,fontWeight:'bold'}}>Wants to Rate Us Now ?</Text>
                  <Image style = {{width:80,height:80,alignItems:'center',justifyContent:'center',marginTop:20}}
                         source = {require('../img/thumbs.png')}>
                  </Image>
                  <View style = {{width:'90%',alignItems:'center',justifyContent:'center',marginTop:20}}>
                    <Text style = {{fontSize:16,textAlign:'center'}}>Rate the product it will incredibly helpful to other user to select the best one</Text>
                  </View>
                  <View style = {{width:'100%',marginTop:10,alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{color:'#800000',fontSize:20,marginTop:5,marginBottom:10,fontWeight:'bold'}}>{this.state.feedback}</Text>
                    <Stars
                        isActive={true}
                        rateMax={5}
                        isHalfStarEnabled={false}
                        onStarPress={(rating) => this.addMyrating(rating)}
                        rate={1}
                        size={35}
                    />
                    <TextInput style = {styles.input}
                               underlineColorAndroid='#bbb'
                               placeholder="Your Comment"
                               placeholderTextColor="#000"
                               onChangeText = {(user_comment)=>this.updateValue(user_comment,'comment')}>
                    </TextInput>
                  </View>
                  <View style = {{width:'90%',alignItems:'center',justifyContent:'space-between',flexDirection:'row',marginTop:10}}>
                    <Text style = {{color:'#2fdab8',fontSize:16,fontWeight:'bold'}}
                          onPress = {()=>this.addReview()}>SUBMIT</Text>
                    <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                          onPress = {()=>this.setState({ratingView:false})}>DISMISS</Text>
                  </View>
                </View>
              </ScrollView>
            </View>
          </AnimatedHideView>
          <View style = {{width:'100%',alignItems:'center',justifyContent:'center'}}>
            <Spinner color = {'#369'} visible={this.state.show} textContent={"Loading..."} textStyle={{color: '#369'}}
                     overlayColor = {'#fff'}/>
          </View>
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
                            visible = {this.state.login_cnfrm_screen}>
            <View style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style = {{width:'100%',height:'80%'}}>

              </View>
              <View style = {{width:'95%',height:'15%',backgroundColor:'rgba(00, 00, 00, 0.7)',alignItems:'center',justifyContent:'center',
                borderBottomRightRadius:6,borderBottomLeftRadius:6,borderTopLeftRadius:6,borderTopRightRadius:6}}>
                <Text style = {{color:'#fff',fontWeight:'bold',fontSize:16,textAlign:'center'}}>Seems like you are not a member in here</Text>
                <View style = {{width:'100%',alignItems:'center',justifyContent:'center',marginTop:10,flexDirection:'row'}}>
                  <View style = {{width:'60%',paddingLeft:10}}>
                    <Text style = {{color:'#369',fontWeight:'bold',fontSize:14}}
                          onPress = {()=>this.setState({login_cnfrm_screen:false})}>Cancel</Text>
                  </View>
                  <View style = {{width:'30%',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <Text style = {{color:'#2fdab8',fontWeight:'bold',fontSize:14}}
                          onPress = {()=>this.props.navigation.navigate('reg')}>Sign Up</Text>
                    <Text style = {{color:'#2fdab8',fontWeight:'bold',fontSize:14}}
                          onPress = {()=>this.props.navigation.navigate('logn')}>Log In</Text>
                  </View>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',
            position : 'absolute'}}
                            visible = {this.state.out_of_stock_screen}>
            <View style = {{width:'95%',backgroundColor:'rgba(00,00,00,0.7)',alignItems:'center',justifyContent:'center'}}>
              <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold',marginTop:30,marginBottom:20}}>Sorry This Product Not in Stock</Text>
              <View style = {{width:'100%',padding:10,flexDirection:'row'}}>
                <View style = {{width:'90%'}}></View>
                <Text style = {{color:'#800000',fontSize:16,fontWeight:'bold'}}
                      onPress = {()=>this.setState({out_of_stock_screen:false})}>OK</Text>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(00,00,00,0.5)',
            position:'absolute'}}
                            visible = {this.state.customising_screen}>
            <View style = {{width:'95%',borderBottomLeftRadius:6,borderBottomRightRadius:6,borderTopLeftRadius:6,backgroundColor:'#fff',
              borderTopRightRadius:6,alignItems:'center',justifyContent:'center'}}>
              <View style = {{height:50,width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'#5a5a5a',flexDirection:'row'}}>
                <View style = {{width:'85%',alignItems:'center',justifyContent:'center'}}>
                  <Text style = {{color:'#fff',fontSize:14}}>Customise</Text>
                </View>
                <View style = {{width:'15%',alignItems:'center',justifyContent:'center'}}>
                  <TouchableHighlight underlayColor = 'transparent'
                                      onPress = {()=>this.setState({customising_screen:false,measurements : []})}>
                    <MaterialIcons
                        name='close'
                        size={22}
                        style = {{color:'#fff'}}>
                    </MaterialIcons>
                  </TouchableHighlight>
                </View>
              </View>
              <FlatList
                  data={this.state.Data}
                  renderItem={({ item, index }) => (
                      <View style = {{width:'100%'}}>
                        <Text style = {{color:'#363a42',fontSize:14,fontWeight:'bold',marginTop:10}}>{item.name} (inches)</Text>
                        <View style = {{width:'100%',alignItems:'center',flexDirection:'row',marginBottom:10}}>
                          <TextInput style = {styles.input1}
                                     underlineColorAndroid='transparent'
                                     placeholderTextColor="#eee"
                                     keyboardType = 'numeric'
                                     onChangeText = {(text_data)=>this.updateValue1(text_data, item.product_measurement_id, item.name, index)}>
                          </TextInput>
                          <TouchableHighlight underlayColor = 'transparent'
                                              style = {{marginLeft:10}}
                                              onPress = {()=>this.setState({des_screen:true,des:item.description,api:item.video})}>
                            <MaterialIcons
                                name='info'
                                size={30}
                                style = {{color:'#363a42'}}>
                            </MaterialIcons>
                          </TouchableHighlight>
                        </View>
                      </View>
                  )}
              />
              <View style = {{width:'100%',height:50,alignItems:'center',justifyContent:'center',flexDirection:'row'}}>
                <TouchableHighlight style = {{width:'50%',height:'100%'}}
                                    underlayColor = 'transparent'
                                    onPress = {()=>{
                                      if(this.state.access_token){
                                        console.warn('access_token//',this.state.access_token);
                                        this.addToCart();
                                      } else {
                                        console.warn('access_token',this.state.access_token);
                                        // this.Cus_LocalCart();
                                      }
                                    }}>
                  <View style = {{width:'100%',height:'100%',backgroundColor:'#363a42',alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{color:'#fff'}}>{this.state.cart_text}</Text>
                  </View>
                </TouchableHighlight>
                <TouchableHighlight style = {{width:'50%',height:'100%'}}>
                  <View style = {{width:'100%',height:'100%',backgroundColor:'#2fdab8',alignItems:'center',justifyContent:'center'}}>
                    <Text style = {{color:'#fff'}}
                          onPress = {()=>this.props.navigation.navigate('buy_now',{
                            product_name:this.state.product_name,
                            prize:this.state.prize,
                            img:this.state.header_image,
                            product:this.state.product_id,
                            vendor:this.state.vendor_id,
                            measurements : this.state.measurements,
                            slug : this.state.slug,
                            spec : this.state.spec
                          })}>Buy Now</Text>
                  </View>
                </TouchableHighlight>
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
                <Text style = {{color:'#fff',fontSize:18,fontWeight:'bold'}}>Garden Store</Text>
              </View>
              <View style = {styles.iconView}>

              </View>
            </View>
            <View style = {styles.baseContainer2}>
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
          <AnimatedHideView style = {{width:'100%',height:'100%',alignItems:'center',justifyContent:'center',position:'absolute'}}
                            visible = {this.state.des_screen}>
            <View style = {styles.container}>
              <View style = {styles.toolbar}>
                <View style = {styles.menuView}>
                  <TouchableHighlight underlayColor = 'transparent'
                                      onPress = {()=>this.setState({des_screen:false})}>
                    <MaterialIcons
                        name='arrow-back'
                        size={22}
                        style = {{color:'#fff'}}>
                    </MaterialIcons>
                  </TouchableHighlight>
                </View>
                <View style = {styles.titleView}>
                  <Text style = {{color:'#fff',fontWeight:'bold',fontSize:18}}>Customisation</Text>
                </View>
                <View style = {styles.iconView}></View>
              </View>
              <View style = {styles.baseContainer}>
                <View style = {{height:'100%',width:'100%',backgroundColor:'#fff',elevation:4}}>
                  <ScrollView style = {{width:'100%',height:'100%'}}>
                    <View style = {{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
                      <View style={{width:'90%',flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:20}}>
                        <View style={{width:'80%'}}>

                        </View>
                        <View style={{width:'20%',alignItems:'center',justifyContent:'center'}}>
                          <TouchableHighlight underlayColor='transparent'
                                              onPress = {()=> {
                                                if (this.state.api!=null){
                                                  this.props.navigation.navigate('video_web',{api:this.state.api})
                                                }
                                              }}>
                            <MaterialIcons
                                name='videocam'
                                size={40}
                                style = {{color:'#800000'}}>
                            </MaterialIcons>
                          </TouchableHighlight>
                        </View>
                      </View>
                      <Text style = {{textAlign:'center',fontSize:18,fontWeight:'bold',color:'#360',marginTop:20,marginBottom:20}}>Read The Below Content Carefully</Text>
                      <Text style = {{textAlign:'center',fontSize:16,fontWeight:'bold',color:'#000',marginTop:20,marginBottom:20}}>{this.state.des}</Text>
                    </View>
                  </ScrollView>
                </View>
              </View>
            </View>
          </AnimatedHideView>
          <AnimatedHideView visible={this.state.color_size_screen}
                            style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center',backgroundColor:'rgba(00,00,00,0.8)',position:'absolute'}}>
            <View style={{height:'100%',width:'100%',alignItems:'center',justifyContent:'center'}}>
              <View style={{height:'40%'}}>
              </View>
              <View style={{height:'60%',width:'100%',backgroundColor:'#eee'}}>
                <View style={{marginTop:10,marginLeft:10,flexDirection:'row'}}>
                  <TouchableHighlight underlayColor='transparent'
                                      onPress = {()=>this.setState({color_size_screen : false})}>
                    <MaterialIcons
                        name='close'
                        size={24}
                        style = {{color:'#000'}}>
                    </MaterialIcons>
                  </TouchableHighlight>
                  <Text style={{color:'#000',fontSize:16,marginLeft:5,fontWeight:'bold'}}
                    onPress={()=>this.setState({color_size_screen:false})}>Close</Text>
                </View>
                <ScrollView>
                  <View style={{width:'100%',marginTop:20}}>
                    <GridView
                        itemDimension = {360}
                        items = {this.state.contentArray}
                        style = {styles.gridView}
                        spacing = {1}
                        renderItem = {item =>
                            <View style = {{elevation:3,height:150,width:'100%'}}>
                              <Text style={{marginBottom:5,marginLeft:10,color:'#369',fontWeight:'bold'}}>{item.spec}</Text>
                              <ScrollView
                                  horizontal={true}
                                  showsHorizontalScrollIndicator={false}>
                                <FlatList style = {{marginTop:10}}
                                data={item.detail}
                                numColumns={item.detail.length}
                                renderItem={({ item, index })=> (
                                <TouchableHighlight underlayColor='transparent'
                                onPress={()=>this.speckChoose(item.variation_slug,index)}
                                style = {{width:80,height:50,borderRadius:30/2,backgroundColor:'#fff',borderWidth:2,borderColor:item.color,marginLeft:10,alignItems:'center',justifyContent:'center',elevation:3}}>
                                <Text style={{fontWeight:'bold',fontSize:12,color:'#595656'}}>{item.variation_spec_value}</Text>
                                </TouchableHighlight>
                                )}
                                />
                              </ScrollView>
                            </View>
                        }
                    />
                  </View>
                  {/*<View style = {{width:'100%',height:100,backgroundColor:'#369'}}>*/}
                  {/*<GridView*/}
                  {/*itemDimension = {360}*/}
                  {/*items = {this.state.sec_selected_array}*/}
                  {/*style = {styles.gridView}*/}
                  {/*spacing = {1}*/}
                  {/*renderItem = {item =>*/}
                  {/*<View style = {{elevation:3,height:150,width:100,backgroundColor:'#000'}}>*/}

                  {/*</View>*/}
                  {/*}*/}
                  {/*/>*/}
                  {/*</View>*/}
                </ScrollView>
                {/*<View style={{width:'100%',height:50,elevation:2,backgroundColor:'#48c7f0',alignItems:'center',justifyContent:'center'}}>*/}
                  {/*<Text style={{fontSize:16,fontWeight:'bold',color:'#fff'}}>PROCEED</Text>*/}
                {/*</View>*/}
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
    justifyContent:'center'
  },
  toolbar:{
    height:'8%',
    width:'100%',
    alignItems:'center',
    justifyContent:'space-between',
    backgroundColor:'#282a2d',
    flexDirection:'row'
  },
  baseContainer:{
    height:'92%',
    width:'100%'
  },
  menuView:{
    height:'100%',
    width:'10%',
    alignItems:'center',
    justifyContent:'center'
  },
  titleView:{
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
  },
  footer:{
    width:'100%',
    height:55,
    flexDirection:'row'
  },
  scrollContainer:{
    height:'100%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  },
  headerImage:{
    height:450,
    width:'100%',
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#fff',
    elevation:2
  },
  customSlide: {
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center'
  },
  customImage: {
    width:'100%',
    height:'100%',
    alignItems:'center',
    justifyContent:'center',
    resizeMode:'stretch'
  },
  buttons: {
    height: 15,
    marginTop: -25,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  button: {
    margin: 3,
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    backgroundColor: '#bbb',
    opacity: 1,
  },
  buttonSelected: {
    opacity: 1,
    backgroundColor: '#369',
    width: 8,
    height: 8,
    borderRadius: 8 / 2,
    elevation:3
  },
  cover_img:{
    color:'#595656',
    fontSize:14
  },
  cover_img_des:{
    color:'#ffffff',
    marginTop:10
  },
  function_icon_view:{
    width:'90%',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:10,
    flexDirection:'row',
    marginBottom:10
  },
  input:{
    width:'90%',
    height:45,
    color:'#000',
    marginTop:20
  },
  input1:{
    width:'80%',
    height:45,
    paddingLeft:16,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    color:'#363a42',
    borderColor:'#363a42',
    borderWidth:1,
    marginTop:10,
    alignItems:'center',
    justifyContent:'center'
  },
  baseContainer2:{
    height:'92%',
    width:'100%',
    alignItems:'center',
    justifyContent:'center'
  }
});
