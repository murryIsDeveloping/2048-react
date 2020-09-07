import React from "react";
import PlusMinus from "../utility/PlusMinus";
import Video from "./Video";

const ToolBar = (props) => {
  return (
    <div className="toolbar">
        <div className="toolbar-row">
        <h2 className="title">2048</h2> <button onClick={props.reset}>&#8634;</button>
        </div>
      <div className="toolbar-row">
        <div className="toolbar-controller">
          <span>Change Grid Size:</span>
          <PlusMinus
            value={props.size}
            valueChanged={props.sizeCtl}
          ></PlusMinus>
        </div>
        <div className="toolbar-controller">
          <span>Use Hand Motion Controls:</span>
          <Video merge={props.merge}></Video>
        </div>
      </div>
    </div>
  );
};

export default ToolBar;
