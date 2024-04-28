
"use strict"; 
const CUB3={ 
  
  GLOBALS:{ //proc CUB3.GLOBALS  
    version:'v1.6 by Sebastian (https://codepen.io/arcsin/pen/agodOW)',
    isFullScreen:false,
    gridMatrix:[], //multidimensional grid
    autoRotateX:0,     
    autoRotateY:0,     
    autoRotateZ:0,     
    gridSize:11, //how many pixels we use for our udg editor
    autoRotateStep:0.01,
    Z:0,
    editorEnabledCanvasSize:screen.width/3,
    localStorageSupported:false,
    
    lastTime:window.performance.now(), //used to limit framerate
    fps:30,                            //orginal value: 1000 - number of frames rendered per second, the higher the number the greater the cpu usage
    fpsInterval:null,                  //used to limit framerate
    UI:{  //proc CUB3.GLOBALS.UI                    
      //model mouse drag
      drag:false,
      old_x:null,
      old_y:null,
      dX:null,
      dY:null,
      dZ:null,
      mouseStop:null,
      mb:null, //mousebutton
      
      mousedown:null,                  //ui flags, udg editor  
      togglePaint:false,
    }
  },  
  
  
  init:function(){ //proc CUB3.init
    const C3=CUB3;
    let undefined;
    C3.UNDEFINED=undefined;           //set undef
    C3.GRID.init();                   //init 2d grid
    C3.KEYBOARD.init();               //init keyboard detection routines
    C3.WEBGL.initGL();                //init webgl

    C3.GLOBALS.fpsInterval=1000/C3.GLOBALS.fps; //set frame rate
    
    let vv=document.getElementsByClassName('__version');
    for (let z=0,zEnd=vv.length;z<zEnd;z++){
      vv[z].innerHTML=CUB3.GLOBALS.version;
    }

    document.body.ondragstart=function(){
      return false;
    }

    try{
      window.localStorage.getItem(CUB3.HISTORY.GLOBALS.storageID);
      C3.GLOBALS.localStorageSupported=true;
    }catch(er){
      C3.GLOBALS.localStorageSupported=false;
    }  
    
    if (C3.GLOBALS.localStorageSupported)
      CUB3.HISTORY.initStorage();
    
    //copy default camera settings
    let cameraType=C3.WEBGL.WORLD.GLOBALS.cameraTypes[0];
    let defaultCameraSettings=C3.WEBGL.WORLD.GLOBALS.cameras[cameraType][0];    
    C3.WEBGL.WORLD.GLOBALS.defaultCamera={
      x:defaultCameraSettings.x,
      y:defaultCameraSettings.y,
      z:defaultCameraSettings.z,
      pitch:defaultCameraSettings.pitch,
      yaw:defaultCameraSettings.yaw,
      roll:defaultCameraSettings.roll,
      far:defaultCameraSettings.far,
      size:defaultCameraSettings.size
    };
    
    //buttons
    document.getElementById('bzp').onclick=function(){
      CUB3.GRID.sliceUp();      
    };    
    document.getElementById('bzm').onclick=function(){
      CUB3.GRID.sliceDown();      
    };    
    document.getElementById('brx').onclick=function(){
      console.log(C3.GLOBALS.autoRotateX);
      C3.GLOBALS.autoRotateX=!C3.GLOBALS.autoRotateX;
    };        
    document.getElementById('bry').onclick=function(){
      C3.GLOBALS.autoRotateY=!C3.GLOBALS.autoRotateY;
    };        
    document.getElementById('brz').onclick=function(){
      C3.GLOBALS.autoRotateZ=!C3.GLOBALS.autoRotateZ;
    };        
    document.getElementById('bdefault').onclick=function(){
      //C3.GLOBALS.autoRotateZ=!C3.GLOBALS.autoRotateZ;
      CUB3.WEBGL.WORLD.resetView();
    }; 
    document.getElementById('bclear').onclick=function(){
      //C3.GLOBALS.autoRotateZ=!C3.GLOBALS.autoRotateZ;
      if (confirm('Are you sure?')){
        CUB3.WEBGL.WORLD.clearAll();
      }
    }; 
    document.getElementById('bfs1').onclick=function(){
      C3.UI.fullScreenToggle();  
    }
    document.getElementById('bfs').onclick=function(){
      C3.UI.fullScreenToggle();  
    }
    
    //save,load
    let bs=document.getElementById('bsave');    
    bs.onclick=function(){
      C3.UTILS.saveToFile();
    };
    let fileReader=new FileReader();
    document.getElementById('fileupload').onchange=function(){
      if (this.files[0]!==C3.UNDEFINED)
        fileReader.readAsText(this.files[0]);
    };
    fileReader.onload=function(e){
      //console.log(e.target.result);
      C3.GRID.load(e.target.result);
    };
    


    //user color handling init
    let cc=document.getElementById('current_color');
    cc.onblur=function(){
      let d=document.getElementById('colorcell'+C3.WEBGL.WORLD.COLORS.GLOBALS.paletteIdx);
      let ic=d.getAttribute('data-invalid-color');
      if (ic==='1'){
        let paletteIdx=C3.WEBGL.WORLD.COLORS.GLOBALS.paletteIdx;
        this.value=C3.WEBGL.WORLD.COLORS.GLOBALS.palette[paletteIdx];
      }
    }
    cc.onkeyup=function(){
      let t=document.createElement('div');
      t.style.backgroundColor=CUB3.WEBGL.WORLD.COLORS.parseColor(this.value);      

      if (t.style.backgroundColor!==''){
        //console.log(t.style.backgroundColor,CUB3.WEBGL.WORLD.COLORS.parseColor(this.value));
        let paletteIdx=C3.WEBGL.WORLD.COLORS.GLOBALS.paletteIdx;
        let d=document.getElementById('colorcell'+C3.WEBGL.WORLD.COLORS.GLOBALS.paletteIdx);
        d.style.backgroundColor=t.style.backgroundColor;
        d.setAttribute('data-user-defined-color',this.value);
        C3.WEBGL.WORLD.COLORS.GLOBALS.palette[paletteIdx]=this.value;
        d.removeAttribute('data-invalid-color');
      }else{
        let d=document.getElementById('colorcell'+C3.WEBGL.WORLD.COLORS.GLOBALS.paletteIdx);
        d.setAttribute('data-invalid-color',1);
      }              
      //console.log(t.style.backgroundColor);
    }
    //user color handling init


    window.onresize=function(e,s){ //proc window.onresize {violet indent_1}
      if (C3.GLOBALS.isFullScreen===true){
        //console.log('resize',document.documentElement.clientWidth);
        //canvas resizing

        let w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            docWidth  = w.innerWidth || e.clientWidth || g.clientWidth,
            docHeight = w.innerHeight|| e.clientHeight|| g.clientHeight;
        
        //let docWidth=document.documentElement.clientWidth;
        //let docHeight=document.documentElement.clientHeight;
        CUB3.GLOBALS.editorEnabledCanvasSize=screen.width/3;
        //console.log(CUB3.GLOBALS.editorEnabledCanvasSize);
        if (s==='forced'){
          docWidth=CUB3.GLOBALS.editorEnabledCanvasSize;
          docHeight=CUB3.GLOBALS.editorEnabledCanvasSize;
        }  
        
        let canvasDom=document.getElementById('c');
        canvasDom.width=docWidth;
        canvasDom.setAttribute('width',docWidth);
        canvasDom.style.width=docWidth+'px';
        canvasDom.height=docHeight;
        canvasDom.style.height=docHeight+'px';
        canvasDom.setAttribute('height',docHeight);

        //resize webgl render window
        const gl=C3.WEBGL.GLOBALS.ctx;   //lookup var
        gl.viewportWidth=docWidth;
        gl.viewportHeight=docHeight;
        CUB3.WEBGL.WORLD.GLOBALS.isViewportDirty=1;
      }  
    };
    
    window.ondblclick=function(e){ //proc window.onmousedown {violet indent_1}
      if (e.target.tagName==='CANVAS'){
        CUB3.WEBGL.WORLD.resetView();
      }
    }  
    
    window.onmousedown=function(e){ //proc window.onmousedown {violet indent_1}
      if (e.target.tagName==='CANVAS'){
        C3.GLOBALS.UI.drag  =true;
        C3.GLOBALS.UI.old_x =e.pageX;
        C3.GLOBALS.UI.old_y =e.pageY;
        C3.GLOBALS.UI.mb=e.which;
        C3.GLOBALS.UI.dX = 0;
        C3.GLOBALS.UI.dY = 0;

        //not needed -> also, if enabled, it does not allow to trap keyboard events while running on fullscreen mode inside codepen
        //e.preventDefault();
        //return false;
      }
    }

    window.onmouseup=function(e){  //proc window.onmouseup {violet indent_1}
      C3.GLOBALS.UI.drag=false;
      C3.GLOBALS.UI.mb=null;
    }

    
    window.onmousemove=function(e){ //proc window.onmousemove {violet indent_1}      

      if (C3.GLOBALS.UI.mb!==null){
        C3.GLOBALS.UI.drag=true;
      }
    
      if (C3.GLOBALS.UI.drag){
        let canvasDom=document.getElementById('c');
        //console.log(canvasDom.clientWidth,canvasDom.clientHeight);
      
        let multX=8*canvasDom.clientWidth/1980;
        let multY=6*canvasDom.clientHeight/1057;
        
        C3.GLOBALS.UI.dX = (e.pageX - C3.GLOBALS.UI.old_x) * multX * Math.PI / canvasDom.clientWidth;
        C3.GLOBALS.UI.dY = (e.pageY - C3.GLOBALS.UI.old_y) * multY * Math.PI / canvasDom.clientHeight;
        C3.GLOBALS.UI.old_x  =e.pageX;
        C3.GLOBALS.UI.old_y  =e.pageY;
        
        //add a 'mousemove -> mousemovestop' event
        if (C3.GLOBALS.UI.mouseStop) clearTimeout(C3.GLOBALS.UI.mouseStop); 
        C3.GLOBALS.UI.mouseStop = setTimeout(function(){
          //console.log('mouse stopped');
          C3.GLOBALS.UI.drag=false;
        },100);         
        
        e.preventDefault();    
      }    
    };    

    window.onwheel=function(e){ //proc window.onwheel {violet indent_1}  
      if (e.target.tagName==='CANVAS'){
        //console.log('muse');
        let cameraInc=event.deltaY * 0.01; //use -0.01 to invert mousewheel zoom logic
        C3.GLOBALS.UI.dZ=cameraInc;
      }
    }
    
    
    C3.gameLoop(window.performance.now())       //loop forever
  },
  
  gameLoop:function(now){ //proc CUB3.gameLoop
    const C3=CUB3;
    C3.WEBGL.WORLD.draw(now); //draw scene   
    
    //NOTE: KEYBOARD {byellow}
    
    //detect keys pressed on the keyboard
    let cameraInc=0.1;
    let pitchYawInc=1;
    let currentCamera=C3.WEBGL.WORLD.GLOBALS.cameras[C3.WEBGL.WORLD.GLOBALS.cameraTypes[C3.WEBGL.WORLD.GLOBALS.cameraTypesIdx]][C3.WEBGL.WORLD.GLOBALS.camerasIdx];
    let currentCameraType=C3.WEBGL.WORLD.GLOBALS.cameraTypes[C3.WEBGL.WORLD.GLOBALS.cameraTypesIdx];

    if (C3.KEYBOARD.GLOBALS.keysUp[107]){ //+
      C3.KEYBOARD.GLOBALS.keysUp[107]=0;
      CUB3.GRID.sliceUp();      
    }
    if (C3.KEYBOARD.GLOBALS.keysUp[109]){ //A
      C3.KEYBOARD.GLOBALS.keysUp[109]=0;
      CUB3.GRID.sliceDown();      
    }

    if (C3.KEYBOARD.GLOBALS.keys[38]){ //cursor UP
      if (currentCameraType==='perspective')
        currentCamera.z-=cameraInc;            
      else
        currentCamera.y-=cameraInc;            
      C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty=1;
    }
    if (C3.KEYBOARD.GLOBALS.keys[40]){ //cursor DOWN
      if (currentCameraType==='perspective')
        currentCamera.z+=cameraInc;      
      else
        currentCamera.y+=cameraInc;      
      C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty=1;  
    }
    if (C3.KEYBOARD.GLOBALS.keys[37]){ //cursor LEFT
      currentCamera.x-=cameraInc;
      C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty=1;      
    }
    if (C3.KEYBOARD.GLOBALS.keys[39]){ //cursor RIGHT
      currentCamera.x+=cameraInc;
      C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty=1;
    }
    if (C3.KEYBOARD.GLOBALS.keys[33]){ //page UP
      if (currentCameraType==='perspective')
        currentCamera.y-=cameraInc;
      else
        currentCamera.size-=cameraInc;
      C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty=1;  
    }
    if (C3.KEYBOARD.GLOBALS.keys[34]){ //page DOWN
      if (currentCameraType==='perspective')
        currentCamera.y+=cameraInc;
      else
        currentCamera.size+=cameraInc;
      C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty=1;  
    }
    if (C3.KEYBOARD.GLOBALS.keys[36]){ //line init
      currentCamera.pitch+=pitchYawInc;
      currentCamera.pitch=currentCamera.pitch%360;
    }
    if (C3.KEYBOARD.GLOBALS.keys[35]){ //line end
      currentCamera.pitch-=pitchYawInc;
      currentCamera.pitch=currentCamera.pitch%360;
    }
    if (C3.KEYBOARD.GLOBALS.keys[45]){ //ins
      currentCamera.yaw+=pitchYawInc;
      currentCamera.yaw=currentCamera.yaw%360;
    }
    if (C3.KEYBOARD.GLOBALS.keys[46]){ //canc
      currentCamera.yaw-=pitchYawInc;
      currentCamera.yaw=currentCamera.yaw%360;
    }
    /*
    if (C3.KEYBOARD.GLOBALS.keysUp[19]){ // pause/break -> change camera type
      C3.KEYBOARD.GLOBALS.keysUp[19]=0;
      C3.WEBGL.WORLD.GLOBALS.cameraTypesIdx++;
      if (C3.WEBGL.WORLD.GLOBALS.cameraTypesIdx>C3.WEBGL.WORLD.GLOBALS.cameraTypes.length-1)
        C3.WEBGL.WORLD.GLOBALS.cameraTypesIdx=0;
      CUB3.WEBGL.WORLD.GLOBALS.isViewportDirty=1;  
    }
    if (C3.KEYBOARD.GLOBALS.keysUp[145]){ // bloc scorr
      C3.KEYBOARD.GLOBALS.keysUp[145]=0;
      C3.WEBGL.WORLD.GLOBALS.far++;
    }
    */
    
    
    //light debug
    /*
    if (C3.KEYBOARD.GLOBALS.keys[90]){ // Z
      C3.WEBGL.WORLD.GLOBALS.lightPosition[2]-=0.1;
      C3.WEBGL.WORLD.GLOBALS.isLightPositionDirty=1;
    }
    if (C3.KEYBOARD.GLOBALS.keys[88]){ // X
      C3.WEBGL.WORLD.GLOBALS.lightPosition[2]+=0.1;
      C3.WEBGL.WORLD.GLOBALS.isLightPositionDirty=1;
    }
    if (C3.KEYBOARD.GLOBALS.keys[67]){ // C
      C3.WEBGL.WORLD.GLOBALS.lightPosition[0]-=0.1;
      C3.WEBGL.WORLD.GLOBALS.isLightPositionDirty=1;
    }
    if (C3.KEYBOARD.GLOBALS.keys[86]){ // V
      C3.WEBGL.WORLD.GLOBALS.lightPosition[0]+=0.1;
      C3.WEBGL.WORLD.GLOBALS.isLightPositionDirty=1;
    }
    if (C3.KEYBOARD.GLOBALS.keys[66]){ // B
      C3.WEBGL.WORLD.GLOBALS.lightPosition[1]-=0.1;
      C3.WEBGL.WORLD.GLOBALS.isLightPositionDirty=1;
    }
    if (C3.KEYBOARD.GLOBALS.keys[78]){ // N
      C3.WEBGL.WORLD.GLOBALS.lightPosition[1]+=0.1;
      C3.WEBGL.WORLD.GLOBALS.isLightPositionDirty=1;
    }
    */
    
    //auto rotate debug
    /*
    if (C3.KEYBOARD.GLOBALS.keysUp[49]){ // 1
      C3.KEYBOARD.GLOBALS.keysUp[49]=0;
      C3.GLOBALS.autoRotateX=!C3.GLOBALS.autoRotateX;
    }    
    if (C3.KEYBOARD.GLOBALS.keysUp[50]){ // 2
      C3.KEYBOARD.GLOBALS.keysUp[50]=0;
      C3.GLOBALS.autoRotateY=!C3.GLOBALS.autoRotateY;
    }    
    if (C3.KEYBOARD.GLOBALS.keysUp[51]){ // 3
      C3.KEYBOARD.GLOBALS.keysUp[51]=0;
      C3.GLOBALS.autoRotateZ=!C3.GLOBALS.autoRotateZ;
    }
    */    
    
    if (C3.KEYBOARD.GLOBALS.keysUp[13]){ // ENTER
      C3.KEYBOARD.GLOBALS.keysUp[13]=0;
      C3.UI.fullScreenToggle();
    }        
    
    
    if (C3.GLOBALS.isFullScreen===false){
      //proc set toolbar info {borange}
      let tData={
        type:C3.WEBGL.WORLD.GLOBALS.cameraTypes[C3.WEBGL.WORLD.GLOBALS.cameraTypesIdx],
        cx:currentCamera.x.toFixed(2),
        cy:currentCamera.y.toFixed(2),
        cz:currentCamera.z.toFixed(2),
        pitch:currentCamera.pitch.toFixed(2),
        yaw:currentCamera.yaw.toFixed(2),
        roll:currentCamera.roll.toFixed(2),
        far:currentCamera.far.toFixed(2),
        size:currentCamera.size.toFixed(2),
        totalCubes:C3.WEBGL.WORLD.GLOBALS.totalCubesCount,
      };
      let lightPosition=C3.WEBGL.WORLD.GLOBALS.lightPosition;    
      let ii=document.getElementById('cameraInfo');
      ii.value=`camera {type:${tData.type},x:${tData.cx},y:${tData.cy},z:${tData.cz},pitch:${tData.pitch},yaw:${tData.yaw},roll:${tData.roll},far:${tData.far},size:${tData.size}}`;
      let tbi=document.getElementById('toolbarinfo');
      tbi.innerHTML=`        
        light debug:${lightPosition[0]},${lightPosition[1]},${lightPosition[2]} | 
        Current edited slice:${C3.GLOBALS.Z} 
        Model rotation: x:${(C3.WEBGL.WORLD.GLOBALS.mrx).toFixed(0)},y:${(C3.WEBGL.WORLD.GLOBALS.mry).toFixed(0)},z:${(C3.WEBGL.WORLD.GLOBALS.mrz).toFixed(0)}
        Total cubes:${tData.totalCubes}        
      `;
    }  
    
    requestAnimationFrame(C3.gameLoop); //loop forever
  },

  //proc <hr> {icon-none}

  KEYBOARD:{ //proc CUB3.KEYBOARD
    
    GLOBALS:{ //proc CUB3.KEYBOARD.GLOBALS
      keys:[],
      keysUp:[]
    },
    
    init:function(){ //proc CUB3.KEYBOARD.init
      const C3=CUB3;      
      //simple key detection
      window.onkeydown=function(e){ 
        console.log('key pressed',e.keyCode);
        C3.KEYBOARD.GLOBALS.keys[e.keyCode]=1;      
      }  
      window.onkeyup=function(e){
        C3.KEYBOARD.GLOBALS.keys[e.keyCode]=0;      
        C3.KEYBOARD.GLOBALS.keysUp[e.keyCode]=1;
      }  
    }
  },

  //proc <hr> {icon-none}

  GLMATRIX:{ //proc CUB3.GLMATRIX
    //http://glmatrix.net/
    //Javascript Matrix and Vector library for High Performance WebGL apps
    //thank you so much guys   

    identity:function(out){ //proc CUB3.GLMATRIX.identity
      out[0] = 1;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = 1;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 1;
      out[11] = 0;
      out[12] = 0;
      out[13] = 0;
      out[14] = 0;
      out[15] = 1;
      return out;
    },
    
    perspective:function(out, fovy, aspect, near, far){ //proc CUB3.GLMATRIX.perspective
      let f = 1.0 / Math.tan(fovy / 2);
      let nf = 1 / (near - far);
      out[0] = f / aspect;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = f;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = (far + near) * nf;
      out[11] = -1;
      out[12] = 0;
      out[13] = 0;
      out[14] = (2 * far * near) * nf;
      out[15] = 0;
      return out;
    }, 

    ortho:function(out, left, right, bottom, top, near, far){ //proc CUB3.GLMATRIX.ortho
      let lr = 1 / (left - right);
      let bt = 1 / (bottom - top);
      let nf = 1 / (near - far);
      out[0] = -2 * lr;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
      out[4] = 0;
      out[5] = -2 * bt;
      out[6] = 0;
      out[7] = 0;
      out[8] = 0;
      out[9] = 0;
      out[10] = 2 * nf;
      out[11] = 0;
      out[12] = (left + right) * lr;
      out[13] = (top + bottom) * bt;
      out[14] = (far + near) * nf;
      out[15] = 1;
      return out;
    },
    
    rotateDeg:function(out, a, deg, axis) { //proc CUB3.GLMATRIX.rotateDeg
      const glMatrix_EPSILON=0.000001;
      let rad=deg*Math.PI/180; //degToRad

      let x = axis[0], y = axis[1], z = axis[2];
      let len = Math.sqrt(x * x + y * y + z * z);
      let s, c, t;
      let a00, a01, a02, a03;
      let a10, a11, a12, a13;
      let a20, a21, a22, a23;
      let b00, b01, b02;
      let b10, b11, b12;
      let b20, b21, b22;

      if (len < glMatrix_EPSILON) { return null; }

      len = 1 / len;
      x *= len;
      y *= len;
      z *= len;

      s = Math.sin(rad);
      c = Math.cos(rad);
      t = 1 - c;

      a00 = a[0]; a01 = a[1]; a02 = a[2]; a03 = a[3];
      a10 = a[4]; a11 = a[5]; a12 = a[6]; a13 = a[7];
      a20 = a[8]; a21 = a[9]; a22 = a[10]; a23 = a[11];

      // Construct the elements of the rotation matrix
      b00 = x * x * t + c; b01 = y * x * t + z * s; b02 = z * x * t - y * s;
      b10 = x * y * t - z * s; b11 = y * y * t + c; b12 = z * y * t + x * s;
      b20 = x * z * t + y * s; b21 = y * z * t - x * s; b22 = z * z * t + c;

      // Perform rotation-specific matrix multiplication
      out[0] = a00 * b00 + a10 * b01 + a20 * b02;
      out[1] = a01 * b00 + a11 * b01 + a21 * b02;
      out[2] = a02 * b00 + a12 * b01 + a22 * b02;
      out[3] = a03 * b00 + a13 * b01 + a23 * b02;
      out[4] = a00 * b10 + a10 * b11 + a20 * b12;
      out[5] = a01 * b10 + a11 * b11 + a21 * b12;
      out[6] = a02 * b10 + a12 * b11 + a22 * b12;
      out[7] = a03 * b10 + a13 * b11 + a23 * b12;
      out[8] = a00 * b20 + a10 * b21 + a20 * b22;
      out[9] = a01 * b20 + a11 * b21 + a21 * b22;
      out[10] = a02 * b20 + a12 * b21 + a22 * b22;
      out[11] = a03 * b20 + a13 * b21 + a23 * b22;

      if (a !== out) { // If the source and destination differ, copy the unchanged last row
        out[12] = a[12];
        out[13] = a[13];
        out[14] = a[14];
        out[15] = a[15];
      }
      return out;
    }     

  },

  //proc <hr> {icon-none}

  WEBGL:{ //proc CUB3.WEBGL

    GLOBALS:{ //proc CUB3.WEBGL.GLOBALS
      ctx:null,       //pointer to webgl context
      glProgram:null, //pointer to gl.createProgram()
      isBufferDataDirty:true,
    },

    initGL:function(){ //proc CUB3.WEBGL.initGL
      const C3=CUB3;
      //set canvas size
      let canvas=document.getElementById('c');
      //canvas.style.border='1px solid black';
      let docWidth =CUB3.GLOBALS.editorEnabledCanvasSize;
      let docHeight=CUB3.GLOBALS.editorEnabledCanvasSize;
      canvas.setAttribute('width' ,docWidth);
      canvas.setAttribute('height',docHeight);

      //get webgl context
      C3.WEBGL.GLOBALS.ctx=canvas.getContext('webgl',{premultipliedAlpha:false});
      if (!C3.WEBGL.GLOBALS.ctx) //no luck? ok, let's try something different....
        C3.WEBGL.GLOBALS.ctx=canvas.getContext('experimental-webgl',{premultipliedAlpha:false});

      const gl=C3.WEBGL.GLOBALS.ctx;   //lookup var
      gl.viewportWidth=canvas.width;   //set viewport size
      gl.viewportHeight=canvas.height;

      // Tell WebGL to test the depth when drawing, so if a square is behind
      // another square it won't be drawn
      gl.enable(gl.DEPTH_TEST);        //Activates depth comparisons and updates to the depth buffer. See https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/depthFunc

      gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);
      gl.enable(gl.BLEND);
      //TODO: need a flag for this
      /*
      gl.disable(gl.DEPTH_TEST);
      */

      //create shaders and program
      let vertexShader=gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vertexShader,document.getElementById('vertex-shader').text);
      gl.compileShader(vertexShader);
      if (!gl.getShaderParameter(vertexShader,gl.COMPILE_STATUS))
        console.error(gl.getShaderInfoLog(vertexShader));        
      
      let fragmentShader=gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fragmentShader,document.getElementById('fragment-shader').text);
      gl.compileShader(fragmentShader);
      if (!gl.getShaderParameter(fragmentShader,gl.COMPILE_STATUS))
        console.error(gl.getShaderInfoLog(fragmentShader));        

      let glProgram=gl.createProgram();
      C3.WEBGL.GLOBALS.glProgam=glProgram;
      gl.attachShader(glProgram,vertexShader);
      gl.attachShader(glProgram,fragmentShader);
      gl.linkProgram(glProgram);
      gl.useProgram(glProgram);

      //init our rendering struct       
      glProgram.data={
        aVertexPosition             :{size:3,len:0,location:gl.getAttribLocation(glProgram,'aVertexPosition')},
        aVertexNormal               :{size:3,location:gl.getAttribLocation(glProgram,'aVertexNormal')},
        aEntityTranslation          :{size:3,location:gl.getAttribLocation(glProgram,'aEntityTranslation')},
        aEntityColor                :{size:4,location:gl.getAttribLocation(glProgram,'aEntityColor')},
        uPMatrix                    :{location:gl.getUniformLocation(glProgram,'uPMatrix')},
        uMVMatrix                   :{location:gl.getUniformLocation(glProgram,'uMVMatrix')},
        uXRMatrix                   :{location:gl.getUniformLocation(glProgram,'uXRMatrix')},
        uYRMatrix                   :{location:gl.getUniformLocation(glProgram,'uYRMatrix')},
        uZRMatrix                   :{location:gl.getUniformLocation(glProgram,'uZRMatrix')},
        uLightPosition              :{location:gl.getUniformLocation(glProgram,'uLightPosition')},
        uROffset                    :{location:gl.getUniformLocation(glProgram,'uROffset')},
        uCameraTranslation          :{location:gl.getUniformLocation(glProgram,'uCameraTranslation')},
        verticesInterleavedBuffer   :[], //pointer to our interleaved buffer, used to paint the whole scene
        cubesMapping                :{ //object used to index all scene cubes by id,x,y,z 
          id:{},
          position:{}
        }, 
        interleavedStruct           :{
          analyzed:0,                //flag used to auto-calc stride and other stuff
          buffer:gl.createBuffer(),  //gl buffer for our interleaved vertex data
          data:[],                   //gl buffer data 
          stride:null,               //A GLsizei specifying the offset in bytes between the beginning of consecutive vertex attributes. Cannot be larger than 255. If stride is 0, the attribute is assumed to be tightly packed, that is, the attributes are not interleaved but each attribute is in a separate block, and the next vertex' attribute follows immediately after the current vertex. https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/vertexAttribPointer
          strideElements:null,       //used for deletion of cubes 
        },
        enable:function(){ //auto-enable 'a' properties
          for (let z in this){
            if (typeof this[z].location!=='undefined' && (z.indexOf('a')===0)){
              //console.log(z,this[z].location);
              gl.enableVertexAttribArray(this[z].location);
            }  
          }
        }         
      }
      glProgram.data.enable();      
      
    },

    //proc <hr> {icon-none}
    
    WORLD:{ //proc CUB3.WEBGL.WORLD
      
      GLOBALS:{ //proc CUB3.WEBGL.WORLD.GLOBALS
        isViewportDirty:1,
        isCameraPositionDirty:1,
        isLightPositionDirty:1,
        isLocalRotationOffsetDirty:1,
        isModelLocalRotationDirty:1,
        
        mrx:0.0,
        mry:0.0,
        mrz:0.0,
        
        lPitch:null,
        lYaw:null,
        lRoll:null,
        
        totalCubes:0,   //total number of scene cubes (used to know how many triangles we must render)
  
        //list of x,y,z coordinates defining a camera point        
        defaultCamera:{},
        cameras:{ //proc CUB3.WEBGL.WORLD.GLOBALS.cameras
          perspective:[
            //{x:4,y:5,z:8,pitch:0,yaw:0,far:200.0,size:0} //8x8 grid
            //{x:6,y:7,z:11,pitch:0,yaw:0,far:200.0,size:0} //12x12 grid            
            //{x:4.50,y:4.50,z:10,pitch:0,yaw:0,roll:0,far:200.0,size:0} //9x9 grid
              {x:0,y:0,z:21.90,pitch:0,yaw:0,roll:0,far:200.00,size:0.00}            
          ],
          orthogonal:[
            {x:4,y:8.50,z:8,pitch:-25,yaw:0,roll:0,size:4,far:500.0},    //oddball
          ]          
        },
        camerasIdx:0, //index to current camera
        cameraTypes:['perspective','orthogonal'],
        cameraTypesIdx:0,
        
        pMatrix:new Float32Array([ //Init the projection matrix to the identity matrix
          1,0,0,0,
          0,1,0,0,
          0,0,1,0,
          0,0,0,1
        ]),

        lightPosition:[0.0,-15.0,-22.0], //allow light position debugging
        
        //model rotations are handled indipendently
        xRMatrix:new Float32Array([ //Init the model rotation matrix to the identity matrix - x axis
          1,0,0,0,
          0,1,0,0,
          0,0,1,0,
          0,0,0,1
        ]),
        //---
        yRMatrix:new Float32Array([ //Init the model rotation matrix to the identity matrix - y axis
          1,0,0,0,
          0,1,0,0,
          0,0,1,0,
          0,0,0,1
        ]),
        //---
        zRMatrix:new Float32Array([ //Init the model rotation matrix to the identity matrix - z axis
          1,0,0,0,
          0,1,0,0,
          0,0,1,0,
          0,0,0,1
        ]),
        //---
        rOffset:[0,0,0],            //model rotation initial offset

        mvMatrix:new Float32Array([ //Init the model view matrix to the identity matrix
          1,0,0,0,
          0,1,0,0,
          0,0,1,0,
          0,0,0,1
        ]),
      },
      
      clearAll:function(){ //proc CUB3.WEBGL.WORLD.clearAll
        const C3=CUB3;
        C3.GRID.reset();
        C3.GLOBALS.gridMatrix=[];
        const glProgram=C3.WEBGL.GLOBALS.glProgam;//lookup var
        C3.WEBGL.WORLD.GLOBALS.totalCubes=0;
        C3.WEBGL.WORLD.GLOBALS.totalCubesCount=0;
        //console.log('>>>>',C3.WEBGL.WORLD.GLOBALS.totalCubes);
        glProgram.data.aVertexPosition.len=0;
        glProgram.data.verticesInterleavedBuffer=[];
        glProgram.data.interleavedStruct.data=new Float32Array(glProgram.data.verticesInterleavedBuffer);
        glProgram.data.cubesMapping={ //object used to index all scene cubes by id,x,y,z 
          id:{},
          position:{}
        };
        glProgram.data.interleavedStruct.analyzed=0;
        CUB3.WEBGL.WORLD.resetView();
        CUB3.WEBGL.WORLD.GLOBALS.isViewportDirty=1;
        C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty=1;
        let gl=C3.WEBGL.GLOBALS.ctx;   //lookup var
        gl.clear(gl.COLOR_BUFFER_BIT);
        C3.GLOBALS.Z=0;
        if (C3.GLOBALS.localStorageSupported)
          window.localStorage.removeItem(CUB3.HISTORY.GLOBALS.storageID);
      },
      
      resetView:function(){ //proc CUB3.WEBGL.WORLD.resetView 
        const C3=CUB3;
        //reset model rotation
        C3.WEBGL.WORLD.GLOBALS.isModelLocalRotationDirty=1;
        C3.WEBGL.WORLD.GLOBALS.mrx=0;
        C3.WEBGL.WORLD.GLOBALS.mry=0;
        C3.WEBGL.WORLD.GLOBALS.mrz=0;
        C3.GLOBALS.UI.dX=0;
        C3.GLOBALS.UI.dy=0;
        C3.GLOBALS.autoRotateX=0;
        C3.GLOBALS.autoRotateY=0;
        C3.GLOBALS.autoRotateZ=0;
        C3.GLMATRIX.identity(C3.WEBGL.WORLD.GLOBALS.xRMatrix);
        C3.GLMATRIX.identity(C3.WEBGL.WORLD.GLOBALS.yRMatrix);
        C3.GLMATRIX.identity(C3.WEBGL.WORLD.GLOBALS.zRMatrix);
        //reset camera
        let cameraType=C3.WEBGL.WORLD.GLOBALS.cameraTypes[0];
        let camera=C3.WEBGL.WORLD.GLOBALS.cameras[cameraType][0];
        let defaultCamera=C3.WEBGL.WORLD.GLOBALS.defaultCamera;
        camera={
          x:defaultCamera.x,
          y:defaultCamera.y,
          z:defaultCamera.z,
          pitch:defaultCamera.pitch,
          yaw:defaultCamera.yaw,
          roll:defaultCamera.roll,
          far:defaultCamera.far,
          size:defaultCamera.size
        }
        C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty=1;
      },
      
      removeCube:function(cfg){ //proc CUB3.WEBGL.WORLD.removeCube
        //C3.WEBGL.WORLD.GLOBALS.totalCubes--;
        const C3=CUB3;
        const glProgram=C3.WEBGL.GLOBALS.glProgam;//lookup var

        let config={
          x:cfg.x?cfg.x:0,
          y:cfg.y?cfg.y:0,
          z:cfg.z?cfg.z:0
        }
        let cubes=glProgram.data.cubesMapping.position[config.x+','+config.y+','+config.z];
        let verticesInterleavedBuffer=glProgram.data.verticesInterleavedBuffer;

        let deleted=0;
        for (let z in cubes){
          let bufferIndex=cubes[z].bufferIndex;
          //console.log(glProgram.data.interleavedStruct);
          for (let x=0,xEnd=glProgram.data.interleavedStruct.strideElements;x<xEnd;x++){
            //console.log(x+bufferIndex);
            verticesInterleavedBuffer[bufferIndex+x]=0;
          }
          delete(glProgram.data.cubesMapping.id[cubes[z].id]);
          deleted++;
        }
        delete(glProgram.data.cubesMapping.position[config.x+','+config.y+','+config.z]);          
        glProgram.data.interleavedStruct.data=new Float32Array(verticesInterleavedBuffer);

        //FIXME: memory leak (deleted cubes are not 'removed') {indent_1}
        C3.WEBGL.WORLD.GLOBALS.totalCubesCount-=deleted;
        
        CUB3.WEBGL.GLOBALS.isBufferDataDirty=1;
      },
      
      addCube:function(cfg){ //proc CUB3.WEBGL.WORLD.addCube
      
        //console.log('addcube');
      
        let config={
          update:cfg.update?cfg.update:0,
          id:cfg.id?cfg.id:0,
          updateIdx:cfg.updateIdx?cfg.updateIdx:0,
          x:cfg.x?cfg.x:0,
          y:cfg.y?cfg.y:0,
          z:cfg.z?cfg.z:0,
          r:cfg.r?cfg.r:0,
          g:cfg.g?cfg.g:0,
          b:cfg.b?cfg.b:0,
          a:cfg.a?cfg.a:1,
          isBatchCall:cfg.isBatchCall?cfg.isBatchCall:false,
        }
        
        const C3=CUB3;
        const glProgram=C3.WEBGL.GLOBALS.glProgam;//lookup var
        let vertexPositions=[ //cube with 6 faces, each face is quadrilateral composed of two triangles
        
          //back face
          0.0,  1.0,  0.0 , //x,y,z
          0.0,  0.0,  0.0 ,
          1.0,  0.0,  0.0 ,

          0.0,  1.0,  0.0 ,
          1.0,  1.0,  0.0 ,
          1.0,  0.0,  0.0 ,
          
          //bottom face
          0.0,  0.0,  0.0 , //x,y,z
          0.0,  0.0,  1.0 ,
          1.0,  0.0,  0.0 ,

          1.0,  0.0,  0.0 ,
          1.0,  0.0,  1.0 ,
          0.0,  0.0,  1.0 ,

          //top face
          0.0,  1.0,  0.0 , //x,y,z
          0.0,  1.0,  1.0 ,
          1.0,  1.0,  0.0 ,

          1.0,  1.0,  0.0 ,
          1.0,  1.0,  1.0 ,
          0.0,  1.0,  1.0 ,

          //left face
          0.0,  1.0,  0.0 , //x,y,z
          0.0,  1.0,  1.0 ,
          0.0,  0.0,  0.0 ,

          0.0,  1.0,  1.0 ,
          0.0,  0.0,  1.0 ,
          0.0,  0.0,  0.0 ,

          //right face
          1.0,  1.0,  0.0 , //x,y,z
          1.0,  1.0,  1.0 ,
          1.0,  0.0,  0.0 ,

          1.0,  1.0,  1.0 ,
          1.0,  0.0,  1.0 ,
          1.0,  0.0,  0.0 ,
          
          //front face
          0.0,  1.0,  1.0 , //x,y,z
          0.0,  0.0,  1.0 ,
          1.0,  0.0,  1.0 ,

          0.0,  1.0,  1.0 ,
          1.0,  1.0,  1.0 ,
          1.0,  0.0,  1.0 
          
        ];
        
        //https://en.wikipedia.org/wiki/Surface_normal
        let cubeNormals=[
          //back face
          0.0,  0.0,  1.0 , //x,y,z
          0.0,  0.0,  1.0 ,
          0.0,  0.0,  1.0 ,
          0.0,  0.0,  1.0 ,
          0.0,  0.0,  1.0 ,
          0.0,  0.0,  1.0 ,

          //bottom face
          0.0, -1.0,  0.0 , //x,y,z
          0.0, -1.0,  0.0 ,
          0.0, -1.0,  0.0 ,
          0.0, -1.0,  0.0 ,
          0.0, -1.0,  0.0 ,
          0.0, -1.0,  0.0 ,

          //top face
          0.0,  1.0,  0.0 , //x,y,z
          0.0,  1.0,  0.0 ,
          0.0,  1.0,  0.0 ,
          0.0,  1.0,  0.0 ,
          0.0,  1.0,  0.0 ,
          0.0,  1.0,  0.0 ,

          //left face
         -1.0,  0.0,  0.0 , //x,y,z
         -1.0,  0.0,  0.0 ,
         -1.0,  0.0,  0.0 ,
         -1.0,  0.0,  0.0 ,
         -1.0,  0.0,  0.0 ,
         -1.0,  0.0,  0.0 ,

          //right face
          1.0,  0.0,  0.0 , //x,y,z
          1.0,  0.0,  0.0 ,
          1.0,  0.0,  0.0 ,
          1.0,  0.0,  0.0 ,
          1.0,  0.0,  0.0 ,
          1.0,  0.0,  0.0 ,

          //front face
          0.0,  0.0, -1.0 , //x,y,z
          0.0,  0.0, -1.0 ,
          0.0,  0.0, -1.0 ,
          0.0,  0.0, -1.0 ,
          0.0,  0.0, -1.0 ,
          0.0,  0.0, -1.0

        ];
        
        let verticesInterleavedBuffer=glProgram.data.verticesInterleavedBuffer;
        let totalVertices=0;

        let cubeId;
        let bufferIndex;
        if (!config.update){
          cubeId=C3.WEBGL.WORLD.GLOBALS.totalCubes;
          bufferIndex=verticesInterleavedBuffer.length;
        }else{
          cubeId=config.id;
          bufferIndex=config.updateIdx;
        }  
        let cubeData={
          bufferIndex:bufferIndex,
          id:cubeId,
          x:config.x,
          y:config.y,
          z:config.z,
          r:config.r,
          g:config.g,
          b:config.b,
          a:config.a,
        }
        
        glProgram.data.cubesMapping.id[cubeId]=cubeData;
        let positionRef=glProgram.data.cubesMapping.position[config.x+','+config.y+','+config.z];
        if (positionRef===C3.UNDEFINED)
          glProgram.data.cubesMapping.position[config.x+','+config.y+','+config.z]={};
        glProgram.data.cubesMapping.position[config.x+','+config.y+','+config.z][cubeId]=cubeData;
        
        //console.log(glProgram.data.cubesMapping);        
        
        //loop for every vertex (x,y,z) of vertexPositions
        //and set interleaved data        
        let vIdx;
        let rr,gg,bb,aa;
        for (let z=0,zEnd=vertexPositions.length;z<zEnd;z+=3){
          
          //1- vertices
          //store interleaved vertices coordinates
          if (!config.update){
            vIdx=verticesInterleavedBuffer.length;
          }else{
            if (z===0)
              vIdx=config.updateIdx;
            else
              vIdx++;
          }  

          //console.log('adding ',z,vIdx);

          verticesInterleavedBuffer[  vIdx]=vertexPositions[z+0];
          verticesInterleavedBuffer[++vIdx]=vertexPositions[z+1];
          verticesInterleavedBuffer[++vIdx]=vertexPositions[z+2];

          //2- vertices normals
          //save current stride offset
          if (z===0 && !glProgram.data.interleavedStruct.analyzed)
            glProgram.data.aVertexNormal.strideOffset=verticesInterleavedBuffer.length*Float32Array.BYTES_PER_ELEMENT
          //store interleaved normal vector coordinates for each point
          verticesInterleavedBuffer[++vIdx]=cubeNormals[z+0];
          verticesInterleavedBuffer[++vIdx]=cubeNormals[z+1];
          verticesInterleavedBuffer[++vIdx]=cubeNormals[z+2];

          //3- entity translation
          //save current stride offset
          if (z===0 && !glProgram.data.interleavedStruct.analyzed)
            glProgram.data.aEntityTranslation.strideOffset=verticesInterleavedBuffer.length*Float32Array.BYTES_PER_ELEMENT
          //store interleaved entity translation coordinates
          verticesInterleavedBuffer[++vIdx]=config.x;
          verticesInterleavedBuffer[++vIdx]=config.y;
          verticesInterleavedBuffer[++vIdx]=config.z;

          //4- entity color
          //save current stride offset
          if (z===0 && !glProgram.data.interleavedStruct.analyzed)
            glProgram.data.aEntityColor.strideOffset=verticesInterleavedBuffer.length*Float32Array.BYTES_PER_ELEMENT
          //store interleaved entity translation coordinates
          rr=config.r/255;
          gg=config.g/255;
          bb=config.b/255;
          aa=config.a;
          if (aa>1)
            aa=config.a/255;
          //console.log(rr,gg,bb,aa);  
          
          verticesInterleavedBuffer[++vIdx]=rr;
          verticesInterleavedBuffer[++vIdx]=gg;
          verticesInterleavedBuffer[++vIdx]=bb;
          verticesInterleavedBuffer[++vIdx]=aa;
          
          //calc stride stuff
          if (z===0 && !glProgram.data.interleavedStruct.analyzed){
            glProgram.data.interleavedStruct.stride        =verticesInterleavedBuffer.length*Float32Array.BYTES_PER_ELEMENT;
          }
        }

        if (!glProgram.data.interleavedStruct.analyzed){
          glProgram.data.interleavedStruct.strideElements=verticesInterleavedBuffer.length; //for deletion
        }  

        //this is used to know how many triangles we must draw
        if (!config.update){
          C3.WEBGL.WORLD.GLOBALS.totalCubes++;
          C3.WEBGL.WORLD.GLOBALS.totalCubesCount++;
        }  
        //console.log(glProgram.data.aVertexPosition.len);
        glProgram.data.aVertexPosition.len=C3.WEBGL.WORLD.GLOBALS.totalCubes*vertexPositions.length/glProgram.data.aVertexPosition.size;
        //and now store the interleaved data
        //FIXME: we should write glProgram.data.interleavedStruct.data directly instead of allocating a new array at every call {indent_1}
        if (!config.isBatchCall){ //used to speed up loading process
          glProgram.data.interleavedStruct.data=new Float32Array(verticesInterleavedBuffer);
        }  
        glProgram.data.interleavedStruct.analyzed=1; //do not calc stride stuff anymore
        
        CUB3.WEBGL.GLOBALS.isBufferDataDirty=1;
      },
      
      draw:function(now){ //proc CUB3.WEBGL.WORLD.draw {bred}
        const C3=CUB3;
        //check elapsed time and skip frames to save some cpu
        let elapsed=now-C3.GLOBALS.lastTime;
        if (elapsed<C3.GLOBALS.fpsInterval)
          return;        

        if (elapsed>C3.GLOBALS.fpsInterval*2) //do not allow overflow, e.g. if the current browser tab is set to background mode. elapsed will overflow when the tab becomes active again
          elapsed=C3.GLOBALS.fpsInterval;

        C3.GLOBALS.lastTime=now;
        
        //lookup vars
        const gl            =C3.WEBGL.GLOBALS.ctx;
        const glProgram     =C3.WEBGL.GLOBALS.glProgam;
        let   pMatrix       =C3.WEBGL.WORLD.GLOBALS.pMatrix;
        let   mvMatrix      =C3.WEBGL.WORLD.GLOBALS.mvMatrix;
        let   rOffset       =C3.WEBGL.WORLD.GLOBALS.rOffset;
        let   xRMatrix      =C3.WEBGL.WORLD.GLOBALS.xRMatrix;
        let   yRMatrix      =C3.WEBGL.WORLD.GLOBALS.yRMatrix;
        let   zRMatrix      =C3.WEBGL.WORLD.GLOBALS.zRMatrix;
        let   lightPosition =C3.WEBGL.WORLD.GLOBALS.lightPosition;
        const stride        =glProgram.data.interleavedStruct.stride;
        const cameraType    =C3.WEBGL.WORLD.GLOBALS.cameraTypes[C3.WEBGL.WORLD.GLOBALS.cameraTypesIdx];
        const camera        =C3.WEBGL.WORLD.GLOBALS.cameras[cameraType][C3.WEBGL.WORLD.GLOBALS.camerasIdx];

        if (glProgram.data.interleavedStruct.data.length){ //if there's data
        
          gl.clear(gl.COLOR_BUFFER_BIT);
          
          if (C3.WEBGL.WORLD.GLOBALS.isViewportDirty){ //browser window resized
            //console.log('DIRTY');
            //proc do this only if the browser window is resized {indent_1}
            //---------------
            // we need to calculate the perspective
            // only if the viewport is resized
            gl.viewport(0,0,gl.viewportWidth,gl.viewportHeight);
            if (cameraType==='perspective')
              C3.GLMATRIX.perspective(pMatrix,45,gl.viewportWidth/gl.viewportHeight,0.1,camera.far);
            else
              C3.GLMATRIX.ortho(pMatrix,-camera.size,camera.size,-camera.size,camera.size,1.0,camera.far);
            gl.uniformMatrix4fv(glProgram.data.uPMatrix.location,false,pMatrix); //apply global projection matrix
            C3.WEBGL.WORLD.GLOBALS.isViewportDirty=0;
          }

          //zoom force friction (just move the camera)
          if (C3.GLOBALS.UI.dZ!==0){          
            let currentCamera=C3.WEBGL.WORLD.GLOBALS.cameras[C3.WEBGL.WORLD.GLOBALS.cameraTypes[C3.WEBGL.WORLD.GLOBALS.cameraTypesIdx]][C3.WEBGL.WORLD.GLOBALS.camerasIdx];
            let currentCameraType=C3.WEBGL.WORLD.GLOBALS.cameraTypes[C3.WEBGL.WORLD.GLOBALS.cameraTypesIdx];
            if (currentCameraType==='perspective')
              currentCamera.z+=C3.GLOBALS.UI.dZ; //zoom by moving world camera     
            else
              currentCamera.y+=C3.GLOBALS.UI.dZ; //zoom by moving world camera     
            C3.GLOBALS.UI.dZ*=0.7; 

            if (C3.GLOBALS.UI.dZ>0 && C3.GLOBALS.UI.dZ<0.001)
              C3.GLOBALS.UI.dZ=0;
            if (C3.GLOBALS.UI.dZ<0 && C3.GLOBALS.UI.dZ>-0.001)
              C3.GLOBALS.UI.dZ=0;
            C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty=1;
          }    
          
          if (C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty){
            //proc do this only when camera position is dirty  {indent_1}          
            gl.uniform3f(glProgram.data.uCameraTranslation.location,camera.x,camera.y,camera.z); // pass the position of the camera to the vertex shader
            C3.WEBGL.WORLD.GLOBALS.isCameraPositionDirty=0;
          }            

          // if a different rotation is applied than the one we have stored
          // Let's do some nice calculations.
          if (CUB3.WEBGL.WORLD.GLOBALS.lPitch!==camera.pitch || CUB3.WEBGL.WORLD.GLOBALS.lYaw!==camera.yaw || CUB3.WEBGL.WORLD.GLOBALS.lRoll!==camera.roll ){
            //proc do this only if camera rotation is dirty  {indent_1}
            //proc apply global viewMatrix only if a rotation is applied  {indent_1}
            C3.GLMATRIX.identity(mvMatrix);
            
            //console.log(camera.pitch,camera.yaw,camera.yaw);
            if (camera.pitch!==0)
              C3.GLMATRIX.rotateDeg(mvMatrix,mvMatrix,-camera.pitch,[1,0,0]);
  
            if (camera.yaw!==0)
              C3.GLMATRIX.rotateDeg(mvMatrix,mvMatrix,-camera.yaw  ,[0,1,0]);

            if (camera.roll!==0)
              C3.GLMATRIX.rotateDeg(mvMatrix,mvMatrix,-camera.roll ,[0,0,1]);
            
            CUB3.WEBGL.WORLD.GLOBALS.lPitch=camera.pitch;
            CUB3.WEBGL.WORLD.GLOBALS.lRoll =camera.roll;
            CUB3.WEBGL.WORLD.GLOBALS.lYaw  =camera.yaw;
            //apply global viematrix only if a rotation is applied
            gl.uniformMatrix4fv(glProgram.data.uMVMatrix.location,false,mvMatrix);  
          }
          
          //proc do this only if local rotation offset is dirty {indent_1}
          if (C3.WEBGL.WORLD.GLOBALS.isLocalRotationOffsetDirty){
            rOffset[0]=-CUB3.GLOBALS.gridSize/2;//4.5;
            rOffset[1]=-CUB3.GLOBALS.gridSize/2;
            rOffset[2]= CUB3.GLOBALS.gridSize/2;
            gl.uniform3f(glProgram.data.uROffset.location,rOffset[0],rOffset[1],rOffset[2]);                  
            C3.WEBGL.WORLD.GLOBALS.isLocalRotationOffsetDirty=0;
          }  
          
          //drag force x,y friction
          if (!C3.GLOBALS.UI.drag && (C3.GLOBALS.UI.dX!==0 || C3.GLOBALS.UI.dY!==0)) {
            C3.GLOBALS.UI.dX *= 0.9;
            C3.GLOBALS.UI.dY *= 0.8;

            if (C3.GLOBALS.UI.dX>0 && C3.GLOBALS.UI.dX<0.01)
              C3.GLOBALS.UI.dX=0;
            if (C3.GLOBALS.UI.dX<0 && C3.GLOBALS.UI.dX>-0.01)
              C3.GLOBALS.UI.dX=0;
              
            if (C3.GLOBALS.UI.dY>0 && C3.GLOBALS.UI.dY<0.01)
              C3.GLOBALS.UI.dY=0;
            if (C3.GLOBALS.UI.dY<0 && C3.GLOBALS.UI.dY>-0.01)
              C3.GLOBALS.UI.dY=0;
          }
          
          //model local rotation & autorotate
          if (
            C3.GLOBALS.autoRotateX || C3.GLOBALS.autoRotateY || C3.GLOBALS.autoRotateZ ||
            C3.GLOBALS.UI.dX!==0 || C3.GLOBALS.UI.dY!==0 ||
            C3.WEBGL.WORLD.GLOBALS.isModelLocalRotationDirty
          ){
            //proc do this only if local rotation is dirty {indent_1}
            //console.log('rotating');
            let yAxisRotation=elapsed*C3.GLOBALS.UI.dX; //x mouse drag rotates model around the Y axis
            let xAxisRotation=elapsed*C3.GLOBALS.UI.dY; //y mouse drag rotates model around the X axis
            let zAxisRotation=0;
            
            if (C3.GLOBALS.autoRotateY && C3.GLOBALS.UI.mb===null)
              yAxisRotation-=elapsed*C3.GLOBALS.autoRotateStep;
            if (C3.GLOBALS.autoRotateX && C3.GLOBALS.UI.mb===null)
              xAxisRotation+=elapsed*C3.GLOBALS.autoRotateStep;             
            if (C3.GLOBALS.autoRotateZ && C3.GLOBALS.UI.mb===null)
              zAxisRotation-=elapsed*C3.GLOBALS.autoRotateStep; //clockwise             
            
            if (yAxisRotation!==0)
              C3.GLMATRIX.rotateDeg(xRMatrix,xRMatrix,yAxisRotation,[0,1,0]);
            if (xAxisRotation!==0)
              C3.GLMATRIX.rotateDeg(yRMatrix,yRMatrix,xAxisRotation,[1,0,0]);
            if (zAxisRotation!==0)
              C3.GLMATRIX.rotateDeg(zRMatrix,zRMatrix,zAxisRotation,[0,0,1]);
            
            gl.uniformMatrix4fv(glProgram.data.uXRMatrix.location,false,xRMatrix); 
            gl.uniformMatrix4fv(glProgram.data.uYRMatrix.location,false,yRMatrix); 
            gl.uniformMatrix4fv(glProgram.data.uZRMatrix.location,false,zRMatrix); 

            //keep track of cumulative rotations to display values
            C3.WEBGL.WORLD.GLOBALS.mrx+=xAxisRotation;
            C3.WEBGL.WORLD.GLOBALS.mrx=C3.WEBGL.WORLD.GLOBALS.mrx%360;

            C3.WEBGL.WORLD.GLOBALS.mry+=yAxisRotation;
            C3.WEBGL.WORLD.GLOBALS.mry=C3.WEBGL.WORLD.GLOBALS.mry%360;

            C3.WEBGL.WORLD.GLOBALS.mrz+=zAxisRotation;
            C3.WEBGL.WORLD.GLOBALS.mrz=C3.WEBGL.WORLD.GLOBALS.mrz%360;
            
            C3.WEBGL.WORLD.GLOBALS.isModelLocalRotationDirty=0;
          }          

          //light position uniform (for light position testing purposes only)
          if (C3.WEBGL.WORLD.GLOBALS.isLightPositionDirty){
            //console.log('dirty','light');
            gl.uniform3f(glProgram.data.uLightPosition.location,lightPosition[0],lightPosition[1],lightPosition[2]);                  
            C3.WEBGL.WORLD.GLOBALS.isLightPositionDirty=0;
          }  
          
          if (CUB3.WEBGL.GLOBALS.isBufferDataDirty){
            //proc do this only if buffer data is dirty  {indent_1}
            gl.bindBuffer(gl.ARRAY_BUFFER,glProgram.data.interleavedStruct.buffer);

            gl.bufferData(gl.ARRAY_BUFFER,glProgram.data.interleavedStruct.data,gl.DYNAMIC_DRAW);
            
            gl.vertexAttribPointer(glProgram.data.aVertexPosition.location   ,glProgram.data.aVertexPosition.size   ,gl.FLOAT,false,stride,0);
            gl.vertexAttribPointer(glProgram.data.aVertexNormal.location     ,glProgram.data.aVertexNormal.size     ,gl.FLOAT,false,stride,glProgram.data.aVertexNormal.strideOffset);
            gl.vertexAttribPointer(glProgram.data.aEntityTranslation.location,glProgram.data.aEntityTranslation.size,gl.FLOAT,false,stride,glProgram.data.aEntityTranslation.strideOffset);
            gl.vertexAttribPointer(glProgram.data.aEntityColor.location      ,glProgram.data.aEntityColor.size      ,gl.FLOAT,false,stride,glProgram.data.aEntityColor.strideOffset);

            CUB3.WEBGL.GLOBALS.isBufferDataDirty=0;
          }  
          
          //draw all
          gl.drawArrays(gl.TRIANGLES,0,glProgram.data.aVertexPosition.len);
        }
        
        
      },
      
      //proc <hr> {icon-none}      
      
      COLORS:{ //proc CUB3.WEBGL.WORLD.COLORS
        GLOBALS:{ //proc CUB3.WEBGL.WORLD.COLORS.GLOBALS
          palette:[
            '000000','ffffff','a3ce27','f7e26b','a46422','9d9d9d','31a2f2','2779a4','84c7e9',            
           'ce0606','de1b1b',
           'd1d1d1','bcbcbc','9e9e9e','757575','a8a8a8','e2e2e2','3c3c3c','5f5f5f','8c8c8c','c4c4c4','e8e8e8'        
          ], //proc CUB3.WEBGL.WORLD.COLORS.GLOBALS.palette {bgreen}
          paletteIdx:0,
        },
        rgb2Hex:function(r, g, b){ //proc rgb2Hex
          if (typeof r==='string'){
            let r1=r;            
            r1=r1.replace(')','');
            r1=r1.replace('rgb(','');
            r1=r1.replace(/\s+/g,'');
            let rr=r1.split(',');
            r=parseInt(rr[0]);
            g=parseInt(rr[1]);
            b=parseInt(rr[2]);
            if (isNaN(r))
              return null;
            //console.log(r,g,b);
          }
          let hex=((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
          //console.log(hex);
          return hex;
        },        
        hex2GLRgb:function(h){ //proc CUB3.WEBGL.WORLD.COLORS.hex2GLRgb
          let ret;
          h.replace(/(..)(..)(..)/,function(hex,r,g,b){
            return ret={
              r: parseFloat((parseInt(r,16)/255).toFixed(2)),
              g: parseFloat((parseInt(g,16)/255).toFixed(2)),
              b: parseFloat((parseInt(b,16)/255).toFixed(2))
            }  
          });
          return ret;
        },
        color2Rgba:function(sCol){ //proc CUB3.WEBGL.WORLD.COLORS.color2Rgba
          let col=CUB3.WEBGL.WORLD.COLORS.parseColor(sCol);
          let r,g,b,a;
          //console.log('xxxx',col);

          if (typeof col==='string' && col!==''){
            let r1=col;            
            r1=r1.replace(')','');
            r1=r1.replace('rgb(','');
            r1=r1.replace('rgba(','');
            r1=r1.replace(/\s+/g,'');
            let rr=r1.split(',');
            //console.log(rr);
            r=parseInt(rr[0]);
            g=parseInt(rr[1]);
            b=parseInt(rr[2]);
            //console.log('col',r1,r,g,b);          
            if (typeof rr[3]!=='undefined')
              a=parseFloat(rr[3]);
            else  
              a=1;
            /*
            if (a>1){
              a/=255;
              a=a.toFixed(2);
            } 
            */            
            if (isNaN(r))
              return null;
            //console.log(r,g,b);
          } 

          return {r:r,g:g,b:b,a:a}           
          
          //let hex=((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
          //return hex;          
        }, 
        parseColor:function(col){ //proc CUB3.WEBGL.WORLD.COLORS.parseColor
          let t=document.createElement('div');

          t.style.backgroundColor='#'+col;

          if (t.style.backgroundColor==='')
            t.style.backgroundColor=col;        
        
          if (t.style.backgroundColor===''){
            let rgb=col.split(',');
            if (rgb.length===1)
              t.style.backgroundColor=`rgb(${rgb[0]},${rgb[0]},${rgb[0]})`;        
            if (rgb.length===2)
              t.style.backgroundColor=`rgb(${rgb[0]},${rgb[1]},${rgb[1]})`;        
            if (rgb.length===3)
              t.style.backgroundColor=`rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;        
            if (rgb.length===4){
              if (rgb[3]>1)
                rgb[3]/=255;
              t.style.backgroundColor=`rgba(${rgb[0]},${rgb[1]},${rgb[2]},${rgb[3]})`;        
            }  
          }
          if (t.style.backgroundColor==='')
            t.style.backgroundColor='rgb('+col;        

          if (t.style.backgroundColor==='')
            t.style.backgroundColor='rgba('+col;          
          return t.style.backgroundColor;
        },
        hex2Rgb:function(h){ //proc CUB3.WEBGL.WORLD.COLORS.hex2GLRgb
          let ret;
          h.replace(/(..)(..)(..)/,function(hex,r,g,b){
            return ret={
              r: parseFloat((parseInt(r,16)).toFixed(2)),
              g: parseFloat((parseInt(g,16)).toFixed(2)),
              b: parseFloat((parseInt(b,16)).toFixed(2))
            }  
          });
          return ret;
        }
      },
      
    }

  },

  //proc <hr> {icon-none}

  UI:{ //proc CUB3.UI
    goFullScreen:function(){ //proc CUB3.UI.fullScreen
      const C3=CUB3;
      C3.GLOBALS.isFullScreen=true;
      document.getElementById('cub3').className='';
      document.getElementById('t').style.display='none';
      document.getElementById('editor').style.display='none';
      document.body.className='_isfullscreen';
      window.onresize();
    },
    fullScreenToggle(){ //proc CUB3.UI.fullScreenToggle
      document.getElementById('cub3').className='';
      const C3=CUB3;
      if (C3.GLOBALS.isFullScreen===true){
        document.getElementById('t').style.display='block';
        document.getElementById('editor').style.display='flex';
        document.body.className='';
        window.onresize(null,'forced');
        C3.GLOBALS.isFullScreen=false;
      }else{
        C3.UI.goFullScreen();        
      }
    }
  },

  //proc <hr> {icon-none}

  HISTORY:{ //proc CUB3.HISTORY

    GLOBALS:{ //proc CUB3.HISTORY.GLOBALS
      storageID:'CUB3_data',
      storage:null,
    },  
  
    initStorage:function(evt){ //proc CUB3.HISTORY.initStorage {yellow}
      //init APP localstororage handling
      //window.localStorage.removeItem(CUB3.HISTORY.GLOBALS.storageID); //debug
      let stored=window.localStorage.getItem(CUB3.HISTORY.GLOBALS.storageID);
      //console.log(stored);
      if (stored===null){
        CUB3.HISTORY.GLOBALS.storage='';
      }else{
        CUB3.HISTORY.GLOBALS.storage=stored;
      }
      
    },    
    
  },

  //proc <hr> {icon-none}
  
  UTILS:{ //proc CUB3.UTILS
  
    dataTextToFile:function(s){ //proc CUB3.UTILS.dataTextToFile 
      // write the bytes of the string to an ArrayBuffer
      var ab=new ArrayBuffer(s.length);
      var ia=new Uint8Array(ab);
      for (var z=0,zEnd=s.length;z<zEnd;z++) {
        ia[z]=s.charCodeAt(z);
      }
      return new Blob([ab],{type:'text'});
      //return new File([ab],{type:'text'});
    },
  
    saveToFile:function(){ //proc CUB3.UTILS.saveToFile 
      let json=CUB3.GRID.updateSpriteData();
      let theInternalUriurl=URL.createObjectURL(CUB3.UTILS.dataTextToFile(json))
      let ef=document.getElementById('output');
      ef.innerHTML='';
      let a=document.createElement('a');
      let dd=new Date();
      let sd=dd.getFullYear()+ ('0'+(dd.getMonth()+1)).slice(-2) + ('0'+(dd.getDate())).slice(-2) + ('0'+(dd.getHours())).slice(-2) + ('0'+(dd.getMinutes())).slice(-2)+ ('0'+(dd.getSeconds())).slice(-2);
      let fname='cub3.'+sd+'.json';
      a.innerHTML=fname;
      a.name=a.download;
      a.href=theInternalUriurl;
      a.download=fname;
      //var mimeString='text';
      //a.dataset.downloadurl = [mimeString, a.download,a.href].join(':'); //non sembra utile...
      ef.appendChild(a);
    },
    
  },
  
  
  //proc <hr> {icon-none}

  GRID:{ //proc CUB3.GRID
  
    GLOBALS:{
      elements:[],
    },
    
    updateSpriteData:function(){ //proc CUB3.GRID.updateSpriteData
      //console.log('update sprite data');
      //return;
      //update textarea with json data
      const C3=CUB3;
      const glProgram=C3.WEBGL.GLOBALS.glProgam;//lookup var
      
      let cubes=glProgram.data.cubesMapping.id;
      
      let data=[];
      for (let z in cubes){ //conver to plain array
        /*
        let dd={};
        for (let zz in cubes[z]){
          if (zz!=='bufferIndex' && zz!=='id'){ //exclude unneeded props
            dd[zz]=cubes[z][zz];
          }
        }
        data.push(dd);        
        */
        data.push(cubes[z]);        
      }
      
      let cub3data={
        palette:CUB3.WEBGL.WORLD.COLORS.GLOBALS.palette,
        autoRotateX:C3.GLOBALS.autoRotateX,
        autoRotateY:C3.GLOBALS.autoRotateY,
        autoRotateZ:C3.GLOBALS.autoRotateZ,
        cubes:data
      }
      let s=JSON.stringify(cub3data);
      if (C3.GLOBALS.localStorageSupported){      
        window.localStorage.setItem(CUB3.HISTORY.GLOBALS.storageID,s);
      }  
      return s;
      //document.getElementById('sdata').value=
    },
    
    cellOn:function(oCell){ //proc CUB3.GRID.cellOn
      const C3=CUB3;
      const glProgram=C3.WEBGL.GLOBALS.glProgam;//lookup var

      let rgba;
      //if (oCell.restore!==true)
        oCell.selected=true;
      if (oCell._rgba===C3.UNDEFINED){ //manual
        let paletteIdx=C3.WEBGL.WORLD.COLORS.GLOBALS.paletteIdx;
        let color=C3.WEBGL.WORLD.COLORS.GLOBALS.palette[paletteIdx];        
        oCell.style.background=C3.WEBGL.WORLD.COLORS.parseColor(color);
        rgba=C3.WEBGL.WORLD.COLORS.color2Rgba(color);
        //console.log('color',color,rgba);
      }else{ //via restore
        rgba=oCell._rgba;
        let domCell=document.getElementById(oCell._x+','+oCell._y);
        domCell.selected=true;
        domCell.style.background=`rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;//rgba('+(rgb.r)+','+(rgb.g)+','+(rgb.b)+')';
        if (oCell.restore===true){
          let idx=parseInt(domCell.getAttribute('data-index'));
          let Z=parseInt(oCell.z);
          if (Z<0)
            Z*=-1; //aggiustiamo indice array
          if (typeof C3.GLOBALS.gridMatrix[Z]==='undefined'){
            //console.log('init',Z);
            C3.GLOBALS.gridMatrix[Z]=[];
          }  
          //console.log(oCell.z,Z,idx,domCell.style.background); 
          C3.GLOBALS.gridMatrix[Z][idx]={selected:true,color:domCell.style.background};
        }
      }

      let updateNeeded=true;
      let x=oCell._x;
      let y=oCell._y;
      let z=-C3.GLOBALS.Z;
      if (oCell.restore===true){
        z=oCell.z;
      }  
      let cubes=glProgram.data.cubesMapping.position[x+','+y+','+z];
      if (cubes===C3.UNDEFINED){        
        C3.WEBGL.WORLD.addCube({isBatchCall:oCell.isBatchCall,x:oCell._x,y:oCell._y,z:z,r:rgba.r,g:rgba.g,b:rgba.b,a:rgba.a});
      }else{
        let theCube=cubes[Object.keys(cubes)];
        if (
          theCube.x===oCell._x && theCube.y===oCell._y && -z===theCube.z &&
          theCube.r===rgba.r   && theCube.g===rgba.g && theCube.b===rgba.b && theCube.a===rgba.a
        ){
          updateNeeded=false;
        }
        
        if (updateNeeded){
          let updateIdx=theCube.bufferIndex;
          let updateId=theCube.id;
          C3.WEBGL.WORLD.addCube({update:1,id:updateId,updateIdx:updateIdx,x:oCell._x,y:oCell._y,z:z,r:rgba.r,g:rgba.g,b:rgba.b,a:rgba.a});
        }  
      }    

      if (updateNeeded){
        if (oCell.restore!==true)
          if (oCell.isBatchCall!==true)
            CUB3.GRID.updateSpriteData();
      }      

    },
    
    cellOff:function(oCell){ //proc CUB3.GRID.cellOff
      const C3=CUB3;
      const glProgram=C3.WEBGL.GLOBALS.glProgam;//lookup var

      oCell.selected=false;
      oCell.style.background='';
      //let z=-C3.GLOBALS.Z;
      
      let x=oCell._x;
      let y=oCell._y;
      let z=-C3.GLOBALS.Z;
      let updateNeeded=true;      
      let cubes=glProgram.data.cubesMapping.position[x+','+y+','+z];
      //console.log('cuby',cubes);
      if (typeof cubes==='undefined'){
        updateNeeded=false;      
        //console.log('already deleted');
      }else{
        //console.log('delete yes');
      }
      
      if (updateNeeded){
        C3.WEBGL.WORLD.removeCube({x:oCell._x,y:oCell._y,z:z});
        CUB3.GRID.updateSpriteData();
      }  

    },
    
    reset:function(){ //proc CUB3.GRID.reset
      const C3=CUB3;
      for (let z in C3.GRID.GLOBALS.elements){
        let oCell=C3.GRID.GLOBALS.elements[z];
        oCell.selected=false;
        oCell.style.background='';
      } 
    },
    
    sliceUp:function(){ //proc CUB3.GRID.sliceUp
      const C3=CUB3;
      C3.GRID.saveZ(C3.GLOBALS.Z);
      if (C3.GLOBALS.Z<C3.GLOBALS.gridSize)
        C3.GLOBALS.Z++;
      else  
        1;//C3.GLOBALS.Z=0;
      C3.GRID.restoreZ(C3.GLOBALS.Z);
    },
    sliceDown:function(){ //proc CUB3.GRID.sliceDown
      const C3=CUB3;
      C3.KEYBOARD.GLOBALS.keysUp[65]=0;
      C3.GRID.saveZ(C3.GLOBALS.Z);
      if (C3.GLOBALS.Z>0)
        C3.GLOBALS.Z--;
      else  
        1;//C3.GLOBALS.Z=C3.GLOBALS.gridSize-1;
      C3.GRID.restoreZ(C3.GLOBALS.Z);
    },
    
    saveZ:function(Z){ //proc CUB3.GRID.saveZ
      const C3=CUB3;
      if (typeof C3.GLOBALS.gridMatrix[Z]==='undefined')
        C3.GLOBALS.gridMatrix[Z]=[];
      for (let z in C3.GRID.GLOBALS.elements){
        let oCell=C3.GRID.GLOBALS.elements[z];
        C3.GLOBALS.gridMatrix[Z][z]={selected:oCell.selected,color:oCell.style.background};
      } 
    },    

    restoreZ:function(Z){ //proc CUB3.GRID.restoreZ
      const C3=CUB3;
      if (typeof C3.GLOBALS.gridMatrix[Z]==='undefined')
        C3.GLOBALS.gridMatrix[Z]=[];
      for (let z in C3.GRID.GLOBALS.elements){
        let cell=C3.GLOBALS.gridMatrix[Z][z];
        let oCell=C3.GRID.GLOBALS.elements[z];
        //console.log('restore',Z,z,cell);
        if (typeof cell!=='undefined'){
          oCell.selected=cell.selected;
          oCell.style.background=cell.color;
        }else{
          oCell.selected=false;
          oCell.style.background='';
        }  
      } 
    },    
    
    load:function(json){ //proc CUB3.GRID.load
      const C3=CUB3;
      C3.WEBGL.WORLD.clearAll();      
      let data=JSON.parse(json);
      if (data.palette!==C3.UNDEFINED){
        CUB3.WEBGL.WORLD.COLORS.GLOBALS.palette=data.palette;
        for (let z=0,zEnd=CUB3.WEBGL.WORLD.COLORS.GLOBALS.palette.length;z<zEnd;z++){
          let currentColor=CUB3.WEBGL.WORLD.COLORS.GLOBALS.palette[z];
          let cell=document.getElementById('colorcell'+z);
          //console.log(currentColor);
          cell.style.backgroundColor=CUB3.WEBGL.WORLD.COLORS.parseColor(currentColor);
          cell.setAttribute('data-user-defined-color',currentColor);          
        }
      }
      
      if (data.autoRotateX!==C3.UNDEFINED && data.autoRotateX)
        C3.GLOBALS.autoRotateX=1;
      if (data.autoRotateY!==C3.UNDEFINED && data.autoRotateY)
        C3.GLOBALS.autoRotateY=1;
      if (data.autoRotateZ!==C3.UNDEFINED && data.autoRotateZ)
        C3.GLOBALS.autoRotateZ=1;

      if (data.cubes!==C3.UNDEFINED && data.cubes){  
        let cubes=data.cubes;
        let ibc=true;
        //console.log(cubes);
        for (let w=0,wEnd=cubes.length;w<wEnd;w++){              
          if (w===wEnd-1)
            ibc=false; //build the buffer array only on finish
          C3.GRID.cellOn({isBatchCall:ibc,restore:true,_x:cubes[w].x,_y:cubes[w].y,z:cubes[w].z,_rgba:{r:cubes[w].r,g:cubes[w].g,b:cubes[w].b,a:cubes[w].a} });
        }
      }  

      C3.GLOBALS.Z=0;
      C3.GRID.restoreZ(0);
    },
    
    init:function(){ //proc CUB3.GRID.init
      const C3=CUB3;
      let dGrid=document.getElementById('grid');
      let row=document.createElement('div');
      dGrid.appendChild(row);
      for (let z=0,zEnd=C3.GLOBALS.gridSize*C3.GLOBALS.gridSize;z<zEnd;z++){
        let d=document.createElement('div');
        d.className='cub3grid';
        //d.style='width:20px;height:20px;border:1px solid gray;float:left';        
        d._x=z%C3.GLOBALS.gridSize;
        d._y=C3.GLOBALS.gridSize-1-Math.floor(z/C3.GLOBALS.gridSize);
        d.id=d._x+','+d._y;
        d.setAttribute('data-index',z);
        d.ondragstart=function(){return false;}; //disable dragging on cells
        d.onmousedown=function(e){
          C3.GLOBALS.UI.mousedown=e.which; //get mouse button  
          if (e.target.selected){
            C3.GLOBALS.UI.togglePaint=true;
            C3.GRID.cellOff(e.target);          
          }else{
            C3.GLOBALS.UI.togglePaint=false;
            C3.GRID.cellOn(e.target);          
          }
        }
        d.onmouseup=function(e){
          C3.GLOBALS.UI.mousedown=null;  
        }
        d.onmousemove=function(e){
          if (C3.GLOBALS.UI.mousedown===1){ //left mouse click
            if (C3.GLOBALS.UI.togglePaint===false)
              C3.GRID.cellOn(e.target);
            else
              C3.GRID.cellOff(e.target);
          }
        }
        //d.innerHTML=z;
        if (z>0 && z%C3.GLOBALS.gridSize===0){ //paint next row         
          row=document.createElement('div');
          dGrid.appendChild(row);
          //d.style.clear='left';
        }

        row.appendChild(d);
        C3.GRID.GLOBALS.elements.push(d);
      }

      let dd=document.createElement('div');
      dd.id='gridpalette';
      dd.style.clear='both';
      dGrid.appendChild(dd);
      
      let pdrow=document.createElement('div');
      dd.appendChild(pdrow);
      //colors
      for (let z=0,zEnd=C3.WEBGL.WORLD.COLORS.GLOBALS.palette.length;z<zEnd;z++){
        let currentColor=C3.WEBGL.WORLD.COLORS.GLOBALS.palette[z];
        //console.log(currentColor);
        let d=document.createElement('div');
        d.className='cub3gridpalettecell';
        d.id='colorcell'+z;
        //d.style='width:20px;height:20px;border:1px solid gray;float:left';
        
        d.style.backgroundColor=CUB3.WEBGL.WORLD.COLORS.parseColor(currentColor);
        /*
        if (d.style.backgroundColor==='')
          d.style.backgroundColor=currentColor;        
        if (d.style.backgroundColor==='')
          d.style.backgroundColor='rgb('+currentColor;        
        if (d.style.backgroundColor==='')
          d.style.backgroundColor='rgba('+currentColor;        
        */  
        
        //d.setAttribute('data-palette-index',z);
        d.colorIdx=z;
        d.onclick=function(){
          C3.WEBGL.WORLD.COLORS.GLOBALS.paletteIdx=this.colorIdx;
          let paletteIdx=this.colorIdx;
          let color=C3.WEBGL.WORLD.COLORS.GLOBALS.palette[paletteIdx];
          let userDefinedColor=d.getAttribute('data-user-defined-color');
          if (userDefinedColor===null)
            document.getElementById('current_color').value=color;
          else  
            document.getElementById('current_color').value=userDefinedColor;
        };
        if (z>0 && z%C3.GLOBALS.gridSize===0){ //paint next row         
          pdrow=document.createElement('div');
          dd.appendChild(pdrow);
        }
        pdrow.appendChild(d);
      }

      //let d2=document.createElement('div');
      //dGrid.appendChild(d2);
      
      //proc textarea handler {violet bold indent_1}
      if (document.getElementById('sdata')!==null){
        document.getElementById('sdata').onkeyup=function(e){

          if (e.keyCode===86){ //CNTRL+V si suppone
            //console.log('CHAR',e.keyCode);
            const C3=CUB3;
            C3.GRID.load(this.value);

          }  
        };
      }  
        
      
    }
  }
  
};

//proc <hr> {icon-none}
CUB3.init();
if (CUB3.GLOBALS.localStorageSupported){
  if (CUB3.HISTORY.GLOBALS.storage!==''){
    CUB3.GRID.load(CUB3.HISTORY.GLOBALS.storage);
  }
}  
CUB3.UI.goFullScreen();
CUB3.UI.fullScreenToggle();