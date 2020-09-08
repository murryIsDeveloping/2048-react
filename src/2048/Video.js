import React from "react";
import Toggle from "../utility/Toggle";
import * as handTrack from "handtrackjs";
import Draggable from "react-draggable";

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
      scoreThreshold: 0.85,
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

      let xDif = prev[0] - current[0];
      let yDif = prev[1] - current[1];

      let useX = Math.abs(xDif) > Math.abs(yDif);

      if (useX && Math.abs(xDif) > 30) {
        this.props.merge(xDif > 0 ? "LEFT" : "RIGHT");
      } else if (Math.abs(yDif) > 15) {
        this.props.merge(yDif > 0 ? "UP" : "DOWN");
      }
    }
  }

  detect() {
    this.intervalSub = setInterval(() => {
      let video = document.getElementById("videoElement");
      if(!video){
        return
      }

      this.handModel
        .detect(video)
        .then((predictions) => {
          this.handControl(predictions[0]);
          this.setState((state) => ({
            ...state,
            hand: predictions.length ? predictions[0].bbox : state.hand,
          }));
        })
        .catch((err) => {
          console.log(err);
        });
    }, 600);
  }

  render() {
    const showToggle = this.state.camera && !this.state.show;
    if (showToggle) {
      return (
        <Toggle
          show={this.state.show}
          onToggle={() => this.toggleHandControl()}
        ></Toggle>
      );
    } else if (this.state.show) {
      return (
        <React.Fragment>
          <Toggle
            show={this.state.show}
            onToggle={() => this.toggleHandControl()}
          ></Toggle>
          <Draggable>
            <div className="video-wrapper" draggable={true}>
                <video
                    width={280}
                    height={200}
                    autoPlay={true}
                    id="videoElement"
                    ref={this.videoRef}
                ></video>
            </div>
          </Draggable>
        </React.Fragment>
      );
    } else {
      return null;
    }
  }
}

export default Video;
