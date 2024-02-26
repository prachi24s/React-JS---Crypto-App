import { Button } from "antd";
import { Component } from "react";

//Lifecycle method/hook
class Temporary extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
      error: "",
    };
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }

  increment() {
    this.setState({ count: this.state.count + 1 });
  }

  decrement() {
    this.setState({ count: this.state.count - 1 });
  }

  // 1.
  componentDidMount() {
    console.log("This Called");
    setTimeout(() => {
      this.setState({ count: 1 });
    }, 5000);
  }

  //2.
  componentDidUpdate(prevProps, prevState) {
    console.log("This called 33: , ", prevState, this.state);
    if (prevState.count !== this.state.count && this.state.count > 3) {
      this.setState({ error: "This is above the limit" });
    }
  }

  //3.
  componentWillUnmount() {
    console.log("Called");
  }

  render() {
    return (
      <div
        style={{
          margin: 50,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div>Counter: {this.state.count}</div>
        <div>{this.state.error}</div>
        <div style={{ display: "flex", gap: 16 }}>
          <Button onClick={this.decrement}>Decrement</Button>
          <Button onClick={this.increment}>Increment</Button>
        </div>
      </div>
    );
  }
}

export default Temporary;