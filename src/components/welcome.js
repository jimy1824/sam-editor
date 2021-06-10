import React from 'react';

function Welcome_page(props){
    return(
      <div style={{marginLeft:"100px", marginTop:"100px"}}>
          <div style={{width:"100px", height:"100px"}} id="shirt_div">
              <img href='http://localhost:8000/media/uploads/color_shirt.png' alt={""} style={{width:"100px", height:"100px"}}></img>
          </div>
      </div>
    );
}