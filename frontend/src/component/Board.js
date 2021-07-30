import React,{useState,useEffect,useRef} from 'react'
import { randomNum ,useInterval} from '../utils';
import uparrow from '../svg/up-arrow-svgrepo-com.svg' 
import leftarrow from '../svg/left-arrow-svgrepo-com.svg' 
import rightarrow from '../svg/right-arrow-svgrepo-com.svg' 
import downarrow from '../svg/down-arrow-svgrepo-com.svg' 


import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';

// ksjdfk fwiueshf iawehfia wefiuawgf wgf
import './main.css'


const create_board = (BOARD_LEN) =>{
    let board = [];
    let count = 0;
    for(let i=0;i<BOARD_LEN;i++){
        board.push([]);
        for(let j=0;j<BOARD_LEN;j++){
            
            board[i].push(count);
            count++;
        }
    }

    return board;
}

const op = {
    'UP' :'DOWN',
    'DOWN':'UP',
    'RIGHT':'LEFT',
    'LEFT':'RIGHT',
}

const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

const Board = () => {

    const [first, setfirst] = useState(true);


    // const classes = useStyles();
    const [BOARD_LEN, setBOARD_LEN] = useState(25)



    const [board, setboard] = useState(
        create_board(BOARD_LEN)
    )

    const [gameover, setgameover] = useState(true);

    const [direction, _setdirection] = useState('RIGHT');

    

    const directionHookRef = useRef(direction);
    const setdirection = direction => {
          directionHookRef.current = direction;
          _setdirection(direction);
    }

    const [snake, setsnake] = useState([115]);

    const [SeValue, setSeValue] = useState(new Set(snake));

    const [growcell, setgrowcell] = useState([65,0]);

    const [highscore, sethighscore] = useState(0);

    const [speed, setspeed] = useState(1)


    const [open, setOpen] = React.useState(true);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    useEffect(() => {
        window.addEventListener('keydown', e => {
          handleKeydown(e);
        });
      }, []);
      
     const handleKeydown = e => {
        const newDirection = getDirectionFromKey(e.key);
        const isValidDirection = newDirection !== '';
        if (!isValidDirection) return;

        if(newDirection === op[directionHookRef.current])return;
        
        setdirection(newDirection);
    };

    const exe = () => {
        let temp = snake;
        let cellno = temp[temp.length-1];
        cellno = movedirection(cellno);
        
        

        if(cellno === ''||SeValue.has(cellno)){
            gameoverhandler()
        }

        else if(cellno === growcell[0]){
            temp.push(cellno);
            setsnake(temp);

            setSeValue(new Set(snake));
            let cel = generategrowcell()
            if(growcell[1]===1){
                setspeed(0.5);
            }
            else if(growcell[1] ===-1){
                setspeed(2);
            }
            else{
                setspeed(1);
            }
            setgrowcell(cel);
        }
        else{
            temp.push(cellno);
            temp.shift();
            setsnake(temp);
            setSeValue(new Set(snake));
        }


    }




    useInterval(()=>{
        if(!gameover){
            exe();
        }
        var winn = window.innerWidth;
        if(winn < 600){
            setBOARD_LEN(15);
            
        }
        

    },200*speed);

    useEffect(() => {
        setboard(create_board(BOARD_LEN));
    }, [BOARD_LEN])

    const isoutofbound = (i,j) =>{
        if(i<0||j<0||i>=BOARD_LEN||j>=BOARD_LEN){
            return true;
        }
        return false;
    }

    const convertcell = (cellno) =>{
        let row = cellno/BOARD_LEN;
        let col = cellno%BOARD_LEN;
        return {row,col};
    }

    const gameoverhandler =  () =>{
        if(highscore<snake.length){
            sethighscore(snake.length);
        }
        setsnake([115]);
        setSeValue(new Set(snake));
        setgameover(true);
        if(!open){
            handleOpen();
        }
        
    }

    const movedirection = (cellno) =>{
        if(direction === 'RIGHT'){
            let pos = convertcell(cellno);
            if(!isoutofbound(pos.row,pos.col+1)){
                return cellno+1;
            }
            else{
                return '';
            }
        }
        else if(direction === 'UP'){
            let pos = convertcell(cellno);
            if(!isoutofbound(pos.row-1,pos.col)){
                return cellno-BOARD_LEN;
            }
            else{
                return '';
            }
        }
        else if(direction === 'LEFT'){
            let pos = convertcell(cellno);
            if(!isoutofbound(pos.row,pos.col-1)){
                return cellno-1;
            }
            else{
                return '';
            }
        }
        else if(direction === 'DOWN'){
            let pos = convertcell(cellno);
            if(!isoutofbound(pos.row+1,pos.col)){
                return cellno+BOARD_LEN;
            }
            else{
                return '';
            }
        }
    }

    const getDirectionFromKey = key => {
        if (key === 'ArrowUp') return 'UP';
        if (key === 'ArrowRight') return 'RIGHT';
        if (key === 'ArrowDown') return 'DOWN';
        if (key === 'ArrowLeft') return 'LEFT';
        return '';
      };


    const generategrowcell = () =>{
        let cellno = randomNum(0,BOARD_LEN*BOARD_LEN -1)
        let count = 0;
        while(SeValue.has(cellno) && count < 100){
            cellno = randomNum(0,BOARD_LEN*BOARD_LEN -1);
            count++;
        }
        if(count > 98){
            gameoverhandler();
            return;
        }
        let type = 0;
        let rand = randomNum(1,20)
        if(rand>15){
            type = 1;
        }
        else if(rand<6){
            type = -1;
        }
        return [cellno,type];   
    }

    const classgen = (num) =>{
        if(num === 1){
            return 'bg-red-600'
        }
        else if(num === -1){
            return 'bg-yellow-600'
        }
        else{
            return 'bg-pink-600'
        }
    }

    return (
        <div className="relative flex   xl:justify-center md:justify-end lg:flex-row flex-col items-center h-auto">
                  {!first && <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className="flex justify-center items-center outline-none"
                    open={open}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                     >
                      
                        <div className="border-black outline-none flex justify-center items-center lg:flex-row flex-col">
                            
                            <a href="#" className=" text-center lg:px-5 lg:py-5 lg:w-40 px-8 py-5 ">Game Over</a>
                           
                            <a href="#"  className=" lg:px-5 lg:py-5  lg:w-40 px-8 py-5  " ><button className="w-full" onClick={()=>{
                                    handleClose();
                                    
                                    setgameover(false);
                                    }}>START AGAIN</button></a>
                                    
                        </div>
                </Modal>
                }

                {first && <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className="flex justify-center items-center outline-none"
                    open={open}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                    timeout: 500,
                    }}
                     >
                      
                        <div className="border-black outline-none">
                            <a href="#" className="box-border px-8 py-5 text-lg w-28" ><button onClick={()=>{
                                    handleClose();
                                    setfirst(false);
                                    setgameover(false);
                                    }}>START</button></a>         
                        </div>
                </Modal>
                }

            <div className="lg:absolute relative top-0 left-0 ">
                <div className="flex flex-col">
                    <div className="text-2xl thegreatfont text-pink-500">Score : {snake.length}</div>
                    <div className="text-2xl thegreatfont text-pink-500">Highest Score : {highscore}</div>
                    <div className="text-2xl thegreatfont text-pink-500">speed : {1/speed}</div>
                </div>
            </div>
            <div className=" border-2 border-green-500  w-auto mx-24" >
                {board.map(row=>{
                    return(
                        <div key={row[0]+100} className=" flex  ">
                            {row.map(col=>{
                                return(
                                    <div key={col} className=" text-white flex justify-center items-center  border-green-500 w-5 h-5 " >
                                        { SeValue.has(col) && <div className=" rounded-sm border-1 border-black  bg-green-600 w-4 h-4" ></div>}
                                        {   
                                            growcell[0] === col && 
                                            <div className={`relative rounded-sm border-1 border-black ${classgen(growcell[1])}  w-4 h-4`}>
                                                <div className={` animate-ping rounded-sm border-1 border-black ${classgen(growcell[1])} w-4 h-4`} >
                                                </div>
                                            </div>
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            
            </div>
                <div className=" lg:hidden relative top-0 left-0 ">
                    <div className="lg:mt-40 mt-5 grid grid-cols-3 grid-rows-3 gap-3 md:w-52 w-32">
                        <div className="h-auto"></div>
                        <div className="flex justify-center items-center h-auto">
                            <button onClick={()=>setdirection("UP")} style={{padding:'9px'}} className=" w-full h-full bg-gray-400 key__button">
                                <img src={uparrow}  alt="no"></img>
                            </button>
                        </div>
                        <div className=" h-auto"></div>
                        <div className="  h-auto">
                            <button onClick={()=>setdirection("LEFT")} className=" p-2 w-full h-full bg-gray-400 key__button">
                                <img src={leftarrow}  alt="no" ></img>
                            </button>
                        </div>
                        <div className="h-auto"></div>
                        <div className="  h-auto">
                            <button onClick={()=>setdirection("RIGHT")} style={{padding:'9px'}} className="w-full h-full bg-gray-400 key__button">
                                <img src={rightarrow} alt="no" ></img>
                            </button>
                        </div>
                        <div className=" h-auto"></div>
                        <div className=" h-auto">
                            <button onClick={()=>setdirection("DOWN")} style={{padding:'9px'}} className=" w-full h-full bg-gray-400 key__button">
                                <img src={downarrow} alt="no" ></img>
                            </button>
                        </div>
                        <div className="md:h-16 h-9"></div>
                    </div>
                </div>
        </div>
    )
}



export default Board;
