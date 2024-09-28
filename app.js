// Wait for the page to load
window.onload = function() {
    // Get the canvas element
    const canvas = document.getElementById('glCanvas');
    // Initialize the GL context
    const gl = canvas.getContext('webgl');

    // Check if WebGL is available
    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    // Fragment shader program with a color uniform
    const fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    // Initialize shader program
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);

    // Get attribute and uniform locations
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'uColor');

    // Create a buffer for the rectangle's positions.
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Define rectangle vertices
    const positions = [
        -0.7,  0.5,
         0.7,  0.5,
        -0.7, -0.5,
         0.7, -0.5,
    ];

    // Send the position data to WebGL
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // Enable and configure vertex attributes
    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    // Use the shader program
    gl.useProgram(shaderProgram);

    // Set the default color to red
    gl.uniform4f(colorUniformLocation, 1.0, 0.0, 0.0, 1.0);

    // Function to render the rectangle
    function render() {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    render();

    function setColor(r, g, b, a) {
        gl.uniform4f(colorUniformLocation, r, g, b, a);
        render();
    }

    document.getElementById('green').addEventListener('click', function() {
        setColor(0.0, 1.0, 0.0, 1.0);
    });

    document.getElementById('blue').addEventListener('click', function() {
        setColor(0.0, 0.0, 1.0, 1.0);
    });

    document.getElementById('yellow').addEventListener('click', function() {
        setColor(1.0, 1.0, 0.0, 1.0);
    });

    document.getElementById('red').addEventListener('click', function() {
        setColor(1.0, 0.0, 0.0, 1.0);
    });
};

// Shader initialization function
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    // Create the shader program
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // Error handling
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Load and compile the shader
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    // Check for successful compilation
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}
