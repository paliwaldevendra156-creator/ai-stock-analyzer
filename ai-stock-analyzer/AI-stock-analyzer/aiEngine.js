function aiAnalyze(price,rsi,macd,volume){

let signal="HOLD"
let confidence=50

if(rsi<35 && macd>0){

signal="BUY"
confidence=80

}

if(rsi>70 && macd<0){

signal="SELL"
confidence=75

}

let target=(price*1.03).toFixed(2)
let stoploss=(price*0.97).toFixed(2)

let intraday="WAIT"

if(rsi<40 && macd>0){

intraday="INTRADAY BUY"

}

if(rsi>65){

intraday="INTRADAY SELL"

}

return{

signal,
confidence,
target,
stoploss,
intraday

}

}

module.exports={aiAnalyze}