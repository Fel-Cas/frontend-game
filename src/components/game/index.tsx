import React, { useEffect, useState,useContext} from "react";
import styled from "styled-components";
import gameContext from "../../gameContext";
import gameService from "../../service/gameService";
import socketService from "../../service/socketService";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  font-family: "Zen Tokyo Zoo", cursive;
  position: relative;
  width:100%;
`;
const Cards=styled.div`
    width:100%;
    height:100%;
    display:flex;
    justify-content:space-between;
`;
const CardContainer=styled.div`
    width:100px;
    height:100px;
    border: 1px solid #1A374D;
    border-radius:10px;
    background-color:#6998AB;
    text-align:center;
    display:inline-block;
    margin:5rem 8px;
`;
const CardText=styled.div`
    color:#1A374D;
    font-size:3.5rem;
    display:flex;
    align-items:center;
    padding:1rem;
`;
const WordContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: .5rem;
`;
const WordInput = styled.input`
  height: 30px;
  width: 20em;
  font-size: 17px;
  outline: none;
  border: 1px solid #406882;
  border-radius: 3px;
  padding: 0 10px;
`;

const WordButton = styled.button`
  outline: none;
  background-color: #406882;
  color: #fff;
  font-size: 17px;
  border: 2px solid transparent;
  border-radius: 5px;
  padding: 4px 18px;
  transition: all 230ms ease-in-out;
  margin-top: 1em;
  cursor: pointer;
  &:hover {
    background-color: transparent;
    border: 2px solid #406882;
    color: #406882;
  `;
  const Title=styled.h1`
    text-align:center;
    font-size:2.5rem;

  `;
  const ScoreContainer=styled.div`
    display:flex;
    width:100%;
    justify-content:space-between;
  `
  const ContentScoreYou=styled.div`
      left:0;
      text-align:center;
      padding:0 12%;
  `;
  const ContentScoreOpponent=styled.div`
      right:0; 
      text-align:center;
      padding:0 12%;
  `
  const Score=styled.div`
      font-size:1rem;
  `;

  const GameFinish = styled.div`
    display: none;
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 1rem;
    font-size: 1.5rem;
    font-weight: bold;
    text-align: center;
    background-color: #1b5e20;
    color: #fff;
  `;
export type ILetters=Array<string|null>;
export type ICorrectWord=number;
export interface IStartGame{
  letters:Array<string>,
  words:Array<string>
}
export function Game(){
    const [letters, setLetters]=useState<ILetters>([]);
    const [words, setWords]:any=useState<ILetters>([]);
    const [word, setWord]=useState('');
    const {isGameStart, setGameStart}=useContext(gameContext);
    const {isFinishGame, setFinishGame} = useContext(gameContext);
    const [winner, setWinner] = useState('');

    let [youScore, setYouScore]=useState(0);
    let [opponentScore, setOpponentScore]=useState(0);
    let [numberWords,setNumberWords]=useState(99);

    let handleStartGame=()=>{
        if(socketService.socket){
          gameService.onStartGame(socketService.socket,(options)=>{
            setGameStart(true);
            setLetters(options.letters);
            setWords(options.words);
            setNumberWords(options.words.length);
          });
        }
    }

    let handleWord=(e:React.ChangeEvent<any>)=>{
      let value=e.target.value;
      setWord(value);
    }

    let handleVerifyWord=(e:React.ChangeEvent<any>)=>{
        e.preventDefault();
        if(!word || word.trim()==="") return;
        let isWordInWords=words.includes(word.toUpperCase())
        let $inputWord:any=document.getElementById('inputWord');        
        
        if(isWordInWords){
          youScore++;
          words.splice(words.indexOf(word.toUpperCase()),1);
          setYouScore(youScore);
          gameService.correctWord(socketService.socket, youScore);  
          handleWinner();
        }      
        $inputWord.value='';
        setWord('');
    }

    let handleOpponentCorrectWord=()=>{
      if(socketService.socket){
        gameService.onCorrectWord(socketService.socket,(correctWord)=>{
            setOpponentScore(correctWord);
        })
      }
    }

    let handleWinner= () => {      
      let $gameFinish:any = document.getElementById("game-finish");
      if(socketService.socket){
        if(youScore === numberWords){
          gameService.gameFinish(socketService.socket, 'You Lost');
          setFinishGame(true);
          setWinner("You won");
          $gameFinish.style.display = "block";
        }
        if(opponentScore === numberWords){
          gameService.gameFinish(socketService.socket, 'You Won');
          setWinner("You Lost");
          setFinishGame(true);
          $gameFinish.style.display = "block";
        }
      }
    }
    
    let handleGameFinish= () => {
      if(socketService.socket){
        gameService.onGameFinish(socketService.socket, (message) => {
          setWinner(message);
          setFinishGame(true);
          let $gameFinish:any = document.getElementById("game-finish");
          $gameFinish.style.display = "block";
        })
      }
    }
    
    useEffect(()=>{
      handleOpponentCorrectWord();
      handleStartGame();
      handleGameFinish();
    },[])


    return(
    <GameContainer>
      {(!isGameStart) ? <Title> Espere a el otro usuario para empezar a jugar</Title>:
       ( <Cards id='cards'>{
            letters.map((element)=>{
                return <CardContainer>
                    <CardText>{element}</CardText>
                </CardContainer>
            })
        }</Cards>)}
        {isGameStart && 
          <ScoreContainer>
            <ContentScoreYou>
            <Score>{youScore}</Score>
              YOU
            </ContentScoreYou>
            <div>
              La cantidad de palabras a adivinar es {numberWords}
            </div>
            <ContentScoreOpponent>
              <Score>{opponentScore}</Score>
              OPPONENT
            </ContentScoreOpponent> 
          </ScoreContainer>}
        {(!isGameStart) ?<Title> Tu solo no puedes jugar</Title>:(
          
        <form onSubmit={handleVerifyWord}>
            <WordContainer>
                <WordInput id='inputWord' disabled={isFinishGame} placeholder="Entre la palabra" value={word} onChange={handleWord}/>
                <WordButton type="submit" hidden={isFinishGame} >Enviar</WordButton>                
            </WordContainer>
        </form>)};
        <GameFinish id="game-finish">Juego Terminado, {winner}</GameFinish>
    </GameContainer>    
    );
}