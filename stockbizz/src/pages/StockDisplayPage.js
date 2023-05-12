import react from 'react';
import { useParams } from 'react-router-dom';
import StockDisplay from '../components/stockDisplay';

const StockDisplayPage = ()=> {
const { ticker } = useParams();

return(<StockDisplay key={ticker}ticker={ticker}></StockDisplay>)
}
export default StockDisplayPage;