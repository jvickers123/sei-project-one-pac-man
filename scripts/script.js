function init() {
  //elements
  const grid = document.querySelector('#grid')
  const scoreDisplay = document.querySelector('.score')
  const livesDisplay = document.querySelector('#lives-container')
  const startBtn = document.querySelector('#start-game')
  const btncontainer = document.querySelector('#buttons-container')
  const userNameDisplay = document.querySelector('.username')
  const leaderboardDisplay = document.querySelector('#leaderboard')
  const scoreContainer = document.querySelector('#scores-container')
  const middleContainer = document.querySelector('#middle-container')
  const form = document.querySelector('form')
  const endScreen = document.querySelector('#end-screen')
  const submitBtn = document.querySelector('#submit')
  const muteBtn = document.querySelector('#mute')
  const title = document.querySelector('h1')
  const welcomeText = document.querySelector('#welcome-text')
  const enterUsernameText = document.querySelector('#enter-username-label')
  const enterUsernameBox = document.querySelector('#user-name-text')
  const difficultyText = document.querySelector('#difficulty-label')
  const slider = document.querySelector('#slider')

  //audio
  const mainAudio = new Audio('sounds/main-tune.mp3')
  const eatingAudio = new Audio('sounds/food.mp3')
  const bigFoodAudio = new Audio('sounds/big-food.mp3')
  const bigFoodEndAudio = new Audio('sounds/big-food-end.mp3')
  const eatghostAudio = new Audio('sounds/eat-ghost.mp3')
  const loseLifeAudio = new Audio('sounds/lose-life.mp3')
  const loseGameAudio = new Audio('sounds/lose-game.mp3')
  const winGameAudio = new Audio('sounds/win-game.mp3')
  mainAudio.volume = 0.3
  eatingAudio.volume = 0.2
  bigFoodAudio.volume = 0.4
  bigFoodEndAudio.volume = 0.4
  loseLifeAudio.volume = 0.3
  loseGameAudio.volume = 0.1
  winGameAudio.volume = 0.2
  let muted = false

  //variables
  let width
  let height
  let cellCount
  const cells = []
  let score = 0
  let leaderboardStorage = window.localStorage.getItem('leaderboard')
  const leaderboard = []
  let lives
  startBtn.innerHTML = 'Start!'
  const boards = [] //array of different boards
  let level = 0
  let difficulty = 4
  let userName 
  let endScreenText
  let startAgainBtn
  const TextToAnimate = [welcomeText, enterUsernameText, enterUsernameBox, difficultyText, slider, submitBtn, '', title, '']
  let animateIndex

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

  //leaderboard
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
  let frightenedGhosts = false


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
  const board0 = new Board(21, 23, [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 43, 52, 61, 64, 66, 67, 69, 70, 71, 73, 75, 76, 77, 79, 80, 82, 85, 103, 106, 108, 109, 111, 113, 114, 115, 116, 117, 119, 121, 122, 124, 127, 132, 136, 140, 145, 148, 149, 150, 151, 153, 154, 155, 157, 159, 160, 161, 163, 164, 165, 166, 172, 174, 182, 184, 189, 190, 191, 192, 193, 195, 197, 198, 199, 200, 201, 203, 205, 206, 207, 208, 209, 218, 222, 231, 232, 233, 234, 235, 237, 239, 240, 241, 242, 243, 245, 247, 248, 249, 250, 251, 256, 258, 266, 268, 274, 275, 276, 277, 279, 281, 282, 283, 284, 285, 287, 289, 290, 291, 292, 295, 304, 313, 316, 318, 319, 321, 322, 323, 325, 327, 328, 329, 331, 332, 334, 337, 340, 352, 355, 358, 359, 361, 363, 365, 366, 367, 368, 369, 371, 373, 375, 376, 379, 384, 388, 392, 397, 400, 402, 403, 404, 405, 406, 407, 409, 411, 412, 413, 414, 415, 416, 418, 421, 439, 442, 443, 444, 445, 446, 447, 448, 449, 450, 451, 452, 453, 454, 455, 456, 457, 458, 459, 460], 199, [65, 81, 338, 354], 346, [178, 219, 220, 221]  )
  board0.pushBoard()
  const board1 = new Board(35, 15, [8, 10, 15, 17, 19, 24, 26, 36, 37, 38, 39, 43, 45, 50, 52, 54, 59, 61, 65, 66, 67, 68, 71, 74, 75, 76, 77, 78, 80, 81, 82, 83, 84, 85, 87, 89, 90, 91, 92, 93, 94, 96, 97, 98, 99, 100, 103, 106, 122, 124, 138, 141, 142, 143, 144, 146, 147, 149, 151, 152, 153, 157, 158, 159, 161, 162, 164, 166, 170, 171, 172, 173, 179, 181, 184, 199, 201, 202, 203, 205, 210, 211, 212, 213, 214, 216, 218, 219, 224, 225, 226, 227, 228, 229, 230, 234, 237, 240, 241, 242, 243, 244, 259, 265, 268, 269, 270, 272, 280, 281, 282, 283, 284, 286, 287, 289, 290, 294, 295, 296, 297, 298, 299, 300, 310, 311, 312, 313, 314, 319, 322, 324, 325, 339, 341, 342, 343, 345, 351, 352, 353, 354, 356, 357, 359, 360, 362, 363, 365, 366, 367, 368, 369, 371, 372, 376, 377, 378, 380, 381, 382, 383, 386, 418, 421, 424, 425, 426, 427, 428, 430, 431, 432, 433, 434, 435, 437, 439, 440, 441, 442, 443, 444, 446, 447, 448, 449, 450, 453, 456, 457, 458, 459, 463, 465, 470, 472, 474, 479, 481, 485, 486, 487, 488, 498, 500, 505, 507, 509, 514, 516], 227, [123, 145, 390, 414], 402, [192, 260, 261, 262, 263, 264])
  board1.pushBoard()
  const board2 = new Board(31, 23, [14, 16, 35, 36, 37, 38, 39, 40, 41, 42, 45, 47, 50, 51, 52, 53, 54, 55, 56, 57, 63, 64, 65, 66, 73, 74, 75, 76, 78, 79, 80, 81, 88, 89, 90, 91, 94, 99, 100, 102, 114, 116, 117, 122, 125, 127, 128, 133, 135, 136, 137, 138, 139, 140, 141, 142, 143, 145, 150, 151, 153, 156, 158, 159, 162, 163, 164, 170, 176, 177, 178, 181, 182, 184, 187, 197, 199, 201, 203, 205, 215, 218, 219, 220, 221, 223, 224, 228, 230, 232, 234, 236, 240, 241, 243, 244, 245, 246, 252, 261, 265, 274, 279, 280, 281, 282, 283, 285, 286, 288, 289, 291, 292, 293, 294, 295, 296, 297, 299, 300, 302, 303, 305, 306, 307, 308, 309, 316, 320, 322, 328, 330, 334, 341, 342, 343, 344, 345, 347, 348, 350, 351, 353, 354, 355, 356, 357, 358, 359, 361, 362, 364, 365, 367, 368, 369, 370, 371, 376, 379, 395, 398, 404, 405, 406, 407, 414, 415, 416, 417, 418, 419, 420, 421, 422, 429, 430, 431, 432, 435, 437, 440, 441, 443, 455, 457, 458, 461, 463, 466, 468, 470, 471, 472, 476, 478, 479, 480, 482, 489, 490, 492, 494, 497, 505, 507, 509, 511, 513, 514, 516, 517, 525, 528, 529, 530, 531, 533, 534, 536, 538, 540, 545, 547, 550, 551, 553, 555, 556, 559, 561, 562, 564, 565, 567, 568, 569, 571, 572, 573, 574, 575, 576, 578, 579, 581, 582, 584, 585, 587, 590, 610, 618, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632, 633, 634, 636, 637, 638, 639, 643, 644, 645, 646, 647, 648, 649, 665, 667, 670, 671, 672, 673, 674, 696, 698], 356, [460, 438, 146, 132], 263, [387, 323, 324, 325, 326, 327 ]  )
  board2.pushBoard()
  //blank board for editing
  // const blankBoard = new Board(21, 23, [], 0, [], 0, [])
  // blankBoard.pushBoard()
  
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
      const outside = (cellX === 0) || (cellX === width - 1) || (cellY <= 1) || (cellY >= height - 2)
      const middle = cellX >= ((width / 2) - 5) && cellX <= ((width / 2) + 4) && cellY >= ((height / 2) - 4) && (cellY <= ((height / 2) + 2))
      const extraSideSection = ( cellX <= 4 || cellX >= (width - 5) ) && ( cellY >= (height / 2) - 4) && (cellY <= (height / 2) + 2)
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
    frightenedGhosts ? cells[position].classList.add(frightenedClass) : null
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
    cells[position].classList.remove(ghostClass, colour, frightenedClass)
  }

  const frightenGhosts = () => {
    !muted ? bigFoodAudio.play() : null
    chasePacMan = false
    frightenedGhosts ? clearTimeout(removeFrightenedTimer) : null
    ghostsCurrentPositon.forEach(position => cells[position].classList.add(frightenedClass))// add frightened class to ghosts
    const removeFrightenedClass = () => {
      playing && !muted ? bigFoodEndAudio.play() : null
      ghostsCurrentPositon.forEach(position => cells[position].classList.remove(frightenedClass))
      chasePacMan = true // move back to ghosts chasing pacman
      frightenedGhosts = false
    }
    removeFrightenedTimer = setTimeout(removeFrightenedClass, 1000 * 5)
  }

  const resetGame = () => {
    //reset game
    clearInterval(moveGhostInterval)
    clearInterval(releaseGhostsInterval)
    //reset life display
    const lives = document.querySelectorAll('.lives')
    lives.forEach(life => livesDisplay.removeChild(life))
    ghostDirection.splice(0) //clears ghost direction
    ghostDirection.push(null) // adds direction for first ghost
    ghostsCurrentPositon.splice(0)
    for (let i = 0; i < cellCount; i++) { // remove previous cells from grid
      const cell = document.querySelector('.cell')
      cell ? grid.removeChild(cell) : null
    }
    cells.splice(0) // empty cells array
    
  }

  const loadLeaderboard = () => {
    const previousScores = document.querySelectorAll('.leader')
    previousScores.forEach(leader => leaderboardDisplay.removeChild(leader))
    leaderboard.forEach((item, index) => {
      const score = document.createElement('p')
      score.classList.add('leader')
      score.innerHTML = `${index + 1} <span class="leaderboard-username">${item[0]}</span> ${item[1]}`
      leaderboardDisplay.appendChild(score)
    })
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
    pacManCurrentPosition = pacManStartingPosition

    //set display
    scoreDisplay.innerText = score
    loadLeaderboard()
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

  const collision = (cell, checkClass ) => {
    if (cell.classList.contains(checkClass)) {
      if (frightenedGhosts) {
        !muted ? eatghostAudio.play() : null
        score += 250
        const index = ghostsCurrentPositon.indexOf(parseInt(cell.id))
        removeGhosts(parseInt(cell.id), index)
        ghostsCurrentPositon[index] = ghostsStartingPosition[0]// send to start
        addGhost(ghostsCurrentPositon[index], index)
      } else {
        !muted ? loseLifeAudio.play() : null
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
        ! muted ? eatingAudio.play() : null
        currentCell.classList.remove(foodClass)
        score += (20 * difficulty)
        scoreDisplay.innerText = score
      }
      // bigFood chek
      if (currentCell.classList.contains(bigFoodClass)) {
        frightenGhosts()
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
    cells.some(cell => cell.classList.contains(frightenedClass)) ? frightenedGhosts = true : frightenedGhosts = false //check if frightened class is on cell
    ghostsCurrentPositon.forEach((position, index) => {
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
      addGhost(ghostsCurrentPositon[index], index)
      collision(cells[position], pacManClass)
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
    mainAudio.loop = true
    !muted ? mainAudio.play() : null
    moveGhostInterval = setInterval(moveGhosts, 100 * (10 - difficulty)) // start moving ghosts
    releaseGhostsInterval = setInterval(releaseGhosts, 1000 * 7) // release ghosts every 7 seconds
    btncontainer.removeChild(startBtn)// remove start button
  }

  const updateLeaderBoard = (username, score) => {
    leaderboard.splice(0)
    leaderboardStorage = window.localStorage.getItem('leaderboard')
    if (leaderboardStorage) {
      const top5 = leaderboardStorage.split(',')// check if local storage exists
      //make array of key value leaderboard
      top5.forEach((item, index) => {
        const pair = []
        if (index % 2 === 0) {
          pair.push(item, parseInt(top5[index + 1]))
          leaderboard.push(pair)
        }
      })
      leaderboard.sort((a, b) => b[1] - a[1])
      //order array
      if (leaderboard[9]) {
        if (score > leaderboard[4][1]) {
          leaderboard.pop()
          leaderboard.push([username, score])
          leaderboard.sort((a, b) => b[1] - a[1])
          window.localStorage.setItem('leaderboard', leaderboard)
        }
      } else {
        leaderboard.push([username, score])
        leaderboard.sort((a, b) => b[1] - a[1])
        window.localStorage.setItem('leaderboard', leaderboard)
      }
    } else {
      window.localStorage.setItem('leaderboard', 'player,0')
      leaderboard.push(['player', 0])
    }
  }

  const endGame = (result) => {
    clearInterval(moveGhostInterval)
    clearInterval(releaseGhostsInterval)
    mainAudio.pause()
    if (!muted) {
      result === ('win') ? winGameAudio.play() : loseGameAudio.play()
    }
    // update leaderboard
    updateLeaderBoard(userName, score)
    // minimise middle container scores and buttons
    scoreContainer.style.display = 'none'
    btncontainer.style.display = 'none'
    middleContainer.style.display = 'none'
    title.style.display = 'none'
    // create div
    endScreenText = document.createElement('p')
    result === 'win' ? endScreenText.innerHTML = `<h2>Congratulations <span class="username">${userName}</span>!</h2>You cleared all the boards! </br> Your Score: <span class="score">${score}</span></p>` : endScreenText.innerHTML = `<h2>Unlucky <span class="username">${userName}</span>! </h2> You cleared ${level} boards </br> Your Score: <span class="score">${score}</span></p>`
    endScreen.appendChild(endScreenText)
    // add leaderboard
    loadLeaderboard()
    endScreen.appendChild(leaderboardDisplay)
    // add button
    startAgainBtn = document.createElement('button')
    result === 'win' ? startAgainBtn.innerText = 'Start Again!' : startAgainBtn.innerText = 'Try Again!' 
    endScreen.appendChild(startAgainBtn)
    endScreen.style.display = 'flex'
    //reset game
    level = 0
    score = 0
    //startAgainBtn sends back to start
    startAgainBtn.addEventListener('click', startScreen)
  }
  
  const endLevel = (result) => {
    mainAudio.pause()
    removePacMan(pacManCurrentPosition)
    ghostsCurrentPositon.forEach((position, index) => removeGhosts(position, index))
    playing = false
    btncontainer.appendChild(startBtn)// remove start button
    startBtn.style.removeProperty('width')
    result === 'lose' ?  window.alert(`you lose. Your Score is ${score}`) : null
    result === 'win' ? level++  : score = 0 //bring up new board if they won the board if not reset score
    level >= boards.length ? endGame('win') : loadLevel() // if there is another board then load it
  }


  function handleStartGame(e) {
    e.preventDefault()
    const userNameInput = document.querySelector('#user-name-text').value.replace(/\s/g, '') // get username
    const difficultyInput = document.querySelector('#slider').value
    userNameInput.length < 8 ? userName = userNameInput : userName = userNameInput.slice(0, 7)
    difficulty = difficultyInput
    scoreContainer.style.display = 'flex'
    btncontainer.style.display = 'flex'
    middleContainer.style.display = 'flex'
    title.style.display = 'block'
    form.style.display = 'none'
    updateLeaderBoard(userName, 0)
    loadLevel()
    animateIndex++
    typeWriterAnimation(TextToAnimate[animateIndex])
  } 
  //functtion to animate text
  const typeWriterAnimation = (textToAnimate) => {
    if (textToAnimate === '') {//return function once hit a break in the array
      return
    }
    textToAnimate.style.display = 'inline'
    if (textToAnimate.innerText) { // check if item contains text
      const textArray = textToAnimate.innerText.split('')
      textToAnimate.innerHTML = ''
      const i = 0
      const pushLetters = (i) => {
        if (i < textArray.length) {//push letters one by one
          textToAnimate.innerHTML += textArray[i]
          const increaseIndex = () => {
            i++
            pushLetters(i)
          } 
          setTimeout(increaseIndex, 100)
        } 
        if (i === textArray.length) {
          animateIndex++
          typeWriterAnimation(TextToAnimate[animateIndex])//run function with next item at end
        }
      }
      pushLetters(i)
    } else {
      if (animateIndex < TextToAnimate.length) { // if not a text item expand width
        textToAnimate.style.display = 'inline-block'
        if (textToAnimate.getAttribute('type') === 'text' || textToAnimate.getAttribute('type') === 'range') {
          textToAnimate.style.width = '15rem'
        }
        animateIndex++
        typeWriterAnimation(TextToAnimate[animateIndex])
      }
        
    }
    
  }



  const startScreen = () => {
    scoreContainer.style.display = 'none'
    btncontainer.style.display = 'none'
    middleContainer.style.display = 'none'
    endScreen.style.display = 'none'
    title.style.display = 'none'
    form.style.display = 'flex'
    middleContainer.appendChild(leaderboardDisplay)
    endScreenText ? endScreen.removeChild(endScreenText) : null
    startAgainBtn ? endScreen.removeChild(startAgainBtn) : null

    //animation
    enterUsernameText.style.display = 'none'
    // enterUsernameBox.style.width = 0
    enterUsernameBox.style.display = 'none'
    difficultyText.style.display = 'none'
    slider.style.display = 'none'
    submitBtn.style.display = 'none'
    animateIndex = 0
    typeWriterAnimation(TextToAnimate[animateIndex])
  }

  const toggleMute = () => {
    if (muted) {
      playing ? mainAudio.play() : null
      muted = false
      muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>'
    } else {
      mainAudio.pause()
      muted = true
      muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>'
    }
  }
  startScreen()

  //function for editing and adding boards
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
        // console.log('original', boards[level].walls.slice(i))
        console.log('new', boards[level].slice(i))
      }

    }

    //function to skip level
    const skipLevel = () => {
      endLevel('win')
    }

    //event listeners
    grid.addEventListener('click', addWalls)
    printWallsBtn.addEventListener('click', printWalls)
    nextLevelbtn.addEventListener('click', skipLevel)
  }
  // window.localStorage.clear()

  // editing()
  //eventlisteners
  document.addEventListener('keydown', movePacMan)
  startBtn.addEventListener('click', playGame)
  submitBtn.addEventListener('click', handleStartGame)
  muteBtn.addEventListener('click', toggleMute)

}

window.addEventListener('DOMContentLoaded', init)


// animation