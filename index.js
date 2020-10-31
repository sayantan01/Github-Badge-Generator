const express=require('express')
const app=express()
const bodyParser=require('body-parser')
const fetch=require('node-fetch')
const fs=require('fs')
const pdfcrowd = require("pdfcrowd");
const client = new pdfcrowd.HtmlToPdfClient("coder", "486bc2e88a9a6b56eb3f090b6e15cfd5");

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:false}))
const filename=__dirname+"/Badge.pdf"

let name="",imgurl=""

app.get('/',(req,res)=>{
	res.render('index',{name,imgurl})
})

app.get('/badge',(req,res)=>{
	res.render('badge',{name,imgurl})
})

app.post('/avatar',async (req,res)=>{
	const username=req.body.username
	url=`https://api.github.com/users/${username}`
	try
	{
		const response = await fetch(url)
		if(response.ok)
		{
			const data=await response.json()
			name=data.name
			imgurl=data.avatar_url
			res.redirect('/')
		}
		else
		{
			res.sendStatus(404)
		}
		client.convertUrlToFile(
    	"https://github-badge-2020.herokuapp.com/badge",
    	filename,
    	function(err, fileName) {
        	if (err) return console.error("Pdfcrowd Error: " + err);
        	console.log("Success: the file was created " + fileName);
    	});
   	

	}
	catch(err)
	{
		res.status(500).json(err)
	}
})

app.post('/download',(req,res)=>{
	res.setHeader('Content-disposition', 'attachment; filename=' + filename);
	res.download(filename)
})


const port=process.env.PORT || 8000

app.listen(port,()=>console.log(`http://localhost:${port}`))