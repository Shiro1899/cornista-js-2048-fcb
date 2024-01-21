let board;
let score = 0;
let rows = 4;
let columns = 4;

//These variables will be used to monitor if the player won
//if one of these variables' value became true, it means the player already won
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//For touch
let startX = 0;
let startY = 0;

// Functions are callable programmed tasks
function setGame(){
    board = [
        [0, 8, 16, 8],
        [0, 16, 8, 16],
        [16, 8, 16, 8],
        [8, 16, 8, 16]
    ]; //backend board
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]; //backend board

    // Goal, we want to use the backend board to design and move the tiles of the frontend board

    //loops are code to repeat tasks inside it, until it fulfills its task
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){

            // This code is to create a tile through creating div elements
            let tile = document.createElement("div");

            //each tile will have an id based on its row and column position through this code
            tile.id = r.toString() + "-" + c.toString();

            //Get the number of a tile 
            let num = board[r][c];

            //Use the the number to update the tile's appearance (text and appearance)
            updateTile(tile, num); //sets the class and id names of the tile
            
            //Add the created tile with id to the frontend game board
            document.getElementById("board").append(tile); //adds the tile (Ex. <div class="tile x2" id="0-2">2</div>) inside the board (<div id="board"></div>)

        }
    }

    setTwo();
    setTwo();
}

// This function is to update the color of the tile based on its number
function updateTile(tile, num){
    // Resets the tile and its class names 
    tile.innerText = ""; //removes current text to the tile
    tile.classList.value = "";  //removes current class value
    
    // Add class name "tile" to resize and design the tile based on our assigned size and styles for class name tile.
    tile.classList.add("tile"); //since initially, it is "", no space will be added in the beginning

    // If the num value is not zero let's change the color of the tile based on it's num value (We will only color tiles with values that are not zero)
    if(num > 0) {
        // This will display the number of the tile
        tile.innerText = num.toString();
        
        // And this will color the tile
        // If the num value of the tile is lesser or equal to 4096, it will use class x2 to x4096 css classes to color the tile (depending on the num value of the tile)
        if (num <= 4096){
            tile.classList.add("x"+num.toString()); //automatically adds a space in-between 'tile' and 'x{num}'
        } else {
            // Then if the num value is greater than 4096, it will use class x8192 to color the tile
            tile.classList.add("x8192"); //automatically adds a space in-between 'tile' and 'x8192'
        }
    }
    
}


window.onload = function(){
    //setGame() is called to be executed
    setGame();
}


function filterZero(row){
    return row.filter(num => num != 0); //Checks if the number is not 0 (Ex. [0, 2, 2, 0] becomes [2, 2])
}

//merges adjacent numbers that are the same
function slide(row){
    row = filterZero(row);

    for(let i = 0; i < row.length - 1; i++){
        /* 1st iteration:
        If index 0 == index 1 (2 == 2)
        (true) index 0 = 2 * 2 (4)
        Index 1 = 0 (4,0,2)

        2nd iteration:
        If index 1 == index 2 (0 == 2)
        (false) index 1 = 0
        Index 2 = 2 (4,0,2)
        */
        // If two adjacent numbers are equal.
        if(row[i] == row[i+1]){
            // merge them by doubling the first one
            row[i] *= 2;
            // and setting the second one to zero.      
            row[i+1] = 0;
            
            score += row[i];
        } // [2, 2, 2] -> [4, 0, 2]

     }

     row = filterZero(row); // [4, 0, 2] -> [4, 2]

     //adds 0 to row if its length is less than 4
     while(row.length < columns){
        row.push(0);
     }

     return row;

}

//outputs the key the was pressed down. you can see it in the console of developers tool of the website (F12)
function handleSlide(e){
    console.log(e.code); //e.code represents what key is being pressed in our keyboard

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)){
        e.preventDefault(); //Prevents default behavior (scrolling) on keydown

        if (e.code == "ArrowLeft" && canMoveLeft()){
            slideLeft();
            //adds two if there's an empty tile
            setTwo();
        }

        else if (e.code == "ArrowRight" && canMoveRight()){
            slideRight();
            //adds two if there's an empty tile
            setTwo();
        }

        else if (e.code == "ArrowUp" && canMoveUp()){
            slideUp();
            //adds two if there's an empty tile
            setTwo();
        }

        else if (e.code == "ArrowDown" && canMoveDown()){
            slideDown();
            //adds two if there's an empty tile
            setTwo();
        }

        
        document.getElementById("score").innerText = score;

        //checks if player has won
        checkWin();

        //checks if player has lost
        if (hasLost()){
            setTimeout(
                () => {
                    alert("Game Over! You have lost the game. Game will restart");
                    restartGame();
                    alert("Click any arrowkey to restart");
                },
                100
            );
            
        }
    }
}


