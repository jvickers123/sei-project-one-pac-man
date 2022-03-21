# General Assembly Project 1 - Pac-Man Game
 
My first ever dev project. It was done 3 weeks into the General Assembly Software Engineering Immersive course.
 
![screenshot-of-Pac-Man-game](https://i.imgur.com/O9qaIPc.png)
 
 
 
 
## Brief
 
To create a fully functioning browser based game of your choice using vanilla JavaScript in 9 days.
 
 
 
## Deployment
 
This project has been deployed on GitHub pages and is available [here](https://jvickers123.github.io/sei-project-one-pac-man/).
 
 
 
## Technologies used
 
JavaScript, CSS, HTML
 
 
 
 
## Approach taken
 
### Day 1
 
**Planning and pseudocoding:** 
 I first outlined a basic plan of the main features and functions that would be required.
> *The board:* 
> * Made using flex grid.
> * Each cell can either have a class of wall or corridor decided.
> * Corridor class cells can either have class of food or non food.
> * When a new board is done, it can be brought by a new array.
> *  Can create board, then make a function that saves board by pushing each cells  classList into an array.
 
> *The characters:*
> * Pac Man is controlled like in Sam’s lesson .
> * But an extra conditional based on whether the next square is a wall or a corridor.
> * A function to remove food class when Pac Man is in a square with food.
> * Add to score.
 
> * Ghosts have the same conditionals of movement for walls or corridors.
> * But they need a function that relates to the current position of Pac Man to tell them where to move next.
> * Something like if down is a corridor and pac Man is below the ghost then move one down.
> * Can work out relative position by comparing the grid row and column of the cells.
> * This will all have to be based on a setInterval.
 
> *Flashy Food Function*
> * When flashy food is eaten this function runs.
> * Turns ghosts blue  (add blue class).
> * Ghosts movement is now more random and possibly moves away from Pac Man's current position.
> * If Pac Man is in same square as ghost, ghost disappears.
 
> *End Game / new board function*
> * If Ghost is in the same square as Pac Man then game over.
> * Save score, alert game over.
> * If all food is eaten.
> * Alert player wins.
> * Bring up a new board using an array to determine what is a wall corridor and where the ghost classes are.
 
I also created a basic wire-frame for what the MVP should look like:
 
![wire-frame-one](./wireframe/Screenshot%202022-01-07%20at%2010.30.20.png)
 
I then pseudocoded in detail each function, variable and event listener that would be needed to achieve the MVP.
 
For example here is the pseudocode for the move pacman function:
```
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
 
```
 
### Day 2
 
I started by creating a div that had `display: grid`. I then added the cells based on the width and height which had been entered as variables in the project, and wrote a for loop that counted the number of cells needed and created a div for each one. I created x and y coordinate attributes to each cell so that the position of the cells would be easier to access later on:
 
![code-to-create-cells](https://i.imgur.com/2EwdSup.png)
 
I then hard coded the cells which needed a wall class to be applied and saved the cell id's to an array. I noticed how long this would take if I was to do multiple levels so I planned to make a function to make this process quicker later on.
 
I then wrote a function to detect if a cell either contained a wall class or was situated in the middle or edges of the board. If the cell did not fall into these categories it had a 'food' class added.
 
![code-to-create-food](https://i.imgur.com/nzOFbZh.png)
 
### Day 3
 
I completed the Pac-Man move function. The function worked to remove the ‘pacman’ class from its current position, then check to see if the next cell was a wall. It then added the ‘pacman’ class to the necessary new cell. For example, these are the parts of the code that allows Pac-Man to move right.
 
![code-to-see-if-pacman-moves-right](https://i.imgur.com/6fp3UI4.png)
 
![code-to-add-pacman-class-to-next-cell](https://i.imgur.com/yo2KQAT.png)
 
I also added a random move function for the ghosts. I wanted the ghosts to move continuously until they hit a wall so that their movement looked somewhat natural. This involved choosing a direction and only choosing a direction again if the next cell they would move into contained a ‘wall’ class.
 
![code-to-move-ghosts](https://i.imgur.com/uec3aoP.png)
 
I also added a `setTimeout()` to release ghosts from the middle and start moving around the grid.
 
### Day 4
 
I added a collision function that was triggered any time pac man moves into a cell that contained a ‘ghost’ class. It reduces the lives by one and moves Pac-Man to the starting position. If the lives are at zero then it triggers the end game function. The end game function cleared the scores and reset the board.
 
I spent a long time trying to fix a bug where the `setTimeout()` that released the ghosts continued after the game had finished if they had not been released by the end. I spent a lot of time researching setTimeouts and setIntervals and ultimately got a greater understanding of them as a result.
 
### Day 5
 
Having spent the time researching the day before I decided to change the move ghosts function to use a `setInterval()` which called itself again at the end of the function. This enabled it to be cleared when the game ended.
 
I also added a ‘frightened ghost' function which allowed ghosts to be eaten if they were blue. This worked by adding a ‘frightened’ class to all the ghost cells and updating the collision function to check if the cell contained a ‘frightened’ ghost. If so, it added to the score and moved the ghost back to its original starting position.
 
### Day 6
 
I created a function to help me create new boards more quickly. The function added an event listener to each cell in the grid that toggled a 'wall' class when clicked. I then added a button which printed out a list of cell ids that had a 'wall' class in console logs. I would press this button after I had designed the board and copy the list into an array of wall starting positions. These could then be loaded on the load level function.
 
![code-to-create-new-boards](https://i.imgur.com/ES7D5U1.png)
 
This allowed me to create a few more boards relatively quickly, and also made the process of editing boards much easier. This saved me a lot of time later on when I realised that the structure of the boards was leading to the ghosts moving in strange ways.
 
### Day 7
 
I wanted to adapt the ghosts to move towards pacman if they were not frightened. I, therefore, added to the move ghosts function a check to compare the relative X and Y coordinates of the cell which contained the Pac-Man cell. It then ran a check to see whether the next square was a wall. If it was then it passed down a direction of null which triggered the normal pick direction function from before.
 
![code-to-move-towards-pac-man](https://i.imgur.com/V2opKHz.png)
 
I also wanted to add a leaderboard that used local storage. This proved quite tricky to get to grips with how to get the item from local storage, update and replace it. In particular, I spent a while working around what was passed through if there were no results yet. I eventually decided to pass through the result of `[‘player’, 0]` if the local storage was empty. Whilst this was not a perfect solution styling wise it got around a lot of issues I was getting with undefined and null values getting saved to local storage.
 
If there were scores in local storage, the function worked to sort these in order of the score. If the player’s score was higher than the score at index 9, the lowest score was removed from the array and the player’s score added. This was then added to the local storage and the DOM for display.
 
![code-to-update-leaderboard](https://i.imgur.com/ch9PGwj.png)
 
### Day 8
 
As this was the last full day before the deadline I dedicated it to styling. I wanted to go for a retro arcade look to best replicate the original Pac-Man. I used a lot of FlexBox to display and got quite comfortable using it during this day.
 
I also added sound effects to the functions that were triggered at different points. These very quickly got annoying during development so I built a mute function to maintain my sanity.
 
### Day 9
 
I spent the day cleaning up the project and removing console.logs
 
I also added a typewriter style animation to the loading screen. This involved getting the text from the DOM and saving it to an array of each thing that needed to be animated. The function then made the innerHTML equal to an empty string and then added each letter individually using a `setTimeout()`. It would then move to the next item in the array. In order to use the same function for animation on the next page. I inserted empty strings into the array of text to be animated and made it so the function stopped when it reached an empty string. This prevented the function from attempting to animate text that had not yet been made visible.
 
 
![code-to-animate-text](https://i.imgur.com/gM0RU1b.png)
![code-to-animate-text](https://i.imgur.com/uujvmMH.png)
 
The project was then hosted and deployed using GitHub pages.
 
 
## Challenges
 
This was my first JavaScript project so it was a steep learning curve with plenty of challenges. Figuring out how to stop the ghosts from continuing to release with setTimeouts once a level had finished took a long time. Also figuring out how to access local storage and manipulate that too was difficult.
 
 
 
## Wins
 
I felt very comfortable with JavaScript and CSS at the end of the process. I was proud of what I had achieved after just 3 weeks of introduction to coding. I was also proud of my function that helped me edit and build the game as it meant that scaling the game up in the future would not be too time-consuming.
 
I developed a lot in learning how to find and fix bugs. It taught me to check each stage of building a function so that a bug was immediately dealt with as opposed to waiting until the end of the function and spending a long time figuring out where the problem was.
 
I also learned the importance of planning. Whilst I had a good plan for the MVP, when I moved to adding extra features, I started by just getting stuck in straight with the code. This meant I often got lost. By the end, however, I learned to pseudocode ideas from the beginning which made the process a lot cleaner and easier to take step by step.
 
 
 
## Future Features
 
I would like to add the typewriter animation style to more of the application. As I only started adding it on the last day, I ran out of time to make it uniform across the project.


