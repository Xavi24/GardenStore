if (cmsdata.cms.elements.element_2.redirect == 'product_detail'){
  field = cmsdata.cms.elements.element_2.redirect;
  secondBlockRedirect = cmsdata.cms.elements.element_2.slug;
} else if (cmsdata.cms.elements.element_2.redirect == 'product_list') {
  field = cmsdata.cms.elements.element_2.redirect;
  for(let params1 of cmsdata.cms.elements.element_2.params){
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
  secondBlockRedirect = api_1;
}