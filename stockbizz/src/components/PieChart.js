import react from 'react';
import {useState,useEffect} from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';



const PieChart = (props) =>{

    const [series, setSeries] = useState([]);
    const [name,setName] = useState([]);
    const [options,setOptions]= useState({
        
        chart: {
          width: 600,
          type: 'pie',
          dataLabels:{
            enabled:true,
          }
        },
        labels: ['Profit', 'Costs'],
        
        responsive: [{
          breakpoint: 480,
          options: {
            chart: {
              width: 600
            },
            legend: {
              position: 'bottom'
            }
          }
        }]})

    async function fetchCompanyData() {
        try {
          const response = await axios.get(`https://www.alphavantage.co/query?function=OVERVIEW&symbol=${props.ticker}&apikey=${process.env.REACT_APP_KEY}`);
          console.log(response);
          const responseCompanyStockData= response.data;
         
          setName(responseCompanyStockData['Name']);
          
          const RevenueTTM = responseCompanyStockData["RevenueTTM"];
          const GrossProfitTTM = responseCompanyStockData["GrossProfitTTM"];
    
          const newSeries = [parseFloat(GrossProfitTTM),RevenueTTM-GrossProfitTTM];
          
           setSeries(newSeries);
         }
         catch (error) {
         console.log("Some Error Occured, try again later");
         
          ;
        }
      }
    useEffect(()=>{
        fetchCompanyData();
    },[props.ticker])

    return(<div>
        <Chart options={options} style={{ marginLeft:"30px",marginRight:"30px",marginTop:"150px",width:"500px"}}series={series} key={`${props.ticker}-${series}-${name}`} type="pie"></Chart>
    </div>)

}

export default PieChart;