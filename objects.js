class Line {
    constructor(prevX, prevY, currentX, currentY) {
        this.pos = {
            x: prevX,
            y: prevY
        }
        this.show = function() {
            push();
            stroke(255); // 線の色指定
            strokeWeight(2); // 線の太さ指定
            line(prevX, prevY, currentX, currentY);
            pop();
        }
    };
}

class Circle {
    constructor(x, y, r) {
        var options = {
            friction: 0.6,
            restitution: 0.7
        };
        this.body = Bodies.circle(x, y, r, options);
        this.r = r;
        World.add(world, this.body);

        this.isOffScreen = function () {
            var pos = this.body.position;
            if (pos.x < 0 || pos.x > windowWidth || pos.y > windowHeight) {
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
        this.w = w;
        this.h = h;
        World.add(world, this.body);

        this.isOffScreen = function () {
            var pos = this.body.position;
            if (pos.x < 0 || pos.x > windowWidth || pos.y > windowHeight) {
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
            translate(pos.x, pos.y);
            rotate(angle);
            rectMode(CENTER);
            rect(0, 0, this.w, this.h);
            pop();
        };
    }
}
