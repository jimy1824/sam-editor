import React, {useEffect, useState, useRef} from "react";
// import THREELib from "three-js";
import {fabric} from "fabric";
import {saveAs} from 'file-saver'
import {v1 as uuid} from 'uuid';
import * as PIXI from 'pixi.js'
import $ from "jquery";
import { CirclePicker } from 'react-color';
import {Tabs, Tab, AppBar} from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css';
import {getProductDetail} from "../apiService";

const viewOptions = [
    'front',
    'back',
    'left',
    'right'
]
var fonts = ["Pacifico", "VT323", "Quicksand", "Inconsolata"];
var logo_demo = "http://localhost:8000/media/uploads/body/polo_logo.png";
var logo_img

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

    const [img, setImg] = useState(null);

    // tabs
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [color, setColor] = React.useState('#fff');
    const [selectedComponentId, setSelectedComponentId] = React.useState(null);
    const [colorShow, setColorShow] = React.useState(false);
    const handleTabChange = (event, newValue) => {
        setSelectedTab(newValue);
        if (newValue === 0) {
            frontImageLoad()
            // imageSaved()
        }
        if (newValue === 1) {
            backImageLoad()
        }
        if (newValue === 2) {
            rightImageLoad()
        }
        if (newValue === 3) {
            leftImageLoad()
        }


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
            frontImageLoad()
        }
    }, [product])

    function clearCanvas() {
        canvas.getObjects().forEach((obj) => {
            canvas.remove(obj)
        });
        canvas.renderAll()
    }

    const loadObject = (obj, id) => {
        console.log(id)
        fabric.Image.fromURL(obj.src, function (img) {
            img.id = id;
            img.filters = [new fabric.Image.filters.HueRotation()];
            if(obj.color){
                var hue=hexatoHSL(obj.color.hex)
                img.filters[0].rotation = hue
            }

            img.applyFilters()
            var cor = img.set(
                {
                    left: obj.left,
                    top: obj.top,
                    selectable: obj.selectable,

                })
            canvas.add(img);

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
            fill: "#00ffff",
            visible: true,
            fontWeight:"bold",
        });
        console.log(text)
        localStorage.setItem(text, JSON.stringify(text))
        canvas.add(text);

    }

    var changeFontStyle = function (font) {
           // document.getElementById("output-text")
           //              .style.fontWeight = "italic";
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
            localStorage.setItem(imageId, JSON.stringify(img));
            canvas.add(img);

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
        if(selectedComponentId==='sleeve'){
            var obj=JSON.parse(localStorage.getItem('right_sleeve'))
            loadObject(obj)
            var obj=JSON.parse(localStorage.getItem('left_sleeve'))
            loadObject(obj)
        }else {
            var obj=JSON.parse(localStorage.getItem(selectedComponentId))
            loadObject(obj)
        }
    }
    const handleChangeComplete = (color) => {
        if(selectedComponentId==='sleeve'){
            setColor(color)

            var obj=JSON.parse(localStorage.getItem('right_sleeve'))
            obj.color=color
            localStorage.setItem('right_sleeve', JSON.stringify(obj))


            var obj=JSON.parse(localStorage.getItem('left_sleeve'))
            obj.color=color
            localStorage.setItem('left_sleeve', JSON.stringify(obj))


        }else {
            if(selectedComponentId){
                var obj=JSON.parse(localStorage.getItem(selectedComponentId))
                obj.color=color
                localStorage.setItem(selectedComponentId, JSON.stringify(obj))
            }
            setColor(color)
            addColor()
        }


    };
    const onComponentClick=(componentId)=>{
        setSelectedComponentId(componentId)

        // setColor()
        setColorShow(true)
    }

    const load_logo = (l) => {
        var samImg = new Image();
        samImg.onload = function (imge) {
            console.log("inside function")
            var pug = new fabric.Image(samImg, {
                id:"imageID",
                width: 500,
                height: 500,
                innerWidth:200,
                innerHeight:200,

            });
            console.log(l,"ll")
            console.log(pug, "pug")
            canvas.add(pug);
            localStorage.setItem(samImg, JSON.stringify(imge));
        };
        samImg.src = l;

        console.log("Image Clicked", l)
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

    function frontImageLoad() {
        clearCanvas()
        let body = JSON.parse(localStorage.getItem('body'))
        if (body.body_first_section?.image) {
            if (localStorage.getItem('body_first_section')) {
                loadObject(JSON.parse(localStorage.getItem('body_first_section')))
            } else {
                loadImage(body.body_first_section.image, 'body_first_section', body.body_first_section.x_point, body.body_first_section.y_point)
            }

        }
        if (body.body_second_section?.image) {
            if (localStorage.getItem('body_second_section')) {
                loadObject(JSON.parse(localStorage.getItem('body_second_section')))
            } else {
                loadImage(body.body_second_section.image, 'body_second_section', body.body_second_section.x_point, body.body_second_section.y_point)
            }
        }
        if (body.body_third_section?.image) {
            if (localStorage.getItem('body_third_section')) {
                loadObject(JSON.parse(localStorage.getItem('body_third_section')))
            } else {
                loadImage(body.body_third_section.image, 'body_third_section', body.body_third_section.x_point, body.body_third_section.y_point)
            }
        }
        if (body.collar?.image) {
            if (localStorage.getItem('front-collar')) {
                loadObject(JSON.parse(localStorage.getItem('front-collar')))
            } else {
                loadImage(body.collar.image, 'front-collar', body.collar.x_point, body.collar.y_point)
            }
        }
        if (body.right_sleeve?.image) {
            if (localStorage.getItem('right_sleeve')) {
                loadObject(JSON.parse(localStorage.getItem('right_sleeve')))
            } else {
                loadImage(body.right_sleeve.image, 'right_sleeve', body.right_sleeve.x_point, body.right_sleeve.y_point)
            }
        }

        if (body.left_sleeve?.image) {
            if (localStorage.getItem('left_sleeve')) {
                loadObject(JSON.parse(localStorage.getItem('left_sleeve')))
            } else {
                loadImage(body.left_sleeve.image, 'left_sleeve', body.left_sleeve.x_point, body.left_sleeve.y_point)

            }
        }
    }

    function backImageLoad() {
        clearCanvas()
        let back = JSON.parse(localStorage.getItem('back'))
        if (back.back_first_part?.image) {
            if (localStorage.getItem('back_first_part')) {
                loadObject(JSON.parse(localStorage.getItem('back_first_part')))
            } else {
                loadImage(
                    back.back_first_part.image,
                    'back_first_part',
                    back.back_first_part.x_point,
                    back.back_first_part.y_point,
                )
            }

        }

        if (back.back_second_part?.image) {
            if (localStorage.getItem('back_second_part')) {
                loadObject(JSON.parse(localStorage.getItem('back_second_part')))
            } else {
                loadImage(
                    back.back_second_part.image,
                    'back_second_part',
                    back.back_second_part.x_point,
                    back.back_second_part.y_point,
                )
            }
        }

        if (back.back_third_part?.image) {
            if (localStorage.getItem('back_third_part')) {
                loadObject(JSON.parse(localStorage.getItem('back_third_part')))
            } else {
                loadImage(
                    back.back_third_part.image,
                    'back_third_part',
                    back.back_third_part.x_point,
                    back.back_third_part.y_point,
                )
            }
        }

        if (back.back_left_sleeve?.image) {
            console.log(back.back_left_sleeve?.image)
            if (localStorage.getItem('back_left_sleeve')) {
                loadObject(JSON.parse(localStorage.getItem('back_left_sleeve')))
            } else {
                loadImage(
                    back.back_left_sleeve.image,
                    'back_left_sleeve',
                    back.back_left_sleeve.x_point,
                    back.back_left_sleeve.y_point,
                )
            }
        }

        if (back.back_right_sleeve?.image) {
            if (localStorage.getItem('back_right_sleeve')) {
                loadObject(JSON.parse(localStorage.getItem('back_right_sleeve')))
            } else {
                loadImage(
                    back.back_right_sleeve.image,
                    'back_right_sleeve',
                    back.back_right_sleeve.x_point,
                    back.back_right_sleeve.y_point,
                )
            }
        }
    }

    const leftImageLoad = (e) => {
        clearCanvas()
        let left = JSON.parse(localStorage.getItem('left'))

        if (left?.left_v_body_view?.image) {
            if (localStorage.getItem('left_v_body_view')) {
                loadObject(JSON.parse(localStorage.getItem('left_v_body_view')))
            } else {
                loadImage(
                    left.left_v_body_view.image,
                    'left_v_body_view',
                    left.left_v_body_view.x_point,
                    left.left_v_body_view.y_point,
                )
            }

        }

        if (left.left_v_upper_part?.image) {
            if (localStorage.getItem('left_v_upper_part')) {
                loadObject(JSON.parse(localStorage.getItem('left_v_upper_part')))
            } else {
                loadImage(
                    left.left_v_upper_part.image,
                    'left_v_upper_part',
                    left.left_v_upper_part.x_point,
                    left.left_v_upper_part.y_point,
                )
            }
        }

        if (left?.left_v_lower_part?.image) {
            if (localStorage.getItem('left_v_lower_part')) {
                loadObject(JSON.parse(localStorage.getItem('left_v_lower_part')))
            } else {
                loadImage(
                    left.left_v_lower_part.image,
                    'left_v_lower_part',
                    left.left_v_lower_part.x_point,
                    left.left_v_lower_part.y_point,
                )
            }
        }

    }

    const rightImageLoad = (e) => {
        clearCanvas()
        let right = JSON.parse(localStorage.getItem('right'))

        if (right.right_v_body_view?.image) {
            if (localStorage.getItem('right_v_body_view')) {
                loadObject(JSON.parse(localStorage.getItem('right_v_body_view')))
            } else {
                loadImage(
                    right.right_v_body_view.image,
                    'right_v_body_view',
                    right.right_v_body_view.x_point,
                    right.right_v_body_view.y_point,
                )
            }
        }
        if (right.right_v_upper_part?.image) {
            if (localStorage.getItem('right_v_upper_part')) {
                loadObject(JSON.parse(localStorage.getItem('right_v_upper_part')))
            } else {
                loadImage(
                    right.right_v_upper_part.image,
                    'right_v_upper_part',
                    right.right_v_upper_part.x_point,
                    right.right_v_upper_part.y_point,
                )
            }
        }

        if (right.right_v_lower_part?.image) {
            if (localStorage.getItem('right_v_lower_part')) {
                loadObject(JSON.parse(localStorage.getItem('right_v_lower_part')))
            } else {
                loadImage(
                    right.right_v_lower_part.image,
                    'right_v_lower_part',
                    right.right_v_lower_part.x_point,
                    right.right_v_lower_part.y_point,
                )
            }
        }

    }

    const getSampleImages = (s) => {
        var url = 'http://localhost:8000/api/logos';

        fetch(url)
            .then(function(response){
                return response.json();
            })
            .then(function (data){
                console.log(data)
                setImg(data)

            })
    }

    function displaySample(img_sample){
        document.getElementById('sample_images').src = img_sample;
    }

    function imageSaved(i){
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


    const hexatoHSL=(hex)=> {
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
        var colorInHSL =  h;
        return colorInHSL
    }

    // Sleeve Functions
    const red_btn_clicked_sleeve_right = (e) => {
        // var random = color
        // rightSleevImage.filters[0].rotation = 0.04339308661309316
        // rightSleevImage.applyFilters();
        // canvas.requestRenderAll();

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
                    <div className="btn-group" role="group" aria-label="Basic example" style={{width:"100%"}}>
                        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_first_section')}}>Body First Section</button>
                        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_second_section')}}>Body second section</button>
                        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_third_section')}}>Body Third Section</button>
                        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>
                        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>sleeve</button>
                    </div>

                    {colorShow &&
                    <div>
                        <div style={{width:"400px", float:"left", marginLeft:"20px"}}>
                     <p> Choose Body color</p>
                    <CirclePicker
                        color={ color }
                        onChangeComplete={ handleChangeComplete}
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

                            <select id="input-font" onChange={changeFontStyle (this)}>

                            <option value="Comic Sans"
                                    selected="selected">
                                Comic Sans
                            </option>
                            <option value="Arial">Arial</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="cursive">cursive</option>
                        </select>
                            <select id="input-font" style={{marginLeft:"10px"}}>

                            <option value="Normal"
                                    selected="selected">
                                Normal
                            </option>
                            <option value="Arial" style={{fontStyle:"bolder"}}>Bold</option>
                            <option value="fantasy" style={{fontStyle:"italic"}}>Italic</option>
                            <option value="cursive" style={{fontStyle:"underline"}}>Underline</option>
                        </select>

                        </div>
                            <br></br>
                        <CirclePicker
                        // color={ name }
                        // onChangeComplete={ handleChangeComplete}
                    />
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
                        <div style={{width:"300px", float:"right"}}>
                            <div style={{width:"300px", height:"300px", border:"solid", borderColor:"black", borderWidth:"1px", float:"right", marginRight:"-500px", marginTop:"10px"}}>
                                <button onClick={getSampleImages}>Load Images</button>
                                {
                                    img?
                                    img.map((s) =>
                                             <img src={s.image} alt={''} style={{width:"50px", height:"50px"}} onClick={()=> {load_logo(s.image)}}/>

                                    )
                                :null}
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
                <div className='row' style={{width:"100%"}}>
                    <div className="btn-group" role="group" aria-label="Basic example" style={{width:"100%"}}>
                        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('back_second_part')}}>Back</button>
                        {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*/}
                        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>Sleeve</button>
                    </div>
                    {colorShow &&
                    <div style={{marginLeft:"50px", display:"inline"}}>
                     <p> Choose color</p>

                    <CirclePicker
                        color={ color }
                        onChangeComplete={ handleChangeComplete}
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

                            <select id="input-font" onChange={changeFontStyle (this)}>

                            <option value="Comic Sans"
                                    selected="selected">
                                Comic Sans
                            </option>
                            <option value="Arial">Arial</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="cursive">cursive</option>
                        </select>
                            <select id="input-font" style={{marginLeft:"10px"}}>

                            <option value="Normal"
                                    selected="selected">
                                Normal
                            </option>
                            <option value="Arial" style={{fontStyle:"bolder"}}>Bold</option>
                            <option value="fantasy" style={{fontStyle:"italic"}}>Italic</option>
                            <option value="cursive" style={{fontStyle:"underline"}}>Underline</option>
                        </select>
                            <br></br>
                            <br></br>

                        </div>
                    </div>
                    }
                </div>
                }
                {selectedTab === 2 &&
                <div className='row' style={{width:"100%"}}>
                    <div className="btn-group" role="group" aria-label="Basic example" style={{width:"100%"}}>
                        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_upper_part')}}>upper Sleeve</button>
                        {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*/}
                        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_lower_part')}}>Lower Sleeve</button>
                    </div>
                    {colorShow &&
                    <div style={{marginLeft:"50px", display:"inline"}}>
                     <p> Choose color</p>

                    <CirclePicker
                        color={ color }
                        onChangeComplete={ handleChangeComplete }
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

                            <select id="input-font" onChange={changeFontStyle (this)}>

                            <option value="Comic Sans"
                                    selected="selected">
                                Comic Sans
                            </option>
                            <option value="Arial">Arial</option>
                            <option value="fantasy">Fantasy</option>
                            <option value="cursive">cursive</option>
                        </select>
                            <select id="input-font" style={{marginLeft:"10px"}}>

                            <option value="Normal"
                                    selected="selected">
                                Normal
                            </option>
                            <option value="Arial" style={{fontStyle:"bolder"}}>Bold</option>
                            <option value="fantasy" style={{fontStyle:"italic"}}>Italic</option>
                            <option value="cursive" style={{fontStyle:"underline"}}>Underline</option>
                        </select>
                            <br></br>
                            <br></br>

                        </div>
                    </div>
                    }
                </div>
                }
                {selectedTab === 3 && <div>

                    <div className='row' style={{width:"100%"}}>
                        <div className="btn-group" role="group" aria-label="Basic example" style={{width:"100%"}}>
                            <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_upper_part')}}>Left Sleeve</button>
                            {/*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*/}
                            <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_lower_part')}}>Right Sleeve</button>
                        </div>
                        {colorShow &&
                        <div style={{marginLeft:"50px", display:"inline"}}>
                            <p> Choose color</p>

                            <CirclePicker
                                color={ color }
                                onChangeComplete={ handleChangeComplete }
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

                                <select id="input-font" onChange={changeFontStyle (this)}>

                                    <option value="Comic Sans"
                                            selected="selected">
                                        Comic Sans
                                    </option>
                                    <option value="Arial">Arial</option>
                                    <option value="fantasy">Fantasy</option>
                                    <option value="cursive">cursive</option>
                                </select>
                                <select id="input-font" style={{marginLeft:"10px"}}>

                                    <option value="Normal"
                                            selected="selected">
                                        Normal
                                    </option>
                                    <option value="Arial" style={{fontStyle:"bolder"}}>Bold</option>
                                    <option value="fantasy" style={{fontStyle:"italic"}}>Italic</option>
                                    <option value="cursive" style={{fontStyle:"underline"}}>Underline</option>
                                </select>
                                <br></br>
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

