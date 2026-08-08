import GUI from 'lil-gui';
const gui = new GUI();
const myObject = {
	pingFunction: function() {
        alert("Pong")
    }
};
gui.add(myObject, "pingFunction").name("Ping");
