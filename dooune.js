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

function preload() {
    sine = new Tone.PolySynth({
        "oscillator" : {
            type: 'sine',
            partials: [0, 2, 3, 4],
            harmonicity: 3.4
        },
        "filter": {
           "type": "lowpass"
        },
    }).toMaster();
    sine.volume.value = -40;
    square = new Tone.PolySynth(4, Tone.AMSynth).toMaster();
    square.volume.value = -10;
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
            var bodyName = ["bodyA", "bodyB"];
            for (var j = 0; j < bodyName.length; j++)
                if ("updateTime" in pair[bodyName[j]] && millis() - pair[bodyName[j]].updateTime > 300) {
                    var targetBody = pair[bodyName[j]];
                    //pair.bodyA.sound.triggerAttackRelease(pair.bodyA.chord, "8n");
                    if (targetBody.render.fillStyle == "white")
                        targetBody.sound.triggerAttack(targetBody.chord);
                    targetBody.render.fillStyle = random(original);
                    targetBody.originColor = targetBody.render.fillStyle;
                    targetBody.updateTime = millis();
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