import React from 'react';
import ApexCharts from 'apexcharts'
import Chart from 'react-apexcharts';
import axios from 'axios';
import{useState, useEffect} from 'react';
import moment from 'moment';





let series1 =  [{
    name: 'Test Stock',
    data: [{x:'05/08/2023',y:500},{x:'05/07/2023',y:400},{x:'05/06/2023',y:600}]
  }];
let options = {
   
    chart: {
    type: 'area',
    stacked: false,
    height: 350,
    zoom: {
      type: 'x',
      enabled: true,
      autoScaleYaxis: true
    },
    toolbar: {
      autoSelected: 'zoom'
    }
  },
  dataLabels: {
    enabled: false
  },
  markers: {
    size: 0,
  },
  title: {
    text: 'Apple Stock Price',
    align: 'left'
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
  yaxis: {
    labels: {
      formatter: function (val) {
        return '$ '+(val).toFixed(0);
      },
    },
    title: {
      text: 'Price'
    },
  },
  xaxis: {
    type: 'datetime',
    labels: {
        rotate: -15,
        rotateAlways: true,
        formatter: function(timestamp,val) {
           
          return moment.unix(timestamp).format("DD MMM hh:mm")
      }}
  },
  tooltip: {
    shared: false,
    y: {
      formatter: function (val) {
        return '$ '+(val ).toFixed(2)
      }
    }
  }
  };

 
function StockDisplay(){
    
    const [series,setSeries] = useState([]);

    function toTimestamp(strDate){
        var datum = Date.parse(strDate);
   
        return datum/1000;
     }
    
    async function fetchStockData() {
      try {
        const response = await axios.get(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=AAPL&interval=5min&apikey=${process.env.REACT_APP_KEY1}`);
        const data1= response.data;
    
     
     
    
    
        const dataArray = Object.keys(data1['Time Series (5min)'])?.map((date) => {
            let tempArray =[];
            tempArray.push(toTimestamp(date));
            tempArray.push(parseFloat(data1['Time Series (5min)'][date]['4. close']));
            return tempArray
        }
            
          
        
        );
       
        const stockData = new Object();
        stockData.name='Apple';
        stockData.data =dataArray
        const newSeries = [stockData];
      

         setSeries(newSeries);
        
      } catch (error) {
        console.log('Error fetching the stock data:', error);
      }
    }
    
    
    

    useEffect(()=>{
         fetchStockData();
       
        
    },[])

    return (
        <div>
            <Chart options={options} series={series} type="area" height={350} width={600}
            ></Chart>
        </div>
    )
}

export default StockDisplay;