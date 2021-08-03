import React, {useEffect, useState, useRef} from "react";
// import THREELib from "three-js";
import {fabric} from "fabric";
import {saveAs} from 'file-saver'
import {v1 as uuid} from 'uuid';
import * as PIXI from 'pixi.js'
import $ from "jquery";
import {CirclePicker} from 'react-color';
import {Tabs, Tab, AppBar} from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import {MEDIA_URL} from "../../services";
import {BASE_URL} from "../../services";
import {getProductDetail} from "../../apiService";

const viewOptions = [
    'front',
    'back',
    'left',
    'right'
]
var fonts = ["Pacifico", "VT323", "Quicksand", "Inconsolata"];
var logo_img

let addingComponent = null

function SamLocalEditorHoodieFront(props) {
    let {id} = props.match.params
    const [product, setProduct] = useState(null);
    useEffect(() => {
        getProductDetail(id)
            .then(items => {
                localStorage.setItem('front_view_hoodie', JSON.stringify(items.front_view_hoodie));
                localStorage.setItem('back_view_hoodie', JSON.stringify(items.back_view_hoodie));
                localStorage.setItem('left_view_hoodie', JSON.stringify(items.left_view_hoodie));
                localStorage.setItem('right_view_hoodie', JSON.stringify(items.right_view_hoodie));
                setProduct(items)
            })
    }, [])

    const [canvas, setCanvas] = useState(null)
    const [name, setName] = useState(null);
    let [image, setImage] = useState(null);

    const [img, setImg] = useState(null);
    const [displyComponents, setDisplyComponents] = useState([null])

    // tabs
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [color, setColor] = React.useState('#fff');
    const [selectedComponentId, setSelectedComponentId] = React.useState(null);
    const [colorShow, setColorShow] = React.useState(false);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        if (newValue === 0) {
            frontImageLoad()
            setComponents('front_view_hoodie')
            setSelectedComponentId(null)
            setColorShow(false)
            // imageSaved()
        }
        if (newValue === 1) {
            backImageLoad()
            setComponents('back_view_hoodie')
            setSelectedComponentId(null)
            setColorShow(false)
        }
        if (newValue === 2) {
            rightImageLoad()
            setComponents('right_view_hoodie')
            setSelectedComponentId(null)
            setColorShow(false)
        }
        if (newValue === 3) {
            leftImageLoad()
            setComponents('left_view_hoodie')
            setSelectedComponentId(null)
            setColorShow(false)
        }
    }

    const setComponents = (name) => {
        let productView = JSON.parse(localStorage.getItem(name))
        let components = []
        for (const [key, value] of Object.entries(productView)) {
            if (key === 'name' || key === 'id') {

            } else if (value != null) {
                components.push(key)
            }
        }
        setDisplyComponents(components)
    }

    const initCanvas = (name) =>
        new fabric.Canvas(name, {
            height: 800,
            width: 800,
            marginLeft: 100,
            backgroundColor: 'white',
        });

    useEffect(() => {
        setCanvas(initCanvas('canvas'));
    }, []);
    useEffect(() => {
        if (product) {
            preFrontImageLoad()
            prebackImageLoad()
            preleftImageLoad()
            prerightImageLoad()
            frontImageLoad()
            frontImageLoad()
            setComponents('front_view_hoodie')
        }
    }, [product])

    function clearCanvas() {
        canvas.getObjects().forEach((obj) => {
            canvas.remove(obj)
        });
        canvas.renderAll()
    }

    const loadObject = (obj) => {
        fabric.Image.fromURL(obj.src, function (img) {
            // img.id = id;
            // img.filters = [new fabric.Image.filters.HueRotation()];
            if (obj.color) {
                // multiply, add, diff, screen, subtract, darken, lighten, overlay, exclusion, tint
                //  screen, overlay
                img.filters.push(new fabric.Image.filters.BlendColor({
                    color: obj.color.hex,
                    mode: 'tint',
                    opacity: 0
                }))

            }
            img.applyFilters()
            var cor = img.set(
                {
                    left: obj.left,
                    top: obj.top,
                    selectable: obj.selectable,

                })
            canvas.add(img);
            if(obj.logo){
                fabric.Image.fromObject(obj.logo,function (logo) {
                    canvas.add(logo);
                })

            }
            if(obj.text){
                fabric.Textbox.fromObject(obj.text,function (text) {
                    canvas.add(text);
                })

            }

        }, {crossOrigin: 'anonymous'})
    }

    const handleInput = event => {
        setName(event.target.value);
    };

    const handleImage = event => {
        setImage(event.target.files[0])
    }

    const textShow = (text) => {
        console.log(text)
        var text = new fabric.Textbox(name, {
            fontFamily: 'Pacifico',
            fontSize: 20,
            top: 120,
            left: 130,
            fill: "#00ffff",
            visible: true,
            fontWeight: "bold",
        });
        console.log(text)
        localStorage.setItem(text, JSON.stringify(text))
        canvas.add(text);

        if (selectedComponentId) {
            var obj = JSON.parse(localStorage.getItem(selectedComponentId))
            obj.text = text
            localStorage.setItem(selectedComponentId, JSON.stringify(obj))
            addingComponent = 'text';
        }
    }

    canvas?.on('after:render', function () {
        var ao = canvas.getActiveObject();
        if (ao) {
            var bound = ao.getBoundingRect();
            console.log(bound.scaleY)
            if (addingComponent !== null) {
                if (addingComponent === 'logo') {
                    if (selectedComponentId) {
                        var obj = JSON.parse(localStorage.getItem(selectedComponentId))
                        obj.logo.left = bound.left
                        obj.logo.top = bound.top

                        fabric.Image.fromObject(obj.logo, function (test) {
                            test.scaleToHeight(bound.height)
                            test.scaleToWidth(bound.width);
                            obj.logo.scaleY = test.scaleY
                            obj.logo.scaleX = test.scaleX
                            localStorage.setItem(selectedComponentId, JSON.stringify(obj))

                        })

                        // obj.logo.height = bound.height
                        // obj.logo.width = bound.width
                        // obj.logo.scaleX= 2/bound.height
                        // obj.logo.scaleY= 2/bound.width
                        // localStorage.setItem(selectedComponentId, JSON.stringify(obj))
                    }
                } else if (addingComponent === 'text') {
                    if (selectedComponentId) {
                        var text = JSON.parse(localStorage.getItem(selectedComponentId))

                        text.text.left = bound.left
                        text.text.top = bound.top
                        localStorage.setItem(selectedComponentId, JSON.stringify(text))
                    }
                }
            }

        }
    });

    var changeFontStyle = function (font) {
        // document.getElementById("output-text")
        //              .style.fontWeight = "italic";
    }

    const preloadImge = (url, imageId, left, top) => {

        fabric.Image.fromURL(url, function (img) {
            img.id = imageId;
            img.filters = [new fabric.Image.filters.HueRotation()];
            img.applyFilters()
            var cor = img.set(
                {
                    left: left,
                    top: top,
                    selectable: false,

                })
            localStorage.setItem(imageId, JSON.stringify(img));
        }, {crossOrigin: 'anonymous'})

    }

    const loadImage = (url, imageId, left, top) => {

        fabric.Image.fromURL(url, function (img) {
            img.id = imageId;
            img.filters = [new fabric.Image.filters.HueRotation()];
            img.applyFilters()
            var cor = img.set(
                {
                    left: left,
                    top: top,
                    selectable: false,


                })
            console.log(imageId)
            localStorage.setItem(imageId, JSON.stringify(img));
            canvas.add(img);
            // canvas.centerObject(img)

        }, {crossOrigin: 'anonymous'})

    }

    // const loadSample = (url, imgId, left, top) => {
    //     fabric.Image.fromURL(url, function(sample_img){
    //         sample_img.id = imgId;
    //         var sam = sample_img.set({
    //             left: left,
    //             top: top,
    //             selectable: false,
    //         })
    //             image.add(sample_img);
    //     },{crossOrigin: 'anonymous'})
    // }

    const addColor = () => {
        if (selectedComponentId === 'left_v_upper_part') {
            var obj = JSON.parse(localStorage.getItem('right_sleeve'))
            loadObject(obj)
            var obj = JSON.parse(localStorage.getItem('left_sleeve'))
            loadObject(obj)
        } else {
            var obj = JSON.parse(localStorage.getItem(selectedComponentId))
            loadObject(obj)
        }
    }
    const handleChangeComplete = (color) => {
        console.log(selectedComponentId, "selectedID")
        if (selectedComponentId === 'cap_left') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('cap_left'))
            obj.color = color
            localStorage.setItem('cap_left', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('cap_left')))


            var obj = JSON.parse(localStorage.getItem('cap_left_back'))
            obj.color = color
            localStorage.setItem('cap_left_back', JSON.stringify(obj))


        }

        else if (selectedComponentId === 'cap_right') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('cap_right'))
            obj.color = color
            localStorage.setItem('cap_right', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('cap_right')))


            var obj = JSON.parse(localStorage.getItem('cap_right_back'))
            obj.color = color
            localStorage.setItem('cap_right_back', JSON.stringify(obj))
        }



        else if (selectedComponentId === 'hood_left_sleeve_top') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_right_sleeve_top'))
            obj.color = color
            localStorage.setItem('hood_right_sleeve_top', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_right_sleeve_top')))


            var obj = JSON.parse(localStorage.getItem('hood_left_sleeve_top_back'))
            obj.color = color
            localStorage.setItem('hood_left_sleeve_top_back', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('mid_top_hoodie_left'))
            obj.color = color
            localStorage.setItem('mid_top_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('left_top_hoodie_left'))
            obj.color = color
            localStorage.setItem('left_top_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_top_hoodie_left'))
            obj.color = color
            localStorage.setItem('right_top_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('bottom_top_hoodie_left'))
            obj.color = color
            localStorage.setItem('bottom_top_hoodie_left', JSON.stringify(obj))
        }

        else if (selectedComponentId === 'hood_left_sleeve_mid') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_right_sleeve_mid'))
            obj.color = color
            localStorage.setItem('hood_right_sleeve_mid', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_right_sleeve_mid')))


            var obj = JSON.parse(localStorage.getItem('hood_left_sleeve_mid_back'))
            obj.color = color
            localStorage.setItem('hood_left_sleeve_mid_back', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('mid_bottom_hoodie_left'))
            obj.color = color
            localStorage.setItem('mid_bottom_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('left_mid_hoodie_left'))
            obj.color = color
            localStorage.setItem('left_mid_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_mid_hoodie_left'))
            obj.color = color
            localStorage.setItem('right_mid_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('bottom_full_body_hoodie_left'))
            obj.color = color
            localStorage.setItem('bottom_full_body_hoodie_left', JSON.stringify(obj))

        }

        else if (selectedComponentId === 'hood_left_sleeve_bottom') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_right_sleeve_bottom'))
            obj.color = color
            localStorage.setItem('hood_right_sleeve_bottom', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_right_sleeve_bottom')))


            var obj = JSON.parse(localStorage.getItem('hood_left_sleeve_bottom_back'))
            obj.color = color
            localStorage.setItem('hood_left_sleeve_bottom_back', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('left_bottom_hoodie_left'))
            obj.color = color
            localStorage.setItem('left_bottom_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_bottom_hoodie_left'))
            obj.color = color
            localStorage.setItem('right_bottom_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('bottom_mid_hoodie_left'))
            obj.color = color
            localStorage.setItem('bottom_mid_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('bottom_bottom_hoodie_left'))
            obj.color = color
            localStorage.setItem('bottom_bottom_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('bottom_mid_hoodie_left'))
            obj.color = color
            localStorage.setItem('bottom_mid_hoodie_left', JSON.stringify(obj))

            // var obj = JSON.parse(localStorage.getItem('bottom_bottom_hoodie_left'))
            // obj.color = color
            // localStorage.setItem('bottom_bottom_hoodie_left', JSON.stringify(obj))

            // var obj = JSON.parse(localStorage.getItem('bottom_mid_hoodie_left'))
            // obj.color = color
            // localStorage.setItem('bottom_mid_hoodie_left', JSON.stringify(obj))
            //
            // var obj = JSON.parse(localStorage.getItem('bottom_bottom_hoodie_left'))
            // obj.color = color
            // localStorage.setItem('bottom_bottom_hoodie_left', JSON.stringify(obj))
        }

        else if (selectedComponentId === 'hood_left_sleeve_cuff') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_right_sleeve_cuff'))
            obj.color = color
            localStorage.setItem('hood_right_sleeve_cuff', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_right_sleeve_cuff')))

            var obj = JSON.parse(localStorage.getItem('hood_left_sleeve_cuff_back'))
            obj.color = color
            localStorage.setItem('hood_left_sleeve_cuff_back', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('mid_cuff_hoodie_left'))
            obj.color = color
            localStorage.setItem('mid_cuff_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('left_cuff_hoodie_left'))
            obj.color = color
            localStorage.setItem('left_cuff_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_cuff_hoodie_left'))
            obj.color = color
            localStorage.setItem('right_cuff_hoodie_left', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('bottom_cuff_hoodie_left'))
            obj.color = color
            localStorage.setItem('bottom_cuff_hoodie_left', JSON.stringify(obj))
        }


        else if (selectedComponentId === 'hood_right_sleeve_top') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_left_sleeve_top'))
            obj.color = color
            localStorage.setItem('hood_left_sleeve_top', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_left_sleeve_top')))


            var obj = JSON.parse(localStorage.getItem('hood_right_sleeve_top_back'))
            obj.color = color
            localStorage.setItem('hood_right_sleeve_top_back', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('mid_top_hoodie_right'))
            obj.color = color
            localStorage.setItem('mid_top_hoodie_right', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('left_top_hoodie_right'))
            obj.color = color
            localStorage.setItem('left_top_hoodie_right', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_top_hoodie_right'))
            obj.color = color
            localStorage.setItem('right_top_hoodie_right', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('bottom_top_hoodie_right'))
            obj.color = color
            localStorage.setItem('bottom_top_hoodie_right', JSON.stringify(obj))
        }

        else if (selectedComponentId === 'hood_right_sleeve_mid') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_left_sleeve_bottom'))
            obj.color = color
            localStorage.setItem('hood_left_sleeve_bottom', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_left_sleeve_bottom')))


            var obj = JSON.parse(localStorage.getItem('hood_right_sleeve_mid_back'))
            obj.color = color
            localStorage.setItem('hood_right_sleeve_mid_back', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('mid_bottom_hoodie_right'))
            obj.color = color
            localStorage.setItem('mid_bottom_hoodie_right', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('left_mid_hoodie_right'))
            obj.color = color
            localStorage.setItem('left_mid_hoodie_right', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_mid_hoodie_right'))
            obj.color = color
            localStorage.setItem('right_mid_hoodie_right', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('bottom_mid_hoodie_right'))
            obj.color = color
            localStorage.setItem('bottom_mid_hoodie_right', JSON.stringify(obj))

        }

        else if (selectedComponentId === 'hood_right_sleeve_bottom') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_left_sleeve_mid'))
            obj.color = color
            localStorage.setItem('hood_left_sleeve_mid', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_left_sleeve_mid')))


            var obj = JSON.parse(localStorage.getItem('hood_right_sleeve_bottom_back'))
            obj.color = color
            localStorage.setItem('hood_right_sleeve_bottom_back', JSON.stringify(obj))
            //
            var obj = JSON.parse(localStorage.getItem('left_bottom_hoodie_right'))
            obj.color = color
            localStorage.setItem('left_bottom_hoodie_right', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_bottom_hoodie_right'))
            obj.color = color
            localStorage.setItem('right_bottom_hoodie_right', JSON.stringify(obj))

            // var obj = JSON.parse(localStorage.getItem('bottom_mid_hoodie_right'))
            // obj.color = color
            // localStorage.setItem('bottom_mid_hoodie_right', JSON.stringify(obj))

            // var obj = JSON.parse(localStorage.getItem('bottom_bottom_hoodie_right'))
            // obj.color = color
            // localStorage.setItem('bottom_bottom_hoodie_right', JSON.stringify(obj))
            //
            var obj = JSON.parse(localStorage.getItem('bottom_full_body_hoodie_right'))
            obj.color = color
            localStorage.setItem('bottom_full_body_hoodie_right', JSON.stringify(obj))
            // //
            var obj = JSON.parse(localStorage.getItem('bottom_bottom_hoodie_left'))
            obj.color = color
            localStorage.setItem('bottom_bottom_hoodie_left', JSON.stringify(obj))
            //
            // var obj = JSON.parse(localStorage.getItem('bottom_mid_hoodie_right'))
            // obj.color = color
            // localStorage.setItem('bottom_mid_hoodie_right', JSON.stringify(obj))
            //
            var obj = JSON.parse(localStorage.getItem('bottom_bottom_hoodie_right'))
            obj.color = color
            localStorage.setItem('bottom_bottom_hoodie_right', JSON.stringify(obj))
        }

        else if (selectedComponentId === 'hood_right_sleeve_cuff') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_left_sleeve_cuff'))
            obj.color = color
            localStorage.setItem('hood_left_sleeve_cuff', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_left_sleeve_cuff')))

            var obj = JSON.parse(localStorage.getItem('hood_right_sleeve_cuff_back'))
            obj.color = color
            localStorage.setItem('hood_right_sleeve_cuff_back', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('mid_cuff_hoodie_right'))
            obj.color = color
            localStorage.setItem('mid_cuff_hoodie_right', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('left_cuff_hoodie_right'))
            obj.color = color
            localStorage.setItem('left_cuff_hoodie_right', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_cuff_hoodie_right'))
            obj.color = color
            localStorage.setItem('right_cuff_hoodie_right', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('bottom_cuff_hoodie_right'))
            obj.color = color
            localStorage.setItem('bottom_cuff_hoodie_right', JSON.stringify(obj))
        }


        else if (selectedComponentId === 'hood_bottom_left') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_bottom_right'))
            obj.color = color
            localStorage.setItem('hood_bottom_right', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_bottom_right')))


            var obj = JSON.parse(localStorage.getItem('hood_bottom_left_back'))
            obj.color = color
            localStorage.setItem('hood_bottom_left_back', JSON.stringify(obj))
        }

        else if (selectedComponentId === 'hood_bottom_right') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_bottom_left'))
            obj.color = color
            localStorage.setItem('hood_bottom_left', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_bottom_left')))


            var obj = JSON.parse(localStorage.getItem('hood_bottom_right_back'))
            obj.color = color
            localStorage.setItem('hood_bottom_right_back', JSON.stringify(obj))
        }


        else if (selectedComponentId === 'hood_hem_left') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('hood_hem_left'))
            obj.color = color
            localStorage.setItem('hood_hem_left', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('hood_hem_left')))

            var obj = JSON.parse(localStorage.getItem('hood_hem_back'))
            obj.color = color
            localStorage.setItem('hood_hem_back', JSON.stringify(obj))
        }

        // else if (selectedComponentId === 'hood_right_sleeve_top') {
        //
        //     setColor(color)
        //
        //     var obj = JSON.parse(localStorage.getItem('hood_left_sleeve_top'))
        //     obj.color = color
        //     localStorage.setItem('hood_left_sleeve_top', JSON.stringify(obj))
        //     loadObject(JSON.parse(localStorage.getItem('hood_left_sleeve_top')))
        //
        //
        //     var obj = JSON.parse(localStorage.getItem('hood_right_sleeve_top_back'))
        //     obj.color = color
        //     localStorage.setItem('hood_right_sleeve_top_back', JSON.stringify(obj))
        //
        //     var obj = JSON.parse(localStorage.getItem('mid_top_hoodie_right'))
        //     obj.color = color
        //     localStorage.setItem('mid_top_hoodie_right', JSON.stringify(obj))
        //
        //     var obj = JSON.parse(localStorage.getItem('left_top_hoodie_right'))
        //     obj.color = color
        //     localStorage.setItem('left_top_hoodie_right', JSON.stringify(obj))
        //
        //     var obj = JSON.parse(localStorage.getItem('right_top_hoodie_right'))
        //     obj.color = color
        //     localStorage.setItem('right_top_hoodie_right', JSON.stringify(obj))
        //
        //     var obj = JSON.parse(localStorage.getItem('bottom_top_hoodie_right'))
        //     obj.color = color
        //     localStorage.setItem('bottom_top_hoodie_right', JSON.stringify(obj))
        // }

        else {
            if (selectedComponentId) {
                var obj = JSON.parse(localStorage.getItem(selectedComponentId))
                // debugger;
                console.log("Color_object", obj)
                obj.color = color
                localStorage.setItem(selectedComponentId, JSON.stringify(obj))
            }
            setColor(color)
            addColor()
            console.log("else Part")
        }


    };
    const onComponentClick = (componentId) => {
        setSelectedComponentId(componentId)

        // setColor()
        setColorShow(true)
    }

    const load_logo = (l) => {
        // var samImg = new Image();
        // samImg.onload = function (imge) {
        //     var pug = new fabric.Image(samImg, {
        //         id: "imageID",
        //         width: samImg.width,
        //         height: samImg.height,
        //         scaleX: 60 / samImg.width,
        //         scaleY: 60 / samImg.height,
        //         top: 120,
        //         left: 130,
        //         innerWidth: 200,
        //         innerHeight: 200,
        //
        //     });
        //     canvas.add(pug);
        // };
        //
        // samImg.src = l;


        fabric.Image.fromURL(l, function (img) {
            var cor = img.set(
                {

                    scaleX: 40 / 200,
                    scaleY: 40 / 200,
                    top: 120,
                    left: 130,
                    selectable: true,


                })
            canvas.add(img);
            if (selectedComponentId) {
                var obj = JSON.parse(localStorage.getItem(selectedComponentId))

                obj.logo = img
                localStorage.setItem(selectedComponentId, JSON.stringify(obj))
                addingComponent = 'logo';
            }

        }, {crossOrigin: 'anonymous'})
    }


    const load_sleeve_logo = (l) => {

        var samImg = new Image();
        samImg.onload = function (imge) {
            var pug = new fabric.Image(samImg, {
                id: "imageID",
                width: samImg.width,
                height: samImg.height,
                scaleX: 60 / samImg.width,
                scaleY: 60 / samImg.height,
                top: 120,
                left: 130,
                innerWidth: 200,
                innerHeight: 200,

            });
            canvas.add(pug);
        };

        samImg.src = l;

        var l_logo = new Image();
        l_logo.onload = function (left_logo) {
            var left = new fabric.Image(l_logo, {
                id: "image_left_logo",
                width: l_logo.width / 2,
                height: l_logo.height,
                scaleX: 30 / samImg.width,
                scaleY: 30 / samImg.height,
                angle: 30,
                flipX: true,
                top: 46,
                left: 69,
                selectable: false,
            });
            canvas.add(left);
        }
        l_logo.src = l;

        var r_logo = new Image();
        r_logo.onload = function (left_logo) {
            var right = new fabric.Image(r_logo, {
                id: "image_left_logo",
                width: r_logo.width / 2,
                height: r_logo.height,
                scaleX: 30 / samImg.width,
                scaleY: 30 / samImg.height,
                angle: -30,
                top: 56,
                left: 224,
                selectable: false,
            });
            canvas.add(right);
        }
        r_logo.src = l;
    }

    console.log(img, "222")

    // function download_Image() {
    //     var canvas = document.getElementById("canv");
    //     var image = canvas.toDataURL("image/png", 1.0).replace("image/svg", "image/octet-stream");
    //     var link = document.createElement('a');
    //     link.download = "Your_Product_Design.svg";
    //     link.href = image;
    //     link.click();
    // }

    function preFrontImageLoad() {
        let front_view_hoodie = JSON.parse(localStorage.getItem('front_view_hoodie'))
        if (front_view_hoodie.cap_left?.image) {

                loadImage(front_view_hoodie.cap_left.image, 'cap_left',
                    front_view_hoodie.cap_left.x_point,
                    front_view_hoodie.cap_left.y_point)

        }
        if (front_view_hoodie.cap_right?.image) {

                loadImage(front_view_hoodie.cap_right.image,
                    'cap_right',
                    front_view_hoodie.cap_right.x_point, front_view_hoodie.cap_right.y_point)

        }
        if (front_view_hoodie.cap_inner_mid?.image) {

                loadImage(front_view_hoodie.cap_inner_mid.image,
                    'cap_inner_mid', front_view_hoodie.cap_inner_mid.x_point,
                    front_view_hoodie.cap_inner_mid.y_point)
        }
        if (front_view_hoodie.cap_inner_left?.image) {

                loadImage(front_view_hoodie.cap_inner_left.image,
                    'cap_inner_left', front_view_hoodie.cap_inner_left.x_point,
                    front_view_hoodie.cap_inner_left.y_point)

        }
        if (front_view_hoodie.cap_inner_right?.image) {

                loadImage(front_view_hoodie.cap_inner_right.image,
                    'cap_inner_right', front_view_hoodie.cap_inner_right.x_point,
                    front_view_hoodie.cap_inner_right.y_point)

        }

        if (front_view_hoodie.cap_inner_bottom?.image) {

                loadImage(front_view_hoodie.cap_inner_bottom.image,
                    'cap_inner_bottom', front_view_hoodie.cap_inner_bottom.x_point,
                    front_view_hoodie.cap_inner_bottom.y_point)


        }

        if (front_view_hoodie.hood_top?.image) {

                loadImage(front_view_hoodie.hood_top.image,
                    'hood_top',
                    front_view_hoodie.hood_top.x_point,
                    front_view_hoodie.hood_top.y_point)


        }

        if (front_view_hoodie.hood_top_left?.image) {

                loadImage(front_view_hoodie.hood_top_left.image,
                    'hood_top_left',
                    front_view_hoodie.hood_top_left.x_point,
                    front_view_hoodie.hood_top_left.y_point)
        }

        if (front_view_hoodie.hood_top_right?.image) {

                loadImage(front_view_hoodie.hood_top_right.image,
                    'hood_top_right',
                    front_view_hoodie.hood_top_right.x_point,
                    front_view_hoodie.hood_top_right.y_point)

        }

        if (front_view_hoodie.hood_left_strip?.image) {

                loadImage(front_view_hoodie.hood_left_strip.image,
                    'hood_left_strip',
                    front_view_hoodie.hood_left_strip.x_point,
                    front_view_hoodie.hood_left_strip.y_point)

        }

        if (front_view_hoodie.hood_right_strip?.image) {

                loadImage(front_view_hoodie.hood_right_strip.image,
                    'hood_right_strip',
                    front_view_hoodie.hood_right_strip.x_point,
                    front_view_hoodie.hood_right_strip.y_point)


        }

        if (front_view_hoodie.hood_mid?.image) {

                loadImage(front_view_hoodie.hood_mid.image,
                    'hood_mid',
                    front_view_hoodie.hood_mid.x_point,
                    front_view_hoodie.hood_mid.y_point)

        }

        if (front_view_hoodie.hood_mid_left?.image) {

                loadImage(front_view_hoodie.hood_mid_left.image,
                    'hood_mid_left',
                    front_view_hoodie.hood_mid_left.x_point,
                    front_view_hoodie.hood_mid_left.y_point)

        }

        if (front_view_hoodie.hood_mid_right?.image) {

                loadImage(front_view_hoodie.hood_mid_right.image,
                    'hood_mid_right',
                    front_view_hoodie.hood_mid_right.x_point,
                    front_view_hoodie.hood_mid_right.y_point)

        }

        if (front_view_hoodie.hood_bottom?.image) {

                loadImage(front_view_hoodie.hood_bottom.image,
                    'hood_bottom',
                    front_view_hoodie.hood_bottom.x_point,
                    front_view_hoodie.hood_bottom.y_point)

        }

        if (front_view_hoodie.hood_bottom_left?.image) {

                loadImage(front_view_hoodie.hood_bottom_left.image,
                    'hood_bottom_left',
                    front_view_hoodie.hood_bottom_left.x_point,
                    front_view_hoodie.hood_bottom_left.y_point)

        }

        if (front_view_hoodie.hood_bottom_right?.image) {

                loadImage(front_view_hoodie.hood_bottom_right.image,
                    'hood_bottom_right',
                    front_view_hoodie.hood_bottom_right.x_point,
                    front_view_hoodie.hood_bottom_right.y_point)

        }

        if (front_view_hoodie.hood_hem_left?.image) {

                loadImage(front_view_hoodie.hood_hem_left.image,
                    'hood_hem_left',
                    front_view_hoodie.hood_hem_left.x_point,
                    front_view_hoodie.hood_hem_left.y_point)

        }

        if (front_view_hoodie.hood_hem_right?.image) {

                loadImage(front_view_hoodie.hood_hem_right.image,
                    'hood_hem_right',
                    front_view_hoodie.hood_hem_right.x_point,
                    front_view_hoodie.hood_hem_right.y_point)

        }

        if (front_view_hoodie.zip?.image) {

                loadImage(front_view_hoodie.zip.image,
                    'zip',
                    front_view_hoodie.zip.x_point,
                    front_view_hoodie.zip.y_point)

        }

        if (front_view_hoodie.hood_left_sleeve_full?.image) {

                loadImage(front_view_hoodie.hood_left_sleeve_full.image,
                    'hood_left_sleeve_full',
                    front_view_hoodie.hood_left_sleeve_full.x_point,
                    front_view_hoodie.hood_left_sleeve_full.y_point)

        }

        if (front_view_hoodie.hood_left_sleeve_top?.image) {

                loadImage(front_view_hoodie.hood_left_sleeve_top.image,
                    'hood_left_sleeve_top',
                    front_view_hoodie.hood_left_sleeve_top.x_point,
                    front_view_hoodie.hood_left_sleeve_top.y_point)

        }

        if (front_view_hoodie.hood_left_sleeve_mid?.image) {

                loadImage(front_view_hoodie.hood_left_sleeve_mid.image,
                    'hood_left_sleeve_mid',
                    front_view_hoodie.hood_left_sleeve_mid.x_point,
                    front_view_hoodie.hood_left_sleeve_mid.y_point)

        }

        if (front_view_hoodie.hood_left_sleeve_bottom?.image) {

                loadImage(front_view_hoodie.hood_left_sleeve_bottom.image,
                    'hood_left_sleeve_bottom',
                    front_view_hoodie.hood_left_sleeve_bottom.x_point,
                    front_view_hoodie.hood_left_sleeve_bottom.y_point)

        }

        if (front_view_hoodie.hood_left_sleeve_cuff?.image) {

                loadImage(front_view_hoodie.hood_left_sleeve_cuff.image,
                    'hood_left_sleeve_cuff',
                    front_view_hoodie.hood_left_sleeve_cuff.x_point,
                    front_view_hoodie.hood_left_sleeve_cuff.y_point)

        }

        if (front_view_hoodie.hood_left_sleeve_cuff_strips?.image) {

                loadImage(front_view_hoodie.hood_left_sleeve_cuff_strips.image,
                    'hood_left_sleeve_cuff_strips',
                    front_view_hoodie.hood_left_sleeve_cuff_strips.x_point,
                    front_view_hoodie.hood_left_sleeve_cuff_strips.y_point)

        }

        if (front_view_hoodie.hood_right_sleeve_full?.image) {

                loadImage(front_view_hoodie.hood_right_sleeve_full.image,
                    'hood_right_sleeve_full',
                    front_view_hoodie.hood_right_sleeve_full.x_point,
                    front_view_hoodie.hood_right_sleeve_full.y_point)

        }

        if (front_view_hoodie.hood_right_sleeve_top?.image) {

                loadImage(front_view_hoodie.hood_right_sleeve_top.image,
                    'hood_right_sleeve_top',
                    front_view_hoodie.hood_right_sleeve_top.x_point,
                    front_view_hoodie.hood_right_sleeve_top.y_point)

        }

        if (front_view_hoodie.hood_right_sleeve_mid?.image) {

                loadImage(front_view_hoodie.hood_right_sleeve_mid.image,
                    'hood_right_sleeve_mid',
                    front_view_hoodie.hood_right_sleeve_mid.x_point,
                    front_view_hoodie.hood_right_sleeve_mid.y_point)

        }

        if (front_view_hoodie.hood_right_sleeve_bottom?.image) {

                loadImage(front_view_hoodie.hood_right_sleeve_bottom.image,
                    'hood_right_sleeve_bottom',
                    front_view_hoodie.hood_right_sleeve_bottom.x_point,
                    front_view_hoodie.hood_right_sleeve_bottom.y_point)

        }

        if (front_view_hoodie.hood_right_sleeve_cuff?.image) {

                loadImage(front_view_hoodie.hood_right_sleeve_cuff.image,
                    'hood_right_sleeve_cuff',
                    front_view_hoodie.hood_right_sleeve_cuff.x_point,
                    front_view_hoodie.hood_right_sleeve_cuff.y_point)

        }

        if (front_view_hoodie.hood_right_sleeve_cuff_strips?.image) {

                loadImage(front_view_hoodie.hood_right_sleeve_cuff_strips.image,
                    'hood_right_sleeve_cuff_strips',
                    front_view_hoodie.hood_right_sleeve_cuff_strips.x_point,
                    front_view_hoodie.hood_right_sleeve_cuff_strips.y_point)
        }
    }

    function frontImageLoad() {
        clearCanvas()
        let front_view_hoodie = JSON.parse(localStorage.getItem('front_view_hoodie'))
        if (front_view_hoodie.cap_left?.image) {
            var cap_left=JSON.parse(localStorage.getItem('cap_left'))
            if (cap_left) {
                loadObject(cap_left)

            }

        }
        if (front_view_hoodie.cap_right?.image) {
            var cap_right=JSON.parse(localStorage.getItem('cap_right'))
            if (cap_right) {
                loadObject(cap_right)

            }
        }
        if (front_view_hoodie.cap_inner_mid?.image) {
            var cap_inner_mid=JSON.parse(localStorage.getItem('cap_inner_mid'))
            if (cap_inner_mid) {
                loadObject(cap_inner_mid)

            }
        }
        if (front_view_hoodie.cap_inner_left?.image) {
            var cap_inner_left=JSON.parse(localStorage.getItem('cap_inner_left'))
            if (cap_inner_left) {
                loadObject(cap_inner_left)

            }
        }
        if (front_view_hoodie.cap_inner_right?.image) {
            var cap_inner_right=JSON.parse(localStorage.getItem('cap_inner_right'))
            if (cap_inner_right) {
                loadObject(cap_inner_right)

            }
        }

        if (front_view_hoodie.cap_inner_bottom?.image) {
            var cap_inner_bottom=JSON.parse(localStorage.getItem('cap_inner_bottom'))
            if (cap_inner_bottom) {
                loadObject(cap_inner_bottom)

            }
        }

        if (front_view_hoodie.hood_top?.image) {
            var hood_top=JSON.parse(localStorage.getItem('hood_top'))
            if (hood_top) {
                loadObject(hood_top)

            }

        }

        if (front_view_hoodie.hood_top_left?.image) {
            var hood_top_left=JSON.parse(localStorage.getItem('hood_top_left'))
            if (hood_top_left) {
                loadObject(hood_top_left)

            }

        }

        if (front_view_hoodie.hood_top_right?.image) {
            var hood_top_right=JSON.parse(localStorage.getItem('hood_top_right'))
            if (hood_top_right) {
                loadObject(hood_top_right)

            }

        }

        if (front_view_hoodie.hood_left_strip?.image) {
            var hood_left_strip=JSON.parse(localStorage.getItem('hood_left_strip'))
            if (hood_left_strip) {
                loadObject(hood_left_strip)

            }

        }

        if (front_view_hoodie.hood_right_strip?.image) {
            var hood_right_strip=JSON.parse(localStorage.getItem('hood_right_strip'))
            if (hood_right_strip) {
                loadObject(hood_right_strip)

            }

        }

        if (front_view_hoodie.hood_mid?.image) {
            var hood_mid=JSON.parse(localStorage.getItem('hood_mid'))
            if (hood_mid) {
                loadObject(hood_mid)

            }

        }

        if (front_view_hoodie.hood_mid_left?.image) {
            var hood_mid_left=JSON.parse(localStorage.getItem('hood_mid_left'))
            if (hood_mid_left) {
                loadObject(hood_mid_left)

            }

        }

        if (front_view_hoodie.hood_mid_right?.image) {
            var hood_mid_right=JSON.parse(localStorage.getItem('hood_mid_right'))
            if (hood_mid_right) {
                loadObject(hood_mid_right)

            }

        }

        if (front_view_hoodie.hood_bottom?.image) {
            var hood_bottom=JSON.parse(localStorage.getItem('hood_bottom'))
            if (hood_bottom) {
                loadObject(hood_bottom)

            }

        }

        if (front_view_hoodie.hood_bottom_left?.image) {
            var hood_bottom_left=JSON.parse(localStorage.getItem('hood_bottom_left'))
            if (hood_bottom_left) {
                loadObject(hood_bottom_left)

            }

        }

        if (front_view_hoodie.hood_bottom_right?.image) {
            var hood_bottom_right=JSON.parse(localStorage.getItem('hood_bottom_right'))
            if (hood_bottom_right) {
                loadObject(hood_bottom_right)

            }

        }

        if (front_view_hoodie.hood_hem_left?.image) {
            var hood_hem_left=JSON.parse(localStorage.getItem('hood_hem_left'))
            if (hood_hem_left) {
                loadObject(hood_hem_left)

            }

        }

        if (front_view_hoodie.hood_hem_right?.image) {
            var hood_hem_right=JSON.parse(localStorage.getItem('hood_hem_right'))
            if (hood_hem_right) {
                loadObject(hood_hem_right)

            }

        }

        if (front_view_hoodie.zip?.image) {
            var zip=JSON.parse(localStorage.getItem('zip'))
            if (zip) {
                loadObject(zip)

            }

        }

        if (front_view_hoodie.hood_left_sleeve_full?.image) {
            var hood_left_sleeve_full=JSON.parse(localStorage.getItem('hood_left_sleeve_full'))
            if (hood_left_sleeve_full) {
                loadObject(hood_left_sleeve_full)

            }

        }

        if (front_view_hoodie.hood_left_sleeve_top?.image) {
            var hood_left_sleeve_top=JSON.parse(localStorage.getItem('hood_left_sleeve_top'))
            if (hood_left_sleeve_top) {
                loadObject(hood_left_sleeve_top)

            }

        }

        if (front_view_hoodie.hood_left_sleeve_mid?.image) {
            var hood_left_sleeve_mid=JSON.parse(localStorage.getItem('hood_left_sleeve_mid'))
            if (hood_left_sleeve_mid) {
                loadObject(hood_left_sleeve_mid)

            }

        }

        if (front_view_hoodie.hood_left_sleeve_bottom?.image) {
            var hood_left_sleeve_bottom=JSON.parse(localStorage.getItem('hood_left_sleeve_bottom'))
            if (hood_left_sleeve_bottom) {
                loadObject(hood_left_sleeve_bottom)

            }

        }

        if (front_view_hoodie.hood_left_sleeve_cuff?.image) {
            var hood_left_sleeve_cuff=JSON.parse(localStorage.getItem('hood_left_sleeve_cuff'))
            if (hood_left_sleeve_cuff) {
                loadObject(hood_left_sleeve_cuff)

            }

        }

        if (front_view_hoodie.hood_left_sleeve_cuff_strips?.image) {
            var hood_left_sleeve_cuff_strips=JSON.parse(localStorage.getItem('hood_left_sleeve_cuff_strips'))
            if (hood_left_sleeve_cuff_strips) {
                loadObject(hood_left_sleeve_cuff_strips)

            }

        }

        if (front_view_hoodie.hood_right_sleeve_full?.image) {
            var hood_right_sleeve_full=JSON.parse(localStorage.getItem('hood_right_sleeve_full'))
            if (hood_right_sleeve_full) {
                loadObject(hood_right_sleeve_full)

            }

        }

        if (front_view_hoodie.hood_right_sleeve_top?.image) {
            var hood_right_sleeve_top=JSON.parse(localStorage.getItem('hood_right_sleeve_top'))
            if (hood_right_sleeve_top) {
                loadObject(hood_right_sleeve_top)

            }

        }

        if (front_view_hoodie.hood_right_sleeve_mid?.image) {
            var hood_right_sleeve_mid=JSON.parse(localStorage.getItem('hood_right_sleeve_mid'))
            if (hood_right_sleeve_mid) {
                loadObject(hood_right_sleeve_mid)

            }

        }

        if (front_view_hoodie.hood_right_sleeve_bottom?.image) {
            var hood_right_sleeve_bottom=JSON.parse(localStorage.getItem('hood_right_sleeve_bottom'))
            if (hood_right_sleeve_bottom) {
                loadObject(hood_right_sleeve_bottom)

            }

        }

        if (front_view_hoodie.hood_right_sleeve_cuff?.image) {
            var hood_right_sleeve_cuff=JSON.parse(localStorage.getItem('hood_right_sleeve_cuff'))
            if (hood_right_sleeve_cuff) {
                loadObject(hood_right_sleeve_cuff)

            }

        }

        if (front_view_hoodie.hood_right_sleeve_cuff_strips?.image) {
            var hood_right_sleeve_cuff_strips=JSON.parse(localStorage.getItem('hood_right_sleeve_cuff_strips'))
            if (hood_right_sleeve_cuff_strips) {
                loadObject(hood_right_sleeve_cuff_strips)

            }
        }
    }


    function prebackImageLoad() {
        let back_view_hoodie = JSON.parse(localStorage.getItem('back_view_hoodie'))
        if (back_view_hoodie.cap_left_back?.image) {

                preloadImge(
                    back_view_hoodie.cap_left_back.image,
                    'cap_left_back',
                    back_view_hoodie.cap_left_back.x_point,
                    back_view_hoodie.cap_left_back.y_point,
                )

        }

        if (back_view_hoodie.cap_right_back?.image) {

                preloadImge(
                    back_view_hoodie.cap_right_back.image,
                    'cap_right_back',
                    back_view_hoodie.cap_right_back.x_point,
                    back_view_hoodie.cap_right_back.y_point,
                )
        }

        if (back_view_hoodie.hood_top_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_top_back.image,
                    'hood_top_back',
                    back_view_hoodie.hood_top_back.x_point,
                    back_view_hoodie.hood_top_back.y_point,
                )
        }

        if (back_view_hoodie.hood_top_left_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_top_left_back.image,
                    'hood_top_left_back',
                    back_view_hoodie.hood_top_left_back.x_point,
                    back_view_hoodie.hood_top_left_back.y_point,
                )
        }

        if (back_view_hoodie.hood_top_right_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_top_right_back.image,
                    'hood_top_right_back',
                    back_view_hoodie.hood_top_right_back.x_point,
                    back_view_hoodie.hood_top_right_back.y_point,
                )
        }

        if (back_view_hoodie.hood_mid_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_mid_back.image,
                    'hood_mid_back',
                    back_view_hoodie.hood_mid_back.x_point,
                    back_view_hoodie.hood_mid_back.y_point,
                )
        }

        if (back_view_hoodie.hood_mid_left_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_mid_left_back.image,
                    'hood_mid_left_back',
                    back_view_hoodie.hood_mid_left_back.x_point,
                    back_view_hoodie.hood_mid_left_back.y_point,
                )
        }

        if (back_view_hoodie.hood_mid_right_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_mid_right_back.image,
                    'hood_mid_right_back',
                    back_view_hoodie.hood_mid_right_back.x_point,
                    back_view_hoodie.hood_mid_right_back.y_point,
                )
        }

        if (back_view_hoodie.hood_bottom_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_bottom_back.image,
                    'hood_bottom_back',
                    back_view_hoodie.hood_bottom_back.x_point,
                    back_view_hoodie.hood_bottom_back.y_point,
                )
        }

        if (back_view_hoodie.hood_hem_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_hem_back.image,
                    'hood_hem_back',
                    back_view_hoodie.hood_hem_back.x_point,
                    back_view_hoodie.hood_hem_back.y_point,
                )
        }

        if (back_view_hoodie.hood_left_sleeve_full_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_left_sleeve_full_back.image,
                    'hood_left_sleeve_full_back',
                    back_view_hoodie.hood_left_sleeve_full_back.x_point,
                    back_view_hoodie.hood_left_sleeve_full_back.y_point,
                )
        }

        if (back_view_hoodie.hood_left_sleeve_top_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_left_sleeve_top_back.image,
                    'hood_left_sleeve_top_back',
                    back_view_hoodie.hood_left_sleeve_top_back.x_point,
                    back_view_hoodie.hood_left_sleeve_top_back.y_point,
                )
        }

        if (back_view_hoodie.hood_left_sleeve_mid_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_left_sleeve_mid_back.image,
                    'hood_left_sleeve_mid_back',
                    back_view_hoodie.hood_left_sleeve_mid_back.x_point,
                    back_view_hoodie.hood_left_sleeve_mid_back.y_point,
                )
        }

        if (back_view_hoodie.hood_left_sleeve_bottom_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_left_sleeve_bottom_back.image,
                    'hood_left_sleeve_bottom_back',
                    back_view_hoodie.hood_left_sleeve_bottom_back.x_point,
                    back_view_hoodie.hood_left_sleeve_bottom_back.y_point,
                )
        }

        if (back_view_hoodie.hood_left_sleeve_cuff_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_left_sleeve_cuff_back.image,
                    'hood_left_sleeve_cuff_back',
                    back_view_hoodie.hood_left_sleeve_cuff_back.x_point,
                    back_view_hoodie.hood_left_sleeve_cuff_back.y_point,
                )
        }

        if (back_view_hoodie.hood_left_sleeve_cuff_strips_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_left_sleeve_cuff_strips_back.image,
                    'hood_left_sleeve_cuff_strips_back',
                    back_view_hoodie.hood_left_sleeve_cuff_strips_back.x_point,
                    back_view_hoodie.hood_left_sleeve_cuff_strips_back.y_point,
                )
        }

        if (back_view_hoodie.hood_right_sleeve_full_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_right_sleeve_full_back.image,
                    'hood_right_sleeve_full_back',
                    back_view_hoodie.hood_right_sleeve_full_back.x_point,
                    back_view_hoodie.hood_right_sleeve_full_back.y_point,
                )
        }

        if (back_view_hoodie.hood_right_sleeve_top_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_right_sleeve_top_back.image,
                    'hood_right_sleeve_top_back',
                    back_view_hoodie.hood_right_sleeve_top_back.x_point,
                    back_view_hoodie.hood_right_sleeve_top_back.y_point,
                )
        }

        if (back_view_hoodie.hood_right_sleeve_mid_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_right_sleeve_mid_back.image,
                    'hood_right_sleeve_mid_back',
                    back_view_hoodie.hood_right_sleeve_mid_back.x_point,
                    back_view_hoodie.hood_right_sleeve_mid_back.y_point,
                )
        }

        if (back_view_hoodie.hood_right_sleeve_bottom_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_right_sleeve_bottom_back.image,
                    'hood_right_sleeve_bottom_back',
                    back_view_hoodie.hood_right_sleeve_bottom_back.x_point,
                    back_view_hoodie.hood_right_sleeve_bottom_back.y_point,
                )
        }

        if (back_view_hoodie.hood_right_sleeve_bottom_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_right_sleeve_bottom_back.image,
                    'hood_right_sleeve_bottom_back',
                    back_view_hoodie.hood_right_sleeve_bottom_back.x_point,
                    back_view_hoodie.hood_right_sleeve_bottom_back.y_point,
                )
        }

        if (back_view_hoodie.hood_right_sleeve_cuff_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_right_sleeve_cuff_back.image,
                    'hood_right_sleeve_cuff_back',
                    back_view_hoodie.hood_right_sleeve_cuff_back.x_point,
                    back_view_hoodie.hood_right_sleeve_cuff_back.y_point,
                )
        }

        if (back_view_hoodie.hood_bottom_left_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_bottom_left_back.image,
                    'hood_bottom_left_back',
                    back_view_hoodie.hood_bottom_left_back.x_point,
                    back_view_hoodie.hood_bottom_left_back.y_point,
                    )
        }

        if (back_view_hoodie.hood_bottom_right_back?.image) {

                preloadImge(
                    back_view_hoodie.hood_bottom_right_back.image,
                    'hood_bottom_right_back',
                    back_view_hoodie.hood_bottom_right_back.x_point,
                    back_view_hoodie.hood_bottom_right_back.y_point,
                )
        }
    }

    function backImageLoad() {
        clearCanvas()
        let back_view_hoodie = JSON.parse(localStorage.getItem('back_view_hoodie'))
        if (back_view_hoodie.cap_left_back?.image) {
            var cap_left_back=JSON.parse(localStorage.getItem('cap_left_back'))
            if (cap_left_back) {
                loadObject(cap_left_back)
            }

        }

        if (back_view_hoodie.cap_right_back?.image) {
            var cap_right_back=JSON.parse(localStorage.getItem('cap_right_back'))
            if (cap_right_back) {
                loadObject(cap_right_back)
            }
        }

        if (back_view_hoodie.hood_top_back?.image) {
            var hood_top_back=JSON.parse(localStorage.getItem('hood_top_back'))
            if (hood_top_back) {
                loadObject(hood_top_back)
            }
        }

        if (back_view_hoodie.hood_top_left_back?.image) {
            var hood_top_left_back=JSON.parse(localStorage.getItem('hood_top_left_back'))
            if (hood_top_left_back) {
                loadObject(hood_top_left_back)
            }
        }

        if (back_view_hoodie.hood_top_right_back?.image) {
            var hood_top_right_back=JSON.parse(localStorage.getItem('hood_top_right_back'))
            if (hood_top_right_back) {
                loadObject(hood_top_right_back)
            }
        }

        if (back_view_hoodie.hood_mid_back?.image) {
            var hood_mid_back=JSON.parse(localStorage.getItem('hood_mid_back'))
            if (hood_mid_back) {
                loadObject(hood_mid_back)
            }
        }

        if (back_view_hoodie.hood_mid_left_back?.image) {
            var hood_mid_left_back=JSON.parse(localStorage.getItem('hood_mid_left_back'))
            if (hood_mid_left_back) {
                loadObject(hood_mid_left_back)
            }
        }

        if (back_view_hoodie.hood_mid_right_back?.image) {
            var hood_mid_right_back=JSON.parse(localStorage.getItem('hood_mid_right_back'))
            if (hood_mid_right_back) {
                loadObject(hood_mid_right_back)
            }
        }

        if (back_view_hoodie.hood_bottom_back?.image) {
            var hood_bottom_back=JSON.parse(localStorage.getItem('hood_bottom_back'))
            if (hood_bottom_back) {
                loadObject(hood_bottom_back)
            }
        }

        if (back_view_hoodie.hood_hem_back?.image) {
            var hood_hem_back=JSON.parse(localStorage.getItem('hood_hem_back'))
            if (hood_hem_back) {
                loadObject(hood_hem_back)
            }
        }

        if (back_view_hoodie.hood_left_sleeve_full_back?.image) {
            var hood_left_sleeve_full_back=JSON.parse(localStorage.getItem('hood_left_sleeve_full_back'))
            if (hood_left_sleeve_full_back) {
                loadObject(hood_left_sleeve_full_back)
            }
        }

        if (back_view_hoodie.hood_left_sleeve_top_back?.image) {
            var hood_left_sleeve_top_back=JSON.parse(localStorage.getItem('hood_left_sleeve_top_back'))
            if (hood_left_sleeve_top_back) {
                loadObject(hood_left_sleeve_top_back)
            }
        }

        if (back_view_hoodie.hood_left_sleeve_mid_back?.image) {
            var hood_left_sleeve_mid_back=JSON.parse(localStorage.getItem('hood_left_sleeve_mid_back'))
            if (hood_left_sleeve_mid_back) {
                loadObject(hood_left_sleeve_mid_back)
            }
        }

        if (back_view_hoodie.hood_left_sleeve_bottom_back?.image) {
            var hood_left_sleeve_bottom_back=JSON.parse(localStorage.getItem('hood_left_sleeve_bottom_back'))
            if (hood_left_sleeve_bottom_back) {
                loadObject(hood_left_sleeve_bottom_back)
            }
        }

        if (back_view_hoodie.hood_left_sleeve_cuff_back?.image) {
            var hood_left_sleeve_cuff_back=JSON.parse(localStorage.getItem('hood_left_sleeve_cuff_back'))
            if (hood_left_sleeve_cuff_back) {
                loadObject(hood_left_sleeve_cuff_back)
            }
        }

        if (back_view_hoodie.hood_left_sleeve_cuff_strips_back?.image) {
            var hood_left_sleeve_cuff_strips_back=JSON.parse(localStorage.getItem('hood_left_sleeve_cuff_strips_back'))
            if (hood_left_sleeve_cuff_strips_back) {
                loadObject(hood_left_sleeve_cuff_strips_back)
            }
        }

        if (back_view_hoodie.hood_right_sleeve_full_back?.image) {
            var hood_right_sleeve_top_back=JSON.parse(localStorage.getItem('hood_right_sleeve_top_back'))
            if (hood_right_sleeve_top_back) {
                loadObject(hood_right_sleeve_top_back)
            }
        }

        if (back_view_hoodie.hood_right_sleeve_top_back?.image) {
            var hood_right_sleeve_top_back=JSON.parse(localStorage.getItem('hood_right_sleeve_top_back'))
            if (hood_right_sleeve_top_back) {
                loadObject(hood_right_sleeve_top_back)
            }
        }

        if (back_view_hoodie.hood_right_sleeve_mid_back?.image) {
            var hood_right_sleeve_mid_back=JSON.parse(localStorage.getItem('hood_right_sleeve_mid_back'))
            if (hood_right_sleeve_mid_back) {
                loadObject(hood_right_sleeve_mid_back)
            }
        }

        if (back_view_hoodie.hood_right_sleeve_bottom_back?.image) {
            var hood_right_sleeve_bottom_back=JSON.parse(localStorage.getItem('hood_right_sleeve_bottom_back'))
            if (hood_right_sleeve_bottom_back) {
                loadObject(hood_right_sleeve_bottom_back)
            }
        }

        if (back_view_hoodie.hood_right_sleeve_bottom_back?.image) {
            var hood_right_sleeve_bottom_back=JSON.parse(localStorage.getItem('hood_right_sleeve_bottom_back'))
            if (hood_right_sleeve_bottom_back) {
                loadObject(hood_right_sleeve_bottom_back)
            }
        }

        if (back_view_hoodie.hood_right_sleeve_cuff_back?.image) {
            var hood_right_sleeve_cuff_back=JSON.parse(localStorage.getItem('hood_right_sleeve_cuff_back'))
            if (hood_right_sleeve_cuff_back) {
                loadObject(hood_right_sleeve_cuff_back)
            }
        }

        if (back_view_hoodie.hood_bottom_left_back?.image) {
            var hood_bottom_left_back=JSON.parse(localStorage.getItem('hood_bottom_left_back'))
            if (hood_bottom_left_back) {
                loadObject(hood_bottom_left_back)
            }
        }

        if (back_view_hoodie.hood_bottom_right_back?.image) {
            var hood_bottom_right_back=JSON.parse(localStorage.getItem('hood_bottom_right_back'))
            if (hood_bottom_right_back) {
                loadObject(hood_bottom_right_back)
            }
        }
    }


    const preleftImageLoad = (e) => {
        let left_view_hoodie = JSON.parse(localStorage.getItem('left_view_hoodie'))

        if (left_view_hoodie?.mid_full_body_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.mid_full_body_hoodie_left.image,
                    'mid_full_body_hoodie_left',
                    left_view_hoodie.mid_full_body_hoodie_left.x_point,
                    left_view_hoodie.mid_full_body_hoodie_left.y_point,
                )

        }

        if (left_view_hoodie.mid_top_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.mid_top_hoodie_left.image,
                    'mid_top_hoodie_left',
                    left_view_hoodie.mid_top_hoodie_left.x_point,
                    left_view_hoodie.mid_top_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.mid_mid_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.mid_mid_hoodie_left.image,
                    'mid_mid_hoodie_left',
                    left_view_hoodie.mid_mid_hoodie_left.x_point,
                    left_view_hoodie.mid_mid_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.mid_bottom_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.mid_bottom_hoodie_left.image,
                    'mid_bottom_hoodie_left',
                    left_view_hoodie.mid_bottom_hoodie_left.x_point,
                    left_view_hoodie.mid_bottom_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.mid_cuff_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.mid_cuff_hoodie_left.image,
                    'mid_cuff_hoodie_left',
                    left_view_hoodie.mid_cuff_hoodie_left.x_point,
                    left_view_hoodie.mid_cuff_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.mid_cuff_strips_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.mid_cuff_strips_hoodie_left.image,
                    'mid_cuff_strips_hoodie_left',
                    left_view_hoodie.mid_cuff_strips_hoodie_left.x_point,
                    left_view_hoodie.mid_cuff_strips_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.left_full_body_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.left_full_body_hoodie_left.image,
                    'left_full_body_hoodie_left',
                    left_view_hoodie.left_full_body_hoodie_left.x_point,
                    left_view_hoodie.left_full_body_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.left_top_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.left_top_hoodie_left.image,
                    'left_top_hoodie_left',
                    left_view_hoodie.left_top_hoodie_left.x_point,
                    left_view_hoodie.left_top_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.left_mid_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.left_mid_hoodie_left.image,
                    'left_mid_hoodie_left',
                    left_view_hoodie.left_mid_hoodie_left.x_point,
                    left_view_hoodie.left_mid_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.left_bottom_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.left_bottom_hoodie_left.image,
                    'left_bottom_hoodie_left',
                    left_view_hoodie.left_bottom_hoodie_left.x_point,
                    left_view_hoodie.left_bottom_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.left_cuff_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.left_cuff_hoodie_left.image,
                    'left_cuff_hoodie_left',
                    left_view_hoodie.left_cuff_hoodie_left.x_point,
                    left_view_hoodie.left_cuff_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.left_cuff_strips_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.left_cuff_strips_hoodie_left.image,
                    'left_cuff_strips_hoodie_left',
                    left_view_hoodie.left_cuff_strips_hoodie_left.x_point,
                    left_view_hoodie.left_cuff_strips_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.right_full_body_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.right_full_body_hoodie_left.image,
                    'right_full_body_hoodie_left',
                    left_view_hoodie.right_full_body_hoodie_left.x_point,
                    left_view_hoodie.right_full_body_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.right_top_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.right_top_hoodie_left.image,
                    'right_top_hoodie_left',
                    left_view_hoodie.right_top_hoodie_left.x_point,
                    left_view_hoodie.right_top_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.right_mid_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.right_mid_hoodie_left.image,
                    'right_mid_hoodie_left',
                    left_view_hoodie.right_mid_hoodie_left.x_point,
                    left_view_hoodie.right_mid_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.right_bottom_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.right_bottom_hoodie_left.image,
                    'right_bottom_hoodie_left',
                    left_view_hoodie.right_bottom_hoodie_left.x_point,
                    left_view_hoodie.right_bottom_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.right_cuff_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.right_cuff_hoodie_left.image,
                    'right_cuff_hoodie_left',
                    left_view_hoodie.right_cuff_hoodie_left.x_point,
                    left_view_hoodie.right_cuff_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.right_cuff_strips_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.right_cuff_strips_hoodie_left.image,
                    'right_cuff_strips_hoodie_left',
                    left_view_hoodie.right_cuff_strips_hoodie_left.x_point,
                    left_view_hoodie.right_cuff_strips_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.bottom_full_body_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.bottom_full_body_hoodie_left.image,
                    'bottom_full_body_hoodie_left',
                    left_view_hoodie.bottom_full_body_hoodie_left.x_point,
                    left_view_hoodie.bottom_full_body_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.bottom_top_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.bottom_top_hoodie_left.image,
                    'bottom_top_hoodie_left',
                    left_view_hoodie.bottom_top_hoodie_left.x_point,
                    left_view_hoodie.bottom_top_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.bottom_mid_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.bottom_mid_hoodie_left.image,
                    'bottom_mid_hoodie_left',
                    left_view_hoodie.bottom_mid_hoodie_left.x_point,
                    left_view_hoodie.bottom_mid_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.bottom_bottom_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.bottom_bottom_hoodie_left.image,
                    'bottom_bottom_hoodie_left',
                    left_view_hoodie.bottom_bottom_hoodie_left.x_point,
                    left_view_hoodie.bottom_bottom_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.bottom_cuff_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.bottom_cuff_hoodie_left.image,
                    'bottom_cuff_hoodie_left',
                    left_view_hoodie.bottom_cuff_hoodie_left.x_point,
                    left_view_hoodie.bottom_cuff_hoodie_left.y_point,
                )
        }

        if (left_view_hoodie?.bottom_cuff_strips_hoodie_left?.image) {

                preloadImge(
                    left_view_hoodie.bottom_cuff_strips_hoodie_left.image,
                    'bottom_cuff_strips_hoodie_left',
                    left_view_hoodie.bottom_cuff_strips_hoodie_left.x_point,
                    left_view_hoodie.bottom_cuff_strips_hoodie_left.y_point,
                )
        }

    }

    const leftImageLoad = (e) => {
        clearCanvas()
        let left_view_hoodie = JSON.parse(localStorage.getItem('left_view_hoodie'))

        if (left_view_hoodie?.mid_full_body_hoodie_left?.image) {
            var mid_full_body_hoodie_left=JSON.parse(localStorage.getItem('mid_full_body_hoodie_left'))
            if (mid_full_body_hoodie_left) {
                loadObject(mid_full_body_hoodie_left)
            }

        }

        if (left_view_hoodie.mid_top_hoodie_left?.image) {
            var mid_top_hoodie_left=JSON.parse(localStorage.getItem('mid_top_hoodie_left'))
            if (mid_top_hoodie_left) {
                loadObject(mid_top_hoodie_left)
            }
        }

        if (left_view_hoodie?.mid_mid_hoodie_left?.image) {
            var mid_mid_hoodie_left=JSON.parse(localStorage.getItem('mid_mid_hoodie_left'))
            if (mid_mid_hoodie_left) {
                loadObject(mid_mid_hoodie_left)
            }
        }

        if (left_view_hoodie?.mid_bottom_hoodie_left?.image) {
            var mid_bottom_hoodie_left=JSON.parse(localStorage.getItem('mid_bottom_hoodie_left'))
            if (mid_bottom_hoodie_left) {
                loadObject(mid_bottom_hoodie_left)
            }
        }

        if (left_view_hoodie?.mid_cuff_hoodie_left?.image) {
            var mid_cuff_hoodie_left=JSON.parse(localStorage.getItem('mid_cuff_hoodie_left'))
            if (mid_cuff_hoodie_left) {
                loadObject(mid_cuff_hoodie_left)
            }
        }

        if (left_view_hoodie?.mid_cuff_strips_hoodie_left?.image) {
            var mid_cuff_strips_hoodie_left=JSON.parse(localStorage.getItem('mid_cuff_strips_hoodie_left'))
            if (mid_cuff_strips_hoodie_left) {
                loadObject(mid_cuff_strips_hoodie_left)
            }
        }

        if (left_view_hoodie?.left_full_body_hoodie_left?.image) {
            var left_full_body_hoodie_left=JSON.parse(localStorage.getItem('left_full_body_hoodie_left'))
            if (left_full_body_hoodie_left) {
                loadObject(left_full_body_hoodie_left)
            }
        }

        if (left_view_hoodie?.left_top_hoodie_left?.image) {
            var left_top_hoodie_left=JSON.parse(localStorage.getItem('left_top_hoodie_left'))
            if (left_top_hoodie_left) {
                loadObject(left_top_hoodie_left)
            }
        }

        if (left_view_hoodie?.left_mid_hoodie_left?.image) {
            var left_mid_hoodie_left=JSON.parse(localStorage.getItem('left_mid_hoodie_left'))
            if (left_mid_hoodie_left) {
                loadObject(left_mid_hoodie_left)
            }
        }

        if (left_view_hoodie?.left_bottom_hoodie_left?.image) {
            var left_bottom_hoodie_left=JSON.parse(localStorage.getItem('left_bottom_hoodie_left'))
            if (left_bottom_hoodie_left) {
                loadObject(left_bottom_hoodie_left)
            }
        }

        if (left_view_hoodie?.left_cuff_hoodie_left?.image) {
            var left_cuff_hoodie_left=JSON.parse(localStorage.getItem('left_cuff_hoodie_left'))
            if (left_cuff_hoodie_left) {
                loadObject(left_cuff_hoodie_left)
            }
        }

        if (left_view_hoodie?.left_cuff_strips_hoodie_left?.image) {
            var left_cuff_strips_hoodie_left=JSON.parse(localStorage.getItem('left_cuff_strips_hoodie_left'))
            if (left_cuff_strips_hoodie_left) {
                loadObject(left_cuff_strips_hoodie_left)
            }
        }

        if (left_view_hoodie?.right_full_body_hoodie_left?.image) {
            var right_full_body_hoodie_left=JSON.parse(localStorage.getItem('right_full_body_hoodie_left'))
            if (right_full_body_hoodie_left) {
                loadObject(right_full_body_hoodie_left)
            }
        }

        if (left_view_hoodie?.right_top_hoodie_left?.image) {
            var right_top_hoodie_left=JSON.parse(localStorage.getItem('right_top_hoodie_left'))
            if (right_top_hoodie_left) {
                loadObject(right_top_hoodie_left)
            }
        }

        if (left_view_hoodie?.right_mid_hoodie_left?.image) {
            var right_mid_hoodie_left=JSON.parse(localStorage.getItem('right_mid_hoodie_left'))
            if (right_mid_hoodie_left) {
                loadObject(right_mid_hoodie_left)
            }
        }

        if (left_view_hoodie?.right_bottom_hoodie_left?.image) {
            var right_bottom_hoodie_left=JSON.parse(localStorage.getItem('right_bottom_hoodie_left'))
            if (right_bottom_hoodie_left) {
                loadObject(right_bottom_hoodie_left)
            }
        }

        if (left_view_hoodie?.right_cuff_hoodie_left?.image) {
            var right_cuff_hoodie_left=JSON.parse(localStorage.getItem('right_cuff_hoodie_left'))
            if (right_cuff_hoodie_left) {
                loadObject(right_cuff_hoodie_left)
            }
        }

        if (left_view_hoodie?.right_cuff_strips_hoodie_left?.image) {
            var right_cuff_strips_hoodie_left=JSON.parse(localStorage.getItem('right_cuff_strips_hoodie_left'))
            if (right_cuff_strips_hoodie_left) {
                loadObject(right_cuff_strips_hoodie_left)
            }
        }

        if (left_view_hoodie?.bottom_full_body_hoodie_left?.image) {
            var bottom_full_body_hoodie_left=JSON.parse(localStorage.getItem('bottom_full_body_hoodie_left'))
            if (bottom_full_body_hoodie_left) {
                loadObject(bottom_full_body_hoodie_left)
            }
        }

        if (left_view_hoodie?.bottom_top_hoodie_left?.image) {
            var bottom_top_hoodie_left=JSON.parse(localStorage.getItem('bottom_top_hoodie_left'))
            if (bottom_top_hoodie_left) {
                loadObject(bottom_top_hoodie_left)
            }
        }

        if (left_view_hoodie?.bottom_mid_hoodie_left?.image) {
            var bottom_mid_hoodie_left=JSON.parse(localStorage.getItem('bottom_mid_hoodie_left'))
            if (bottom_mid_hoodie_left) {
                loadObject(bottom_mid_hoodie_left)
            }
        }

        if (left_view_hoodie?.bottom_bottom_hoodie_left?.image) {
            var bottom_bottom_hoodie_left=JSON.parse(localStorage.getItem('bottom_bottom_hoodie_left'))
            if (bottom_bottom_hoodie_left) {
                loadObject(bottom_bottom_hoodie_left)
            }
        }

        if (left_view_hoodie?.bottom_cuff_hoodie_left?.image) {
            var bottom_cuff_hoodie_left=JSON.parse(localStorage.getItem('bottom_cuff_hoodie_left'))
            if (bottom_cuff_hoodie_left) {
                loadObject(bottom_cuff_hoodie_left)
            }
        }

        if (left_view_hoodie?.bottom_cuff_strips_hoodie_left?.image) {
            var bottom_cuff_strips_hoodie_left=JSON.parse(localStorage.getItem('bottom_cuff_strips_hoodie_left'))
            if (bottom_cuff_strips_hoodie_left) {
                loadObject(bottom_cuff_strips_hoodie_left)
            }
        }

    }


    const prerightImageLoad = (e) => {
        let right_view_hoodie = JSON.parse(localStorage.getItem('right_view_hoodie'))

        if (right_view_hoodie.mid_full_body_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.mid_full_body_hoodie_right.image,
                    'mid_full_body_hoodie_right',
                    right_view_hoodie.mid_full_body_hoodie_right.x_point,
                    right_view_hoodie.mid_full_body_hoodie_right.y_point,
                )
        }
        if (right_view_hoodie.mid_top_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.mid_top_hoodie_right.image,
                    'mid_top_hoodie_right',
                    right_view_hoodie.mid_top_hoodie_right.x_point,
                    right_view_hoodie.mid_top_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.mid_mid_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.mid_mid_hoodie_right.image,
                    'mid_mid_hoodie_right',
                    right_view_hoodie.mid_mid_hoodie_right.x_point,
                    right_view_hoodie.mid_mid_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.mid_bottom_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.mid_bottom_hoodie_right.image,
                    'mid_bottom_hoodie_right',
                    right_view_hoodie.mid_bottom_hoodie_right.x_point,
                    right_view_hoodie.mid_bottom_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.mid_cuff_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.mid_cuff_hoodie_right.image,
                    'mid_cuff_hoodie_right',
                    right_view_hoodie.mid_cuff_hoodie_right.x_point,
                    right_view_hoodie.mid_cuff_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.mid_cuff_strips_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.mid_cuff_strips_hoodie_right.image,
                    'mid_cuff_strips_hoodie_right',
                    right_view_hoodie.mid_cuff_strips_hoodie_right.x_point,
                    right_view_hoodie.mid_cuff_strips_hoodie_right.y_point,
                    )

        }

        if (right_view_hoodie.left_full_body_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.left_full_body_hoodie_right.image,
                    'left_full_body_hoodie_right',
                    right_view_hoodie.left_full_body_hoodie_right.x_point,
                    right_view_hoodie.left_full_body_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.left_top_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.left_top_hoodie_right.image,
                    'left_top_hoodie_right',
                    right_view_hoodie.left_top_hoodie_right.x_point,
                    right_view_hoodie.left_top_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.left_mid_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.left_mid_hoodie_right.image,
                    'left_mid_hoodie_right',
                    right_view_hoodie.left_mid_hoodie_right.x_point,
                    right_view_hoodie.left_mid_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.left_bottom_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.left_bottom_hoodie_right.image,
                    'left_bottom_hoodie_right',
                    right_view_hoodie.left_bottom_hoodie_right.x_point,
                    right_view_hoodie.left_bottom_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.left_cuff_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.left_cuff_hoodie_right.image,
                    'left_cuff_hoodie_right',
                    right_view_hoodie.left_cuff_hoodie_right.x_point,
                    right_view_hoodie.left_cuff_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.left_cuff_strips_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.left_cuff_strips_hoodie_right.image,
                    'left_cuff_strips_hoodie_right',
                    right_view_hoodie.left_cuff_strips_hoodie_right.x_point,
                    right_view_hoodie.left_cuff_strips_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.right_full_body_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.right_full_body_hoodie_right.image,
                    'right_full_body_hoodie_right',
                    right_view_hoodie.right_full_body_hoodie_right.x_point,
                    right_view_hoodie.right_full_body_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.right_top_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.right_top_hoodie_right.image,
                    'right_top_hoodie_right',
                    right_view_hoodie.right_top_hoodie_right.x_point,
                    right_view_hoodie.right_top_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.right_mid_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.right_mid_hoodie_right.image,
                    'right_mid_hoodie_right',
                    right_view_hoodie.right_mid_hoodie_right.x_point,
                    right_view_hoodie.right_mid_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.right_bottom_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.right_bottom_hoodie_right.image,
                    'right_bottom_hoodie_right',
                    right_view_hoodie.right_bottom_hoodie_right.x_point,
                    right_view_hoodie.right_bottom_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.right_cuff_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.right_cuff_hoodie_right.image,
                    'right_cuff_hoodie_right',
                    right_view_hoodie.right_cuff_hoodie_right.x_point,
                    right_view_hoodie.right_cuff_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.right_cuff_strips_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.right_cuff_strips_hoodie_right.image,
                    'right_cuff_strips_hoodie_right',
                    right_view_hoodie.right_cuff_strips_hoodie_right.x_point,
                    right_view_hoodie.right_cuff_strips_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.bottom_full_body_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.bottom_full_body_hoodie_right.image,
                    'bottom_full_body_hoodie_right',
                    right_view_hoodie.bottom_full_body_hoodie_right.x_point,
                    right_view_hoodie.bottom_full_body_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.bottom_top_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.bottom_top_hoodie_right.image,
                    'bottom_top_hoodie_right',
                    right_view_hoodie.bottom_top_hoodie_right.x_point,
                    right_view_hoodie.bottom_top_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.bottom_mid_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.bottom_mid_hoodie_right.image,
                    'bottom_mid_hoodie_right',
                    right_view_hoodie.bottom_mid_hoodie_right.x_point,
                    right_view_hoodie.bottom_mid_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.bottom_bottom_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.bottom_bottom_hoodie_right.image,
                    'bottom_bottom_hoodie_right',
                    right_view_hoodie.bottom_bottom_hoodie_right.x_point,
                    right_view_hoodie.bottom_bottom_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.bottom_cuff_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.bottom_cuff_hoodie_right.image,
                    'bottom_cuff_hoodie_right',
                    right_view_hoodie.bottom_cuff_hoodie_right.x_point,
                    right_view_hoodie.bottom_cuff_hoodie_right.y_point,
                )
        }

        if (right_view_hoodie.bottom_cuff_strips_hoodie_right?.image) {

                preloadImge(
                    right_view_hoodie.bottom_cuff_strips_hoodie_right.image,
                    'bottom_cuff_strips_hoodie_right',
                    right_view_hoodie.bottom_cuff_strips_hoodie_right.x_point,
                    right_view_hoodie.bottom_cuff_strips_hoodie_right.y_point,
                )
        }
    }

    const rightImageLoad = (e) => {
        clearCanvas()
        let right_view_hoodie = JSON.parse(localStorage.getItem('right_view_hoodie'))

        if (right_view_hoodie.mid_full_body_hoodie_right?.image) {
            var mid_full_body_hoodie_right=JSON.parse(localStorage.getItem('mid_full_body_hoodie_right'))
            if (mid_full_body_hoodie_right) {
                loadObject(mid_full_body_hoodie_right)
            }
        }
        if (right_view_hoodie.mid_top_hoodie_right?.image) {
            var mid_top_hoodie_right=JSON.parse(localStorage.getItem('mid_top_hoodie_right'))
            if (mid_top_hoodie_right) {
                loadObject(mid_top_hoodie_right)
            }
        }

        if (right_view_hoodie.mid_mid_hoodie_right?.image) {
            var mid_mid_hoodie_right=JSON.parse(localStorage.getItem('mid_mid_hoodie_right'))
            if (mid_mid_hoodie_right) {
                loadObject(mid_mid_hoodie_right)
            }
        }

        if (right_view_hoodie.mid_bottom_hoodie_right?.image) {
            var mid_bottom_hoodie_right=JSON.parse(localStorage.getItem('mid_bottom_hoodie_right'))
            if (mid_bottom_hoodie_right) {
                loadObject(mid_bottom_hoodie_right)
            }
        }

        if (right_view_hoodie.mid_cuff_hoodie_right?.image) {
            var mid_cuff_hoodie_right=JSON.parse(localStorage.getItem('mid_cuff_hoodie_right'))
            if (mid_cuff_hoodie_right) {
                loadObject(mid_cuff_hoodie_right)
            }
        }

        if (right_view_hoodie.mid_cuff_strips_hoodie_right?.image) {
            var mid_cuff_strips_hoodie_right=JSON.parse(localStorage.getItem('mid_cuff_strips_hoodie_right'))
            if (mid_cuff_strips_hoodie_right) {
                loadObject(mid_cuff_strips_hoodie_right)
            }
        }

        if (right_view_hoodie.left_full_body_hoodie_right?.image) {
            var left_full_body_hoodie_right=JSON.parse(localStorage.getItem('left_full_body_hoodie_right'))
            if (left_full_body_hoodie_right) {
                loadObject(left_full_body_hoodie_right)
            }
        }

        if (right_view_hoodie.left_top_hoodie_right?.image) {
            var left_top_hoodie_right=JSON.parse(localStorage.getItem('left_top_hoodie_right'))
            if (left_top_hoodie_right) {
                loadObject(left_top_hoodie_right)
            }
        }

        if (right_view_hoodie.left_mid_hoodie_right?.image) {
            var left_mid_hoodie_right=JSON.parse(localStorage.getItem('left_mid_hoodie_right'))
            if (left_mid_hoodie_right) {
                loadObject(left_mid_hoodie_right)
            }
        }

        if (right_view_hoodie.left_bottom_hoodie_right?.image) {
            var left_bottom_hoodie_right=JSON.parse(localStorage.getItem('left_bottom_hoodie_right'))
            if (left_bottom_hoodie_right) {
                loadObject(left_bottom_hoodie_right)
            }
        }

        if (right_view_hoodie.left_cuff_hoodie_right?.image) {
            var left_cuff_hoodie_right=JSON.parse(localStorage.getItem('left_cuff_hoodie_right'))
            if (left_cuff_hoodie_right) {
                loadObject(left_cuff_hoodie_right)
            }
        }

        if (right_view_hoodie.left_cuff_strips_hoodie_right?.image) {
            var left_cuff_strips_hoodie_right=JSON.parse(localStorage.getItem('left_cuff_strips_hoodie_right'))
            if (left_cuff_strips_hoodie_right) {
                loadObject(left_cuff_strips_hoodie_right)
            }
        }

        if (right_view_hoodie.right_full_body_hoodie_right?.image) {
            var right_full_body_hoodie_right=JSON.parse(localStorage.getItem('right_full_body_hoodie_right'))
            if (right_full_body_hoodie_right) {
                loadObject(right_full_body_hoodie_right)
            }
        }

        if (right_view_hoodie.right_top_hoodie_right?.image) {
            var right_top_hoodie_right=JSON.parse(localStorage.getItem('right_top_hoodie_right'))
            if (right_top_hoodie_right) {
                loadObject(right_top_hoodie_right)
            }
        }

        if (right_view_hoodie.right_mid_hoodie_right?.image) {
            var right_mid_hoodie_right=JSON.parse(localStorage.getItem('right_mid_hoodie_right'))
            if (right_mid_hoodie_right) {
                loadObject(right_mid_hoodie_right)
            }
        }

        if (right_view_hoodie.right_bottom_hoodie_right?.image) {
            var right_bottom_hoodie_right=JSON.parse(localStorage.getItem('right_bottom_hoodie_right'))
            if (right_bottom_hoodie_right) {
                loadObject(right_bottom_hoodie_right)
            }
        }

        if (right_view_hoodie.right_cuff_hoodie_right?.image) {
            var right_cuff_hoodie_right=JSON.parse(localStorage.getItem('right_cuff_hoodie_right'))
            if (right_cuff_hoodie_right) {
                loadObject(right_cuff_hoodie_right)
            }
        }

        if (right_view_hoodie.right_cuff_strips_hoodie_right?.image) {
            var right_cuff_strips_hoodie_right=JSON.parse(localStorage.getItem('right_cuff_strips_hoodie_right'))
            if (right_cuff_strips_hoodie_right) {
                loadObject(right_cuff_strips_hoodie_right)
            }
        }

        if (right_view_hoodie.bottom_full_body_hoodie_right?.image) {
            var bottom_full_body_hoodie_right=JSON.parse(localStorage.getItem('bottom_full_body_hoodie_right'))
            if (bottom_full_body_hoodie_right) {
                loadObject(bottom_full_body_hoodie_right)
            }
        }

        if (right_view_hoodie.bottom_top_hoodie_right?.image) {
            var bottom_top_hoodie_right=JSON.parse(localStorage.getItem('bottom_top_hoodie_right'))
            if (bottom_top_hoodie_right) {
                loadObject(bottom_top_hoodie_right)
            }
        }

        if (right_view_hoodie.bottom_mid_hoodie_right?.image) {
            var bottom_mid_hoodie_right=JSON.parse(localStorage.getItem('bottom_mid_hoodie_right'))
            if (bottom_mid_hoodie_right) {
                loadObject(bottom_mid_hoodie_right)
            }
        }

        if (right_view_hoodie.bottom_bottom_hoodie_right?.image) {
            var bottom_bottom_hoodie_right=JSON.parse(localStorage.getItem('bottom_bottom_hoodie_right'))
            if (bottom_bottom_hoodie_right) {
                loadObject(bottom_bottom_hoodie_right)
            }
        }

        if (right_view_hoodie.bottom_cuff_hoodie_right?.image) {
            var bottom_cuff_hoodie_right=JSON.parse(localStorage.getItem('bottom_cuff_hoodie_right'))
            if (bottom_cuff_hoodie_right) {
                loadObject(bottom_cuff_hoodie_right)
            }
        }

        if (right_view_hoodie.bottom_cuff_strips_hoodie_right?.image) {
            var bottom_cuff_strips_hoodie_right=JSON.parse(localStorage.getItem('bottom_cuff_strips_hoodie_right'))
            if (bottom_cuff_strips_hoodie_right) {
                loadObject(bottom_cuff_strips_hoodie_right)
            }
        }
    }


    const getSampleImages = (s) => {
        var url = BASE_URL + 'logos';

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data)
                setImg(data)

            })
    }

    function displaySample(img_sample) {
        document.getElementById('sample_images').src = img_sample;
    }

    function imageSaved(i) {
        let logo = JSON.parse(localStorage.getItem('samImage'))

        if (logo.image1?.image) {
            if (localStorage.getItem('samImage')) {
                loadObject(JSON.parse(localStorage.getItem('samImage')))
            } else {
                loadImage(
                    logo.image1.image,
                    'imageID',
                    logo.image1.x_point,
                    logo.image1.y_point,
                )
            }
        }

    }


    const hexatoHSL = (hex) => {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        var r = parseInt(result[1], 16);
        var g = parseInt(result[2], 16);
        var b = parseInt(result[3], 16);
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        s = s * 100;
        s = Math.round(s);
        l = l * 100;
        l = Math.round(l);
        var colorInHSL = h;
        return colorInHSL
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
    }

    return (

        <div>

            <AppBar position="static" color="default">
                <Tabs
                    value={selectedTab}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    scrollable
                    scrollButtons="auto"
                >
                    <Tab label="Front View"/>
                    <Tab label="Back View"/>
                    <Tab label="Right side"/>
                    <Tab label="Left Side"/>
                </Tabs>
            </AppBar>
            {/* front view*/}
            <div>

            {selectedTab === 0 &&
            <div className='row'>
                <div className="btn-group" role="group" aria-label="Basic example" style={{width: "100%"}}>
                    {displyComponents &&
                    displyComponents.map((item, index) => {
                        return (
                            <button key={index} type="button" className="btn btn-secondary" onClick={() => {
                                onComponentClick(item)
                            }}>{item}</button>
                        )
                    })
                    }
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_first_section')}}>Body First Section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_second_section')}}>Body second section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_third_section')}}>Body Third Section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>sleeve</button>*/}
                </div>
                {/*<div className="btn-group" role="group" aria-label="Basic example" style={{width: "100%"}}>*/}
                {/*    <button type="button" className="btn btn-secondary" onClick={() => {*/}
                {/*        onComponentClick('body_first_section')*/}
                {/*    }}>Body*/}
                {/*    </button>*/}
                {/*    <button type="button" className="btn btn-secondary" onClick={() => {*/}
                {/*        onComponentClick('front-collar')*/}
                {/*    }}>Collar*/}
                {/*    </button>*/}
                {/*    <button type="button" className="btn btn-secondary" onClick={() => {*/}
                {/*        onComponentClick('sleeve')*/}
                {/*    }}>sleeve*/}
                {/*    </button>*/}
                {/*</div>*/}

                {colorShow &&
                <div>
                    <div style={{width: "400px", float: "left", marginLeft: "20px"}}>
                        <p> Choose Body color</p>
                        <CirclePicker
                            color={color}
                            onChangeComplete={handleChangeComplete}
                        />
                        <br></br>
                        <div id="output-text">
                            <input onChange={handleInput} placeholder="Enter text"/>
                            <button type='button'
                                    name='text_show'
                                    onClick={textShow}
                                    style={{
                                        backgroundColor: "#767FE0",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50px",
                                        width: "120px",
                                        height: "30px",
                                        margin: "10px"
                                    }}>
                                Add Text
                            </button>
                            <br></br>

                            <select id="input-font" onChange={changeFontStyle(this)}>

                                <option value="DengXian"
                                        selected="selected">
                                    DengXian 等线
                                </option>
                                <option value="DengXian Bold">DengXian Bold 等线</option>
                                <option value="DengXian Light">DengXian Light 等线</option>
                                <option value="DFLiJinHeiW8-GB">DFLiJinHeiW8-GB 华康俪金黑W8</option>
                                <option value="DFGothic-EB">DFGothic-EB ＤＦ特太ゴシック体</option>
                                <option value="DFKaiSho-SB">DFKaiSho-SB ＤＦ中太楷書体</option>
                                <option value="DFMincho-SU">DFMincho-SU ＤＦ超極太明朝体</option>
                                <option value="DFMincho-UB">DFMincho-UB ＤＦ極太明朝体</option>
                                <option value="DFMincho-W5">DFMincho-W5 ＤＦ明朝体W5</option>
                                <option value="DFPOP1-W9">DFPOP1-W9 ＤＦPOP1体W9</option>
                                <option value="Flavors-Regular">Flavors-Regular</option>
                                <option value="Fluffy-Gothic">Fluffy-Gothic</option>
                                <option value="Fredericka The Great-Regular">Fredericka The Great-Regular</option>
                                <option value="FZQingKeYueSongS-R-GB">FZQingKeYueSongS-R-GB 方正清刻本悦宋简体</option>
                                <option value="GebaFont2000">GebaFont2000 方正正中黑简体</option>
                                <option value="FZZhengHeiS-DB-GB">FZZhengHeiS-DB-GB</option>
                                <option value="GeikaiSuikou">GeikaiSuikou 鯨海酔侯</option>
                                <option value="HannotateSC-Regular">HannotateSC-Regular 手札体-简 标准体</option>
                                <option value="HeiT ASC Bold Regular">HeiT ASC Bold Regular</option>
                                <option value="HirakakuStd-W8">HirakakuStd-W8 ヒラギノ角ゴ Std-W8</option>
                                <option value="HOPE">HOPE 火柴棍儿</option>
                                <option value="HYQinChuanFeiYingF">HYQinChuanFeiYingF 汉仪秦川飞影 繁</option>
                                <option value="HYShangWeiShouShuW">HYShangWeiShouShuW 汉仪尚巍手书W</option>
                                <option value="HYXiaoMaiTiJ">HYXiaoMaiTiJ 汉仪小麦体</option>
                                <option value="HYZhuZiMuTouRenW">HYZhuZiMuTouRenW 汉仪铸字木头人W 常规</option>
                                <option value="OTF-KanteiryuStd-Ultra">OTF-KanteiryuStd-Ultra A-OTF 勘亭流 Std Ultra
                                </option>
                                <option value="大髭115">大髭115</option>
                                <option value="Tayuka_R">Tayuka_R</option>
                                <option value="KAISO-MAKINA">KAISO-MAKINA 廻想体 マキナ B</option>
                                <option value="KozGoPr6N-Bold">KozGoPr6N-Bold 小塚ゴシック Pr6N H</option>
                                <option value="KozGoPr6N-ExtraLight">KozGoPr6N-ExtraLight 小塚ゴシック Pr6N EL</option>
                                <option value="KozGoPr6N-Heavy">KozGoPr6N-Heavy 小塚ゴシック Pr6N H Bold</option>
                                <option value="KozGoPr6N-Light">KozGoPr6N-Light 小塚ゴシック Pr6N L</option>
                                <option value="KozGoPr6N-Medium">KozGoPr6N-Medium 小塚ゴシック Pr6N M</option>
                                <option value="KozGoPr6N-Regular">KozGoPr6N-Regular 小塚ゴシック Pr6N M Regular</option>
                                <option value="KozGoPro-Bold">KozGoPro-Bold 小塚ゴシック Pro B Bold</option>
                                <option value="KozGoPro-ExtraLight">KozGoPro-ExtraLight 小塚ゴシック Pro EL</option>
                                <option value="KozGoPro-Heavy">KozGoPro-Heavy 小塚ゴシック Pro H</option>
                                <option value="KozGoPro-Light">KozGoPro-Light 小塚ゴシック Pro L</option>
                                <option value="KozGoPro-Medium">KozGoPro-Medium 小塚ゴシック Pro M</option>
                                <option value="KozGoPro-Regular">KozGoPro-Regular 小塚ゴシック Pro R</option>
                                <option value="KozMinPr6N-Bold">KozMinPr6N-Bold 小塚明朝 Pr6N B</option>
                                <option value="KozMinPr6N-ExtraLight">KozMinPr6N-ExtraLight 小塚明朝 Pr6N EL</option>
                                <option value="KozMinPr6N-Heavy">KozMinPr6N-Heavy 小塚明朝 Pr6N H</option>
                                <option value="KozMinPr6N-Light">KozMinPr6N-Light 小塚明朝 Pr6N L</option>
                                <option value="KozMinPr6N-Medium">KozMinPr6N-Medium 小塚明朝 Pr6N M</option>
                                <option value="KozMinPr6N-Regular">KozMinPr6N-Regular 小塚明朝 Pr6N R</option>
                                <option value="Mermaid Swash Caps">Mermaid Swash Caps</option>
                                <option value="Mermaid1001">Mermaid1001</option>
                                <option value="MFYueHei_Noncommercial-Regular">MFYueHei_Noncommercial-Regular
                                    造字工房悦黑
                                </option>
                                <option value=" Microsoft JhengHei Console"> Microsoft JhengHei Console</option>
                                <option value=" Microsoft JhengHei Bold"> Microsoft JhengHei Bold</option>
                                <option value=" Microsoft JhengHei Light"> Microsoft JhengHei Light</option>
                                <option value=" Microsoft YaHei">Microsoft YaHei</option>
                                <option value=" Microsoft Yahei Bold">Microsoft Yahei Bold 微软雅黑 Bold</option>
                                <option value=" Microsoft JhengHei UI Light">Microsoft JhengHei UI Light</option>
                                <option value=" Microsoft YaHei Regular">Microsoft YaHei Regular</option>
                                <option value=" Microsoft YaHei Bold">Microsoft YaHei Bold</option>
                                <option value=" Microsoft YaHei Heavy">Microsoft YaHei Heavy</option>
                                <option value=" Microsoft YaHei Light">Microsoft YaHei Light</option>
                                <option value=" Pacifico">Pacifico</option>
                                <option value=" Permanent Marker">Permanent Marker</option>
                                <option value=" Princess Sofia">Princess Sofia</option>
                                <option value=" Ronde B Square">Ronde B Square ロンド B スクエア</option>
                                <option value=" Senty ZHAO">Senty ZHAO 新蒂赵孟頫</option>
                                <option value=" Shunpu隼風">Shunpu隼風 隼風</option>
                                <option value=" SimFang">SimFang 仿宋</option>
                                <option value=" SimHei">SimHei 常规</option>
                                <option value=" SimKai">SimKai 楷体-GBK</option>
                                <option value=" SimSun">SimSun</option>
                                <option value=" SimSun Bold">SimSun Bold</option>
                                <option value=" Vevey">Vevey</option>
                                <option value=" Wallpoet">Wallpoet</option>
                                <option value=" HanWangShinSu">HanWangShinSu 韩华新秀</option>
                                <option value=" Republic of China font">Republic of China font 中華民國字體</option>
                                <option value=" Kyodo">Kyodo 京円</option>
                                <option value=" Haolong">Haolong 今昔豪龙</option>
                                <option value=" Goodbye old times">Goodbye OldTimes 再见旧时光</option>
                                <option value=" Lihei">Lihei 力黑体</option>
                                <option value=" 华康少女文字W5">华康少女文字W5</option>
                                <option value="  华康海报体W12"> 华康海报体W12</option>
                                <option value="  华康钢笔体W2 Regular"> 华康钢笔体W2 Regular</option>
                                <option value="四重音">四重音</option>
                                <option value="基督山伯爵">基督山伯爵</option>
                                <option value="字酷堂清楷体">字酷堂清楷体</option>
                                <option value="康熙字典體 Regular">康熙字典體 Regular</option>
                                <option value="Genghis Khan">Genghis Khan 成吉思汗</option>
                                <option value="Afternoon Tea">Afternoon Tea 新蒂下午茶基本版</option>
                                <option value="新蒂剪纸体 Regular">新蒂剪纸体 Regular</option>
                                <option value="方正喵呜体 Regular">方正喵呜体 Regular</option>
                                <option value="FZYaoTi-M06">FZYaoTi-M06 方正姚体_GBK Regular</option>
                                <option value="FZYaoTi-M06T">FZYaoTi-M06T 方正姚体繁体</option>
                                <option value="FZZJ-XTCSJW">FZZJ-XTCSJW 方正字迹-邢体草书简体</option>
                                <option value="FZJingHeiShouXieS-R-GB">FZJingHeiShouXieS-R-GB 方正经黑手写简体</option>
                                <option value="FZJingHeiS-R-GB">FZJingHeiS-R-GB 方正经黑简体</option>
                                <option value="FZXingKai-S04T">FZXingKai-S04T 方正行楷繁体</option>
                                <option value="Highway Font">Highway Font 日本高速公路字体</option>
                                <option value="Long Qian body bold">Long Qian Body Bold 朗倩体粗体</option>
                                <option value="朗倩体细体">朗倩体细体</option>
                                <option value="李旭科毛笔行书 Regular">李旭科毛笔行书 Regular</option>
                                <option value="HYLeMiaoTiJ Regular">HYLeMiaoTiJ Regular 汉仪乐喵体简</option>
                                <option value="淘淘简体字体 Regular">淘淘简体字体 Regular</option>
                                <option value="狸记号油性笔字体 Regular">狸记号油性笔字体 Regular</option>
                                <option value="YuWeiJ 禹卫书法行书简体">YuWeiJ 禹卫书法行书简体</option>
                                <option value="YuWeiF 禹卫书法行书繁体">YuWeiF 禹卫书法行书繁体</option>
                                <option value="YuWeiShuFaLiShuJMFX 禹卫书法隶书繁体">YuWeiShuFaLiShuJMFX 禹卫书法隶书繁体</option>
                                <option value="HuJingLi-Mao 胡敬礼毛笔行书简">HuJingLi Mao 胡敬礼毛笔行书简</option>
                                <option value="HuJingLi-Fan 胡敬礼毛笔行书繁">HuJingLi Fan 胡敬礼毛笔行书繁</option>
                                <option value="SuXinShi MaoCao 苏新诗毛糙体简">SuXinShi MaoCao 苏新诗毛糙体简</option>
                                <option value="MBanquet P HKS Medium 蒙纳简喜宴体P">MBanquet P HKS Medium 蒙纳简喜宴体P</option>
                                <option value="MComic PRC Medium 蒙纳漫画体简">MComic PRC Medium 蒙纳漫画体简</option>
                                <option value="MComputer HK Bold 蒙纳电脑体">MComputer HK Bold 蒙纳电脑体</option>
                                <option value="MRocky HK Bold 蒙纳石印体">MRocky HK Bold 蒙纳石印体</option>
                                <option value="MStiffHei PRC UltraBold 蒙纳简超刚黑">MStiffHei PRC UltraBold 蒙纳简超刚黑
                                </option>
                                <option value="MStiffHeiHK-Big5 蒙纳超刚黑">MStiffHeiHK Big5 蒙纳超刚黑</option>
                                <option value="MF DianHei(Noncommercial) 造字工房典黑体">MF DianHei(Noncommercial)
                                    造字工房典黑体
                                </option>
                                <option value="MF JinHei(Noncommercial) 造字工房劲黑体（非商用)">MF JinHei(Noncommercial)
                                    造字工房劲黑体（非商用)
                                </option>
                                <option value="RTWS ShangGothic G0v1 Bold 造字工房尚黑 G0v1 粗体">RTWS ShangGothic G0v1 Bold
                                    造字工房尚黑 G0v1 粗体
                                </option>
                                <option value="RTWS YueRoundedGothic Demo Regular 造字工房悦圆演示版常规体">RTWS
                                    YueRoundedGothic Demo Regular 造字工房悦圆演示版常规体
                                </option>
                                <option value=",RTWSYueGoTrial-Regular 造字工房悦黑体验版常规体">RTWSYueGoTrial Regular
                                    造字工房悦黑体验版常规体
                                </option>
                                <option value="MF YiHei 造字工房毅黑体">MF YiHei(Noncommercial) 造字工房毅黑体</option>
                                <option value="MF BanHei 造字工房版黑体">MF BanHei(Noncommercial) 造字工房版黑体</option>
                                <option value="REEJI-HonghuangLi-MediumGB1.0 锐字工房洪荒之力中黑简1.0">HonghuangLi MediumGB1.0
                                    锐字工房洪荒之力中黑简1.0
                                </option>
                                <option value="QingYang 青羊字体">QingYang 青羊字体</option>
                            </select>
                            <select id="input-font" style={{marginLeft: "10px"}}>

                                <option value="Normal"
                                        selected="selected">
                                    Normal
                                </option>
                                <option value="Arial" style={{fontStyle: "bolder"}}>Bold</option>
                                <option value="fantasy" style={{fontStyle: "italic"}}>Italic</option>
                                <option value="cursive" style={{fontStyle: "underline"}}>Underline</option>
                            </select>

                        </div>
                        <br></br>
                        {/*    <CirclePicker*/}
                        {/*    // color={ name }*/}
                        {/*    // onChangeComplete={ handleChangeComplete}*/}
                        {/*/>*/}
                        <br></br>

                        <input type="file"/>
                        {/*<button type='button'*/}
                        {/*                        name='text_show'*/}
                        {/*                        onClick={download_Image}*/}
                        {/*                        style={{*/}
                        {/*                            backgroundColor: "#767FE0",*/}
                        {/*                            color: "white",*/}
                        {/*                            border: "none",*/}
                        {/*                            borderRadius: "50px",*/}
                        {/*                            width: "120px",*/}
                        {/*                            height: "30px",*/}
                        {/*                            margin: "10px"*/}
                        {/*                        }}>*/}
                        {/*                    Download Design*/}
                        {/*                </button>*/}
                    </div>
                    <div style={{width: "300px", float: "right"}}>
                        <div style={{
                            width: "300px",
                            height: "300px",
                            border: "solid",
                            borderColor: "black",
                            borderWidth: "1px",
                            float: "right",
                            marginRight: "-500px",
                            marginTop: "10px"
                        }}>
                            <button onClick={getSampleImages}>Load Images</button>
                            {
                                img ?
                                    img.map((s) =>
                                        <img src={s.image} alt={''} style={{width: "50px", height: "50px"}}
                                             onClick={() => {
                                                 load_logo(s.image)
                                             }}/>
                                    )
                                    : null}
                        </div>

                    </div>
                </div>
                }

                {/*<form action="">*/}
                {/*    <label htmlFor="patterns" style={{marginTop: "20px"}}></label>*/}
                {/*    <select name="patterns" id="patterns" style={{*/}
                {/*        width: "150px",*/}
                {/*        height: "30px",*/}
                {/*        borderWidth: "1px",*/}
                {/*        borderStyle: "solid",*/}
                {/*        margin: "10px"*/}
                {/*    }}>*/}
                {/*        <option value="image1">Image1</option>*/}
                {/*        <option value="image2">Image2</option>*/}
                {/*        <option value="image3">Image3</option>*/}
                {/*        <option value="image4">Image4</option>*/}
                {/*    </select>*/}
                {/*    <input type="submit" value="Submit"></input>*/}
                {/*</form>*/}

                {/*<button type='button'*/}
                {/*        name='upload_logo'*/}
                {/*    // onClick={load_logo}*/}
                {/*        style={{*/}
                {/*            backgroundColor: "#767FE0",*/}
                {/*            color: "white",*/}
                {/*            border: "none",*/}
                {/*            borderRadius: "50px",*/}
                {/*            width: "120px",*/}
                {/*            height: "30px",*/}
                {/*            margin: "10px"*/}
                {/*        }}>*/}
                {/*    Load Logo*/}
                {/*</button>*/}
                {/*<br></br>*/}
                {/*<button type="button"*/}
                {/*        onClick={download_Image}*/}
                {/*        style={{*/}
                {/*            backgroundColor: "#767FE0",*/}
                {/*            color: "white",*/}
                {/*            border: "none",*/}
                {/*            borderRadius: "50px",*/}
                {/*            width: "120px",*/}
                {/*            height: "30px",*/}
                {/*            margin: "10px"*/}
                {/*        }}>Download Image*/}
                {/*</button>*/}

            </div>
            }

            {/* back view */}
            {selectedTab === 1 &&
                            <div className='row'>
                <div className="btn-group" role="group" aria-label="Basic example" style={{width: "100%"}}>
                    {displyComponents &&
                    displyComponents.map((item, index) => {
                        return (
                            <button key={index} type="button" className="btn btn-secondary" onClick={() => {
                                onComponentClick(item)
                            }}>{item}</button>
                        )
                    })
                    }
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_first_section')}}>Body First Section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_second_section')}}>Body second section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_third_section')}}>Body Third Section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>sleeve</button>*/}
                </div>
                {/*<div className="btn-group" role="group" aria-label="Basic example" style={{width: "100%"}}>*/}
                {/*    <button type="button" className="btn btn-secondary" onClick={() => {*/}
                {/*        onComponentClick('body_first_section')*/}
                {/*    }}>Body*/}
                {/*    </button>*/}
                {/*    <button type="button" className="btn btn-secondary" onClick={() => {*/}
                {/*        onComponentClick('front-collar')*/}
                {/*    }}>Collar*/}
                {/*    </button>*/}
                {/*    <button type="button" className="btn btn-secondary" onClick={() => {*/}
                {/*        onComponentClick('sleeve')*/}
                {/*    }}>sleeve*/}
                {/*    </button>*/}
                {/*</div>*/}

                {colorShow &&
                <div>
                    <div style={{width: "400px", float: "left", marginLeft: "20px"}}>
                        <p> Choose Body color</p>
                        <CirclePicker
                            color={color}
                            onChangeComplete={handleChangeComplete}
                        />
                        <br></br>
                        <div id="output-text">
                            <input onChange={handleInput} placeholder="Enter text"/>
                            <button type='button'
                                    name='text_show'
                                    onClick={textShow}
                                    style={{
                                        backgroundColor: "#767FE0",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50px",
                                        width: "120px",
                                        height: "30px",
                                        margin: "10px"
                                    }}>
                                Add Text
                            </button>
                            <br></br>

                            <select id="input-font" onChange={changeFontStyle(this)}>

                                <option value="DengXian"
                                        selected="selected">
                                    DengXian 等线
                                </option>
                                <option value="DengXian Bold">DengXian Bold 等线</option>
                                <option value="DengXian Light">DengXian Light 等线</option>
                                <option value="DFLiJinHeiW8-GB">DFLiJinHeiW8-GB 华康俪金黑W8</option>
                                <option value="DFGothic-EB">DFGothic-EB ＤＦ特太ゴシック体</option>
                                <option value="DFKaiSho-SB">DFKaiSho-SB ＤＦ中太楷書体</option>
                                <option value="DFMincho-SU">DFMincho-SU ＤＦ超極太明朝体</option>
                                <option value="DFMincho-UB">DFMincho-UB ＤＦ極太明朝体</option>
                                <option value="DFMincho-W5">DFMincho-W5 ＤＦ明朝体W5</option>
                                <option value="DFPOP1-W9">DFPOP1-W9 ＤＦPOP1体W9</option>
                                <option value="Flavors-Regular">Flavors-Regular</option>
                                <option value="Fluffy-Gothic">Fluffy-Gothic</option>
                                <option value="Fredericka The Great-Regular">Fredericka The Great-Regular</option>
                                <option value="FZQingKeYueSongS-R-GB">FZQingKeYueSongS-R-GB 方正清刻本悦宋简体</option>
                                <option value="GebaFont2000">GebaFont2000 方正正中黑简体</option>
                                <option value="FZZhengHeiS-DB-GB">FZZhengHeiS-DB-GB</option>
                                <option value="GeikaiSuikou">GeikaiSuikou 鯨海酔侯</option>
                                <option value="HannotateSC-Regular">HannotateSC-Regular 手札体-简 标准体</option>
                                <option value="HeiT ASC Bold Regular">HeiT ASC Bold Regular</option>
                                <option value="HirakakuStd-W8">HirakakuStd-W8 ヒラギノ角ゴ Std-W8</option>
                                <option value="HOPE">HOPE 火柴棍儿</option>
                                <option value="HYQinChuanFeiYingF">HYQinChuanFeiYingF 汉仪秦川飞影 繁</option>
                                <option value="HYShangWeiShouShuW">HYShangWeiShouShuW 汉仪尚巍手书W</option>
                                <option value="HYXiaoMaiTiJ">HYXiaoMaiTiJ 汉仪小麦体</option>
                                <option value="HYZhuZiMuTouRenW">HYZhuZiMuTouRenW 汉仪铸字木头人W 常规</option>
                                <option value="OTF-KanteiryuStd-Ultra">OTF-KanteiryuStd-Ultra A-OTF 勘亭流 Std Ultra
                                </option>
                                <option value="大髭115">大髭115</option>
                                <option value="Tayuka_R">Tayuka_R</option>
                                <option value="KAISO-MAKINA">KAISO-MAKINA 廻想体 マキナ B</option>
                                <option value="KozGoPr6N-Bold">KozGoPr6N-Bold 小塚ゴシック Pr6N H</option>
                                <option value="KozGoPr6N-ExtraLight">KozGoPr6N-ExtraLight 小塚ゴシック Pr6N EL</option>
                                <option value="KozGoPr6N-Heavy">KozGoPr6N-Heavy 小塚ゴシック Pr6N H Bold</option>
                                <option value="KozGoPr6N-Light">KozGoPr6N-Light 小塚ゴシック Pr6N L</option>
                                <option value="KozGoPr6N-Medium">KozGoPr6N-Medium 小塚ゴシック Pr6N M</option>
                                <option value="KozGoPr6N-Regular">KozGoPr6N-Regular 小塚ゴシック Pr6N M Regular</option>
                                <option value="KozGoPro-Bold">KozGoPro-Bold 小塚ゴシック Pro B Bold</option>
                                <option value="KozGoPro-ExtraLight">KozGoPro-ExtraLight 小塚ゴシック Pro EL</option>
                                <option value="KozGoPro-Heavy">KozGoPro-Heavy 小塚ゴシック Pro H</option>
                                <option value="KozGoPro-Light">KozGoPro-Light 小塚ゴシック Pro L</option>
                                <option value="KozGoPro-Medium">KozGoPro-Medium 小塚ゴシック Pro M</option>
                                <option value="KozGoPro-Regular">KozGoPro-Regular 小塚ゴシック Pro R</option>
                                <option value="KozMinPr6N-Bold">KozMinPr6N-Bold 小塚明朝 Pr6N B</option>
                                <option value="KozMinPr6N-ExtraLight">KozMinPr6N-ExtraLight 小塚明朝 Pr6N EL</option>
                                <option value="KozMinPr6N-Heavy">KozMinPr6N-Heavy 小塚明朝 Pr6N H</option>
                                <option value="KozMinPr6N-Light">KozMinPr6N-Light 小塚明朝 Pr6N L</option>
                                <option value="KozMinPr6N-Medium">KozMinPr6N-Medium 小塚明朝 Pr6N M</option>
                                <option value="KozMinPr6N-Regular">KozMinPr6N-Regular 小塚明朝 Pr6N R</option>
                                <option value="Mermaid Swash Caps">Mermaid Swash Caps</option>
                                <option value="Mermaid1001">Mermaid1001</option>
                                <option value="MFYueHei_Noncommercial-Regular">MFYueHei_Noncommercial-Regular
                                    造字工房悦黑
                                </option>
                                <option value=" Microsoft JhengHei Console"> Microsoft JhengHei Console</option>
                                <option value=" Microsoft JhengHei Bold"> Microsoft JhengHei Bold</option>
                                <option value=" Microsoft JhengHei Light"> Microsoft JhengHei Light</option>
                                <option value=" Microsoft YaHei">Microsoft YaHei</option>
                                <option value=" Microsoft Yahei Bold">Microsoft Yahei Bold 微软雅黑 Bold</option>
                                <option value=" Microsoft JhengHei UI Light">Microsoft JhengHei UI Light</option>
                                <option value=" Microsoft YaHei Regular">Microsoft YaHei Regular</option>
                                <option value=" Microsoft YaHei Bold">Microsoft YaHei Bold</option>
                                <option value=" Microsoft YaHei Heavy">Microsoft YaHei Heavy</option>
                                <option value=" Microsoft YaHei Light">Microsoft YaHei Light</option>
                                <option value=" Pacifico">Pacifico</option>
                                <option value=" Permanent Marker">Permanent Marker</option>
                                <option value=" Princess Sofia">Princess Sofia</option>
                                <option value=" Ronde B Square">Ronde B Square ロンド B スクエア</option>
                                <option value=" Senty ZHAO">Senty ZHAO 新蒂赵孟頫</option>
                                <option value=" Shunpu隼風">Shunpu隼風 隼風</option>
                                <option value=" SimFang">SimFang 仿宋</option>
                                <option value=" SimHei">SimHei 常规</option>
                                <option value=" SimKai">SimKai 楷体-GBK</option>
                                <option value=" SimSun">SimSun</option>
                                <option value=" SimSun Bold">SimSun Bold</option>
                                <option value=" Vevey">Vevey</option>
                                <option value=" Wallpoet">Wallpoet</option>
                                <option value=" HanWangShinSu">HanWangShinSu 韩华新秀</option>
                                <option value=" Republic of China font">Republic of China font 中華民國字體</option>
                                <option value=" Kyodo">Kyodo 京円</option>
                                <option value=" Haolong">Haolong 今昔豪龙</option>
                                <option value=" Goodbye old times">Goodbye OldTimes 再见旧时光</option>
                                <option value=" Lihei">Lihei 力黑体</option>
                                <option value=" 华康少女文字W5">华康少女文字W5</option>
                                <option value="  华康海报体W12"> 华康海报体W12</option>
                                <option value="  华康钢笔体W2 Regular"> 华康钢笔体W2 Regular</option>
                                <option value="四重音">四重音</option>
                                <option value="基督山伯爵">基督山伯爵</option>
                                <option value="字酷堂清楷体">字酷堂清楷体</option>
                                <option value="康熙字典體 Regular">康熙字典體 Regular</option>
                                <option value="Genghis Khan">Genghis Khan 成吉思汗</option>
                                <option value="Afternoon Tea">Afternoon Tea 新蒂下午茶基本版</option>
                                <option value="新蒂剪纸体 Regular">新蒂剪纸体 Regular</option>
                                <option value="方正喵呜体 Regular">方正喵呜体 Regular</option>
                                <option value="FZYaoTi-M06">FZYaoTi-M06 方正姚体_GBK Regular</option>
                                <option value="FZYaoTi-M06T">FZYaoTi-M06T 方正姚体繁体</option>
                                <option value="FZZJ-XTCSJW">FZZJ-XTCSJW 方正字迹-邢体草书简体</option>
                                <option value="FZJingHeiShouXieS-R-GB">FZJingHeiShouXieS-R-GB 方正经黑手写简体</option>
                                <option value="FZJingHeiS-R-GB">FZJingHeiS-R-GB 方正经黑简体</option>
                                <option value="FZXingKai-S04T">FZXingKai-S04T 方正行楷繁体</option>
                                <option value="Highway Font">Highway Font 日本高速公路字体</option>
                                <option value="Long Qian body bold">Long Qian Body Bold 朗倩体粗体</option>
                                <option value="朗倩体细体">朗倩体细体</option>
                                <option value="李旭科毛笔行书 Regular">李旭科毛笔行书 Regular</option>
                                <option value="HYLeMiaoTiJ Regular">HYLeMiaoTiJ Regular 汉仪乐喵体简</option>
                                <option value="淘淘简体字体 Regular">淘淘简体字体 Regular</option>
                                <option value="狸记号油性笔字体 Regular">狸记号油性笔字体 Regular</option>
                                <option value="YuWeiJ 禹卫书法行书简体">YuWeiJ 禹卫书法行书简体</option>
                                <option value="YuWeiF 禹卫书法行书繁体">YuWeiF 禹卫书法行书繁体</option>
                                <option value="YuWeiShuFaLiShuJMFX 禹卫书法隶书繁体">YuWeiShuFaLiShuJMFX 禹卫书法隶书繁体</option>
                                <option value="HuJingLi-Mao 胡敬礼毛笔行书简">HuJingLi Mao 胡敬礼毛笔行书简</option>
                                <option value="HuJingLi-Fan 胡敬礼毛笔行书繁">HuJingLi Fan 胡敬礼毛笔行书繁</option>
                                <option value="SuXinShi MaoCao 苏新诗毛糙体简">SuXinShi MaoCao 苏新诗毛糙体简</option>
                                <option value="MBanquet P HKS Medium 蒙纳简喜宴体P">MBanquet P HKS Medium 蒙纳简喜宴体P</option>
                                <option value="MComic PRC Medium 蒙纳漫画体简">MComic PRC Medium 蒙纳漫画体简</option>
                                <option value="MComputer HK Bold 蒙纳电脑体">MComputer HK Bold 蒙纳电脑体</option>
                                <option value="MRocky HK Bold 蒙纳石印体">MRocky HK Bold 蒙纳石印体</option>
                                <option value="MStiffHei PRC UltraBold 蒙纳简超刚黑">MStiffHei PRC UltraBold 蒙纳简超刚黑
                                </option>
                                <option value="MStiffHeiHK-Big5 蒙纳超刚黑">MStiffHeiHK Big5 蒙纳超刚黑</option>
                                <option value="MF DianHei(Noncommercial) 造字工房典黑体">MF DianHei(Noncommercial)
                                    造字工房典黑体
                                </option>
                                <option value="MF JinHei(Noncommercial) 造字工房劲黑体（非商用)">MF JinHei(Noncommercial)
                                    造字工房劲黑体（非商用)
                                </option>
                                <option value="RTWS ShangGothic G0v1 Bold 造字工房尚黑 G0v1 粗体">RTWS ShangGothic G0v1 Bold
                                    造字工房尚黑 G0v1 粗体
                                </option>
                                <option value="RTWS YueRoundedGothic Demo Regular 造字工房悦圆演示版常规体">RTWS
                                    YueRoundedGothic Demo Regular 造字工房悦圆演示版常规体
                                </option>
                                <option value=",RTWSYueGoTrial-Regular 造字工房悦黑体验版常规体">RTWSYueGoTrial Regular
                                    造字工房悦黑体验版常规体
                                </option>
                                <option value="MF YiHei 造字工房毅黑体">MF YiHei(Noncommercial) 造字工房毅黑体</option>
                                <option value="MF BanHei 造字工房版黑体">MF BanHei(Noncommercial) 造字工房版黑体</option>
                                <option value="REEJI-HonghuangLi-MediumGB1.0 锐字工房洪荒之力中黑简1.0">HonghuangLi MediumGB1.0
                                    锐字工房洪荒之力中黑简1.0
                                </option>
                                <option value="QingYang 青羊字体">QingYang 青羊字体</option>
                            </select>
                            <select id="input-font" style={{marginLeft: "10px"}}>

                                <option value="Normal"
                                        selected="selected">
                                    Normal
                                </option>
                                <option value="Arial" style={{fontStyle: "bolder"}}>Bold</option>
                                <option value="fantasy" style={{fontStyle: "italic"}}>Italic</option>
                                <option value="cursive" style={{fontStyle: "underline"}}>Underline</option>
                            </select>

                        </div>
                        <br></br>
                        {/*    <CirclePicker*/}
                        {/*    // color={ name }*/}
                        {/*    // onChangeComplete={ handleChangeComplete}*/}
                        {/*/>*/}
                        <br></br>

                        <input type="file"/>
                        {/*<button type='button'*/}
                        {/*                        name='text_show'*/}
                        {/*                        onClick={download_Image}*/}
                        {/*                        style={{*/}
                        {/*                            backgroundColor: "#767FE0",*/}
                        {/*                            color: "white",*/}
                        {/*                            border: "none",*/}
                        {/*                            borderRadius: "50px",*/}
                        {/*                            width: "120px",*/}
                        {/*                            height: "30px",*/}
                        {/*                            margin: "10px"*/}
                        {/*                        }}>*/}
                        {/*                    Download Design*/}
                        {/*                </button>*/}
                    </div>
                    <div style={{width: "300px", float: "right"}}>
                        <div style={{
                            width: "300px",
                            height: "300px",
                            border: "solid",
                            borderColor: "black",
                            borderWidth: "1px",
                            float: "right",
                            marginRight: "-500px",
                            marginTop: "10px"
                        }}>
                            <button onClick={getSampleImages}>Load Images</button>
                            {
                                img ?
                                    img.map((s) =>
                                        <img src={s.image} alt={''} style={{width: "50px", height: "50px"}}
                                             onClick={() => {
                                                 load_logo(s.image)
                                             }}/>
                                    )
                                    : null}
                        </div>

                    </div>
                </div>
                }

                {/*<form action="">*/}
                {/*    <label htmlFor="patterns" style={{marginTop: "20px"}}></label>*/}
                {/*    <select name="patterns" id="patterns" style={{*/}
                {/*        width: "150px",*/}
                {/*        height: "30px",*/}
                {/*        borderWidth: "1px",*/}
                {/*        borderStyle: "solid",*/}
                {/*        margin: "10px"*/}
                {/*    }}>*/}
                {/*        <option value="image1">Image1</option>*/}
                {/*        <option value="image2">Image2</option>*/}
                {/*        <option value="image3">Image3</option>*/}
                {/*        <option value="image4">Image4</option>*/}
                {/*    </select>*/}
                {/*    <input type="submit" value="Submit"></input>*/}
                {/*</form>*/}

                {/*<button type='button'*/}
                {/*        name='upload_logo'*/}
                {/*    // onClick={load_logo}*/}
                {/*        style={{*/}
                {/*            backgroundColor: "#767FE0",*/}
                {/*            color: "white",*/}
                {/*            border: "none",*/}
                {/*            borderRadius: "50px",*/}
                {/*            width: "120px",*/}
                {/*            height: "30px",*/}
                {/*            margin: "10px"*/}
                {/*        }}>*/}
                {/*    Load Logo*/}
                {/*</button>*/}
                {/*<br></br>*/}
                {/*<button type="button"*/}
                {/*        onClick={download_Image}*/}
                {/*        style={{*/}
                {/*            backgroundColor: "#767FE0",*/}
                {/*            color: "white",*/}
                {/*            border: "none",*/}
                {/*            borderRadius: "50px",*/}
                {/*            width: "120px",*/}
                {/*            height: "30px",*/}
                {/*            margin: "10px"*/}
                {/*        }}>Download Image*/}
                {/*</button>*/}

            </div>

            // <div className='row' style={{width: "100%"}}>
            //     <div className="btn-group" role="group" aria-label="Basic example" style={{width: "100%"}}>
            //         {displyComponents &&
            //         displyComponents.map((item, index) => {
            //             return (
            //                 <button key={index} type="button" className="btn btn-secondary" onClick={() => {
            //                     onComponentClick(item)
            //                 }}>{item}</button>
            //             )
            //         })
            //         }
            //         {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_first_section')}}>Body First Section</button>*/}
            //         {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_second_section')}}>Body second section</button>*/}
            //         {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_third_section')}}>Body Third Section</button>*/}
            //         {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*/}
            //         {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>sleeve</button>*/}
            //     </div>
            //     {/*<div className="btn-group" role="group" aria-label="Basic example" style={{width:"100%"}}>*/}
            //     {/*    <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('back_second_part')}}>Back</button>*/}
            //     {/*    /!*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*!/*/}
            //     {/*    <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>Sleeve</button>*/}
            //     {/*</div>*/}
            //     {colorShow &&
            //     <div style={{marginLeft: "50px", display: "inline"}}>
            //         <p> Choose color</p>
            //
            //         <CirclePicker
            //             color={color}
            //             onChangeComplete={handleChangeComplete}
            //         />
            //         <br></br>
            //         <div id="output-text">
            //             <input onChange={handleInput} placeholder="Enter text"/>
            //             <button type='button'
            //                     name='text_show'
            //                     onClick={textShow}
            //                     style={{
            //                         backgroundColor: "#767FE0",
            //                         color: "white",
            //                         border: "none",
            //                         borderRadius: "50px",
            //                         width: "120px",
            //                         height: "30px",
            //                         margin: "10px"
            //                     }}>
            //                 Add Text
            //             </button>
            //             <br></br>
            //
            //             <select id="input-font" onChange={changeFontStyle(this)}>
            //
            //                 <option value="Comic Sans"
            //                         selected="selected">
            //                     Comic Sans
            //                 </option>
            //                 <option value="Arial">Arial</option>
            //                 <option value="fantasy">Fantasy</option>
            //                 <option value="cursive">cursive</option>
            //             </select>
            //             <select id="input-font" style={{marginLeft: "10px"}}>
            //
            //                 <option value="Normal"
            //                         selected="selected">
            //                     Normal
            //                 </option>
            //                 <option value="Arial" style={{fontStyle: "bolder"}}>Bold</option>
            //                 <option value="fantasy" style={{fontStyle: "italic"}}>Italic</option>
            //                 <option value="cursive" style={{fontStyle: "underline"}}>Underline</option>
            //             </select>
            //             <br></br>
            //             <div style={{width: "300px", float: "right"}}>
            //                 <div style={{
            //                     width: "300px",
            //                     height: "300px",
            //                     border: "solid",
            //                     borderColor: "black",
            //                     borderWidth: "1px",
            //                     float: "right",
            //                     marginRight: "-980px",
            //                     marginTop: "-200px"
            //                 }}>
            //                     <button onClick={getSampleImages}>Load Images</button>
            //                     {
            //                         img ?
            //                             img.map((s) =>
            //                                 <img src={s.image} alt={''} style={{width: "50px", height: "50px"}}
            //                                      onClick={() => {
            //                                          load_logo(s.image)
            //                                      }}/>
            //                             )
            //                             : null}
            //                 </div>
            //
            //             </div>
            //             <br></br>
            //
            //         </div>
            //     </div>
            //     }
            // </div>
            }
            {selectedTab === 2 &&
            <div className='row' style={{width: "100%"}}>
                <div className="btn-group" role="group" aria-label="Basic example" style={{width: "100%"}}>
                    {displyComponents &&
                    displyComponents.map((item, index) => {
                        return (
                            <button key={index} type="button" className="btn btn-secondary" onClick={() => {
                                onComponentClick(item)
                            }}>{item}</button>
                        )
                    })
                    }
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_first_section')}}>Body First Section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_second_section')}}>Body second section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_third_section')}}>Body Third Section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>sleeve</button>*/}
                </div>
                {/*<div className="btn-group" role="group" aria-label="Basic example" style={{width:"100%"}}>*/}
                {/*    <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_upper_part')}}>Left Sleeve</button>*/}
                {/*    /!*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*!/*/}
                {/*    <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_lower_part')}}>Right Sleeve</button>*/}
                {/*</div>*/}
                {colorShow &&
                <div style={{marginLeft: "50px", display: "inline"}}>
                    {/*<p> Choose color</p>*/}

                    {/*<CirclePicker*/}
                    {/*    color={color}*/}
                    {/*    onChangeComplete={handleChangeComplete}*/}
                    {/*/>*/}
                    <br></br>
                    <div id="output-text">
                        <input onChange={handleInput} placeholder="Enter text"/>
                        <button type='button'
                                name='text_show'
                                onClick={textShow}
                                style={{
                                    backgroundColor: "#767FE0",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50px",
                                    width: "120px",
                                    height: "30px",
                                    margin: "10px"
                                }}>
                            Add Text
                        </button>
                        <br></br>

                        <select id="input-font" onChange={changeFontStyle(this)}>

                            <option value="Comic Sans"
                                    selected="selected">
                                Comic Sans
                            </option>
                            <option value="Arial">Arial</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="cursive">cursive</option>
                        </select>
                        <select id="input-font" style={{marginLeft: "10px"}}>

                            <option value="Normal"
                                    selected="selected">
                                Normal
                            </option>
                            <option value="Arial" style={{fontStyle: "bolder"}}>Bold</option>
                            <option value="fantasy" style={{fontStyle: "italic"}}>Italic</option>
                            <option value="cursive" style={{fontStyle: "underline"}}>Underline</option>
                        </select>
                        <br></br>
                        <div style={{width: "300px", float: "right", marginTop: "100px"}}>
                            <div style={{
                                width: "300px",
                                height: "300px",
                                border: "solid",
                                borderColor: "black",
                                borderWidth: "1px",
                                float: "right",
                                marginRight: "-900px",
                                marginTop: "-150px"
                            }}>
                                <button onClick={getSampleImages}>Load Images</button>
                                {
                                    img ?
                                        img.map((s) =>
                                            <img src={s.image} alt={''} style={{width: "50px", height: "50px"}}
                                                 onClick={() => {
                                                     load_sleeve_logo(s.image)
                                                 }}/>
                                        )
                                        : null}
                            </div>

                        </div>
                        <br></br>

                    </div>
                </div>
                }
            </div>
            }
            {selectedTab === 3 &&
            <div className='row' style={{width: "100%"}}>
                <div className="btn-group" role="group" aria-label="Basic example" style={{width: "100%"}}>
                    {displyComponents &&
                    displyComponents.map((item, index) => {
                        return (
                            <button key={index} type="button" className="btn btn-secondary" onClick={() => {
                                onComponentClick(item)
                            }}>{item}</button>
                        )
                    })
                    }
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_first_section')}}>Body First Section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_second_section')}}>Body second section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_third_section')}}>Body Third Section</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*/}
                    {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>sleeve</button>*/}
                </div>
                {/*<div className="btn-group" role="group" aria-label="Basic example" style={{width:"100%"}}>*/}
                {/*    <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_upper_part')}}>Left Sleeve</button>*/}
                {/*    /!*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*!/*/}
                {/*    <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_lower_part')}}>Right Sleeve</button>*/}
                {/*</div>*/}
                {colorShow &&
                <div style={{marginLeft: "50px", display: "inline"}}>
                    {/*<p> Choose color</p>*/}

                    {/*<CirclePicker*/}
                    {/*    color={color}*/}
                    {/*    onChangeComplete={handleChangeComplete}*/}
                    {/*/>*/}
                    <br></br>
                    <div id="output-text">
                        <input onChange={handleInput} placeholder="Enter text"/>
                        <button type='button'
                                name='text_show'
                                onClick={textShow}
                                style={{
                                    backgroundColor: "#767FE0",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50px",
                                    width: "120px",
                                    height: "30px",
                                    margin: "10px"
                                }}>
                            Add Text
                        </button>
                        <br></br>

                        <select id="input-font" onChange={changeFontStyle(this)}>

                            <option value="Comic Sans"
                                    selected="selected">
                                Comic Sans
                            </option>
                            <option value="Arial">Arial</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="cursive">cursive</option>
                        </select>
                        <select id="input-font" style={{marginLeft: "10px"}}>

                            <option value="Normal"
                                    selected="selected">
                                Normal
                            </option>
                            <option value="Arial" style={{fontStyle: "bolder"}}>Bold</option>
                            <option value="fantasy" style={{fontStyle: "italic"}}>Italic</option>
                            <option value="cursive" style={{fontStyle: "underline"}}>Underline</option>
                        </select>
                        <br></br>
                        <div style={{width: "300px", float: "right", marginTop: "100px"}}>
                            <div style={{
                                width: "300px",
                                height: "300px",
                                border: "solid",
                                borderColor: "black",
                                borderWidth: "1px",
                                float: "right",
                                marginRight: "-900px",
                                marginTop: "-150px"
                            }}>
                                <button onClick={getSampleImages}>Load Images</button>
                                {
                                    img ?
                                        img.map((s) =>
                                            <img src={s.image} alt={''} style={{width: "50px", height: "50px"}}
                                                 onClick={() => {
                                                     load_sleeve_logo(s.image)
                                                 }}/>
                                        )
                                        : null}
                            </div>

                        </div>
                        <br></br>

                    </div>
                </div>
                }
            </div>
            }
            </div>
            <canvas id='canvas'>
                <div id="ans"></div>
            </canvas>

        </div>
    );


}

export default SamLocalEditorHoodieFront;

