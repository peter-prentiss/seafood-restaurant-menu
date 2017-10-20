import Rebase from 're-base';
import Firebase from 'firebase';

const app = Firebase.initializeApp({
  apiKey: "AIzaSyClEu85JThsfNQCLLnIztj2QWl3Hq30EL8",
  authDomain: "catch-of-the-day-peter-p.firebaseapp.com",
  databaseURL: "https://catch-of-the-day-peter-p.firebaseio.com"
});

const base = Rebase.createClass(app.database());

export default base;
