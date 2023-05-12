
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import './LandingPage.css';
import Image from "../logotext.png";
import Image2 from "../logo2.png";
import Image3 from "../landingImage.png";
import Button from '@mui/material/Button';


const LandingPage = () => {

    return ( <div className="container">
        <div className="containerLandingPageText">
            <Typography style={{color:"black"}}variant="h3">Transform the way you trade with</Typography>
        <img className="logoStock"src={Image2} alt="logo" style={{width:"250px"}}></img>
        <div className="landingImage">
        <img src={Image3} alt="logo" style={{width:"700px"}}></img>
        </div>
        
        </div>
    </div>);
    
}
export default LandingPage;