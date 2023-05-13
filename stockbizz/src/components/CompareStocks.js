import React from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import{useState, useEffect} from 'react';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import './StockDisplay.css';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {useParams} from 'react-router-dom';
 
function CompareStocks(props){
    
    const [series,setSeries] = useState([]);
    const [day,setDay] = useState('contained');
    const [week,setWeek] = useState('text');
    const [all,setAll] = useState('text');
    const [activeUrl, setActiveUrl]=useState('TIME_SERIES_INTRADAY');
    const {ticker1,ticker2}= useParams();

    
    const [options,setOptions]= useState({
   
        chart: {
        type: 'line',
        width:'70%'
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
      
        colors:['#9d35ff','#d782f5']
      ,
      legend: {
        fontWeight: "bold"
      },
    
    yaxis: {
        lines: {
            show: false,
          },
        labels: {
          formatter: function (val) {
            return '$ '+(val).toFixed(1);
          },
        },
        title: {
          text: 'Price'
        },
      },
      fill:{
        colors:['#9d35ff','#d782f5']
      },
      xaxis: {
        
        type: 'datetime',
        labels: {
            rotate: -10,
            rotateAlways: true,
            formatter: function(timestamp,val) {
                return moment.unix(timestamp).format("DD MMM hh:mm") 
                
          }}
      },
      tooltip: {
        
        y: {
            y1:{
            formatter: function (val) {
              return '$ '+(val).toFixed(2)
            }},
            y2:{
                formatter: function (val) {
                  return '$ '+(val).toFixed(2)
                },
        }},
      }
      });

    function toTimestamp(strDate){
        var datum = Date.parse(strDate);
   
        return datum/1000;
     }
    const handleWeekClick= async()=>{
     setAll('text') ;
     setDay('text');
     setWeek('contained');
     setActiveUrl('TIME_SERIES_WEEKLY_ADJUSTED');
     
     const objWeek ={xaxis: {
        lines: {
            show: false,
          },
        type: 'datetime',
        labels: {
            rotate: -10,
            rotateAlways: true,
            formatter: function(timestamp,val) {
                return moment.unix(timestamp).format("DD MMM YY") 
                
          }}
      }}
     setOptions((prevOptions) => {
            return { ...prevOptions, ...objWeek };
        })
     //console.log(options)
     
    } 
    const handleAllClick = async ()=>{
     
     setDay('text');
     setWeek('text');  
     setAll('contained') ;
     setActiveUrl('TIME_SERIES_MONTHLY_ADJUSTED');
     
     const objAll ={xaxis: {
        lines: {
            show: false,
          },
        type: 'datetime',
        labels: {
            rotate: -10,
            rotateAlways: true,
            formatter: function(timestamp,val) {
                return moment.unix(timestamp).format("MMM YYYY") 
                
          }}
      }}
     await setOptions((prevOptions)=>{
        return {...prevOptions,...objAll}
     })
     //console.log(options)
     
    } 
    const handleDayClick= async ()=>{

     setAll('text') ;
     setDay('contained');
     setWeek('text');
     
     const objDay ={xaxis: 
        {
        lines: {
            show: false,
          },
        type: 'datetime',
        labels: {
            rotate: -10,
            rotateAlways: true,
            formatter: function(timestamp,val) {
                
               
                
                return moment.unix(timestamp).format("DD MMM hh:mm") 
                
          }}
      }}

    
     await setOptions((prevOptions)=>{
        return {...prevOptions,...objDay}
     })
     console.log(options)
     setActiveUrl('TIME_SERIES_INTRADAY');
    
    
    } 

  const getDataArray = (responseCompanyStockData) =>{
    if(activeUrl==="TIME_SERIES_INTRADAY"){
    const dataArray = Object.keys(responseCompanyStockData['Time Series (5min)'])?.map((date) => {
        let tempArray =[];
        
        tempArray.push(toTimestamp(date));
        tempArray.push(parseFloat(responseCompanyStockData['Time Series (5min)'][date]['4. close']));
     
        return tempArray
    }
        

    
    );
    return dataArray   
}
    else if (activeUrl==="TIME_SERIES_WEEKLY_ADJUSTED"){
        const dataArray = Object.keys(responseCompanyStockData['Weekly Adjusted Time Series'])?.map((date) => {
            let tempArray =[];
            
            tempArray.push(toTimestamp(date));
            tempArray.push(parseFloat(responseCompanyStockData['Weekly Adjusted Time Series'][date]['5. adjusted close']));
         
            return tempArray
        }
            
    
        
        );
        return dataArray;

    }
    else if (activeUrl==="TIME_SERIES_MONTHLY_ADJUSTED"){
        const dataArray = Object.keys(responseCompanyStockData['Monthly Adjusted Time Series'])?.map((date) => {
            let tempArray =[];
            
            tempArray.push(toTimestamp(date));
            tempArray.push(parseFloat(responseCompanyStockData['Monthly Adjusted Time Series'][date]['5. adjusted close']));
         
            return tempArray
        }
            
    
        
        );
        return dataArray;
    }
    

  }
    async function fetchStockData() {
        try {
            
            const response1 = await axios.get(`https://www.alphavantage.co/query?function=${activeUrl}&symbol=${ticker1}&interval=5min&apikey=${process.env.REACT_APP_KEY}`);
            const response2 = await axios.get(`https://www.alphavantage.co/query?function=${activeUrl}&symbol=${ticker2}&interval=5min&apikey=${process.env.REACT_APP_KEY}`);
            console.log(response1);
            console.log(response2);
            const responseCompanyName1 = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticker1}&apikey=${process.env.REACT_APP_KEY}`);
            const responseCompanyName2 = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${ticker2}&apikey=${process.env.REACT_APP_KEY}`);
    
            const responseCompanyStockData1= response1.data;
            const responseCompanyStockData2= response2.data;
    
    
            // setName('1. '+responseCompanyName1.data['bestMatches'][0]['2. name']+'\n'+' 2. '+responseCompanyName2.data['bestMatches'][0]['2. name']);
    
           
            const stockData1 = new Object();
            const stockData2 = new Object();
            stockData1.name=responseCompanyName1.data['bestMatches'][0]['2. name'];
            stockData1.data = getDataArray(responseCompanyStockData1);
            stockData2.name=responseCompanyName2.data['bestMatches'][0]['2. name'];
            stockData2.data = getDataArray(responseCompanyStockData2);
            const newSeries = [stockData1,stockData2];
             setSeries(newSeries);
           
        //
          
    
          } catch (error) {
            alert("Intraday stock data not present try Weekly or Monthly Data");
            handleAllClick();
          }
    }
    
    
    

    useEffect(()=>{
      
        fetchStockData();
    },[activeUrl,options,ticker1,ticker2])

    return (
        
        <div className="container" style={{borderRadius:'25px'}}>
          <div className='innerContainer'>
            <Typography className='heading' variant="h5">
          <b><p className='stockheading'>Comparison</p></b>
          <div className='timestamp'>
            <Stack direction="row" spacing={1}><Button variant={day}onClick={handleDayClick}>Day</Button>
        <Button variant={week}onClick={handleWeekClick}>Week</Button>
        <Button variant={all} onClick={handleAllClick}>ALL</Button></Stack>
     
        </div>
      </Typography></div>
       <Chart key={`${activeUrl}-${all}-${day}-${week}-${ticker1}-${ticker2}`} className="visualization"  options={options} series={series} type="line" style={{width:"70%"}}
            ></Chart>
     
        </div>
    )
}

export default CompareStocks;