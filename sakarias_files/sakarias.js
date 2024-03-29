/////////////////////////////////////////////////////////////////
//    Sýnidæmi í Tölvugrafík
//     Búum til bókstafinn H úr þremur teningum
//
//    Hjálmtýr Hafsteinsson, september 2023
/////////////////////////////////////////////////////////////////
var canvas;
var gl;

var numVertices  = 36;

var points = [];
var colors = [];

var movement = false;     // Do we rotate?
var spinX = 0;
var spinY = 0;
var origX;
var origY;

var BLACK = vec4(0.0, 0.0, 0.0, 1.0);
var GRAY = vec4(0.18, 0.18, 0.18, 1.0);


var matrixLoc;
var colorLoc;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    colorCube1();

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );


    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    matrixLoc = gl.getUniformLocation( program, "rotation" );

    colorLoc = gl.getUniformLocation( program, "fColor" );

    //event listeners for mouse
    canvas.addEventListener("mousedown", function(e){
        movement = true;
        origX = e.offsetX;
        origY = e.offsetY;
        e.preventDefault();         // Disable drag and drop
    } );

    canvas.addEventListener("mouseup", function(e){
        movement = false;
    } );

    canvas.addEventListener("mousemove", function(e){
        if(movement) {
    	    spinY = ( spinY + (origX - e.offsetX) ) % 360;
            spinX = ( spinX + (origY - e.offsetY) ) % 360;
            origX = e.offsetX;
            origY = e.offsetY;
        }
    } );
    
    render();
}

function colorCube1()
{
    quad( 1, 0, 3, 2, 0 );
    quad( 2, 3, 7, 6, 0 );
    quad( 3, 0, 4, 7, 0 );
    quad( 6, 5, 1, 2, 0 );
    quad( 4, 5, 6, 7, 0 );
    quad( 5, 4, 0, 1, 0 );
}

function colorCube()
{
    quad( 1, 0, 3, 2, 1 );
    quad( 2, 3, 7, 6, 1 );
    quad( 3, 0, 4, 7, 1 );
    quad( 6, 5, 1, 2, 1 );
    quad( 4, 5, 6, 7, 1 );
    quad( 5, 4, 0, 1, 1 );
}

function quad(a, b, c, d, e) 
{
    var vertices = [
        vec3( -0.5, -0.5,  0.5 ),
        vec3( -0.5,  0.5,  0.5 ),
        vec3(  0.5,  0.5,  0.5 ),
        vec3(  0.5, -0.5,  0.5 ),
        vec3( -0.5, -0.5, -0.5 ),
        vec3( -0.5,  0.5, -0.5 ),
        vec3(  0.5,  0.5, -0.5 ),
        vec3(  0.5, -0.5, -0.5 )
    ];

    var vertexColors = [
        [ 0.15, 0.15, 0.15, 1.0 ],  // black
        [ 0.3, 0.3, 0.3, 1.0 ]   // white
    ];

    //vertex color assigned by the index of the vertex
    var indices = [ a, b, c, a, c, d ];

    for ( var i = 0; i < indices.length; ++i ) {
        points.push( vertices[indices[i]] );
        colors.push(vertexColors[e]);
        
    }
}


function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var mv = mat4();
    mv = mult( mv, rotateX(spinX) );
    mv = mult( mv, rotateY(spinY) ) ;

    

    // Build the letter H...
    // First the right leg
    gl.uniform4fv( colorLoc, BLACK );
    mv1 = mult( mv, translate( -0.3, 0.0, 0.3 ) );
    mv1 = mult( mv1, scalem( 0.07, 0.55, 0.07 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );


    mv1 = mult( mv, translate( -0.3, 0.0, -0.3 ) );
    mv1 = mult( mv1, scalem( 0.07, 0.55, 0.07 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    mv1 = mult( mv, translate( 0.3, 0.0, 0.3 ) );
    mv1 = mult( mv1, scalem( 0.07, 0.55, 0.07 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    mv1 = mult( mv, translate( 0.3, 0.0, -0.3 ) );
    mv1 = mult( mv1, scalem( 0.07, 0.55, 0.07 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    // Finally the middle bar (no translation necessary)
    gl.uniform4fv( colorLoc, GRAY );
    mv1 = mult( mv, translate( 0, 0.25, 0) );
    mv1 = mult( mv1, scalem( 0.671, 0.15, 0.671 ) );
    gl.uniformMatrix4fv(matrixLoc, false, flatten(mv1));
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    requestAnimFrame( render );
}

