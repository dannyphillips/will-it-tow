import React, { Component } from 'react';
import style from './style.css'
import { Button, Card } from '../components';
class App extends Component {
  state = {
    tow_cap: "",
    trailer_weight: "",
  }
  calcRisk() {
    return this.state.tow_cap > this.state.trailer_weight ? "low" : "high"
  }

  render() {
    return (
      <div className={style.app}>
        <div className={style.title}>
          <Button />
          Will it Tow?
        </div>
        <div className={style.cardContainer}>
          <Card title={"Tow Vehicle"}>
            <label>Tow Capacity</label>
            <input
              type="number"
              value={this.state.tow_cap}
              onChange={evt =>
                this.setState({
                  tow_cap: evt.target.value,
                  trailer_weight: evt.target.value/4
                })
              }
            />
          </Card>
          <Card title={"Risk Rating"}>
            <label>Tow Risk</label>
            {this.calcRisk()}
          </Card>
          <Card title={"Trailer"}>
            <label>Dry / Unloaded Vehicle Weight(UVW)</label>
            <input
              type="number"
              value={this.state.trailer_weight}
              onChange={evt =>
                this.setState({
                  trailer_weight: evt.target.value,
                  tow_cap: evt.target.value/3
                })
              }
            />
          </Card>
        </div>
      </div>
    );
  }
}

export default App;
