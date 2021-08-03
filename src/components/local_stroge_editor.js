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
import {getProductDetail} from "../apiService";
import {Link} from "react-router-dom";
import {MEDIA_URL} from "../services";
import {BASE_URL} from "../services";
import axios from "axios";

const viewOptions = [
    'front',
    'back',
    'left',
    'right'
]
var fonts = ["Pacifico", "VT323", "Quicksand", "Inconsolata"];
var logo_img

let addingComponent =null

function SamLocalEditor(props) {
    let {id} = props.match.params
    const [product, setProduct] = useState(null);
    useEffect(() => {
        getProductDetail(id)
            .then(items => {
                localStorage.setItem('body', JSON.stringify(items.front_view));
                localStorage.setItem('back', JSON.stringify(items.back_view));
                localStorage.setItem('left', JSON.stringify(items.left_view));
                localStorage.setItem('right', JSON.stringify(items.right_view));
                setProduct(items)
            })
    }, [])

    const [canvas, setCanvas] = useState(null)
    const [name, setName] = useState(null);
    let [image, setImage] = useState(null);

    const [selectedFile, setSelectedFile] = useState(null)

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
            setComponents('body')
            setSelectedComponentId(null)
            setColorShow(false)
            // imageSaved()
        }
        if (newValue === 1) {
            backImageLoad()
            setComponents('back')
            setSelectedComponentId(null)
            setColorShow(false)
        }
        if (newValue === 2) {
            rightImageLoad()
            setComponents('right')
            setSelectedComponentId(null)
            setColorShow(false)
        }
        if (newValue === 3) {
            leftImageLoad()
            setComponents('left')
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
        localStorage.clear();
        setCanvas(initCanvas('canvas'));
    }, []);
    useEffect(() => {
        if (product) {
            preFrontImageLoad()
            prebackImageLoad()
            preleftImageLoad()
            prerightImageLoad()
            frontImageLoad()
            setComponents('body')
            // setComponents('back', false)
            // setComponents('left', false)
            // setComponents('right', false)
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
            console.log(obj)
            // img.id = id;
            // img.filters = [new fabric.Image.filters.HueRotation()];
            if (obj.color) {
                // multiply, add, diff, screen, subtract, darken, lighten, overlay, exclusion, tint
                //  screen, overlay
                img.filters.push(new fabric.Image.filters.BlendColor({
                    color: obj.color.hex,
                    mode: 'multiply',
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
            if (obj.logo) {
                // obj.logo.left = 50
                // obj.logo.top = 100
                // obj.logo.selectable = false
                console.log(obj, "obj")
                // obj.logo.bringToFront(true)
                fabric.Image.fromObject(obj.logo, function (logo) {

                    logo.bringForward(true)

                    logo.bringToFront(true)
                    canvas.add(logo);
                })

            }
            if (obj.text) {
                fabric.Textbox.fromObject(obj.text, function (text) {
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
        var text = new fabric.Textbox(name, {
            fontFamily: 'Pacifico',
            fontSize: 20,
            top: 120,
            left: 130,
            fill: "#00ffff",
            visible: true,
            fontWeight: "bold",
        });

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
            img.component_type = 'sleeve'
            img.filters = [new fabric.Image.filters.HueRotation()];
            img.applyFilters()
            var cor = img.set(
                {
                    left: left,
                    top: top,
                    selectable: false,


                })

            canvas.add(img);
            console.log(img, "abc")
            localStorage.setItem(imageId, JSON.stringify(img));
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
        var obj = JSON.parse(localStorage.getItem(selectedComponentId))
        obj.type = 'sleeve'
        console.log(obj, "objec")
        if (selectedComponentId === 'right_sleeve') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('left_sleeve'))
            obj.color = color
            localStorage.setItem('left_sleeve', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('left_sleeve')))

            // if(localStorage.getItem('back_left_sleeve')){
            //     var obj_b = JSON.parse(localStorage.getItem('back_left_sleeve'))
            //     obj_b.color = color
            //     localStorage.setItem('back_left_sleeve', JSON.stringify(obj_b))
            // }
            //
            // if(localStorage.getItem('right_v_upper_part')){
            //     var obj_u = JSON.parse(localStorage.getItem('right_v_upper_part'))
            //     obj_u.color = color
            //     localStorage.setItem('right_v_upper_part', JSON.stringify(obj_u))
            // }
            //
            // if(localStorage.getItem('right_v_lower_part')){
            //     var obj_l = JSON.parse(localStorage.getItem('right_v_lower_part'))
            //     obj_l.color = color
            //     localStorage.setItem('right_v_lower_part', JSON.stringify(obj_l))
            // }
            //
            // if(localStorage.getItem('right_v_body_view')){
            //     var obj_body = JSON.parse(localStorage.getItem('right_v_body_view'))
            //     obj_body.color = color
            //     localStorage.setItem('right_v_body_view', JSON.stringify(obj_body))
            // }

            var obj = JSON.parse(localStorage.getItem('back_right_sleeve'))
            obj.color = color
            localStorage.setItem('back_right_sleeve', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_v_body_view'))
            obj.color = color
            localStorage.setItem('right_v_body_view', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_v_upper_part'))
            obj.color = color
            localStorage.setItem('right_v_upper_part', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('right_v_lower_part'))
            obj.color = color
            localStorage.setItem('right_v_lower_part', JSON.stringify(obj))

        }

        else if (selectedComponentId === 'left_sleeve') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('right_sleeve'))
            obj.color = color
            localStorage.setItem('right_sleeve', JSON.stringify(obj))
            loadObject(JSON.parse(localStorage.getItem('right_sleeve')))

            var obj = JSON.parse(localStorage.getItem('back_left_sleeve'))
            obj.color = color
            localStorage.setItem('back_left_sleeve', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('left_v_body_view'))
            obj.color = color
            localStorage.setItem('left_v_body_view', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('left_v_upper_part'))
            obj.color = color
            localStorage.setItem('left_v_upper_part', JSON.stringify(obj))

            var obj = JSON.parse(localStorage.getItem('left_v_lower_part'))
            obj.color = color
            localStorage.setItem('left_v_lower_part', JSON.stringify(obj))

        } else {
            if (selectedComponentId) {
                var obj = JSON.parse(localStorage.getItem(selectedComponentId))
                obj.color = color
                localStorage.setItem(selectedComponentId, JSON.stringify(obj))
            }
            setColor(color)
            addColor()
        }


    };
    const onComponentClick = (componentId) => {
        setSelectedComponentId(componentId)
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

            if(selectedComponentId) {
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
            // if (selectedComponentId) {
            //     var obj_pug = JSON.parse(localStorage.getItem('right_v_body_view'))
            //
            //     obj_pug.logo = pug
            //     localStorage.setItem('right_v_body_view', JSON.stringify(obj_pug))
            //     addingComponent = 'logo';
            // }

             if (selectedComponentId === 'left_v_body_view') {
                var obj_pug_left = JSON.parse(localStorage.getItem('left_v_body_view'))

                obj_pug_left.logo = pug
                localStorage.setItem('left_v_body_view', JSON.stringify(obj_pug_left))
                addingComponent = 'logo';
            }

             else if (selectedComponentId === 'right_v_body_view') {
                var obj_pug_right = JSON.parse(localStorage.getItem('right_v_body_view'))

                obj_pug_right.logo = pug
                localStorage.setItem('right_v_body_view', JSON.stringify(obj_pug_right))
                addingComponent = 'logo';
            }
        };

        samImg.src = l;


        var l_logo = new Image();
        l_logo.onload = function (left_logo) {
            var left_logo = new fabric.Image(l_logo, {
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
            canvas.add(left_logo);
            if (selectedComponentId === 'left_v_body_view') {

                var obj_logo_left_upper = JSON.parse(localStorage.getItem('left_v_upper_part'))
                obj_logo_left_upper.logo = left_logo
                localStorage.setItem('left_v_upper_part', JSON.stringify(obj_logo_left_upper))
                addingComponent = 'logo';


            }

            else if (selectedComponentId === 'right_v_body_view') {

                var obj_logo_right_upper = JSON.parse(localStorage.getItem('right_v_upper_part'))
                obj_logo_right_upper.logo = left_logo
                localStorage.setItem('right_v_upper_part', JSON.stringify(obj_logo_right_upper))
                addingComponent = 'logo';

                var obj_logo_front_right = JSON.parse(localStorage.getItem('left_sleeve'))
                console.log(obj_logo_front_right, "abc")
                obj_logo_front_right.logo = left_logo
                localStorage.setItem('left_sleeve', JSON.stringify(obj_logo_front_right))
                addingComponent = 'logo';

                var obj_logo_front_right = JSON.parse(localStorage.getItem('back_right_sleeve'))
                console.log(obj_logo_front_right, "abc")
                obj_logo_front_right.logo = left_logo
                localStorage.setItem('back_right_sleeve', JSON.stringify(obj_logo_front_right))
                addingComponent = 'logo';
            }
        }
        l_logo.src = l;



        var r_logo = new Image();
        r_logo.onload = function (left_logo) {
            var right_logo = new fabric.Image(r_logo, {
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
            canvas.add(right_logo);

            if (selectedComponentId === 'left_v_body_view'){
                var obj_logo_left_lower = JSON.parse(localStorage.getItem('left_v_lower_part'))
                obj_logo_left_lower.logo = right_logo
                localStorage.setItem('left_v_lower_part', JSON.stringify(obj_logo_left_lower))
                console.log("lower_part", obj_logo_left_lower)
                addingComponent = 'logo';

                var obj_logo_front_left= JSON.parse(localStorage.getItem('right_sleeve'))
                obj_logo_front_left.logo = right_logo
                localStorage.setItem('right_sleeve', JSON.stringify(obj_logo_front_left))
                addingComponent = 'logo';

                var obj_logo_front_left= JSON.parse(localStorage.getItem('back_left_sleeve'))
                obj_logo_front_left.logo = right_logo
                localStorage.setItem('back_left_sleeve', JSON.stringify(obj_logo_front_left))
                addingComponent = 'logo';

                // var obj_logo_left_lower = JSON.parse(localStorage.getItem('left_sleeve'))
                // console.log(obj_logo_left_lower, "left_sleeve")
                // obj_logo_left_lower.logo = right_logo
                // localStorage.setItem('left_sleeve', JSON.stringify(obj_logo_left_lower))
                // console.log("lower_part", obj_logo_left_lower)
                // addingComponent = 'logo';
            }

            else if (selectedComponentId === 'right_v_body_view'){
                var obj_logo_right_lower = JSON.parse(localStorage.getItem('right_v_lower_part'))
                obj_logo_right_lower.logo = right_logo
                localStorage.setItem('right_v_lower_part', JSON.stringify(obj_logo_right_lower))
                console.log("lower_part", obj_logo_right_lower)
                addingComponent = 'logo';
            }

            // if (selectedComponentId) {
            //     var obj_right_logo = JSON.parse(localStorage.getItem('right_v_lower_part'))
            //
            //     obj_right_logo.logo = right_logo
            //     localStorage.setItem('right_v_lower_part', JSON.stringify(obj_right_logo))
            //     addingComponent = 'logo';
            // }

            //  if (selectedComponentId) {
            //     var obj_right_logo = JSON.parse(localStorage.getItem('left_v_lower_part'))
            //
            //     obj_right_logo.logo = right_logo
            //     localStorage.setItem('left_v_lower_part', JSON.stringify(obj_right_logo))
            //     addingComponent = 'logo';
            // }
        }
        r_logo.src = l;

    }

    // function download_Image() {
    //     var canvas = document.getElementById("canv");
    //     var image = canvas.toDataURL("image/png", 1.0).replace("image/svg", "image/octet-stream");
    //     var link = document.createElement('a');
    //     link.download = "Your_Product_Design.svg";
    //     link.href = image;
    //     link.click();
// }
    function frontImageLoad() {
        clearCanvas()
        let body = JSON.parse(localStorage.getItem('body'))
        if (body.body_first_section?.image) {
            var body_first_section=JSON.parse(localStorage.getItem('body_first_section'))
            if (body_first_section) {
                loadObject(body_first_section)

            }
        }
        if (body.body_second_section?.image) {
            var body_second_section=JSON.parse(localStorage.getItem('body_second_section'))
            if (body_second_section) {
                loadObject(body_second_section)
            }
        }
        if (body.body_third_section?.image) {
            var body_third_section=JSON.parse(localStorage.getItem('body_third_section'))
            if (body_third_section) {
                loadObject(body_third_section)

            }
        }
        if (body.collar?.image) {
            var collar =JSON.parse(localStorage.getItem('collar'))
            if (collar) {
                loadObject(collar)
            }
        }
        if (body.right_sleeve?.image) {
            var right_sleeve=JSON.parse(localStorage.getItem('right_sleeve'))
            if (right_sleeve) {
                loadObject(right_sleeve)
            }
        }

        if (body.left_sleeve?.image) {
            var left_sleeve=JSON.parse(localStorage.getItem('left_sleeve'))
            if (left_sleeve) {
                loadObject(left_sleeve)

            }
        }
    }

    function preFrontImageLoad() {
        let body = JSON.parse(localStorage.getItem('body'))
        if (body.body_first_section?.image) {

            loadImage(body.body_first_section.image,
                'body_first_section',
                body.body_first_section.x_point,
                body.body_first_section.y_point)

        }
        if (body.body_second_section?.image) {

            loadImage(body.body_second_section.image, 'body_second_section', body.body_second_section.x_point, body.body_second_section.y_point)
        }
        if (body.body_third_section?.image) {
            loadImage(body.body_third_section.image, 'body_third_section', body.body_third_section.x_point, body.body_third_section.y_point)
        }
        if (body.collar?.image) {
            loadImage(body.collar.image, 'collar', body.collar.x_point, body.collar.y_point)
        }
        if (body.right_sleeve?.image) {
            loadImage(body.right_sleeve.image, 'right_sleeve', body.right_sleeve.x_point, body.right_sleeve.y_point)
        }

        if (body.left_sleeve?.image) {

            loadImage(body.left_sleeve.image, 'left_sleeve', body.left_sleeve.x_point, body.left_sleeve.y_point)
        }
    }

    function backImageLoad() {
        clearCanvas()
        let back = JSON.parse(localStorage.getItem('back'))

        if (back.back_first_part?.image) {
            var back_first_part=JSON.parse(localStorage.getItem('back_first_part'))
            if (back_first_part) {
                loadObject(back_first_part)
            }
        }

        if (back.back_second_part?.image) {
           var back_second_part=JSON.parse(localStorage.getItem('back_second_part'))
            if (back_second_part) {
                loadObject(back_second_part)
            }
        }

        if (back.back_third_part?.image) {
            var back_third_part=JSON.parse(localStorage.getItem('back_third_part'))
            if (back_third_part) {
                loadObject(back_third_part)
            }
        }

        if (back.back_left_sleeve?.image) {
            var back_left_sleeve=JSON.parse(localStorage.getItem('back_left_sleeve'))
            if (back_left_sleeve) {
                loadObject(back_left_sleeve)
            }
        }

        if (back.back_right_sleeve?.image) {
            var back_right_sleeve=JSON.parse(localStorage.getItem('back_right_sleeve'))
            if (back_right_sleeve) {
                loadObject(back_right_sleeve)
            }
        }
    }

    function prebackImageLoad() {
        let back = JSON.parse(localStorage.getItem('back'))
        if (back.back_first_part?.image) {
            preloadImge(
                    back.back_first_part.image,
                    'back_first_part',
                    back.back_first_part.x_point,
                    back.back_first_part.y_point,
                )
        }

        if (back.back_second_part?.image) {
            preloadImge(
                    back.back_second_part.image,
                    'back_second_part',
                    back.back_second_part.x_point,
                    back.back_second_part.y_point,
                )
        }

        if (back.back_third_part?.image) {

            preloadImge(
                    back.back_third_part.image,
                    'back_third_part',
                    back.back_third_part.x_point,
                    back.back_third_part.y_point,
                )
        }

        if (back.back_left_sleeve?.image) {

            preloadImge(
                    back.back_left_sleeve.image,
                    'back_left_sleeve',
                    back.back_left_sleeve.x_point,
                    back.back_left_sleeve.y_point,
                )

        }

        if (back.back_right_sleeve?.image) {

            preloadImge(
                    back.back_right_sleeve.image,
                    'back_right_sleeve',
                    back.back_right_sleeve.x_point,
                    back.back_right_sleeve.y_point,
                )

        }
    }

    const leftImageLoad = (e) => {
        clearCanvas()
        let left = JSON.parse(localStorage.getItem('left'))

        if (left?.left_v_body_view?.image) {
            var left_v_body_view=JSON.parse(localStorage.getItem('left_v_body_view'))
            if (left_v_body_view) {
                loadObject(left_v_body_view)
            }

        }

        if (left.left_v_upper_part?.image) {
             var left_v_upper_part=JSON.parse(localStorage.getItem('left_v_upper_part'))
            if (left_v_upper_part) {
                loadObject(left_v_upper_part)
            }
        }

        if (left?.left_v_lower_part?.image) {
             var left_v_lower_part=JSON.parse(localStorage.getItem('left_v_lower_part'))
            if (left_v_lower_part) {
                loadObject(left_v_lower_part)
            }
        }

        if (left?.left_v_left_s_upper?.image) {
            var left_v_left_s_upper=JSON.parse(localStorage.getItem('left_v_left_s_upper'))
            if (left_v_left_s_upper) {
                loadObject(left_v_left_s_upper)
            }
        }

        if (left?.left_v_left_s_lower?.image) {
            var left_v_left_s_lower=JSON.parse(localStorage.getItem('left_v_left_s_lower'))
            if (left_v_left_s_lower) {
                loadObject(left_v_left_s_lower)
            }
        }

        if (left?.left_v_right_s_upper?.image) {
            var left_v_right_s_upper=JSON.parse(localStorage.getItem('left_v_right_s_upper'))
            if (left_v_right_s_upper) {
                loadObject(left_v_right_s_upper)
            }
        }

        if (left?.left_v_right_s_lower?.image) {
            var left_v_right_s_lower=JSON.parse(localStorage.getItem('left_v_right_s_lower'))
            if (left_v_right_s_lower) {
                loadObject(left_v_right_s_lower)
            }
        }

    }

    const preleftImageLoad = (e) => {
        let left = JSON.parse(localStorage.getItem('left'))

        if (left?.left_v_body_view?.image) {

            preloadImge(
                    left.left_v_body_view.image,
                    'left_v_body_view',
                    left.left_v_body_view.x_point,
                    left.left_v_body_view.y_point,
                )


        }

        if (left.left_v_upper_part?.image) {

            preloadImge(
                    left.left_v_upper_part.image,
                    'left_v_upper_part',
                    left.left_v_upper_part.x_point,
                    left.left_v_upper_part.y_point,
                )
        }

        if (left?.left_v_lower_part?.image) {

            preloadImge(
                    left.left_v_lower_part.image,
                    'left_v_lower_part',
                    left.left_v_lower_part.x_point,
                    left.left_v_lower_part.y_point,
                )
        }

        if (left?.left_v_left_s_upper?.image) {

            preloadImge(
                    left.left_v_left_s_upper.image,
                    'left_v_left_s_upper',
                    left.left_v_left_s_upper.x_point,
                    left.left_v_left_s_upper.y_point,
                )
        }

        if (left?.left_v_left_s_lower?.image) {

            preloadImge(
                    left.left_v_left_s_lower.image,
                    'left_v_left_s_lower',
                    left.left_v_left_s_lower.x_point,
                    left.left_v_left_s_lower.y_point,
                )
        }

        if (left?.left_v_right_s_upper?.image) {

            preloadImge(
                    left.left_v_right_s_upper.image,
                    'left_v_right_s_upper',
                    left.left_v_right_s_upper.x_point,
                    left.left_v_right_s_upper.y_point,
                )
        }

        if (left?.left_v_right_s_lower?.image) {

            preloadImge(
                    left.left_v_right_s_lower.image,
                    'left_v_right_s_lower',
                    left.left_v_right_s_lower.x_point,
                    left.left_v_right_s_lower.y_point,
                )

        }

    }


    const rightImageLoad = (e) => {
        clearCanvas()
        let right = JSON.parse(localStorage.getItem('right'))

        if (right.right_v_body_view?.image) {
            var right_v_body_view=JSON.parse(localStorage.getItem('right_v_body_view'))
            if (right_v_body_view) {
                loadObject(right_v_body_view)
            }
        }

        if (right.right_v_upper_part?.image) {
            var right_v_upper_part=JSON.parse(localStorage.getItem('right_v_upper_part'))
            if (right_v_upper_part) {
                loadObject(right_v_upper_part)
            }
        }

        if (right.right_v_lower_part?.image) {
            var right_v_lower_part=JSON.parse(localStorage.getItem('right_v_lower_part'))
            if (right_v_lower_part) {
                loadObject(right_v_lower_part)
            }
        }

        if (right.right_v_left_s_upper?.image) {
            var right_v_left_s_upper=JSON.parse(localStorage.getItem('right_v_left_s_upper'))
            if (right_v_left_s_upper) {
                loadObject(right_v_left_s_upper)
            }
        }

        if (right.right_v_left_s_lower?.image) {
            var right_v_left_s_lower=JSON.parse(localStorage.getItem('right_v_left_s_lower'))
            if (right_v_left_s_lower) {
                loadObject(right_v_left_s_lower)
            }
        }

        if (right.right_v_right_s_upper?.image) {
           var right_v_right_s_upper=JSON.parse(localStorage.getItem('right_v_right_s_upper'))
            if (right_v_right_s_upper) {
                loadObject(right_v_right_s_upper)
            }
        }

        if (right.right_v_right_s_lower?.image) {
           var right_v_right_s_lower=JSON.parse(localStorage.getItem('right_v_right_s_lower'))
            if (right_v_right_s_lower) {
                loadObject(right_v_right_s_lower)
            }
        }
    }

    const prerightImageLoad = (e) => {
        let right = JSON.parse(localStorage.getItem('right'))

        if (right.right_v_body_view?.image) {

            preloadImge(
                    right.right_v_body_view.image,
                    'right_v_body_view',
                    right.right_v_body_view.x_point,
                    right.right_v_body_view.y_point,
                )

        }

        if (right.right_v_upper_part?.image) {
            preloadImge(
                    right.right_v_upper_part.image,
                    'right_v_upper_part',
                    right.right_v_upper_part.x_point,
                    right.right_v_upper_part.y_point,
                )
        }

        if (right.right_v_lower_part?.image) {

            preloadImge(
                    right.right_v_lower_part.image,
                    'right_v_lower_part',
                    right.right_v_lower_part.x_point,
                    right.right_v_lower_part.y_point,
                )

        }

        if (right.right_v_left_s_upper?.image) {

            preloadImge(
                    right.right_v_left_s_upper.image,
                    'right_v_left_s_upper',
                    right.right_v_left_s_upper.x_point,
                    right.right_v_left_s_upper.y_point,
                )

        }

        if (right.right_v_left_s_lower?.image) {

            preloadImge(
                    right.right_v_left_s_lower.image,
                    'right_v_left_s_lower',
                    right.right_v_left_s_lower.x_point,
                    right.right_v_left_s_lower.y_point,
                )

        }

        if (right.right_v_right_s_upper?.image) {

            preloadImge(
                    right.right_v_right_s_upper.image,
                    'right_v_right_s_upper',
                    right.right_v_right_s_upper.x_point,
                    right.right_v_right_s_upper.y_point,
                )
        }

        if (right.right_v_right_s_lower?.image) {

            preloadImge(
                    right.right_v_right_s_lower.image,
                    'right_v_right_s_lower',
                    right.right_v_right_s_lower.x_point,
                    right.right_v_right_s_lower.y_point,
                )
        }


    }

    const getSampleImages = (s) => {
        var url =BASE_URL+'logos';

        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
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

    const fileChangedHandler = (event) => {
        setSelectedFile(event.target.files[0])
    }
    const uploadHandler = async () => {
        console.log(selectedFile)
        const formData = new FormData()
        formData.append(
        'file',
        selectedFile

  )
  const {data} = await     axios.post(BASE_URL+'logos/upload_logo/', formData)
        console.log("jflkfjglfjglfl",data)
    }



    console.log(addingComponent, 'adding')
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
                            <div>
                                    <input type="file" onChange={(e)=>{fileChangedHandler(e)}}>
                                    </input>
                                <br></br>
                                <br></br>
                                <button onClick={() => {uploadHandler()}}>Upload Image</button>
                                </div>
                            <br></br>
                            {/*    <CirclePicker*/}
                            {/*    // color={ name }*/}
                            {/*    // onChangeComplete={ handleChangeComplete}*/}
                            {/*/>*/}
                            <br></br>


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
                                            <img src={s.image} alt={''} style={{width: "50px", height: "50px", marginLeft: "5px", marginTop:"5px"}}
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
                        {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('back_second_part')}}>Back</button>*/}
                        {/*/!*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*!/*/}
                        {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>Sleeve</button>*/}
                    </div>
                    {colorShow &&
                    <div style={{marginLeft: "50px", display: "inline"}}>
                        <p> Choose color</p>

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
                            <div style={{width: "300px", float: "right"}}>
                                <div style={{
                                    width: "300px",
                                    height: "300px",
                                    border: "solid",
                                    borderColor: "black",
                                    borderWidth: "1px",
                                    float: "right",
                                    marginRight: "-980px",
                                    marginTop: "-200px"
                                }}>
                                    <button onClick={getSampleImages}>Load Images</button>
                                    {
                                        img ?
                                            img.map((s) =>
                                                <img src={s.image} alt={''} style={{width: "50px", height: "50px", marginLeft: "5px", marginTop:"5px"}}
                                                     onClick={() => {
                                                         load_logo(s.image)
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
                        {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_upper_part')}}>upper Sleeve</button>*/}
                        {/*/!*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*!/*/}
                        {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_lower_part')}}>Lower Sleeve</button>*/}
                    </div>
                    {colorShow &&
                    <div style={{marginLeft: "50px", display: "inline"}}>
                        <p> Choose color</p>

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
                            <div style={{width: "300px", float: "right"}}>
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
                                                <img src={s.image} alt={''} style={{width: "50px", height: "50px", marginLeft: "5px", marginTop:"5px"}}
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
                {selectedTab === 3 && <div>
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
                            {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_upper_part')}}>Left Sleeve</button>*/}
                            {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*/}
                            {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_lower_part')}}>Right Sleeve</button>*/}
                        </div>
                        {colorShow &&
                        <div style={{marginLeft: "50px", display: "inline"}}>
                            <p> Choose color</p>

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
                                <div style={{width: "300px", float: "right"}}>
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
                                                <img src={s.image} alt={''} style={{width: "50px", height: "50px", marginLeft: "5px", marginTop:"5px"}}
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
                </div>}
            </div>
            <canvas id='canvas'>
                <div id="ans"></div>
            </canvas>

        </div>

    );


}

export default SamLocalEditor;

