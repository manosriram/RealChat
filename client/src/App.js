import Chat from "./components/Chat";
import React, { Component } from "react";
import "./App.css";
const axios = require("axios");
var users = [];

class App extends Component {
  constructor() {
    super();
    this.state = {
      Onlineusers: 0,
      name: "",
      chat: 0,
      form: 1,
      receivedData: 0
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    if (this.refs.name.value != "") {
      axios
        .post("/getInfo/", { data: this.refs.name.value })
        .then(res => console.log(res))
        .catch(err => console.log(err));
      this.setState({ form: 0, name: this.refs.name.value });
    }
  }

  render() {
    if (this.state.form === 1) {
      return (
        <div className="App">
          <br />
          <br />
          <div className="ui container" id="cont">
            <h1 id="real">
              <strong>Real Chat</strong>
            </h1>
            <div class="ui input focus">
              <input
                type="text"
                placeholder="Enter Name."
                name="name"
                ref="name"
              />
            </div>
            <br />
            <br />

            <div class="ui animated button" tabindex="0">
              <div class="visible content">Go</div>
              <div class="hidden content">
                <i class="right arrow icon" onClick={this.handleClick} />
              </div>
            </div>
            {/* <button className="ui black button" onClick={this.handleClick}>
              Go
            </button> */}
          </div>
        </div>
      );
    } else {
      return <Chat name={this.state.name} />;
    }
  }
}
export default App;
