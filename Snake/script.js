function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  
  const start = {
    active: true,
    speed: 120, // ms
    direction: "right",
    snake: [
      [50, 70],
      [60, 70],
      [70, 70],
      [80, 70]
    ], // Start with 4 block snake
    food: [200, 70],
    score: 0,
    high_score: localStorage.getItem("high_score")
  };
  
  
  class App extends React.Component {
    constructor(props) {
      super(props);
      _defineProperty(this, "startStop",
        manual => {
          let active = this.state.active;
          if (manual) {
            this.setState({
              active: !active
            });
          }
          if (!active) {
            this.interval = setInterval(() => this.updateSnake(), this.state.speed);
          } else {
            clearInterval(this.interval);
            let high_score = this.state.high_score;
            if (this.state.score > high_score) {
              high_score = this.state.score;
            }
            localStorage.setItem("high_score", high_score);
            this.setState({
              active: false,
              speed: 120, // ms
              direction: "right",
              snake: [
                [50, 70],
                [60, 70],
                [70, 70],
                [80, 70]
              ], // Start with 4 block snake
              food: [200, 70],
              score: 0,
              high_score: high_score
            });
          }
        });
      _defineProperty(this, "handleKeys",
        event => {
          let currentD = this.state.direction;
          console.log(currentD);
          let active = this.state.active;
          if (event.keyCode === 13) {
            this.startStop(true);
          }
          if (event.keyCode === 37 && currentD != "right") {
            this.setState({
              direction: "left"
            });
            this.swapClass();
          }
          if (event.keyCode === 39 && currentD != "left") {
            this.setState({
              direction: "right"
            });
            this.swapClass();
          }
          if (event.keyCode === 38 && currentD != "down") {
            this.setState({
              direction: "up"
            });
            this.swapClass();
          }
          if (event.keyCode === 40 && currentD != "up") {
            this.setState({
              direction: "down"
            });
            this.swapClass();
          }
        });
      _defineProperty(this, "speedUp",
        () => {
          let speed = this.state.speed;
          if (speed > 50) {
            speed = speed - 2;
          }
          clearInterval(this.interval);
          this.interval = setInterval(() => this.updateSnake(), speed);
          this.setState({
            speed: speed
          });
        });
      _defineProperty(this, "swapClass",
        () => {
          var root = document.getElementById("root");
          root.className = "";
          root.className = this.state.direction;
        });
      this.state = start;
    }
    updateSnake() {
      var direction = this.state.direction;
      var currentSnake = this.state.snake;
      var snakeHead = currentSnake[currentSnake.length - 1];
      var newHead = [];
      var target = this.state.food;
      switch (direction) {
        case "up":
          newHead = [snakeHead[0], snakeHead[1] - 10];
          break;
        case "right":
          newHead = [snakeHead[0] + 10, snakeHead[1]];
          break;
        case "down":
          newHead = [snakeHead[0], snakeHead[1] + 10];
          break;
        case "left":
          newHead = [snakeHead[0] - 10, snakeHead[1]];
          break;
        default:
          newHead = [snakeHead[0], snakeHead[1]];
      }
      currentSnake.push(newHead);
      currentSnake.forEach((val, i, array) => { // As long as its not checking against itself...
        if (i != array.length - 1) { // Check if its colluding with its body
          if (val.toString() == newHead.toString()) { // Head has collided with body
            this.startStop(true);
          }
        }
      }); // collusion detection
      if (newHead[0] > 390 || newHead[0] < 0 || newHead[1] > 320 || newHead[1] < 30) { 
        let teleHead = currentSnake[currentSnake.length - 1];
        if (newHead[0] > 390) {
          teleHead[0] = teleHead[0] - 400;
          currentSnake.shift();
        }
        if (newHead[0] < 0) {
          teleHead[0] = teleHead[0] + 400;
          currentSnake.shift();
        }
        if (newHead[1] > 320) {
          teleHead[1] = teleHead[1] - 300;
          currentSnake.shift();
        }
        if (newHead[1] < 30) {
          teleHead[1] = teleHead[1] + 300;
          currentSnake.shift();
        }
      } else { // If food is eaten
        if (newHead[0] == target[0] && newHead[1] == target[1]) {
          let posX = Math.floor(Math.random() * (380 - 10 + 1)) + 10;
          let posY = Math.floor(Math.random() * (280 - 40 + 1)) + 40;
          posX = Math.ceil(posX / 10) * 10;
          posY = Math.ceil(posY / 10) * 10;
          this.setState(prevState => ({
            snake: currentSnake,
            food: [posX, posY],
            score: prevState.score + 1
          }));
        } else {
          currentSnake.shift();
          if (this.state.active) {
            this.setState({
              snake: currentSnake
            });
          }
        }
      }
    }
    componentDidMount() {
      this.swapClass();
      document.addEventListener("keydown", this.handleKeys, false);
      if (this.state.active) {
        this.startStop(false);
      }
    }
    componentDidUpdate(prevProps, prevState) { 
      let score = this.state.score;
      if (score % 3 == 0 && score > 0 && score != prevState.score) {
        this.speedUp();
      }
      document.addEventListener("keydown", this.handleKeys, false);
    }
    componentWillUnmount() {
      clearInterval(this.interval);
    }
    render() {
      var theSnake = this.state.snake;
      var food = this.state.food;
      return  React.createElement(React.Fragment, null,  React.createElement(Menu, {
          active: this.state.active
        }), 
        React.createElement(Score, {
          score: this.state.score,
          high_score: this.state.high_score
        }),
        theSnake.map((val, i) => 
          React.createElement(Part, {
            transition: this.state.speed,
            direction: this.state.direction,
            top: val[1],
            left: val[0]
          })), 
        React.createElement(Food, {
          top: food[1],
          left: food[0]
        }));
    }
  }
  class Score extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      let snake = this.props.snake;
      return  (
        React.createElement("div", {
            className: "score"
          }, 
          React.createElement("span", null, "Pontuação: ", 
            React.createElement("strong", null, this.props.score)), 
          React.createElement("span", null, "Pontuação maxima: ", 
            React.createElement("strong", null, this.props.high_score))));
    }
  }
  class Part extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    render() {
      var classes = "part " + this.props.direction;
      return  (
        React.createElement("article", {
          style: {
            transition: this.props.transition + 50 + "ms",
            top: this.props.top + "px",
            left: this.props.left + "px"
          },
          className: classes
        }));
    }
  }
  class Food extends React.Component {
    constructor(props) {
      super(props);
    }
    render() {
      return  (
        React.createElement("div", {
          style: {
            top: this.props.top + "px",
            left: this.props.left + "px"
          },
          className: "food"
        }));
    }
  }
  class Menu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
    render() {
      var menu_list = this.props.active ? "menu hidden" : "menu";
      return  (
        React.createElement("div", {
            className: menu_list
          }, "Aperte ", 
          React.createElement("span", null, "enter"), " para começar",  React.createElement("br", null), 
          React.createElement("span", null, "setas direcionais"), " Para controlar"));
    }
  }
  ReactDOM.render(  React.createElement(App, null), document.getElementById("root"));