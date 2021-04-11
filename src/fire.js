import firebase from 'firebase';

var firebaseConfig = {
    apiKey: "AIzaSyBRr9LZImaPB2Bu1CeaLlpEg1IaozBiQPU",
    authDomain: "avurudhu-game.firebaseapp.com",
    projectId: "avurudhu-game",
    storageBucket: "avurudhu-game.appspot.com",
    messagingSenderId: "982905446247",
    appId: "1:982905446247:web:e9be4df90e5522309919c2"
};

var fire = firebase.initializeApp(firebaseConfig);
export default fire;
