(function dinosoarmain(){
    function l(s){console.log(s);}
    function aa(a1,a2){
        return [a1[0]+a2[0], a1[1]+a2[1]];
    }
    //
    function $pos($s){
        return [parseFloat($s.css('left').replace('px','')),
        parseFloat($s.css('top').replace('px',''))];
    }
var viewport = {
        class: 'root',
        getScreen: function(){ return [window.innerWidth, window.innerHeight]; },
        fitToScreen: function(){
            var scrn = viewport.getScreen();
            viewport
                .get()
                .css({
                    width: scrn[0]+'px',
                    height: scrn[1]+'px'
                })
        },
        get: function(){ return $('.'+viewport.class); },
        make: function(){
            $('body').html('<div class="' + viewport.class + '">This is the stage</div>');
        }
    },

    controls = {
        key_state:{},
        mousePressed: false,
        keydown: function(e){ controls.key_state[e.keyCode] = true; },
        keyup: function(e){ controls.key_state[e.keyCode] = false; },
        mouseup: function(){ controls.mousePressed = false;},
        mousedown: function(){controls.mousePressed = true;},

        getkey: function(code){ return controls.key_state[e.keyCode];  },

        setup: function(){
            $(window).keydown(controls.keydown);
            $(window).keyup(controls.keyup);
            $(document).mouseup(controls.mouseup);
            $(document).mousedown(controls.mousedown);
        }
    },

    player = {
        class: 'player',
        bound: [0, 0],
        origin: [0,0],
        v: [0,0],
        jumpV: [0, -62],
        gravityV: [0, 33],
        fallSpeedlimit: 5,
        get: function(){ return $('.'+player.class); },

        getPos: function(){ var off = player.get().offset(); return [off.left, off.top]; },
        grounded: function() {
            return player.getPos()[1] >= player.origin[1];
        },
        fitToScreen: function(){
            // base position is 2/3 height, 1/3 width
            var scrn = viewport.getScreen(),
                width = scrn[0]*1/5;
            player.origin = [scrn[0] * 1/10, scrn[1] * 2/3];
            player.bound = [width, width];
            player
                .get()
                .css({
                    left: player.origin[0]+'px',
                    top: player.origin[1]+'px',
                    width: player.bound[0]+'px',
                    height: player.bound[1]+'px'
                });
        },
        make: function(){
            viewport
                .get()
                .append('<div class="'+player.class+'">This is the player</div>');
        },

        // what it does during one frame
        step: function(){

            var p = player.get(),
                o = p.offset(),
                pos = $pos(p);

            if(controls.mousePressed && player.grounded() && player.v[1] <=0){


                var nev = player.v[1] + (player.jumpV[1]*game.timeDelta);
                //l(nev);
                player.v[1] = nev;
            }
            if(!player.grounded()){
                player.v[1] += player.gravityV[1]*game.timeDelta;
            }
            pos = aa(pos, player.v);

            // can't go beneith floor
            if(pos[1]>=player.origin[1]){
                pos[1] = player.origin[1];
                player.v[1] = 0;
                //l('reset');
            }

            p.css({
                'background-position-x':'-66%',
                'left':pos[0]+'px',
                'top':pos[1]+'px'
            });
        }
    },

    game = {
        time: 0,
        timeLast: 0,
        timeDelta: 0.016,
        loop: function(time){

            game.time = time;
            game.timeDelta = (game.time - game.timeLast)/1000;
            game.timeLast = game.time;
            player.step();
            window.requestAnimationFrame(game.loop);
        }
    };


// make a place to put things
controls.setup();

viewport.make();
viewport.fitToScreen();

// make player
player.make();
player.fitToScreen();

// when screen changes refit stuff
$(window).resize(function(){ viewport.fitToScreen(); player.fitToScreen(); });

window.requestAnimationFrame(game.loop);
}());
