
import Showcase from "./dist/Showcase";
import MyComponent from "./dist/MyComponent";
import index from "./dist/index";
import { ethers } from 'ethers';




function App() {
  return (
    <div className="App">
   
      <Showcase />
      <MyComponent isConnected={true} mint={() => {}} />
    </div>
  );
}

export default App;
