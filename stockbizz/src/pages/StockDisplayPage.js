import react from 'react';
import { useParams } from 'react-router-dom';
import StockDisplay from '../components/stockDisplay';
import PieChart from '../components/PieChart';
import Stack from '@mui/material/Stack';
import './stockDisplayPage.css';

const StockDisplayPage = ()=> {
const { ticker } = useParams();

return(<div className='stockDisplayPage'><PieChart className='pie' ticker ={ticker} key={ticker}></PieChart>
<StockDisplay key={`${ticker}-Pie`}ticker={ticker}></StockDisplay></div>
)
}
export default StockDisplayPage;