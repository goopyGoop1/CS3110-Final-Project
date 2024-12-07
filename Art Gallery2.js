// ColoredCube.js (c) 2012 matsuda
// Vertex shader program
// ColoredCube.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec2 a_TexCoord;\n' +
  'attribute vec4 a_Normal;\n' +
  'attribute float a_whichtex;\n' +
  'varying vec2 v_TexCoord;\n' +
  'varying float v_whichtex;\n' +
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'uniform mat4 u_ModelMatrix;\n' +
  'uniform mat4 u_MvpMatrix;\n' +
  'uniform mat4 u_NormalMatrix;\n' +
  'void main() {\n' +
  '  gl_Position = u_MvpMatrix * u_ModelMatrix * a_Position;\n' +
  '  v_Normal = normalize(vec3(u_NormalMatrix * a_Normal));\n' +
  '  v_Position = vec3(u_ModelMatrix * a_Position);\n' +
  '  v_Color = a_Color;\n' +
  '  v_TexCoord = a_TexCoord;\n' +
  '  v_whichtex = a_whichtex;\n' +
  '}\n';


// Fragment shader
var FSHADER_SOURCE =
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'uniform sampler2D u_Sampler0;\n' +
  'uniform sampler2D u_Sampler1;\n' +
  'uniform sampler2D u_Sampler2;\n' +
  'uniform sampler2D u_Sampler3;\n' +
  'uniform sampler2D u_Sampler4;\n' +
  'uniform sampler2D u_Sampler5;\n' +
  'uniform sampler2D u_Sampler6;\n' +
  'uniform vec3 u_LightColor;\n' +
  'uniform vec3 u_LightPosition;\n' +
  'uniform vec3 u_AmbientLight;\n' +
  'varying vec2 v_TexCoord;\n' +
  'varying float v_whichtex;\n' +
  'varying vec4 v_Color;\n' +
  'varying vec3 v_Normal;\n' +
  'varying vec3 v_Position;\n' +
  'void main() {\n' +
  '  vec4 textureColor;\n' +
  '  if (v_whichtex == 0.0) {\n' +
  '    textureColor = texture2D(u_Sampler0, v_TexCoord);\n' +
  '  } else if (v_whichtex == 1.0) {\n' +
  '    textureColor = texture2D(u_Sampler1, v_TexCoord);\n' +
  '  } else if (v_whichtex == 2.0) {\n' +
  '    textureColor = texture2D(u_Sampler2, v_TexCoord);\n' +
  '  } else if (v_whichtex == 3.0) {\n' +
  '    textureColor = texture2D(u_Sampler3, v_TexCoord);\n' +
  '  } else if (v_whichtex == 4.0) {\n' +
  '    textureColor = texture2D(u_Sampler4, v_TexCoord);\n' +
  '  } else if (v_whichtex == 5.0) {\n' +
  '    textureColor = texture2D(u_Sampler5, v_TexCoord);\n' +
  '  } else if (v_whichtex == 6.0) {\n' +
  '    textureColor = texture2D(u_Sampler6, v_TexCoord);\n' +
  '  } else {\n' +
  '    textureColor = v_Color;\n' +
  '  }\n' +
  '  vec3 normal = normalize(v_Normal);\n' +
  '  vec3 lightDirection = normalize(u_LightPosition - v_Position);\n' +
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
  '  vec3 diffuse = u_LightColor * textureColor.rgb * nDotL;\n' +
  '  vec3 ambient = u_AmbientLight * textureColor.rgb;\n' +
  '  gl_FragColor = vec4(diffuse + ambient, textureColor.a);\n' +
  '}\n';


  var texturesLoaded = 0;  
  var fov = 100;
  var eyeX = 0.0, eyeY = 0.0, eyeZ = 8.0;
  var atX = 0.0, atY = 0.0, atZ = 0.0;
  var upX = 0.0, upY = 1.0, upZ = 0.0; 
  var step = 0.2;
  var yaw = 0; 
  var pitch = 0; 
  var sensitivity = 2; 
  var rotation = 0.0; 
  var time = 0; 



  function main() {
   
    var canvas = document.getElementById('webgl');
  
    
    var gl = getWebGLContext(canvas);
    if (!gl) {
      console.log('Failed to get the rendering context for WebGL');
      return;
    }
  
 
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
      console.log('Failed to initialize shaders.');
      return;
    }
    

   
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
    
    
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    var u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');
    var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
    var u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
    var u_LightPosition = gl.getUniformLocation(gl.program, 'u_LightPosition');
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
   
   
    if (!u_MvpMatrix|| !u_ModelMatrix || !u_LightColor || !u_LightPosition || !u_NormalMatrix || !u_AmbientLight) {
      console.log('Failed to get the storage location of the Us');
      return;
    }
    
    
    

   
    if (!initTextures(gl,canvas, u_MvpMatrix, u_ModelMatrix)) {
      console.log('Failed to intialize the texture.');
      return;
    }
  
    var a_whichtex = gl.getAttribLocation(gl.program, 'a_whichtex');
  if (a_whichtex < 0) {
    console.log('Failed to get the storage location of a_whichtex');
    return;
  }


      time =  Date.now(); 
      animate(gl, canvas, u_MvpMatrix, u_ModelMatrix,a_whichtex);
   
     
     

 
    document.addEventListener("keydown", (event) => movement(event, gl, canvas, u_MvpMatrix, u_ModelMatrix, a_whichtex, u_AmbientLight, u_LightPosition, u_LightColor, u_NormalMatrix));
  
    function movement(event, gl, canvas, u_MvpMatrix, u_ModelMatrix,  u_AmbientLight, u_LightPosition, u_LightColor,u_NormalMatrix){
      switch (event.key){
        case "ArrowUp": 
        case "w":
        case "W":   
          eyeZ -= step; 
          atZ -= step; 
          break; 

        case "ArrowDown":
        case "x":
        case "X":  
          eyeZ += step; 
          atZ += step;
          break; 
      

        case "ArrowLeft":
        case "a":
        case "A":  
          eyeX -= step; 
          atX -= step; 
          break;

        case "ArrowRight":
        case "d":
        case "D":  
          eyeX += step; 
          atX += step; 
          break;

        case "+":
          fov =  Math.min(fov + 5, 150); 
          break; 
          
        case "-":
          fov = Math.max(fov - 5, 20); 
          break; 


          case "q": 
          yaw -= sensitivity;
          break;
      case "e": 
          yaw += sensitivity;
          break;
      case "r": 
          pitch = Math.min(pitch + sensitivity, 89); // Prevent over-rotation
          break;
      case "f": 
          pitch = Math.max(pitch - sensitivity, -89); // Prevent over-rotation
          break;
          
        }
        calculateNewAtXYZ();
        animate(gl, canvas, u_MvpMatrix, u_ModelMatrix,a_whichtex, u_AmbientLight, u_LightColor ,u_LightPosition, u_NormalMatrix);

    }

    animate(gl, canvas, u_MvpMatrix, u_ModelMatrix,a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix);
}
  

