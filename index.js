require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const data = []
app.post('/api/shorturl', (req, res)=> {
  const url = req.body.url
  try {
    const urlObj = new URL(url)
    dns.lookup(urlObj.hostname,(err, address, family) => {
      if (err) {
        res.json({error:"Invalid url"});
      } else {
        data.push(url)
        res.json({
          original_url: url,
          short_url: data.length
        })
      }
    })
  } catch {
    res.json({
      error: "Invalid url"
    })
  }
})

app.get('/api/shorturl/:id', (req, res) => {
  const id = req.params.id
  if(id > data.length) {
    res.json({
      error: "Doesn't exist"
    })
  } else {
    res.redirect(data[id-1])
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
