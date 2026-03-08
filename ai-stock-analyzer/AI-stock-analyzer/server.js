const express = require("express")
const axios = require("axios")
const { aiAnalyze } = require("./aiEngine")

const app = express()

const API_KEY = process.env.TWELVEDATA_API_KEY
const PORT = process.env.PORT || 3000

app.use(express.static("public"))

app.get("/api/stock", async (req, res) => {

let symbol=req.query.symbol.toUpperCase()

if(!symbol.includes(".")){
symbol=symbol+".NSE"
}

try{

const priceRes=await axios.get(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${API_KEY}`)

const chartRes=await axios.get(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=1day&apikey=${API_KEY}`)

const price=parseFloat(priceRes.data.close)
const volume=parseFloat(priceRes.data.volume)

const prices=chartRes.data.values.map(v=>parseFloat(v.close)).reverse()

const rsi=calculateRSI(prices)
const macd=calculateMACD(prices)

const ai=aiAnalyze(price,rsi,macd,volume)

res.json({
symbol,
price,
volume,
rsi,
macd,
chart:prices,
ai
})

}catch(e){

res.json({error:"API error"})
}

})

function calculateRSI(prices){

let gains=0
let losses=0

for(let i=1;i<prices.length;i++){

let diff=prices[i]-prices[i-1]

if(diff>0) gains+=diff
else losses+=Math.abs(diff)

}

let rs=gains/losses

return 100-(100/(1+rs))
}

function calculateMACD(prices){

let ema12=prices.slice(-12).reduce((a,b)=>a+b)/12
let ema26=prices.slice(-26).reduce((a,b)=>a+b)/26

return ema12-ema26
}

app.listen(PORT,()=>{
console.log("Server running")
})