import './App.css';
import {useState} from 'react';
import StockDisplay from './components/stockDisplay.js';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar.js';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer';
import StockDisplayPage from './pages/StockDisplayPage';
import CompareStocks from './components/CompareStocks';
function App() {
  const [activeTicker, setActiveTicker] = useState('');
  return (

     
    <BrowserRouter>
    <Navbar setActiveTicker={setActiveTicker}></Navbar>
   
    <Routes>
      
      <Route path="/" element={<LandingPage />}/>
      <Route path="/visualize/:ticker" element={<StockDisplayPage />}>
      
      </Route>
      <Route path="/compare/:ticker1/:ticker2" element={<CompareStocks />}>
      
      </Route>
      
    </Routes>
    <Footer></Footer>
  </BrowserRouter>
  
  );
}

export default App;
