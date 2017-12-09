var express = require("express")
//const bodyParser = require('body-parser')
var Sequelize = require('sequelize')
var nodeadmin = require("nodeadmin")

//conectare la baza de date
var sequelize = new Sequelize('FormulareInregistrare','root','',{
    dialect:'mysql',
    host:'localhost'
})

sequelize.authenticate().then(function(){
    console.log('Success')
})




const Locatii = sequelize.define('locatie',
{
    idLocatie:Sequelize.INTEGER,
    denumireLocatie:Sequelize.STRING,
   
})


const Servicii = sequelize.define('serviciu',
{
    idServiciu:Sequelize.INTEGER,
    denumire:Sequelize.STRING,
    idLocatie:Sequelize.INTEGER,
})


Servicii.hasMany(Locatii,{foreignKey:'cheie_serviciu'})

const Furnizori = sequelize.define('furnizor',
{
    idFurnizori:Sequelize.INTEGER,
    numeFurnizor:Sequelize.STRING,
    adresaFurnizor:Sequelize.STRING,
    idServiciu:Sequelize.INTEGER,
    
})

Furnizori.hasMany(Servicii,{foreignKey:'cheie_furnizor'})

//tabela in care vom salva datele introduse in formular
const Salvari = sequelize.define('salvare',
{
    
    idLocatie:Sequelize.INTEGER,
    idServiciu:Sequelize.INTEGER,
    idFurnizori:Sequelize.INTEGER,
    data:Sequelize.DATE,
    ora:Sequelize.INTEGER,
    
    
})
Salvari.hasMany(Salvari,{foreignKey:'cheie_furnizor'})
Salvari.hasMany(Salvari,{foreignKey:'cheie_locatie'})
Salvari.hasMany(Salvari,{foreignKey:'cheie_serviciu'})

//eu le ma cu var.. da 
var app= express()
//app.use(bodyParser.json());

app.use('/nodeadmin', nodeadmin(app))
app.use(express.static('public'))
app.use('/admin', express.static('admin'))

app.use(express.json());      
app.use(express.urlencoded());




//TABELA LOCATII 



//GET pentru CREATE
//creare tabela locatii
app.get('/creare', (req, res) => {
  sequelize.sync({force : true})
    .then(() => res.status(201).send('tabelele au fost create cu succes'))
    .catch(() => res.status(500).send('EROARE'))
})


//find
//afiseaza toate rezultatele din tabela locatii
app.get('/locatie', function(request, response) {
    Locatii.findAll().then(function(locatie){
        response.status(200).send(locatie)
    })
})

// selectam o locatie dupa id 
app.get('/locatie/:id', function(request, response) {
    Locatii.findOne({where: {id:request.params.id}}).then(function(locatie) {
        if(locatie) {
            response.status(200).send(locatie)
        } else {
            response.status(404).send()
        }
    })
})

//creare inregistrare noua in tabela Locatie
app.post('/locatie/new', function(req,res) 
{
  Locatii.create(req.body).then(function(locatie) {
     res.status(201).send(locatie)
  })
  .catch(() => res.status(500).send('error '))
})

 app.put('/locatie/:id', function(request, response){
     Locatii.findById(request.params.id).then(function(locatie){
         if(locatie){
             locatie.update(request.body).then(function(locatie){
                 response.status(201).send(locatie)
             }).catch(function(error){
                 response.status(200).send(error)
             })
         }else{
             response.status(404).send('Not found')
         }
     })
 })
 
 app.delete('/locatie/:id', (req,res)=>{
    Locatii.findById(req.params.id).then(function(locatie){
        if(locatie){
            return locatie.destroy()
        }
        else{
            res.status(404).send("Nu am gasit inregistare!")
        }
    }).then(()=>res.status(201).send('Destroyed')).catch(()=>res.status(500).send("Eroare tabela locatii"))
})

/*
app.get('/locatie', function(request, response){
    var locatie = [
        {
            idLocatie:1,
            denumireLocatie:"Bucuresti"
        },
        {
            idLocatie:2,
            denumireLocatie:"Brasov"
        },
        {
            idLocatie:3,
            denumireLocatie:"Iasi"
        },
        {
            idLocatie:4,
            denumireLocatie:"Cluj"
        }
        
        ]
        
      for(var i = 0 ; i < locatie.length ; i++){
      if (locatie[i].id ==  request.params.id)
      {
          // returnez locatie
          response.status(200).send(locatie[i])
          
      }
    }
    response.status(404).send()
})

*/

// TABELA SERVICII



//afisare rezultate din tabela servicii
app.get('/servicii', (req,res) =>{
    Servicii.findAll()
    .then((serviciu)=> res.status(200).json(serviciu))
    .catch(() => res.status(500).send('EROARE'))
})

app.get('/serviciu', function(request, response) {
    Servicii.findAll().then(
            function(founder) {
                response.status(200).send(founder)
            }
        )
})


// selectam un serviciu dupa id 
app.get('/serviciu/:id', function(request, response) {
    Servicii.findOne({where: {id:request.params.id}}).then(function(serviciu) {
        if(serviciu) {
            response.status(200).send(serviciu)
        } else {
            response.status(404).send()
        }
    })
})

