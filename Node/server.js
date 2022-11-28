const express = require("express");
const fs = require('fs');
const multer = require("multer");
const app = express();
const mysql = require('mysql2');
const pool = mysql.createPool({
  connectionLimit: 5,
  host: "localhost",
  user: "root",
  database: "see-the-city",
  password: "anton"
});



const storage = multer.diskStorage({
  destination: 'img/gallery',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({
  storage: storage
}).single('imgUrl');
app.use(express.static(__dirname));


app.post("/upload", function (req, res) {
  let newPic;
  upload(req, res, err => {
    if (err) {
      console.log(err);
    } else {
      newPic = {
        url: req.file.originalname,
        address: req.body.address,
        author: req.body.author,
      }
      console.log(newPic);
      res.send(newPic);
      pool.query(`INSERT INTO pictures VALUES ('${newPic.url}','${newPic.address}','${newPic.author}')`)
    }
  })
  
});

app.get('/getgallery', function (req, res) {
  let pictures = [];
  pool.query('SELECT * FROM pictures', function(err, data) {
    if (err) {
      console.log(err);
    }
    else {
      data.forEach(picture => {
        let tempObj = {
          url: picture.filename,
          address: picture.address,
          author: picture.author
        }
        pictures.push(tempObj);
      });
      res.send(pictures);
    }
  });
});
app.listen(5500);