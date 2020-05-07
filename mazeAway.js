const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
  Body,
  Events
} = Matter;

const engine = Engine.create();
// engine.world.gravity.y = 0; // <- removes gravity from maze
const {
  world
} = engine;

const cellsHorizontal = 20;
const cellsVertical = 15;
const width = window.innerWidth;
const height = window.innerHeight;
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;



const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width,
    height
  }
});

Render.run(render);
Runner.run(Runner.create(), engine);

//Border Walls
//(x, y, width of shape, height of shape)

const borderWalls = [

  Bodies.rectangle(width * 0.5, 0, width, 2, {
    label: 'border wall top',
    isStatic: true
  }),
  Bodies.rectangle(width * 0.5, height, width, 2, {
    label: 'border wall bottom',
    isStatic: true
  }),
  Bodies.rectangle(0, height * 0.5, 2, height, {
    label: 'border wall left',
    isStatic: true
  }),
  Bodies.rectangle(width, height * 0.5, 2, height, {
    label: 'border wall right',
    isStatic: true
  }),
];

World.add(world, borderWalls);

/* Maze Generation 
grid = Array() <- The number inside the parenthesis is the number of rows for the grid
map(()=> Array().fill()) <- The number inside the call back function Array parenthesis is the number of columns */

const shuffleArrayNeighbors = (arr) => {
  let arrayNeighbors = arr.length;
  while (arrayNeighbors > 0) {
    const index = Math.floor(Math.random() * arrayNeighbors);

    arrayNeighbors--;
    const temp = arr[arrayNeighbors];
    arr[arrayNeighbors] = arr[index];
    arr[index] = temp;
  }
  return arr
}

const grid = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical).fill(null).map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1).fill(null).map(() => Array(cellsHorizontal).fill(false));


// const startRow = Math.floor(Math.random() * cellsHorizontal);
// const startColumn = Math.floor(Math.random() * cellsVertical);
const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
  //if i have visited the cell at [row, column], then return

  if (grid[row][column] === true) {
    return;
  }

  //mark this cell as being visited

  grid[row][column] = true;

  //assemble randomly ordered list of neighbors

  const availableMoves = shuffleArrayNeighbors([
    [row - 1, column, 'up'], //up
    [row, column + 1, 'right'], //right
    [row + 1, column, 'down'], //down
    [row, column - 1, 'left'] // left
  ]);
  // console.log(neighbors)
  //for each neighbor.....
  for (let move of availableMoves) {
    const [nextRow, nextColumn, directionOfMove] = move;

    //see if that neightbor is out of bounds
    if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
      continue;
    }

    // if we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn] === true) {
      continue;
    }

    // remove a wall from verticals array
    if (directionOfMove === 'left') {
      verticals[row][column - 1] = true;
    } else if (directionOfMove === 'right') {
      verticals[row][column] = true;
    }

    // remove a wall from horizontals array
    if (directionOfMove === 'up') {
      horizontals[row - 1][column] = true;
    } else if (directionOfMove === 'down') {
      horizontals[row][column] = true;
    }

    stepThroughCell(nextRow, nextColumn);
  }





  //visit the next cell

}

stepThroughCell(startRow, startColumn);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      unitLengthX * .1, {
        label: 'horizontal wall',
        isStatic: true,
        render: {
          fillStyle: 'blue'
        }
      }
    );
    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      unitLengthX * 0.1,
      unitLengthY, {
        label: 'vertical wall',
        isStatic: true,
        render: {
          fillStyle: 'blue'
        }
      }
    );
    World.add(world, wall);
  });
});

// Goal Section

const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * .5,
  unitLengthY * .5, {
    label: 'goal',
    isStatic: true,
    render: {
      fillStyle: 'green'
    }
  }
);
World.add(world, goal)

// Ball section
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
  unitLengthX / 2,
  unitLengthY / 2,
  ballRadius, {
    label: 'ball',
    render: {
      fillStyle: 'yellow'
    }
  }

);

World.add(world, ball);

document.addEventListener('keydown', event => {
  const {
    x,
    y
  } = ball.velocity;
  if (event.keyCode === 38 || event.keyCode === 87) {
    Body.setVelocity(ball, {
      x: x,
      y: y - 5
    });
    console.log('up'); //w
  }
  if (event.keyCode === 40 || event.keyCode === 90) {
    Body.setVelocity(ball, {
      x: x,
      y: y + 5
    });
    console.log('down'); //z
  }
  if (event.keyCode === 39 || event.keyCode === 83) {
    Body.setVelocity(ball, {
      x: x + 5,
      y: y
    });
    console.log('right'); //s
  }
  if (event.keyCode === 37 || event.keyCode === 65) {
    Body.setVelocity(ball, {
      x: x - 5,
      y: y
    });
    console.log('left'); //a
  }
});

//Winning Scenario

Events.on(engine, 'collisionStart', event => {
  event.pairs.forEach(collision => {
    const labels = ['ball', 'goal'];

    if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
      document.querySelector('.winner').classList.remove('hidden');
      const button = document.querySelector('p');
      button.addEventListener('click', event => {
        location.reload();
      })
      world.gravity.y = 1;
      world.bodies.forEach(body => {
        if (body.label === 'vertical wall' || body.label === 'horizontal wall') {
          Body.setStatic(body, false);

        }
      });
    }
  });
});

//written by @andrewlopezcodes on Github and Instagram