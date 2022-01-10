function init() {
  //elements
  const grid = document.querySelector('#grid')
  const scoreDisplay = document.querySelector('#score')
  const highScoreDisplay = document.querySelector('#high-score')
  const livesDisplay = document.querySelector('#lives')
  const startBtn = document.querySelector('#start-game')

  //variables
  const width = 21
  const height = 21
  const cellCount = width * height
  const cells = []

  let score = 0
  //  let high score = local storage
  let lives = 3
  

  //classes
  const wallClass = 'wall'
  const gateClass = 'gate'
  const foodClass = 'food'
  const ghostClass = 'ghost'
  const pacManClass = 'pac-man'

  //save board arrays
  // const board1 = []
  //character movement variables
  const wallsStartingPosition = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 31, 40, 43, 45, 46, 48, 49, 50, 52, 54, 55, 56, 58, 59, 61, 64, 82, 85, 87, 88, 90, 92, 93, 94, 95, 96, 98, 100, 101, 103, 106, 111, 115, 119, 124, 127, 128, 129, 130, 132, 133, 134, 136, 138, 139, 140, 142, 143, 144, 145, 151, 153, 161, 163, 168, 169, 170, 171, 172, 174, 176, 177, 178, 179, 180, 182, 184, 185, 186, 187, 188, 197, 201, 210, 211, 212, 213, 214, 216, 218, 219, 220, 221, 222, 224, 226, 227, 228, 229, 230, 235, 237, 245, 247, 253, 254, 255, 256, 258, 260, 261, 262, 263, 264, 266, 268, 269, 270, 271, 274, 283, 292, 295, 297, 298, 300, 301, 302, 304, 306, 307, 308, 310, 311, 313, 316, 319, 331, 334, 337, 338, 340, 342, 344, 345, 346, 347, 348, 350, 352, 354, 355, 358, 363, 367, 371, 376, 379, 381, 382, 383, 384, 385, 386, 388, 390, 391, 392, 393, 394, 395, 397, 400, 418, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439]
  const gate = 178
 
  const pacManStartingPosition = 325
  const ghostsStartingPosition = [157, 198, 199, 200]
  let pacManCurrentPosition
  const ghostsCurrentPositon = []
  const ghostDirection = []
  let playing = false
  

  //functions
  //  start btn html = start
  startBtn.innerHTML = 'Start Game!'

  //  set game
  //    scoreDOM = score
  
  //    highscoreDOM = highscore
  //    make grid()

  const addPacMan = (position) => cells[position].classList.add(pacManClass) //  add pac man class to current position
  const addGate = (position) => cells[position].classList.add(gateClass)
  const addWalls = (position) => cells[position].classList.add(wallClass)
  const removePacMan = (position) => cells[position].classList.remove(pacManClass) //  remove pac man class from current position

  const addFood = () => {
    const foodArray = cells.filter(cell => { //filter cells array by if they do not contain wall class and they are not on the edge or in middle
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
  }

  const addGhost = (position, index) => {
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

  const removeGhosts = (position, index) => {
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
    cells[position].classList.remove(ghostClass, colour)
  }

  const setGame = () => {
    //reset game
    scoreDisplay.innerText = score
    livesDisplay.innerText = lives
    pacManCurrentPosition = pacManStartingPosition
    ghostDirection.splice(0) //clears ghost direction
    ghostDirection.push(null) // adds direction for first ghost
    ghostsCurrentPositon.splice(0)
    for (let i = 0; i < cellCount; i++) { // remove previous cells from grid
      const cell = document.querySelector('.cell')
      cell ? grid.removeChild(cell) : null
    }
    cells.splice(0) // empty cells array

    //create grid
    grid.style.width = `${width * 1.25}rem`// make grid based on width
    grid.style.height = `${height * 1.25}rem`
    grid.style.gridTemplateRows = `repeat(${height}, 1fr)`
    grid.style.gridTemplateColumns = `repeat(${width}, 1fr)`

    // create cells
    for (let i = 0; i < cellCount; i++) { 
      const cell = document.createElement('div')
      const cellXPosition = i % width //get x and y coordinates of cell
      const cellYPosition = Math.floor(i / width)
      cell.setAttribute('x', cellXPosition) // set coordinates as attributes to cell
      cell.setAttribute('y', cellYPosition)
      cell.id = i
      cell.classList.add('cell')
      grid.appendChild(cell)
      cells.push(cell)
    }
    //add classes
    addPacMan(pacManCurrentPosition)
    wallsStartingPosition.forEach(position => addWalls(position))
    addGate(gate)
    addFood()
    ghostsStartingPosition.forEach((position, index) => addGhost(position, index))
    ghostsStartingPosition.forEach(position => ghostsCurrentPositon.push(position))// let current position = starting position
  }
  setGame()
  
  const checkLives = (cell, checkClass) => {
    if (cell.classList.contains(checkClass)) {
      lives--
      livesDisplay.innerHTML = lives
    }
    lives < 0 ? endGame('lose') : null
  }

  //  move pac man(e)
  function movePacMan(e) {
    if (playing === true) {
      // const keys based on keycode to equal up down left right
      const key = e.keyCode
      const right = 39
      const left = 37
      const up = 38
      const down = 40
      removePacMan(pacManCurrentPosition)
      // if to check direction of key, whether the next square is a wall or edge of grid
      if (key === right && !cells[pacManCurrentPosition + 1].classList.contains(wallClass)) {
        pacManCurrentPosition++
      } else if (key === left && !cells[pacManCurrentPosition - 1].classList.contains(wallClass)) {
        pacManCurrentPosition--
      } else if (key === up && !!cells[pacManCurrentPosition - width] && !cells[pacManCurrentPosition - width].classList.contains(wallClass)) {
        pacManCurrentPosition -= width
      } else if (key === down && !!cells[pacManCurrentPosition + width] && !cells[pacManCurrentPosition + width].classList.contains(wallClass)) {
        pacManCurrentPosition += width
      //check to see if next square is off grid
      } else if (key === right && cells[pacManCurrentPosition + 1].getAttribute('y') !== cells[pacManCurrentPosition].getAttribute('y')) { 
        pacManCurrentPosition -= width - 1
      } else if (key === left && cells[pacManCurrentPosition - 1].getAttribute('y') !== cells[pacManCurrentPosition].getAttribute('y')) { 
        pacManCurrentPosition += width - 1
      } else if (key === up && !cells[pacManCurrentPosition - width]) { 
        pacManCurrentPosition = cellCount - (width - pacManCurrentPosition)
      } else if (key === down && !cells[pacManCurrentPosition + width]) { 
        pacManCurrentPosition = width - (cellCount - pacManCurrentPosition)
      }
      addPacMan(pacManCurrentPosition)
      const currentCell = cells[pacManCurrentPosition]
      // if current position has food class
      if (currentCell.classList.contains(foodClass)) {
        currentCell.classList.remove(foodClass)
        score += 100
        scoreDisplay.innerText = score
      }
      // if current position has ghost class
      checkLives(currentCell, ghostClass)
      cells.some(cell => cell.classList.contains(foodClass)) ? null : endGame('win')
    }
  }
  
  const  moveGhosts = () =>{
    const directionOptions = ['up', 'down', 'left', 'right']
    ghostsCurrentPositon.forEach((position, index) => {
      removeGhosts(position, index)
      const pickDirection = (direction) => {
        if (direction === null) {
          const option = directionOptions[Math.floor(Math.random() * 4)] //picks random direction
          //if to check if square below is wall
          if (option === 'right') {
            !cells[position + 1].classList.contains(wallClass) ? ghostDirection[index] = 'right' : pickDirection(null)
          } else if (option === 'left') {
            !cells[position - 1].classList.contains(wallClass) ? ghostDirection[index] = 'left' : pickDirection(null)
          } else if (option === 'up') {
            !cells[position - width].classList.contains(wallClass) ? ghostDirection[index] = 'up' : pickDirection(null)
          } else if (option === 'down') {
            !cells[position + width].classList.contains(wallClass) ? ghostDirection[index] = 'down' : pickDirection(null)
          }          
        }
        return direction
      }
      pickDirection(ghostDirection[index])
      const movingGhost = (direction) => { //changes current position unless next cell is wall otherwise picks a new direction 
        if (direction === 'right') {
          !cells[position + 1].classList.contains(wallClass) ? ghostsCurrentPositon[index]++ : pickDirection(null)
        } else if (direction === 'left') {
          !cells[position - 1].classList.contains(wallClass) ? ghostsCurrentPositon[index]-- : pickDirection(null)
        } else if (direction === 'up') {
          !cells[position - width].classList.contains(wallClass) ? ghostsCurrentPositon[index] -= width : pickDirection(null)
        } else if (direction === 'down') {
          !cells[position + width].classList.contains(wallClass) ? ghostsCurrentPositon[index] += width : pickDirection(null)
        }
        addGhost(ghostsCurrentPositon[index], index)
      }
      movingGhost(ghostDirection[index])
      checkLives(cells[ghostsCurrentPositon[index]], pacManClass)
    })
  }

  let moveGhostInterval //give intervals global scope so can be stopped after end game
  let releaseGhostsInterval
  let releaseGhostCount = 1 //give global scope so it can be reset in endgame

  const releaseGhosts = () => {
    if (releaseGhostCount < ghostsStartingPosition.length) {// if count is lower than no. ghosts
      const index = releaseGhostCount
      removeGhosts(ghostsCurrentPositon[index], index)
      ghostsCurrentPositon[index] = ghostsStartingPosition[0] // start wherever first ghost started
      addGhost(ghostsCurrentPositon[index], index)
      ghostDirection.push(null)
      releaseGhostCount++
    } else {
      clearInterval(releaseGhostsInterval) // stop function when all ghosts have been released
    }
    
  }

  const playGame = () => {
    playing = true
    moveGhostInterval = setInterval(moveGhosts, 500) // start moving ghosts
    releaseGhostsInterval = setInterval(releaseGhosts, 1000 * 7) // release ghosts every 7 seconds
  }
    
  
  //  end game(result)
  const endGame = (result) => {
    clearInterval(moveGhostInterval)
    clearInterval(releaseGhostsInterval)
    result === 'lose' ?  alert('you lose', score) : alert('you win', score)
    startBtn.innerText = 'restart'
    removePacMan(pacManCurrentPosition)
    ghostsCurrentPositon.forEach((position, index) => removeGhosts(position, index))
    // ghostsCurrentPositon
    lives = 3
    score = 0
    playing = false
    releaseGhostCount = 1
    setGame()
    
  }

  // can have an add wall function
  // function saveBoard(board) {
  //     for (let i = 0; i < cells.length; i++) {
  //       board.push(cells[i])
  //     }
  //   }
  //   saveBoard(board1) 

  // }


  //eventlisteners
  //  start button (playame)
  //  keydown (move pac man)
  document.addEventListener('keydown', movePacMan)
  startBtn.addEventListener('click', playGame)


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