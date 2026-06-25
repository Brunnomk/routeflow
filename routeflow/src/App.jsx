import { useState } from 'react';
import './App.css';

function App() {
  const [novaParada, setNovaParada] = useState('');
  const [paradas, setParadas] = useState(['Saída - Estremoz', 'Cliente A', 'Cliente B', 'Cliente C']);

  function adicionarParada() {
    if (novaParada.trim() === '') {
      alert('Digite o nome da parada.');
      return;
    }

    setParadas([...paradas, novaParada]);
    setNovaParada('');
  }

  function removerParada(index) {
    const novaLista = paradas.filter((_, i) => i !== index);
    setParadas(novaLista);
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="hero-content">
          <span className="tag">RouteFlow</span>

          <h1>Organize suas rotas de entrega com mais praticidade</h1>

          <p>
            Cadastre paradas, monte seu circuito diário e visualize uma rota organizada para melhorar o planejamento das
            entregas.
          </p>

          <div className="form-parada">
            <input
              type="text"
              placeholder="Digite uma nova parada"
              value={novaParada}
              onChange={(event) => setNovaParada(event.target.value)}
            />

            <button onClick={adicionarParada}>Adicionar parada</button>
          </div>

          <div className="hero-actions">
            <button className="secondary">Ver rota</button>
          </div>
        </div>

        <div className="map-card">
          <h2>Rota do dia</h2>

          <div className="route-list">
            {paradas.map((parada, index) => (
              <div className="route-item" key={index}>
                <span>{index + 1}</span>

                <p>{parada}</p>

                <button className="remove-button" onClick={() => removerParada(index)}>
                  X
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
