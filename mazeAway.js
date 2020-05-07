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
const cells = 3;



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

  Bodies.rectangle(width * 0.5, 0, width, 40, {
    isStatic: true
  }),
  Bodies.rectangle(width * 0.5, height, width, 40, {
    isStatic: true
  }),
  Bodies.rectangle(0, height * 0.5, 40, height, {
    isStatic: true
  }),
  Bodies.rectangle(width, height * 0.5, 40, height, {
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

  const neighbors = shuffleArrayNeighbors([
    [row - 1, column],
    [row, column + 1],
    [row + 1, column],
    [row, column - 1]
  ]);
  // console.log(neighbors)
  //for each neighbor.....
  for (let move of availableMoves) {
    const [nextRow, nextColumn] = move;

    //see if that neightbor is out of bounds
    if (netRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
      continue;
    }

    // if we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn] === true) {
      continue;
    }
  }




  // remove a wall from either horizontals or verticals array
  //visit the next cell

}

stepThroughCell(startRow, startColumn);

console.log(grid);