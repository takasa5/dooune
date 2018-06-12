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
    return center
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