//creare inregistare noua in tabela Servicii
app.post('/serviciu.new', function(req, res) {
    Servicii.create(req.body)
        .then(function(serviciu){
            res.status(201).send(serviciu)
        })
        .catch(() => res.status(500).send('error'))

})

 app.put('/serviciu/:id', function(request, response) {
    Servicii.findById(request.params.id).then(function(serviciu) {
        if(serviciu) {
            serviciu.update(request.body).then(function(serviciu){ // din body citesc continutul trimis de client
                response.status(201).send(serviciu)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/del/:id', (req,res)=>{
    Servicii.findById(req.params.id).then((serviciu)=>{
        if(serviciu){
            return serviciu.destroy()
        }
        else{
            res.status(404).send("Nu am gasit inregistare!")
        }
    }).then(()=>res.status(201).send('Destroyed')).catch(()=>res.status(500).send("Eroare tabela servicii"))
})

/*
app.get('/serviciu', function(request,response){
    var serviciu=[ //de unde e asta? eu n-am vz asa prin seminarii, ahaaa. nici nu am deschis semianrul ala.
        
        {
            idServiciu:1,
            denumire:"dentist"
        },
        {
            idServiciu:2,
            denumire:"coafor"
        },
        {
            idServiciu:3,
            denumire:"psiholog"
        },
        {
            idServiciu:4,
            denumire:"doctor"
        }
        
        ]
        
      for(var i = 0 ; i < serviciu.length ; i++){
      if (serviciu[i].id ==  request.params.id)
      {
          // returnez serviciu
          response.status(200).send(serviciu[i])
          
      }
    }
    response.status(404).send()
})

/*


// TABELA FURNIZORI 

//creare tabela furnizori
/*app.get('/creeareFurnizori', (req,res) =>{
    sequelize.sync({force: true})
    .then(() => res.status(201).send('tabela Furnizori a fost creata cu succes'))
    .catch(() => res.status(500).send('EROARE'))
})*/



//afisare rezultate tabela furnizori
app.get('/furnizor', function(request, response) {
    Furnizori.findAll().then(
            function(founder) {
                response.status(200).send(founder)
            }
        )
})


// selectam un furnizor dupa id 
app.get('/furnizor/:id', function(request, response) {
    Furnizori.findOne({where: {id:request.params.id}}).then(function(furnizor) {
        if(furnizor) {
            response.status(200).send(furnizor)
        } else {
            response.status(404).send()
        }
    })
})


//creare intregistare noua in tabela Furnizori
app.post('/furnizor.new', function(req, res) {
    Furnizori.create(req.body).then(function(furnizor) {
        res.status(201).send(furnizor)
    })
    .catch(() => res.status(500).send('error'))
})



app.put('/furnizor/:id', function(request, response) {
    Furnizori.findById(request.params.id).then(function(furnizor) {
        if(furnizor) {
            furnizor.update(request.body).then(function(furnizor){ // din body citesc continutul trimis de client
                response.status(201).send(furnizor)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/del/:id', (req,res)=>{
    Furnizori.findById(req.params.id).then((furnizor)=>{
        if(furnizor){
            return furnizor.destroy()
        }
        else{
            res.status(404).send("Nu am gasit inregistare!")
        }
    }).then(()=>res.status(201).send('Destroyed')).catch(()=>res.status(500).send("Eroare tabela furnizor"))
})

/*
app.get('/furnizor',function(request,response){
    
    var furnizor=[
        
        {
            idFurnizori:1,
            numeFurnizor:"Cabinetul DB",
            adresaFurnizor:"Str Bucura nr 2"
        },
        {
            idFurnizori:2,
            numeFurnizor:"Salonul BUL",
            adresaFurnizor:"Str Domenii nr 6"
        },
        {
            idFurnizori:3,
            numeFurnizor:"Cabinetul FULG",
            adresaFurnizor:"Str Amagirii nr 8"
        },
        {
            idFurnizori:5,
            numeFurnizor:"Salonul GGG",
            adresaFurnizor:"Str Bujorului nt 4"
        }
    
        ]
        
      for(var i = 0 ; i < furnizor.length ; i++){
      if (furnizor[i].id ==  request.params.id)
      {
          // returnez locatie
          response.status(200).send(furnizor[i])
          
      }
    }
    response.status(404).send()
    
})

*/


// TABELA SALVARI 


//afisare rezultate tabela salvare
app.get('salvare', (req,res)=>{
    Salvari.findAll()
    .then((salvare)=>res.status(200).json(salvare))
    .catch(() => res.status(500).send('EROARE'))
})

app.get('/salvare', function(request, response) {
    Salvari.findAll().then(
            function(founder) {
                response.status(200).send(founder)
            }
        )
})


// selectam o salvare  dupa id 
app.get('/salvare/:id', function(request, response) {
    Salvari.findOne({where: {id:request.params.id}}).then(function(salvari) {
        if(salvari) {
            response.status(200).send(salvari)
        } else {
            response.status(404).send()
        }
    })
})


//creare inregistrai in tabela Salvari
app.post('/salvare.new', function(req, res) {
    Salvari.create(req.body).then(function(salvare){
        res.status(201).send(salvare)
    })
     .catch(() => res.status(500).send('error'))
})


app.put('/salvari/:id', function(request, response) {
    Salvari.findById(request.params.id).then(function(salvari) {
        if(salvari) {
            salvari.update(request.body).then(function(salvari){ // din body citesc continutul trimis de client
                response.status(201).send(salvari)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})


app.delete('/del/:id', (req,res)=>{
    Salvari.findById(req.params.id).then((salvare)=>{
        if(salvare){
            return salvare.destroy()
        }
        else{
            res.status(404).send("Nu am gasit inregistare!")
        }
    }).then(()=>res.status(201).send('Destroyed')).catch(()=>res.status(500).send("Eroare tabela salvari"))
})

app.listen(8080)