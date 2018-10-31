import React, { Component } from 'react';

import * as RandomHelper from "./helpers/random";

import './App.scss';

import AnimatedSortBars from "./components/animated-sort-bars/animated-sort-bars";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: this.generateData(),
            svgSize: {
                width: 900,
                height: 350,
            },
            swapTransition: 3,
            highlightedBarIds: []
        };
    }

    resetData = () => {
        this.setState((prevState) => ({
            data: this.generateData()
        }))
    }

    generateData() {
        return RandomHelper.generateRandomIntegers(90, 40);
    }

    onStartSortClick = () => {
        this.bubbleSort();
    }

    async bubbleSort() {
        let i = 0, j = 0, n = this.state.data.length;

        if (this.state.data.length === 0) return;

        for (i = 0; i < n; i++) {
            for (j = 0; j < n - 1; j++) {
                if (this.state.data[j].value > this.state.data[j + 1].value) {
                    await this.swap(j, j + 1);
                }
            }
        }

        await this.clearMarkedBars();
    }

    async clearMarkedBars() {
        return new Promise((resolve, reject) => {
            this.setState((state) => {
                resolve()
                return {
                    highlightedBarIds: []
                }
            });
        });
    }

    async swap (index1, index2) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                this.setState((state) => {
                    let temp = Object.assign(state.data[index1])
                    state.data[index1] = state.data[index2]
                    state.data[index2] = temp
                    state.highlightedBarIds = [
                        state.data[index1].id,
                        state.data[index2].id
                    ]
                    
                    resolve();
                    return state;
                });
            }, this.state.swapTransition * 2);
        });
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h2>D3 Board</h2>
                </header>
                <div>
                    <AnimatedSortBars
                        data={this.state.data}
                        svgSize={this.state.svgSize}
                        swapTransition={this.state.swapTransition}
                        highlightedBarIds={this.state.highlightedBarIds}
                    >
                    </AnimatedSortBars>
                </div>
                <div>
                    <AnimatedSortBars
                        data={this.state.data}
                        svgSize={this.state.svgSize}
                        swapTransition={this.state.swapTransition}
                        highlightedBarIds={this.state.highlightedBarIds}
                    >
                    </AnimatedSortBars>
                </div>
                <div>
                    <button onClick={this.resetData}>Reset Dataset</button>
                    <button onClick={this.onStartSortClick}>Start Sort</button>
                </div>
            </div>
        );
    }
}

export default App;
