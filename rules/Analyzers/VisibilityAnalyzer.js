/**
 * VisibilityAnalyzer
 * 
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Visibility Analyzer
 * @description Enhance any button gatherer and WordBox result with visual metrics and analysis of what the buttons or popups look like
 */
/* exported from gatherer id 24 rev 39 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class VisibilityAnalyzer extends Gatherer {
    constructor() {
        super();
    }

    async onBeforeLoad(scraper) {
        scraper.prepareVisibilityAnalysis = async (target)=>{
            await target.evaluate(()=>{
                window.visibilityAnalysis = async (domElement, targetObject, options={})=>{
                    let parseColor = function parseColor(color) {
                        color = color.trim().toLowerCase();
                        color = _colorsByName[color] || color;
                        var hex3 = color.match(/^#([0-9a-f]{3})$/i);
                        if (hex3) {
                            hex3 = hex3[1];
                            return [
                                parseInt(hex3.charAt(0),16)*0x11,
                                parseInt(hex3.charAt(1),16)*0x11,
                                parseInt(hex3.charAt(2),16)*0x11, 1
                            ];
                        }
                        var hex6 = color.match(/^#([0-9a-f]{6})$/i);
                        if (hex6) {
                            hex6 = hex6[1];
                            return [
                                parseInt(hex6.substr(0,2),16),
                                parseInt(hex6.substr(2,2),16),
                                parseInt(hex6.substr(4,2),16), 1
                            ];
                        }
                        var rgba = color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+.*\d*)\s*\)$/i) || color.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
                        if( rgba ) {
                            return [parseInt(rgba[1]),parseInt(rgba[2]),parseInt(rgba[3]), rgba[4]===undefined?1:parseFloat(rgba[4])];
                        }
                        var rgb = color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
                        if( rgb ) {
                            return [parseInt(rgb[1]),parseInt(rgb[2]),parseInt(rgb[3]),1];
                        }
                        if(color.indexOf('hsl')== 0)
                            return _hslToRgb(color);
                    }

                    let _hslToRgb = function _hslToRgb(hsl){
                        if(typeof hsl== 'string'){
                            hsl= hsl.match(/(\d+(\.\d+)?)/g);
                        }
                        var sub, h= parseInt(hsl[0])/360, s=parseInt(hsl[1])/100, l=parseInt(hsl[2])/100, a = hsl[3]===undefined?1:parseFloat(hsl[3]), t1, t2, t3, rgb, val;
                        if(s== 0){
                            val= Math.round(l*255);
                            rgb= [val, val, val, a];
                        }
                        else{
                            if(l<0.5)
                                t2= l*(1 + s);
                            else
                                t2= l + s - l*s;
                            t1 = 2*l - t2;
                            rgb = [0, 0, 0];
                            for(var i=0; i<3; i++){
                                t3 = h + 1/3 * -(i - 1);
                                t3 < 0 && t3++;
                                t3 > 1 && t3--;
                                if (6 * t3 < 1)
                                    val= t1 + (t2 - t1) * 6 * t3;
                                else if (2 * t3 < 1)
                                    val= t2;
                                else if (3*t3<2)
                                    val = t1 + (t2 - t1) * (2 / 3 - t3) * 6;
                                else
                                    val= t1;
                                rgb[i] = Math.round(val*255);
                            }
                        }
                        rgb.push(a);
                        return rgb;
                    }

                    let rgbToHSV = function rgbToHSV(parsed) {
                        let r = parsed[0]/255;
                        let b = parsed[1]/255;
                        let g = parsed[2]/255;

                        const max = Math.max(r, g, b);
                        const min = Math.min(r, g, b);

                        let h, s, v = max;

                        const d = max - min;

                        if (max === 0) {
                            s = 0;
                        } else {
                            s = d / max;
                        }

                        if (max === min) {
                            h = 0; // achromatic
                        } else {
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

                        return [h * 360, s * 100, v * 100];
                    }


                    var _colorsByName = {aliceblue:"#f0f8ff",antiquewhite:"#faebd7",aqua:"#00ffff",aquamarine:"#7fffd4",azure:"#f0ffff",beige:"#f5f5dc",bisque:"#ffe4c4",
                        black:"#000000",blanchedalmond:"#ffebcd",blue:"#0000ff",blueviolet:"#8a2be2",brown:"#a52a2a",burlywood:"#deb887",cadetblue:"#5f9ea0",
                        chartreuse:"#7fff00",chocolate:"#d2691e",coral:"#ff7f50",cornflowerblue:"#6495ed",cornsilk:"#fff8dc",crimson:"#dc143c",cyan:"#00ffff",
                        darkblue:"#00008b",darkcyan:"#008b8b",darkgoldenrod:"#b8860b",darkgray:"#a9a9a9",darkgreen:"#006400",darkkhaki:"#bdb76b",
                        darkmagenta:"#8b008b",darkolivegreen:"#556b2f",darkorange:"#ff8c00",darkorchid:"#9932cc",darkred:"#8b0000",darksalmon:"#e9967a",
                        darkseagreen:"#8fbc8f",darkslateblue:"#483d8b",darkslategray:"#2f4f4f",darkturquoise:"#00ced1",darkviolet:"#9400d3",deeppink:"#ff1493",
                        deepskyblue:"#00bfff",dimgray:"#696969",dodgerblue:"#1e90ff",firebrick:"#b22222",floralwhite:"#fffaf0",forestgreen:"#228b22",
                        fuchsia:"#ff00ff",gainsboro:"#dcdcdc",ghostwhite:"#f8f8ff",gold:"#ffd700",goldenrod:"#daa520",gray:"#808080",green:"#008000",
                        greenyellow:"#adff2f",honeydew:"#f0fff0",hotpink:"#ff69b4",indianred :"#cd5c5c",indigo :"#4b0082",ivory:"#fffff0",khaki:"#f0e68c",
                        lavender:"#e6e6fa",lavenderblush:"#fff0f5",lawngreen:"#7cfc00",lemonchiffon:"#fffacd",lightblue:"#add8e6",lightcoral:"#f08080",
                        lightcyan:"#e0ffff",lightgoldenrodyellow:"#fafad2",lightgray:"#d3d3d3",lightgreen:"#90ee90",lightpink:"#ffb6c1",lightsalmon:"#ffa07a",
                        lightseagreen:"#20b2aa",lightskyblue:"#87cefa",lightslategray:"#778899",lightsteelblue:"#b0c4de",lightyellow:"#ffffe0",lime:"#00ff00",
                        limegreen:"#32cd32",linen:"#faf0e6",magenta:"#ff00ff",maroon:"#800000",mediumaquamarine:"#66cdaa",mediumblue:"#0000cd",
                        mediumorchid:"#ba55d3",mediumpurple:"#9370db",mediumseagreen:"#3cb371",mediumslateblue:"#7b68ee",mediumspringgreen:"#00fa9a",
                        mediumturquoise:"#48d1cc",mediumvioletred:"#c71585",midnightblue:"#191970",mintcream:"#f5fffa",mistyrose:"#ffe4e1",moccasin:"#ffe4b5",
                        navajowhite:"#ffdead",navy:"#000080",oldlace:"#fdf5e6",olive:"#808000",olivedrab:"#6b8e23",orange:"#ffa500",orangered:"#ff4500",
                        orchid:"#da70d6",palegoldenrod:"#eee8aa",palegreen:"#98fb98",paleturquoise:"#afeeee",palevioletred:"#db7093",papayawhip:"#ffefd5",
                        peachpuff:"#ffdab9",peru:"#cd853f",pink:"#ffc0cb",plum:"#dda0dd",powderblue:"#b0e0e6",purple:"#800080",red:"#ff0000",rosybrown:"#bc8f8f",
                        royalblue:"#4169e1",saddlebrown:"#8b4513",salmon:"#fa8072",sandybrown:"#f4a460",seagreen:"#2e8b57",seashell:"#fff5ee",sienna:"#a0522d",
                        silver:"#c0c0c0",skyblue:"#87ceeb",slateblue:"#6a5acd",slategray:"#708090",snow:"#fffafa",springgreen:"#00ff7f",steelblue:"#4682b4",
                        tan:"#d2b48c",teal:"#008080",thistle:"#d8bfd8",tomato:"#ff6347",turquoise:"#40e0d0",violet:"#ee82ee",wheat:"#f5deb3",white:"#ffffff",
                        whitesmoke:"#f5f5f5",yellow:"#ffff00",yellowgreen:"#9acd32"
                    };

                    let getContrast = function getContrast(col1, col2){
                        let col1Color = parseColor(col1);
                        let col2Color = parseColor(col2);
                        return (Math.abs(col1Color[0]-col2Color[0])+Math.abs(col1Color[1]-col2Color[1])+Math.abs(col1Color[2]-col2Color[2]))/(3*255);
                    }
                    let getSaturationDifference = function getSaturationDifference(col1, col2){
                        let col1Color = parseColor(col1);
                        let col2Color = parseColor(col2);
                        return Math.abs(rgbToHSV(col1Color)[1]-rgbToHSV(col2Color)[1])/(100);
                    }                    

                    let notFullyTransparent = function notFullyTransparent(col){
                        let parsedCol = parseColor(col);
                        if (!parsedCol) return false;
                        if (parsedCol[3]!=0) return true;
                        return false;
                    }

                    let estimateBackgroundImageColour = async function estimateBackgroundImageColour(backgroundImage) {  
                        // Extract the URL from background-image  
                        const urlRegex = /url\(["']?(.*?)["']?\)/;  
                        const match = urlRegex.exec(backgroundImage);  
                    
                        if (!match) return false;
                        return await new Promise((resolve, reject) => {  
                            // Load image
                            const imageUrl = match[1];  
                            const img = new Image();  
                            img.crossOrigin = 'Anonymous';  
                            img.src = imageUrl;  
                            img.onload = function() {  
                                // Draw it to a canvas element  
                                const canvas = document.createElement('canvas');  
                                canvas.width = img.width;  
                                canvas.height = img.height;  
                                const ctx = canvas.getContext('2d');  
                                ctx.drawImage(img, 0, 0);  
                
                                try {  
                                    // Get the average colour data from the canvas  
                                    const imageData = ctx.getImageData(0, 0, img.width, img.height);  
                                    const data = imageData.data;  
                                    let r = 0, g = 0, b = 0;  
                                    const pixelCount = data.length / 4;  
                                    for (let i = 0; i < data.length; i += 4) {  
                                        r += data[i];     // Red  
                                        g += data[i + 1]; // Green  
                                        b += data[i + 2]; // Blue  
                                        // Alpha data[i + 3] is ignored for now
                                    }  
                
                                    // Calculate the average RGB values  
                                    r = Math.round(r / pixelCount);  
                                    g = Math.round(g / pixelCount);  
                                    b = Math.round(b / pixelCount);  
                                    resolve({ r, g, b });  
                                } catch (e) {  
                                    // Reject if there's an error accessing pixel data (e.g., CORS issues)  
                                    reject('Unable to access image data (CORS data issue?)');  
                                }  
                            };  
                
                            // Handle image loading errors  
                            img.onerror = function() {  
                                reject('Unable to load image (CORS?).');  
                            };  
                        });  
                    }  

                    let analyzeElement = async function analyzeElement(el){
                        let styles = window.getComputedStyle(el);
                        let result = {
                            color: styles.color,
                            backgroundColor: styles.backgroundColor,
                            backgroundImage: styles.backgroundImage,
                            borderWidth: styles.borderWidth,
                            borderColor: styles.borderColor,
                            borderRadius: styles.borderRadius,
                            boxShadow: styles.boxShadow,
                            textDecoration: styles.textDecoration,
                            fontSize: styles.fontSize,
                            fontWeight: styles.fontWeight
                        }

                        let extent = el.getBoundingClientRect();
                        if (extent){
                            // Store visuals
                            result.x = extent.x;
                            result.y = extent.y;
                            result.width = extent.width;
                            result.height = extent.height;

                            // Exapand the shadowroots
                            let findVisualElements = function findVisualElements(top, x,y){
                                let results = [];
                                let visualElements = top.elementsFromPoint(extent.x + (extent.width/2), extent.y+(extent.height/2));
                                for (let el of visualElements){
                                    if (el.shadowRoot){
                                        results = results.concat(findVisualElements(el.shadowRoot,x,y));
                                    } else {
                                        results.push(el);
                                    }
                                }
                                return results;
                            }

                            // Analyze clickability
                            let tests = 0;
                            let found = 0;
                            for (let x = 0; x < 30; x+=1){
                                for (let y = 0; y < 30; y+=1){
                                    let clickedElements = findVisualElements(document, extent.x + (x*extent.width/30), extent.y+(y*extent.height/30));
                                    tests++;
                                    if (clickedElements.length>0){
                                        if (el.contains(clickedElements[0])){
                                            found++;
                                        }
                                    }
                                }
                            }        
                            result.clickability = found/tests;

                            // Try to analyze visuals from the compositing list
                            if (result.clickability>0.25 && !options.skipButtonDecomposition){            
                                let centerElements = findVisualElements(document,extent.x + (extent.width/2), extent.y+(extent.height/2));

                                let deepness = 0;
                                let lookingInsideButton = true;
                                for (let centerEl of centerElements){
                                    deepness++;
                                    let centerElStyles = window.getComputedStyle(centerEl);

                                    // Stop looking inside when outside button
                                    let isChild = el.contains(centerEl);
                                    let isSimpleParent = centerEl.contains(el) && centerEl.children.length==1;
                                    if (isSimpleParent && centerEl.childNodes.length>1){
                                        // Check for non-empty sibling text nodes too
                                        centerEl.childNodes.forEach((o)=>{
                                            if (o instanceof Text && o.data.trim().length>0) isSimpleParent = false;
                                        }) 
                                    }
                                    if ((!isChild) && (!isSimpleParent)){
                                        // No longer in a relevant part of the button
                                        result.visualDeepness = deepness;
                                        lookingInsideButton = false;
                                    }

                                    if (lookingInsideButton){
                                        // Background
                                        if ((!result.visualBackgroundColor) && notFullyTransparent(centerElStyles.backgroundColor)){
                                            result.visualBackgroundColor = centerElStyles.backgroundColor;
                                        }
                                        if ((!result.visualBackgroundImage) && centerElStyles.backgroundImage!="none") {
                                            result.visualBackgroundImage = centerElStyles.backgroundImage;
                                            result.visualBackgroundImageRepeat = centerElStyles.backgroundRepeat;
                                        }

                                        // Text color and effects
                                        if (!result.visualColor) result.visualColor = centerElStyles.color;
                                        if ((!result.visualTextDecoration) && !centerElStyles.textDecoration.includes("none")) result.visualTextDecoration = centerElStyles.textDecoration;


                                        // Border
                                        if ((!result.visualBoxShadow) && centerElStyles.boxShadow!="none") result.visualBoxShadow = centerElStyles.boxShadow;
                                        if ((!result.visualBorderRadius) && centerElStyles.borderRadius!="0px") result.visualBorderRadius = centerElStyles.borderRadius;
                                        if ((!result.visualBorderWidth) && centerElStyles.borderBottomWidth!="0px"){
                                            result.visualBorderWidth = centerElStyles.borderBottomWidth;
                                            if (notFullyTransparent(centerElStyles.borderColor)) result.visualBorderColor = centerElStyles.borderColor;
                                        }

                                        // Filter out parent elements containing only padding or other non-visual things not part of the button itself
                                        let hasPropertiesOtherThanPadding = notFullyTransparent(centerElStyles.backgroundColor)
                                                    || (centerElStyles.borderBottomWidth!="0px"&&notFullyTransparent(centerElStyles.borderColor)) 
                                                    || centerElStyles.boxShadow!="none"
                                                    || centerElStyles.backgroundImage!="none"
                                        if ((!isChild) && (!hasPropertiesOtherThanPadding)){
                                            continue; // ignore them
                                        }

                                        // Dimensions
                                        let visualDimensions = centerEl.getBoundingClientRect();
                                        result.visualX = result.visualX?Math.min(result.visualX, visualDimensions.x):visualDimensions.x;
                                        result.visualY = result.visualY?Math.min(result.visualY, visualDimensions.y):visualDimensions.y;
                                        result.visualWidth = result.visualWidth?Math.max(result.visualWidth, visualDimensions.width):visualDimensions.width;
                                        result.visualHeight = result.visualHeight?Math.max(result.visualHeight, visualDimensions.height):visualDimensions.height;
                                    } else {
                                        // Now looking at parent popup

                                        // Background
                                        if ((!result.visualParentBackgroundColor) && notFullyTransparent(centerElStyles.backgroundColor)){
                                            result.visualParentBackgroundColor = centerElStyles.backgroundColor;
                                        }    

                                        // Text
                                        if (!result.visualParentColor) result.visualParentColor = centerElStyles.color;

                                    }
                                }
                            }
                        }

                        // Try to recover button background colour if it isn't set directly as a css colour
                        if (!result.visualBackgroundColor){
                            if (result.visualBackgroundImage){
                                // Attempt to recover background information from gradients
                                let colours = result.visualBackgroundImage.match(/rgba?\([^()]*\)|#\w+/g);
                                let rSum = 0; let gSum = 0; let bSum = 0; let aSum = 0;
                                let gradientHits = 0;
                                if (colours){
                                    for (let colour of colours){
                                        if (!notFullyTransparent(colour)) continue;
                                        let rgb = parseColor(colour);
                                        rSum+=rgb[0]; gSum+=rgb[1]; bSum+=rgb[2]; aSum+=rgb[3];
                                        gradientHits++;
                                    }
                                }

                                if (gradientHits>0){
                                    result.visualGradientBackgroundSteps = colours;
                                    result.visualBackgroundColor = "rgba("+Math.round(rSum/gradientHits)+","+Math.round(bSum/gradientHits)+","+Math.round(gSum/gradientHits)+","+(aSum/gradientHits)+")";
                                    result.visualBackgroundColorSource = "gradient";
                                } else {
                                    // Try reading a background image url() if we think it is not an icon
                                    if (["repeat","repeat-x","repeat-y"].includes(result.visualBackgroundImageRepeat)){
                                        try {
                                            let estimate = await estimateBackgroundImageColour(result.visualBackgroundImage);
                                            if (estimate) {
                                                result.visualBackgroundColor = "rgb("+estimate.r+","+estimate.g+","+estimate.b+")";
                                                result.visualBackgroundColorSource = "image";
                                            }
                                        } catch (ex){
                                            console.log(ex);
                                        }
                                    }
                                }
                            }
                        }

                        console.log("estimating text contrast");
                        if (result.visualColor){
                            if (result.visualBackgroundColor){
                                result.visualColorContrast = getContrast(result.visualColor, result.visualBackgroundColor);
                            } else if (result.visualParentBackgroundColor){
                                // Try to match against parent bg if button has none
                                result.visualColorContrast = getContrast(result.visualColor, result.visualParentBackgroundColor);
                            }
                        }

                        console.log("estimating bg contrast");
                        if (result.visualBackgroundColor){
                            if (result.visualParentBackgroundColor){
                                result.visualBackgroundColorContrast = getContrast(result.visualBackgroundColor, result.visualParentBackgroundColor);
                                result.visualBackgroundColorSaturationDifference = getSaturationDifference(result.visualBackgroundColor, result.visualParentBackgroundColor);
                            }
                        } 

                        console.log("estimating border contrast");
                        if (result.visualBorderColor && result.visualBorderWidth){
                            if (result.visualBackgroundColor && result.visualParentBackgroundColor){
                                // If both button bg and parent bg are available, use the minimal difference against both
                                result.visualBorderColorContrast = Math.min(getContrast(result.visualBorderColor, result.visualBackgroundColor), getContrast(result.visualBorderColor, result.visualParentBackgroundColor));
                                result.visualBorderColorSaturationDifference = Math.min(getSaturationDifference(result.visualBorderColor, result.visualBackgroundColor), getSaturationDifference(result.visualBorderColor, result.visualParentBackgroundColor));
                            } else if (result.visualBackgroundColor){
                                // otherwise use the button bg
                                result.visualBorderColorContrast = getContrast(result.visualBorderColor, result.visualBackgroundColor);
                                result.visualBorderColorSaturationDifference = getSaturationDifference(result.visualBorderColor, result.visualBackgroundColor);
                            } else if (result.visualParentBackgroundColor){
                                // or the parent bg
                                result.visualBorderColorContrast = getContrast(result.visualBorderColor, result.visualParentBackgroundColor);
                                result.visualBorderColorSaturationDifference = getSaturationDifference(result.visualBorderColor, result.visualParentBackgroundColor);
                            }
                        }

                        console.log("calculating score");
                        if (!options.skipScoring){
                            let scores = {};

                            if (result.visualWidth && result.visualHeight){
                                let defaultButtonArea = 150*50; // on a 1920x1080 screen in pixels
                                let buttonArea = result.visualWidth * result.visualHeight;
                                scores.size = Math.max(-1, Math.min(1, buttonArea/defaultButtonArea - 1)); // Default button scores 0
                            } else {
                                // Not having an easily determinable size is punished
                                scores.size = -0.5;
                            }

                            if (result.visualBackgroundColorContrast){
                                scores.background = result.visualBackgroundColorContrast; // Background contrast contributes positively up to +1
                            }
                            if (result.visualBackgroundColorSaturationDifference){
                                if (!scores.background) scores.background = 0;
                                scores.background += result.visualBackgroundColorSaturationDifference; // Saturation adds positively up to +1
                            }                            
                            
                            if (result.visualBorderColorContrast){
                                scores.border = result.visualBorderColorContrast*0.5; // A border can contribute postively up to +0.5
                            }
                            if (result.visualBorderColorSaturationDifference){
                                if (!scores.border) scores.border = 0;
                                scores.border += result.visualBorderColorSaturationDifference*0.5; // Saturation adds positively up to +0.5
                            }                            
                                                        
                            if (result.visualColorContrast){
                                scores.text = result.visualColorContrast-0.5; // Unreadable vs readable text on the button can give +/- 0.5
                            }                            
                            if (result.visualTextDecoration){
                                if (!scores.text) scores.text = 0;
                                scores.text += 0.2; // Text decoration contributes slightly positively
                            }
                            
                            result.score = Object.values(scores).reduce((a, b) => a + b);
                            result.scoreDetails = scores;
                        }

                        return result;
                    }

                    targetObject.visibilityAnalysis = await analyzeElement(domElement);
                    if (window._wordboxClientOffset){
                        try {
                            targetObject.visibilityAnalysis.visualFrameOffsetX=window._wordboxClientOffset.x
                            targetObject.visibilityAnalysis.visualFrameOffsetY=window._wordboxClientOffset.y
                        } catch (ex){
                            // Ignore
                        }
                    }
                    return targetObject;
                };
            });
        };
        return null;
    }
}
