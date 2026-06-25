import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [novaParada, setNovaParada] = useState('');
  const [prioridade, setPrioridade] = useState('Normal');
  const [observacao, setObservacao] = useState('');

  const [paradas, setParadas] = useState(() => {
    const paradasSalvas = localStorage.getItem('routeflow-paradas');

    if (paradasSalvas) {
      return JSON.parse(paradasSalvas);
    }

    return [
      {
        nome: 'Saída - Estremoz',
        prioridade: 'Alta',
        observacao: 'Início da rota',
      },
      {
        nome: 'Cliente A',
        prioridade: 'Normal',
        observacao: 'Entregar depois das 10h',
      },
      {
        nome: 'Cliente B',
        prioridade: 'Alta',
        observacao: 'Entrega urgente',
      },
      {
        nome: 'Cliente C',
        prioridade: 'Baixa',
        observacao: 'Recebe até 12h',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('routeflow-paradas', JSON.stringify(paradas));
  }, [paradas]);

  function adicionarParada() {
    if (novaParada.trim() === '') {
      alert('Digite o nome da parada.');
      return;
    }

    const parada = {
      nome: novaParada,
      prioridade: prioridade,
      observacao: observacao || 'Sem observação',
    };

    setParadas([...paradas, parada]);
    setNovaParada('');
    setPrioridade('Normal');
    setObservacao('');
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
              placeholder="Nome da parada"
              value={novaParada}
              onChange={(event) => setNovaParada(event.target.value)}
            />

            <select value={prioridade} onChange={(event) => setPrioridade(event.target.value)}>
              <option value="Alta">Alta</option>
              <option value="Normal">Normal</option>
              <option value="Baixa">Baixa</option>
            </select>

            <input
              type="text"
              placeholder="Horário ou observação"
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
            />

            <button onClick={adicionarParada}>Adicionar</button>
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

                  <div className="route-info">
                    <p>{parada.nome}</p>

                    <small>
                      Prioridade: {parada.prioridade} · {parada.observacao}
                    </small>
                  </div>

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
