import React from "react";
import * as handTrack from "handtrackjs";

const hasGetUserMedia = () => {
  return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
};

class Video extends React.Component {
  videoRef = React.createRef();
  intervalSub = null;
  handModel = null;

  state = {
    camera: false,
    hand: null,
    show: false,
  };

  hasGetUserMedia = () => {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  };

  componentDidMount() {
    if (hasGetUserMedia()) {
      this.setState((state) => ({
        ...state,
        camera: true,
      }));

      this.loadHandModel();
    }
  }

  loadHandModel() {
    const modelParams = {
      flipHorizontal: true,
      maxNumBoxes: 1,
      iouThreshold: 0.5,
      scoreThreshold: 0.7,
    };

    handTrack.load(modelParams).then((model) => {
      this.handModel = model;
    });
  }

  toggleHandControl() {
    if (this.state.show) {
      this.setState((state) => ({
        ...state,
        hand: null,
        show: false,
      }));

      if (this.intervalSub) {
        clearInterval(this.intervalSub);
        this.intervalSub = null;
      }
    } else {
      this.setState((state) => ({
        ...state,
        show: true,
      }));

      navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
        if (this.videoRef.current) {
          this.videoRef.current.srcObject = stream;
          this.detect();
        }
      });
    }
  }

  handControl(prediction) {
    if (this.state.hand && prediction) {
      let prev = this.state.hand;
      let current = prediction.bbox;

      let xDif = prev[0] + prev[2] - (current[0] + current[2]);
      let yDif = prev[1] + prev[3] - (current[1] + current[3]);

      let useX = Math.abs(xDif) > Math.abs(yDif);

      if (useX && Math.abs(xDif) > 35) {
        this.props.merge(xDif > 0 ? "LEFT" : "RIGHT");
      } else if (Math.abs(yDif) > 30) {
        this.props.merge(yDif > 0 ? "UP" : "DOWN");
      }
    }
  }

  detect() {
    let video = document.getElementById("videoElement");
    this.intervalSub = setInterval(() => {
      this.handModel
        .detect(video)
        .then((predictions) => {
          this.handControl(predictions[0]);
          this.setState((state) => ({
            ...state,
            hand: predictions.length ? predictions[0].bbox : null,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
  }

  renderToggle() {
      let show = this.state.show
    return (
      <React.Fragment>
        <h3>
          {show ? "Turn Hand Motion Off" : "Turn Hand Motion On"}
        </h3>
        <div className={"toggle" + (show ? " active" : "")} onClick={() => this.toggleHandControl()}>
            <div className="inner-toggle"></div>
        </div>
      </React.Fragment>
    );
  }

  render() {
    const showToggle = this.state.camera && !this.state.show;
    if (showToggle) {
      return this.renderToggle();
    } else if (this.state.show) {
      return (
        <React.Fragment>
          {this.renderToggle()}
          <video
            width={250}
            height={170}
            autoPlay={true}
            id="videoElement"
            ref={this.videoRef}
          ></video>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default Video;
