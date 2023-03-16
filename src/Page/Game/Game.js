import './game.css';
import React from 'react';
// class Square extends React.Component {
//     render() {
//         return (
//             <button className="square"
//                     onClick={() => {this.props.onClick()}}>
//                 {this.props.value}
//             </button>
//         );
//     }
// }
function Square(props) {
    return (
        <button className="square"
                onClick={props.onClick}>
            {props.value}
        </button>
    );
}
function calculateWinnerAny(board, player, row, col) {
    // 判断一行是否已经全部是同样的棋子
    const rowArr = board[row];
    let win = rowArr.every((val) => val === player);
    if (win) return true;

    // 判断一列是否已经全部是同样的棋子
    const colArr = board.map((r) => r[col]);
    win = colArr.every((val) => val === player);
    if (win) return true;

    // 判断左上到右下的斜线是否已经全部是同样的棋子
    // row === col 棋子在对角线上
    if (row === col) {
        const diagonalArr = board.map((r, i) => r[i]);
        win = diagonalArr.every((val) => val === player);
        if (win) return true;
    }

    // 判断右上到左下的斜线是否已经全部是同样的棋子
    // row + col === board.length - 1 棋子在对角线上
    if (row + col === board.length - 1) {
        const diagonalArr = board.map((r, i) => r[board.length - 1 - i]);
        win = diagonalArr.every((val) => val === player);
        if (win) return true;
    }

    return false;
}

// function calculateWinner(squares) {
//     const lines = [
//         [0, 1, 2],
//         [3, 4, 5],
//         [6, 7, 8],
//         [0, 3, 6],
//         [1, 4, 7],
//         [2, 5, 8],
//         [0, 4, 8],
//         [2, 4, 6],
//     ];
//     for (let i = 0; i < lines.length; i++) {
//         const [a, b, c] = lines[i];
//         if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
//             return squares[a];
//         }
//     }
//     return null;
// }

function Board(props){
    const renderColumns = (currentRow, columns, currentRowSquares, onClick) => {
        const columnContent = [];
        //需要将闭包的值传给onClick，而不是循环外的值，这会导致onClick是引用函数级别的key值(函数结束后的值)
        for (let i= 0; i < columns; i++) {
            columnContent.push(
                <Square key={`${currentRow}-${i}`} value={currentRowSquares[i]} onClick={()=>{onClick(currentRow, i) }}/>
            );
        }
        return columnContent;
    };
    const renderRows = (n, squares, onClick) => {
        const rowContent = [];
        for (let i = 0; i < n; i++) {
            rowContent.push(
                <div key={i} className="board-row">{renderColumns(i, n, squares[i], onClick)}</div>
            );
        }
        return rowContent;
    };
    return (
        <div>
            {renderRows(props.boardN, props.squares, props.onClick)}
        </div>
    );
}
// class Board extends React.Component {
//     renderSquare(i) {
//         return <Square value={this.props.squares[i]} onClick={()=>this.props.onClick(i)}/>;
//     }
//     render() {
//         return (
//             <div>
//                 <div className="board-row">
//                     {this.renderSquare(0)}
//                     {this.renderSquare(1)}
//                     {this.renderSquare(2)}
//                 </div>
//                 <div className="board-row">
//                     {this.renderSquare(3)}
//                     {this.renderSquare(4)}
//                     {this.renderSquare(5)}
//                 </div>
//                 <div className="board-row">
//                     {this.renderSquare(6)}
//                     {this.renderSquare(7)}
//                     {this.renderSquare(8)}
//                 </div>
//             </div>
//         );
//     }
// }

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history:[
                {
                    squares: Array(this.props.boardN).fill(Array(this.props.boardN).fill(null))
                }
            ],
            isX: true,
            winner: null,
            currentHistoryIndex: 0
        }
    }
    handlerClick(clickRow, clickColumn){
        let currentHistoryIndex = this.state.currentHistoryIndex;
        if(this.state.winner || this.state.history[currentHistoryIndex].squares[clickRow][clickColumn]){
            return;
        }

        let history = this.state.history.slice(0, currentHistoryIndex + 1);
        //数组是引用类型，slice是浅拷贝，因此如果是二维数组会导致复制了数组引用
        let currentSquares = history[currentHistoryIndex].squares.map(old=>old.slice());
        const chessman = this.state.isX ? 'X' : 'O';
        currentSquares[clickRow][clickColumn] = chessman;
        history = history.concat([{
            squares: currentSquares
        }]);

        const isWin = calculateWinnerAny(currentSquares, chessman, clickRow, clickColumn);
        if(isWin){
            this.setState({
                history: history,
                winner: chessman,
                currentHistoryIndex: currentHistoryIndex + 1
            });
            return;
        }
        this.setState({
            history: history,
            isX: (currentHistoryIndex + 1) % 2 === 0,
            currentHistoryIndex: currentHistoryIndex + 1
        });
    }
    recoverHistoryTo(step){
        const history = this.state.history.slice(0, step + 1);
        //winner未修改
        this.setState({
            history: history,
            currentHistoryIndex: step,
            isX: step % 2 === 0,
        });

    }
    getStatus(){
        if(this.isWin()){
            return  'Winner: ' + this.state.winner;
        }else{
            return 'Next player: ' + (this.state.isX ? 'X' : 'O');
        }
    }
    getHistoryLookup(history, currentHistoryIndex){
        return history.map((board, step)=>{
            const description = step !== 0 ?
                'Go to move #' + step :
                'Go to game start';
            return (
                <li key={step}>
                    <button className={currentHistoryIndex === step ? 'history-focus' : ''}
                            onClick={()=>this.recoverHistoryTo(step)}>{description}</button>
                </li>
            )
        })
    }
    isWin(){
        return this.state.winner && this.state.currentHistoryIndex !== 0;
    }
    render() {
        const status = this.getStatus();
        const history = this.state.history;
        const currentHistoryIndex = this.state.currentHistoryIndex;
        const historyLookup = this.getHistoryLookup(history, currentHistoryIndex);
        const currentSquares = history[currentHistoryIndex].squares;
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={currentSquares}
                        boardN={this.props.boardN}
                        onClick={(row, column)=>this.handlerClick(row, column)}
                    />
                </div>
                <div className="game-info">
                    <div className={this.isWin() ? 'winner' : ''}>{status}</div>
                    <ol>{historyLookup}</ol>
                </div>
            </div>
        );
    }
}

export {
    Game
}