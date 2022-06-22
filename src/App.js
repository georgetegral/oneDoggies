import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Mint from './views/mint';
import Doggies from './views/doggies';
import Doggie from './views/doggie';
import Breed from './views/breed';
import Marketplace from './views/marketplace';
import MainLayout from "./layouts/main";

function App() {
  useEffect(() => {
    if(window.ethereum) {
      window.ethereum
        .request({
          method: "eth_requestAccounts",
        })
        .then((accounts) => console.log(accounts))
    }
  }, []);

  return (
    <>
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/mint" element={<Mint />}/>
        <Route path="/doggies" element={<Doggies />}/>
        <Route path="/doggies/:tokenId" element={<Doggie />}/>
        <Route path="/breed" element={<Breed />}/>
        <Route path="/marketplace" element={<Marketplace />}/>
      </Routes>
    </MainLayout>
    </>
  ); 
}

export default App;