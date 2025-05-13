import MainApp from './components/Main'
import './App.css'
import { GoogleAPIProvider } from './components/GoogleAPIProvider' 

function App() {
  return (
    <>
    <GoogleAPIProvider>
      <MainApp />
    </GoogleAPIProvider>
    </>
  )
}

export default App
