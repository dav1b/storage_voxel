// Fixed inputs
const svgWidth = window.innerWidth;
const svgHeight = window.innerHeight;

// Initialize the SVG canvas
const svg = d3.select("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Cube Volume Constants
const volumeOuter = Math.pow(494.7, 3);  // Outer cube, actual proportions 1000:0.49 ($87B / TB in 1956 to $11 / TB in 2023 for disk drive space)
const volumeInner = Math.pow(10, 3);  // Inner cube, actual proportions 494.7:10 ($1.2M / TB in 1993 to $11 / TB in 2023 for disk drive space)

// Compute side length from volume
const sizeOuter = Math.cbrt(volumeOuter);
const sizeInner = Math.cbrt(volumeInner);

// Compute the maximum cube size based on available screen space
const maxCubeSize = 0.25 * Math.min(svgWidth, svgHeight);
const scaleFactor = maxCubeSize / sizeOuter;

// Apply scaling factor to cube sizes
const scaledSizeOuter = sizeOuter * scaleFactor;
const scaledSizeInner = sizeInner * scaleFactor;

// Compute the centered position for the cubes
const startX = svgWidth / 2;
const startY = svgHeight/ 2+ scaledSizeOuter / 6; // Adjust for isometric perspective

// Adjust rotation: slightly skew the angles
const angleX = Math.PI / 3; // Adjusted angle for slight rotation
const angleY = Math.PI / 3; // Adjusted for off-center view

// Define face colors
const outerCubeColors = { front: "none", right: "none", left: "none" };  // No fill for transparency
const innerCubeColors = { front: "red", right: "red", left: "red" };  // Different colors for inner cube

// Function to label points dynamically based on their key
function labelPoints(pointObject) {
    Object.entries(pointObject).forEach(([key, value]) => {
        svg.append("text")
            .attr("x", value[0] + 5)  // Offset slightly for visibility
            .attr("y", value[1] - 5)
            .attr("fill", "black")
            .attr("font-size", "12px")
            .attr("font-family", "Arial")
            .text(key);  // Use the key as the label
    });
}

// Function to create a cube face
function drawFace(points, color, opacity, strokeOnly, dashed) {
    svg.append("polygon")
        .attr("points", points.map(p => p.join(",")).join(" "))
        .attr("fill", strokeOnly ? "none" : color)
        .attr("stroke", "black")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", dashed ? "4,4" : "0") // Dashed lines for hidden edges
        .attr("opacity", opacity);
}

// Function to create a full 3D cube
function createCube(x, y, size, faceColours, strokeOnly = false, dashed= false, label = false) {
    const dx = size * Math.cos(angleX);
    const dy = size * Math.cos(angleY);

    const points = {
        // Front face
        frontTopLeft: [x - dx, y - dy - size], // D
        frontTopRight: [x + dx, y - dy - size], // C
        frontBottomLeft: [x - dx, y - dy], // B
        frontBottomRight: [x + dx, y - dy], // A
    
        // Back face (Shifted back and slightly up)
        backTopLeft: [x - dx - size / 2, y - dy - size - size / 2], // H
        backTopRight: [x + dx - size / 2, y - dy - size - size / 2], // G
        backBottomLeft: [x - dx - size / 2, y - dy - size / 2], // F
        backBottomRight: [x + dx - size / 2, y - dy - size / 2] // E
    };

    // Draw visible faces
    drawFace([points.frontTopLeft, points.frontTopRight, points.frontBottomRight, points.frontBottomLeft], faceColours.front, true, true);
    drawFace([points.frontTopLeft, points.backTopLeft, points.backBottomLeft, points.frontBottomLeft], faceColours.left, true, true);
    drawFace([points.frontTopRight, points.backTopRight, points.backBottomRight, points.frontBottomRight], faceColours.right, true, true);
    drawFace([points.frontTopLeft, points.backTopLeft, points.backTopRight, points.frontTopRight], faceColours.right, true, true);

    // Draw hidden edges (dashed)
    drawFace([points.backTopLeft, points.backTopRight, points.backBottomRight, points.backBottomLeft], "none", 1, true, true);
    drawFace([points.frontTopLeft, points.backTopLeft], "none", 1, true, true);
    drawFace([points.frontTopRight, points.backTopRight], "none", 1, true, true);
    drawFace([points.frontBottomLeft, points.backBottomLeft], "none", 1, true, true);
    drawFace([points.frontBottomRight, points.backBottomRight], "none", 1, true, true);

    // Label all points dynamically
    if (label) {
        labelPoints(points);
    }
}

// Clear existing elements
svg.selectAll("*").remove();

// Outer cube: Transparent with only strokes, includes hidden edges
// createCube(startX, startY, scaledSizeOuter, "red", 0.9, true);
createCube(
    startX, 
    startY, 
    scaledSizeOuter, 
    outerCubeColors, 
    true, 
    true,
    false
    );

// Inner cube: Fully visible
// createCube(startX, startY, scaledSizeInner, "red", 1, true);
createCube(
    startX - (scaledSizeOuter - scaledSizeInner) / 2, 
    startY - (scaledSizeOuter - scaledSizeInner) / 2, 
    scaledSizeInner, 
    innerCubeColors, 
    false, 
    false,
    false
    );