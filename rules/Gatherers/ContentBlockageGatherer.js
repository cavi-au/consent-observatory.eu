/**
 * ContentBlockageGatherer
 * 
 * Copyright (c) 2023 Rolf Bagge, Janus Kristensen
 * Copyright (c) 2024, 2025 Janus Kristensen
 * CAVI, Aarhus University
 * 
 * @label Content Blockage Gatherer
 * @description Detects how blocked the page content is by popups etc.
 */
/* exported from gatherer id 8 rev 4 on Sun, 30 Mar 2025 12:19:39 +0200 */
import Gatherer from '../Gatherers/Gatherer.js';
export default class ContentBlockageGatherer extends Gatherer {
    constructor() {
        super();
        this.result = null;
    }

    sweepArea(rectangles) {

        function findHeight(rectArr) {
            let maxY = 0;
    
            rectArr.forEach((rect)=>{
                maxY = Math.max(maxY, rect.y2);
            });
    
            rectArr.sort((r1, r2)=>{
                return r1.y1 - r2.y1;
            });

            let height = 0;

            let lastHeightCalculatedY = 0;
            let activeRectangles = 0;

            if(rectArr.length > 0) {
                for(let sweepLine = rectArr[0].y1; sweepLine <= maxY; sweepLine++) {
                    let hadActive = activeRectangles !== 0;

                    let doneRectangles = rectArr.filter((rect) => {
                        return rect.y2 === sweepLine;
                    });
    
                    activeRectangles -= doneRectangles.length;
    
                    let newRectangles = rectArr.filter((rect) => {
                        return rect.y1 === sweepLine;
                    });
    
                    activeRectangles += newRectangles.length;

                    if(hadActive && activeRectangles === 0) {
                        height += sweepLine - lastHeightCalculatedY;
                    } else if(!hadActive && activeRectangles !== 0) {
                        lastHeightCalculatedY = sweepLine;
                    }
                }
            }

            return height;
        }

        let activeRectangles = [];

        let totalArea = 0;

        let maxX = 0;

        rectangles.forEach((rect)=>{
            rect.x1 = Math.round(rect.x1);
            rect.x2 = Math.round(rect.x2);
            rect.y1 = Math.round(rect.y1);
            rect.y2 = Math.round(rect.y2);
            maxX = Math.max(maxX, rect.x2);
        });

        rectangles.sort((r1, r2)=>{
            return r1.x1 - r2.x1;
        });

        let lastAreaCalculatedX = 0;

        if(rectangles.length > 0) {
            for(let sweepLine = rectangles[0].x1; sweepLine <= maxX; sweepLine++) {
                let doneRectangles = activeRectangles.filter((rect) => {
                    return rect.x2 === sweepLine;
                });

                if(doneRectangles.length > 0) {
                    let width = sweepLine - lastAreaCalculatedX;
                    let height = findHeight(activeRectangles.slice());

                    lastAreaCalculatedX = sweepLine;

                    totalArea += width*height;

                    doneRectangles.forEach((rect)=>{
                        activeRectangles.splice(activeRectangles.indexOf(rect), 1);
                    })
                }

                let newRectangles = rectangles.filter((rect) => {
                    return rect.x1 === sweepLine;
                });

                if(newRectangles.length > 0) {
                    let height = findHeight(activeRectangles.slice());
                    let width = sweepLine - lastAreaCalculatedX;

                    totalArea += height * width;

                    lastAreaCalculatedX = newRectangles[0].x1;

                    newRectangles.forEach((rect)=>{
                        rectangles.shift();
                        activeRectangles.push(rect);
                    });
                }
            }
        }

        return totalArea;
    }

    async onPageWait(scraper) {
        let data = await scraper.page.evaluate(()=>{
            return new Promise((resolve)=>{
                let width = document.documentElement.clientWidth;
                let height = document.documentElement.clientHeight;
    
                let result = {
                    "viewport": {
                        "width": width,
                        "height": height
                    },
                    zIndexRectangles: [],
                    alphaRectangles: [],
                    positionFixedRectangles: [],
                    opacityRectangles: []
                };
    
                let allElements = document.querySelectorAll("*");
    
                let intersectionObserver = new IntersectionObserver((entries)=>{
                    let visibleEntries = entries.filter((entry)=>{
                        return entry.isIntersecting;
                    });
    
                    visibleEntries.forEach((entry)=>{
                        let styles = window.getComputedStyle(entry.target);
    
                        if(styles.zIndex > 100) {
                            result.zIndexRectangles.push({
                                x1: entry.intersectionRect.x,
                                y1: entry.intersectionRect.y,
                                x2: entry.intersectionRect.x + entry.intersectionRect.width,
                                y2: entry.intersectionRect.y + entry.intersectionRect.height
                            });
                        }
    
                        if(styles.opacity > 0 && styles.opacity < 1) {
                            result.opacityRectangles.push({
                                x1: entry.intersectionRect.x,
                                y1: entry.intersectionRect.y,
                                x2: entry.intersectionRect.x + entry.intersectionRect.width,
                                y2: entry.intersectionRect.y + entry.intersectionRect.height
                            });
                        }
    
                        if(styles.position === "fixed") {
                            result.positionFixedRectangles.push({
                                x1: entry.intersectionRect.x,
                                y1: entry.intersectionRect.y,
                                x2: entry.intersectionRect.x + entry.intersectionRect.width,
                                y2: entry.intersectionRect.y + entry.intersectionRect.height
                            });
                        }
    
                        if(styles.backgroundColor.indexOf("rgba") !== -1) {
                            let alpha = styles.backgroundColor.split(",")[3];
                            alpha = alpha.substring(0, alpha.length-1);
                            alpha = parseFloat(alpha);
                            if(alpha > 0 && alpha < 1) {
                                result.alphaRectangles.push({
                                    x1: entry.intersectionRect.x,
                                    y1: entry.intersectionRect.y,
                                    x2: entry.intersectionRect.x + entry.intersectionRect.width,
                                    y2: entry.intersectionRect.y + entry.intersectionRect.height
                                });
                            }
                        }
                    });
    
                    resolve(result);
                });
    
                allElements.forEach((elm)=>{
                    intersectionObserver.observe(elm);
                });
            });
        });

        let zIndexArea = this.sweepArea(data.zIndexRectangles.slice());
        let opacityArea = this.sweepArea(data.opacityRectangles.slice());
        let alphaArea = this.sweepArea(data.alphaRectangles.slice());
        let positionFixedArea = this.sweepArea(data.positionFixedRectangles.slice());

        let viewArea = data.viewport.width * data.viewport.height;

        this.result = {
            zIndexFraction: zIndexArea / viewArea,
            opacityFraction: opacityArea / viewArea,
            alphaFraction: alphaArea / viewArea,
            positionFixedFraction: positionFixedArea / viewArea
        }
    }

    getResult() {
        return this.result;
    }
}
