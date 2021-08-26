const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checksRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);
  
  if(repositoryIndex < 0) {
    return response.status(404).json({error: 'Repository not found'});
  }

  request.repository = repositories[repositoryIndex];
  request.repositoryIndex = repositoryIndex;
  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checksRepositoryExists, (request, response) => {
  const { repository } = request;
  const {likes, ...repositoryChanges} = request.body;

  const updatedRepository = { ...repository, ...repositoryChanges };
  Object.assign(repository, updatedRepository);

  return response.json(repository);
});

app.delete("/repositories/:id", checksRepositoryExists, (request, response) => {
  const { repositoryIndex } = request;
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checksRepositoryExists, (request, response) => {
  const { repository } = request;
  
  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
