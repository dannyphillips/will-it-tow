import React, { Component } from "react";
import style from "./style.css";
import { Card } from "../components";
import ReactSVG from "react-svg";

class App extends Component {
  state = {
    tow_cap: 0,
    trailer_weight: 0
  };
  calcRisk() {
    return this.state.tow_cap > this.state.trailer_weight ? "LOW" : "HIGH";
  }

  render() {
    return (
      <div className={style.appBorder}>
        <div className={style.app}>
          <div className={style.title}>Will it Tow?</div>
          <div className={style.cardContainer}>
            <Card title={"Trailer"}>
              <h2>Dry / Unloaded Vehicle Weight(UVW)</h2>
              <input
                type="number"
                className={style.entry}
                value={this.state.trailer_weight}
                onChange={evt =>
                  this.setState({
                    trailer_weight: evt.target.value,
                    tow_cap: Math.floor(evt.target.value / 3)
                  })
                }
              />lbs
              <ReactSVG
                src="static/campers/trailer3.svg"
                className={style.icon}
              />
            </Card>
            <Card title={"Risk Rating"}>
              <h2>Tow Risk</h2>
              <h1 className={style.result}>{this.calcRisk()}</h1>
            </Card>
            <Card title={"Tow Vehicle"}>
              <h2>Tow Capacity</h2>
              <input
                type="number"
                className={style.entry}
                value={this.state.tow_cap}
                onChange={evt =>
                  this.setState({
                    tow_cap: evt.target.value,
                    trailer_weight: Math.floor(evt.target.value / 4)
                  })
                }
              />lbs
              <ReactSVG
                src="static/campers/jeep.svg"
                className={style.icon}
              />
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
