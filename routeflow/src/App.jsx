import './App.css';

function App() {
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

          <div className="hero-actions">
            <button>Adicionar parada</button>
            <button className="secondary">Ver rota</button>
          </div>
        </div>

        <div className="map-card">
          <h2>Rota do dia</h2>

          <div className="route-list">
            <div className="route-item">
              <span>1</span>
              <p>Saída - Estremoz</p>
            </div>

            <div className="route-item">
              <span>2</span>
              <p>Cliente A</p>
            </div>

            <div className="route-item">
              <span>3</span>
              <p>Cliente B</p>
            </div>

            <div className="route-item">
              <span>4</span>
              <p>Cliente C</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
