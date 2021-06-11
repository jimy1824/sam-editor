import React, {useEffect, useState, useRef} from "react";
// import THREELib from "three-js";
import {fabric} from "fabric";
import {saveAs} from 'file-saver'
import {v1 as uuid} from 'uuid';
import * as PIXI from 'pixi.js'
import $ from "jquery";
import {getProductDetail} from "../apiService";


function SamEditor(props) {
    const {id} = props.match.params
    const [product, setProduct] = useState(null);

    useEffect(() => {
        let mounted = true;
        getProductDetail(id)
            .then(items => {
                if(mounted) {
                    setProduct(items)
                }
            })
        return () => mounted = false;
    }, [])

    useEffect(() => {
        if(product){
            frontImageLoad()
        }
    }, [product])



    // console.log(product,'product')

    const [canvas, setCanvas] = useState('');

    // view section

    // images with canvas
    const [frontImage, setFrontImage] = useState(null);
    const [bodyFisrtSection, setBodyFisrtSection] = useState(null);
    const [bodySecondSection, setBodySecondSection] = useState(null);
    const [bodyThirdSection, setBodyThirdSection] = useState(null);
    const [frontCollar, setFrontCollar] = useState(null);


    // urls
    const frontComponent = ''



    const [color, setColor] = useState("blue");
    const [showResults, setShowResults] = React.useState(false)


    const initCanvas = () =>
        new fabric.Canvas('canv', {

            height: 800,
            width: 800,
            backgroundColor: 'white',
        });

    useEffect(() => {
        setCanvas(initCanvas());
        if(canvas) {
            frontImageLoad();
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
    var logo_demo = "http://localhost:8000/media/uploads/Button-Delete-128.png";




//         const setup = () => {
//             let loader = new PIXI.Loader
//    loader
//         .add("avatar","http://localhost:8000/media/uploads/body.png")
//         .load(initialize);
// };
//
// const initialize = () => {
//     console.log("abc")
//     //We will create a sprite and then add it to stage and (0,0) position
//     let avatar = new PIXI.Sprite(PIXI.Loader.resources["avatar"].texture);
//     app_1.stage.addChild(avatar);
// };
//         const updatePixiCnt= (element) => {
//     // the element is the DOM object that we will use as container to add pixi stage(canvas)
//     pixi_cnt = element;
//     //now we are adding the application to the DOM element which we got from the Ref.
//     if(pixi_cnt && pixi_cnt.children.length<=0) {
//        pixi_cnt.appendChild(app_1.view);
//        //The setup function is a custom function that we created to add the sprites. We will this below
//        setup();
//     }
//  };
    const loadImage=  (url,imageId,left,top,width,height, setImage)=>{
        console.log(setImage,'setImage')

        fabric.Image.fromURL(url, function (img) {
            img.id = imageId;
            img.filters = [new fabric.Image.filters.HueRotation()];
            setImage(img)
            // setImage = img
            // obj = img
            // var w3rcontext=canvas.getContext('2d');
            // w3rcontext.
            // console.log(obj)
            img.applyFilters()
            var cor = img.set(
                {
                    left:left,
                    top: top,
                    // width:width,
                    // height:height,
                    selectable: false,

                })
            canvas.add(img);
        }, {crossOrigin: 'anonymous'})

    }

    const loadColor=(img,colorCode)=>{
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
                // logo.innerHeight = 50;
                // logo.innerWidth = 50;
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

    function frontImageLoad  (e) {
        setShowResults(true)
        if (product.front_view.body_view.image){
            loadImage(product.front_view.body_view.image,'body_view',0,0,0,0,setFrontImage)
        }
        if (product.front_view.body_first_section.image){
            console.log()
            loadImage(product.front_view.body_first_section.image,'body_first_section',product.front_view.body_first_section.x_point,product.front_view.body_first_section.y_point,product.front_view.body_first_section.width,product.front_view.body_first_section.height,setBodyFisrtSection)
        }
        if (product.front_view.body_second_section.image){
            loadImage(product.front_view.body_second_section.image,'body_second_section',product.front_view.body_second_section.x_point,product.front_view.body_second_section.y_point,product.front_view.body_second_section.width,product.front_view.body_second_section.height,setBodySecondSection)
            // frontComponent.bodySecondSection = [new fabric.Image.filters.HueRotation()];

        }
        if (product.front_view.body_third_section?.image){
            loadImage(product.front_view.body_third_section.image,'body_third_section',product.front_view.body_third_section.x_point,product.front_view.body_third_section.y_point,product.front_view.body_third_section.width,product.front_view.body_third_section.height,setBodyThirdSection)

        }
        if (product.front_view.collar.image){
            loadImage(product.front_view.collar.image,'front-collar',product.front_view.collar.x_point,product.front_view.collar.y_point,product.front_view.collar.width,product.front_view.collar.height,setFrontCollar)

        }


        // console.log("kkkk")
        // fabric.Image.fromURL(frontComponent.main_body_view.image, function (body) {
        //     body.id = "body";
        //     body.filters = [new fabric.Image.filters.HueRotation()];
        //     console.log(body.filters)
        //     frontImage = body
        //     body.applyFilters()
        //     var cor = body.set(
        //         {
        //             left: 110,
        //             top: 0,
        //             selectable: false,
        //
        //         })
        //     console.log(cor);
        //     canvas.add(body);
        //
        // }, {crossOrigin: 'anonymous'})

    };
        // fabric.Image.fromURL(zip_url, function (zipper) {
        //     zipper.id = "zipper";
        //     zipper.filters = [new fabric.Image.filters.HueRotation()];
        //     console.log(zipper.filters)
        //     zipImage = zipper
        //     var zipper_v = zipper.set(
        //         {
        //             left: 310,
        //             top: 160,
        //             selectable: false,
        //         })
        //     console.log(zipper_v);
        //
        //     zipper.applyFilters()
        //     zipper_v.bringToFront();
        //     zipper_v.bringForward(true);
        //     canvas.add(zipper);
        //
        // }, {crossOrigin: 'anonymous'})

        // fabric.Image.fromURL(hoodUrl, function (hoodie) {
        //     hoodie.id = "zipper";
        //     hoodie.filters = [new fabric.Image.filters.HueRotation()];
        //     console.log(hoodie.filters)
        //     hoodImage = hoodie
        //     hoodie.applyFilters()
        //     var hood_v = hoodie.set(
        //         {
        //             left: 257,
        //             top: 30,
        //             selectable: false,
        //         })
        //     console.log(hood_v);
        //     hood_v.bringToFront();
        //     hood_v.bringForward(true);
        //     canvas.add(hoodie);
        //
        // }, {crossOrigin: 'anonymous'})

    const backImageLoad = (e) => {
        fabric.Image.fromURL(backUrl, function (back_img) {
            back_img.id = "body";
            back_img.filters = [new fabric.Image.filters.HueRotation()];
            backImage = back_img
            back_img.applyFilters()
            back_img.set(
                {
                    left: 110,
                    top: 86,
                    selectable: false

                })
            canvas.add(back_img);
        }, {crossOrigin: 'anonymous'})
    };

    const leftImageLoad = (e) => {
        fabric.Image.fromURL(leftSleeveUrl, function (sleeve) {
            sleeve.id = "body";
            sleeve.filters = [new fabric.Image.filters.HueRotation()];
            leftSleeveImage = sleeve;
            sleeve.applyFilters()
            sleeve.set(
                {
                    left: 110,
                    top: 84,
                    selectable: false

                })
            canvas.add(sleeve);
        }, {crossOrigin: 'anonymous'})
    };

    const rightImageLoad = (e) => {
        fabric.Image.fromURL(rightSleeveUrl, function (sleeve) {
            sleeve.id = "body";
            sleeve.filters = [new fabric.Image.filters.HueRotation()];
            rightSleevImage = sleeve
            sleeve.applyFilters()
            sleeve.set(
                {
                    left: 110,
                    top: 84,
                    selectable: false

                })
            canvas.add(sleeve)
        }, {crossOrigin: 'anonymous'})


    };

    const textShow = () => {

        var text = new fabric.Textbox(
            'This is Text',
            {
                width:500,
                textAlign:"center",
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

    // const blue_btn_clicked_front_chest = (e) => {
    //     frontImage.filters[0].rotation = -0.7925393031704733
    //     frontImage.applyFilters();
    //     canvas.requestRenderAll();
    // }
    // function Box() {
    //     console.log("box")
    //     return (
    //         <mesh>
    //             <boxBufferGeometry attach="geometry" args={[1,1,1]}></boxBufferGeometry>
    //             <meshLamberMaterial attach="material" color="red"/>
    //         </mesh>
    //     )
    // }
    // const show_text = (t) => {
    //     fabric.Text(function (text) {
    //         text.id = "body_text";
    //         text.set(
    //             {
    //                 left: 560,
    //                 top: 100,
    //                 selectable: true,
    //                 fontFamily: "arial",
    //                 color: "#000"
    //
    //             })
    //         console.log(text)
    //         canvas.add(text);
    //     }, {crossOrigin: 'anonymous'})
    // }
// const Results = () => (
//         <div id="results" className="search-results" style={{marginTop:"500"}}>
//         <p>Select Front Top Left Colors</p>
//              <button id='blue_btn_front_top_left' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         backgroundColor: "blue",
//                         border: "1 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={blue_btn_clicked_front}>
//             </button>
//             <button id='red_btn_front_top_left' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         marginLeft: 10,
//                         backgroundColor: "red",
//                         border: "3 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={red_btn_clicked_front}></button>
//             <button id='green_btn_front_top_left' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         marginLeft: 10,
//                         backgroundColor: "green",
//                         border: "3 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={green_btn_clicked_front}></button>
//
//             <p>Select Front Top Right Colors</p>
//             <button id='blue_btn_front_top_right' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         backgroundColor: "blue",
//                         border: "1 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={blue_btn_clicked_front}>
//             </button>
//             <button id='red_btn_front_top_right' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         marginLeft: 10,
//                         backgroundColor: "red",
//                         border: "3 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={red_btn_clicked_front}></button>
//             <button id='green_btn_front_top_right' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         marginLeft: 10,
//                         backgroundColor: "green",
//                         border: "3 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={green_btn_clicked_front}></button>
//
//             <p>Select Front Bottom Left Colors</p>
//             <button id='blue_btn_front_bottom_left' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         backgroundColor: "blue",
//                         border: "1 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={blue_btn_clicked_front}>
//             </button>
//             <button id='red_btn_front_bottom_left' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         marginLeft: 10,
//                         backgroundColor: "red",
//                         border: "3 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={red_btn_clicked_front}></button>
//             <button id='green_btn_front_bottom_left' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         marginLeft: 10,
//                         backgroundColor: "green",
//                         border: "3 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={green_btn_clicked_front}></button>
//
//             <p>Select Front Bottom Right Color</p>
//             <button id='blue_btn_front_bottom_right' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         backgroundColor: "blue",
//                         border: "1 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={blue_btn_clicked_front}>
//             </button>
//             <button id='red_btn_front_bottom_right' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         marginLeft: 10,
//                         backgroundColor: "red",
//                         border: "3 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={red_btn_clicked_front}></button>
//             <button id='green_btn_front_bottom_right' type='button'
//                     style={{
//                         width: 30,
//                         height: 30,
//                         marginLeft: 10,
//                         backgroundColor: "green",
//                         border: "3 px solid black",
//                         borderRadius: "50%"
//                     }}
//                     onClick={green_btn_clicked_front}></button>


//   </div>
// )


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
        loadColor(bodyFisrtSection,-0.7925393031704733)
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
        console.log(bodySecondSection, "#00ff00")
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
        console.log(color)
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
    };



    return (

        <div>
            <button type='button' name='circle' onClick={frontImageLoad}>
                Front View
            </button>
            {/*{ showResults ? <Results /> : null }*/}
            <button type="button" name="back_view" onClick={backImageLoad}>Back View</button>
            <button type="button" name="left_view" onClick={leftImageLoad}>Left View</button>
            <button type="button" name="right_view" onClick={rightImageLoad}>Right View</button>

            <button type='button' name='triangle' onClick={addShape}>
                Add a Triangle
            </button>

            <button type='button' name='rectangle' onClick={addShape}>
                Add a Rectangle
            </button>

            <button type='button' name='upload_logo' onClick={load_logo}>
                Load Logo
            </button>

            <button type='button' name='add_text' onClick={textShow}>Add Text</button>
            <button type='button' name='download' onClick={download_Image}>
                Download Design
            </button>

            <input type="button" onClick={showDiv} value="click on me"/>
            <form id="hello" style={{display:"none"}}>
                <label>Enter Name: </label>
                <input type="text" id="name" required/>
                <button type="button" onClick={showValue}>submit</button>
            </form>


            <br></br>


            <br></br>
            <br></br>
             <p>Select Front First Section  Colors</p>
              <button id='blue_btn_front_top_left' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "blue",
                        border: "1 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={()=>{loadColor(bodyFisrtSection,-0.7925393031704733)}}>
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
                    onClick={()=>{loadColor(bodyFisrtSection,0.04339308661309316)}}
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
                    onClick={()=>{loadColor(bodyFisrtSection,0.7721581741520329)}}
            ></button>

            <p>Select Front second Section  Colors</p>
            <button id='blue_btn_front_top_left' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "blue",
                        border: "1 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={()=>{loadColor(bodySecondSection,-0.7925393031704733)}}>
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
                    onClick={()=>{loadColor(bodySecondSection, 0.04339308661309316)}}
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
                    onClick={()=>{loadColor(bodySecondSection, 0.7721581741520329)}}
            ></button>

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

            <p>Select Right Sleeve Color</p>
            <button id='blue_btn_sleeve' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "blue",
                        border: "1 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={blue_btn_clicked_sleeve_right}></button>
            <button id='red_btn_sleeve' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        marginLeft: 10,
                        backgroundColor: "red",
                        border: "3 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={red_btn_clicked_sleeve_right}></button>
            <button id='green_btn_sleeve' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        marginLeft: 10,
                        backgroundColor: "green",
                        border: "3 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={green_btn_clicked_sleeve_right}></button>

            <p>Select Left Sleeve Color</p>
            <button id='blue_btn_sleeve' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "blue",
                        border: "1 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={blue_clicked_sleeve_left}></button>
            <button id='red_btn_sleeve' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        marginLeft: 10,
                        backgroundColor: "red",
                        border: "3 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={red_clicked_sleeve_left}></button>
            <button id='green_btn_sleeve' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        marginLeft: 10,
                        backgroundColor: "green",
                        border: "3 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={green_clicked_sleeve_left}></button>


            <p>Select Back Color</p>

            <button id='blue_btn_end' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        backgroundColor: "blue",
                        border: "1 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={blue_btn_clicked_back}></button>
            <button id='red_btn_end' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        marginLeft: 10,
                        backgroundColor: "red",
                        border: "3 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={red_btn_clicked_back}></button>
            <button id='green_btn_end' type='button'
                    style={{
                        width: 30,
                        height: 30,
                        marginLeft: 10,
                        backgroundColor: "green",
                        border: "3 px solid black",
                        borderRadius: "50%"
                    }}
                    onClick={green_btn_clicked_back}></button>

            {/*<button id='blue_btn_front_chest' type='button'*/}
            {/*        style={{*/}
            {/*            width: 30,*/}
            {/*            height: 30,*/}
            {/*            backgroundColor: "blue",*/}
            {/*            border: "1 px solid black",*/}
            {/*            borderRadius: "50%"*/}
            {/*        }}*/}
            {/*        onClick={blue_btn_clicked_front_chest}></button>*/}

            <div>
                <canvas id='canv' >
                    <div id="ans"></div>
                </canvas>
            </div>

        </div>

);


}

export default SamEditor;

