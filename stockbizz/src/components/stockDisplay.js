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



// let series1 =  [{
//     name: 'Test Stock',
//     data: [{x:'05/08/2523',y:500},{x:'05/07/2523',y:400},{x:'05/06/2523',y:600}]
//   }];



 
function StockDisplay(){
    
    const [series,setSeries] = useState([]);
    const [seriesBar,setSeriesBar] = useState([]);
    const [seriesCandle,setSeriesCandle] = useState([]);
    const [name,setName] = useState('');
    const [day,setDay] = useState('contained');
    const [week,setWeek] = useState('text');
    const [all,setAll] = useState('text');
    const [visualization,setVisualization]= useState('Timeseries');
    const [activeUrl, setActiveUrl]=useState('TIME_SERIES_INTRADAY');

    // const [currentChartOptions,setCurrentChartOptions] = useState({
    //     "frequency":"daily",
    // })
    
    
    const [options,setOptions]= useState({
   
        chart: {
        type: 'line',
        stacked: false,
        height: 350,
     
       
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

      const [optionsBar,setOptionsBar]= useState({

        
          options: {
            chart: {
              type: 'bar',
              height: 350,
              zoom: {
                enabled: true
              },
            },
            plotOptions: {
              bar: {
                horizontal: false,
                columnWidth: '95%',
                endingShape: 'rounded'
              },
            },
            dataLabels: {
              enabled: false
            },
            animations: {
                enabled: false
                },
            stroke: {
              show: true,
              width: 2,
              colors: ['transparent']
            },
            xaxis: {
                tickPlacement: 'on',
              //categories: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
            //   labels: {
            //     rotate: -10,
            //     rotateAlways: true,
            //     formatter: function(timestamp,val) {
                    
              
                    
            //         return moment.unix(timestamp).format("DD MMM hh:mm") 
                    
            //   }}
            
            },
            yaxis: {
              title: {
                text: '$ (thousands)'
              }
            },
            fill: {
              opacity: 1
            },
            tooltip: {
              y: {
                formatter: function (val) {
                  return "$ " + val + " thousands"
                }
              }
            }
          },
      });

    function toTimestamp(strDate){
        var datum = Date.parse(strDate);
   
        return datum/1000;
     }
    const handleWeekClick= async()=>{
     setAll('text') ;
     setDay('text');
     setWeek('contained');
     
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
     setActiveUrl('TIME_SERIES_WEEKLY_ADJUSTED');
    } 
    const handleAllClick = async ()=>{
     setAll('contained') ;
     setDay('text');
     setWeek('text')  
     
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
     await setActiveUrl('TIME_SERIES_MONTHLY_ADJUSTED');
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
        const response = await axios.get(`https://www.alphavantage.co/query?function=${activeUrl}&symbol=GOOGL&interval=5min&apikey=${process.env.REACT_APP_KEY}`);
        const responseCompanyName = await axios.get(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=GOOGL&apikey=${process.env.REACT_APP_KEY}`);
        const responseCompanyStockData= response.data;
        console.log(responseCompanyStockData);
        
        
        setName(responseCompanyName.data['bestMatches'][0]['2. name']);
        
       if(visualization==="Timeseries"){
        const stockData = new Object();
        stockData.name=responseCompanyName.data['bestMatches'][0]['2. name'];
        stockData.data = getDataArray(responseCompanyStockData);
        const newSeries = [stockData];
         setSeries(newSeries);
       }
       else if( visualization ==="Bar Chart" && all === 'contained'){
        const monthlyTimeSeries = responseCompanyStockData['Monthly Adjusted Time Series'];
        //console.log(monthlyTimeSeries);
        const dates = Object.keys(monthlyTimeSeries)?.map((date) => {
            
            return date;
        });
        let highValues = Object.keys(monthlyTimeSeries)?.map((date) => {
            const high = monthlyTimeSeries[date]['2. high'];
            return high;
        });
        const lowValues = Object.keys(monthlyTimeSeries)?.map((date) => {
            const low = monthlyTimeSeries[date]['3. low'];
            return low;
        });
        const openValues = Object.keys(monthlyTimeSeries)?.map((date) => {
            const open = monthlyTimeSeries[date]['1. open'];
            return open;
        });
        const closeValues = Object.keys(monthlyTimeSeries)?.map((date) => {
            const close = monthlyTimeSeries[date]['5. adjusted close'];
            return close;
        });
        const datesSliced = dates.slice(0,25);
        const highValuesSliced = highValues.slice(0,25);
        const lowValuesSliced = lowValues.slice(0,25);
        const openValuesSliced = openValues.slice(0,25);
        const closeValuesSliced = closeValues.slice(0,25);
        const stockDataBarHigh = {name:'High',data:highValuesSliced};
        const stockDataBarLow = {name:'Low',data:lowValuesSliced};
        const stockDataBarOpen = {name:'Open',data:openValuesSliced};
        const stockDataBarClose = {name:'Close',data:closeValuesSliced};
        const newSeries = [stockDataBarHigh,stockDataBarLow,stockDataBarOpen,stockDataBarClose];
        setOptionsBar((prevOptions)=>{
            return {...prevOptions,xaxis:{categories:datesSliced,tickPlacement: 'on'}}
        }) ;
        console.log(newSeries);
        setSeriesBar(newSeries);
       }
       else if( visualization ==="Bar Chart" && week === 'contained'){
        const weeklyTimeSeries = responseCompanyStockData['Weekly Adjusted Time Series'];
        //console.log(monthlyTimeSeries);
        const dates = Object.keys(weeklyTimeSeries)?.map((date) => {
            
            return date;
        });
        let highValues = Object.keys(weeklyTimeSeries)?.map((date) => {
            const high = weeklyTimeSeries[date]['2. high'];
            return high;
        });
        const lowValues = Object.keys(weeklyTimeSeries)?.map((date) => {
            const low = weeklyTimeSeries[date]['3. low'];
            return low;
        });
        const openValues = Object.keys(weeklyTimeSeries)?.map((date) => {
            const open = weeklyTimeSeries[date]['1. open'];
            return open;
        });
        const closeValues = Object.keys(weeklyTimeSeries)?.map((date) => {
            const close = weeklyTimeSeries[date]['5. adjusted close'];
            return close;
        });
        const datesSliced = dates.slice(0,25);
        const highValuesSliced = highValues.slice(0,25);
        const lowValuesSliced = lowValues.slice(0,25);
        const openValuesSliced = openValues.slice(0,25);
        const closeValuesSliced = closeValues.slice(0,25);
        const stockDataBarHigh = {name:'High',data:highValuesSliced};
        const stockDataBarLow = {name:'Low',data:lowValuesSliced};
        const stockDataBarOpen = {name:'Open',data:openValuesSliced};
        const stockDataBarClose = {name:'Close',data:closeValuesSliced};
        const newSeries = [stockDataBarHigh,stockDataBarLow,stockDataBarOpen,stockDataBarClose];
        setOptionsBar((prevOptions)=>{
            return {...prevOptions,xaxis:{categories:datesSliced,tickPlacement: 'on'}}
        }) ;
        //console.log(newSeries);
        setSeriesBar(newSeries);
       }
      } catch (error) {
        console.log('Error fetching the stock data:', error);
      }
    }
    
    
    

    useEffect(()=>{
        fetchStockData();
    },[visualization,activeUrl,options])

    return (
        <div className="container" style={{borderRadius:'25px'}}>
          
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
          {day!=='contained' && <MenuItem value="Bar Chart"onClick={handleClose}>Bar Chart</MenuItem> }</Menu>
      
        </div>
      </Typography>
           {visualization==='Timeseries' &&<Chart key={`${visualization}-${activeUrl}-${all}-${day}-${week}`} className="visualization"options={options} series={series} type="area" height={650} width={1200}
            ></Chart>}
            {visualization==='Bar Chart' &&<Chart key={`${visualization}-${activeUrl}-${optionsBar}-${all}-${day}-${week}`} className="visualization"options={optionsBar} series={seriesBar} type="bar" height={650} width={1200}
            ></Chart>}
            {/* {visualization==='Candlestick' &&<Chart key={`${visualization}-${activeUrl}`} className="visualization"options={options} series={series} type="bar" height={350} width={600}
            ></Chart>} */}
        </div>
    )
}

export default StockDisplay;