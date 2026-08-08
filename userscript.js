// ==UserScript==
// @name         TitanLabs iOS
// @description  iOS Cookie clicker cheat menu
// @author       Discord @hugkiro
// @version      1.02
// @match        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// @inject-into  content
// ==/UserScript==

(() => {
    const load = () => {
        if (typeof Game !== "undefined" && typeof Game.LoadMod === "function") {
            Game.LoadMod("https://webtools-eight.vercel.app/kiu.js");
            return;
        }

        setTimeout(load, 250);
    };

    load();
})();
