import React from "react";
import {Link} from "react-router-dom";


function Welcome(props){
    return(
      <div style={{marginLeft:"100px", marginTop:"100px"}}>
          <h1 style={{textAlign:"center", color:"yellowgreen"}}>Categories</h1>
          <div style={{width:"1200px", height:"500px", border: "black", borderStyle:"solid", borderWidth:"1px"}} id="shirt_div">
              <Link to="/editor">
                        <img src='http://localhost:8000/media/uploads/color_shirt.png'
                             alt={""}
                             style={{width:"200px", height:"200px", border: "black", borderStyle:"solid", borderWidth:"1px", marginTop:"10px", marginLeft:"10px"}}>
                        </img>
                </Link>


          </div>
      </div>
    );
}

export default Welcome;