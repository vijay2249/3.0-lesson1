import { useState } from 'react'
import { NavBar, Services, Transactions, Welcome, Footer} from './components';
import './App.css'

const App = () => {

  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome">
        <NavBar/>
        <Welcome/>
      </div>
      <Services />
      <Transactions />
      <Footer />
    </div>
  )
}

export default App
