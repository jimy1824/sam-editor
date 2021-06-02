import React, {useEffect, useState} from "react";
import { fabric } from "fabric";
// import $ from "jquery";

function SamEditor(props) {
    const [loading, setLoading] = useState(false);
    var canvas = new fabric.StaticCanvas('c');
    // console.log("canvas loaded")
    var canvasIamge;


    // useEffect(() => {
    //     console.log("Mounting...");
    //     loadImage()
    // });

    // var imgEl = document.createElement('img');
    // imgEl.crossOrigin = 'anonymous';
    // imgEl.src = 'https://i.imgur.com/28kU1bo.png';
    // imgEl.onload = function () {
    //     canvasIamge = new fabric.Image(imgEl);
    //     canvasIamge.filters = [new fabric.Image.filters.HueRotation()];
    //     canvas.add(canvasIamge);
    //     setLoading(false)
    // }
    function loadImage(){
        setLoading(true)
        var image=new Image()
        var button_filters = document.createElement('btn')
        image.src='https://i.imgur.com/28kU1bo.png'

        image.onload = function () {
                image = new fabric.Image(image);
                image.filters = [new fabric.Image.filters.HueRotation()];
                canvas.add(image);
                // canvas.add(button_filters)
            setLoading(false)
        }

        // button_filters.onclick = function (){
        //     image = new fabric.Image(image);
        //     image.filters = [new fabric.Image.filters.HueRotation()];
        //     canvas.add(image)
        //     setLoading(false)
        // }

        // var canvasImage = new fabric.Image(image);
        // console.log(canvasImage)
        // canvasImage.filters = [new fabric.Image.filters.HueRotation()];
        // console.log(canvasImage)
        // canvas.add(canvasImage);
    }



    function onButtonClick() {
        console.log(canvasIamge)
        canvasIamge.filters[0].rotation = 2 * Math.random() - 1;
        // console.log(image.filters[0].rotation);
        canvasIamge.applyFilters();
        canvas.requestRenderAll();
        console.log('onclick button')
        // loadImage()
        // console.log(image.filters[0].rotation)
        // image.filters[0].rotation = 2 * Math.random() - 1;
        // console.log(image.filters[0].rotation)
        // console.log(image.applyFilters());
        // canvas.requestRenderAll();
        // console.log('onclick button')
    }

    // imgEl.src = 'https://i.imgur.com/28kU1bo.png';
    // document.getElementById('hue').onclick= App() {
    //   image.filters[0].rotation = 2 * Math.random() - 1;
    //   console.log(image.filters[0].rotation);
    //   image.applyFilters();
    //   canvas.requestRenderAll();
    // };



    return (
        <div>
            {/*<button onClick={loadImage}>click here</button>*/}
            { loading?(
                <p>loading</p>
            ):(
                <div>
                    <p>jhjh</p>
                    <button onClick={loadImage}>Apply Filters</button>
                    <canvas id="c" width='600' height='600'></canvas>
                </div>
            )
            }

        </div>
    );
}

export default SamEditor;
