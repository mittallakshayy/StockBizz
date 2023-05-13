import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import './Navbar.css';
import Image from "../logotext.png";
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/material/Modal'; 
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));


  const style = {
    position: 'relative',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };


const Navbar = () => {

  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [ticker, setTicker]= useState('');
  const [tickerCompare1, setTickerCompare1]= useState('');
  const [tickerCompare2, setTickerCompare2]= useState('');
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = async (e)=>{
    
    if(e.target.value===''|| e.target.value.length===0){
      setStocks([]);
    }
    setSearchTerm(e.target.value);
   
   
  };

useEffect(() => {
  fetchStocks();
},[searchTerm]);

  const fetchStocks = async () => {
    try {
      if (searchTerm.length!==0) {
        const response =  await axios.get(
         `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchTerm}&apikey=${process.env.REACT_APP_KEY}`
        );
        
        const data = response?.data;
        if(data!==null && data!==undefined){
          //console.log(data);
        const topStocks = data['bestMatches'];
        const display = [];
        let symbol;
        let name;
        for(let i=0;i<topStocks.length;i++){
             symbol = topStocks[i]['1. symbol'];
             name = topStocks[i]['2. name'];
            display.push({symbol:symbol,name:name});
        }
        setStocks(display);
      }
      } else {
        setStocks([]);
      }
    } catch (error) {
      console.error('Error fetching stocks:', error);
    }
  };


    return ( <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
          <img className="logo"src={Image} onClick={()=>navigate("/")}alt="logo"></img>
            
           <div className="inputgroup"
           >
            
            <div>
      <Button className="compare"onClick={handleOpen}> Compare </Button>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Box sx={style}>
          <Typography id="keep-mounted-modal-title" variant="h6" component="h2">
            Enter first and second ticker symbol
          </Typography>
          <Stack style={{marginTop:"20px"}} direction="row" spacing={2}><Autocomplete 
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        onChange={(e,value)=>{setTickerCompare1(value.split("(")[0])}}
        options={stocks.map((option) => `${option.symbol}(${option.name})`)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Company Name"
            onChange={handleChange}
            
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
             
          <Autocomplete 
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        onChange={(e,value)=>{setTickerCompare2(value.split("(")[0])}}
        options={stocks.map((option) => `${option.symbol}(${option.name})`)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Company Name"
            onChange={handleChange}
            
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
             <Button id="navbutton"onClick={()=>{setOpen(false);navigate(`/compare/${tickerCompare1}/${tickerCompare2}`)}}variant="contained">Compare</Button></Stack>
        </Box>
      </Modal>
    </div>
            

<Autocomplete 
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        onChange={(e,value)=>{setTicker(value.split("(")[0])}}
        options={stocks.map((option) => `${option.symbol}(${option.name})`)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Company Name"
            onChange={handleChange}
            
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
             <Button id="navbutton"onClick={()=>{navigate(`/visualize/${ticker}`)}}variant="contained">Search</Button></div>
            
          </Toolbar>
        </AppBar>
      </Box>);
    
}
export default Navbar ;