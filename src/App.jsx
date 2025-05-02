import './App.css'
import packageJson from '../package.json'; 
import Version from './components/Version';

function App() {

  return (
    <>
      <Version version={packageJson.version}/>
    </>
  )
}

export default App
