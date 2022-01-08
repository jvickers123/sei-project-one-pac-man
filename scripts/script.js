function init() {
  //elements
  //  target grid
  const grid = document.querySelector('#grid')
  //  target score display
  const scoreDisplay = document.querySelector('#score')
  //  target high score display
  const highScoreDisplay = document.querySelector('#high-score')
  //  target lives 
  const livesDisplay = document.querySelector('#lives')
  //  target start button
  const startBtn = document.querySelector('#start-game')

  //variables
  //  const width
  const width = 21
  const height = 21
  //  const cell count
  const cellCount = width * height
  //  const cells - empty array
  const cells = []

  //  let score = 0
  let score = 0
  //  let high score = local storage
  //  let lives = 3
  let lives = 3
  

  //classes
  //  const wall class 
  const wallClass = 'wall'
  const gateClass = 'gate'
  //  food class
  const foodClass = 'food'
  //  ghost class
  const ghostClass = 'ghost'
  //  pac man class
  const pacManClass = 'pac-man'

  //save board arrays
  // const board1 = []
  //character movement variables
  const wallsStartingPosition = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 31, 40, 43, 45, 46, 48, 49, 50, 52, 54, 55, 56, 58, 59, 61, 64, 82, 85, 87, 88, 90, 92, 93, 94, 95, 96, 98, 100, 101, 103, 106, 111, 115, 119, 124, 127, 128, 129, 130, 132, 133, 134, 136, 138, 139, 140, 142, 143, 144, 145, 151, 153, 161, 163, 168, 169, 170, 171, 172, 174, 176, 177, 179, 180, 182, 184, 185, 186, 187, 188, 197, 201, 210, 211, 212, 213, 214, 216, 218, 219, 220, 221, 222, 224, 226, 227, 228, 229, 230, 235, 237, 245, 247, 253, 254, 255, 256, 258, 260, 261, 262, 263, 264, 266, 268, 269, 270, 271, 274, 283, 292, 295, 297, 298, 300, 301, 302, 304, 306, 307, 308, 310, 311, 313, 316, 319, 331, 334, 337, 338, 340, 342, 344, 345, 346, 347, 348, 350, 352, 354, 355, 358, 363, 367, 371, 376, 379, 381, 382, 383, 384, 385, 386, 388, 390, 391, 392, 393, 394, 395, 397, 400, 418, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 434, 435, 436, 437, 438, 439]
  const gate = 178
 
  //  const pac man starting position
  const pacManStartingPosition = 325
  //  const ghosts starting positions - an array
  const ghostsStartingPosition = [157, 198, 199, 200]
  //  let pac man current position = pac man starting position
  const pacManCurrentPosition = pacManStartingPosition
  //  let ghosts current position = ghosts starting position - an array
  

  //functions
  //  start btn html = start
  startBtn.innerHTML = 'Start Game!'

  //  set game
  //    scoreDOM = score
  //    highscoreDOM = highscore
  //    make grid()

  //make grid
  function makeGrid() {
    // make grid based on width
    grid.style.width = `${width * 1.5}rem`
    grid.style.height = `${height * 1.5}rem`
    grid.style.gridTemplateRows = `repeat(${height}, 1fr)`
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`
    // for loop to create cells
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement('div')
      //make id of row and column position and x and y value in div
      const cellXPosition = i % width
      const cellYPosition = Math.floor(i / width)
      cell.setAttribute('x', cellXPosition)
      cell.setAttribute('y', cellYPosition)
      cell.id = i
      grid.appendChild(cell)
      // push to empty cells array
      cells.push(cell)
      // console.log(cell)
    }
    addPacMan(pacManCurrentPosition)
    wallsStartingPosition.forEach(position => addWalls(position))
    addGate(gate)
    addFood()
    ghostsStartingPosition.forEach((position, index) => addGhost(position, index))
    //    call functions to add pac man and the ghosts 
  }
  makeGrid()


  //  playgame()
  //    to wrap around all the game play functions

  function addWalls(position) {
    cells[position].classList.add(wallClass)
  }
  
  function addGate(position) {
    cells[position].classList.add(gateClass)
  }

  function addFood() {
    //filter cells array by if they do not contain wall class and they are not on the edge or in middle
    const foodArray = cells.filter(cell => {
      //get x and y coordinate for each cell
      const cellX = parseInt(cell.getAttribute('x'))
      const cellY = parseInt(cell.getAttribute('y'))

      const containsWall = cell.classList.contains('wall')
      const outside = (cellX === 0) || (cellX === width - 1)
      const middle = cellX >= (width / 7 * 2) && cellX <= (width / 3 * 2) && cellY >= (width / 3) && (cellY <= (width / 7 * 4))
      const extraSideSection = ( cellX <= 4 || cellX >= (width - 5) ) && ( cellY >= 6 && cellY <= 12 )

      if (!containsWall && !outside && !middle && !extraSideSection) {
        return true
      }
    })
    foodArray.forEach(cell => cell.classList.add(foodClass))
    // console.log(foodArray[60], foodArray[60].getAttribute('x'))
  }

  //  add pac man(position)
  function addPacMan(position) {
    //add pac man class to cells[position]
    cells[position].classList.add(pacManClass)
  }

  //  remove pac man(position)
  //    remove pac man class to cells[position]

  //  add ghosts (position, index)
  function addGhost (position, index) {
    // see which ghost to add
    let colour
    if (index % 4 === 0) {
      colour = 'red'
    } else if (index % 4 === 1) {
      colour = 'cyan' 
    } else if (index % 4 === 2) {
      colour = 'pink'
    } else if (index % 4 === 3) {
      colour = 'orange'
    }
    cells[position].classList.add(ghostClass, colour)
  }

  //  remove ghosts(position)
  //    remove ghost class to cells[position]

  //  move pac man(e)
  //    const keys based on keycode to equal up down left right
  //    remove pac man(pac man current position)
  //     if to check direction of key, whether the next square is a wall or edge of grid
  //       pac man current position row or column change
  //    add pac man(pac man current position)
  //    if current position has food class
  //      add score
  //      remove food class
  //      update score DOM
  //    if current position has ghost class
  //      lives--
  //      livesDOM = lives
  //      if lives === 0 
  //         end game(lose)
  //    loop through cells array
  //      if no cells contain food
  //      end game (win)

  //  set Interval - move ghosts()
  //    loop through array:
  //    removeghost()
  //      if to check relative position of ghost to pac man && if square below is wall
  //        will need default moving if neither conditions are met
  //        ghost current postion change row and column
  //      add ghost(ghost current position)
  //    

  //  end game(result)
  //    if result === 'lose'
  //      alert you lost! and score
  //    if result === 'win'
  //      alert = you win and score
  //    update local storage if score higher than highscore
  //    start btn.inner html = 'restart'

  // can have an add wall function
  /*function saveBoard(board) {
    for (let i = 0; i < cells.length; i++) {
      board.push(cells[i])
    }
  }
  saveBoard(board1) /*
  // }


  //eventlisteners
  //  start button (playame)
  //  keydown (move pac man)


  //EXTRA -----

  // move to other side if gap in the middle
  //   check to see in all movement if next cell is outside grid
  //      current position is + width or - width

  //flashy food function
  //    triggered with extra check in pac man move if same square as flashy food
  //    will need extra check in ghost move function to check if they are blue or not
  //    then update movement away from pac man
  //   will need extra check if pacman is in same cell of blue ghost in move pac man
  //      if so need to ghost to middle and add score
  //    set timeout for blue class to be removed

  //extra boards
  //  once const cells array has been filled with starting classes 
  //    hard code this array into something called board 1
  //  do this for more boards and when restart game is pressed run function to update cells and starting position based on array
}

window.addEventListener('DOMContentLoaded', init)