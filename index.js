const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()



// Parte da segurança
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded()); 
app.use(cors())

// importanto o controle de produtos
const controleProdutos = require('./controladores/produtos')

// importando o controle de segurança
const seguranca = require('./controladores/seguranca')

app
    .route('/api/produtos')
    .get(seguranca.verificaJWT, controleProdutos.getProdutos)
    .post(seguranca.verificaJWT, controleProdutos.addProduto)
    .put(seguranca.verificaJWT, controleProdutos.updateProduto)
app.route('/api/produtos/:id')
    .get(seguranca.verificaJWT, controleProdutos.getProdutosPorID)
    .delete(seguranca.verificaJWT, controleProdutos.deleteProduto)

// rota do login
app
  .route("/api/login")
  .post(seguranca.login)   


app.listen(process.env.PORT || 3002, () => {
    console.log('Servidor rodando a API');
})
