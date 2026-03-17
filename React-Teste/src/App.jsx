import { useState, useEffect } from 'react'
import './App.css'
import DespesasFixas from './components/DespesasFixas'

function App() {
  const [transacoes, setTransacoes] = useState([])
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState('entrada')

  useEffect(() => {
    buscarTransacoes()
  }, [])

  const buscarTransacoes = async () => {
    try {
      const resposta = await fetch('http://127.0.0.1:8000/transacoes')
      const dados = await resposta.json()
      setTransacoes(dados)
    } catch (erro) {
      console.error("Erro ao buscar dados:", erro)
    }
  }

  const adicionarTransacao = async (evento) => {
    evento.preventDefault()
    const novaTransacao = { descricao, valor: parseFloat(valor), tipo }

    try {
      const resposta = await fetch('http://127.0.0.1:8000/transacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaTransacao)
      })

      if (resposta.ok) {
        buscarTransacoes()
        setDescricao('')
        setValor('')
        setTipo('entrada')
      }
    } catch (erro) {
      console.error("Erro ao salvar dado:", erro)
    }
  }

  // NOVA FUNÇÃO: DELETAR TRANSAÇÃO
  const deletarTransacao = async (id) => {
    try {
      // Fazemos o fetch apontando para a URL com o ID específico, usando o método DELETE
      const resposta = await fetch(`http://127.0.0.1:8000/transacoes/${id}`, {
        method: 'DELETE'
      })

      if (resposta.ok) {
        // Se o Python apagou com sucesso, pedimos a lista atualizada para a tela recarregar
        buscarTransacoes()
      }
    } catch (erro) {
      console.error("Erro ao deletar dado:", erro)
    }
  }

  const saldoTotal = transacoes.reduce((acc, transacao) => {
    if (transacao.tipo === 'entrada') {
      return acc + transacao.valor
    } else {
      return acc - transacao.valor
    }
  }, 0)

  return (
    <main>
      <h1>Meu Controle Financeiro</h1>

      <section style={{ backgroundColor: '#f0f0f0', padding: '20px', borderRadius: '8px', textAlign: 'center' }}>
        <h2>Saldo Atual</h2>
        <h3 style={{ color: saldoTotal >= 0 ? 'green' : 'red', fontSize: '32px', margin: '0' }}>
          R$ {saldoTotal.toFixed(2)}
        </h3>
      </section>

      <section>
        <h2>Adicionar Transação</h2>
        <form onSubmit={adicionarTransacao}>
          <input 
            type="text" placeholder="Descrição" 
            value={descricao} onChange={(e) => setDescricao(e.target.value)} required
          />
          <input 
            type="number" placeholder="Valor" 
            value={valor} onChange={(e) => setValor(e.target.value)} required step="0.01"
          />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
          </select>
          <button type="submit">Adicionar</button>
        </form>
      </section>

      <section>
        <h2>Extrato</h2>
        <ul>
          {transacoes.map((transacao) => (
            <li key={transacao.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{transacao.descricao}</strong>: R$ {transacao.valor.toFixed(2)} 
                <span style={{ color: transacao.tipo === 'entrada' ? 'green' : 'red', marginLeft: '10px' }}>
                  ({transacao.tipo})
                </span>
              </div>
              
              {/* NOVO BOTÃO DE EXCLUIR */}
              <button 
                onClick={() => deletarTransacao(transacao.id)} 
                style={{ backgroundColor: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Excluir
              </button>

            </li>
          ))}
        </ul>
      </section>

      <hr style={{ margin: '40px 0' }} />
      <DespesasFixas />
    </main>
  )
}

export default App