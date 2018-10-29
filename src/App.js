import React, { Component } from 'react';

import * as RandomHelper from "./helpers/random";

import './App.scss';

import AnimatedSortBars from "./components/animated-sort-bars/animated-sort-bars";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: RandomHelper.generateRandomIntegers(30),
            svgSize: {
                width: 500,
                height: 350,
            }
        };
    }

    shuffle = () => {
        this.setState((prevState) => ({
            data: RandomHelper.generateRandomIntegers(30)
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
                    <button onClick={this.shuffle}>Hello</button>
                </div>
            </div>
        );
    }
}

export default App;
