import{useState, useEffect} from 'react';
import Chart from 'react-apexcharts';
import axios from 'axios';




const AreaChart = (props) => {
    const [optionsArea,setOptionsArea]= useState({
    
        
        options: {
          chart: {
            sparkline: {
                enabled: true
            },
            type: 'area',
            width:"70%",
            zoom: {
              enabled: true
            },
          },
          yaxis: {
            lines: {
                show: false,
              },
            labels: {
              formatter: function (val) {
                return '$ '+(parseFloat(val)).toFixed(0);
              },
            },
            title: {
              text: 'Price'
            },
          },
        },
    });
    const [seriesArea,setSeriesArea] = useState([]);
  
  
        async function fetchStockData() {
            try {
              const response = await axios.get(`https://www.alphavantage.co/query?function=${props.activeUrl}&symbol=GOOGL&interval=5min&apikey=${process.env.REACT_APP_KEY}`);
             
              const responseCompanyStockData= response.data;
             
              
           
             if( props.all === 'contained'){
              const monthlyTimeSeries = responseCompanyStockData['Monthly Adjusted Time Series'];
              //console.log(monthlyTimeSeries);
              const dates = Object.keys(monthlyTimeSeries)?.map((date) => {
                  
                  return date;
              });
              let highValues = Object.keys(monthlyTimeSeries)?.map((date) => {
                  const high = parseFloat(monthlyTimeSeries[date]['2. high']);
                  return high.toFixed(2);
              });
              const lowValues = Object.keys(monthlyTimeSeries)?.map((date) => {
                  const low = parseFloat(monthlyTimeSeries[date]['3. low']);
                  return low.toFixed(2);
              });
              const openValues = Object.keys(monthlyTimeSeries)?.map((date) => {
                  const open = parseFloat(monthlyTimeSeries[date]['1. open']);
                  return open.toFixed(2);
              });
              const closeValues = Object.keys(monthlyTimeSeries)?.map((date) => {
                  const close = parseFloat(monthlyTimeSeries[date]['4. close']);
                  return close.toFixed(2);
              });
              const datesSliced = dates.slice(0,20).reverse();
              const highValuesSliced = highValues.slice(0,20).reverse();
              const lowValuesSliced = lowValues.slice(0,20).reverse();
              const openValuesSliced = openValues.slice(0,20).reverse();
              const closeValuesSliced = closeValues.slice(0,20).reverse();
              
              const stockDataBarHigh = {name:'High',data:highValuesSliced};
              const stockDataBarLow = {name:'Low',data:lowValuesSliced};
              const stockDataBarOpen = {name:'Open',data:openValuesSliced};
              const stockDataBarClose = {name:'Close',data:closeValuesSliced};
              const newSeries = [stockDataBarHigh,stockDataBarLow,stockDataBarOpen,stockDataBarClose];
              setOptionsArea((prevOptions)=>{
                  return {...prevOptions,xaxis:{categories:datesSliced,tickPlacement: 'on'}}
              }) ;
              console.log(newSeries);
              setSeriesArea(newSeries);
             }
             else if(  props.week === 'contained'){
              const weeklyTimeSeries = responseCompanyStockData['Weekly Adjusted Time Series'];
              //console.log(monthlyTimeSeries);
              const dates = Object.keys(weeklyTimeSeries)?.map((date) => {
                  
                  return date;
              });
              let highValues = Object.keys(weeklyTimeSeries)?.map((date) => {
                  const high = parseFloat(weeklyTimeSeries[date]['2. high']);
                  return high.toFixed(2);
              });
              const lowValues = Object.keys(weeklyTimeSeries)?.map((date) => {
                  const low = parseFloat(weeklyTimeSeries[date]['3. low']);
                  return low.toFixed(2);
              });
              const openValues = Object.keys(weeklyTimeSeries)?.map((date) => {
                  const open = parseFloat(weeklyTimeSeries[date]['1. open']);
                  return open.toFixed(2);
              });
              const closeValues = Object.keys(weeklyTimeSeries)?.map((date) => {
                  const close = parseFloat(weeklyTimeSeries[date]['4. close']);
                  return close.toFixed(2);
              });
              const datesSliced = dates.slice(0,20).reverse();
              const highValuesSliced = highValues.slice(0,20).reverse();
              const lowValuesSliced = lowValues.slice(0,20).reverse();
              const openValuesSliced = openValues.slice(0,20).reverse();
              const closeValuesSliced = closeValues.slice(0,20).reverse();
                console.log(highValues.length);
              const stockDataBarHigh = {name:'High',data:highValuesSliced};
              const stockDataBarLow = {name:'Low',data:lowValuesSliced};
              const stockDataBarOpen = {name:'Open',data:openValuesSliced};
              const stockDataBarClose = {name:'Close',data:closeValuesSliced};
              const newSeries = [stockDataBarHigh,stockDataBarLow,stockDataBarOpen,stockDataBarClose];
              setOptionsArea((prevOptions)=>{
                  return {...prevOptions,xaxis:{categories:datesSliced}}
              }) ;
              //console.log(newSeries);
              setSeriesArea(newSeries);
             }
            } catch (error) {
              console.log('Error fetching the stock data:', error);
            }
          }
          
          useEffect(()=>{
              fetchStockData();
          },[props.activeUrl])
      
        return <Chart key={`${props.activeUrl}-${optionsArea}-${props.all}-${props.day}-${props.week}`} className="visualization"options={optionsArea} series={seriesArea} type="area" style={{width:"70%"}}
        ></Chart>
}
export default AreaChart;