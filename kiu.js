(async () => {
    const { default: GUI } = await import(
        "https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm"
    );

    window.myGUI = new GUI({
        title: "Titan Labs"
    });

    const controls = {
        ping() {
            alert("Pong");
        },

        test() {
            console.log("Hello from GUI!");
        }
    };

    myGUI.add(controls, "ping").name("Ping");
    myGUI.add(controls, "test").name("Test");

    Game.fps = 60;
    Game.Notify('Titan Labs', 'FPS Has been unlocked', 3);
})();
