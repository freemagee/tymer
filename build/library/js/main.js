function pad(s, size) {
  let o = s.toString();
  while (o.length < (size || 2)) {
    o = `0${o}`;
  }
  return o;
}

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;
const RenderTime = React.createClass({
  countdown: null,
  countdownTime: 0,
  componentWillReceiveProps(nextProps) {
    if (nextProps.timerState === "stopped") {
      this.countdownStop();
    }
  },
  countdownStart(m, s) {
    const targetTime = m * 60 + s * 1;

    this.updateState("started");
    this.countdownTime = targetTime * 1000;
    this.countdown = setInterval(this.countdownCalculate, 1000);
  },
  countdownStop() {
    clearInterval(this.countdown);
  },
  countdownComplete() {
    this.countdownStop();
    this.updateState("stopped");
  },
  countdownPause() {
    this.countdownStop();
    this.updateState("paused");
  },
  countdownRestart() {
    this.countdown = setInterval(this.countdownCalculate, 1000);
    this.updateState("started");
  },
  countdownCalculate() {
    if (this.countdownTime === 0) {
      this.countdownComplete();
      return;
    }

    this.countdownTime = this.countdownTime - 1000;

    const remainingSecs = this.calculateRemainingSeconds(this.countdownTime);
    let remainingMins = Math.floor(this.countdownTime / 60000);
    const remainingHours = Math.floor(this.countdownTime / 3600000);

    // Deal with 60 mins equalling 1 hour & 1 hour equalling 00 mins in time format 01:00:00
    if (remainingHours >= 1) {
      remainingMins = 60;
    }

    this.updateTime(pad(remainingMins), pad(remainingSecs));
  },
  calculateRemainingSeconds(ms) {
    const secs = ms / 1000;
    const mins = secs / 60;

    return Math.round((mins % 1) * 60);
  },
  handleClick() {
    if (this.props.timerState !== "started") {
      this.countdownStart(
        parseInt(this.props.minutes, 10),
        parseInt(this.props.seconds, 10)
      );
    } else if (this.props.timerState === "paused") {
      this.countdownRestart();
    } else {
      this.countdownPause();
    }
  },
  updateTime(m, s) {
    this.props.updateTime(m, s);
  },
  updateState(state) {
    this.props.updateState(state);
  },
  render() {
    return React.createElement(
      "div",
      { className: "timeContainer", onClick: this.handleClick },
      React.createElement("div", {
        className: "number number--mins",
        children: this.props.minutes
      }),
      React.createElement("div", {
        className: "number__seperator",
        children: ":"
      }),
      React.createElement("div", {
        className: "number number--secs",
        children: this.props.seconds
      })
    );
  }
});

const SetSecondsUI = React.createClass({
  getInitialState() {
    return {
      seconds: this.props.seconds
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ seconds: nextProps.seconds });
    }
  },
  increaseSeconds() {
    const currentSecs = parseInt(this.state.seconds, 10);
    let newSecs = 0;

    if (currentSecs >= 59) {
      newSecs = "00";
    } else {
      newSecs = pad(currentSecs + 1);
      String(newSecs);
    }

    this.props.onChange(newSecs);
  },
  decreaseSeconds() {
    const currentSecs = parseInt(this.state.seconds, 10);
    let newSecs = 0;

    if (currentSecs === 0) {
      newSecs = "59";
    } else {
      newSecs = pad(currentSecs - 1);
      String(newSecs);
    }

    this.props.onChange(newSecs);
  },
  handleChange(value) {
    clearTimeout(this.timer);

    this.setState({ seconds: value.target.value });

    this.timer = setTimeout(
      this.triggerChange,
      WAIT_INTERVAL,
      value.target.value
    );
  },
  handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY) {
      this.triggerChange(e);
    }
  },
  triggerChange(v) {
    const parsedVal = parseInt(v, 10);
    let newVal = "";

    if (parsedVal > 60) {
      newVal = "59";
    } else if (parsedVal <= 0) {
      newVal = "00";
    } else if (Number.isInteger(parsedVal)) {
      newVal = v;
    } else {
      newVal = "00";
    }

    this.props.onChange(newVal);
  },
  render() {
    return React.createElement(
      "div",
      { className: "setSeconds" },
      React.createElement("button", {
        className: "setSeconds__btn setSeconds__btn--minus",
        children: "-",
        onClick: this.decreaseSeconds
      }),
      React.createElement("input", {
        className: "setSeconds__input",
        value: this.state.seconds,
        onChange: this.handleChange,
        onKeyDown: this.handleKeyDown
      }),
      React.createElement("button", {
        className: "setSeconds__btn setSeconds__btn--plus",
        children: "+",
        onClick: this.increaseSeconds
      })
    );
  }
});

