import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import {http} from '../services'
import {getCategories} from  '../apiService'




function Welcome(props){
    const [categoryList, setCategoryList] = useState(null);
    const [selectedcategory, setSelectedcategory] = useState(null);
    const [productDesignsList, setProductDesignsList] = useState(null);

    useEffect(() => {
        let mounted = true;
        getCategories()
            .then(items => {
                if(mounted) {
                    setCategoryList(items)
                }
            })
        return () => mounted = false;
    }, [])

    useEffect(() => {
        if(selectedcategory){
            setProductDesignsList(selectedcategory.designs)
        }

    }, [selectedcategory]);

    // const setProductDesigns=()=>{
    //
    // }

    //
    //
    // async function getCategories(){
    //     await http
    //         .get('product')
    //         .then((res) => {
    //            // console.log(res.data)
    //             setProductList(res.data)
    //         })
    //         .catch((error) => {
    //                 console.log(error)
    //         });
    // }

    return(
      <div style={{marginLeft:"100px", marginTop:"100px"}}>
          <h1 style={{textAlign:"center", color:"yellowgreen"}}>Categories</h1>
          <div>
              {categoryList &&
                  categoryList.map((item,index) => {
                          return (
                              <div>
                                  <button key={index} onClick={()=>{setSelectedcategory(item)}}>{item.name}</button>
                              </div>
                          )}
                  )}
          </div>
          <div style={{width:"1200px", height:"500px", border: "black", borderStyle:"solid", borderWidth:"1px"}} id="shirt_div">
              { productDesignsList &&
                   productDesignsList.map((item,index) => {
                      return (
                          <div key={index} >
                              <Link   to={{
                                  pathname: `/editor/${item.id}`,
                                  query:item
                              }} >
                                  <p>{item.name}</p>
                                  <img key={index} src={item.display_image}
                                       alt={""}
                                       style={{width:"200px", height:"200px", border: "black", borderStyle:"solid", borderWidth:"1px", marginTop:"10px", marginLeft:"10px"}}>
                                  </img>
                              </Link>
                          </div>
                          )
                      })
              }
          </div>
      </div>
    );
}

export default Welcome;
