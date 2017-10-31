import React, { Component } from 'react';
import AddFishForm from './AddFishForm';
import PropTypes from 'prop-types';
import base from '../base';
import Firebase from 'firebase'

var github = new Firebase.auth.GithubAuthProvider();
github.addScope('repo');
var facebook = new Firebase.auth.FacebookAuthProvider();
facebook.addScope('user_birthday');
var twitter = new Firebase.auth.TwitterAuthProvider();
var google = new Firebase.auth.GoogleAuthProvider();
google.addScope('https://www.googleapis.com/auth/plus.login');

class Inventory extends Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.state = {
      uid: null,
      owner: null
    }
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    const updatedFish = {...fish, [e.target.name]: e.target.value}
    this.props.updateFish(key, updatedFish);
  }

  authenticate(provider) {
    Firebase.auth().signInWithPopup(provider).then(function(authData) {
      console.log(authData);
      const storeRef = Firebase.database().ref(this.props.storeId);
      storeRef.once('value', (snapshot) => {
        const data = snapshot.val() || {};

        if(!data.owner) {
          storeRef.set({
            owner: authData.user.uid
          });
        }

        this.setState({
          uid: authData.user.uid,
          owner: data.owner || authData.user.uid
        })
      })
    }).catch(function(error) {
    	console.error(error);
    });
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory</p>
        <button className="github" onClick={() => this.authenticate(github)}>Log In with GitHub</button>
        <button className="facebook" onClick={() => this.authenticate(facebook)}>Log In with Facebook</button>
        <button className="twitter" onClick={() => this.authenticate(twitter)}>Log In with Twitter</button>
        <button className="google" onClick={() => this.authenticate(google)}>Log In with Google</button>
      </nav>
    )
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    return(
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish Name"
          onChange={(e) => this.handleChange(e, key)}/>
        <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={(e) => this.handleChange(e, key)}/>
        <select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={(e) => this.handleChange(e, key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" name="desc" value={fish.desc} placeholder="Fish Desc" onChange={(e) => this.handleChange(e, key)}></textarea>
        <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={(e) => this.handleChange(e, key)}/>
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    const logout = <button>Log Out!</button>

    // Check to see if user is logged in
    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    // Check if user is owner of current store
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry, you aren't the owner of this store!</p>
          {logout}
        </div>
      )
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    )
  }
}

Inventory.propTypes = {
  addFish: PropTypes.func.isRequired,
  updateFish: PropTypes.func.isRequired,
  removeFish: PropTypes.func.isRequired,
  loadSamples: PropTypes.func.isRequired,
  fishes: PropTypes.object.isRequired,
  storeId: PropTypes.string.isRequired
}

export default Inventory;