//.addEventListener() listens to whatever is pressed in the keyboard
document.addEventListener("keydown", handleSlide); //the key that is pressed down is passed as the input of the function handleSlide()

function slideLeft(){
    //iterate through each row
    for(let r = 0; r < rows; r++){
        
        //all tile values per row are saved in a container
        let row = board[r];

        //line for animation
        let originalRow = row.slice(); //initial state of the row before the movement

        //We used slide function to merge tiles with the same values
        row = slide(row); //assigns a list in variable 'row' (Ex. [4, 2, 0, 0])
        //Update the row with the merged tile/s
        board[r] = row;

        //Because of this loop, we are able to update the ids and color of all tiles
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString()); //gets the element with id = "{r}-{c}", for example, it gets <div class="tile x2" id="0-2">2</div>
            let num = board[r][c];
            updateTile(tile, num); //updates the class and innertext of the tile element

            if (originalRow[c] !== num && num !== 0){
                tile.style.animation = "slide-from-right 0.3s";
                setTimeout(
                    () => {
                        tile.style.animation = "";
                    }, 
                    300
                );
            }
        }
    }
}

function slideRight(){
    //iterate through each row
    for(let r = 0; r < rows; r++){
        
        //all tile values per row are saved in a container
        let row = board[r];

        //line for animation
        let originalRow = row.slice(); //initial state of the row before the movement

        row = row.reverse();
        //We used slide function to merge tiles with the same values
        row = slide(row).reverse(); //assigns a list in variable 'row' (Ex. [4, 2, 0, 0])
        //Update the row with the merged tile/s
        board[r] = row;

        //Because of this loop, we are able to update the ids and color of all tiles
        for(let c = 0; c < columns; c++){
            let tile = document.getElementById(r.toString() + "-" + c.toString()); //gets the element with id = "{r}-{c}", for example, it gets <div class="tile x2" id="0-2">2</div>
            let num = board[r][c];
            updateTile(tile, num); //updates the class and innertext of the tile element

            if (originalRow[c] !== num && num !== 0){
                tile.style.animation = "slide-from-left 0.3s";
                setTimeout(
                    () => {
                        tile.style.animation = "";
                    }, 
                    300
                );
            }
        }
    }
}

//For merging, slideUp() and slideDown() will be mainly through column values
function slideUp(){
    //iterate through each column
    for(let c = 0; c < columns; c++){
        
        //all tile values per column are saved in a container
        let column = [];
        
        for(let r = 0; r < rows; r++){
            column.push(board[r][c]);
        }
        
        //line for animation
        let originalColumn = column.slice(); //initial state of the column before the movement

        //We used slide function to merge tiles with the same values
        column = slide(column); //assigns a list in variable 'column' (Ex. [4, 2, 0, 0])
        
        //Update the column with the merged tile/s
        //Because of this loop, we are able to update the ids and color of all tiles
        for(let r = 0; r < rows; r++){
            //updates columns
            board[r][c] = column[r];
            //updates ids and colors
            let tile = document.getElementById(r.toString() + "-" + c.toString()); //gets the element with id = "{r}-{c}", for example, it gets <div class="tile x2" id="0-2">2</div>
            let num = board[r][c];
            updateTile(tile, num); //updates the class and innertext of the tile element

            if (originalColumn[r] !== num && num !== 0){
                tile.style.animation = "slide-from-bottom 0.3s";
                setTimeout(
                    () => {
                        tile.style.animation = "";
                    }, 
                    300
                );
            }
        }
    }
}