function calculateNewAtXYZ() {
  var radYaw = (yaw * Math.PI) / 180.0;
  var radPitch = (pitch * Math.PI) / 180.0;

  atX = eyeX + Math.cos(radPitch) * Math.sin(radYaw);
  atY = eyeY + Math.sin(radPitch);
  atZ = eyeZ - Math.cos(radPitch) * Math.cos(radYaw);
}


function drawGallery (gl, canvas, u_MvpMatrix, u_ModelMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix){
  var mvpMatrix = new Matrix4();
  mvpMatrix.setPerspective(fov, canvas.width / canvas.height, 0.1, 50);
  mvpMatrix.lookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
  gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

  //if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) return -1;
    //gl.enableVertexAttribArray(gl.getAttribLocation(gl.program, 'a_Color'));

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
  
  
  drawRoom(gl, canvas, u_ModelMatrix, u_MvpMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix);
  drawPictureFrames(gl, canvas, u_ModelMatrix, u_MvpMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix);
  drawStand(gl, canvas, u_ModelMatrix, u_MvpMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix);
  drawPyramid(gl, canvas, u_ModelMatrix, u_MvpMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix);
  drawSphere(gl, canvas, u_ModelMatrix, u_MvpMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix); 


}

function drawRoom(gl, canvas, u_ModelMatrix, u_MvpMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix) {
  
   var modelMatrix = new Matrix4();  // Model matrix
  var mvpMatrix = new Matrix4();    // Model view projection matrix
  var normalMatrix = new Matrix4(); // Transformation matrix for normals
   
    

  

  gl.vertexAttrib1f(a_whichtex, -1.0);
    var vertices = new Float32Array([
        // Floor
    -3.5, -1.5,  5.0,   3.5, -1.5,  5.0,  -3.5, -1.5, -5.0,   3.5, -1.5, -5.0,
    // Ceiling
    -3.5,  1.5,  5.0,   3.5,  1.5,  5.0,  -3.5,  1.5, -5.0,   3.5,  1.5, -5.0,
    // Back Wall
    -3.5, -1.5, -5.0,   3.5, -1.5, -5.0,  -3.5,  1.5, -5.0,   3.5,  1.5, -5.0,
    // Left Wall
    -3.5, -1.5,  5.0,  -3.5,  1.5,  5.0,  -3.5, -1.5, -5.0,  -3.5,  1.5, -5.0,
    // Right Wall
     3.5, -1.5,  5.0,   3.5,  1.5,  5.0,   3.5, -1.5, -5.0,   3.5,  1.5, -5.0
    ]);

    // Define colors for each wall
    var colors = new Float32Array([
        // Floor (brown)
        0.850, 0.647, 0.382,  0.850, 0.647, 0.382,  0.850, 0.647, 0.382,  0.850, 0.647, 0.382,
        // Ceiling (light blue)
        0.678, 0.847, 0.902,  0.678, 0.847, 0.902,  0.678, 0.847, 0.902,  0.678, 0.847, 0.902,
        // Back Wall (green)
        0.196, 0.804, 0.196,  0.196, 0.804, 0.196,  0.196, 0.804, 0.196,  0.196, 0.804, 0.196,
        // Left Wall (orange)
        1.0, 0.647, 0.0,      1.0, 0.647, 0.0,      1.0, 0.647, 0.0,      1.0, 0.647, 0.0,
        // Right Wall (red)
        1.0, 0.0, 0.0,        1.0, 0.0, 0.0,        1.0, 0.0, 0.0,        1.0, 0.0, 0.0
    ]);

    // Define indices for the room walls
    var indices = new Uint8Array([
        // Floor
        0, 1, 2,  1, 2, 3,
        // Ceiling
        4, 5, 6,  5, 6, 7,
        // Back Wall
        8, 9, 10,  9, 10, 11,
        // Left Wall
        12, 13, 14,  13, 14, 15,
        // Right Wall
        16, 17, 18,  17, 18, 19
    ]);

    var normals = new Float32Array([
      // Floor
      0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,   0.0, 1.0, 0.0,
      // Ceiling
      0.0, -1.0, 0.0,   0.0, -1.0, 0.0,   0.0, -1.0, 0.0,   0.0, -1.0, 0.0,
      // Back Wall
      0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,   0.0, 0.0, 1.0,
      // Left Wall
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
      // Right Wall
      -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0
  ]);


    // Create and bind vertex and color buffers
    if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;
    if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) return -1;
    if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) return -1;


    // Create and bind index buffer
    var indexBuffer = gl.createBuffer();
    if (!indexBuffer) return -1;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    // Enable depth testing and face culling
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    gl.uniform3f(u_LightPosition, -2.0, 3.0, 0);
    // Set the ambient light
    gl.uniform3f(u_AmbientLight, 0.5, 0.5, 0.5);

      modelMatrix.setIdentity();
      mvpMatrix.setPerspective(fov, canvas.width / canvas.height, 0.1, 50);
      mvpMatrix.lookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
      mvpMatrix.multiply(modelMatrix);
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);





    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    gl.uniform3f(u_LightPosition, 3.0, 3.0, -1.0);
    // Set the ambient light
    gl.uniform3f(u_AmbientLight, 0.21, 0.21, 0.21);

      modelMatrix.setIdentity();
      normalMatrix.setIdentity
      mvpMatrix.setPerspective(fov, canvas.width / canvas.height, 0.1, 50);
      mvpMatrix.lookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
      mvpMatrix.multiply(modelMatrix);
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);
    

    drawFloorGrid(gl, u_ModelMatrix,a_whichtex);
    return indices.length;
}

