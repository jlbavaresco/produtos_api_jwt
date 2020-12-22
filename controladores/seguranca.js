
const { pool } = require('../config')
const { request, response, next } = require('express')

require("dotenv-safe").config();
const jwt = require('jsonwebtoken');


// login autenticação
const login = (request, response, next) => {
    const { nomeusuario, senha } = request.body
    pool.query('SELECT * FROM usuarios where nome_usuario = $1 and senha = $2', [nomeusuario, senha], (error, results) => {
        if (error || results.rowCount == 0) {
            return response.status(401).json({ auth: false, message: 'usuário ou Senha inválidos' });
        }
        const nome_usuario = results.rows[0].nome_usuario; //ID do usuário retornado do BD
        const token = jwt.sign({ nome_usuario }, process.env.SECRET, {
            expiresIn: 300 //expira em 5 min
        })
        return response.json({ auth: true, token: token })
    },
    )
}

// exportando a função para tornar visivel no index.js
module.exports.login = login;

// verificação do token
function verificaJWT(request, response, next) {
    const token = request.headers['x-access-token'];
    if (!token) return response.status(401).json({ auth: false, message: 'Nenhum token recebido.' });

    jwt.verify(token, process.env.SECRET, function (err, decoded) {
        if (err) return response.status(500).json({ auth: false, message: 'Erro ao autenticar o token.' });

        // Se o token for válido, salva no request para uso posterior
        request.userId = decoded.id;
        next();
    });
}

// exportando a função para tornar visivel no index.js
module.exports.verificaJWT = verificaJWT;