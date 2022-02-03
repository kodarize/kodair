import './App.css';
import Masterpass from './Masterpass.js';
import Exceptions from './Exceptions.js';

function App() {
  return (
    <div className="App">
      <div className="card">
        <h1>Unstated Options</h1>
        <h3>Master Password</h3>
        <Masterpass />
        <br />
        <hr />
        <h3>Exceptions</h3>
        <Exceptions />
      </div>
    </div>
  );
}

export default App;