function drawFloorGrid(gl, u_ModelMatrix, a_whichtex) {
  var modelMatrix = new Matrix4();


  gl.vertexAttrib1f(a_whichtex, -1.0);
 
  var horizontalLine = new Float32Array([
      -3.5, -1.5, 5.0, 0.0, 0.0, 0.0,  
       3.5, -1.5, 5.0, 0.0, 0.0, 0.0   
  ]);


  var verticalLine = new Float32Array([
    -3.5, -1.5,  -5.0, 0.0, 0.0, 0.0,  
    -3.5,  -1.5,  5.0, 0.0, 0.0, 0.0   
]); 

  var FSIZE = horizontalLine.BYTES_PER_ELEMENT;

 
  var buffer = gl.createBuffer();
  if (!buffer) {
      console.log('Failed to create buffer object');
      return -1;
  }
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
  if (a_Position < 0 || a_Color < 0 ) {
      console.log('Failed to get the storage location of a_Position');
      return -1;
  }
  
  // Bind buffer and write data
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, horizontalLine, gl.STATIC_DRAW);


  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0); // Stride is 6 floats, offset is 0
  gl.enableVertexAttribArray(a_Position);
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3); // Stride is 6 floats, offset is 3 floats
  gl.enableVertexAttribArray(a_Color);

for(let z = 5; z > -10; z-= 0.25){
    modelMatrix.setTranslate(0, 0, z);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINES, 0, horizontalLine.length / 6); // Each vertex has 6 components (3 position + 3 color)
} 
  gl.bufferData(gl.ARRAY_BUFFER, verticalLine, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 6, 0); // Stride: 6 floats, Offset: 0
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 6, FSIZE * 3); // Stride: 6 floats, Offset: 3 floats