const SetMinutesUI = React.createClass({
  getInitialState() {
    return {
      minutes: this.props.minutes
    };
  },
  componentWillReceiveProps(nextProps) {
    if (this.props !== nextProps) {
      this.setState({ minutes: nextProps.minutes });
    }
  },
  increaseMinutes() {
    const currentMins = parseInt(this.state.minutes, 10);
    let newMins = 0;

    if (currentMins >= 59) {
      newMins = "00";
    } else {
      newMins = pad(currentMins + 1);
      String(newMins);
    }

    this.props.onChange(newMins);
  },
  decreaseMinutes() {
    const currentMins = parseInt(this.state.minutes, 10);
    let newMins = 0;

    if (currentMins === 0) {
      newMins = "59";
    } else {
      newMins = pad(currentMins - 1);
      String(newMins);
    }

    this.props.onChange(newMins);
  },
  handleChange(value) {
    clearTimeout(this.timer);

    this.setState({ minutes: value.target.value });

    this.timer = setTimeout(this.triggerChange, WAIT_INTERVAL);
  },
  handleKeyDown(e) {
    if (e.keyCode === ENTER_KEY) {
      this.triggerChange(e);
    }
  },
  triggerChange() {
    const parsedVal = parseInt(this.state.minutes, 10);
    let newVal = "";

    if (parsedVal > 60) {
      newVal = "59";
    } else if (parsedVal <= 0) {
      newVal = "00";
    } else if (Number.isInteger(parsedVal)) {
      newVal = this.state.minutes;
    } else {
      newVal = "00";
    }

    this.props.onChange(newVal);
  },
  render() {
    return React.createElement(
      "div",
      { className: "setMinutes" },
      React.createElement("button", {
        className: "setMinutes__btn setMinutes__btn--minus",
        children: "-",
        onClick: this.decreaseMinutes
      }),
      React.createElement("input", {
        className: "setMinutes__input",
        value: this.state.minutes,
        onChange: this.handleChange,
        onKeyDown: this.handleKeyDown
      }),
      React.createElement("button", {
        className: "setMinutes__btn setMinutes__btn--plus",
        children: "+",
        onClick: this.increaseMinutes
      })
    );
  }
});

const ResetTimer = React.createClass({
  propTypes: {
    timerState: React.PropTypes.string
  },
  handleClick() {
    this.props.resetTime();
  },
  render() {
    const className =
      this.props.timerState !== "stopped"
        ? "resetTimeContainer isActive"
        : "resetTimeContainer";
    return React.createElement(
      "div",
      { className },
      React.createElement("button", {
        className: "resetTime",
        children: "Reset",
        onClick: this.handleClick
      })
    );
  }
});

const SetTimeUI = React.createClass({
  propTypes: {
    minutes: React.PropTypes.string,
    seconds: React.PropTypes.string
  },
  getInitialState() {
    return {
      timerState: "stopped",
      minutes: "01",
      seconds: "00",
      renderedMinutes: "01",
      renderedSeconds: "00"
    };
  },
  updateState(state) {
    if (state === "stopped") {
      this.setState({
        renderedMinutes: this.state.minutes,
        renderedSeconds: this.state.seconds
      });
    }
    this.setState({
      timerState: state
    });
  },
  setMinutes(m) {
    this.setState({
      minutes: m,
      renderedMinutes: m
    });
  },
  setSeconds(s) {
    this.setState({
      seconds: s,
      renderedSeconds: s
    });
  },
  updateTime(m, s) {
    this.setState({
      renderedMinutes: m,
      renderedSeconds: s
    });
  },
  resetTime() {
    this.setState({
      timerState: "stopped",
      minutes: "01",
      seconds: "00",
      renderedMinutes: "01",
      renderedSeconds: "00"
    });
  },
  generateAppClassName() {
    if (this.state.timerState === "started") {
      return "appContainer appContainer--started";
    } else if (this.state.timerState === "paused") {
      return "appContainer appContainer--paused";
    }

    return "appContainer";
  },
  render() {
    return React.createElement(
      "div",
      { className: this.generateAppClassName() },
      React.createElement(RenderTime, {
        timerState: this.state.timerState,
        updateState: this.updateState,
        minutes: this.state.renderedMinutes,
        seconds: this.state.renderedSeconds,
        updateTime: this.updateTime
      }),
      React.createElement(
        "div",
        { className: "setTimeContainer" },
        React.createElement(SetMinutesUI, {
          minutes: this.state.minutes,
          onChange: this.setMinutes
        }),
        React.createElement(SetSecondsUI, {
          seconds: this.state.seconds,
          onChange: this.setSeconds
        })
      ),
      React.createElement(ResetTimer, {
        timerState: this.state.timerState,
        resetTime: this.resetTime
      })
    );
  }
});

const rootElement = React.createElement(SetTimeUI);

ReactDOM.render(rootElement, document.getElementById("tymer-app"));
