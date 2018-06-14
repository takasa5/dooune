// module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Detector = Matter.Detector,
    Events = Matter.Events;

var engine;
var world;

var original = ["#ffc800", "#19ffdc", "#cc14cc"];
var objects = [];
var lines = [];

var ground;

var mConstraint;

var sine, square;

var back = function(p) {
    p.setup = function() {
        canv = p.createCanvas(windowWidth, windowHeight);
        canv.style("z-index", -1);
        canv.position(0, 0);
        p.background(61);
    };
    p.windowResized = function() {
        p.resizeCanvas(windowWidth, windowHeight);
        p.background(61);
    }
    p.draw = function() {
    };
}

var instanceMode = new p5(back);

function preload() {
    sine = new Tone.PolySynth({
        "oscillator" : {
            type: 'triangle8',
            partials: [0, 2, 3, 4],
            harmonicity: 3.4
        },
        "filter": {
           "type": "highpass"
        },
    }).toMaster();
    sine.volume.value = -30;
    square = new Tone.PolySynth({
        "oscillator" : {
            type : 'fmsquare',
            modulationType : 'sawtooth',
            modulationIndex : 3,
            harmonicity: 3.4
        },
        "envelope" : {
            "attack" : 0.1
        }
    }).toMaster();
    square.volume.value = -30;
}

function setup() {
    var scroll_event = 'onwheel' in document ? 'wheel' : 'onmousewheel' in document ? 'mousewheel' : 'DOMMouseScroll';
    $(document).on(scroll_event,function(e){e.preventDefault();});
    //SP用
    $(document).on('touchmove.noScroll', function(e) {e.preventDefault();});
    document.body.style.overflow = "hidden";

    var canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(0, 0);
    engine = Engine.create({
        enableSleeping: true
    });
    world = engine.world;
    Engine.run(engine);
    var options = {
        isStatic: true
    }
    ground = Bodies.rectangle(windowWidth / 2, windowHeight, windowWidth, 20, options)
    World.add(world, ground);

    var canvasmouse = Mouse.create(canvas.elt);
    canvasmouse.pixelRatio = pixelDensity();
    var options = {
        mouse: canvasmouse
    }
    mConstraint = MouseConstraint.create(engine, options);
    World.add(world, mConstraint);

    Events.on(engine, "collisionStart", function(event) {
        var pairs = event.pairs;
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i];
            if ("updateTime" in pair.bodyA && millis() - pair.bodyA.updateTime > 300) {
                pair.bodyA.sound.triggerAttackRelease(pair.bodyA.chord, "8n");
                pair.bodyA.render.fillStyle = random(original);
                pair.bodyA.originColor = pair.bodyA.render.fillStyle;
                pair.bodyA.updateTime = millis();
            }
            if ("updateTime" in pair.bodyB && millis() - pair.bodyB.updateTime > 300) {
                pair.bodyB.sound.triggerAttackRelease(pair.bodyB.chord, "8n");
                pair.bodyB.render.fillStyle = random(original);
                pair.bodyB.originColor = pair.bodyB.render.fillStyle;
                pair.bodyB.updateTime = millis();
            }
        }
    });
    Events.on(engine, "collisionEnd", function(event) {
    });
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
            ang = countCorner(lines);
            console.log(ang);
            if (ang > 300) {
                objects.push(new Box(center.x, center.y, getRadius(lines), getRadius(lines)));
            } else if (ang <= 300) {
                objects.push(new Circle(center.x, center.y, getRadius(lines)));
            }
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
    ground = Bodies.rectangle(windowWidth / 2, windowHeight, windowWidth, 20, options)
    World.add(world, ground);
}

function draw() {
    clear();
    //drawBG();
    if (keyIsDown(32)/*SPACE*/) {
        world.gravity.scale = 0.0001;
    } else {
        world.gravity.scale = 0.001;
    }
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