for(let x = -3.5; x < 7.0; x+= 0.25){
  modelMatrix.setTranslate(x, 0, 0);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
  gl.drawArrays(gl.LINES, 0, verticalLine.length / 6); 
}

}



  function drawStand(gl, canvas, u_ModelMatrix, u_MvpMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix) {
    gl.vertexAttrib1f(a_whichtex, -1.0);
    var modelMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();    // Model view projection matrix
    var normalMatrix = new Matrix4(); // Transformation matrix for normals
    
      var vertices = new Float32Array([   // Vertex coordinates
         1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,    // v0-v1-v2-v3 front
         1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,    // v0-v3-v4-v5 right
         1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,    // v0-v5-v6-v1 up
        -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,    // v1-v6-v7-v2 left
        -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,    // v7-v4-v3-v2 down
         1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0     // v4-v7-v6-v5 back
      ]);
    
      var colors1 = new Float32Array([     // Colors
        0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  
        0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  
        0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  
        0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  
        0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900, 
        0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  0.279, 0.362, 0.900,  
      ]);


      var colors2 = new Float32Array([     // Colors
        0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  
        0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  
        0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  
        0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  
        0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496, 
        0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  0.279, 0.900, 0.496,  
      ]);
    
      var indices = new Uint8Array([       // Indices of the vertices
         0, 1, 2,   0, 2, 3,    // front
         4, 5, 6,   4, 6, 7,    // right
         8, 9,10,   8,10,11,    // up
        12,13,14,  12,14,15,    // left
        16,17,18,  16,18,19,    // down
        20,21,22,  20,22,23     // back
      ]);


      var normals = new Float32Array([
        // Front face normals
        0.0,  0.0,  1.0,   0.0,  0.0,  1.0,   0.0,  0.0,  1.0,   0.0,  0.0,  1.0,
        // Right face normals
        1.0,  0.0,  0.0,   1.0,  0.0,  0.0,   1.0,  0.0,  0.0,   1.0,  0.0,  0.0,
        // Up (top) face normals
        0.0,  1.0,  0.0,   0.0,  1.0,  0.0,   0.0,  1.0,  0.0,   0.0,  1.0,  0.0,
        // Left face normals
       -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,  -1.0,  0.0,  0.0,
        // Down (bottom) face normals
        0.0, -1.0,  0.0,   0.0, -1.0,  0.0,   0.0, -1.0,  0.0,   0.0, -1.0,  0.0,
        // Back face normals
        0.0,  0.0, -1.0,   0.0,  0.0, -1.0,   0.0,  0.0, -1.0,   0.0,  0.0, -1.0,
    ]);
    
      // Create a buffer object
      var indexBuffer = gl.createBuffer();
      if (!indexBuffer) return -1;
    
      if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) return -1;

      if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;
    
      if (!initArrayBuffer(gl, colors1, 3, gl.FLOAT, 'a_Color')) return -1;

      
    
      // Write the indices to the buffer object
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    
      gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
      // Set the light direction (in the world coordinate)
      gl.uniform3f(u_LightPosition, 2.50, -1.0, 1.75);
      // Set the ambient light
      gl.uniform3f(u_AmbientLight, 0.5, 0.5, 0.5);
    
      modelMatrix.setIdentity();
      mvpMatrix.setPerspective(fov, canvas.width / canvas.height, 0.1, 50);
      mvpMatrix.lookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
      mvpMatrix.multiply(modelMatrix);
      normalMatrix.setInverseOf(modelMatrix);
      normalMatrix.transpose();
      modelMatrix.setTranslate(3.0, -1.0, 1.75).scale(.20, .35, .25);
      gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
      gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

      gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);

   

    if (!initArrayBuffer(gl, colors2, 3, gl.FLOAT, 'a_Color')) return -1;

    gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    gl.uniform3f(u_LightPosition, -2.50, -1.0, -1.75);
    // Set the ambient light
    gl.uniform3f(u_AmbientLight, 0.5, 0.5, 0.5);

    //normalMatrix.setIdentity();
    modelMatrix.setIdentity();
    mvpMatrix.setPerspective(fov, canvas.width / canvas.height, 0.1, 50);
    mvpMatrix.lookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
    mvpMatrix.multiply(modelMatrix);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    modelMatrix.setTranslate(-3.0, -1.0, -1.30).scale(.20, .35, .25);
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
      gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_BYTE, 0);


}
  
