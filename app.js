
const express = require("express");
const app= express();
//Express, is a back end web application framework for Node.js
const multer = require('multer');
// Multer is used to upload files in server
const fs= require("fs")
// fs: file system
const { TesseractWorker }= require('tesseract.js');
const res = require("express/lib/response");
// Load tessract ocr library
const worker= new TesseractWorker();

const storage= multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, "./uploads")
    },
    filename: (req,file,cb) => {
        cb(null, file.originalname);
    }
});

const upload= multer({storage: storage}).single('avatar');

app.set("view engine","ejs");

app.set('/', (req,res) => {
    res.render('index');
})
app.get('/', (req,res) => {
    res.render("index");
})

app.post('/upload', (req,res) => {
    upload(req,res,err =>{
        //console.log(req.file);
        fs.readFile(`./uploads/${req.file.originalname}`,(err,data) => {
            if(err) return console.log("This is your error", err)

            worker
                .recognize(data,"eng", { tessjs_create_pdf:"1"})
                .progress(progress =>{
                    console.log(process);
                })
                .then(result => {
                   res.send(result.text);
                   //res.redirect('/download')
                })
                .finally(() => worker.terminate());
        });
    });
});

app.get('/download', (req,res) => {
   const file= `${__dirname}/tesseract.js-ocr-result.pdf`
});

// Start Up server
const PORT= 5000
app.listen(PORT,() => console.log('Code running on port 5000'));

