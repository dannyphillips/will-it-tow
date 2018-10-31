import React, { Component } from 'react';
import Button from '../components/Button/Button';
import style from './style.css'
import Card from '../components/Card/Card';
class App extends Component {
  state = {  }
  render() {
    return (
      <div className={style.app}>
        <div className={style.title}>
          Will it Tow?
        </div>
        <div className={style.cardContainer}>
          <Card title={"Tow Vehicle"}>
            <label>Tow Capacity</label>
            <input value={"asfd"}/>
          </Card>
          <Card title={"Risk Rating"}>
            <label>Tow Risk</label>
            <input value={"asfd"}/>
          </Card>
          <Card title={"Trailer"}>
            <label>Dry / Unloaded Vehicle Weight(UVW)</label>
            <input value={"asfd"}/>
          </Card>
        </div>
      </div>
    );
  }
}

export default App;
