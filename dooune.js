// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint;

var engine;
var world;

var objects = [];
var lines = [];

var ground;

var mConstraint;

function setup() {
    var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $(document).on(scroll_event,function(e){e.preventDefault();});
    //SP用
    $(document).on('touchmove.noScroll', function(e) {e.preventDefault();});
    document.body.style.overflow = "hidden";

    var canvas = createCanvas(windowWidth*0.99, windowHeight*0.99);
    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);
    var options = {
        isStatic: true
    }
    ground = Bodies.rectangle(windowWidth / 2, windowHeight*0.99, windowWidth*0.99, 10, options)
    World.add(world, ground);

    var canvasmouse = Mouse.create(canvas.elt);
    canvasmouse.pixelRatio = pixelDensity();
    var options = {
        mouse: canvasmouse
    }
    mConstraint = MouseConstraint.create(engine, options);
    World.add(world, mConstraint);
}

function mousePressed() {
    //objects.push(new Circle(mouseX, mouseY, 10));
}

var prevX = 0, prevY = 0;
function mouseDragged() {
    if (!mConstraint.body) {
        if (prevX == 0 && prevY == 0) {
            prevX = mouseX;
            prevY = mouseY;
        } else if (dist(prevX, prevY, mouseX, mouseY) < 5) {
            //pass
        } else {
            lines.push(new Line(prevX, prevY, mouseX, mouseY))
            prevX = mouseX;
            prevY = mouseY;
        }
    }
}

function mouseReleased() {
    if (lines.length > 0) {
        if (dist(lines[0].pos.x, lines[0].pos.y, lines[lines.length - 1].pos.x, lines[lines.length - 1].pos.y) < 50) {
            center = getCenter(lines);
            objects.push(new Circle(center.x, center.y, getRadius(lines)));
        }
        lines = [];
    }
    prevX = prevY = 0;
    
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    var options = {
        isStatic: true
    }
    World.remove(world, ground);
    ground = Bodies.rectangle(windowWidth / 2, windowHeight, windowWidth, 10, options)
    World.add(world, ground);
}

function draw() {
    background(51);
    for (var i = 0; i < objects.length; i++) {
        objects[i].show();
        if (objects[i].isOffScreen()) {
            objects[i].removeFromWorld();
            objects.splice(i, 1);
            i--;
        }
    }
    for (var i = 0; i < lines.length; i++) {
        lines[i].show();
    }

}