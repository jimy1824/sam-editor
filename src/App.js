import "bootstrap/dist/js/bootstrap.min.js";
import logo from './logo.svg';
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import { fabric } from "fabric";
import SamEditor from "./components/editor";
import Welcome from "./components/welcome";
import MyEditor from "./components/image";
import SamLocalEditor from "./components/local_stroge_editor";
import SamLocalEditorTowelFront from "./components/towel/towel_front"
import SamLocalEditorBagFront from "./components/Bag/bag_back";
import SamLocalEditorVestFront from "./components/Vest/vest_front";
import SamLocalEditorApron from "./components/Apron/apron";
import SamLocalEditorBaseBJacFront from "./components/Base Ball Jacket/base_b_jac_front";
import SamLocalEditorBaseBShirtFront from "./components/Base Ball Shirt/base_b_shirt_front";
import SamLocalEditorBomberJacFront from "./components/Bomber Jacket/bomber_jac_front";
import SamLocalEditorCoachJacFront from "./components/Coach Jacket/coach_jac_front";
import SamLocalEditorHatFront from "./components/Hat/hat_front";
import SamLocalEditorHoodieFront from "./components/Hoodie/hoodie_front";
import SamLocalEditorPantFront from "./components/Pants/pant_front";
import SamLocalEditorTankTopFront from "./components/Tank Top/tank_top_front";
import SamLocalEditorBack from "./components/back_canvas";
import SamLocalEditorRight from "./components/right_canvas";

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
                {/*<Route*/}
                {/*    exact*/}
                {/*    path="/editor/:id"*/}
                {/*    component={SamEditor}*/}
                {/*    render={(props) => <SamEditor {...props} />}*/}
                {/*/>*/}
                <Route
                    exact
                    path="/editor/shirt/:id"
                    component={SamLocalEditor}
                    render={(props) => <SamLocalEditor {...props} />}
                />
                <Route
                    exact
                    path="/editor/towel/:id"
                    component={SamLocalEditorApron}
                    render={(props) => <SamLocalEditorApron {...props} />}
                />
                <Route
                    exact
                    path="/editor/bag/:id"
                    component={SamLocalEditorBagFront}
                    render={(props) => <SamLocalEditorBagFront {...props} />}
                />
                <Route
                    exact
                    path="/editor/base-ball-jacket/:id"
                    component={SamLocalEditorBaseBJacFront}
                    render={(props) => <SamLocalEditorBaseBJacFront {...props} />}
                />
                <Route
                    exact
                    path="/editor/base-ball-shirt/:id"
                    component={SamLocalEditorBaseBShirtFront}
                    render={(props) => <SamLocalEditorBaseBShirtFront {...props} />}
                />
                <Route
                    exact
                    path="/editor/bag/:id"
                    component={SamLocalEditorBomberJacFront}
                    render={(props) => <SamLocalEditorBomberJacFront {...props} />}
                />
                <Route
                    exact
                    path="/editor/coach-jacket/:id"
                    component={SamLocalEditorCoachJacFront}
                    render={(props) => <SamLocalEditorCoachJacFront {...props} />}
                />
                <Route
                    exact
                    path="/editor/hat/:id"
                    component={SamLocalEditorHatFront}
                    render={(props) => <SamLocalEditorHatFront {...props} />}
                />
                <Route
                    exact
                    path="/editor/bag/:id"
                    component={SamLocalEditorHoodieFront}
                    render={(props) => <SamLocalEditorHoodieFront {...props} />}
                />
                <Route
                    exact
                    path="/editor/pants/:id"
                    component={SamLocalEditorPantFront}
                    render={(props) => <SamLocalEditorPantFront {...props} />}
                />
                <Route
                    exact
                    path="/editor/tank-top/:id"
                    component={SamLocalEditorTankTopFront}
                    render={(props) => <SamLocalEditorTankTopFront {...props} />}
                />
                <Route
                    exact
                    path="/editor/towel/:id"
                    component={SamLocalEditorTowelFront}
                    render={(props) => <SamLocalEditorTowelFront {...props} />}
                />
                <Route
                    exact
                    path="/editor/vest/:id"
                    component={SamLocalEditorVestFront}
                    render={(props) => <SamLocalEditorVestFront {...props} />}
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
