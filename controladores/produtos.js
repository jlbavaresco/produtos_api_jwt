const { pool } = require('../config')
const { request, response, next } = require('express')

const getProdutos = (request, response, next) => {
    pool.query('SELECT * FROM produtos', (error, results) => {
        if (error) {
            throw error
        }
        response.status(200).json(results.rows)
    })
}

// exportando a função para tornar visivel no index.js
module.exports.getProdutos = getProdutos;

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

// exportando a função para tornar visivel no index.js
module.exports.addProduto = addProduto;

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

// exportando a função para tornar visivel no index.js
module.exports.updateProduto = updateProduto;

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

// exportando a função para tornar visivel no index.js
module.exports.deleteProduto = deleteProduto;

const getProdutosPorID = (request, response, next) => {
    const codigo = parseInt(request.params.id)
    pool.query('SELECT * FROM produtos where codigo = $1', [codigo], (error, results) => {
        if (error || results.rowCount == 0) {
            return response.status(401).json({ status: 'error', message: 'Não foi possivel recuperar o produto' });
        }
        response.status(200).json(results.rows)
    })
}

// exportando a função para tornar visivel no index.js
module.exports.getProdutosPorID = getProdutosPorID;
