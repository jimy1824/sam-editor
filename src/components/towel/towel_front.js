import React, {useEffect, useState, useRef} from "react";
import SamLocalEditorTowelBack from "./towel_back.js"
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

let addingComponent =null

function SamLocalEditorTowelFront(props) {
    let {id} = props.match.params
    const [product, setProduct] = useState(null);
    console.log(product, "product")
    useEffect(() => {
        getProductDetail(id)
            .then(items => {
                localStorage.setItem('front_view_towel', JSON.stringify(items.front_view_towel));
                localStorage.setItem('back_view_towel', JSON.stringify(items.back_view_towel));
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
            setComponents('front_view_towel')
            setSelectedComponentId(null)
            setColorShow(false)
            // imageSaved()
        }
        if (newValue === 1) {
            backImageLoad()
            setComponents('back_view_towel')
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
        setCanvas(initCanvas('canvas_towel'));
    }, []);
    useEffect(() => {
        if (product) {
            frontImageLoad()
            setComponents('front_view_towel')
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
            if (obj.color) {
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
            addingComponent='text';
        }
    }

    canvas?.on('after:render', function() {
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

                        fabric.Image.fromObject(obj.logo,function (test) {
                            test.scaleToHeight(bound.height)
                            test.scaleToWidth(bound.width);
                            obj.logo.scaleY=test.scaleY
                            obj.logo.scaleX=test.scaleX
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
        if (selectedComponentId === 'towel_front') {
            var obj = JSON.parse(localStorage.getItem('towel_front'))
            loadObject(obj)
        } else {
            var obj = JSON.parse(localStorage.getItem(selectedComponentId))
            loadObject(obj)
        }
    }
    const handleChangeComplete = (color) => {
        console.log(selectedComponentId, "selectedID")
        if (selectedComponentId === 'sleeve') {

            setColor(color)

            var obj = JSON.parse(localStorage.getItem('towel_front'))
            obj.color = color
            localStorage.setItem('towel_front', JSON.stringify(obj))


        } else {
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
        let front_view_towel = JSON.parse(localStorage.getItem('front_view_towel'))
        if (front_view_towel.towel_front?.image) {
            if (localStorage.getItem('towel_front')) {
                loadObject(JSON.parse(localStorage.getItem('towel_front')))
            } else {
                loadImage(
                    front_view_towel.towel_front.image,
                    'towel_front',
                    front_view_towel.towel_front.x_point,
                    front_view_towel.towel_front.y_point)
            }

        }
    }


    function backImageLoad() {
        clearCanvas()
        let back_view_towel = JSON.parse(localStorage.getItem('back_view_towel'))
        if (back_view_towel.towel_back?.image) {
            if (localStorage.getItem('towel_back')) {
                loadObject(JSON.parse(localStorage.getItem('towel_back')))
            } else {
                loadImage(
                    back_view_towel.towel_back.image,
                    'towel_back',
                    back_view_towel.towel_back.x_point,
                    back_view_towel.towel_back.y_point)
            }
        }
    }


    const getSampleImages = (s) => {
        var url = 'http://44.192.67.250/api/logos';

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
                    {/*        onComponentClick('towel_front')*/}
                    {/*    }}>Towel Body*/}
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
                <div className='row' style={{width:"100%"}}>
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
                    {/*    <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('back_second_part')}}>Back</button>*/}
                    {/*    /!*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*!/*/}
                    {/*    <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>Sleeve</button>*/}
                    {/*</div>*/}
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
                            <div style={{width:"300px", float:"right"}}>
                            <div style={{width:"300px", height:"300px", border:"solid", borderColor:"black", borderWidth:"1px", float:"right", marginRight:"-980px", marginTop:"-200px"}}>
                                <button onClick={getSampleImages}>Load Images</button>
                                {
                                    img?
                                    img.map((s) =>
                                             <img src={s.image} alt={''} style={{width:"50px", height:"50px"}} onClick={()=> {load_logo(s.image)}}/>

                                    )
                                :null}
                            </div>

                        </div>
                            <br></br>

                        </div>
                    </div>
                    }
                </div>
                // <SamLocalEditorTowelBack/>
                }

            </div>
            <canvas id='canvas'>
                <div id="ans"></div>
            </canvas>

        </div>

    );


}

export default SamLocalEditorTowelFront;

