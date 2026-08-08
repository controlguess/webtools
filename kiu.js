import GUI from 'lil-gui'; 
const myObject = {
	pingFunction: function() {
        alert("Pong")
    }
};
gui.add( myObject, 'pingFunction' ).name('Ping');
