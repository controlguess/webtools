(async () => {
    const { default: GUI } = await import(
        "https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm"
    );

    window.myGUI = new GUI({
        title: "TitanLabs CC Classic"
    });

    const controls = {
        freeupgrades() {
          Object.values(Buyables).forEach(obj => {
            obj.price = 0
          });
        },
        autoclick: false,
        weirdcookie() {
          document.getElementById("cookie").style.background = "url(https://static.wikia.nocookie.net/cookieclicker/images/5/5a/PerfectCookie.png)";
        }
    };
  
    myGUI.add(controls, "autoclick").name("Auto Clicker");
    myGUI.add(controls, "freeupgrades").name("Free Upgrades");
    myGUI.add(controls, "weirdcookie").name("Break Cookie");
    

    let handlerLoop = setInterval(function() {
      document.getElementById("version").innerHTML = "<span>v.0.1251 - TitanLabs</span>";
      document.getElementById("rightPanel").style.zIndex = "0";

      if (controls.autoclick === true) {
        HoverCookie();
        ClickCookie();
      }
    }, 150);

})();
