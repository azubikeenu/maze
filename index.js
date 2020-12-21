const { Engine, Render, World, Runner, Bodies } = Matter;
// define the canvas width and height 
const width = 600;
const height = 600;
const cells = 10;
const unitLength = width / cells;
const boundaryThickness = 5;

// creates the engine
const engine = Engine.create();
// extract the world from the engine 
const { world } = engine;
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
    Bodies.rectangle( width / 2, 0, width, 40, { isStatic: true } ),
    Bodies.rectangle( width / 2, height, width, 40, { isStatic: true } ),
    Bodies.rectangle( 0, height / 2, 40, height, { isStatic: true } ),
    Bodies.rectangle( width, height / 2, 40, height, { isStatic: true } ),
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
const grid = Array( cells )
    .fill( null )
    .map( () => Array( cells ).fill( false ) );


const verticalsArray = Array( cells )
    .fill( null )
    .map( () => Array( cells - 1 ).fill( false ) );


const horizontalsArray = Array( cells - 1 )
    .fill( null )
    .map( () => Array( cells ).fill( false ) );


const startRow = Math.floor( Math.random() * cells );
const startColumn = Math.floor( Math.random() * cells );


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
        if ( nextRow >= cells || nextRow < 0 || nextColumn >= cells || nextColumn < 0 )
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





    // neighbours.forEach( ( current, index ) => {
    //     if ( current.some( el => ( el >= cells || el < 0 ) ) ) {
    //         neighbours.splice( index, 1 );
    //     }
    // } )
    // console.log( neighbours );

}

stepThrough( startRow, startColumn );

// draw the horizontal blocks
horizontalsArray.forEach( ( row, rowIndex ) => {
    row.forEach( ( open, columnIndex ) => {
        if ( open ) return
        const wall = Bodies.rectangle( ( unitLength * columnIndex + unitLength / 2 ), ( rowIndex * unitLength + unitLength ), unitLength, boundaryThickness, { isStatic: true } );
        World.add( world, wall );
    } )
} );


// draw the vertical blocks 
verticalsArray.forEach( ( row, rowIndex ) => {
    row.forEach( ( open, columnIndex ) => {
        if ( open ) return true;
        const wall = Bodies.rectangle( ( columnIndex * unitLength + unitLength ), ( rowIndex * unitLength + unitLength / 2 ), boundaryThickness, unitLength, { isStatic: true } )
        World.add( world, wall );

    } )

} )