function drawPyramid(gl, canvas, u_ModelMatrix, u_MvpMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix) {
  gl.vertexAttrib1f(a_whichtex, -1.0);
  var modelMatrix = new Matrix4();
  var mvpMatrix = new Matrix4();    // Model view projection matrix
  var normalMatrix = new Matrix4(); // Transformation matrix for normals
  var vertices = new Float32Array([
      0.0,  1.0,  0.0,  // Apex (top)
     -0.5,  0.0, -0.5,  // Base vertex 1
      0.5,  0.0, -0.5,  // Base vertex 2
      0.0,  0.0,  0.5   // Base vertex 3
  ]);

  // Colors for each vertex (same for simplicity, but can vary)
  const colors = new Float32Array([
    0.900, 0.279, 0.786, 
    0.900, 0.279, 0.786, 
    0.900, 0.279, 0.786,,    // the extra , is done on to creat an effect  
    0.900, 0.279, 0.786, 
  ]);

  // Indices defining the triangular faces
  const indices = new Uint16Array([
      0, 1, 2,  // Side 1
      0, 2, 3,  // Side 2
      0, 3, 1,  // Side 3
      1, 2, 3   // Base (triangle)
  ]);

  var normals = new Float32Array([
    // Side 1 (0, 1, 2)
    0.0,  0.447,  0.894,   0.0,  0.447,  0.894,   0.0,  0.447,  0.894,
    // Side 2 (0, 2, 3)
   -0.707,  0.353,  0.707,  -0.707,  0.353,  0.707,  -0.707,  0.353,  0.707,
    // Side 3 (0, 3, 1)
    0.707,  0.353,  0.707,   0.707,  0.353,  0.707,   0.707,  0.353,  0.707,
    // Base (1, 2, 3)
    0.0, -1.0,  0.0,   0.0, -1.0,  0.0,   0.0, -1.0,  0.0
]);

// Create a buffer object
var indexBuffer = gl.createBuffer();
if (!indexBuffer) return -1;

// Write the vertex coordinates and color to the buffer object
if (!initArrayBuffer(gl, vertices, 3, gl.FLOAT, 'a_Position')) return -1;

if (!initArrayBuffer(gl, colors, 3, gl.FLOAT, 'a_Color')) return -1;
if (!initArrayBuffer(gl, normals, 3, gl.FLOAT, 'a_Normal')) return -1;



// Write the indices to the buffer object
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// Set the light color (white)
gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
// Set the light direction (in the world coordinate)
gl.uniform3f(u_LightPosition, -2.750, 2.0, -2.50);
// Set the ambient light
gl.uniform3f(u_AmbientLight, 0.8, 0.85, 0.85);

modelMatrix.setIdentity();
mvpMatrix.setPerspective(fov, canvas.width / canvas.height, 0.1, 50);
mvpMatrix.lookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
mvpMatrix.multiply(modelMatrix);
normalMatrix.setInverseOf(modelMatrix);
normalMatrix.transpose();
modelMatrix.setTranslate(-3.0, -0.5, -1.250).rotate(rotation *180/ Math.PI, 0, 1, 0).scale(.35, .45, .35);
gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);


}


function drawSphere(gl, canvas, u_ModelMatrix, u_MvpMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix) {
  gl.vertexAttrib1f(a_whichtex, -1.0);
  var modelMatrix = new Matrix4();
  var mvpMatrix = new Matrix4();    
  var normalMatrix = new Matrix4();
  const latBands = 20, longBands = 20;
  const vertices = [], colors = [], indices = [];

  for (let lat = 0; lat <= latBands; lat++) {
      const theta = (lat * Math.PI) / latBands;
      const sinTheta = Math.sin(theta);
      const cosTheta = Math.cos(theta);

      for (let lon = 0; lon <= longBands; lon++) {
          const phi = (lon * 2 * Math.PI) / longBands;
          const sinPhi = Math.sin(phi);
          const cosPhi = Math.cos(phi);

          const x = cosPhi * sinTheta;
          const y = cosTheta;
          const z = sinPhi * sinTheta;

          vertices.push(x, y, z);
          if(lat % 2 === 0){
          colors.push(0.900, 0.279, 0.320);
          
        } else if(lat % 3 === 0){
          colors.push(0.486, 0.900, 0.279);
        
        } else {
          colors.push(0.579, 0.279, 0.900);

        }
          if (lat < latBands && lon < longBands) {
              const first = lat * (longBands + 1) + lon;
              const second = first + longBands + 1;
              indices.push(first, second, first + 1, second, second + 1, first + 1);
          }
      }
  }


  const normals = [];
for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];
    // Add the normalized vertex position as the normal
    normals.push(x, y, z); // Already normalized because the radius is 1
}
if (!initArrayBuffer(gl, new Float32Array(normals), 3, gl.FLOAT, 'a_Normal')) return -1;

  var indexBuffer = gl.createBuffer();
  if (!indexBuffer) return -1;
  
  // Write the vertex coordinates and color to the buffer object
  if (!initArrayBuffer(gl, new Float32Array(vertices), 3, gl.FLOAT, 'a_Position')) return -1;
  if (!initArrayBuffer(gl, new Float32Array(colors), 3, gl.FLOAT, 'a_Color')) return -1;
  if (!initArrayBuffer(gl, new Float32Array(normals), 3, gl.FLOAT, 'a_Normal')) return -1;
  
  
  // Write the indices to the buffer object
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
  
  // Set the light color (white)
gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
// Set the light direction (in the world coordinate)
gl.uniform3f(u_LightPosition, 3.0, 1.90, 2.50);
// Set the ambient light
gl.uniform3f(u_AmbientLight, 0.5, 0.5, 0.5);
  




modelMatrix.setIdentity();
mvpMatrix.setPerspective(fov, canvas.width / canvas.height, 0.1, 50);
mvpMatrix.lookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
mvpMatrix.multiply(modelMatrix);
normalMatrix.setInverseOf(modelMatrix);
normalMatrix.transpose();
modelMatrix.setTranslate(3.0, -0.25, 1.8).rotate(rotation *180/ Math.PI, 0, 0, 1).scale(.2, .2, .2);
gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

}




