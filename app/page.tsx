"use client";

import { useState } from "react";
import { Board, Coordinate_Type, Piece_Type } from 'node-game-chess'



export default function Home() {
  const [newBoard, setnewBoard] = useState(new Board())
  const [board, setBoard] = useState<Array<Array<Piece_Type | null>>>(newBoard.getBoard())
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      if(selectedSquare[0] != row || selectedSquare[1] != col){
        const response = newBoard.canMove(board, selectedSquare[0] as Coordinate_Type, selectedSquare[1] as Coordinate_Type, row  as Coordinate_Type, col  as Coordinate_Type)
        if(response){
          setBoard(response)
        }
      }
      setSelectedSquare(null)
    } else if (board[row][col]) {
      console.log(row, col)
      setSelectedSquare([row, col])
    }
  }

  return (
    <div className="flex h-screen aspect-square w-full border border-border rounded-md overflow-hidden">
      <div className="w-1/2 grid grid-cols-8 grid-rows-8">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isBlack = (rowIndex + colIndex) % 2 === 1
            const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  flex items-center justify-center
                  ${isBlack ? "bg-[#B58863]" : "bg-[#F0D9B5]"}
                  ${isSelected ? "ring-2 ring-blue-500 ring-inset" : ""}
                  cursor-pointer
                  relative
                `}
                onClick={() => handleSquareClick(rowIndex, colIndex)}
              >
                {piece && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Placeholder for actual chess piece images */}
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
      <div className="">
        Hello
      </div>
    </div>
  )
}
