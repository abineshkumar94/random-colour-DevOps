import { useState } from "react";
import "./App.css";

function App() {
  const [bgColor, setBgColor] = useState("#000000");

  const changeColor = () => {
    const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    setBgColor(randomColor);
  };

  return (
    <div className="body" style={{ backgroundColor: bgColor }}>
      <button className="button" onClick={changeColor}  style={{ width: "200px", height: "40px", fontSize: "15px" }}>
        Random-Colour
      </button>
    </div>
  );
}

export default App;

