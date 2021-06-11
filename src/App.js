import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import { fabric } from "fabric";
import SamEditor from "./components/editor";
import Welcome from "./components/welcome";
import MyEditor from "./components/image";

// function App() {
//
//   var canvas = new fabric.StaticCanvas('c');
//   console.log(canvas)
//   var image;
//   var imgEl = document.createElement('img');
//   imgEl.crossOrigin = 'anonymous';
//   imgEl.onload = function() {
//     image = new fabric.Image(imgEl);
//     image.filters = [new       fabric.Image.filters.HueRotation()];
//     canvas.add(image);
//   }
//   imgEl.src = 'https://i.imgur.com/28kU1bo.png';
//
//   console.log(image)
//   function  onButtonClick(){
//     console.log(image)
//     image.filters[0].rotation = 2 * Math.random() - 1;
//     console.log(image.filters[0].rotation);
//     image.applyFilters();
//     canvas.requestRenderAll();
//     console.log('onclick button')
//   }
//   // imgEl.src = 'https://i.imgur.com/28kU1bo.png';
//   // document.getElementById('hue').onclick= App() {
//   //   image.filters[0].rotation = 2 * Math.random() - 1;
//   //   console.log(image.filters[0].rotation);
//   //   image.applyFilters();
//   //   canvas.requestRenderAll();
//   // };
//
//   return (
//     <div className="App">
//       <div>
//         <button onClick={onButtonClick}>click here</button>
//         <p>jhjh</p>
//         <canvas id="c" width='600' height='600' ></canvas>
//       </div>
//     </div>
//   );
// }
//
// export default App;


function App() {
    return (
        <Router>
            {/*<div className="home">*/}
            {/*    <div className="topHead"></div>*/}
            {/*    <div className="container-fluid">*/}
            {/*        <Header/>*/}
            <Switch>
                <Route
                    exact
                    path="/editor/:id"
                    component={SamEditor}
                    render={(props) => <SamEditor {...props} />}
                />
                <Route
                    path="/"
                    component={Welcome}
                    render={(props) => <Welcome {...props} />}
                    />
                {/*<Route*/}
                {/*    // exact*/}
                {/*    path="/"*/}
                {/*    component={MyEditor}*/}
                {/*    render={(props) => <MyEditor {...props} />}*/}
                {/*/>*/}

            </Switch>
            {/*<Footer/>*/}
            {/*</div>*/}
            {/*</div>*/}
        </Router>
    );
}
export default App;
