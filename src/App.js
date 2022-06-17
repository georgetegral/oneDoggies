import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Mint from './views/mint';
import Doggies from './views/doggies';
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
      </Routes>
    </MainLayout>
    </>
  ); 
}

export default App;