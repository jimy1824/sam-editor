import React, {useEffect, useState} from "react";
import { fabric } from "fabric";
import { v1 as uuid } from 'uuid'
// import $ from "jquery";

function SamEditor(props) {

    const [canvas, setCanvas] = useState('');
    let bodyImage;
    let rightSleevImage;
    let leftSleeveImage;

    // urls

    const bodyUrl = 'http://localhost:8000/media/uploads/body.png'
    const leftSleeveUrl = 'http://localhost:8000/media/uploads/left_sleeve.png'
    const rightSleeveUrl = 'http://localhost:8000/media/uploads/right_sleeve.png'


    const initCanvas = () =>
        new fabric.Canvas('canv', {
            height: 600,
            width: 600,
            backgroundColor: 'white',
        });

    useEffect(() => {
        setCanvas(initCanvas());
    }, []);

    const loadImage = (e) => {
        fabric.Image.fromURL(bodyUrl, function (body) {
            body.id = "body";
            body.filters = [new fabric.Image.filters.HueRotation()];
            bodyImage = body
            body.applyFilters()
            body.set(
                {
                    left: 10,
                    top: 100,
                    selectable:true

                })
            canvas.add(body);
        }, {crossOrigin: 'anonymous'})
        fabric.Image.fromURL(rightSleeveUrl, function (sleeve) {
            sleeve.id = "body";
            sleeve.filters = [new fabric.Image.filters.HueRotation()];
            rightSleevImage = sleeve
            sleeve.applyFilters()
            sleeve.set(
                {
                    left:520,
                    top: 100,

                })
            canvas.add(sleeve);
        }, {crossOrigin: 'anonymous'})
        fabric.Image.fromURL(leftSleeveUrl, function (sleeve) {
            sleeve.id = "body";
            sleeve.filters = [new fabric.Image.filters.HueRotation()];
            leftSleeveImage = sleeve
            sleeve.applyFilters()
            sleeve.set(
                {
                    left:77,
                    top:34

                })
            canvas.add(sleeve);
        }, {crossOrigin: 'anonymous'})

    };
        //     fabric.util.loadImage(imgUrl, (imgObj) => {
        //         const img = new fabric.Image(imgObj)
        //         img.filters = [new fabric.Image.filters.HueRotation()];
        //         canvasIamge=img
        //         img.applyFilters()
        //         canvas.add(img)
        //     }, null, 'anonymous')
        // });
        const changeColor = (e) => {
            console.log(bodyImage)
            bodyImage.filters[0].rotation = 2 * Math.random() - 1;
            // console.log(image.filters[0].rotation);
            bodyImage.applyFilters();
            canvas.requestRenderAll();
            console.log('onclick button')
        }
        const addShape = (e) => {
            let type = e.target.name;
            let object

            if (type === "rectangle") {
                object = new fabric.Rect({
                    height: 75,
                    width: 150
                });

            } else if (type === "triangle") {
                object = new fabric.Triangle({
                    width: 100,
                    height: 100
                })

            } else if (type === "circle") {
                object = new fabric.Circle({
                    radius: 50
                })
            }

            object.set({id: uuid()})
            canvas.add(object)
            canvas.renderAll()
        };

        return (
            <div>
                <div>
                    <button type='button' name='circle' onClick={loadImage}>
                        loadImage
                    </button>
                    <button type='button' name='circle' onClick={changeColor}>
                        change color
                    </button>

                    <button type='button' name='triangle' onClick={addShape}>
                        Add a Triangle
                    </button>

                    <button type='button' name='rectangle' onClick={addShape}>
                        Add a Rectangle
                    </button>
                </div>

                <div>
                    <canvas id='canv'/>
                </div>

            </div>

        );
    }

export default SamEditor;

