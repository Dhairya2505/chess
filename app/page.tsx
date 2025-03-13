"use client";

import { useState } from "react";

import { Board } from "npm-chess";
import { coordinate, response,  } from "npm-chess/dist/types";

export default function Home() {
  const [newBoard, setnewBoard] = useState(new Board())
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [response, setResponse] = useState<response | null>(null)

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      if(clicked_on_move_or_cut(row as coordinate, col as coordinate)){
        const res = newBoard.move(newBoard, selectedSquare[0] as coordinate, selectedSquare[1] as coordinate, row as coordinate, col as coordinate)
        if(res){
          setnewBoard(res)
        }
      }
      setSelectedSquare(null)
      setResponse(null)
    } else {
      const res = newBoard.canMoveTo(newBoard, row, col)
      if(res){
        setSelectedSquare([row, col])
        setResponse(res)
      }
    }
  }

  function clicked_on_move_or_cut(row: coordinate, col: coordinate){

    const res1 = response?.canMoveto.some((coords) => row == coords.x && col == coords.y)
    const res2 = response?.canCut.some((coords) => row == coords.x && col == coords.y)

    if(res1 || res2){
      return true;
    }
    return false;

  }

  function check_coords(row: coordinate, col: coordinate, isBlack: boolean){

    const isMove = response?.canMoveto.some((coords) => coords.x === row && coords.y === col);
    const isCapture = response?.canCut.some((coords) => coords.x === row && coords.y === col);

    if(isMove){
      return "bg-green-500"
    }
    
    if(isCapture){
      return "bg-red-500"
    }
    
    return isBlack? "bg-[#B58863]" : "bg-[#F0D9B5]"
  }

  return (
    <div className="flex h-screen aspect-square w-full border border-border rounded-md overflow-hidden">
      <div className="w-1/2 grid grid-cols-8 grid-rows-8">
        {newBoard.getBoard().map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isBlack = (rowIndex + colIndex) % 2 === 1
            const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  flex items-center justify-center
                  ${check_coords(rowIndex as coordinate, colIndex as coordinate, isBlack)}
                  ${isSelected ? "ring-2 ring-blue-500 ring-inset" : ""}
                  cursor-pointer
                  relative
                  border
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className={`text-4xl md:text-3xl lg:text-4xl ${piece.color === 'b' ? "text-black" : "text-white"}`}
                    >
                      {piece.name === "pawn"
                        ? "♟"
                        : piece.name === "rook"
                          ? "♜"
                          : piece.name === "knight"
                            ? "♞"
                            : piece.name === "bishop"
                              ? "♝"
                              : piece.name === "queen"
                                ? "♛"
                                : piece.name === "king"
                                  ? "♚"
                                  : ""}
                    </div>
                  </div>
                )}
              </div>
            )
          }),
        )}
      </div>
      <div className="w-1/2">
         
      </div>
    </div>
  )
}
