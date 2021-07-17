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
import {getProductDetail} from "../../apiService";


function SamLocalEditorHatBack(props){
    // let {id} = props.match.params
    const [product, setProduct] = useState(null);
    // useEffect(() => {
    //     getProductDetail(id)
    //         .then(items => {
    //             // localStorage.setItem('body', JSON.stringify(items.front_view));
    //             localStorage.setItem('back', JSON.stringify(items.back_view));
    //             // localStorage.setItem('left', JSON.stringify(items.left_view));
    //             // localStorage.setItem('right', JSON.stringify(items.right_view));
    //             setProduct(items)
    //         })
    // }, [])

    const [canvas, setCanvas] = useState(null)
     const [name, setName] = useState(null);
    let [image, setImage] = useState(null);

    const [img, setImg] = useState(null);

    // tabs
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [color, setColor] = React.useState('#fff');
    const [selectedComponentId, setSelectedComponentId] = React.useState(null);
    const [colorShow, setColorShow] = React.useState(false);
    // const handleTabChange = (event, newValue) => {
    //     setSelectedTab(newValue);
    //     // if (newValue === 0) {
    //     //     frontImageLoad()
    //     //     // imageSaved()
    //     // }
    //     if (newValue === 1) {
    //         backImageLoad()
    //     }
    //     // if (newValue === 2) {
    //     //     rightImageLoad()
    //     // }
    //     // if (newValue === 3) {
    //     //     leftImageLoad()
    //     // }
    // }
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
            // frontImageLoad()
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
            top:120,
            left:130,
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
            canvas.centerObject(img)

        }, {crossOrigin: 'anonymous'})

    }
    const handleChangeComplete = (color) => {
        console.log(selectedComponentId, "selectedID")
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
                // debugger;
                console.log("Color_object", obj)
                obj.color=color
                localStorage.setItem(selectedComponentId, JSON.stringify(obj))
            }
            setColor(color)
            // addColor()
            console.log("else Part")
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
                width: samImg.width,
                height: samImg.height,
                scaleX : 60/samImg.width,
                scaleY : 60/samImg.height,
                top:340,
                left:380,
                innerWidth:200,
                innerHeight:200,

            });


            canvas.add(pug);
            console.log(pug, "lll")
        };

        samImg.src = l;


        console.log("Image Clicked", l)
    }

    console.log(img, "222")

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

    return(
        <div>
            <div>
                {/*/!*{selectedTab === 0 &&*!/*/}
                {/*<div className='row'>*/}
                {/*    <div className="btn-group" role="group" aria-label="Basic example" style={{width:"100%"}}>*/}
                {/*        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('body_first_section')}}>Body</button>*/}
                {/*        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*/}
                {/*        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('sleeve')}}>sleeve</button>*/}
                {/*    </div>*/}
                {/*</div>*/}
                {/*//     {colorShow &&*/}
                {/*//     <div>*/}
                {/*//         <div style={{width:"400px", float:"left", marginLeft:"20px"}}>*/}
                {/*//      <p> Choose Body color</p>*/}
                {/*//     <CirclePicker*/}
                {/*//         color={ color }*/}
                {/*/!*        onChangeComplete={ handleChangeComplete}*!/*/}
                {/*/!*    />*!/*/}
                {/*/!*    <br></br>*!/*/}
                {/*/!*        <div id="output-text">*!/*/}
                {/*//             <input onChange={handleInput} placeholder="Enter text"/>*/}
                {/*//                     <button type='button'*/}
                {/*/!*                            name='text_show'*!/*/}
                {/*/!*                            onClick={textShow}*!/*/}
                {/*//                             style={{*/}
                {/*/!*                                backgroundColor: "#767FE0",*!/*/}
                {/*/!*                                color: "white",*!/*/}
                {/*/!*                                border: "none",*!/*/}
                {/*/!*                                borderRadius: "50px",*!/*/}
                {/*/!*                                width: "120px",*!/*/}
                {/*/!*                                height: "30px",*!/*/}
                {/*//                                 margin: "10px"*/}
                {/*//                             }}>*/}
                {/*//                         Add Text*/}
                {/*//                     </button>*/}
                {/*//             <br></br>*/}
                {/*//*/}
                {/*//             <select id="input-font" onChange={changeFontStyle (this)}>*/}
                {/*//*/}
                {/*//             <option value="Comic Sans"*/}
                {/*//                     selected="selected">*/}
                {/*//                 Comic Sans*/}
                {/*//             </option>*/}
                {/*//             <option value="Arial">Arial</option>*/}
                {/*//             <option value="fantasy">Fantasy</option>*/}
                {/*//             <option value="cursive">cursive</option>*/}
                {/*//         </select>*/}
                {/*//             <select id="input-font" style={{marginLeft:"10px"}}>*/}
                {/*//*/}
                {/*//             <option value="Normal"*/}
                {/*//                     selected="selected">*/}
                {/*//                 Normal*/}
                {/*//             </option>*/}
                {/*//             <option value="Arial" style={{fontStyle:"bolder"}}>Bold</option>*/}
                {/*//             <option value="fantasy" style={{fontStyle:"italic"}}>Italic</option>*/}
                {/*//             <option value="cursive" style={{fontStyle:"underline"}}>Underline</option>*/}
                {/*/!*        </select>*!/*/}

                {/*/!*        </div>*!/*/}
                {/*/!*            <br></br>*!/*/}
                {/*/!*    /!*    <CirclePicker*!/*!/*/}
                {/*//     /!*    // color={ name }*!/*/}
                {/*//     /!*    // onChangeComplete={ handleChangeComplete}*!/*/}

                {/*//     <br></br>*/}
                {/*//*/}
                {/*//     <input type="file"/>*/}
                {/*//     /!*<button type='button'*!/*/}
                {/*//     /!*                        name='text_show'*!/*/}
                {/*/!*    /!*                        onClick={download_Image}*!/*!/*/}
                {/*//     /!*                        style={{*!/*/}
                {/*//     /!*                            backgroundColor: "#767FE0",*!/*/}
                {/*//     /!*                            color: "white",*!/*/}
                {/*/!*    /!*                            border: "none",*!/*!/*/}
                {/*/!*    /!*                            borderRadius: "50px",*!/*!/*/}
                {/*/!*    /!*                            width: "120px",*!/*!/*/}
                {/*//     /!*                            height: "30px",*!/*/}
                {/*//     /!*                            margin: "10px"*!/*/}
                {/*//     /!*                        }}>*!/*/}
                {/*//     /!*                    Download Design*!/*/}
                {/*/!*    /!*                </button>*!/*!/*/}
                {/*//         </div>*/}
                {/*/!*        <div style={{width:"300px", float:"right"}}>*!/*/}
                {/*/!*            <div style={{width:"300px", height:"300px", border:"solid", borderColor:"black", borderWidth:"1px", float:"right", marginRight:"-500px", marginTop:"10px"}}>*!/*/}
                {/*/!*                <button onClick={getSampleImages}>Load Images</button>*!/*/}
                {/*/!*                {*!/*/}
                {/*/!*                    img?*!/*/}
                {/*/!*                    img.map((s) =>*!/*/}
                {/*//                              <img src={s.image} alt={''} style={{width:"50px", height:"50px"}} onClick={()=> {load_logo(s.image)}}/>*/}
                {/*//*/}
                {/*//                     )*/}
                {/*/!*                :null}*!/*/}
                {/*/!*            </div>*!/*/}

                {/*/!*        </div>*!/*/}
                {/*//     </div>*/}
                {/*/!*    }*!/*/}

                {/*/!*    /!*<form action="">*!/*!/*/}
                {/*/!*    /!*    <label htmlFor="patterns" style={{marginTop: "20px"}}></label>*!/*!/*/}
                {/*/!*    /!*    <select name="patterns" id="patterns" style={{*!/*!/*/}
                {/*/!*    /!*        width: "150px",*!/*!/*/}
                {/*/!*    /!*        height: "30px",*!/*!/*/}
                {/*//     /!*        borderWidth: "1px",*!/*/}
                {/*//     /!*        borderStyle: "solid",*!/*/}
                {/*//     /!*        margin: "10px"*!/*/}
                {/*//     /!*    }}>*!/*/}
                {/*//     /!*        <option value="image1">Image1</option>*!/*/}
                {/*//     /!*        <option value="image2">Image2</option>*!/*/}
                {/*//     /!*        <option value="image3">Image3</option>*!/*/}
                {/*/!*    /!*        <option value="image4">Image4</option>*!/*!/*/}
                {/*//     /!*    </select>*!/*/}
                {/*//     /!*    <input type="submit" value="Submit"></input>*!/*/}
                {/*//     /!*</form>*!/*/}
                {/*//*/}
                {/*//     /!*<button type='button'*!/*/}
                {/*//     /!*        name='upload_logo'*!/*/}
                {/*//     /!*    // onClick={load_logo}*!/*/}
                {/*//     /!*        style={{*!/*/}
                {/*//     /!*            backgroundColor: "#767FE0",*!/*/}
                {/*//     /!*            color: "white",*!/*/}
                {/*//     /!*            border: "none",*!/*/}
                {/*//     /!*            borderRadius: "50px",*!/*/}
                {/*/!*    /!*            width: "120px",*!/*!/*/}
                {/*/!*    /!*            height: "30px",*!/*!/*/}
                {/*/!*    /!*            margin: "10px"*!/*!/*/}
                {/*//     /!*        }}>*!/*/}
                {/*//     /!*    Load Logo*!/*/}
                {/*//     /!*</button>*!/*/}
                {/*//     /!*<br></br>*!/*/}
                {/*//     /!*<button type="button"*!/*/}
                {/*//     /!*        onClick={download_Image}*!/*/}
                {/*/!*    /!*        style={{*!/*!/*/}
                {/*/!*    /!*            backgroundColor: "#767FE0",*!/*!/*/}
                {/*/!*    /!*            color: "white",*!/*!/*/}
                {/*//     /!*            border: "none",*!/*/}
                {/*//     /!*            borderRadius: "50px",*!/*/}
                {/*//     /!*            width: "120px",*!/*/}
                {/*//     /!*            height: "30px",*!/*/}
                {/*//     /!*            margin: "10px"*!/*/}
                {/*//     /!*        }}>Download Image*!/*/}
                {/*/!*    /!*</button>*!/*!/*/}

                {/*/!*</div>*!/*/}


                {/* back view */}

                <div className='row' style={{width:"100%"}}>
                    <div className="btn-group" role="group" aria-label="Basic example" style={{width:"100%"}}>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            onComponentClick('hat_dot_left_back')
                        }}>Left Dot
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            onComponentClick('hat_dot_right_back')
                        }}>Right Dot
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => {
                            onComponentClick('hat_upper_part_back')
                        }}>Upper Cap
                        </button>
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

                {/*{selectedTab === 2 &&*/}
                {/*<div className='row' style={{width:"100%"}}>*/}
                {/*    <div className="btn-group" role="group" aria-label="Basic example" style={{width:"100%"}}>*/}
                {/*        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_upper_part')}}>Left Sleeve</button>*/}
                {/*        /!*<button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('front-collar')}}>Collar</button>*!/*/}
                {/*        <button type="button" className="btn btn-secondary" onClick={()=>{onComponentClick('left_v_lower_part')}}>Right Sleeve</button>*/}
                {/*    </div>*/}
                {/*    {colorShow &&*/}
                {/*    <div style={{marginLeft:"50px", display:"inline"}}>*/}
                {/*     <p> Choose color</p>*/}

                {/*    <CirclePicker*/}
                {/*        color={ color }*/}
                {/*        onChangeComplete={ handleChangeComplete }*/}
                {/*    />*/}
                {/*    <br></br>*/}
                {/*        <div id="output-text">*/}
                {/*            <input onChange={handleInput} placeholder="Enter text"/>*/}
                {/*                    <button type='button'*/}
                {/*                            name='text_show'*/}
                {/*                            onClick={textShow}*/}
                {/*                            style={{*/}
                {/*                                backgroundColor: "#767FE0",*/}
                {/*                                color: "white",*/}
                {/*                                border: "none",*/}
                {/*                                borderRadius: "50px",*/}
                {/*                                width: "120px",*/}
                {/*                                height: "30px",*/}
                {/*                                margin: "10px"*/}
                {/*                            }}>*/}
                {/*                        Add Text*/}
                {/*                    </button>*/}
                {/*            <br></br>*/}

                {/*            <select id="input-font" onChange={changeFontStyle (this)}>*/}

                {/*            <option value="Comic Sans"*/}
                {/*                    selected="selected">*/}
                {/*                Comic Sans*/}
                {/*            </option>*/}
                {/*            <option value="Arial">Arial</option>*/}
                {/*            <option value="fantasy">Fantasy</option>*/}
                {/*            <option value="cursive">cursive</option>*/}
                {/*        </select>*/}
                {/*            <select id="input-font" style={{marginLeft:"10px"}}>*/}

                {/*            <option value="Normal"*/}
                {/*                    selected="selected">*/}
                {/*                Normal*/}
                {/*            </option>*/}
                {/*            <option value="Arial" style={{fontStyle:"bolder"}}>Bold</option>*/}
                {/*            <option value="fantasy" style={{fontStyle:"italic"}}>Italic</option>*/}
                {/*            <option value="cursive" style={{fontStyle:"underline"}}>Underline</option>*/}
                {/*        </select>*/}
                {/*            <br></br>*/}
                {/*            <div style={{width:"300px", float:"right"}}>*/}
                {/*            <div style={{width:"300px", height:"300px", border:"solid", borderColor:"black", borderWidth:"1px", float:"right", marginRight:"-900px", marginTop:"-150px"}}>*/}
                {/*                <button onClick={getSampleImages}>Load Images</button>*/}
                {/*                {*/}
                {/*                    img?*/}
                {/*                    img.map((s) =>*/}
                {/*                             <img src={s.image} alt={''} style={{width:"50px", height:"50px"}} onClick={()=> {load_logo(s.image)}}/>*/}
                {/*                    )*/}
                {/*                :null}*/}
                {/*            </div>*/}

                {/*        </div>*/}
                {/*            <br></br>*/}

                {/*        </div>*/}
                {/*    </div>*/}
                {/*    }*/}
                {/*</div>*/}
                {/*}*/}
                {/*{selectedTab === 3 && <div>Left</div>}*/}
            </div>
            <canvas id='canvas'>
                <div id="ans"></div>
            </canvas>

        </div>
    );

}

export default SamLocalEditorHatBack;
