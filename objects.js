var scribble = new Scribble();
var chords = [["C4", "E4", "G4"], ["D4", "F4", "A5"], ["E4", "G4", "B5"],
              ["F4", "A5", "C5"], ["G4", "B5", "D5"], ["A5", "C5", "E5"]];
chords = chords.reverse();

class Line {
    constructor(prevX, prevY, currentX, currentY) {
        this.pos = {
            x: prevX,
            y: prevY
        }
        this.show = function() {
            push();
            stroke(255);
            strokeWeight(2);
            scribble.scribbleLine(prevX, prevY, currentX, currentY);
            //line(prevX, prevY, currentX, currentY);
            pop();
        }
    };
}

class Circle {
    constructor(x, y, r) {
        var options = {
            friction: 0.6,
            restitution: 1
        };
        this.body = Bodies.circle(x, y, r, options);
        this.body.render.fillStyle = "white";
        this.body.originColor = "white";
        this.body.updateTime = 0;
        this.body.chord = getChord(r);
        this.r = r;
        World.add(world, this.body);

        this.isOffScreen = function () {
            var pos = this.body.position;
            if (pos.y > windowHeight) {
                return true;
            } else {
                return false;
            }
        }

        this.removeFromWorld = function () {
            World.remove(world, this.body);
        }

        this.show = function () {
            var pos = this.body.position;
            push();
            if (this.body.render.fillStyle != "white") {
                var cl = color(this.body.render.fillStyle);
                var now = millis();
                var r = int(red(cl) + (now - this.body.updateTime) * (255 - red(color(this.body.originColor))) / 500);
                var g = int(green(cl) + (now - this.body.updateTime) * (255 - green(color(this.body.originColor))) / 500);
                var b = int(blue(cl) + (now - this.body.updateTime) * (255 - blue(color(this.body.originColor))) / 500);
                if (r >= 255 && g >= 255 && b >= 255) {
                    this.body.render.fillStyle = "white";
                    fill(this.body.render.fillStyle);
                } else {
                    fill(color(r, g, b));
                }
            } else {
                fill(this.body.render.fillStyle);                
            }
            ellipseMode(RADIUS);
            translate(pos.x, pos.y);
            ellipse(0, 0, this.r);
            pop();
        };
    }
}

class Box {
    constructor(x, y, w, h) {
        var options = {
            friction: 0.8,
            restitution: 0.5
        };
        this.body = Bodies.rectangle(x, y, w, h, options);
        this.body.render.fillStyle = "white";
        this.body.originColor = "white";
        this.body.updateTime = 0;
        this.w = w;
        this.h = h;
        this.body.chord = getChord(w);
        World.add(world, this.body);
        
        this.isOffScreen = function () {
            var pos = this.body.position;
            if (pos.y > windowHeight) {
                return true;
            } else {
                return false;
            }
        }

        this.removeFromWorld = function () {
            World.remove(world, this.body);
        }

        this.show = function () {
            var pos = this.body.position;
            var angle = this.body.angle;
            push();
            if (this.body.render.fillStyle != "white") {
                var cl = color(this.body.render.fillStyle);
                var now = millis();
                var r = int(red(cl) + (now - this.body.updateTime) * (255 - red(color(this.body.originColor))) / 500);
                var g = int(green(cl) + (now - this.body.updateTime) * (255 - green(color(this.body.originColor))) / 500);
                var b = int(blue(cl) + (now - this.body.updateTime) * (255 - blue(color(this.body.originColor))) / 500);
                if (r >= 255 && g >= 255 && b >= 255) {
                    this.body.render.fillStyle = "white";
                    fill(this.body.render.fillStyle);
                } else {
                    fill(color(r, g, b));
                }
            } else {
                fill(this.body.render.fillStyle);                
            }
            translate(pos.x, pos.y);
            rotate(angle);
            rectMode(CENTER);
            rect(0, 0, this.w, this.h);
            pop();
        };
    }
}
