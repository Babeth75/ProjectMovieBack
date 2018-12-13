const connection = require("./Conf");

// Utilisation de la micro librairie Express
const express = require("express");
const app = express();
const port = 3003;

const bodyParser = require("body-parser");

// Permettre que le front et le back puisse communiquer
const cors = require("cors");

// Support JSON-encoded bodies
app.use(bodyParser.json());
// Support URL-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
// Débloque l'insertion
app.use(cors());

// Retourne les films et le genre avec une jointure sur la table
app.get("/api/moviesGenre/", (req, res) => {
  connection.query(
    "SELECT movie.id, name, poster, linkvideo, synopsis, movie.idgenre, namegenre, postergenre, descriptiongenre FROM movie, genre where genre.id = movie.idgenre",
    (err, results) => {
      if (err) {
        // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
        res.status(500).send(err);
      } else {
        // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
        res.json(results);
      }
    }
  );
});


// Retourne les films
app.get("/api/movies/", (req, res) => {
  // connection à la base de données
  if (req.query.genre !== undefined) {
    connection.query(
      "SELECT * from movie where genre = ?",
      req.query.genre,
      (err, results) => {
        if (err) {
          // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
          res.status(500).send(err);
        } else {
          // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
          res.json(results);
        }
      }
    );
  } else if (req.query.name !== undefined) {
    connection.query(
      "SELECT * from movie where name = ?",
      req.query.name,
      (err, results) => {
        if (err) {
          // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
          res.status(500).send(err);
        } else {
          // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
          res.json(results);
        }
      }
    );
  } else {
    //console.log("je rentree");
    connection.query("SELECT * from movie", (err, results) => {
      if (err) {
        // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
        res.status(500).send(err);
      } else {
        // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
        res.json(results);
      }
    });
  }
});


// app.get("/api/movies/genre/", (req, res) => {
//   connection.query("SELECT genre from movie GROUP BY genre", (err, results) => {
//     if (err) {
//       // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
//       res.status(500).send(err);
//     } else {
//       // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
//       res.json(results);
//     }
//   });
// });

app.get("/api/movies/genreAll", (req, res) => {
  connection.query("SELECT * from genre", (err, results) => {
    if (err) {
      // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
      res.status(500).send(err);
    } else {
      // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
      res.json(results);
    }
  });
});

// Requete pour modifier les films en base ok
app.get("/api/movies/:id", (req, res) => {
  const { id } = req.params;

  // connection à la base de données, et sélection des employés
  connection.query("SELECT * from movie WHERE id = ?", [id], (err, results) => {
    if (err) {
      // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur

      res.status(500).send(err);
    } else {
      // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
      res.json(results);
    }
  });
});

app.post("/api/movies/", (req, res) => {
  const { name, poster, linkvideo, synopsis, idgenre } = req.body;
  const formData = [name, poster, linkvideo, synopsis, idgenre];
  const sql =
    "INSERT INTO movie (name, poster, linkvideo, synopsis, idgenre) VALUES (?,?,?,?,?)";

  connection.query(sql, formData, (err, results) => {
    if (err) {
      // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
      // Si tout s'est bien passé, on envoie le résultat de la requête SQL en tant que JSON.
      //res.json(results);
    }
  });
});

// Si l'ID est passé en tant que paramètre
app.put("/api/movies/:id", (req, res) => {
  // récupération des données envoyées

  const { id } = req.params;
  const formData = req.body;

  const sql = "UPDATE movie SET ? WHERE id = ?";

  connection.query(sql, [formData, id], err => {
    if (err) {
      // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

// Suppression en back OK
app.delete("/api/movies/:id", (req, res) => {
  // récupération des données envoyées
  const idMovie = req.params.id;
  connection.query("DELETE FROM movie WHERE id = ?", [idMovie], err => {
    if (err) {
      // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
      res.status(500).send(err);
    } else {
      res.sendStatus(200);
    }
  });
});

/**
 * 
 */
app.get("/api/tutu", (req, res) => {
  // récupération des données envoyées
  connection.query(
    "SELECT * FROM movie WHERE idgenre = ?",
    req.query.idgenre,
    (err, results) => {
      if (err) {
        // Si une erreur est survenue, alors on informe l'utilisateur de l'erreur
        res.status(500).send(err);
      } else {
        res.json(results);
      }
    }
  );
});

app.listen(port, err => {
  if (err) {
    throw new Error("Something bad happened...");
  }
  console.log(`Server is listening on ${port}`);
});
