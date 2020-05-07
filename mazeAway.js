const {
  Engine,
  Render,
  Runner,
  World,
  Bodies,
} = Matter;

const engine = Engine.create();
const {
  world
} = engine;


const width = 600;
const height = 600;
const cells = 10;
const unitLength = width / cells;



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


const shape = Bodies.rectangle(200, 200, 50, 50, {
  // isStatic: true
});

World.add(world, shape);

//Border Walls
//(x, y, width of shape, height of shape)

const borderWalls = [

  Bodies.rectangle(width * 0.5, 0, width, 2, {
    isStatic: true
  }),
  Bodies.rectangle(width * 0.5, height, width, 2, {
    isStatic: true
  }),
  Bodies.rectangle(0, height * 0.5, 2, height, {
    isStatic: true
  }),
  Bodies.rectangle(width, height * 0.5, 2, height, {
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

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));


const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

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
    if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
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
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength,
      unitLength * .01, {
        isStatic: true
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
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      unitLength * 0.01,
      unitLength, {
        isStatic: true
      }
    );
    World.add(world, wall);
  });
});

// Goal Section

const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * .5,
  unitLength * .5, {
    isStatic: true
  }
);
World.add(world, goal)

// Ball section

const ball = Bodies.circle(
  unitLength / 2,
  unitLength / 2,
  unitLength / 8,

);

World.add(world, ball)