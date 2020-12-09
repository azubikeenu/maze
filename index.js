const { Engine, Render, World, Runner, Bodies, MouseConstraint, Mouse } = Matter;
// define the canvas width and height 
const width = 800;
const height = 600;
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

//adding click and drag functionality
World.add( world, MouseConstraint.create( engine, {
    mouse: Mouse.create( render.canvas )
} ) );

// walls 
const walls = [
    Bodies.rectangle( 400, 0, 800, 40, { isStatic: true } ),
    Bodies.rectangle( 400, 600, 800, 40, { isStatic: true } ),
    Bodies.rectangle( 0, 300, 40, 600, { isStatic: true } ),
    Bodies.rectangle( 800, 300, 40, 600, { isStatic: true } ),
];

World.add( world, walls );

// Random shapes 

for ( let index = 0; index < 50; index++ ) {
    if ( Math.random() > 0.5 ) {
        World.add( world, Bodies.rectangle( Math.random() * width, Math.random() * height, 50, 50 ) );
    } else {
        World.add( world, Bodies.circle( Math.random() * width, Math.random() * height, 35, {
            render: {
                fillStyle: 'tomato'
            }
        } ) );
    }

}

