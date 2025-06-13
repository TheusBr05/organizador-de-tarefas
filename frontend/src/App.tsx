import AppRoutes from './routes'
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

function App() {
  return (<>
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer
        autoClose={1500}
      />
    </BrowserRouter>
  </>)
}

export default App;
