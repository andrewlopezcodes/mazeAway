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
const cells = 5;



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

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));

const verticals = Array(cells).fill(null).map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1).fill(null).map(() => Array(cells).fill(false));
console.log(grid);