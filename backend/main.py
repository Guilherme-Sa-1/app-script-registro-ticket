import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from pydantic import BaseModel # 1. Importando o "molde" de segurança

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# 2. Criando o "molde" da Transação
class TransacaoBase(BaseModel):
    descricao: str
    valor: float
    tipo: str

@app.get("/")
def rota_principal():
    return {"mensagem": "API do Controle Financeiro está online! 🚀"}

@app.get("/transacoes")
def listar_transacoes():
    resposta = supabase.table("transacoes").select("*").execute()
    return resposta.data

# 3. Nova rota para CRIAR uma transação no banco de dados
@app.post("/transacoes")
def criar_transacao(transacao: TransacaoBase):
    # Transforma o molde em um dicionário que o Supabase entende
    dados = {
        "descricao": transacao.descricao,
        "valor": transacao.valor,
        "tipo": transacao.tipo
    }
    
    # Insere no banco de dados
    resposta = supabase.table("transacoes").insert(dados).execute()
    
    # Retorna o que foi salvo para confirmar
    return resposta.data

@app.delete("/transacoes/{id}")
def deletar_transacao(id: int):
    # Vai na tabela 'transacoes', procura onde a coluna "id" é igual ao id recebido, e deleta!
    resposta = supabase.table("transacoes").delete().eq("id", id).execute()
    
    return resposta.data