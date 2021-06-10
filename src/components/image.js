import React, { Component } from 'react';
import { fabric } from "fabric";

export default function  MyEditor() {
        const imgUrl="https://i.imgur.com/28kU1bo.png"
        var canvas = new fabric.StaticCanvas('c');
        var canvasIamge;
        fabric.util.loadImage(imgUrl, (imgObj) => {
            const img = new fabric.Image(imgObj)
            img.filters = [new fabric.Image.filters.HueRotation()];
            canvasIamge=img
            img.applyFilters()
            canvas.add(img)
        }, null, 'anonymous')

        //
        // var canvasIamge;
        //
        //
        // var image = new Image();
        // image.src = "https://i.imgur.com/28kU1bo.png";
        // image.onload = () => {
        //     canvasIamge = new fabric.Image(image)
        //     canvasIamge.filters = [new fabric.Image.filters.HueRotation()];
        //     canvas.add(canvasIamge);
        //
        // };

        function onButtonClick() {
            console.log(canvasIamge)
            canvasIamge.filters[0].rotation = 2 * Math.random() - 1;
            // console.log(image.filters[0].rotation);
            canvasIamge.applyFilters();
            canvas.requestRenderAll();
            console.log('onclick button')

        }
        return(
            <div>
                <button onClick={onButtonClick}>click here</button>
                <p>Sam Editor</p>
                <canvas id="c" width='800' height='600'></canvas>
            </div>

        )
}

