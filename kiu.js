const s = document.createElement("script");
s.src = "https://cdn.jsdelivr.net/npm/lil-gui@0.20/+esm";
s.type = "module";
document.head.appendChild(s);

import GUI from 'lil-gui';
const gui = new GUI();
const myObject = {
	pingFunction: function() {
        alert("Pong")
    }
};
gui.add(myObject, "pingFunction").name("Ping");