function drawPictureFrames(gl, canvas, u_ModelMatrix, u_MvpMatrix, a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix) {
    var modelMatrix = new Matrix4();
    var mvpMatrix = new Matrix4();    // Model view projection matrix
    var normalMatrix = new Matrix4(); // Transformation matrix for normals
 

  gl.vertexAttrib1f(a_whichtex, -1.0);

    // Combined frame vertices for both walls
    var frameVertices = new Float32Array([
        // Red Wall (right wall)
        1.5,  0.8,  3.0,   // Top-left
        1.5, -0.8,  3.0,   // Bottom-left
        1.5,  0.8,  1.0,   // Top-right
        1.5, -0.8,  1.0,   // Bottom-right

        1.5,  0.6,  2.8,   // Top-left (inner)
        1.5, -0.6,  2.8,   // Bottom-left (inner)
        1.5,  0.6,  1.2,   // Top-right (inner)
        1.5, -0.6,  1.2,   // Bottom-right (inner)

        // Yellow Wall (left wall)
        -1.5,  0.8,  3.0,   // Top-left
        -1.5, -0.8,  3.0,   // Bottom-left
        -1.5,  0.8,  1.0,   // Top-right
        -1.5, -0.8,  1.0,   // Bottom-right

        -1.5,  0.6,  2.8,   // Top-left (inner)
        -1.5, -0.6,  2.8,   // Bottom-left (inner)
        -1.5,  0.6,  1.2,   // Top-right (inner)
        -1.5, -0.6,  1.2    // Bottom-right (inner)
    ]);

    // Common frame colors
    var frameColors = new Float32Array([
        // Red Wall (right wall) - Dark brown
        0.396, 0.263, 0.129,  0.396, 0.263, 0.129,  0.396, 0.263, 0.129,  0.396, 0.263, 0.129,
        0.396, 0.263, 0.129,  0.396, 0.263, 0.129,  0.396, 0.263, 0.129,  0.396, 0.263, 0.129,

        // Yellow Wall (left wall) - Dark brown
        0.396, 0.263, 0.129,  0.396, 0.263, 0.129,  0.396, 0.263, 0.129,  0.396, 0.263, 0.129,
        0.396, 0.263, 0.129,  0.396, 0.263, 0.129,  0.396, 0.263, 0.129,  0.396, 0.263, 0.129
    ]);

    // Indices for the frames
    var indices = new Uint8Array([
        // Red Wall (right wall)
        0, 1, 4,  4, 1, 5,   // Top border
        2, 3, 6,  6, 3, 7,   // Bottom border
        0, 4, 2,  2, 4, 6,   // Left border
        1, 5, 3,  3, 5, 7,   // Right border

        // Yellow Wall (left wall)
        8, 9, 12,  12, 9, 13,   // Top border
        10, 11, 14,  14, 11, 15, // Bottom border
        8, 12, 10,  10, 12, 14,  // Left border
        9, 13, 11,  11, 13, 15   // Right border
    ]);

    var frameNormals = new Float32Array([
      // Right Wall (Red Wall)
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
      1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,   1.0, 0.0, 0.0,
  
      // Left Wall (Yellow Wall)
     -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,
     -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0,  -1.0, 0.0, 0.0
  ]);

    
    if(!initArrayBuffer(gl, frameVertices, 3, gl.FLOAT, 'a_Position'))return -1;
    if(!initArrayBuffer(gl, frameColors, 3, gl.FLOAT, 'a_Color')) return -1;
    if (!initArrayBuffer(gl, frameNormals, 3, gl.FLOAT, 'a_Normal')) return -1;

    // Create and bind the index buffer
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);



 





    // Draw the frame for the red wall

    // Set the light color (white)
 gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);
 // Set the light direction (in the world coordinate)
 gl.uniform3f(u_LightPosition, 1.5, 1.0, 1.25);
 // Set the ambient light
 gl.uniform3f(u_AmbientLight, 1.0, 1.0, 1.0);


    modelMatrix.setIdentity();
    mvpMatrix.setPerspective(fov, canvas.width / canvas.height, 0.1, 50);
    mvpMatrix.lookAt(eyeX, eyeY, eyeZ, atX, atY, atZ, upX, upY, upZ);
    mvpMatrix.multiply(modelMatrix);
    normalMatrix.setInverseOf(modelMatrix);
    normalMatrix.transpose();
    modelMatrix.setTranslate(1.5, 0, 1.250) 
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements); 
    gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_BYTE, 0); // First 24 indices for red wall


    modelMatrix.setTranslate(1.5, 0, -1.750); // Reset the model matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);
    gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements)
    
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_BYTE, 0); // First 24 indices for red wall

    modelMatrix.setTranslate(1.5, 0, -4.750); // Reset the model matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_BYTE, 0); // First 24 indices for red wall

    // Draw the frame for the yellow wall
    modelMatrix.setTranslate(-1.5, 0, 1.250) // Reset the model matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_BYTE, 24); // Next 24 indices for yellow wall

    
    modelMatrix.setTranslate(-1.5, 0, -1.750); // Reset the model matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_BYTE, 24); // Next 24 indices for yellow wall
    
    modelMatrix.setTranslate(-1.5, 0, -4.750); // Reset the model matrix
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawElements(gl.TRIANGLES, 24, gl.UNSIGNED_BYTE, 24); // Next 24 indices for yellow wall


  
    textureArt(gl, 1.5, 0, 1.250, "right", 0.0, u_ModelMatrix); // Red wall texture 1
    textureArt(gl, 1.5, 0, -1.750, "right", 1.0, u_ModelMatrix); // Red wall texture 2
    textureArt(gl, 1.5, 0, -4.750, "right", 2.0, u_ModelMatrix); // Red wall texture 3

    textureArt(gl, -1.5, 0, 1.250, "left", 3.0, u_ModelMatrix); // Yellow wall texture 1
    textureArt(gl, -1.5, 0, -1.750, "left", 4.0, u_ModelMatrix); // Yellow wall texture 2
    textureArt(gl, -1.5, 0, -4.750, "left", 5.0, u_ModelMatrix); // Yellow wall texture 3

    // Add back wall texture
    textureArt(gl, 0, 0, 0, "back", 6.0, u_ModelMatrix); // Back wall texture


    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    gl.enableVertexAttribArray(a_Color);
}






