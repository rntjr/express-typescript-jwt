import express, { Request, Response } from 'express'
import jsonwebtoken from 'jsonwebtoken'
import {json} from 'body-parser';
import {v4 as uuid} from 'uuid'

const app = express();
const bodyParser = json();

const secret = 'ada68b5e-6b93-4d70-8635-268bd99bdf2e';

app.use(bodyParser);

class Usuario {
  usuario: string
  senha: string
}

class Produto {
  id: string
  nome: string
}

const produtos: Produto[] = [
  {id: uuid(),nome: "Sapato"},
  {id: uuid(),nome: "Camisa"},
  {id: uuid(),nome: "Blusa"},
  {id: uuid(),nome: "Chapeu"},
]

const usuarioRepository: Usuario[] = [
  {usuario: "teste", senha: "teste"},
  {usuario: "teste1", senha: "teste1"},
  {usuario: "teste2", senha: "teste2"},
  {usuario: "teste3", senha: "teste3"},
  {usuario: "teste4", senha: "teste4"}
]


// Rota
app.post('/login',(request: Request, response: Response) => {
  const usuario: Usuario = request.body
  const isUsuarioExiste = usuarioRepository.find(usuarioRepo => usuarioRepo.usuario === usuario.usuario);
  if (!isUsuarioExiste) return response.json({message: "Usuario nao existe!"})

  if (!(isUsuarioExiste.senha === usuario.senha)) return response.json({message: "Senha incorreta!"});

  const token: string = jsonwebtoken.sign({}, secret, {expiresIn: "1h"});
  
  return response.json({token})
})


app.get('/produtos',(request: Request, response: Response) => {
  const token = request.headers.authorization.split(" ")[1];
  jsonwebtoken.verify(token, secret,(err)=>{
    if (err) return response.status(400).json()
  })
  return  response.json(produtos)
})

app.listen(8080,()=> console.log('Servidor iniciado!'))