 /****************  Author Ruhua Yan from www.richyan.com  ***************************************************/
    
    var isIE = /*@cc_on!@*/false || !!document.documentMode;
    
    var NROWS =20, NCOLS =10, PADDING = 1;
    var conLeft = document.getElementById("conLeft");
    var conSub = document.getElementById('conSubTitle');
    var nextShapeDiv = document.getElementById("nextShape");
    var scoresSpan = document.getElementById('scores');
    var levelSpan = document.getElementById('level');
    
    var conW = conLeft.clientWidth || conLeft.offsetWidth;
    var conH = conLeft.clientHeight || conLeft.offsetHeight;
    console.log(conW+'/'+conH);
    var squareW = (conW - PADDING*NCOLS-PADDING*2)/NCOLS; 
    var squareH = (conH - PADDING*NROWS-PADDING)/NROWS;                                
    var brickArray=new Array(NROWS * NCOLS); // all squares div array
    var nsDivArray = new Array(NCOLS*2);    // next shape div array
    for(i=0; i<NROWS*NCOLS; i++){
        var square = createSquare(i, conLeft, false);
        brickArray[i]=square;
    };
    // div Array for the next shape
     for(i=0; i<NCOLS*2; i++){
        var square = createSquare(i, nextShapeDiv, true);
        nsDivArray[i]=square;
    };
    var stage = 0; // var stage = {PRE:0, PLAY:1, PAUSE:2};  
    loadProcess(0, NCOLS*NROWS);
    
   function createSquare(n, conDiv, isNShape){
        var squareDiv = document.createElement("div");
	squareDiv.setAttribute('id',"square"+n);
        if(isIE){
            squareDiv.style.borderLeft = PADDING +'px solid #fff';
            squareDiv.style.borderTop = PADDING +'px solid #fff';
        }
	//chrome does not change border size when zoom, so it has to work with margin
        else{
            squareDiv.style.marginLeft = PADDING + "px";
            squareDiv.style.marginTop = PADDING + "px";}
        
	squareDiv.style.width= squareW + "px";
        squareDiv.style.height = squareH + "px";
	if(isNShape){squareDiv.style.backgroundColor="#fff";}
        else
            squareDiv.style.backgroundColor="#009900";
        squareDiv.style.float="left";
	conDiv.appendChild(squareDiv);	
        return squareDiv;
    }  
   
    function loadProcess(firstSquare, lastSquare){  
        if(firstSquare>=lastSquare) {
            clearTimeout(loadID);
            conSub.innerHTML = '<a href="javascript: playGame();" style=" background-color:#f0f0f0; padding: 2px; border:1px solid #e0e0e0;">Click to play</a>';
            stage = 0;
            return;
        }
        var square = document.getElementById("square"+firstSquare);
        square.style.backgroundColor= "#fff";
        firstSquare++;
        loadID = setTimeout(function() {loadProcess(firstSquare,lastSquare);}, 5);
    };
    
    // Shapes array inside of squares multidimentional array
    // inside shapes array, there are shape array (length 4). And inside shape array, there are 4 int - square
    var shape = [], nextShape=[], shapes=[], deadSquares = [];  
    var deadArray = {}; //assiciative array: squareID -> color;
    var timeID, randID, nextID; //timeID - timeoutID
    var sLEN = 4; //shape array  length
    var sPOS = 3; //start Positon - which square to start
    
    var scores,s, level=1;
    var speed = 600;
    
    function playGame(){
        scores =0; s=0;                // s is scores after level
        scoresSpan.innerHTML = scores;
        createShape();
        conSub.innerHTML = '<a href="javascript: pause();" style=" background-color:#f0f0f0; padding: 2px; border:1px solid #e0e0e0;">Click to pause</a>';
        stage = 1;
    }
    function pause(){
        clearTimeout(timeID);
        conSub.innerHTML = '<a href="javascript: resume();" style=" background-color:#f0f0f0; padding: 2px; border:1px solid #e0e0e0;">Click to Resume</a>';
        stage = 2;
    }
    function resume(){
        dropShape();
        conSub.innerHTML = '<a href="javascript: pause();" style=" background-color:#f0f0f0; padding: 2px; border:1px solid #e0e0e0;">Click to pause</a>';
        stage = 1;
    }
    
    var index; //shapeIndex to rotate
    // RebeccaPurple #663399 + Fuchsia:#FF00FF + Crimson:#DC143C + OliveCrab:#6B8E23 + Orange:#FFA500,
    var colors = ['#663399', '#FF00FF', '#C71585', '#DC143C', '#FFA500', '#6B8E23' ];
    var color;
    var cLEN = colors.length;
    function createShape(){
        for(i=0; i<NCOLS*2; i++) nsDivArray[i].style.backgroundColor= "#fff";   // to clear next shape DIVs
        var firstShapes =[[0, 1, 2, NCOLS+1], [0, 1, 2, 3], [0, 1, 2, NCOLS], [0, 1, NCOLS, NCOLS+1], [0, 1, NCOLS+1, NCOLS+2], [0, 1, 2, NCOLS+2], [1, 2, NCOLS, NCOLS+1]];
        randID = nextID >=0? nextID : parseInt(Math.random()*6);                // 5 shapes - squares.lenght
        nextID = parseInt(Math.random()*6);
        var squares=[];
        squares[0]=[[0, 1, 2, NCOLS+1],[1, NCOLS, NCOLS+1, NCOLS*2+1],[0, NCOLS-1, NCOLS, NCOLS+1],[-1, NCOLS-1, NCOLS, NCOLS*2-1]];
        squares[1]=[[0, 1, 2, 3], [1, NCOLS+1, NCOLS*2+1, NCOLS*3+1]];
        squares[2]=[[0, 1, 2, NCOLS], [0, 1, NCOLS+1,NCOLS*2+1], [2, NCOLS, NCOLS+1, NCOLS+2], [-2, NCOLS-2, NCOLS*2-2, NCOLS*2-1]];
        squares[3]=[[0, 1, NCOLS, NCOLS+1]];
        squares[4]=[[0, 1, NCOLS+1, NCOLS+2],[0, NCOLS-1, NCOLS, NCOLS*2-1]];
        squares[5]=[[0,1,2,NCOLS+2], [1, NCOLS+1, NCOLS*2, NCOLS*2+1], [-1, NCOLS-1, NCOLS, NCOLS+1], [0, 1, NCOLS, NCOLS*2]];
        //squares[6]=[[1,2,NCOLS, NCOLS+1],[0, NCOLS, NCOLS+1, NCOLS*2+1]];  // it does not work yet
        
        shapes = squares[randID];
        index=0;                                                                // shapes[index] - index of formations (shapes)
        shape =firstShapes[randID];  
        nextShape = firstShapes[nextID]; 
        color = colors[randID];
        for(i=0; i<sLEN; i++){
            nsDivArray[nextShape[i]].style.backgroundColor= "#000";
            shape[i] +=sPOS;                                                    // start position of shape
        }                                                                       //console.log('nextShape: '+nextShape);
        dropShape();
    }
    function dropShape(){
        if(checkBottom()) {return;}
        for(i=0; i<sLEN; i++){
            brickArray[shape[i]].style.backgroundColor = '#fff';
            shape[i] += NCOLS;
        }
        setBG();

        timeID = setTimeout(function(){dropShape();                //window.requestAnimationFrame(dropShape);
        }, speed);
    }
    function setBG(){
        for(i=0; i<sLEN; i++){
            var squareNum = shape[i];
            if(squareNum<NCOLS*NROWS)
                brickArray[squareNum].style.backgroundColor=  colors[(i+randID)%cLEN];
           
       }
    }
    //window.addEventListener("resize", function(){alert('hi');});
    window.addEventListener("keydown", moveShape, false);
    function moveShape(e){
        if(stage!==1 && e.keyCode!==32) return false;
        switch(e.keyCode) {
        case 32: 
            if(stage===0) playGame();
            else if(stage===1) pause();
            else if(stage===2) resume();
            break;   
        case 37:  //key  -  left
            clearTimeout(timeID);
            for (i=0; i<sLEN; i++){
                var row = parseInt(shape[i]/NCOLS); 
                if(shape[i] <= NCOLS*row){ dropShape(); return;} 
                if(deadSquares.indexOf(shape[i]-1)>=0 ) { dropShape(); return;}
            }

            for (i=0; i<sLEN; i++) {
                brickArray[shape[i]].style.backgroundColor = '#fff';
                --shape[i];
            }
            setBG();
            dropShape();
            break;	
            
        case 39:  // key - right
            clearTimeout(timeID);
            for (i=0; i<sLEN; i++){
                var row = parseInt(shape[i]/NCOLS); 
                if(shape[i] >= NCOLS*(row+1)-1){ dropShape();return;} 
                 if(deadSquares.indexOf(shape[i]+1)>=0 ){ dropShape(); return;}
            }

            for (i=0; i<sLEN; i++){
                brickArray[shape[i]].style.backgroundColor = '#fff';
                ++shape[i];
            }
            setBG();
            dropShape();
	    break;
            
        case 40:  // key - down
            clearTimeout(timeID);
            dropShape();
            break; 
            
        case 38:  //key - up
            if(randID===3) return;
            clearTimeout(timeID);
            var newShape = shapes[++index%shapes.length];                        
            var startPos = shape[0];                                            //console.log("newShape: "+newShape);
            for (i=0; i<sLEN; i++){
                var newPos =  newShape[i] + startPos;                           
                if(newPos>=NCOLS*NROWS){
                    dropShape(); index--; //go back to original index
                    return;
                }                            
                if(i>0){
                    var prevIndex = i-1;
                    var prevPos = newShape[prevIndex]+startPos;
                    
                    if( newPos-prevPos ===1){                                   // if the new square is next to the previous, they must be in the same row
                        if(parseInt(newPos/NCOLS)!==parseInt(prevPos/NCOLS)){
                            dropShape(); index--; //go back to original index
                            return;
                        }
                    }else if(newPos-prevPos>sLEN){                              // if the new square is not next to the previous, they must be in the different row 
                        if(parseInt(newPos/NCOLS)===parseInt(prevPos/NCOLS)){
                             dropShape(); index--; //go back to the original index
                             return;
                        }
                    }
                }
                
                if(deadSquares.indexOf(newPos)>=0 ){ dropShape(); index--; return;}      
            }
             for (i=0; i<sLEN; i++){
                brickArray[shape[i]].style.backgroundColor = '#fff';
                shape[i] = newShape[i] + startPos; // start position of shape
            }
            setBG();
            dropShape();
            break; 
        }   
    }
    function checkBottom(){
        clearTimeout(timeID);
        var deadLen = deadSquares.length;
        if(deadLen>0){   
            for(i=0; i<sLEN; i++){
                for(j=deadLen-1; j>=0; j--){
                    if(shape[i]+NCOLS === deadSquares[j]){ 
                        if(deadSquares[j]<NCOLS*2){
                            //clearTimeout(timeID); 
                            alert("You lost!!!");
                            deadSquares=[];
                            //deadArray = {};
                            loadProcess(0, NCOLS*NROWS);
                            conSub.innerHTML = 'Game stopped';
                            return true;
                        }                
                        deadSquares = deadSquares.concat(shape); 
                        deadSquares.sort(function(a, b){return b-a;});
                        checkLine();
                       
                        createShape();
                        return true;
                    }
                }
            }
        }       
        for(i=0; i<sLEN; i++){ 
           if(shape[i]/NCOLS+1 >= NROWS) {
               deadSquares = deadSquares.concat(shape); 
               deadSquares.sort(function(a, b){return b-a;});
               checkLine();
               createShape();
               return true;
           }
        }
        return false;
    }
    
    var hasLine = false;   
    function checkLine(){                
        var deadLen = deadSquares.length;                                       //console.log("dead: "+deadArray);
        
        for(i=0; i<deadLen; i++){
            if(deadSquares[i]%NCOLS===NCOLS-1) {                                
                var startLine = deadSquares[i];                               
                var isLine = false;
                for(n=1; n<NCOLS; n++ ){
                    if(deadSquares[i+n] === startLine-n) isLine = true;
                    else {isLine = false; break;}
                }
                if(isLine){  
                    //var temp = [];
                    for(n=0; n<NCOLS; n++){ 
                        brickArray[deadSquares[i+n]].style.backgroundColor = '#fff';
                        //temp[n]= deadArray[deadSquares[i+n]];
                        //delete deadArray[deadSquares[i+n]];
                    }
                    scores = scores + 10; s=s+10;
                    if( s>=100 && speed > 100){
                        level++; levelSpan.innerHTML = level;
                        s = 0;
                        speed = speed -100;
                    }
                    scoresSpan.innerHTML = scores;
                    deadSquares.splice(i, 10);                                  //console.log("deleted Line: "+deadSquares );
                    
                    deadLen = deadSquares.length;
                    for(n=i; n<deadLen;  n++){
                        if(!hasLine) brickArray[deadSquares[n]].style.backgroundColor = '#fff';    //to determind if it is first line, second second doesn't set BG again
                        deadSquares[n] += NCOLS;
                    }
                    hasLine = true;                                             //console.log("after deletion: "+deadSquares); 
                    checkLine();
                }
            }
        
        }
        if(hasLine) {
            hasLine = false;
            for(n=0; n<deadLen; n++)
                         brickArray[deadSquares[n]].style.backgroundColor = color; 
                 }
    }