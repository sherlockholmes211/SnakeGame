import './App.css';
import Board from './component/Board'
import './component/main.css';

function App() {
  return (
    <div className=" box-border px-10 py-5 lg:h-screen w-screen bg-gray-900" >
      <div className="h-24 text-left text-6xl text-green-500 cursive">Snake Game</div>
      <Board></Board>
    </div>
  );
}

export default App;
