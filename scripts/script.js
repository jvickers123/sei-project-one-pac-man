function init() {
  //elements
  const grid = document.querySelector('#grid')
  const scoreDisplay = document.querySelector('#score')
  const highScoreDisplay = document.querySelector('#high-score')
  const livesDisplay = document.querySelector('#lives-container')
  const startBtn = document.querySelector('#start-game')
  const btncontainer = document.querySelector('#buttons-container')
  const userNameDisplay = document.querySelector('#username')
  // const leaderBoardDisplay = document.querySelector('#leaderboard')
  //target title and display containers 
  const scoreContainer = document.querySelector('#scores-container')
  //target form
  const form = document.querySelector('form')
  //target submit
  const submitBtn = document.querySelector('#submit')

  //variables
  let width
  let height
  let cellCount
  const cells = []
  let score = 0
  // let highScore = localStorage.getItem('highScore')
  // 'username,3,username2,4' //
  const leaderBoard = window.localStorage.getItem('leaderboard')
  let lives
  startBtn.innerHTML = 'Start!'
  const boards = [] //array of different boards
  let level = 0
  let difficulty = 4
  let userName 

  //timerouts and intervals
  let moveGhostInterval //give intervals global scope so can be stopped after end game
  let releaseGhostsInterval
  let releaseGhostCount//give global scope so it can be reset in endgame
  let removeFrightenedTimer

  
  //classes
  const wallClass = 'wall'
  const gateClass = 'gate'
  const foodClass = 'food'
  const bigFoodClass = 'big-food'
  const ghostClass = 'ghost'
  const pacManClass = 'pac-man'
  const frightenedClass = 'frightened'
  const livesClass = 'lives'

  //leaderBoard
  //create variables for leaderboard
 
  //character movement variables
  let wallsStartingPosition//[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 31, 40, 43, 45, 46, 48, 49, 50, 52, 54, 55, 56, 58, 59, 61, 64, 82, 85, 87, 88, 90, 92, 93, 94, 95, 96, 98, 100, 101, 103, 106, 111, 115, 119, 124, 127, 128, 129, 130, 132, 133, 134, 136, 138, 139, 140, 142, 143, 144, 145, 151, 153, 161, 163, 168, 169, 170, 171, 172, 174, 176, 177, 178, 179, 180, 182, 184, 185, 186, 187, 188, 197, 201, 210, 211, 212, 213, 214, 216, 218, 219, 220, 221, 222, 224, 226, 227, 228, 229, 230, 235, 237, 245, 247, 253, 254, 255, 256, 258, 260, 261, 262, 263, 264, 266, 268, 269, 270, 271, 274, 283, 292, 295, 297, 298, 300, 301, 302, 304, 306, 307, 308, 310, 311, 313, 316, 319, 331, 334, 337, 338, 340, 342, 344, 345, 346, 347, 348, 350, 352, 354, 355, 358, 363, 367, 371, 376, 379, 381, 382, 383, 384, 385, 386, 388, 390, 391, 392, 393, 394, 395, 397, 400, 418, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439]
  let gate // 178
  let bigFoodStartingPosition //[44, 60, 317, 333]
  let pacManStartingPosition  //325
  let ghostsStartingPosition //[157, 198, 199, 200]
  let pacManCurrentPosition
  const ghostsCurrentPositon = []
  const ghostDirection = []
  let playing = false
  let chasePacMan = true


  // new Board Class
  class Board {
    constructor(width, height, walls, gate, bigFood, pacMan, ghosts) {
      this.width = width
      this.height = height
      this.walls = walls
      this.gate = gate
      this.bigFood = bigFood
      this.pacMan = pacMan
      this.ghosts = ghosts
    }
    pushBoard() {
      boards.push(this)
    }
  }

  //boards
  const board0 = new Board(21, 21,[ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 22, 31, 40, 43, 45, 46, 48, 49, 50, 52, 54, 55, 56, 58, 59, 61, 64, 82, 85, 87, 88, 90, 92, 93, 94, 95, 96, 98, 100, 101, 103, 106, 111, 115, 119, 124, 127, 128, 129, 130, 132, 133, 134, 136, 138, 139, 140, 142, 143, 144, 145, 151, 153, 161, 163, 168, 169, 170, 171, 172, 174, 176, 177, 178, 179, 180, 182, 184, 185, 186, 187, 188, 197, 201, 210, 211, 212, 213, 214, 216, 218, 219, 220, 221, 222, 224, 226, 227, 228, 229, 230, 235, 237, 245, 247, 253, 254, 255, 256, 258, 260, 261, 262, 263, 264, 266, 268, 269, 270, 271, 274, 283, 292, 295, 297, 298, 300, 301, 302, 304, 306, 307, 308, 310, 311, 313, 316, 319, 331, 334, 337, 338, 340, 342, 344, 345, 346, 347, 348, 350, 352, 354, 355, 358, 363, 367, 371, 376, 379, 381, 382, 383, 384, 385, 386, 388, 390, 391, 392, 393, 394, 395, 397, 400, 418, 421, 422, 423, 424, 425, 426, 427, 428, 429, 430, 431, 432, 433, 434, 435, 436, 437, 438, 439], 178, [44, 60, 317, 333], 325, [157, 198, 199, 200]  )
  board0.pushBoard()
  const board1 = new Board(35, 13, [1, 2, 3, 4, 8, 10, 15, 17, 19, 24, 26, 30, 31, 32, 33, 36, 39, 40, 41, 42, 43, 45, 46, 47, 48, 49, 50, 52, 54, 55, 56, 57, 58, 59, 61, 62, 63, 64, 65, 68, 71, 87, 89, 103, 106, 107, 108, 109, 111, 112, 114, 116, 117, 118, 122, 123, 124, 126, 127, 129, 131, 135, 136, 137, 138, 144, 146, 149, 152, 162, 164, 166, 167, 168, 170, 175, 176, 177, 178, 179, 181, 183, 184, 189, 190, 191, 192, 193, 194, 195, 199, 202, 205, 206, 207, 208, 209, 224, 230, 233, 234, 235, 237, 245, 246, 247, 248, 249, 251, 252, 254, 255, 259, 260, 261, 262, 263, 264, 265, 275, 276, 277, 278, 279, 284, 287, 289, 290, 292, 302, 304, 306, 307, 308, 310, 316, 317, 318, 319, 321, 322, 324, 325, 327, 328, 330, 331, 332, 333, 334, 336, 337, 341, 342, 343, 345, 346, 347, 348, 351, 383, 386, 389, 390, 391, 392, 393, 395, 396, 397, 398, 399, 400, 402, 404, 405, 406, 407, 408, 409, 411, 412, 413, 414, 415, 418, 421, 422, 423, 424, 428, 430, 435, 437, 439, 444, 446, 450, 451, 452, 453], 192, [88, 110, 355, 379], 367, [157, 225, 226, 227, 228, 229 ])
  board1.pushBoard()
  const board2 = new Board(31, 21, [4, 5, 6, 7, 8, 9, 10, 11, 14, 16, 19, 20, 21, 22, 23, 24, 25, 26, 32, 33, 34, 35, 42, 43, 44, 45, 47, 48, 49, 50, 57, 58, 59, 60, 63, 68, 69, 71, 83, 85, 86, 91, 94, 96, 97, 102, 104, 105, 106, 107, 108, 109, 110, 111, 112, 114, 119, 120, 122, 125, 127, 128, 131, 132, 133, 139, 145, 146, 147, 150, 151, 153, 156, 164, 166, 168, 170, 172, 174, 176, 184, 187, 188, 189, 190, 192, 193, 197, 199, 201, 203, 205, 209, 210, 212, 213, 214, 215, 221, 230, 234, 243, 248, 249, 250, 251, 252, 254, 255, 257, 258, 260, 261, 262, 263, 264, 265, 266, 268, 269, 271, 272, 274, 275, 276, 277, 278, 285, 289, 291, 297, 299, 303, 310, 311, 312, 313, 314, 316, 317, 319, 320, 322, 323, 324, 325, 326, 327, 328, 330, 331, 333, 334, 336, 337, 338, 339, 340, 345, 348, 350, 362, 364, 367, 373, 374, 375, 376, 383, 384, 385, 386, 387, 388, 389, 390, 391, 398, 399, 400, 401, 404, 406, 409, 410, 411, 412, 422, 424, 425, 426, 427, 430, 432, 435, 437, 439, 440, 441, 445, 447, 448, 449, 451, 458, 459, 461, 463, 466, 474, 476, 478, 480, 482, 483, 485, 486, 494, 497, 498, 499, 500, 502, 503, 505, 507, 509, 514, 516, 519, 520, 522, 524, 525, 528, 530, 531, 533, 534, 536, 537, 538, 540, 541, 542, 543, 544, 545, 547, 548, 550, 551, 553, 554, 556, 559, 579, 587, 590, 591, 592, 593, 594, 595, 596, 597, 598, 599, 600, 601, 602, 603, 605, 606, 607, 608, 612, 613, 614, 615, 616, 617, 618, 634, 636, 639, 640, 641, 642, 643], 263, [429, 407, 115, 101], 232, [356, 292, 293, 294, 295, 296 ]  )
  board2.pushBoard()
  const blankBoard = new Board(21, 21, [], 0, [], 0, [])
  blankBoard.pushBoard()
  
  //functions

  const addPacMan = (position) => cells[position].classList.add(pacManClass) //  add pac man class to current position
  const addGate = (position) => cells[position].classList.add(gateClass)
  const addWalls = (position) => cells[position].classList.add(wallClass)
  const removePacMan = (position) => {
    cells[position].classList.remove(pacManClass)//  remove pac man class from current position
    cells[position].style.removeProperty('transform') //removes rotate background style from cell when pacman leaves
  } 
  const addBigFood = (position) => cells[position].classList.add(bigFoodClass)

  const addFood = () => {
    const foodArray = cells.filter(cell => { //filter cells array by if they do not contain wall class and they are not on the edge or in middle
      const cellX = parseInt(cell.getAttribute('x'))
      const cellY = parseInt(cell.getAttribute('y'))
      const containsWall = cell.classList.contains('wall')
      const outside = (cellX === 0) || (cellX === width - 1) || (cellY === 0) || (cellY === height - 1)
      const middle = cellX >= ((width / 2) - 5) && cellX <= ((width / 2) + 4) && cellY >= ((height / 2) - 4) && (cellY <= ((height / 2) + 2))
      const extraSideSection = ( cellX <= 4 || cellX >= (width - 5) ) && ( cellY >= (height / 2) - 4) && (cellY <= (height / 2) + 2)
      if (!containsWall && !outside && !middle && !extraSideSection) {
        return true
      }
    })
    foodArray.forEach(cell => cell.classList.add(foodClass))
  }

  const addGhost = (position, index, frightened) => {
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
    frightened ? cells[position].classList.add(frightenedClass) : null
  }

  const removeGhosts = (position, index) => {
    // frightened ? console.log('removeghosts arguments, ', position, index, cells[position].classList) : null
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
    cells[position].classList.remove(ghostClass, colour, frightenedClass)
  }

  const frightenedGhosts = () => {
    let alreadyFrightened = false
    chasePacMan = false
    cells.some(cell => cell.classList.contains('frightened')) ? alreadyFrightened = true : null
    alreadyFrightened ? clearTimeout(removeFrightenedTimer) : null
    ghostsCurrentPositon.forEach(position => cells[position].classList.add(frightenedClass))// add frightened class to ghosts
    const removeFrightenedClass = () => {
      ghostsCurrentPositon.forEach(position => cells[position].classList.remove(frightenedClass))
      chasePacMan = true // move back to ghosts chasing pacman
    }
    console.log('already frightened', alreadyFrightened)
    removeFrightenedTimer = setTimeout(removeFrightenedClass, 1000 * 5)
  }

  const resetGame = () => {
    //reset game
    clearInterval(moveGhostInterval)
    clearInterval(releaseGhostsInterval)
    for (let i = 0; i < lives; i++) { //reset life display
      const life = document.querySelector('.lives')
      livesDisplay.removeChild(life)
    }
    ghostDirection.splice(0) //clears ghost direction
    ghostDirection.push(null) // adds direction for first ghost
    ghostsCurrentPositon.splice(0)
    for (let i = 0; i < cellCount; i++) { // remove previous cells from grid
      const cell = document.querySelector('.cell')
      cell ? grid.removeChild(cell) : null
    }
    cells.splice(0) // empty cells array
  }

  const loadLevel = () => {
    resetGame()
    //set variables
    width = boards[level].width
    height = boards[level].height
    cellCount = width * height
    wallsStartingPosition = boards[level].walls
    gate = boards[level].gate
    bigFoodStartingPosition = boards[level].bigFood
    pacManStartingPosition = boards[level].pacMan
    ghostsStartingPosition = boards[level].ghosts
    releaseGhostCount = 1
    lives = 5
    highScore = localStorage.getItem('highScore')
    pacManCurrentPosition = pacManStartingPosition

    //set display
    scoreDisplay.innerText = score
    highScoreDisplay.innerText = highScore
    for (let i = 1; i <= lives; i++) { //create lives display
      const life = document.createElement('div')
      life.classList.add(livesClass)
      livesDisplay.appendChild(life)
    }
    userNameDisplay.innerText = userName

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
    bigFoodStartingPosition.forEach(position => addBigFood(position))
    addFood()
    ghostsStartingPosition.forEach((position, index) => addGhost(position, index))
    ghostsStartingPosition.forEach(position => ghostsCurrentPositon.push(position))// let current position = starting position
  }
  // level = 3
  // loadLevel()

  const collision = (cell, checkClass, frightened) => {
    if (cell.classList.contains(checkClass)) {
      if (frightened) {
        score += 250
        const index = ghostsCurrentPositon.indexOf(parseInt(cell.id))
        removeGhosts(parseInt(cell.id), index)
        ghostsCurrentPositon[index] = ghostsStartingPosition[0]// send to start
        addGhost(ghostsCurrentPositon[index], index, true)
      } else {
        lives--
        removePacMan(pacManCurrentPosition)
        pacManCurrentPosition = pacManStartingPosition
        addPacMan(pacManCurrentPosition)
      }
      const life = document.querySelector('.lives')
      lives < 0 ? endGame('lose') : livesDisplay.removeChild(life)
    }
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
      let degrees
      removePacMan(pacManCurrentPosition)
      // if to check direction of key, whether the next square is a wall or edge of grid
      if (key === right && !cells[pacManCurrentPosition + 1].classList.contains(wallClass)) {
        pacManCurrentPosition++
        degrees = 0
      } else if (key === left && !cells[pacManCurrentPosition - 1].classList.contains(wallClass)) {
        pacManCurrentPosition--
        degrees = 180
      } else if (key === up && !!cells[pacManCurrentPosition - width] && !cells[pacManCurrentPosition - width].classList.contains(wallClass)) {
        pacManCurrentPosition -= width
        degrees = 270
      } else if (key === down && !!cells[pacManCurrentPosition + width] && !cells[pacManCurrentPosition + width].classList.contains(wallClass)) {
        pacManCurrentPosition += width
        degrees = 90
      //check to see if next square is off grid and then move to other side of screen
      } else if (key === right && cells[pacManCurrentPosition + 1].getAttribute('y') !== cells[pacManCurrentPosition].getAttribute('y')) { 
        pacManCurrentPosition -= width - 1
        degrees = 0
      } else if (key === left && cells[pacManCurrentPosition - 1].getAttribute('y') !== cells[pacManCurrentPosition].getAttribute('y')) { 
        pacManCurrentPosition += width - 1
        degrees = 180
      } else if (key === up && !cells[pacManCurrentPosition - width]) { 
        pacManCurrentPosition = cellCount - (width - pacManCurrentPosition)
        degrees = 270
      } else if (key === down && !cells[pacManCurrentPosition + width]) { 
        pacManCurrentPosition = width - (cellCount - pacManCurrentPosition)
        degrees = 90
      }
      addPacMan(pacManCurrentPosition)
      cells[pacManCurrentPosition].style.transform = `rotate(${degrees}deg)`
      const currentCell = cells[pacManCurrentPosition]
      // if current position has food class
      if (currentCell.classList.contains(foodClass)) {
        currentCell.classList.remove(foodClass)
        score += (20 * difficulty)
        scoreDisplay.innerText = score
      }
      // bigFood chek
      if (currentCell.classList.contains(bigFoodClass)) {
        frightenedGhosts()
        currentCell.classList.remove(bigFoodClass)
      }
      // if current position has ghost class
      let frightened
      currentCell.classList.contains(frightenedClass) ? frightened = true : frightened = false 
      collision(currentCell, ghostClass, frightened)
      
      cells.some(cell => cell.classList.contains(foodClass)) ? null : endLevel('win')
    }
  }
  
  const  moveGhosts = () =>{
    const directionOptions = ['up', 'down', 'left', 'right']
    ghostsCurrentPositon.forEach((position, index) => {
      let frightened
      cells[position].classList.contains(frightenedClass) ? frightened = true : frightened = false //check if frightened class is on cell
      removeGhosts(position, index) //: removeGhosts(position)
      const pickDirection = (direction) => {
        if (direction === null) {
          if (chasePacMan) { //ghosts move towards pacman
            // pac coordinates
            const pacX = parseInt(cells[pacManCurrentPosition].getAttribute('x'))
            const pacY = parseInt(cells[pacManCurrentPosition].getAttribute('y'))
            //ghost coordinates
            const ghostX = parseInt(cells[position].getAttribute('x'))
            const ghostY = parseInt(cells[position].getAttribute('y'))
            
            if (pacX >= ghostX && !cells[position + 1].classList.contains(wallClass)) {// if pac below ghost && cell to right doesn't contain wall then direction = 'right otherwise try another direction
              ghostDirection[index] = 'right'
            } else if (pacY >= ghostY && !cells[position + width].classList.contains(wallClass)) {
              ghostDirection[index] = 'down'
            } else if (pacX <= ghostX && !cells[position - 1].classList.contains(wallClass)) {
              ghostDirection[index] = 'left'
            } else if (pacY <= ghostY && !cells[position - width].classList.contains(wallClass)) {
              ghostDirection[index] = 'up'
            }  else {
              chasePacMan = false // if there is no way to get near pac without hitting a wall then pick direction with random choice
              pickDirection(null)
              chasePacMan = true // return to moving towards pac man
            }
          } else {
            const option = directionOptions[Math.floor(Math.random() * 4)] //picks random direction
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
      }
      movingGhost(ghostDirection[index])
      // cells[position].style.transform = 'rotate(0)'
      frightened ? addGhost(ghostsCurrentPositon[index], index, true) : addGhost(ghostsCurrentPositon[index], index, false)
      collision(cells[position], pacManClass, frightened)
    })
  }

  const releaseGhosts = () => {
    if (releaseGhostCount < ghostsStartingPosition.length) {// if count is lower than no. ghosts
      const index = releaseGhostCount
      let frightened
      cells[ghostsCurrentPositon[index]].classList.contains(frightenedClass) ? frightened = true : frightened = false
      removeGhosts(ghostsCurrentPositon[index], index)
      ghostsCurrentPositon[index] = ghostsStartingPosition[0] // start wherever first ghost started
      addGhost(ghostsCurrentPositon[index], index, frightened)
      ghostDirection.push(null)
      releaseGhostCount++
    } else {
      clearInterval(releaseGhostsInterval) // stop function when all ghosts have been released
    }
    
  }

  const playGame = () => {
    playing = true
    moveGhostInterval = setInterval(moveGhosts, 100 * (10 - difficulty)) // start moving ghosts
    releaseGhostsInterval = setInterval(releaseGhosts, 1000 * 7) // release ghosts every 7 seconds
    btncontainer.removeChild(startBtn)// remove start button
  }

  // check leaderboard
  // const updateLeaderBoard = (username, score) => {
  //   // for (let i = 0; i < leaderBoard.length; i++) {
  //   //   //target score
  //   //   if (leaderBoard[i]) {
  //   //     const leaderScore = parseInt(leaderBoard[i].split(' ')[1])
  //   //     if (score > leaderScore) {
  //   //       localStorage.setItem(`leaderBoard${i}`, `${username} ${score}`)
  //   //       return
  //   //     }
  //   //   } else {
  //   //     localStorage.setItem(`leaderBoard${i}`, `${username} ${score}`)
  //   //   }

  //   //   //check if greater than
  //   //   // score > leader
  //   //   //if yes then update storage
  //   //   //
  //   // }

  //   //create an array that holds top five scores in order
  //   const top5Array = leaderBoard.map(item => {
  //     if (item && !isNaN(item[1])) {
  //       const stringArr = item.split(' ')
  //       const valuePairs = []
  //       valuePairs.push(stringArr[0])
  //       valuePairs.push(parseInt(stringArr[1]))
  //       return valuePairs
  //     } else {
  //       return [' ', 0]
  //     }
  //   })
  //   const orderedTop5 = top5Array.sort((a, b) => b[1] - a[1])
  //   console.log(orderedTop5)
  //   // if score above bottom score // pop and push
  //   if (score > orderedTop5[4][1] || isNaN(orderedTop5[4][1])) {
  //     orderedTop5.pop()
  //     const newArr = [username, score]
  //     orderedTop5.push(newArr)
  //   }
  //   // put scores in order
  //   const newOrderedTop5 = orderedTop5.sort((a, b) => b[1] - a[1])
  //   // update local storage
  //   newOrderedTop5.forEach((item, index) => {
  //     window.localStorage.setItem(`leaderBoard${index}`, `${item[0]} ${item[1]}`)
  //   })
  //   // leaderBoard = [localStorage.getItem('leaderBoard0'), localStorage.getItem('leaderBoard1'), localStorage.getItem('leaderBoard2'), localStorage.getItem('leaderBoard3'), localStorage.getItem('leaderBoard4')]
  //   console.log(newOrderedTop5)

  //   // push other scores down one
  //   //update display
  // }
 
  const updateLeaderBoard = (username, score) => {
    const top5 = leaderBoard.split(',')
    const pairedTop5 = []
    //make array of key value pairedTop5
    top5.forEach((item, index) => {
      const pair = []
      if (index % 2 === 0) {
        pair.push(item, parseInt(top5[index + 1]))
        pairedTop5.push(pair)
      }
    })
    console.log(pairedTop5)
    pairedTop5.sort((a, b) => b[1] - a[1])
    //order array
    if (pairedTop5[4]) {
      if (score > pairedTop5[4][1]) {
        pairedTop5.pop()
        pairedTop5.push([username, score])
        pairedTop5.sort((a, b) => b[1] - a[1])
        window.localStorage.setItem('leaderboard', pairedTop5)
      }
    } else {
      pairedTop5.push([username, score])
      pairedTop5.sort((a, b) => b[1] - a[1])
      window.localStorage.setItem('leaderboard', pairedTop5)
    }
    console.log(pairedTop5)
    // add this score to array
    // load to local storage
  }
  updateLeaderBoard()
  const endGame = (result) => {
    result === 'win' ? window.alert(`you win. Your Score is ${score}`) : window.alert(`Try Again. Your Score is ${score}`) 
    updateLeaderBoard(userName, score)
    // score > highScore ? localStorage.setItem('highScore', `${userName} ${score}`) : null
    level = 0
    endLevel()
  }
  
  //  end levelresult)
  const endLevel = (result) => {
    removePacMan(pacManCurrentPosition)
    ghostsCurrentPositon.forEach((position, index) => removeGhosts(position, index))
    playing = false
    btncontainer.appendChild(startBtn)// remove start button
    startBtn.style.removeProperty('width')
    result === 'lose' ?  window.alert(`you lose. Your Score is ${score}`) : null
    result === 'win' ? level++  : score = 0 //bring up new board if they won the board if not reset score
    level >= boards.length ? endGame('win') : loadLevel() // if there is another board then load it
  }


  function submitForm(e) {
    e.preventDefault()
    const userNameInput = document.querySelector('#user-name-text').value.replace(/\s/g, '') // get username
    const difficultyInput = document.querySelector('#slider').value
    userName = userNameInput
    difficulty = difficultyInput
    scoreContainer.style.display = 'flex'
    btncontainer.style.display = 'flex'
    form.style.display = 'none'
    loadLevel()
  } 
  // create starting plate
  const startScreen = () => {
    scoreContainer.style.display = 'none'
    btncontainer.style.display = 'none'
  }
  startScreen()
  
  
  
  
  //add music 
  // for eating food
  // for start
  // for losing life
  // for eating big food
  // for eating blue ghost


  // create ending plate
  // create div
  // 

  const editing = () => {
    // function to toggle wall class on cell that is clicked
    function addWalls(e) {
      const cellClasses = e.target.classList
      cellClasses.contains(wallClass) ? cellClasses.remove(wallClass) : cellClasses.add(wallClass)
      boards[level].walls.push(parseInt(e.target.id))
      console.log(e.target)
    }
    //create button to skip level when editing
    const body = document.querySelector('body')
    //create button to print all the wall cells so that I can copy to the new board
    const printWallsBtn = document.createElement('BUTTON')
    printWallsBtn.innerText = 'print walls'
    const nextLevelbtn = document.createElement('BUTTON')
    nextLevelbtn.innerText = 'next level'
    body.appendChild(printWallsBtn)
    body.appendChild(nextLevelbtn)

    //function to print walls to console.log
    const printWalls = () => {
      for (let i = 0; i < boards[level].walls.length; i += 100)  { // in chunks so can be easily copy and pasted
        console.log(boards[level].walls.slice(i))
      }
    }

    //function to skip level
    const skipLevel = () => {
      endGame('lose')
    }

    //event listeners
    grid.addEventListener('click', addWalls)
    printWallsBtn.addEventListener('click', printWalls)
    nextLevelbtn.addEventListener('click', skipLevel)
  }
  // window.localStorage.clear()

  editing()
  //eventlisteners
  document.addEventListener('keydown', movePacMan)
  startBtn.addEventListener('click', playGame)
  submitBtn.addEventListener('click', submitForm)
}

window.addEventListener('DOMContentLoaded', init)