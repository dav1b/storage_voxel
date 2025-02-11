// Fixed inputs
const svgWidth = window.innerWidth;
const svgHeight = window.innerHeight;

// Initialize the SVG canvas
const svg = d3.select("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Cube Volume Constants
const volumeOuter = Math.pow(100, 3);  // Volume of the outer cube
const sizeOuter = Math.cbrt(volumeOuter);  // Compute side length from volume

// Compute the maximum cube size based on available screen space
const maxCubeSize = 0.5 * Math.min(svgWidth, svgHeight); // Fraction of the smaller screen dimension
const scaleFactor = maxCubeSize / sizeOuter;

// Apply scaling factor to cube sizes
const scaledSizeOuter = sizeOuter * scaleFactor;
// const scaledSizeInner = sizeInner * scaleFactor;

// Compute the centered position for the cubes
const startX = svgWidth / 2;
const startY = svgHeight / 2 + scaledSizeOuter / 0.75 ; // Adjust for isometric perspective

// Adjust rotation: slightly skew the angles
const angleX = Math.PI / 5; // Adjusted angle for slight rotation
const angleY = Math.PI / 5; // Adjusted for off-center view


// Function to label a point
function labelPoint(name, x, y) {
    svg.append("text")
        .attr("x", x + 5)  // Offset to avoid overlap
        .attr("y", y - 5)
        .attr("fill", "black")
        .attr("font-size", "12px")
        .attr("font-family", "Arial")
        .text(name);
}

// Function to create a cube face
function drawFace(points, color, opacity, strokeOnly = false, dashed = false) {
    svg.append("polygon")
        .attr("points", points.map(p => p.join(",")).join(" "))
        .attr("fill", strokeOnly ? "none" : color)
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", dashed ? "4,4" : "0") // Dashed lines for hidden edges
        .attr("opacity", opacity);
}

// Function to create a full 3D cube
function createCube(x, y, size, color, opacity, strokeOnly = false) {
    const dx = size * Math.cos(angleX);
    const dy = size * Math.cos(angleY);

    const points = {
        frontTopLeft: [x - dx, y - dy - size],
        frontTopRight: [x + dx, y - dy - size],
        frontBottomLeft: [x - dx, y - dy],
        frontBottomRight: [x + dx, y - dy],
        backTopLeft: [x - dx - size / 4, y - dy - size - size / 2], // Adjusted for slight rotation
        backTopRight: [x + dx - size / 4, y - dy - size - size / 2],
        backBottomLeft: [x - dx - size / 4, y - dy - size / 2],
        backBottomRight: [x + dx - size / 4, y - dy - size / 2]
    };

    // Draw visible faces
    drawFace([points.frontTopLeft, points.frontTopRight, points.frontBottomRight, points.frontBottomLeft], color, opacity, strokeOnly);
    drawFace([points.frontTopRight, points.backTopRight, points.backBottomRight, points.frontBottomRight], d3.color(color).darker(1.2), opacity, strokeOnly);
    drawFace([points.frontTopLeft, points.backTopLeft, points.backBottomLeft, points.frontBottomLeft], d3.color(color).brighter(1.2), opacity, strokeOnly);

    // Draw hidden edges (dashed)
    drawFace([points.backTopLeft, points.backTopRight, points.backBottomRight, points.backBottomLeft], "none", 1, true, true);
    drawFace([points.frontTopLeft, points.backTopLeft], "none", 1, true, true);
    drawFace([points.frontTopRight, points.backTopRight], "none", 1, true, true);
    drawFace([points.frontBottomLeft, points.backBottomLeft], "none", 1, true, true);
    drawFace([points.frontBottomRight, points.backBottomRight], "none", 1, true, true);
}

// // Function to create the **left face** (with labels)

//     const points = {
//         topLeft: [x - dx, y - dy - size],
//         topRight: [x, y - size],
//         bottomLeft: [x - dx, y - dy],
//         bottomRight: [x, y]
//     };
// }

// // Function to create the **right face** (with labels)

//     const points = {
//         topLeft: [x, y - size],
//         topRight: [x + dx, y - dy - size],
//         bottomLeft: [x, y],
//         bottomRight: [x + dx, y - dy]
//     };

// // Function to create the **top face** (with labels)

//     const points = {
//         frontLeft: [x - dx, y - dy - size],  // Front left corner (A)
//         frontRight: [x + dx, y - dy - size], // Front right corner (B)
//         backLeft: [x, y - size],          // Back left corner (E)
//         backRight: [x, y - 2*size]          // Back right corner (F)
//     };

// }

// Clear existing elements
svg.selectAll("*").remove();

// // Draw cube faces with labels
// drawLeftFace(startX, startY, sizeOuter, "none");
// drawRightFace(startX, startY, sizeOuter, "none");
// drawTopFace(startX, startY, sizeOuter, "none");

// Outer cube: Transparent with only strokes, includes hidden edges
createCube(startX, startY, scaledSizeOuter, "red", 0.9, true);

// Inner cube: Fully visible
// createCube(startX, startY, scaledSizeInner, "red", 1);

