import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DisplayEmployee from './Displaypage'
import InsertEmp from './insertemp'
import UpdateEmployee from './updateEmp'

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<DisplayEmployee/>}></Route>
        <Route path='/insertemp' element={<InsertEmp/>}></Route>
        <Route path='/updateEmp/:id' element={<UpdateEmployee/>}></Route>
      </Routes>
    </Router>
    </>
  )
}

export default App
