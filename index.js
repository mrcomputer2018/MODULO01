const express = require('express');

const server = express();

server.use(express.json());

const port = 3000;

const cursos = [ 'nodejs', 'Javascript', 'React Native'];

// Middleware global - executou independentemente da rota
server.use((req,res, next) => {
    console.log(`>>>URL chamada: ${req.url}`);

    // para seguir o fluxo de execução
    return next;
});

// query params = ?nome=nodejs
// Route params = /curso/2
// Request body =  um objeto dentro do corpo da requisição
// { nome "nodejs", tipo: "backend" }

//Rotas
server.get('/cursos', (req, res) => {
    console.log('Rota /cursos acessada');

    return res.json(cursos);
});

function check(req, res, next) { 
    if (!req.body.name) {
        return res.status(400).json({ error: "Nome do curso é obrigatorio." });
    }

    return next();
}

function checkIndex(req, res, next) { 
    const curso = cursos[req.params.index];

    if(curso) {
       return res.status(400).json({ error: "O curso não existe." });
    }

    req.curso = curso;
    
    return next();
}

// /: para dizer que esta esperando um route params
server.get('/cursos/:index', checkIndex, (req, res) => { 
    console.log("Rota /cursos/:index acessada");

    //const index = req.params.index; //localhost:3000/curso/2?nome=PHP

    //const name = req.query.name; //localhost:3000/curso?nome=JavaScript

    // res.send('Hello world!!');
    // res.json({ curso: `Aprendendo ${nome} - id: ${id}` })
    return res.json(req.curso);
});

server.post('/cursos', check, (req, res) => {
    const name = req.body.name;
    cursos.push(name);

    // retornando para o frontend
    return res.json(cursos);
});

server.put('/cursos/:index', check, checkIndex, (req, res) => {
    const index = req.params.index;
    const name = req.body.name;

    cursos[index] = name;

    return res.json(cursos);
});

server.delete('/cursos/:index', checkIndex, (req, res) => {
    const index = req.params.index;

    cursos.splice(index, 1);

    return res.json({ message: " Curso removido com sucesso." });
});

server.listen(port, () => {
    console.log('listening on port: ' + port);
}); 