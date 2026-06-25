import { useEffect, useState } from 'react';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function obterCoordenadas(nome) {
  const texto = nome.toLowerCase();

  if (texto.includes('estremoz')) return [38.8443, -7.5859];
  if (texto.includes('borba')) return [38.8055, -7.4546];
  if (texto.includes('arraiolos')) return [38.7236, -7.9849];
  if (texto.includes('évora') || texto.includes('evora')) return [38.5714, -7.9135];
  if (texto.includes('lisboa')) return [38.7223, -9.1393];

  return null;
}

function normalizarParada(parada) {
  if (typeof parada === 'string') {
    return {
      nome: parada,
      prioridade: 'Normal',
      observacao: 'Sem observação',
      concluida: false,
      coordenadas: obterCoordenadas(parada),
    };
  }

  return {
    nome: parada.nome || 'Parada sem nome',
    prioridade: parada.prioridade || 'Normal',
    observacao: parada.observacao || 'Sem observação',
    concluida: parada.concluida || false,
    coordenadas: parada.coordenadas || obterCoordenadas(parada.nome || ''),
  };
}

function App() {
  const [novaParada, setNovaParada] = useState('');
  const [prioridade, setPrioridade] = useState('Normal');
  const [observacao, setObservacao] = useState('');

  const [paradas, setParadas] = useState(() => {
    const paradasSalvas = localStorage.getItem('routeflow-paradas');

    if (paradasSalvas) {
      try {
        return JSON.parse(paradasSalvas).map(normalizarParada);
      } catch {
        return [];
      }
    }

    return [
      {
        nome: 'Saída - Estremoz',
        prioridade: 'Alta',
        observacao: 'Início da rota',
        concluida: false,
        coordenadas: [38.8443, -7.5859],
      },
      {
        nome: 'Borba',
        prioridade: 'Normal',
        observacao: 'Entrega depois das 10h',
        concluida: false,
        coordenadas: [38.8055, -7.4546],
      },
      {
        nome: 'Arraiolos',
        prioridade: 'Alta',
        observacao: 'Entrega urgente',
        concluida: false,
        coordenadas: [38.7236, -7.9849],
      },
      {
        nome: 'Évora',
        prioridade: 'Baixa',
        observacao: 'Recebe até 12h',
        concluida: false,
        coordenadas: [38.5714, -7.9135],
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('routeflow-paradas', JSON.stringify(paradas));
  }, [paradas]);

  const pontosNoMapa = paradas
    .map((parada) => ({
      ...parada,
      coordenadas: parada.coordenadas || obterCoordenadas(parada.nome),
    }))
    .filter((parada) => parada.coordenadas);

  const centroMapa = pontosNoMapa.length > 0 ? pontosNoMapa[0].coordenadas : [38.8443, -7.5859];

  function adicionarParada() {
    if (novaParada.trim() === '') {
      alert('Digite o nome da parada.');
      return;
    }

    const parada = {
      nome: novaParada,
      prioridade: prioridade,
      observacao: observacao || 'Sem observação',
      concluida: false,
      coordenadas: obterCoordenadas(novaParada),
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

  function alternarConcluida(index) {
    const novaLista = paradas.map((parada, i) => {
      if (i === index) {
        return {
          ...parada,
          concluida: !parada.concluida,
        };
      }

      return parada;
    });

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

          <div className="map-view">
            <MapContainer center={centroMapa} zoom={9} scrollWheelZoom={false} className="leaflet-map">
              <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {pontosNoMapa.length > 1 && (
                <Polyline positions={pontosNoMapa.map((parada) => parada.coordenadas)} color="#38bdf8" weight={4} />
              )}

              {pontosNoMapa.map((parada, index) => (
                <Marker position={parada.coordenadas} key={`${parada.nome}-${index}`}>
                  <Popup>
                    <strong>
                      {index + 1}. {parada.nome}
                    </strong>
                    <br />
                    Prioridade: {parada.prioridade}
                    <br />
                    {parada.observacao}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {paradas.length === 0 ? (
            <p className="empty-message">Nenhuma parada cadastrada. Adicione uma parada para começar.</p>
          ) : (
            <div className="route-list">
              {paradas.map((parada, index) => (
                <div className={`route-item ${parada.concluida ? 'completed' : ''}`} key={index}>
                  <span>{index + 1}</span>

                  <div className="route-info">
                    <p>{parada.nome}</p>

                    <small>
                      Prioridade: {parada.prioridade} · {parada.observacao}
                    </small>
                  </div>

                  <div className="route-actions">
                    <button className="done-button" onClick={() => alternarConcluida(index)}>
                      ✓
                    </button>

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
