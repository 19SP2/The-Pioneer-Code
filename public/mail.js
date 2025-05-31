const firebaseConfig = {
    apiKey: "AIzaSyDSICZ4Yuj8EXENWR419d5mjnntKSYDu3Q",
    authDomain: "the-pioneer-f06fb.firebaseapp.com",
    databaseURL: "https://the-pioneer-f06fb-default-rtdb.firebaseio.com",
    projectId: "the-pioneer-f06fb",
    storageBucket: "the-pioneer-f06fb.firebasestorage.app",
    messagingSenderId: "462815100598",
    appId: "1:462815100598:web:dcd4e5ca0bbe4c61cdf017",
    measurementId: "G-TE3Z29HW97"
  };

firebase.initializeApp(firebaseConfig);
var contactFormDB = firebase.database().ref('pioneer')
document.getElementById('contactForm').addEventListener('submit', submitForm);
function submitForm(e) {
    e.preventDefault();

    var name = getVal('name');
    var email = getVal('email');
    var subject = getVal('subject');
    var message = getVal('message');

    console.log(name, email, subject, message);
    saveMessages(name, email, subject, message);
}

const saveMessages = (name, email, subject, message) => {
    var newContactForm = contactFormDB.push();

    newContactForm.set({
        name: name,
        email: email,
        subject: subject,
        message: message
    })
    .then(() => {
        document.getElementById('contactForm').reset();
        alert("Message sent successfully!");
    })
    .catch((error) => {
        console.error("Error sending message: ", error);
    });
}

const getVal = (id) => {
    return document.getElementById(id).value;
}