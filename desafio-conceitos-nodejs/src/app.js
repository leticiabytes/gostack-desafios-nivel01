const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (req, res) => {
  return res.json(repositories);
});

app.post("/repositories", (req, res) => {
  const { title, url, techs } = req.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }

  repositories.push(repository);
  return res.json(repository);
});

app.put("/repositories/:id", (req, res) => {
  const { id } = req.params;
  const { title, url, techs } = req.body;

  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id  
  );

  if (repositoryIndex === -1) {
    return res.status(400).json({ error: 'Repositorio não encontrado.' });
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository

  return res.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  if (repositoryIndex >= 0) {
    repositories.splice(repositoryIndex, 1);
  } else {
    return res.status(400).json({ error: "O repositório que você está tentando deletar, não existe" });
  }

  return res.status(204).send();
});

app.post("/repositories/:id/like", (req, res) => {
  const { id } = req.params;
  
  const repositoryIndex = repositories.findIndex(repository => 
    repository.id === id  
  );

  if (repositoryIndex === -1) {
    return res.status(400).json({ error: 'Repositorio não encontrado.' });
  }

  repositories[repositoryIndex].likes++;
  return res.json(repositories[repositoryIndex]);
});

module.exports = app;
