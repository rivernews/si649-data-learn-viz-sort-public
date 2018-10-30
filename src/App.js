import React, { Component } from 'react';

import * as RandomHelper from "./helpers/random";

import './App.scss';

import AnimatedSortBars from "./components/animated-sort-bars/animated-sort-bars";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: RandomHelper.generateRandomIntegers(400, 40),
            svgSize: {
                width: 900,
                height: 350,
            }
        };
    }

    random = () => {
        this.setState((prevState) => ({
            data: RandomHelper.generateRandomIntegers(400, 40)
        }))
    }

    shuffle = () => {
        this.setState((prevState) => ({
            data: prevState.data.sort((a, b) => {
                return (a.value - b.value > 0) ? 1: -1 ;
            })
        }))
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h2>D3 Board</h2>
                </header>
                <div>
                    <AnimatedSortBars
                        data={ this.state.data }
                        svgSize = { this.state.svgSize }
                    >
                    </AnimatedSortBars>
                </div>
                <div>
                    <button onClick={this.random}>Random</button>
                    <button onClick={this.shuffle}>Sort</button>
                </div>
            </div>
        );
    }
}

export default App;
