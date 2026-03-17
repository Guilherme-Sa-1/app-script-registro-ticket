import { useState } from 'react'

export default function DespesasFixas() {
  const [despesas, setDespesas] = useState([])
  const [nome, setNome] = useState('')
  const [valor, setValor] = useState('')

  // Adicionar nova despesa fixa
  const adicionarDespesa = (e) => {
    e.preventDefault()
    if (!nome || !valor) return

    const novaDespesa = {
      id: Date.now(),
      nome: nome,
      valor: parseFloat(valor),
      pago: false // Toda despesa começa como "não paga"
    }

    setDespesas([...despesas, novaDespesa])
    setNome('')
    setValor('')
  }

  // Remover despesa
  const removerDespesa = (id) => {
    setDespesas(despesas.filter(despesa => despesa.id !== id))
  }

  // Marcar como pago ou não pago
  const alternarStatus = (id) => {
    setDespesas(despesas.map(despesa => 
      despesa.id === id ? { ...despesa, pago: !despesa.pago } : despesa
    ))
  }

  // Cálculos Automáticos
  const totalGeral = despesas.reduce((acc, d) => acc + d.valor, 0)
  const totalPago = despesas.filter(d => d.pago).reduce((acc, d) => acc + d.valor, 0)
  const totalFalta = totalGeral - totalPago

  return (
    <section style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
      <h2>📌 Despesas Fixas do Mês</h2>
      
      {/* Resumo Financeiro */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#f9f9f9', padding: '10px' }}>
        <p><strong>Total:</strong> R$ {totalGeral.toFixed(2)}</p>
        <p style={{ color: 'green' }}><strong>Pago:</strong> R$ {totalPago.toFixed(2)}</p>
        <p style={{ color: 'red' }}><strong>Falta:</strong> R$ {totalFalta.toFixed(2)}</p>
      </div>

      {/* Formulário */}
      <form onSubmit={adicionarDespesa} style={{ marginBottom: '20px' }}>
        <input 
          type="text" placeholder="Nome da Conta (ex: Aluguel)" 
          value={nome} onChange={(e) => setNome(e.target.value)} 
        />
        <input 
          type="number" placeholder="Valor" step="0.01"
          value={valor} onChange={(e) => setValor(e.target.value)} 
        />
        <button type="submit">Adicionar Conta</button>
      </form>

      {/* Lista de Despesas */}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {despesas.map(despesa => (
          <li key={despesa.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', padding: '10px', backgroundColor: despesa.pago ? '#e6ffe6' : '#ffe6e6' }}>
            
            <div>
              <input 
                type="checkbox" 
                checked={despesa.pago} 
                onChange={() => alternarStatus(despesa.id)} 
                style={{ marginRight: '10px' }}
              />
              <span style={{ textDecoration: despesa.pago ? 'line-through' : 'none' }}>
                {despesa.nome} - R$ {despesa.valor.toFixed(2)}
              </span>
            </div>

            <button onClick={() => removerDespesa(despesa.id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', cursor: 'pointer', padding: '5px 10px' }}>
              X
            </button>

          </li>
        ))}
      </ul>
    </section>
  )
}