import {http} from "./services";


export async function getCategories(){
   return  await http
        .get('category')
        .then(res =>
            res.data)
        .catch((error) => {
            console.log(error)
        });
}

export async function getProductDetail(productId){
    const url='product/'+productId
    return  await http
        .get(url)
        .then(res =>
            res.data)
        .catch((error) => {
            console.log(error)
        });
}