function slideDown(){
    //iterate through each column
    for(let c = 0; c < columns; c++){
        
        //all tile values per column are saved in a container
        let column = [];
        
        for(let r = 0; r < rows; r++){
            column.push(board[r][c]);
        }
        
        //line for animation
        let originalColumn = column.slice(); //initial state of the column before the movement

        column = column.reverse();

        //We used slide function to merge tiles with the same values
        column = slide(column).reverse(); //assigns a list in variable 'column' (Ex. [4, 2, 0, 0])
        
        
        // // To check which tiles have changed its posiiton
        // let changedIndices = []; //this variable and the loop will record of the tiles that have changed
       
        // for (let r = 0; r < rows; r++) {
        //     if (originalColumn !== column[r]) {
        //         changedIndices.push(r);
        //     }
            
        // }

        //Update the column with the merged tile/s
        //Because of this loop, we are able to update the ids and color of all tiles
        for(let r = 0; r < rows; r++){
            //updates columns
            board[r][c] = column[r];
            //updates ids and colors
            let tile = document.getElementById(r.toString() + "-" + c.toString()); //gets the element with id = "{r}-{c}", for example, it gets <div class="tile x2" id="0-2">2</div>
            let num = board[r][c];
            updateTile(tile, num); //updates the class and innertext of the tile element
            
            // if (changedIndices.includes(r) && num!== 0) {
            //     tile.style.animation = "slide-from-top 0.3s";
            //     setTimeout(
            //         () => {
            //             tile.style.animation = "";
            //         }, 
            //         300
            //     );
            // }

            if (originalColumn[r] !== num && num !== 0){
                tile.style.animation = "slide-from-top 0.3s";
                setTimeout(
                    () => {
                        tile.style.animation = "";
                    }, 
                    300
                );
            }
        }
    }
}

function hasEmptyTile(){
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if (board[r][c] == 0){
                return true;
            }
        }
    }

    return false;
}

function setTwo(){
    
    // This is if all tiles are not empty it will not set a 2 value
    if(!hasEmptyTile()){
        return; // Because the return keyword it will not proceed to next codes inside the function. Therefore it will not set two if all tiles is not empty
    }

    // But if there is an empty tile found it will proceed to this code, which will assign a value 2 to a random tile
    let found = false;

    // While loop is also like for loop that repeats tasks
    // Here, it will repeat the task until he finds the a random empty tile.
    while(!found){
        

    	// This is to get a random tile based on random row and column
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);


        // Then we will check the random tile in the board if it's value is zero. If it is then let's make it 2.
        if(board[r][c] == 0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            updateTile(tile, 2);

            found = true;
        }
    }
}

function checkWin(){

    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){
            if (board[r][c] == 2048 && is2048Exist == false){
                alert("You Win! You got the 2048") //alert() displays a pop-up
                is2048Exist = true;
            }
            else if (board[r][c] == 4096 && is4096Exist == false){
                alert("You are unstoppable at 4096! You are fantastically unstoppable")
                is4096Exist = true;
            }
            else if (board[r][c] == 8192 && is8192Exist == false){
                alert("Victory! You have reached 8192! You are incredibly awesome!")
                is8192Exist = true;
            }
        }
    }
}

function hasLost(){

    // Check if the board is full (because if the board is full and the player has no possible merges, it means he lose)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

        	// If it has an empty tile (value 0), it means the player has not yet lost, so it will return false.
            if (board[r][c] === 0) {
                return false;
            }

            const currentTile = board[r][c];

            // Check if there are adjacent cells (up, down, left, right) for possible merge
            if (
                r > 0 && board[r - 1][c] === currentTile ||
                r < rows - 1 && board[r + 1][c] === currentTile ||
                c > 0 && board[r][c - 1] === currentTile ||
                c < columns - 1 && board[r][c + 1] === currentTile
            ) {
                // Found adjacent cells with the same value, user has not lost
                return false;
            }
        }
    }

    // No possible moves left or empty tiles, user has lost
    return true;
}

function restartGame(){
    
    for(let r = 0; r < rows; r++){
        for(let c = 0; c < columns; c++){

            // Get tile element
            let tile = document.getElementById(r.toString() + "-" + c.toString());

            //set tile back to 0
            board[r][c] = 0;

            //sets the class and id names of the tile
            updateTile(tile, 0);
            
        }
    }
    document.getElementById("score").innerText = 0;
    score = 0;
    setTwo();
    setTwo();
}



// For phone users
//This will listen to when we touch the screen and assigns the x and y coordinates of that touch
//Basically, it listens when the touch is detected
document.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY

})

//Movement of touch
//This iwll check where you touch your screen and prevents scrolling once you swipe.
//Input targets any elements that includes the word tile in their class name
document.addEventListener(
    'touchmove',
    (e) => {
        if (!e.target.className.includes("tile")) { //returns none if the touch is not on the tiles
            return;
        }
        e.preventDefault(); //this line runs if the touch starts from the tiles
    },
    {passive: false} //this argument of addEventListener() allows the .preventDefault() to be called?
)


