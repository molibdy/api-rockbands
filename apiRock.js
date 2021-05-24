let port= process.env.PORT || 300;
let express=require ('express');
let app= new express()
app.use(express.urlencoded({extended:false,limit: '50mb'}));
app.use(express.json({limit: '50mb'}))
let mysql=require ('mysql');
let cors=require('cors');
app.use(cors())
app.listen(port)
let connection=mysql.createConnection({
    host: "rockbands.cucf8ryngvlg.us-east-2.rds.amazonaws.com",
    database: "rockbands",
    user: "admin",
    password: 'Molibden0'
})


app.get('/bands',(request, response)=>{
    let respuesta;
    let sql;
    let params;
    if(request.query.id){
        params=[request.query.id]
        sql='SELECT * FROM Bands WHERE id=?'
    }else{
        sql='SELECT * FROM Bands'
    }
    connection.query(sql,params,(err, res)=>{
        if(err){
            console.log(err)
            respuesta={type:0, result:err}
        }else{
            respuesta={type:1, result:res}
        }
        response.send(respuesta)
    })
})

app.post('/bands',(request, response)=>{
    let respuesta;
    if(request.body.bestHitUrl){
        bestHitUrl=request.body.bestHitUrl.replace('watch?v=','embed/');
    }else{
        bestHitUrl=null;
    }
    let params=[request.body.name, request.body.yearCreated, request.body.bestHitName, bestHitUrl, request.body.picture]
    let sql='INSERT INTO Bands (name, yearCreated, bestHitName, bestHitUrl, picture) VALUES (?,?,?,?,?)'
    connection.query(sql,params,(err, res)=>{
        if(err){
            console.log(err)
            respuesta={type:0, result:err}
        }else{
            respuesta={type:1, result:res.insertId}
        }
        response.send(respuesta)
    })
})



app.put('/bands',(request, response)=>{
    let respuesta;
    let [name, yearCreated,bestHitName,bestHitUrl,picture]=[null,null,null,null,null];
    if(request.body.name.length>0){
        name=request.body.name
    }
    if(!isNaN(request.body.yearCreated)){
        yearCreated=request.body.yearCreated;
    }
    if(request.body.bestHitName.length>0){
        bestHitName=request.body.bestHitName;
    }
    if(request.body.bestHitUrl.length>0){
        bestHitUrl=request.body.bestHitUrl.replace('watch?v=','embed/');
    }
    if(request.body.picture.length>0){
        picture=request.body.picture;
    }
    let params=[name, yearCreated, bestHitName, bestHitUrl, picture, request.body.id]
    let sql='UPDATE Bands SET name=COALESCE(?,name), yearCreated=COALESCE(?,yearCreated), bestHitName=COALESCE(?,bestHitName), bestHitUrl=COALESCE(?,bestHitUrl), picture=COALESCE(?,picture) WHERE id=?'
    connection.query(sql,params,(err, res)=>{
        if(err){
            console.log(err)
            respuesta={type:0, result:err}
        }else{
            respuesta={type:1, result:res}
        }
        response.send(respuesta)
    })
})


app.delete('/bands',(request, response)=>{
    let respuesta;
    let params=[request.query.id]
    let sql='DELETE FROM Bands WHERE id=?'
    connection.query(sql,params,(err, res)=>{
        if(err){
            console.log(err)
            respuesta={type:0, result:err}
        }else{
            respuesta={type:1, result:res}
        }
        response.send(respuesta)
    })
})


//Llamadas sin ruta específica:
app.all('/',(request,response,next)=>{
    console.log('petición recibida desde inicio');
    let respuesta={error:true, code:200, message:'Punto de inicio'};
    response.send(respuesta);
    next();
})

app.use((request,response,next)=>{
    console.log('petición recibida');
    let respuesta={error:true, code:404, message:'URL no válida'};
    response.send(respuesta);
    next();
})