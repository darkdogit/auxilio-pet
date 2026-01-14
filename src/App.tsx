import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Cadastro from './pages/Cadastro';
import Questionario from './pages/Questionario';
import Analise from './pages/Analise';
import AdminNew from './pages/AdminNew';
import Pagamento from './pages/Pagamento';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/questionario" element={<Questionario />} />
        <Route path="/analise" element={<Analise />} />
        <Route path="/pagamento" element={<Pagamento />} />
        <Route path="/admin" element={<AdminNew />} />
      </Routes>
    </Router>
  );
}

export default App;
