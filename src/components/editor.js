import React, {useEffect, useState, useRef} from "react";
// import THREELib from "three-js";
import {fabric} from "fabric";
import {saveAs} from 'file-saver'
import {v1 as uuid} from 'uuid';
import * as PIXI from 'pixi.js'
import $ from "jquery";
import {Tabs, Tab} from "@material-ui/core";
import 'bootstrap/dist/css/bootstrap.min.css';
import {getProductDetail} from "../apiService";

let product1 = null

const viewOptions = [
    'front',
    'back',
    'left',
    'right'
]

function SamEditor(props) {
    const {id} = props.match.params
    const [product, setProduct] = useState(null);
    const [ab, setAb] = useState({});

    useEffect(() => {
        getProductDetail(id)
            .then(items => {
                console.log("product ", items)
                setProduct(items)
                // if(mounted) {
                //     console.log("dddddddd")
                // }
            })
    }, [])

    // useEffect(() => {
    //
    //     if(product){
    //         frontImageLoad()
    //     }
    // }, [product])


    const [canvasFront, setCanvasFront] = useState(true);
    const [canvasBack, setCanvasBack] = useState(false);
    const [canvasRight, setCanvasRight] = useState(false);
    const [canvasLeft, setCanvasLeft] = useState(false);
    const [canvas, setCanvas] = useState('')
    const [frontCanvas, setFrontCanvas] = useState(null)

    // view section
    const [view, setView] = useState(viewOptions[0], viewOptions[1], viewOptions[2], viewOptions[3]);

    // images with canvas
    const [frontImage, setFrontImage] = useState(null);
    const [bodyFisrtSection, setBodyFisrtSection] = useState(null);
    const [bodySecondSection, setBodySecondSection] = useState(null);
    const [bodyThirdSection, setBodyThirdSection] = useState(null);
    const [leftViewBody, setLeftViewBody] = useState(null);
    const [leftViewUpper, setLeftViewUpper] = useState(null);
    const [leftViewLower, setLeftViewLower] = useState(null);
    const [rightViewBody, setRightViewBody] = useState(null);
    const [rightViewUpper, setRightViewUpper] = useState(null);
    const [rightViewLower, setRightViewLower] = useState(null);
    const [backViewUpper, setBackViewUpper] = useState(null);
    const [backViewMiddle, setBackViewMiddle] = useState(null);
    const [backViewMBottom, setBackViewBottom] = useState(null);
    const [frontCollar, setFrontCollar] = useState(null);
    const [right_sleeve, setRightSleeve] = useState(null);
    const [left_sleeve, setLeftSleeve] = useState(null);


    // urls
    const frontComponent = ''
    const leftComponent = ''
    const backComponent = ''

    // tabs
    const [selectedTab, setSelectedTab] = React.useState(0);
    const handleChange = (event, newValue) => {
        setSelectedTab(newValue);
    }

    //
    const [color, setColor] = useState("blue");
    const [showResults, setShowResults] = React.useState(false)


    const initCanvas = () =>
        new fabric.Canvas('canv', {

            height: 800,
            width: 800,
            marginLeft: 100,
            backgroundColor: 'white',
        });

    useEffect(() => {
        setCanvas(initCanvas());
        // if(canvasFront) {
        //     frontImageLoad();
        // }
    }, []);

    const initCanvasBack = () =>
        new fabric.Canvas('canv_back', {

            height: 800,
            width: 800,
            marginLeft: 100,
            backgroundColor: 'white',
        });

    useEffect(() => {
        setCanvasBack(initCanvasBack());
        if (canvasBack) {
            backImageLoad();
        }
    }, []);

    const initCanvasLeft = () =>
        new fabric.Canvas('canv_left', {

            height: 800,
            width: 800,
            marginLeft: 100,
            backgroundColor: 'white',
        });

    useEffect(() => {
        setCanvasLeft(initCanvasLeft());
        if (canvasLeft) {
            leftImageLoad();
        }
    }, []);

    const initCanvasRight = () =>
        new fabric.Canvas('canv_right', {

            height: 800,
            width: 800,
            marginLeft: 100,
            backgroundColor: 'white',
        });

    useEffect(() => {
        setCanvasRight(initCanvasRight());
        if (canvasRight) {
            rightImageLoad();
        }
    }, []);

    // useEffect(() => {
    //     if(canvas) {
    //         frontImageLoad();
    //     }
    // }, [canvas]);


    // const renderer = new THREE.WebGLRenderer({canvas});

    // const ref = useRef();
    //Front components Start
    // let frontImage;
    // let bodyFisrtSection;
    // let bodySecondSection;
    let front_top_left;
    let front_top_right;
    let front_bottom_left;
    let front_bottom_right;
    let zipImage;
    let pockets;
    let collar
    //Front Components Ends

    //Hood Components Start
    let hoodImage;
    let hood_inner;
    let rope;
    //Hood Components End

    //Right Sleeve Components Start
    let rightSleevImage;
    let rightSleev_upper;
    let rightSleev_lower_left;
    let rightSleev_lower_right;
    let rightSleev_cuffs;
    //Right Sleeve Components Ends

    //Left Sleeve Components Start
    let leftSleeveImage;
    let leftSleeve_upper;
    let leftSleeve_lower_left;
    let leftSleeve_lower_right;
    let leftSleeve_cuffs;
    //Left Sleeve Component Ends

    let backImage
    var logo_img;
    var text;

    // urls
    // const hoodUrl = 'http://localhost:8000/media/uploads/color_shirt.png.png'
    // const frontUrl = 'http://localhost:8000/media/uploads/color_shirt.png'

    // const front_top_left = ''
    // const front_top_right = ''
    // const front_bottom_left = ''
    // const front_bottom_right = ''
    // const zip_url = 'http://localhost:8000/media/uploads/zip-tracing.png'
    // const front_chest = 'http://localhost:8000/media/uploads/front_chest.png'
    const backUrl = 'http://localhost:8000/media/uploads/back.png'
    const rightSleeveUrl = 'http://localhost:8000/media/uploads/left-sleeve.png'
    const leftSleeveUrl = 'http://localhost:8000/media/uploads/right-sleeve.png'
    var logo_demo = "http://localhost:8000/media/uploads/body/polo_logo.png";


    const loadImage = (url, imageId, left, top, width, height, setImage) => {

        fabric.Image.fromURL(url, function (img) {
            img.id = imageId;
            img.filters = [new fabric.Image.filters.HueRotation()];
            setImage(img)

            img.applyFilters()
            var cor = img.set(
                {
                    left: left,
                    top: top,
                    selectable: false,

                })
            canvas.add(img);

        }, {crossOrigin: 'anonymous'})

    }

    const loadColor = (img, colorCode) => {
        img.filters[0].rotation = colorCode
        img.applyFilters();
        canvas.requestRenderAll();
    }

    const load_logo = (l) => {
        fabric.Image.fromURL(
            logo_demo,
            function (logo) {
                logo.id = "logo_sleeve";
                // logo.height = 150;
                // logo.width = 150;
                logo.innerHeight = 50;
                logo.innerWidth = 50;
                logo_img = logo;
                logo.set({
                    left: 15,
                    top: 100,
                    resize: true,

                });
                canvas.add(logo);
            },
            {crossOrigin: "anonymous"}
        );
    }

    function frontImageLoad(frontI) {
        setShowResults(true)
        setView(viewOptions[0])
        if (frontCanvas) {
            console.log('existing')
        } else {

            // setCanvasFront(true)
            // if (product.front_view.body_view.image){
            //     loadImage(product.front_view.body_view.image,'body_view',0,0,0,0,setFrontImage)
            // }
            console.log(product?.front_view, 'llllll')

            if (product?.front_view?.body_first_section?.image) {
                console.log('kkkkkkkkkkkkkk')
                loadImage(product.front_view.body_first_section.image, 'body_first_section', product.front_view.body_first_section.x_point, product.front_view.body_first_section.y_point, product.front_view.body_first_section.width, product.front_view.body_first_section.height, setBodyFisrtSection)
            }
            if (product.front_view?.body_second_section?.image) {
                loadImage(product.front_view.body_second_section.image, 'body_second_section', product.front_view.body_second_section.x_point, product.front_view.body_second_section.y_point, product.front_view.body_second_section.width, product.front_view.body_second_section.height, setBodySecondSection)
                // frontComponent.bodySecondSection = [new fabric.Image.filters.HueRotation()];

            }
            if (product.front_view?.body_third_section?.image) {
                loadImage(product.front_view.body_third_section.image, 'body_third_section', product.front_view.body_third_section.x_point, product.front_view.body_third_section.y_point, product.front_view.body_third_section.width, product.front_view.body_third_section.height, setBodyThirdSection)

            }
            if (product.front_view?.collar?.image) {
                loadImage(product.front_view.collar.image, 'front-collar', product.front_view.collar.x_point, product.front_view.collar.y_point, product.front_view.collar.width, product.front_view.collar.height, setFrontCollar)

            }
            if (product.front_view?.right_sleeve?.image) {
                loadImage(product.front_view.right_sleeve.image, 'right_sleeve', product.front_view.right_sleeve.x_point, product.front_view.right_sleeve.y_point, product.front_view.right_sleeve.width, product.front_view.right_sleeve.height, setRightSleeve)
            }

            if (product.front_view?.left_sleeve?.image) {
                loadImage(product.front_view.left_sleeve.image, 'left_sleeve', product.front_view.left_sleeve.x_point, product.front_view.left_sleeve.y_point, product.front_view.left_sleeve.width, product.front_view.left_sleeve.height, setLeftSleeve)
            }
        }
    }

    const backImageLoad = (e) => {
        setView(viewOptions[1])
        setShowResults(true)

        if (product.back_view.back_first_part?.image) {
            loadImage(product.back_view.back_first_part.image, 'back_first_part',
                product.back_view.back_first_part.x_point, product.back_view.back_first_part.y_point,
                product.back_view.back_first_part.width, product.back_view.back_first_part.height, setBackViewUpper)

        }

        if (product.back_view.back_second_part?.image) {
            loadImage(product.back_view.back_second_part.image, 'back_second_part',
                product.back_view.back_second_part.x_point, product.back_view.back_second_part.y_point,
                product.back_view.back_second_part.width, product.back_view.back_second_part.height, setBackViewMiddle)
        }

        if (product.back_view.back_third_part?.image) {
            loadImage(product.back_view.back_third_part.image, 'back_third_part',
                product.back_view.back_third_part.x_point, product.back_view.back_third_part.y_point,
                product.back_view.back_third_part.width, product.back_view.back_third_part.height, setBackViewBottom)
        }

        if (product.back_view.back_left_sleeve?.image) {
            loadImage(product.back_view.back_left_sleeve.image, 'back_left_sleeve',
                product.back_view.back_left_sleeve.x_point, product.back_view.back_left_sleeve.y_point,
                product.back_view.back_left_sleeve.width, product.back_view.back_left_sleeve.height, setLeftSleeve)
        }

        if (product.back_view.back_right_sleeve?.image) {
            loadImage(product.back_view.back_right_sleeve.image, 'back_right_sleeve',
                product.back_view.back_right_sleeve.x_point, product.back_view.back_right_sleeve.y_point,
                product.back_view.back_right_sleeve.width, product.back_view.back_right_sleeve.height, setRightSleeve)
        }
    }

    const leftImageLoad = (e) => {
        setView(viewOptions[2])
        setShowResults(true)

        if(canvasLeft){

            if (product.left_view?.left_v_body_view?.image) {
                loadImage(product.left_view.left_v_body_view.image, 'left_v_body_view',
                    product.left_view.left_v_body_view.x_point, product.left_view.left_v_body_view.y_point,
                    product.left_view.left_v_body_view.width, product.left_view.left_v_body_view.height, setLeftViewBody)
            }

            if (product.left_view?.left_v_upper_part?.image) {
                loadImage(product.left_view.left_v_upper_part.image, 'left_v_upper_part',
                    product.left_view.left_v_upper_part.x_point, product.left_view.left_v_upper_part.y_point,
                    product.left_view.left_v_upper_part.width, product.left_view.left_v_upper_part.height, setLeftViewUpper)
            }

            if (product.left_view?.left_v_lower_part?.image) {
                loadImage(product.left_view.left_v_lower_part.image, 'left_v_upper_part',
                    product.left_view.left_v_lower_part.x_point, product.left_view.left_v_lower_part.y_point,
                    product.left_view.left_v_lower_part.width, product.left_view.left_v_lower_part.height, setLeftViewLower)
            }

        }

    }

    const rightImageLoad = (e) => {
        setView(viewOptions[3])
        if (product.right_view?.right_v_body_view?.image) {
            loadImage(product.right_view.right_v_body_view.image, 'right_v_body_view',
                product.right_view.right_v_body_view.x_point, product.right_view.right_v_body_view.y_point,
                product.right_view.right_v_body_view.width, product.right_view.right_v_body_view.height, setRightViewBody)
        }
        if (product.right_view?.right_v_upper_part?.image) {
            loadImage(product.right_view.right_v_upper_part.image, 'right_v_upper_part',
                product.right_view.right_v_upper_part.x_point, product.right_view.right_v_upper_part.y_point,
                product.right_view.right_v_upper_part.width, product.right_view.right_v_upper_part.height, setRightViewUpper)
        }

        if (product.right_view?.right_v_lower_part?.image) {
            loadImage(product.right_view.right_v_lower_part.image, 'right_v_lower_part',
                product.right_view.right_v_lower_part.x_point, product.right_view.right_v_lower_part.y_point,
                product.right_view.right_v_lower_part.width, product.right_view.right_v_lower_part.height, setRightViewLower)
        }

    }

    const textShow = () => {

        var text = new fabric.Textbox(
            'This is Text',
            {
                width: 500,
                textAlign: "center",
            }
        );

        canvas.add(text);
    };

    function showDiv() {
        document.getElementById('hello').style.display = "block";
    }

    function showValue() {
        var name = document.getElementById('name').value;
        document.getElementById('ans').innerHTML = name;
        document.getElementById('hello').style.margin = "none";
    }


    //Collar Function
    const blue_btn_clicked_collar = (c) => {
        collar.filters[0].rotation = -0.7925393031704733
        collar.applyFilters();
        canvas.requestRenderAll();
    }

    const red_btn_clicked_collar = (c) => {
        collar.filters[0].rotation = 0.04339308661309316
        collar.applyFilters();
        canvas.requestRenderAll();
    }

    const green_btn_clicked_collar = (c) => {
        collar.filters[0].rotation = 0.7721581741520329
        collar.applyFilters();
        canvas.requestRenderAll();
    }
    //End Collar Function

    //Front Functions
    const blue_front = () => {
        // console.log(frontImage,'frontImage')
        loadColor(bodyFisrtSection, -0.7925393031704733)
        // console.log(frontImage)
        // // -0.7925393031704733
        // frontImage.filters[0].rotation = -0.7925393031704733
        // frontImage.applyFilters();
        // canvas.requestRenderAll();
    }

    const red_front = () => {
        // 0.04339308661309316
        frontImage.filters[0].rotation = 0.04339308661309316
        frontImage.applyFilters();
        canvas.requestRenderAll();
    }

    const green_front = () => {
        // 0.7721581741520329
        loadColor(bodySecondSection, "00ff00")
        frontImage.applyFilters();
        canvas.requestRenderAll();
    }

    //End Front Functions


    function download_Image() {
        var canvas = document.getElementById("canv");
        var image = canvas.toDataURL("image/png", 1.0).replace("image/svg", "image/octet-stream");
        var link = document.createElement('a');
        link.download = "Your_Product_Design.svg";
        link.href = image;
        link.click();
    }

    // Sleeve Functions
    const red_btn_clicked_sleeve_right = (e) => {
        // var random = color
        rightSleevImage.filters[0].rotation = 0.04339308661309316
        rightSleevImage.applyFilters();
        canvas.requestRenderAll();

    }

    const green_btn_clicked_sleeve_right = (e) => {
        rightSleevImage.filters[0].rotation = 0.7721581741520329

        rightSleevImage.applyFilters();
        canvas.requestRenderAll();
    }

    const blue_btn_clicked_sleeve_right = (e) => {
        rightSleevImage.filters[0].rotation = -0.7925393031704733
        rightSleevImage.applyFilters();
        canvas.requestRenderAll();
    }

    const red_clicked_sleeve_left = (l) => {
        // eslint-disable-next-line no-unused-expressions
        leftSleeveImage.filters[0].rotation = 0.04339308661309316
        leftSleeveImage.applyFilters();
        canvas.requestRenderAll();
    }

    const blue_clicked_sleeve_left = (l) => {
        leftSleeveImage.filters[0].rotation = -0.7925393031704733
        leftSleeveImage.applyFilters();
        canvas.requestRenderAll();
    }

    const green_clicked_sleeve_left = (l) => {
        leftSleeveImage.filters[0].rotation = 0.7721581741520329
        leftSleeveImage.applyFilters();
        canvas.requestRenderAll();
    }
    // End Sleeve Functions


    //Back Function
    const red_btn_clicked_back = (b1) => {
        backImage.filters[0].rotation = 0.04339308661309316
        backImage.applyFilters();
        canvas.requestRenderAll();
    }

    const blue_btn_clicked_back = (b1) => {
        backImage.filters[0].rotation = -0.7925393031704733
        backImage.applyFilters();
        canvas.requestRenderAll();
    }

    const green_btn_clicked_back = (b1) => {
        backImage.filters[0].rotation = 0.7721581741520329
        backImage.applyFilters();
        canvas.requestRenderAll();
    }
    //End Back Function


    //Zip Function
    // const green_btn_zipper = (z) => {
    //     zipImage.filters[0].rotation = 0.7721581741520329
    //     zipImage.applyFilters();
    //     canvas.requestRenderAll();
    // }
    //
    // const red_btn_zipper = (z1) => {
    //     zipImage.filters[0].rotation = 0.04339308661309316
    //     zipImage.applyFilters();
    //     canvas.requestRenderAll();
    // }
    //
    // const blue_btn_zipper = (z2) => {
    //     zipImage.filters[0].rotation = -0.7925393031704733
    //     zipImage.applyFilters();
    //     canvas.requestRenderAll();
    // }
    // End Zip Function

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
            {/*<button type='button' name='circle' onClick={frontImageLoad}>*/}
            {/*    Front View*/}
            {/*</button>*/}
            {/*/!*{ showResults ? <Results /> : null }*!/*/}
            {/*<button type="button" name="back_view" onClick={backImageLoad}>Back View</button>*/}
            {/*<button type="button" name="left_view" onClick={leftImageLoad}>Left View</button>*/}
            {/*<button type="button" name="right_view" onClick={rightImageLoad}>Right View</button>*/}

            {/*<button type='button' name='triangle' onClick={addShape}>*/}
            {/*    Add a Triangle*/}
            {/*</button>*/}

            {/*<button type='button' name='rectangle' onClick={addShape}>*/}
            {/*    Add a Rectangle*/}
            {/*</button>*/}


            {/*<button type='button' name='add_text' onClick={textShow}>Add Text</button>*/}


            {/*<input type="button" onClick={showDiv} value="click on me"/>*/}
            {/*<form id="hello" style={{display:"none"}}>*/}
            {/*    <label>Enter Name: </label>*/}
            {/*    <input type="text" id="name" required/>*/}
            {/*    <button type="button" onClick={showValue}>submit</button>*/}
            {/*</form>*/}

            <Tabs value={selectedTab} onChange={handleChange}>
                <Tab label="Front View" onClick={frontImageLoad}>

                </Tab>
                <Tab label="Back View" onClick={backImageLoad}>
                    <p>back</p>
                </Tab>
                <Tab label="Left View" onClick={leftImageLoad}>
                    <p>left</p>
                </Tab>
                <Tab label="Right View" onClick={rightImageLoad}>
                    <p>right</p>
                </Tab>
            </Tabs>

            <br></br>

            <br></br>
            <br></br>
            <div style={{float:"left"}}>


                {/*<p>Select Zipper Color</p>*/}
                {/*<button id='blue_btn_zip' type='button'*/}
                {/*        style={{*/}
                {/*            width: 30,*/}
                {/*            height: 30,*/}
                {/*            backgroundColor: "blue",*/}
                {/*            border: "1 px solid black",*/}
                {/*            borderRadius: "50%"*/}
                {/*        }}*/}
                {/*        onClick={blue_btn_zipper}></button>*/}
                {/*<button id='red_btn_zip' type='button'*/}
                {/*        style={{*/}
                {/*            width: 30,*/}
                {/*            height: 30,*/}
                {/*            marginLeft: 10,*/}
                {/*            backgroundColor: "red",*/}
                {/*            border: "3 px solid black",*/}
                {/*            borderRadius: "50%"*/}
                {/*        }}*/}
                {/*        onClick={red_btn_zipper}></button>*/}
                {/*<button id='green_btn_zip' type='button'*/}
                {/*        style={{*/}
                {/*            width: 30,*/}
                {/*            height: 30,*/}
                {/*            marginLeft: 10,*/}
                {/*            backgroundColor: "green",*/}
                {/*            border: "3 px solid black",*/}
                {/*            borderRadius: "50%"*/}
                {/*        }}*/}
                {/*        onClick={green_btn_zipper}></button>*/}


                {/*<button id='blue_btn_front_chest' type='button'*/}
                {/*        style={{*/}
                {/*            width: 30,*/}
                {/*            height: 30,*/}
                {/*            backgroundColor: "blue",*/}
                {/*            border: "1 px solid black",*/}
                {/*            borderRadius: "50%"*/}
                {/*        }}*/}
                {/*        onClick={blue_btn_clicked_front_chest}></button>*/}

                {/*{(() => {*/}
                {/*    switch (view) {*/}
                {/*         case viewOptions[0]:*/}
                {/*            return (<p>p1</p>);*/}
                {/*         case viewOptions[1]:*/}
                {/*            return (<p>p2</p>);*/}
                {/*        default: return null*/}
                {/*    }*/}
                {/*})()}*/}

                {(() => {
                    switch (view) {
                        case viewOptions[0]:
                            return (
                                <div>
                                    <p>Set Full Body Color</p>
                                    <button id='blue_btn_front_top_left' type='button'
                                        //-0.7925393031704733
                                        //0.04339308661309316
                                        //0.7721581741520329
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "red",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(bodyFisrtSection, 0.7721581741520329)
                                            }}>
                                    </button>
                                    <button id='red_btn_front_top_left' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "green",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(bodyFisrtSection, -0.7925393031704733)
                                            }}
                                    ></button>
                                    <button id='green_btn_front_top_left' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "blue",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(bodyFisrtSection, 0.04339308661309316)
                                            }}
                                    ></button>
                                    <p>Select Collar Color</p>
                                    <button id='blue_btn_front_top_left' type='button'
                                        //-0.7925393031704733
                                        //0.04339308661309316
                                        //0.7721581741520329
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "red",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(frontCollar, 0.7721581741520329)
                                            }}>
                                    </button>
                                    <button id='red_btn_front_top_left' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "green",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(frontCollar, -0.7925393031704733)
                                            }}
                                    ></button>
                                    <button id='green_btn_front_top_left' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "blue",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(frontCollar, 0.04339308661309316)
                                            }}
                                    ></button>

                                    <p>Select Front First Section Colors</p>
                                    <button id='blue_btn_front_top_left' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "blue",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(bodyFisrtSection, -0.7925393031704733)
                                            }}>
                                    </button>
                                    <button id='red_btn_front_top_left' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "red",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(bodyFisrtSection, 0.04339308661309316)
                                            }}
                                    ></button>
                                    <button id='green_btn_front_top_left' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "green",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(bodyFisrtSection, 0.7721581741520329)
                                            }}
                                    ></button>

                                    <p>Select Front second Section Colors</p>
                                    <button id='blue_btn_front_top_left' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "blue",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(bodySecondSection, -0.7925393031704733)
                                            }}>
                                    </button>
                                    <button id='red_btn_front_top_left' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "red",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(bodySecondSection, 0.04339308661309316)
                                            }}
                                    ></button>
                                    <button id='green_btn_front_top_left' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "green",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(bodySecondSection, 0.7721581741520329)
                                            }}
                                    ></button>
                                    <form action="">
                                        <label htmlFor="patterns" style={{marginTop: "20px"}}></label>
                                        <select name="patterns" id="patterns" style={{width:"150px", height:"30px",borderWidth:"1px", borderStyle:"solid", margin:"10px"}}>
                                            <option value="image1">Image1</option>
                                            <option value="image2">Image2</option>
                                            <option value="image3">Image3</option>
                                            <option value="image4">Image4</option>
                                        </select>
                                        <input type="submit" value="Submit"></input>
                                    </form>

                                    <button type='button'
                                            name='upload_logo'
                                            onClick={load_logo}
                                            style={{backgroundColor:"#767FE0", color:"white", border:"none", borderRadius:"50px", width:"120px", height:"30px",margin:"10px"}}>
                                    Load Logo
                                    </button>
                                    <br></br>
                                    <button type="button"
                                            onClick={download_Image}
                                            style={{backgroundColor:"#767FE0", color:"white", border:"none", borderRadius:"50px", width:"120px", height:"30px",margin:"10px"}}>Download Image</button>

                                </div>
                            );
                        case viewOptions[1]:
                            return (
                                <div>
                                    <p>Select Back Bottom Color</p>

                                    <button id='red_btn_end' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "red",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(backViewMBottom, 0.7721581741520329)
                                            }}></button>
                                    <button id='blue_btn_end' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "blue",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(backViewMBottom, 0.04339308661309316)
                                            }}></button>
                                    <button id='green_btn_end' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "green",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(backViewMBottom, -0.7925393031704733)
                                            }}></button>

                                    <p>Select Back Middle Color</p>

                                    <button id='red_btn_end' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "red",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(backViewMiddle, 0.7721581741520329)
                                            }}></button>
                                    <button id='blue_btn_end' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "blue",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(backViewMiddle, 0.04339308661309316)
                                            }}></button>
                                    <button id='green_btn_end' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "green",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(backViewMiddle, -0.7925393031704733)
                                            }}></button>

                                    <p>Select Back Top Color</p>

                                    <button id='red_btn_end' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "red",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(backViewUpper, 0.7721581741520329)
                                            }}></button>
                                    <button id='blue_btn_end' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "blue",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(backViewUpper, 0.04339308661309316)
                                            }}></button>
                                    <button id='green_btn_end' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "green",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(backViewUpper, -0.7925393031704733)
                                            }}></button>

                                    <form action="">
                                         <label htmlFor="patterns" style={{marginTop: "20px"}}></label>
                                        <select name="patterns" id="patterns" style={{width:"150px", height:"30px",borderWidth:"1px", borderStyle:"solid", margin:"10px"}}>
                                             <option value="image1">Image1</option>
                                            <option value="image2">Image2</option>
                                            <option value="image3">Image3</option>
                                            <option value="image4">Image4</option>
                                        </select>
                                        <input type="submit" value="Submit"></input>
                                    </form>

                                     <button type='button'
                                            name='upload_logo'
                                            onClick={load_logo}
                                            style={{backgroundColor:"#767FE0", color:"white", border:"none", borderRadius:"50px", width:"120px", height:"30px",margin:"10px"}}>
                                    Load Logo
                                    </button>
                                    <br></br>
                                    <button type="button"
                                            onClick={download_Image}
                                            style={{backgroundColor:"#767FE0", color:"white", border:"none", borderRadius:"50px", width:"120px", height:"30px",margin:"10px"}}>Download Image</button>

                                </div>
                            );
                        case viewOptions[2]:
                            return (
                                <div>
                                    <p>Select Left Sleeve Upper Color</p>
                                    <button id='green_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "green",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(leftViewUpper, -0.7925393031704733)
                                            }}>
                                    </button>
                                    <button id='blue_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "blue",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(leftViewUpper, 0.04339308661309316)
                                            }}>
                                    </button>
                                    <button id='red_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "red",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(leftViewUpper, 0.7721581741520329)
                                            }}></button>

                                    <p>Select Left Sleeve Lower Color</p>
                                    <button id='green_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "green",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(leftViewLower, -0.7925393031704733)
                                            }}>
                                    </button>
                                    <button id='blue_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "blue",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(leftViewLower, 0.04339308661309316)
                                            }}>
                                    </button>
                                    <button id='red_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "red",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(leftViewLower, 0.7721581741520329)
                                            }}></button>

                                    <form action="">
                                         <label htmlFor="patterns" style={{marginTop: "20px"}}></label>
                                        <select name="patterns" id="patterns" style={{width:"150px", height:"30px",borderWidth:"1px", borderStyle:"solid", margin:"10px"}}>
                                            <option value="image1">Image1</option>
                                            <option value="image2">Image2</option>
                                            <option value="image3">Image3</option>
                                            <option value="image4">Image4</option>
                                        </select>
                                        <input type="submit" value="Submit"></input>
                                    </form>

                                    <button type='button'
                                            name='upload_logo'
                                            onClick={load_logo}
                                            style={{backgroundColor:"#767FE0", color:"white", border:"none", borderRadius:"50px", width:"120px", height:"30px",margin:"10px"}}>
                                    Load Logo
                                    </button>
                                    <br></br>
                                    <button type="button"
                                            onClick={download_Image}
                                            style={{backgroundColor:"#767FE0", color:"white", border:"none", borderRadius:"50px", width:"120px", height:"30px",margin:"10px"}}>Download Image</button>

                                </div>
                            );
                        case viewOptions[3]:
                            return (
                                <div>
                                    <p>Select Right Sleeve Upper Color</p>
                                    <button id='blue_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "blue",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(rightViewUpper, -0.7925393031704733)
                                            }}></button>
                                    <button id='red_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "red",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(rightViewUpper, 0.04339308661309316)
                                            }}></button>
                                    <button id='green_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "green",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(rightViewUpper, 0.7721581741520329)
                                            }}></button>

                                    <p>Select Right Sleeve Lower Color</p>
                                    <button id='blue_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                backgroundColor: "blue",
                                                border: "1 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(rightViewLower, -0.7925393031704733)
                                            }}></button>
                                    <button id='red_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "red",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(rightViewLower, 0.04339308661309316)
                                            }}></button>
                                    <button id='green_btn_sleeve' type='button'
                                            style={{
                                                width: 30,
                                                height: 30,
                                                marginLeft: 10,
                                                backgroundColor: "green",
                                                border: "3 px solid black",
                                                borderRadius: "50%"
                                            }}
                                            onClick={() => {
                                                loadColor(rightViewLower, 0.7721581741520329)
                                            }}></button>

                                    <form action="">
                                         <label htmlFor="patterns" style={{marginTop: "20px"}}></label>
                                        <select name="patterns" id="patterns" style={{width:"150px", height:"30px",borderWidth:"1px", borderStyle:"solid", margin:"10px"}}>
                                            <option value="image1">Image1</option>
                                            <option value="image2">Image2</option>
                                            <option value="image3">Image3</option>
                                            <option value="image4">Image4</option>
                                        </select>
                                        <input type="submit" value="Submit"></input>
                                    </form>

                                    <button type='button'
                                            name='upload_logo'
                                            onClick={load_logo}
                                            style={{backgroundColor:"#767FE0", color:"white", border:"none", borderRadius:"50px", width:"120px", height:"30px",margin:"10px"}}>
                                    Load Logo
                                    </button>
                                    <br></br>
                                    <button type="button"
                                            onClick={download_Image}
                                            style={{backgroundColor:"#767FE0", color:"white", border:"none", borderRadius:"50px", width:"120px", height:"30px",margin:"10px"}}>Download Image</button>

                                </div>
                            );
                        default:
                            return "";
                    }
                })()}
                </div>
                <div style={{float:"right"}}>

                <div style={{display: view === viewOptions[0] ? '' : viewOptions[null]}}>

                    <canvas id='canv'>
                        <div id="ans"></div>
                    </canvas>

                </div>
                <div style={{display: view === viewOptions[1] ? '' : viewOptions[null]}}>
                    {/*<canvas id='canv_back'>*/}
                    {/*    <div id="ans"></div>*/}
                    {/*</canvas>*/}
                </div>

                {/*<div style={{display: view === viewOptions[2] ? '' : viewOptions[null]}}>*/}
                {/*    <canvas id='canv_left'>*/}
                {/*        <div id="ans"></div>*/}
                {/*    </canvas>*/}
                {/*</div>*/}

            </div>

        </div>




    );


}

export default SamEditor;

