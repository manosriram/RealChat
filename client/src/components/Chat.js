import io from "socket.io-client";
import "./Chat.css";
import React, { Component } from "react";
let socket = io(`http://localhost:5000`);
const axios = require("axios");

class Chat extends Component {
  constructor() {
    axios
      .post("/getOnlineUsers")
      .then(res => {
        this.setState({ online: res.data });
      })
      .catch(err => console.log(err));
    super();
    this.handleClick = this.handleClick.bind(this);
    this.checkOnline = this.checkOnline.bind(this);

    this.state = {
      online: 0,
      data: {},
      per: ""
    };
  }

  handleClick() {
    let feedback = document.getElementById("feedback");
    if (this.refs.message.value != "") {
      this.setState({ danger: 0 });
      socket.emit("chat", {
        message: this.refs.message.value,
        handle: this.props.name
      });
    }
    axios
      .post("/getOnlineUsers")
      .then(res => this.setState({ online: res.data }))
      .catch(err => console.log(err));
    this.refs.message.value = "";
  }

  checkOnline() {
    axios
      .post("/getOnlineUsers")
      .then(res => this.setState({ online: res.data }))
      .catch(err => console.log(err));
  }

  componentDidMount() {
    let output = document.getElementById("output");
    let feedback = document.getElementById("feedback");
    let message = document.getElementById("message");

    socket.on("chat", data => {
      this.setState({ data });
      output.innerHTML += `<h3><strong><u>${
        this.state.data.handle
      }</u> </strong> : ${this.state.data.message}</h3>`;

      axios
        .post("/getOnlineUsers")
        .then(res => this.setState({ online: res.data.result.users }))
        .catch(err => console.log(err));
    });

    message.addEventListener("keypress", () => {
      socket.emit("typing", `${this.props.name}`);
    });

    message.addEventListener("onkeyup", () => {
      socket.emit("released", "");
    });

    //   socket.on("typing", person => {
    //     this.setState({ per: person });
    //     feedback.innerHTML = `<p><strong>${
    //       this.state.per
    //     } is typing..</strong></p>`;
    //   });
    // }
  }
  render() {
    return (
      <div>
        <h1>Hey from Chat.JS</h1>
        {this.state.online === 1 && <h3>{this.state.online} User Online</h3>}
        {this.state.online > 1 && <h3>{this.state.online} Users Online</h3>}
        <div className="output" id="output" ref="output">
          {/* <div className="online" id="online"> */}
          {/* <h1>Online Users.</h1> */}
          {/* {this.state.online.map((user, ind) => {
              return <h3 key={ind}>{user}</h3>;
            })} */}
          {/* </div> */}
        </div>

        <br />
        <br />
        <div className="ui container">
          <div class="ui input">
            <input
              type="text"
              name="message"
              placeholder="Enter Message.."
              id="message"
              ref="message"
              onChange={this.checkOnline}
            />
          </div>
          <br />
          <br />
          <button onClick={this.handleClick} className="ui black button">
            Send
          </button>
        </div>
      </div>
    );
  }
}

export default Chat;
