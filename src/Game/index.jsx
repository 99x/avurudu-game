import React, { Children, useEffect, useRef, useState } from 'react'
import data from './data';
import { useHistory } from "react-router";
import fire from '../fire';
import '../StyleSheets/Index.css'

function Index() {
    const history = useHistory();
    const  canvasRef = useRef(null);
    const [list, setList] = useState({playerslist : []});
    let elephentRun =  true
    let leftSpace = 0 
    let  time = 3 
    let gameStarted =  false;
    let u_data;
    let t = false
    let playerslist = [];

    let guess_x = 0; let guess_y = 0;

    const [gameCompleted, setGameCompleted] = useState(false)

    let actual_x;

    let canvas;
    let ctx;
    
    useEffect(()=>{
        u_data =  JSON.parse( localStorage.getItem('userData') ) 
        if(  u_data && u_data.started ){
            setGameCompleted( u_data.started )
            elephentRun = false
        } 
        if(  u_data === null ) {
            history.push({ pathname: "/" }) 
        }
        canvas = canvasRef.current;
        ctx = canvas.getContext("2d");
        render() 
    },[])

    let { elephantObj } = data;
    let x = elephantObj.x;
    let y = elephantObj.y;
    let direction = elephantObj.direction;
    let image = elephantObj.image;
    image.src = "https://res.cloudinary.com/dj8a0phpt/image/upload/v1617297689/99x%20awurudu%20game/ijhhtncmu8xvtxwqhubg.png"; 

    const render = ( ) => { 
        if(elephentRun){ 
            if(t == false){ 
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(image, x, y , 200,200);
            }
             
            if ( direction === 'leftToRight' ) {
                x += 8;
                if(x === canvas.width-200){
                    direction = "rightToLeft";
                }
            }else{
                x -= 8;
                if(x === 0){
                    direction = 'leftToRight';
                }
            }
            requestAnimationFrame(render);  
        }else {
            if( direction === 'leftToRight' ){
                actual_x =  x + leftSpace + 147 +26
                console.log(x + leftSpace + 147 +26  , y) // 8 -> 18 | 15 -> 11 |  20 -> 6
            }else{
                actual_x =  x + leftSpace + 147+ 28
                console.log(x + leftSpace + 147+ 28 , y)  // 8 -> 8 | 15 -> 14 | 20 -> 19    
            }
            
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, x, y , 200,200)
            
            setTimeout(()=>{
                console.log(guess_x, guess_y)
                ctx.arc(guess_x, guess_y, 6, 0, Math.PI * 2);
                ctx.fillStyle = "black";
                ctx.fill();
            },500)
             
            console.log(direction)
        }
    }; 

    const getPlayerData = () =>{
        let players = [];
        let obj;
        fire.database().ref("players").on("value", snapshot => {
            snapshot.forEach(snap => {
                var obj = snap.val()
                console.log(obj)
                players.push(obj)
            });
          });
          console.log(players.length)
    }

    const calculateScore = (guessPoint) =>{
        let score = Math.abs(actual_x - guessPoint);
        console.log( 800 - score );
        let userData = localStorage.getItem("userData");
        const obj = JSON.parse(userData);
        obj.score = score;
        // check if user already started (check if user's email exist in db)
        getPlayerData();
        // addDataToFirebase(obj);
    }

    const addDataToFirebase = (object) => {
        let child = fire.database().ref(`/players/`).push();
        // set() overwrites data at the specified location, including any child nodes.
        fire.database().ref(`/players/${child.key}/`).set(object);
    }
    
    const getClickingCodinates = (e) =>{ 
          if(gameStarted){
            const canvas = canvasRef.current;
            var rect = canvas.getBoundingClientRect();
            guess_x = e.clientX - rect.left - 7 ;
            guess_y =  e.clientY - rect.top  ;

            setGameCompleted( true )
            localStorage.setItem("userData", JSON.stringify({  ...u_data , started: true   }));
            gameStarted = false
            elephentRun =false 
            const { pageX,pageY } = e 

            console.log({ pageX,pageY })
            setTimeout(()=>{
                calculateScore(pageX)
            }, 500) 
          }

            
         
    }
    const stopEle = ()=>{  
        let plyBtn = document.getElementById("playBtn")
        plyBtn.innerHTML = "" 
        const refInterval = setInterval(()=>{
            let countDown = document.getElementById("countDown")
            time --;
            if( time === 0 ){
                countDown.innerText = "ගෙස් කරමු අලියාගේ ඇහැ තියන තැන "
                clearInterval(refInterval)  
            }else{
              countDown.innerText = `තව තප්පර   ${time}`  
            }
        }, 1000)

        setTimeout(()=>{
            gameStarted = true;
            leftSpace =  window.innerWidth / 2 - 400 
            t=true
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d"); 
            ctx.fillStyle = "yellow";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        },time * 1000)
    }

    const reloadPage = () =>{
        let userData = localStorage.getItem("userData");
        const obj = JSON.parse(userData);
        localStorage.setItem("userData", JSON.stringify({  ...obj , started: false  , completed: false  }));
        window.location.reload()
    }

    return (
        <div className="__main">  
             
            {
                gameCompleted ? (
                    <>
                        <div>
                            <div className="final__greeting">
                                <p>එහෙනම් සැමට සුභ අලුත් අවුරුද්දක් වේවා ! </p> 
                                 <p className="final__greeting__small" >  So, Then Very Happy new year for All ! </p> 
                            </div>
                        </div> 
                        
                    </>
                ) : null
            } 

            

            {
                gameCompleted ? null : (
                    <> 
                        <div>
                            <div id="countDown" className="count__down">
                                <p className="countDown___large">තප්පර 5 යි හම්බෙන්නේ එබුවට පස්සේ</p>
                                <p className="countDown__small">
                                    You get 5 seconds after click the button | ஆரம்பித்த பின் உங்களுக்கு 5 நொடிகள் உண்டு 
                                </p>
                            </div> 
                        </div>
                    </>
                )
            }       
            <div className='canvas__container' >
                <canvas onClick={(e)=>{getClickingCodinates(e)}} className="canvas" ref={canvasRef} id="canvas" height="200" width="800" />
            </div>
            {
                gameCompleted ? null : (
                    <>
                        <div id="playBtn" >
                            <button type="button" className="play__now__btn" onClick={ ()=>stopEle() }  > 
                                <p className="play__now__btn__sinhala"> ඔබල පටන් ගමු </p>
                                <p className="play__now__btn_english" >Click to play | ஆரம்பிக்கலாமா</p>
                            </button>
                        </div>
                    </>
                )
            }
            {
                gameCompleted ? (
                    <>
                        <div  >
                            <button type="button" className="play__now__btn" onClick={ ()=>reloadPage() }  > 
                                <p className="play__now__btn__sinhala">අයෙ සෙල්ලම් කරමු ද  ?</p>
                                <p className="play__now__btn_english" >Let's play again ?</p>
                            </button>
                        </div>
                    </>
                ) : null
            }
        </div>
    )
}

export default Index;
