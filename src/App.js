import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Top from './components/Top';
import { Container } from 'react-bootstrap';
import Bottom from './components/Bottom';
import About from './components/About';
import Menu from './components/Menu';

function App() {
  return (
    <Container className="App">
      <Top/>
      <Menu/>
      <Bottom/>
    </Container>
  );
}

export default App;
