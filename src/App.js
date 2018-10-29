import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import AnimatedSortBars from "./components/animated-sort-bars/animated-sort-bars";

class App extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h2>D3 Board</h2>
                </header>
                <div>
                    <AnimatedSortBars
                        data={ [5, 10, 1, 3] }
                        size={ [500, 500] }
                    >
                    </AnimatedSortBars>
                </div>
            </div>
        );
    }
}

export default App;
