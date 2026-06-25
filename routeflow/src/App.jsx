import { useState } from 'react';
import './App.css';

function App() {
  const [novaParada, setNovaParada] = useState('');
  const [paradas, setParadas] = useState([
    'Saída - Estremoz',
    'Cliente A - Entregar depois das 10h',
    'Cliente B - Prioridade alta',
    'Cliente C - Recebe até 12h',
  ]);

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

  function moverParaCima(index) {
    if (index === 0) return;

    const novaLista = [...paradas];
    const paradaAtual = novaLista[index];

    novaLista[index] = novaLista[index - 1];
    novaLista[index - 1] = paradaAtual;

    setParadas(novaLista);
  }

  function moverParaBaixo(index) {
    if (index === paradas.length - 1) return;

    const novaLista = [...paradas];
    const paradaAtual = novaLista[index];

    novaLista[index] = novaLista[index + 1];
    novaLista[index + 1] = paradaAtual;

    setParadas(novaLista);
  }

  function limparRota() {
    setParadas([]);
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="hero-content">
          <span className="tag">RouteFlow</span>

          <h1>Organize suas rotas de entrega com mais praticidade</h1>

          <p>
            Cadastre paradas, defina prioridades e organize manualmente a ordem da rota com base nos horários e
            necessidades reais de cada entrega.
          </p>

          <div className="form-parada">
            <input
              type="text"
              placeholder="Digite uma nova parada ou observação"
              value={novaParada}
              onChange={(event) => setNovaParada(event.target.value)}
            />

            <button onClick={adicionarParada}>Adicionar parada</button>
          </div>

          <div className="hero-actions">
            <button className="secondary" onClick={limparRota}>
              Limpar rota
            </button>
          </div>
        </div>

        <div className="map-card">
          <h2>Rota do dia</h2>

          {paradas.length === 0 ? (
            <p className="empty-message">Nenhuma parada cadastrada. Adicione uma parada para começar.</p>
          ) : (
            <div className="route-list">
              {paradas.map((parada, index) => (
                <div className="route-item" key={index}>
                  <span>{index + 1}</span>

                  <p>{parada}</p>

                  <div className="route-actions">
                    <button className="move-button" onClick={() => moverParaCima(index)} disabled={index === 0}>
                      ↑
                    </button>

                    <button
                      className="move-button"
                      onClick={() => moverParaBaixo(index)}
                      disabled={index === paradas.length - 1}
                    >
                      ↓
                    </button>

                    <button className="remove-button" onClick={() => removerParada(index)}>
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
