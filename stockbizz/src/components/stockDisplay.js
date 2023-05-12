import React from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';
import{useState, useEffect} from 'react';
import moment from 'moment';
import Typography from '@mui/material/Typography';
import './StockDisplay.css';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Stack from '@mui/material/Stack';
import BarChart from './BarChart';
import AreaChart from './AreaChart';
import CandleStick from './CandleStick';







 
function StockDisplay(props){
    
    const [series,setSeries] = useState([]);
    const [name,setName] = useState('');
    const [day,setDay] = useState('contained');
    const [week,setWeek] = useState('text');
    const [all,setAll] = useState('text');
    const [visualization,setVisualization]= useState('Timeseries');
    const [activeUrl, setActiveUrl]=useState('TIME_SERIES_INTRADAY');


    
    const [options,setOptions]= useState({
   
        chart: {
        type: 'line',
        stacked: false,
        width:'70%'
     
       
      },
      dataLabels: {
        enabled: false
      },
      markers: {
        size: 0,
      },
    
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          inverseColors: false,
          opacityFrom: 0.5,
          opacityTo: 0,
          stops: [0, 90, 100]
        },
      },
      
        colors:['#d782f5']
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
        colors:['#d782f5']
      },
      xaxis: {
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
      },
      tooltip: {
        shared: false,
        y: {
          formatter: function (val) {
            return '$ '+(val).toFixed(2)
          }
        }
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
     
     const objDay ={xaxis: {
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
     setVisualization('Timeseries');
    
    } 
    const handleChange = (event) => {
        setVisualization(event.target.value);
      };
      
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    if(event.currentTarget!== null && event.currentTarget !==undefined){
        setAnchorEl(event.currentTarget);
    }
    
    //console.log(typeof(event.currentTarget))
  };
  const handleClose = (e) => {
    if(e.target.innerText!== null && e.target.innerText !==undefined &&e.target.innerText !==""){setAnchorEl(null);
        setVisualization(e.target.innerText);
        ;}
    
  };
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
        const response = await axios.get(`https://www.alphavantage.co/query?function=${activeUrl}&symbol=${props.ticker}&interval=5min&apikey=${process.env.REACT_APP_KEY}`);
        const responseCompanyName = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${props.ticker}&apikey=${process.env.REACT_APP_KEY}`);
        const responseCompanyStockData= response.data;
       
        
        
        setName(responseCompanyName.data['bestMatches'][0]['2. name']);
        
       if(visualization==="Timeseries"){
        const stockData = new Object();
        stockData.name=responseCompanyName.data['bestMatches'][0]['2. name'];
        stockData.data = getDataArray(responseCompanyStockData);
        const newSeries = [stockData];
         setSeries(newSeries);
       }
    //    
        //console.log(newSeries);
        // setSeriesBar(newSeries);
       
      } catch (error) {
        alert("Intraday stock data not present try Weekly or Monthly Data");
        handleAllClick();
        ;
      }
    }
    
    
    

    useEffect(()=>{
      console.log(props.ticker);
        fetchStockData();
    },[visualization,activeUrl,options])

    return (
        
        <div className="container" style={{borderRadius:'25px'}}>
          <div className='innerContainer'>
            <Typography className='heading' variant="h5">
          <b><p className='stockheading'>{name}</p></b>
          <div className='timestamp'>
            <Stack direction="row" spacing={1}><Button variant={day}onClick={handleDayClick}>Day</Button>
        <Button variant={week}onClick={handleWeekClick}>Week</Button>
        <Button variant={all} onClick={handleAllClick}>ALL</Button>
        <Button
        id="basic-button" variant="contained"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >CHARTS<KeyboardArrowDownIcon></KeyboardArrowDownIcon></Button></Stack>
        
         <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem value="Timeseries"onClick={handleClose}>Timeseries</MenuItem>
          {day!=='contained'&&  <MenuItem value="Candlestick"onClick={handleClose}>Candlestick</MenuItem> }
          {day!=='contained' && <MenuItem value="Area Chart"onClick={handleClose}>Area Chart</MenuItem> }
          {day!=='contained' && <MenuItem value="Bar Chart"onClick={handleClose}>Bar Chart</MenuItem> }</Menu>
          
      
        </div>
      </Typography></div>
           {visualization==='Timeseries' &&<Chart key={`${visualization}-${activeUrl}-${all}-${day}-${week}`} className="visualization"  options={options} series={series} type="area" style={{width:"70%"}}
            ></Chart>}
            {visualization==='Area Chart' &&<AreaChart key={`${activeUrl}-${all}-${week}`}activeUrl={activeUrl} day={day}week ={week}all ={all}></AreaChart>}
            {visualization==='Bar Chart' &&<BarChart key={`${activeUrl}-${all}-${week}`}activeUrl={activeUrl} day={day}week ={week}all ={all}></BarChart>}
            {visualization==='Candlestick' &&<CandleStick key={`${visualization}-${activeUrl}-${all}--${day}-${week}`} activeUrl={activeUrl} day={day}week ={week}all ={all}></CandleStick>}
        </div>
    )
}

export default StockDisplay;