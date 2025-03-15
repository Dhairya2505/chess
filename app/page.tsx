"use client";

import { useRef, useState, useEffect } from "react";

import { Board } from "npm-chess";
import { coordinate, location, piece, response } from "npm-chess/dist/types";


export default function Home() {
  const [newBoard, setnewBoard] = useState(new Board())
  const [selectedSquare, setSelectedSquare] = useState<[number, number] | null>(null)
  const [response, setResponse] = useState<response | null>(null)
  const [capturedPieces, setCapturedPieces] = useState<{
    'w': piece[],
    'b': piece[]
  }>({
    'w': [],
    'b': []
  })
  const [moveHistory, setMoveHistory] = useState<{
    from: location,
    to: location
  }[]>([])
  const [check, setCheck] = useState<boolean>(false)
  const [checkmate, setCheckMate] = useState<boolean>(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSquareClick = (row: number, col: number) => {
    if (selectedSquare) {
      if(clicked_on_move_or_cut(row as coordinate, col as coordinate)){
        const res = newBoard.move(newBoard, selectedSquare[0] as coordinate, selectedSquare[1] as coordinate, row as coordinate, col as coordinate)
        if(res){
          setnewBoard(res.board)
          setCheck(res.check)
          setCheckMate(res.checkMate)
          setMoveHistory(newBoard.getSteps())
          setCapturedPieces(newBoard.getCaptured())
          if(res.checkMate){
            alert(`${ newBoard.getWinner() == 'b' ? "Black is winner !!" : "White is winner !!" }`)
            window.location.reload();
          }
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

  function isCheckmate(){
    return checkmate
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  };

useEffect(() => {
  scrollToBottom();
});

  return (
    <div className="flex flex-col w-full max-w-7xl mx-auto rounded-md overflow-hidden">
      {/* Mobile-only top status section */}
      <div className="lg:hidden w-full p-4">
        <h2 className="text-2xl font-bold mb-4 text-white/80 border-b pb-2 text-center">Chess Game</h2>
        <div className="flex gap-4 mb-4">
          {/* Current Turn */}
          <div className="p-4 w-1/2 rounded-lg shadow-sm border border-gray-700">
            <h3 className="font-semibold mb-3 text-white/80 border-b pb-1">Current Turn</h3>
            <div className="flex items-center gap-3">
              <div
                className={`w-5 h-5 rounded-full border ${newBoard.getTurn() === "w" ? "bg-white border-gray-400" : "bg-black"}`}
              ></div>
              <span className="font-medium">{newBoard.getTurn() === "w" ? "White" : "Black"}</span>
            </div>
          </div>

          {/* Check Status */}
          <div className="p-4 w-1/2 rounded-lg shadow-sm border border-gray-700">
            <h3 className="font-semibold mb-3 text-white/80 border-b pb-1">Game Status</h3>
            <div>
              {check ? (
                isCheckmate() ? (
                  <span className="text-red-500 font-bold flex items-center">
                    <span className="mr-1 text-lg">👑</span> CHECKMATE!
                  </span>
                ) : (
                  <span className="text-red-500 font-bold flex items-center">
                    <span className="mr-1 text-lg">⚠️</span> CHECK!
                  </span>
                )
              ) : (
                <span className="text-green-600">In progress</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col lg:flex-row w-full">
        {/* Chess Board */}
        <div className="w-full lg:w-1/2 aspect-square grid grid-cols-8 grid-rows-8">
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
                        className={`text-3xl sm:text-4xl md:text-3xl lg:text-4xl ${piece.color === "b" ? "text-black" : "text-white"}`}
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

        {/* Desktop Info Panel */}
        <div className="hidden lg:flex h-screen w-1/2 p-6 flex-col border-l">
          <h2 className="text-2xl font-bold mb-6 text-white/80 border-b pb-2">Chess Game</h2>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Current Turn */}
            <div className="p-4 rounded-lg shadow-sm border border-gray-700">
              <h3 className="font-semibold mb-3 text-white/80 border-b pb-1">Current Turn</h3>
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full border ${newBoard.getTurn() === "w" ? "bg-white border-gray-400" : "bg-black"}`}
                ></div>
                <span className="font-medium">{newBoard.getTurn() === "w" ? "White" : "Black"}</span>
              </div>
            </div>

            {/* Check Status */}
            <div className="p-4 rounded-lg shadow-sm border border-gray-700">
              <h3 className="font-semibold mb-3 text-white/80 border-b pb-1">Game Status</h3>
              <div>
                {check ? (
                  isCheckmate() ? (
                    <span className="text-red-500 font-bold flex items-center">
                      <span className="mr-1 text-lg">👑</span> CHECKMATE!
                    </span>
                  ) : (
                    <span className="text-red-500 font-bold flex items-center">
                      <span className="mr-1 text-lg">⚠️</span> CHECK!
                    </span>
                  )
                ) : (
                  <span className="text-green-600">In progress</span>
                )}
              </div>
            </div>
          </div>

          {/* Captured Pieces */}
          <div className="p-4 rounded-lg shadow-sm mb-6 border border-gray-700">
            <h3 className="font-semibold mb-3 text-white/80 border-b pb-1">Captured Pieces</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded border border-gray-700 overflow-hidden">
                <h4 className="text-sm font-medium mb-2 flex items-center">
                  <div className="w-3 h-3 rounded-full border border-gray-700 mr-2 bg-white"></div>
                  White Pieces Captured
                </h4>
                <div className="flex gap-2 text-2xl min-h-10 items-center w-full overflow-auto">
                  {capturedPieces.w.map((piece, idx) => (
                    <span key={`white-${idx}`} className="text-white">
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
                    </span>
                  ))}
                  {capturedPieces.w.length === 0 && <span className="text-gray-400 text-sm">None</span>}
                </div>
              </div>
              <div className="p-3 rounded border border-gray-700">
                <h4 className="text-sm font-medium mb-2 flex items-center overflow-hidden">
                  <div className="w-3 h-3 rounded-full bg-black mr-2 border border-gray-700"></div>
                  Black Pieces Captured
                </h4>
                <div className={`flex gap-2 text-2xl min-h-10 items-center w-full ${capturedPieces.b.length ? `bg-gray-300` : ``} overflow-auto`}>
                  {capturedPieces.b.map((piece, idx) => (
                    <span key={`black-${idx}`} className="text-black">
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
                    </span>
                  ))}
                  {capturedPieces.b.length === 0 && <span className="text-gray-400 text-sm">None</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Move History */}
          <div className="p-4 rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col border border-gray-700">
            <h3 className="font-semibold mb-3 text-white/80 border-b pb-1">Move History</h3>
            <div className="overflow-auto flex-1" ref={messagesEndRef}>
              {moveHistory.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {moveHistory.map((move, idx) => (
                    <div key={idx} className={`text-sm ${idx % 2 === 0 ? "col-span-1" : "col-span-1"}`}>
                      {idx % 2 === 0 ? (
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full border border-black bg-white text-black flex items-center justify-center text-xs mr-2">
                            {Math.floor(idx / 2) + 1}
                          </span>
                          <span className="font-medium">
                            {move.from.x},{move.from.y} - {move.to.x},{move.to.y}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="w-6 h-6 rounded-full border border-gray-500 bg-black flex items-center justify-center text-xs mr-2">
                            {Math.floor(idx / 2) + 1}
                          </span>
                          <span>
                            {move.from.x},{move.from.y} - {move.to.x},{move.to.y}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p className="text-center">
                    <span className="block text-3xl mb-2">♟</span>
                    No moves yet
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-only bottom section */}
      <div className="lg:hidden w-full p-4 border-t">
        {/* Captured Pieces */}
        <div className="p-4 rounded-lg shadow-sm mb-6 border border-gray-700">
          <h3 className="font-semibold mb-3 text-white/80 border-b pb-1">Captured Pieces</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 rounded border border-gray-700 overflow-hidden">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <div className="w-3 h-3 rounded-full border border-gray-700 mr-2 bg-white"></div>
                White Pieces Captured
              </h4>
              <div className="flex gap-2 text-2xl min-h-10 items-center w-full overflow-auto">
                {capturedPieces.w.map((piece, idx) => (
                  <span key={`white-${idx}`} className="text-white">
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
                  </span>
                ))}
                {capturedPieces.w.length === 0 && <span className="text-gray-400 text-sm">None</span>}
              </div>
            </div>
            <div className="p-3 rounded border border-gray-700">
              <h4 className="text-sm font-medium mb-2 flex items-center overflow-hidden">
                <div className="w-3 h-3 rounded-full bg-black mr-2 border border-gray-700"></div>
                Black Pieces Captured
              </h4>
              <div className={`flex gap-2 text-2xl min-h-10 items-center w-full ${capturedPieces.b.length ? `bg-gray-300` : ``} overflow-auto`}>
                {capturedPieces.b.map((piece, idx) => (
                  <span key={`black-${idx}`} className="text-black">
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
                  </span>
                ))}
                {capturedPieces.b.length === 0 && <span className="text-gray-400 text-sm">None</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Move History */}
        <div className="p-4 rounded-lg shadow-sm flex-1 overflow-hidden flex flex-col border border-gray-700">
          <h3 className="font-semibold mb-3 text-white/80 border-b pb-1">Move History</h3>
          <div className="overflow-auto flex-1" ref={messagesEndRef}>
            {moveHistory.length > 0 ? (
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1">
                {moveHistory.map((move, idx) => (
                  <div key={idx} className={`text-sm ${idx % 2 === 0 ? "col-span-1" : "col-span-1"}`}>
                    {idx % 2 === 0 ? (
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full border border-black bg-white text-black flex items-center justify-center text-xs mr-2">
                          {Math.floor(idx / 2) + 1}
                        </span>
                        <span className="font-medium">
                          {move.from.x},{move.from.y} - {move.to.x},{move.to.y}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full border border-gray-500 bg-black flex items-center justify-center text-xs mr-2">
                          {Math.floor(idx / 2) + 1}
                        </span>
                        <span>
                          {move.from.x},{move.from.y} - {move.to.x},{move.to.y}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <p className="text-center">
                  <span className="block text-3xl mb-2">♟</span>
                  No moves yet
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
