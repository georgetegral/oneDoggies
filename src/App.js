import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './views/home';
import Mint from './views/mint';
import Avatars from './views/avatars';
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
        <Route path="/avatars" element={<Avatars />}/>
      </Routes>
    </MainLayout>
    </>
  ); 
}

export default App;