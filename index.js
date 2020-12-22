const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const { pool } = require('./config')
const { request, response } = require('express')

const app = express()

// Parte da segurança
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

const getProdutos = (request, response, next) => {
    pool.query('SELECT * FROM produtos', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

const addProduto = (request, response, next) => {
    const { nome, preco, estoque } = request.body

    pool.query(
        'INSERT INTO PRODUTOS (nome, preco, estoque) values ($1, $2, $3)',
        [nome, preco, estoque],
        (error) => {
            if (error) {
                throw error
            }
            response.status(201).json({ status: 'success', message: 'Produto criado com sucesso' })
        }
    )
}


const updateProduto = (request, response, next) => {
    const { codigo, nome, preco, estoque } = request.body
    pool.query(
        'UPDATE produtos set nome = $1, preco=$2, estoque = $3 where codigo=$4',
        [nome, preco, estoque, codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(401).json({ status: 'error', message: 'Não foi possivel atualizar o produto' });
            }
            return response.status(201).json({ status: 'success', message: 'Produto atualizado com sucesso' })
        },
    )
}

const deleteProduto = (request, response, next) => {
    const codigo = parseInt(request.params.id)

    pool.query(
        'DELETE from produtos where codigo=$1',
        [codigo],
        (error, results) => {
            if (error || results.rowCount == 0) {
                return response.status(401).json({ status: 'error', message: 'Não foi possivel remover o produto' });
            }
            response.status(201).json({ status: 'success', message: 'Produto removido com sucesso' })
        },
    )
}

const getProdutosPorID = (request, response, next) => {
    const codigo = parseInt(request.params.id)
    pool.query('SELECT * FROM produtos where codigo = $1', [codigo], (error, results) => {
        if (error || results.rowCount == 0) {
            return response.status(401).json({ status: 'error', message: 'Não foi possivel recuperar o produto' });
        }
        response.status(200).json(results.rows)
    })
}


// login autenticação
const login = (request, response, next) =>{
    const {nomeusuario, senha} = request.body
    pool.query('SELECT * FROM usuarios where nome_usuario = $1 and senha = $2',[nomeusuario, senha], (error, results) =>{
        if(error || results.rowCount == 0) {
            return response.status(401).json({ auth: false, message: 'usuário ou Senha inválidos'});
        }
        const nome_usuario = results.rows[0].nome_usuario; //ID do usuário retornado do BD
        const token = jwt.sign({nome_usuario}, process.env.SECRET, {
            expiresIn: 300 //expira em 5 min
        })
        return response.json({auth: true, token: token})
    },
    )
  }
  
  // verificação do token
  function verificaJWT(request, response, next){
    const token = request.headers['x-access-token'];
    if (!token) return response.status(401).json({ auth: false, message: 'Nenhum token recebido.' });
    
    jwt.verify(token, process.env.SECRET, function(err, decoded) {
      if (err) return response.status(500).json({ auth: false, message: 'Erro ao autenticar o token.' });
      
      // Se o token for válido, salva no request para uso posterior
      request.userId = decoded.id;
      next();
    });
  }


app
    .route('/api/produtos')
    .get(verificaJWT, getProdutos)
    .post(verificaJWT, addProduto)
    .put(verificaJWT, updateProduto)
app.route('/api/produtos/:id')
    .get(verificaJWT, getProdutosPorID)
    .delete(verificaJWT, deleteProduto)

// rota do login
app
  .route("/api/login")
  .post(login)   


app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor rodando a API');
})
