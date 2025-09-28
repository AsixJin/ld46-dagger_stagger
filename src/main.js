
console.log("Is this thing on?")
// Now it is....

var bleeper = require('pixelbox/bleeper');
var frames = 0
var gamemode = 0
var lives = 5
var ticks = 0
var last_tick_time = 0
var steps = 0
var score = 0
var smap = getMap('map')
var map = getMap('map');
function getRand(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

var dagger_count = 2
var dagger_step = 5
var player = {
    x: 8,
    y: 8,
    draw: function() {
        sprite(132, player.x*8, player.y*8);
    },
    control: function() {
        if (gamemode == 1){
            if (btnp.up) {
                if (player.y > 4) player.y -= 1;
                tick();
            }
            if (btnp.right) {
                if (player.x < 13) player.x += 1;
                tick();
            }
            if (btnp.down) {
                if (player.y < 13) player.y += 1;
                tick();
            }
            if (btnp.left) {
                if (player.x > 2) player.x -= 1;
                tick();
            }
        }
        
        if (btnp.start && gamemode == 0) {
            assets.bleeper.game_start.play()
            cls()
            draw(map, 0, 0)
            player.draw()
            while(daggers.length < 10) {
                create_dagger()
            }
            daggers.forEach(draw_daggers)
            println("Lives: " + lives.toString() + "   " + "Score: " + score.toString())
            println("Steps: " + ticks.toString())
            gamemode = 1
        }
    }
}

//x = 1 - 14 
//y = 3 - 14
var dagger_queue = 100
var daggers = []
var create_dagger = function() {
    var direction = getRand(0, 3)
    var x_pos = 2
    var y_pos = 13
    switch(direction) {
        case 0:
            y_pos = 15
            x_pos = getRand(1, 14)
            break
        case 1:
            y_pos = getRand(3, 14)
            x_pos = 0
            break
        case 2:
            y_pos = 2
            x_pos = getRand(1, 14)
            break
        case 3:
            y_pos = getRand(3, 14)
            x_pos = 15
            break
    }
    var dagger = {
        x: x_pos,
        y: y_pos,
        dir: direction,
        draw: function() {
            var id = 141
            var h_flip = false
            var v_flip = false
            if (dagger.dir == 1){
                id = 157
            } else if (dagger.dir == 2) {
                v_flip = true
            } else if (dagger.dir == 3) {
                h_flip = true
                id = 157
            }
            sprite(id, dagger.x*8, dagger.y*8, h_flip, v_flip)
        },
        move: function() {
            switch (dagger.dir){
                case 0:
                    dagger.y -= 1
                    break
                case 1:
                    dagger.x += 1
                    break
                case 2:
                    dagger.y += 1
                    break
                case 3:
                    dagger.x -= 1
                    break
            }
        }
    }

    daggers.push(dagger)
}
var make_dagger = function(amount) {
    var created = 0
    while(created < amount){
        create_dagger()
        created += 1
    }
}

var move_daggers = function(value, index, array) {
    value.move()
    if (value.x == player.x && value.y == player.y) {
        lives -= 1
        if (lives > 0){
            assets.bleeper.got_stab.play()
        }else {
            assets.bleeper.game_over.play()
        }
    }else if (value.y <= 2 || value.y >= 15){
        array.splice(index, 1)
    }else if(value.x <= 0 || value.x >= 15){
        array.splice(index, 1)
    }
}

var draw_daggers = function(value, index, array) {
    value.draw()
}

var tick = function() {
    ticks += 1
    steps += 1 
    score += 1 + get_bonus()
    last_tick_time = Date.now()
    switch(steps) {
        case 25:
            dagger_count += 1
            dagger_step = 4
            break
        case 49:
            dagger_count += 1
            dagger_step = 3
            break
        case 73:
            dagger_count += 1
            dagger_step = 2
            break
        case 101:
            dagger_count += 1
            dagger_step = 5
            steps = 0
            break
    }
    
    if (ticks%dagger_step == 0) make_dagger(dagger_count);
    daggers.forEach(move_daggers)

    cls()
    draw(map, 0, 0)
    player.draw()
    daggers.forEach(draw_daggers)
    println("Lives: " + lives.toString() + "   " + "Score: " + score.toString())
    println("Steps: " + ticks.toString())
    if (lives <= 0) game_over();
}

var game_over = function(){
    gamemode = 0
    cls()
    draw(smap, 0, 0)
    player.draw()
    daggers.forEach(draw_daggers)
    println("Lives: " + lives.toString() + "   " + "Score: " + score.toString())
    println("Steps: " + ticks.toString() + "   " + "GAME OVER")

    player.x = 8
    player.y = 8
    daggers = []
    dagger_count = 2
    dagger_step = 5
    lives = 5
    steps = 0
    ticks = 0
    score = 0
}

var get_bonus = function(){
        if (Date.now() <= last_tick_time + 1000){
            return 5
        }
        else if (last_tick_time <= Date.now + 2000) {
            return 4
        }
        else if (last_tick_time <= Date.now + 3000) {
            return 3
        }
        else if (last_tick_time <= Date.now + 4000) {
            return 2
        }
        else if (last_tick_time <= Date.now + 5000) {
            return 1
        }   
        else {
            return 0
        }
}

// Start Game
cls()
draw(smap, 0, 0)
println("Lives: " + lives.toString())
println("Steps: " + ticks.toString() + " Press ENTER to start!")
exports.update = function () {
    frames += 1
    player.control()


    //if (btnp.A) print("A Button");
    //if (btnp.B) print("B Button");
    //if (btnp.start) print("Start Button");
};
