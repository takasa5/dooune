function getCenter(lines) {
    var xg = 0, yg = 0;
    for (var i = 0; i < lines.length; i++) {
        xg += lines[i].pos.x;
        yg += lines[i].pos.y;
    }
    var center = {
        x: xg / lines.length,
        y: yg / lines.length
    }
    return center;
}

function getRadius(lines) {
    var radius = 0;
    for (var i = 0; i < lines.length; i++) {
        for (var j = 0; j < lines.length; j++) {
            if (i != j && dist(lines[i].pos.x, lines[i].pos.y, lines[j].pos.x, lines[j].pos.y) > radius)
                radius = dist(lines[i].pos.x, lines[i].pos.y, lines[j].pos.x, lines[j].pos.y)
        }
    }
    return radius / 2
}

function countCorner(lines) {
    var interiorAng = 0,
        corner = 0;
    for (var i = 0; i < lines.length - 2; i++) {
        cur = lines[i],
        n = lines[i+1],
        nn = lines[i+2];
        bec1 = p5.Vector.sub(createVector(n.pos.x, n.pos.y), createVector(cur.pos.x, cur.pos.y));
        bec2 = p5.Vector.sub(createVector(nn.pos.x, nn.pos.y), createVector(n.pos.x, n.pos.y));
        dot = p5.Vector.dot(bec1, bec2);
        cos = dot / (p5.Vector.mag(bec1) * p5.Vector.mag(bec2));
        theta = 180 - acos(cos) * 180 / PI;
        if (abs(theta - 90) < 30)
            corner++;
        if (theta < 150) {
            interiorAng += theta;
        }
    }
    return interiorAng;
}

function getChord(size, list) {
    var interval = 20;
    var min = 20;
    for (var i = 0; i < list.length; i++) {
        if (size < min + interval * i) {
            return list[i];
        }
    }
    return list[list.length - 1];
}