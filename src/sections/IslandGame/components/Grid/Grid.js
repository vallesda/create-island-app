import React from 'react'
import { Card } from 'antd';
import Cell from './components/Cell/Cell'
import './Grid.css'
import PropTypes from 'prop-types'
import { defaultGrid } from "../../../../lib/constants"

export default class Grid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      grid: [],
    }

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.updateAndNotify = this.updateAndNotify.bind(this);
  }

  componentDidMount() {
    this.setState({
      grid: this.props.grid
    })
  }

  componentDidUpdate(prevProps) {
    if (prevProps.gridHeight !== this.props.gridHeight
        || prevProps.gridWidth !== this.props.gridWidth) {
        this.updateAndNotify();
    }
  }

  updateAndNotify() {
    const initialGrid = this.generateGrid();
    this.setState({
      grid: initialGrid
    });
  }

  generateGrid() {
    const { grid, gridHeight, gridWidth } = this.props;
    let initialGrid = [];
    for (let row = 0; row < gridHeight; row++) {
      let initRow = [];
      for (let col = 0; col < gridWidth; col++) {
        initRow.push(grid[row][col]);
      }

      initialGrid.push(initRow);
    }

    return initialGrid;
  }

  handleMouseDown(row, col) {
    const newGrid = this.generateNewGrid(this.state.grid, row, col);
    this.setState({
      grid: newGrid
    })
    
    this.props.onChange(this.state.grid);
  }

  //TODO
  handleMouseUp(row, col) {

  }

  generateNewGrid(grid, row, col) {
    const newGrid = grid.slice();
    const cell = newGrid[row][col];
    newGrid[row][col] = this.toggleCell(cell);
    return newGrid;
  }

  toggleCell(cell) {
    return {
      ...cell,
      isEmpty: !cell.isEmpty
    }
  }

  render() {
    const { grid } = this.state;
    return (
      <Card title='Map'>
        <div className="grid"> 
        {
          grid.map((row, rowId) => {
            return (
              <div 
              key={rowId}
              className="grid-row">
                {
                  row.map((cell, cellId) => {
                    const { col, row, isEmpty } = cell
                    return (
                      <Cell
                        key={cellId}
                        col={col}
                        row={row}
                        isEmpty={isEmpty}
                        onMouseDown={(row, col) => this.handleMouseDown(row, col)}
                        onMouseUp={(row, col) => this.handleMouseUp(row, col)}>
                      </Cell>
                    )
                  })
                }
              </div>
            )
          })
        }
        </div>
      </Card>
    )
  }
}

Grid.propTypes = {
  onChange: PropTypes.func.isRequired,
  gridHeight: PropTypes.number.isRequired,
  gridWidth: PropTypes.number.isRequired,
  restart: PropTypes.bool,
}