// Listen for the 'touchend' event on the entire document
//Basically, it listens when the touch is removed
document.addEventListener(
    'touchend', (e) => {        
        // Check if the element that triggered the event has a class name containing "tile" (it basically checks if the tiles are touched)
        if (!e.target.className.includes("tile")) {
            return; // If not, exit the function
        }
        
        // Calculate the horizontal and vertical differences between the initial touch position and the final touch position
        let diffX = startX - e.changedTouches[0].clientX; //.clientX returns X coordinate
        let diffY = startY - e.changedTouches[0].clientY; //.clientY returns Y coordinate
        
        // Check if the horizontal swipe is greater in magnitude than the vertical swipe
        if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe
            if (diffX > 0) {
                if (canMoveLeft()) {
                    slideLeft(); // Call a function for sliding left
                    setTwo(); // Call a function named "setTwo"
                    
                }
            } 
            
            else {
                if (canMoveRight()) {
                    slideRight(); // Call a function for sliding right
                    setTwo(); // Call a function named "setTwo"
                }
                
            }
        } 
        
        else {
            // Vertical swipe
            if (diffY > 0) {
                if (canMoveUp()) {
                    slideUp(); // Call a function for sliding up
                    setTwo(); // Call a function named "setTwo"
                }
            } 
            
            else {
                if (canMoveDown()) {
                    slideDown(); // Call a function for sliding down
                    setTwo(); // Call a function named "setTwo"
                    
                }
            }
        }
        // setTwo(); // Call a function named "setTwo". I placed it here since eitherway of the four swipes, it will still be called



        document.getElementById("score").innerText = score;
            
        checkWin();

        // Call hasLost() to check for game over conditions
        if (hasLost()) {
            // Use setTimeout to delay the alert
            setTimeout(() => {
            alert("Game Over! You have lost the game. Game will restart");
            restartGame();
            alert("Click any key to restart");
            // You may want to reset the game or perform other actions when the user loses.
            }, 100); // Adjust the delay time (in milliseconds) as needed
        }
    }
);


// Check if there are available merging moves in the right direction, if there is none it should not add new tile when pressing left 
function canMoveLeft() {
    // It goes through each row of the grid, one by one (a row is like a horizontal line in the grid).
    for (let r = 0; r < rows; r++) {
        // For each row, it starts from the second column (position) because moving to the left means it's checking if the number can slide to the left.
        for (let c = 1; c < columns; c++) {
            console.log(`${r} - ${c}`); //$ is similar to f in print(f'asdasd{variable}'). They're called template literals.
            // This line checks if the current position on the grid (board[r][c]) has a number in it (not empty). If there's a number there, it means the function is looking at a tile that needs to be checked for moving left.
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position to the left of the current tile is empty (0).
                    // It also checks if the number to the left is the same as the current number.
                if (board[r][c - 1] === 0 || board[r][c - 1] === board[r][c]) {
                    // If the conditions are met (you can move a tile to the left), the function immediately says, "Yes, you can move left in this row!" and stops checking.
                    return true;
                }
            }
        }
    }
    return false;
}

// Check if there are available merging moves in the right direction, if there is none it should not add new tile when pressing right 
function canMoveRight() {
    for (let r = 0; r < rows; r++) {
        //  This loop starts from the second-to-last column and goes backwards because moving to the right means checking the number's interaction with the one to its right.
        for (let c = columns - 2; c >= 0; c--) {
            console.log(`${r} - ${c}`);
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position to the right of the current tile is empty (0).
                    // It also checks if the number to the right is the same as the current number.
                if (board[r][c + 1] === 0 || board[r][c + 1] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

 // Check if there are available merging moves in the upward direction,if there is none it should not add new tile when pressing up 
function canMoveUp() {
    // This line starts a loop that goes through each column in the game grid. A column is like a vertical line in the grid, and this loop checks one column at a time.
    for (let c = 0; c < columns; c++) {
        // This loop starts from the second row because moving upward means checking the number's interaction with the one above it.
        for (let r = 1; r < rows; r++) {
            console.log(`${c} - ${r}`); //$ is similar to f in print(f'asdasd{variable}'). They're called template literals.
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position above the current tile is empty (0).
                    // It also checks if the number above is the same as the current number.
                if (board[r - 1][c] === 0 || board[r - 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}

// Check if there are available merging moves in the downward direction, if there is none it should not add new tile when pressing down 
function canMoveDown() {
    for (let c = 0; c < columns; c++) {
        // This loop starts from the second-to-last row and goes backward because moving downward means checking the number's interaction with the one below it.
        for (let r = rows - 2; r >= 0; r--) {
            console.log(`${c} - ${r}`);
            if (board[r][c] !== 0) {
                // Inside the loop, this line checks two things:
                    // It checks if the position below the current tile is empty (0).
                    // It also checks if the number below is the same as the current number.
                if (board[r + 1][c] === 0 || board[r + 1][c] === board[r][c]) {
                    return true;
                }
            }
        }
    }
    return false;
}