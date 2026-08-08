Game.fps = 60;
Game.Notify('Titan Labs', 'FPS Has been unlocked', [11, 5]);

Game.bakeryName = "TitanLabs";
Game.bakeryNameRefresh();

(async () => {
    const { default: GUI } = await import(
        "https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm"
    );

    window.myGUI = new GUI({
        title: "Titan Labs"
    });

    const controls = {
        infbuilds() {
            Game.ObjectsById.forEach(obj => {
                obj.amount = 1000;
            });
        },

        infcookies() {
            Game.cookies = Infinity;
        },

        autoclicker: false,

        spawngoldcookie() {
            new Game.shimmer('golden');
        },

        gstatus: 0,

        resetganger() {
            Game.ResetGrandmas();
        },

        gmapoc() {
            Game.ToggleGrandmapocalypse();
        },

        wrinklerlimit: 12,

        killwrinklers() {
            Game.wrinklers.forEach(me => me.hp = 0);
        },

        resetgame() {
            Game.HardReset();
        },
    };

    myGUI.add(controls, "resetgame").name("Reset Progress");
    myGUI.add(controls, "infbuilds").name("Infinite Buildings");
    myGUI.add(controls, "infcookies").name("Infinite Cookies");
    myGUI.add(controls, "spawngoldcookie").name("Spawn Golden Cookie");
    myGUI.add(controls, "autoclicker");

    myGUI.add(controls, "gstatus", { Appeased:0, Awoken:1, Displeased:2, Angered:3 }).name("Grandmatriarch Status");
    myGUI.add(controls, "resetganger").name("Reset Grandma Anger");
    myGUI.add(controls, "gmapoc").name("Toggle Grandmapocalypse");

    myGUI.add(controls, "wrinklerlimit", 0, 99, 1).name("Wrinkler Limit");
    myGUI.add(controls, "killwrinklers").name("Kill Wrinklers");

    

    let handlerLoop = setInterval(function() {
        Game.wrinklerLimit = controls.wrinklerlimit;
        
        if (controls.autoclicker === true) {
            Game.lastClick = 0;
            document.getElementById('bigCookie').click();
        }
    }, 50);

})();