function textureArt(gl, tX, tY, tZ, wallType, textureIndex, u_ModelMatrix) {
  var textureVertices;
  var normals;

  gl.vertexAttrib1f(a_whichtex, textureIndex);
  
  if (wallType === 'right') { 
      textureVertices = new Float32Array([
          // Positions            // Texture coordinates
          1.5,  0.6,  2.8,       0.0, 1.0,
          1.5, -0.6,  2.8,       0.0, 0.0,
          1.5,  0.6,  1.2,       1.0, 1.0,
          1.5, -0.6,  1.2,       1.0, 0.0
      ]);
      normals = new Float32Array([
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0,
          1.0, 0.0, 0.0
      ]);
  } else if(wallType === 'left') {
      textureVertices = new Float32Array([
          -1.5,  0.6,  2.8,      0.0, 1.0,
          -1.5, -0.6,  2.8,      0.0, 0.0,
          -1.5,  0.6,  1.2,      1.0, 1.0,
          -1.5, -0.6,  1.2,      1.0, 0.0
      ]);
      normals = new Float32Array([
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0,
          -1.0, 0.0, 0.0
      ]);
  } else if(wallType === 'back') {
      textureVertices = new Float32Array([
          -3.5,  1.5, -4.9,      0.0, 1.0,
          -3.5, -1.5, -4.9,      0.0, 0.0,
           3.5,  1.5, -4.9,      1.0, 1.0,
           3.5, -1.5, -4.9,      1.0, 0.0
      ]);
      normals = new Float32Array([
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0,
          0.0, 0.0, -1.0
      ]);
  }

  var FSIZE = textureVertices.BYTES_PER_ELEMENT;

  // Setup position buffer
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, textureVertices, gl.STATIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 5, 0);
  gl.enableVertexAttribArray(a_Position);

  // Setup texture coordinates
  var a_TexCoord = gl.getAttribLocation(gl.program, 'a_TexCoord');
  gl.vertexAttribPointer(a_TexCoord, 2, gl.FLOAT, false, FSIZE * 5, FSIZE * 3);
  gl.enableVertexAttribArray(a_TexCoord);

  // Setup normal buffer
  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

  var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Normal);

  // Set texture index
  var a_whichtex = gl.getAttribLocation(gl.program, 'a_whichtex');
  gl.vertexAttrib1f(a_whichtex, textureIndex);

  // Set model matrix
  var modelMatrix = new Matrix4();
  modelMatrix.setTranslate(tX, tY, tZ);
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Set normal matrix
  var normalMatrix = new Matrix4();
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();
  var u_NormalMatrix = gl.getUniformLocation(gl.program, 'u_NormalMatrix');
  gl.uniformMatrix4fv(u_NormalMatrix, false, normalMatrix.elements);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
  function initTextures(gl,n, canvas, u_MvpMatrix, u_ModelMatrix) {
    // Create a texture object
    var texture0 = gl.createTexture(); 
    var texture1 = gl.createTexture();
    var texture2 = gl.createTexture(); 
    var texture3 = gl.createTexture();
    var texture4 = gl.createTexture(); 
    var texture5 = gl.createTexture();
    var texture6 = gl.createTexture();

    if (!texture0 || !texture1 || !texture2 || !texture3 || !texture4 || !texture5 || !texture6) {
      console.log('Failed to create the texture object');
      return false;
    }
  
    // Get the storage location of u_Sampler0 and u_Sampler1
    var u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
    var u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
    var u_Sampler2 = gl.getUniformLocation(gl.program, 'u_Sampler2');
    var u_Sampler3 = gl.getUniformLocation(gl.program, 'u_Sampler3');
    var u_Sampler4 = gl.getUniformLocation(gl.program, 'u_Sampler4');
    var u_Sampler5 = gl.getUniformLocation(gl.program, 'u_Sampler5');
    var u_Sampler6 = gl.getUniformLocation(gl.program, 'u_Sampler6');
    if (!u_Sampler0 || !u_Sampler1 || !u_Sampler2 || !u_Sampler3 || !u_Sampler4 || !u_Sampler5 || !u_Sampler6) {
      console.log('Failed to get the storage location of u_Sampler');
      return false;
    }
  
    // Create the image object
    var image0 = new Image();
    var image1 = new Image();
    var image2 = new Image();
    var image3 = new Image();
    var image4 = new Image();
    var image5 = new Image();
    var image6 = new Image();
    if (!image0 || !image1 || !image2 || !image3 || !image4 || !image5 ||  !image6) {
      console.log('Failed to create the image object');
      return false;
    }
    
    image0.onload = function(){ 
      loadTexture(gl, n, texture0, u_Sampler0, image0, 0);
     // drawGallery(gl, canvas, u_MvpMatrix, u_ModelMatrix);
      texturesLoaded++;
     };
    image1.onload = function(){ 
      loadTexture(gl, n, texture1, u_Sampler1, image1, 1); 
      //drawGallery(gl, canvas, u_MvpMatrix, u_ModelMatrix);
      texturesLoaded++;
    };  
    image2.onload = function(){ 
      loadTexture(gl, n, texture2, u_Sampler2, image2, 2);
     // drawGallery(gl, canvas, u_MvpMatrix, u_ModelMatrix);
      texturesLoaded++;
    };  
    image3.onload = function(){ 
      loadTexture(gl, n, texture3, u_Sampler3, image3, 3); 
      //drawGallery(gl, canvas, u_MvpMatrix, u_ModelMatrix);
      texturesLoaded++;
    };  
    image4.onload = function(){ 
      loadTexture(gl, n, texture4, u_Sampler4, image4, 4); 
     // drawGallery(gl, canvas, u_MvpMatrix, u_ModelMatrix);
      texturesLoaded++;
    };  
    image5.onload = function(){ 
      loadTexture(gl, n, texture5, u_Sampler5, image5, 5); 
     // drawGallery(gl, canvas, u_MvpMatrix, u_ModelMatrix);
      texturesLoaded++;
    };
      image6.onload = function(){ 
      loadTexture(gl, n, texture6, u_Sampler6, image6, 6); 
      drawGallery(gl, canvas, u_MvpMatrix, u_ModelMatrix);
      texturesLoaded++;
    };
    // Tell the browser to load an Image
    image0.src = '../resources/Garffti.jpg';
    image1.src = '../resources/MonaLisa.jpg';
    image2.src = '../resources/Picasso.jpg';
    image3.src = '../resources/Masjid.jpg';
    image4.src = '../resources/NorthernLightsMagic.jpg';
    image5.src = '../resources/CanadianArt.jpg';
    image6.src = '../resources/CSArt.jpg';
  
    return true;
  }


  var g_texUnit0 = false, g_texUnit1 = false, g_texUnit2 = false, 
  g_texUnit3 = false, g_texUnit4 = false, g_texUnit5 = false, g_texUnit6 = false;
  function loadTexture(gl, n, texture, u_Sampler, image, texUnit) {
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    
    if (texUnit == 0) {
        gl.activeTexture(gl.TEXTURE0);
        g_texUnit0 = true;
    } else if(texUnit == 1) {
        gl.activeTexture(gl.TEXTURE1);
        g_texUnit1 = true;
    } else if(texUnit == 2) {
        gl.activeTexture(gl.TEXTURE2);
        g_texUnit2 = true;
    } else if(texUnit == 3) {
        gl.activeTexture(gl.TEXTURE3);
        g_texUnit3 = true;
    } else if(texUnit == 4) {
        gl.activeTexture(gl.TEXTURE4);
        g_texUnit4 = true;
    } else if(texUnit == 5) {
        gl.activeTexture(gl.TEXTURE5);
        g_texUnit5 = true;
    } else {
        gl.activeTexture(gl.TEXTURE6);
        g_texUnit6 = true;      
    }

    gl.bindTexture(gl.TEXTURE_2D, texture);   

    // Set texture parameters for non-power-of-two textures
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.uniform1i(u_Sampler, texUnit);
    
}

function initArrayBuffer(gl, data, num, type, attribute) {
  var buffer = gl.createBuffer();   // Create a buffer object
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, num, type, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}


function animate (gl, canvas, u_MvpMatrix,u_ModelMatrix,a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix){

  var currentTime = Date.now(); 
  var newTime = currentTime - time; 
  time = currentTime; 

  rotation+= (newTime * .0002); 

  drawGallery(gl, canvas, u_MvpMatrix, u_ModelMatrix,a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix);
  requestAnimationFrame(() => animate(gl, canvas, u_MvpMatrix,u_ModelMatrix,a_whichtex, u_AmbientLight, u_LightColor, u_LightPosition, u_NormalMatrix));
}






