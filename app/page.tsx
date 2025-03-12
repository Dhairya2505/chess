"use client";

import { useState } from "react";
import { Board } from "node-game-chess";
import { Coordinate_Type, Piece_Type, response } from 'node-game-chess/dist/types'

interface Respose {
  canMoveto: {
    x: Coordinate_Type,
    y: Coordinate_Type
  }[],
  canCut: {
    x: Coordinate_Type,
    y: Coordinate_Type
  }[]
}

export default function Home() {
  const [newBoard, setnewBoard] = useState(new Board())
  const [board, setBoard] = useState<Array<Array<Piece_Type | null>>>(newBoard.getBoard())
  const [response, setResponse] = useState<Respose>({
    canCut: [],
    canMoveto: []
  })
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      if(clicked_on_move_or_cut(row as Coordinate_Type, col as Coordinate_Type)){
        const res = newBoard.move(board, selectedSquare[0] as Coordinate_Type, selectedSquare[1] as Coordinate_Type, row as Coordinate_Type, col as Coordinate_Type)
        if(res){
          setBoard(res)
        }
      }
      setSelectedSquare(null)
      setResponse({
        canCut: [],
        canMoveto: []
      })
    } else if (board[row][col]) {
      setSelectedSquare([row, col])
      const response: response | null = newBoard.canMoveTo(board, row, col)
      if(response){
        setResponse(response)
      }
    }
  }

  function clicked_on_move_or_cut(row: Coordinate_Type, col: Coordinate_Type){
    const isMove = response.canMoveto.some((coords) => coords.x === row && coords.y === col);
    const isCapture = response.canCut.some((coords) => coords.x === row && coords.y === col);
    if(isMove){
      return true
    }
    
    if(isCapture){
      return true
    }
    return false;
  }

  function check_coords(row: Coordinate_Type, col: Coordinate_Type, isBlack: boolean){

    const isMove = response.canMoveto.some((coords) => coords.x === row && coords.y === col);
    const isCapture = response.canCut.some((coords) => coords.x === row && coords.y === col);

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
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => {
            const isBlack = (rowIndex + colIndex) % 2 === 1
            const isSelected = selectedSquare && selectedSquare[0] === rowIndex && selectedSquare[1] === colIndex

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  flex items-center justify-center
                  ${check_coords(rowIndex as Coordinate_Type, colIndex as Coordinate_Type, isBlack)}
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
      <div className="">
        
      </div>
    </div>
  )
}
