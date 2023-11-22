import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sketchboard from "./Sketchboard";

const Board = () => {
    return(
        <div className="board">
        <Header />
        <Sketchboard />
        <Footer />            
        </div>
     
    )
}

export default Board;