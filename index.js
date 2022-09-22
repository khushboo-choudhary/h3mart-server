const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const hostname = 'localhost';
var fileupload = require('express-fileupload');
const port = 3000;
const productRouter = require('./Routes/productRouter');
const app = express();

// enable files upload
app.use(fileupload({createParentPath: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('uploads'));

// file uploaded

app.post('/upload',async (req,res)=>{
    try{
        if(!req.files){
            res.send({
                status : false,
                message : "No File Uploaded" 
            });
        }
    else{
        //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
    const file = req.files.product_list;
    //Use the mv() method to place the file in upload directory (i.e. "uploads")
    file.mv('./uploads' + file.name,(err)=>{
        if(err){
            throw err;
        }
        res.send({
            status : true,
            message : "File Uploaded"
        });
    })
}  
    }catch(err){
       res.status(500).send(err);
    }
});


app.use('/products',productRouter);
app.use((req,res)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is Express server</h1></body></html>');
});
const server = http.createServer(app);
server.listen(port,hostname,()=>{
    console.log(`Server is running at http://${hostname}:${port}/`);
});