const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const connectionString ='mongodb+srv://LOBATO:*Lobato2704@cluster0.05aixex.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(connectionString, {
})
  .then(() => {
    console.log('Conexão com o MongoDB estabelecida com sucesso');

    const Movie = mongoose.model('Movie', {
      nomeViewer: String,
      filme: String,
      ano: String,
      genero: String,
      tempoCenaExplicita: String,
      resumo: String,
      tempoDuracao: String,
      link: String,
      autorizado: { type: Boolean, default: false },
      videoId: String,
      avaliacao: Number,
      assistido: Boolean
    });

    const AuthorizedMovie = mongoose.model('AuthorizedMovie', {
      nomeViewer: String,
      filme: String,
      ano: String,
      genero: String,
      tempoCenaExplicita: String,
      resumo: String,
      tempoDuracao: String,
      link: String,
      autorizado: { type: Boolean, default: false },
      videoId: String,
      avaliacao: Number,
      assistido: Boolean
    });

    const pendentesRouter = express.Router();

    pendentesRouter.get('/', (req, res) => {
      Movie.find({ autorizado: false })
        .then(filmesPendentes => {
          res.status(200).json(filmesPendentes);
        })
        .catch(err => {
          console.error('Erro ao recuperar filmes pendentes do banco de dados:', err);
          res.status(500).json({ error: 'Erro ao recuperar filmes pendentes do banco de dados' });
        });
    });

    app.post('/api/movies/pendentes', (req, res) => {
      const filmeData = req.body;
      console.log('Recebendo solicitação para adicionar filme pendente:', filmeData);
      const novoFilme = new Movie({ ...filmeData, autorizado: false });

      novoFilme.save()
        .then(filmeSalvo => {
          res.status(201).json(filmeSalvo);
        })
        .catch(error => {
          console.error('Erro ao adicionar filme pendente:', error);
          res.status(500).json({ error: 'Erro ao adicionar filme pendente' });
        });
    });

    app.delete('/api/movies/pendentes/:filmeId', (req, res) => {
      const filmeId = req.params.filmeId;
      Movie.findByIdAndDelete(filmeId)
        .then(() => {
          console.log('Filme excluído com sucesso');
          res.status(204).send();  // Retorna uma resposta sem conteúdo
        })
        .catch(error => {
          console.error('Erro ao excluir filme pendente:', error);
          res.status(500).json({ error: 'Erro ao excluir filme pendente' });
        });
    });

    app.use('/api/movies/pendentes', pendentesRouter);

    const autorizadosRouter = express.Router();

    autorizadosRouter.get('/', (req, res) => {
      AuthorizedMovie.find({ autorizado: true })
        .then(filmesAutorizados => {
          res.status(200).json(filmesAutorizados);
        })
        .catch(err => {
          console.error('Erro ao recuperar filmes autorizados do banco de dados:', err);
          res.status(500).json({ error: 'Erro ao recuperar filmes autorizados do banco de dados' });
        });
    });

    autorizadosRouter.post('/:id/autorizar', (req, res) => {
      const filmeId = req.params.id;
      console.log(`Rota de autorização chamada para o filme com ID: ${filmeId}`);
      Movie.findByIdAndDelete(filmeId)
        .then(filmePendente => {
          const authorizedMovie = new AuthorizedMovie({ ...filmePendente.toObject(), autorizado: true });
          return authorizedMovie.save();
        })
        .then(filmeAutorizado => {
          console.log('Filme autorizado com sucesso:', filmeAutorizado);
          res.status(200).json(filmeAutorizado);
        })
        .catch(error => {
          console.error('Erro ao autorizar filme pendente:', error);
          res.status(500).json({ error: 'Erro ao autorizar filme pendente' });
        });
    });

    autorizadosRouter.delete('/:id/excluir', (req, res) => {
      const filmeId = req.params.id;
      AuthorizedMovie.findByIdAndDelete(filmeId)
        .then(() => {
          console.log('Filme excluído com sucesso');
          res.status(204).send();
        })
        .catch(error => {
          console.error('Erro ao excluir filme autorizado:', error);
          res.status(500).json({ error: 'Erro ao excluir filme autorizado' });
        });
    });

    autorizadosRouter.post('/:id/avaliacao', async (req, res) => {
      try {
        const filmeId = req.params.id;
        const { avaliacao } = req.body;

        console.log(`Recebendo solicitação para salvar avaliação do filme ${filmeId} com nota ${avaliacao}`);

        const filmeAtualizado = await AuthorizedMovie.findByIdAndUpdate(
          filmeId,
          { avaliacao }, // Não é necessário $set se o campo tiver o mesmo nome
          { new: true }
        );

        console.log(`Avaliação do filme ${filmeId} salva com sucesso. Nova avaliação: ${filmeAtualizado.avaliacao}`);

        res.status(200).json({ avaliacao: filmeAtualizado.avaliacao });
      } catch (error) {
        console.error('Erro ao salvar avaliação do filme:', error);
        res.status(500).json({ error: 'Erro ao salvar avaliação do filme' });
      }
    });

    autorizadosRouter.get('/:id/avaliacao', async (req, res) => {
      try {
        const filmeId = req.params.id;

        const filme = await AuthorizedMovie.findById(filmeId);

        if (filme) {
          res.status(200).json({
            avaliacao: filme.avaliacao,
          });
        } else {
          res.status(404).json({ error: 'Filme não encontrado' });
        }
      } catch (error) {
        console.error('Erro ao recuperar avaliação do filme:', error);
        res.status(500).json({ error: 'Erro ao recuperar avaliação do filme' });
      }
    });

    autorizadosRouter.post('/:id/marcar-assistido', async (req, res) => {
      try {
        const filmeId = req.params.id;
        console.log(`Marcando como assistido o filme com ID: ${filmeId}`);

        // Atualize o filme como assistido no banco de dados (por exemplo, usando o model AuthorizedMovie)
        const filmeAtualizado = await AuthorizedMovie.findByIdAndUpdate(
          filmeId,
          { assistido: true },
          { new: true }
        );

        if (!filmeAtualizado) {
          return res.status(404).json({ error: 'Filme não encontrado' });
        }

        console.log('Filme marcado como assistido com sucesso');
        res.status(200).json(filmeAtualizado);
      } catch (error) {
        console.error('Erro ao marcar como assistido:', error);
        res.status(500).json({ error: 'Erro ao marcar como assistido' });
      }
    });

    autorizadosRouter.get('/:id/assistido', async (req, res) => {
      try {
        const filmeId = req.params.id;

        const filme = await AuthorizedMovie.findById(filmeId);

        if (filme) {
          res.status(200).json({
            assistido: filme.assistido,
          });
        } else {
          res.status(404).json({ error: 'Filme não encontrado' });
        }
      } catch (error) {
        console.error('Erro ao recuperar estado de assistido do filme:', error);
        res.status(500).json({ error: 'Erro ao recuperar estado de assistido do filme' });
      }
    });

    app.use('/api/movies/autorizados', autorizadosRouter);

    app.listen(port, () => {
      console.log(`Servidor rodando em http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB:', err);
  });
