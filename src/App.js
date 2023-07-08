import React, { useEffect } from "react";
import FirstPanel from "./panels/firstPanel";
import SecondPanel from "./panels/secondPanel";
import StartGame from "./panels/startGame";
import UserLevels from "./panels/userLevels";
import { useState } from "react";
import "./index.css"

// Add this in node_modules/react-dom/index.js
//window.React1 = require('react');

// Add this in your component file
// require('react-dom');
// window.React2 = require('react');
// console.log("Сравниваем реакты" + (window.React1 === window.React2));

function App() {
  
  
  const panelsList = {
    "firstPanel" :<FirstPanel go={changePanel}/>,
    "secondPanel" : <SecondPanel go={changePanel}/>,
    "startGame" : <StartGame go={changePanel}/>,
  }

  const [activePanel, setPanel] = useState(panelsList["firstPanel"]);

  function changePanel(panel){
    setPanel(panelsList[panel]);
  }

   

  return (
    activePanel
  );
}

export default App;
