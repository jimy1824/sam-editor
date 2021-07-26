import React, { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import {http} from '../services'
import {getCategories} from  '../apiService'




function Welcome(props){
    const [categoryList, setCategoryList] = useState(null);
    const [selectedcategory, setSelectedcategory] = useState(null);
    const [productDesignsList, setProductDesignsList] = useState(null);
    const [towelList, setTowelList] = useState(null);

    useEffect(() => {
        let mounted = true;
        getCategories()
            .then(items => {
                if(mounted) {
                    setCategoryList(items)
                }
            })
        console.log(categoryList, "categry list")
        localStorage.clear()
        return () => mounted = false;
    }, [])

    useEffect(() => {
        if(selectedcategory){
            console.log()
            console.log(productDesignsList,"selected Category")
            setProductDesignsList(selectedcategory.designs)
            console.log(productDesignsList, "abc")
        }

    }, [selectedcategory]);

    console.log(selectedcategory, "selected Catogory")

    useEffect(() => {
        if(selectedcategory){
            setTowelList(selectedcategory.designs)
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
          <h1 style={{textAlign:"center", color:"black"}}>Categories</h1>
          <div style={{display:"inline-flex"}}>
              {categoryList &&
                  categoryList.map((item,index) => {
                          return (
                              <div style={{marginTop:"20px"}}>
                                  <button key={index} onClick={()=>{setSelectedcategory(item)}} style={{backgroundColor:"yellowgreen", marginLeft:10, width:"80px", height:"50px",color:"white", border:"none"}}>{item.name}</button>
                              </div>
                          )}
                  )}
          </div>
          <div style={{width:"1200px", display:"inline-flex", height:"max-content", border:"black", borderStyle:"solid", borderWidth:"1px", marginTop:"10px"}} id="shirt_div">
              { towelList &&
                   towelList.map((item,index) => {
                      return (
                          <div key={index} style={{height:"270px", width:"230px", border: "black", borderStyle:"solid", borderWidth:"1px", marginLeft:"0px"}}>
                              <Link   to={{
                                  pathname: `/editor/${item.key}/${item.id}`,
                                  query:item
                              }}>

                                  <img key={index} src={`http://44.192.67.250x${item.display_image}`}
                                       alt={""}
                                       style={{width:"200px", height:"200px", marginTop:"10px", marginLeft:"10px"}}>
                                  </img>
                                  <p style={{textAlign:"center"}}>{item.name}</p>
                              </Link>
                          </div>
                          )
                      })
              }



              {/*{ towelList &&*/}
              {/*     towelList.map((item,index) => {*/}
              {/*        return (*/}
              {/*            <div key={index} style={{height:"270px", width:"230px", border: "black", borderStyle:"solid", borderWidth:"1px", marginLeft:"0px"}}>*/}
              {/*                <Link   to={{*/}
              {/*                    pathname: `/editor/${item.id}`,*/}
              {/*                    query:item*/}
              {/*                }} >*/}

              {/*                    <img key={index} src={item.display_image}*/}
              {/*                         alt={""}*/}
              {/*                         style={{width:"200px", height:"200px", marginTop:"10px", marginLeft:"10px"}}>*/}
              {/*                    </img>*/}
              {/*                    <p style={{textAlign:"center"}}>{item.name}</p>*/}
              {/*                </Link>*/}
              {/*            </div>*/}
              {/*            )*/}
              {/*        })*/}
              {/*}*/}
          </div>
      </div>
    );
}

export default Welcome;
