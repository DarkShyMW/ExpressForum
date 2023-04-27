const express = require('express');
const mongodb = require('mongodb');

const app = express();
const MongoClient = mongodb.MongoClient;
const url = 'mongodb://localhost:27017/myforum';

MongoClient.connect(url, { useNewUrlParser: true }, function(err, client) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    console.log('Connected to MongoDB.');
    const db = client.db('myforum');

const admin = require('express-admin');

admin.setConfig({
  db: db,
  adminUser: {
    username: 'admin',
    password: 'password'
  },
  modules: {
    'topics': {
      display: ['title', 'created_at'],
      sort: ['-created_at']
    },
    'messages': {
      display: ['content', 'created_at'],
      sort: ['-created_at']
    }
  }
});

app.use('/admin', admin.router);
  }
});

// Создание новой темы
app.post('/topics', function(req, res) {
  const collection = db.collection('topics');
  const topic = { title: req.body.title, content: req.body.content };
  collection.insert(topic, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Error creating topic.');
    } else {
      res.send(result.ops[0]);
    }
  });
});

// Получение списка тем
app.get('/topics', function(req, res) {
  const collection = db.collection('topics');
  collection.find().toArray(function(err, topics) {
    if (err) {
      console.log(err);
      res.status(500).send('Error getting topics.');
    } else {
      res.send(topics);
    }
  });
});

// Получение темы по ID
app.get('/topics/:id', function(req, res) {
  const collection = db.collection('topics');
  collection.findOne({ _id: mongodb.ObjectId(req.params.id) }, function(err, topic) {
    if (err) {
      console.log(err);
      res.status(500).send('Error getting topic.');
    } else if (!topic) {
      res.status(404).send('Topic not found.');
    } else {
      res.send(topic);
    }
  });
});

// Обновление темы
app.put('/topics/:id', function(req, res) {
  const collection = db.collection('topics');
  collection.updateOne(
    { _id: mongodb.ObjectId(req.params.id) },
    { $set: { title: req.body.title, content: req.body.content } },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating topic.');
      } else {
        res.send(result.modifiedCount + ' topic(s) updated.');
      }
    }
  );
});

// Удаление темы
app.delete('/topics/:id', function(req, res) {
  const collection = db.collection('topics');
  collection.deleteOne({ _id: mongodb.ObjectId(req.params.id) }, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Error deleting topic.');
    } else {
      res.send(result.deletedCount + ' topic(s) deleted.');
    }
  });
});

// Создание нового сообщения
app.post('/topics/:id/messages', function(req, res) {
  const collection = db.collection('messages');
  const message = { topic_id: mongodb.ObjectId(req.params.id), content: req.body.content };
  collection.insert(message, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Error creating message.');
    } else {
      res.send(result.ops[0]);
    }
  });
});

// Получение списка сообщений по ID темы
app.get('/topics/:id/messages', function(req, res) {
  const collection = db.collection('messages');
  collection.find({ topic_id: mongodb.ObjectId(req.params.id) }).toArray(function(err, messages) {
    if (err) {
      console.log(err);
      res.status(500).send('Error getting messages.');
    } else {
      res.send(messages);
    }
  });
});

// Получение сообщения по ID
app.get('/messages/:id', function(req, res) {
  const collection = db.collection('messages');
  collection.findOne({ _id: mongodb.ObjectId(req.params.id) }, function(err, message) {
    if (err) {
      console.log(err);
      res.status(500).send('Error getting message.');
    } else if (!message) {
      res.status(404).send('Message not found.');
    } else {
      res.send(message);
    }
  });
});

// Обновление сообщения
app.put('/messages/:id', function(req, res) {
  const collection = db.collection('messages');
  collection.updateOne(
    { _id: mongodb.ObjectId(req.params.id) },
    { $set: { content: req.body.content } },
    function(err, result) {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating message.');
      } else {
        res.send(result.modifiedCount + ' message(s) updated.');
      }
    }
  );
});

// Удаление сообщения
app.delete('/messages/:id', function(req, res) {
  const collection = db.collection('messages');
  collection.deleteOne({ _id: mongodb.ObjectId(req.params.id) }, function(err, result) {
    if (err) {
      console.log(err);
      res.status(500).send('Error deleting message.');
    } else {
      res.send(result.deletedCount + ' message(s) deleted.');
    }
  });
});

