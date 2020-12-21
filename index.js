const { Engine, Render, World, Runner, Bodies, Body, Events } = Matter;
// define the canvas width and height 
const width = window.innerWidth;
const height = window.innerHeight;
// const cells = 7;
const cellsHorizontal = 10;
const cellsVertical = 3;
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;
const boundaryThickness = 5;

// creates the engine
const engine = Engine.create();
// extract the world from the engine 
const { world } = engine;

// disable gravity on the y axis 
engine.world.gravity.y = 0
// creates the canvas to render objects 
const render = Render.create( {
    element: document.body,
    engine,
    options: {
        wireframes: false,
        width,
        height

    }

} );

Render.run( render );
//allows the engine and the world to work together 
Runner.run( Runner.create(), engine );


// walls 
const walls = [
    Bodies.rectangle( width / 2, 0, width, 2, { isStatic: true } ),
    Bodies.rectangle( width / 2, height, width, 2, { isStatic: true } ),
    Bodies.rectangle( 0, height / 2, 2, height, { isStatic: true } ),
    Bodies.rectangle( width, height / 2, 2, height, { isStatic: true } ),
];

World.add( world, walls );

const shuffle = ( array ) => {
    for ( let i = array.length - 1; i > 0; i-- ) {
        let j = Math.floor( Math.random() * ( i + 1 ) );
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;

}


// Maze generation 
const grid = Array( cellsVertical )
    .fill( null )
    .map( () => Array( cellsHorizontal ).fill( false ) );


const verticalsArray = Array( cellsVertical )
    .fill( null )
    .map( () => Array( cellsHorizontal - 1 ).fill( false ) );


const horizontalsArray = Array( cellsVertical - 1 )
    .fill( null )
    .map( () => Array( cellsHorizontal ).fill( false ) );


const startRow = Math.floor( Math.random() * cellsVertical );
const startColumn = Math.floor( Math.random() * cellsHorizontal );


const stepThrough = ( row, column ) => {
    //if we have visted the row and column return 
    if ( grid[row][column] ) return;
    // mark this cell as visited 
    grid[row][column] = true;

    // assemble the radomly ordered list of neighbours 
    const neighbours = shuffle( [[row - 1, column, 'up'], [row, column - 1, 'left'], [row + 1, column, 'down'], [row, column + 1, 'right']] );


    // for each neighbour, check if they are out of bounds 
    for ( let neighbour of neighbours ) {
        const [nextRow, nextColumn, direction] = neighbour;
        if ( nextRow >= cellsVertical || nextRow < 0 || nextColumn >= cellsHorizontal || nextColumn < 0 )
            continue;

        // check if the cell has been visited before 
        if ( grid[nextRow][nextColumn] ) continue;

        //remove the horizontal or vertical walls 
        if ( direction === "left" ) {
            verticalsArray[row][column - 1] = true;
        }
        else if ( direction === "right" ) {
            verticalsArray[row][column] = true;
        }
        else if ( direction === "up" ) {
            horizontalsArray[row - 1][column] = true;
        }
        else if ( direction === "down" ) {
            horizontalsArray[row][column] = true;
        }

        stepThrough( nextRow, nextColumn );

    }

}

stepThrough( startRow, startColumn );

// draw the horizontal blocks
horizontalsArray.forEach( ( row, rowIndex ) => {
    row.forEach( ( open, columnIndex ) => {
        if ( open ) return
        const wall = Bodies.rectangle( ( unitLengthX * columnIndex + unitLengthX / 2 ), ( rowIndex * unitLengthY + unitLengthY ), unitLengthX, boundaryThickness, {
            isStatic: true, label: "wall",
            render: { fillStyle: "tomato" }
        } );
        World.add( world, wall );
    } )
} );


// draw the vertical blocks 
verticalsArray.forEach( ( row, rowIndex ) => {
    row.forEach( ( open, columnIndex ) => {
        if ( open ) return true;
        const wall = Bodies.rectangle( ( columnIndex * unitLengthX + unitLengthX ), ( rowIndex * unitLengthY + unitLengthY / 2 ), boundaryThickness, unitLengthY, {
            isStatic: true, label: "wall",
            render: { fillStyle: "tomato" }
        } )
        World.add( world, wall );

    } )

} )

const goalDimensions = Math.max( unitLengthX, unitLengthY ) / 4
// create the goal
const goal = Bodies.rectangle( ( width - unitLengthX / 2 ), ( height - unitLengthY / 2 ), goalDimensions, goalDimensions, {
    label: "goal",
    isStatic: true, render: {
        fillStyle: "green"
    }
} );

World.add( world, goal );

// create the ball 

const ballRadius = Math.min( unitLengthX, unitLengthY ) / 4

const ball = Bodies.circle( unitLengthX / 2, unitLengthY / 2, ballRadius, {
    label: "ball",
    render: {
        fillStyle: "blue"
    }
} )

World.add( world, ball );


// keypress detection 

document.addEventListener( 'keydown', ( e ) => {
    const { x, y } = ball.velocity;
    if ( e.keyCode === 38 ) {
        // go up 
        Body.setVelocity( ball, { x, y: y - 5 } );
    }
    if ( e.keyCode === 37 ) {
        // go left 
        Body.setVelocity( ball, { x: x - 5, y } );

    }
    if ( e.keyCode === 39 ) {
        // go right
        Body.setVelocity( ball, { x: x + 5, y } )
    }

    if ( e.keyCode === 40 ) {
        // go down 
        Body.setVelocity( ball, { x, y: y + 5 } );
    }
} );


// win condition

Events.on( engine, 'collisionStart', ( e ) => {

    e.pairs.forEach( collision => {
        const labels = [collision.bodyA.label, collision.bodyB.label];
        if ( labels.includes( "ball" ) && labels.includes( "goal" ) ) {
            engine.world.gravity.y = 1
            world.bodies.forEach( shape => {
                if ( shape.label == "wall" ) {
                    Body.setStatic( shape, false )
                    document.querySelector( ".winner" ).classList.remove( "hidden" );
                }
            } )

        }
    } )
} )



