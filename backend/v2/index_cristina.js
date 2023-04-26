import Datastore from 'nedb';
var db = new Datastore();
const BASE_API_URL = "/api/v2";

//module.exports = (app) => {    
function loadBackend_cris_v2(app){
    var datos = [
        {
            "province": "Almería",
            "year": 2021,
            "traveler": 175430,
            "overnight_stay": 852651,
            "average_stay": 4.9
        },
        {
            "province": "Cádiz",
            "year": 2021,
            "traveler": 141934,
            "overnight_stay": 547194,
            "average_stay": 3.9
        },
        {
            "province": "Córdoba",
            "year": 2021,
            "traveler": 40273,
            "overnight_stay": 92011,
            "average_stay": 2.3
        },
        {
            "province": "Granada",
            "year": 2021,
            "traveler": 208463,
            "overnight_stay": 527799,
            "average_stay": 2.5
        },
        {
            "province": "Huelva",
            "year": 2021,
            "traveler": 70746,
            "overnight_stay": 324824,
            "average_stay": 4.6
        },
        {
            "province": "Jaén",
            "year": 2021,
            "traveler": 54969,
            "overnight_stay": 138818,
            "average_stay": 2.5
        },
        {
            "province": "Málaga",
            "year": 2021,
            "traveler": 722109,
            "overnight_stay": 3411916,
            "average_stay": 4.7
        },
        {
            "province": "Sevilla",
            "year": 2021,
            "traveler": 220579,
            "overnight_stay": 669075,
            "average_stay": 3
        },
        {
            "province": "Almería",
            "year": 2022,
            "traveler": 221240,
            "overnight_stay": 980040,
            "average_stay": 4.4
        },
        {
            "province": "Cádiz",
            "year": 2022,
            "traveler": 249383,
            "overnight_stay": 805508,
            "average_stay": 3.2
        },
        {
            "province": "Córdoba",
            "year": 2022,
            "traveler": 67647,
            "overnight_stay": 141530,
            "average_stay": 2.1
        },
        {
            "province": "Granada",
            "year": 2022,
            "traveler": 280920,
            "overnight_stay": 759208,
            "average_stay": 2.7
        },
        {
            "province": "Huelva",
            "year": 2022,
            "traveler": 86304,
            "overnight_stay": 332581,
            "average_stay": 3.9
        },
        {
            "province": "Jaén",
            "year": 2022,
            "traveler": 60408,
            "overnight_stay": 142543,
            "average_stay": 2.4
        },
        {
            "province": "Málaga",
            "year": 2022,
            "traveler": 1087377,
            "overnight_stay": 5479489,
            "average_stay": 5
        },
        {
            "province": "Sevilla",
            "year": 2022,
            "traveler": 420921,
            "overnight_stay": 1218569,
            "average_stay": 2.9
        }
    ];

    db.insert(datos);

    //Apartado docs
    app.get(BASE_API_URL+"/apartment-occupancy-surveys/docs", (request,response) => {
        response.redirect("https://documenter.getpostman.com/view/25998017/2s93XsX5xc");
    });

    

    app.get(BASE_API_URL+"/apartment-occupancy-surveys/loadInitialData", (request,response) => {
        console.log("New GET to /apartment-occupancy-surveys/loadInitialData");
        db.find({}, function(err,data){
            if(err){
                console.log(`Error geting /apartment-occupancy-surveys/loadInitialData: ${err}`);
                response.sendStatus(500);
            }
            else{
                if(data.length==0){
                    console.log(`data inserted: ${datos.length}`);  
                    db.remove({}, {multi:true}, function(err,numRemoved){
                        if(err){
                            console.log("Error deleting database: ", err);
                        }
                        else{
                            console.log("");
                        }
                    });
                    db.insert(datos);
                    response.json(datos.map((d)=>{
                        delete d._id;
                        return d;
                    }));    
                }
                else{
                     console.log(`Data is already inserted: ${data.length}`);
                     response.status(200).send("Data is already inserted");          
                }
            }
        });
    });

    app.get(BASE_API_URL+"/apartment-occupancy-surveys", (request,response) => {
        console.log("New GET to /apartment-occupancy-surveys");
        var province = request.query.province;
        var year = request.query.year;
        var traveler = request.query.traveler;
        var overnight_stay = request.query.overnight_stay;
        var average_stay = request.query.average_stay;
        var from = request.query.from;
        var to = request.query.to;


        // Comprobamos query

        for(var i = 0; i<Object.keys(request.query).length;i++){
            var element = Object.keys(request.query)[i];
            if(element != "province" && element != "year" && element != "traveler" && element != "overnight_stay" && element != "average_stay" && element != "from" && element != "to" && element != "limit" && element != "offset"){
                console.log(`Error request:`);
                response.status(400).send("Bad Request");
            }
        }
        
        if(from>to){
            console.log(`Error request from > to`);
            response.status(400).send("Bad Request");
        }
        else{
            db.find({},function(err, data){
            
                if(err){
                    console.log(`Error geting /apartment-occupancy-surveys: ${err}`);
                    response.sendStatus(500);
                }
                else{
                    if (province != null){
                        var data = data.filter((reg)=>{
                                return (reg.province == province);
                        });
            
                        if (data.length==0){
                            console.log(`Data not found /apartment-occupancy-surveys: ${province}`);
                            response.status(404).send("Data not found");
                        }
                    }
            
                    // Apartado para búsqueda por año
            
                    if (year != null){
                        var data = data.filter((reg)=>
                        {
                            return (reg.year == year);
                        });
            
                        if (data==0){
                            console.log(`Data not found /apartment-occupancy-surveys: ${year}`);
                            response.status(404).send("Data not found");
                        }
                    }
    
                    // Apartado para búsqueda por viajeros
            
                    if (traveler != null){
                        var data = data.filter((reg)=>
                        {
                             return (reg.traveler >= traveler);
                        });
            
                        if (data==0){
                            console.log(`Data not found /apartment-occupancy-surveys: ${traveler}`);
                            response.status(404).send("Data not found");
                        }
                    }
    
                    // Apartado para búsqueda por pernotacion
            
                    if (overnight_stay != null){
                        var data = data.filter((reg)=>
                        {
                            return (reg.overnight_stay >= overnight_stay);
                        });
            
                        if (data==0){
                            console.log(`Data not found /apartment-occupancy-surveys: ${overnight_stay}`);
                            response.status(404).send("Data not found");
                        }
                    }
    
                    // Apartado para búsqueda por estancia media
            
                    if (average_stay != null){
                        var data = data.filter((reg)=>{
                            return (reg.average_stay >= average_stay);
                        });
                
                        if (data==0){
                            console.log(`Data not found /apartment-occupancy-surveys: ${average_stay}`);
                            response.status(404).send("Data not found");
                        }
                    }
    
                         
            
                    // Apartado para from y to
                        
                    if(from != null && to != null){
                        data = data.filter((reg)=>{
                            return (reg.year >= from && reg.year <=to);
                        });
            
                        if (data==0){
                            console.log(`Data not found /apartment-occupancy-surveys: ${from} / ${to}`);
                            response.status(404).send("Data not found");
                        }    
                    }
            
                    // Resultado
            
                    if(request.query.limit != undefined || request.query.offset != undefined){
                        data = paginacion(request,data);
                    }
                        
                    data.forEach((element)=>{
                        delete element._id;
                    });
            
                    if(request.query.fields!=null){
                        //Comprobamos si los campos son correctos
                        var listaFields = request.query.fields.split(",");
                        for(var i = 0; i<listaFields.length;i++){
                            var element = listaFields[i];
                            if(element != "province" && element != "year" && element != "traveler" && element != "overnight_stay" && element != "average_stay"){
                                console.log(`Error in query fields`);
                                response.status(400).send("Bad Request");
                            }
                        }
                    }
                    
                    if(data.length!=0){
                        response.send(JSON.stringify(data,null,2));
                        console.log(`data returned: ${data.length}`); 
                    }
                      
                }
                           
            });
        }        
    });

    

    // GET /apartment-occupancy-surveys/:province

    app.get(BASE_API_URL+"/apartment-occupancy-surveys/:province",(request, response)=>{
        var ciudad =request.params.province;
        var from = request.query.from;
        var to = request.query.to;

        console.log(`New GET to /apartment-occupancy-surveys/${ciudad}`);

        //Comprobamos query

        for(var i = 0; i<Object.keys(request.query).length;i++){
            var element = Object.keys(request.query)[i];
            if(element != "year" && element != "traveler" && element != "overnight_stay" && element != "average_stay" && element != "from" && element != "to" && element != "limit" && element != "offset"){
                console.log(`Error request`);
                response.status(400).send("Bad Request");
            }
        }

        //Comprobamos si from es mas pequeño o igual a to

        if(from>to){
            console.log(`Error request from > to`);
            response.status(400).send("Bad Request");
        }
        else{
            db.find({province:ciudad}, function(err,data){
            
                if(err){
                    console.log(`Error geting /apartment-occupancy-surveys: ${err}`);
                    response.sendStatus(500);
                }
                else{
                    if(data==0){
                        console.log(`Data not found /apartment-occupancy-surveys/${ciudad}: ${err}`);
                        response.status(404).send("Data not found");
                    }
                    else{         
            
                        // Apartado para from y to
                        var from = request.query.from;
                        var to = request.query.to;

                        if(from != null && to != null && from<=to){
                            data = data.filter((reg)=>
                            {
                            return (reg.year >= from && reg.year <=to);
                            }); 
                            
                        }
                        //Comprobamos si existe 
    
                        if (data==0){
                            console.log(`Data not found /apartment-occupancy-surveys: ${from} \ ${to}`);
                                response.status(404).send("Data not found");
                        }
    
                        //Resultado
    
                        if(request.query.limit != undefined || request.query.offset != undefined){
                            data = paginacion(request,data);
                        }
                        data.forEach((element)=>{
                            delete element._id;
                        });
    
                        //Comprobamos fields
    
                        if(request.query.fields!=null){
    
                            //Comprobamos si los campos son correctos
    
                            var listaFields = request.query.fields.split(",");
                            for(var i = 0; i<listaFields.length;i++){
                                var element = listaFields[i];
                                if(element != "province" && element != "year" && element != "traveler" && element != "overnight_stay" && element != "average_stay"){
                                    console.log(`Error in query fields`);
                                    response.status(400).send("Bad Request");
                                }
                            }
                        }
    
                        if(data.length!=0){
                            response.send(JSON.stringify(data,null,2));
                            console.log(`data returned: ${data.length}`); 
                        }
                    }
                }
            });
        }
    });
    
    app.get(BASE_API_URL+"/apartment-occupancy-surveys/:province/:year", (request,response) => {
        var año = parseInt(request.params.year);
        var ciudad = request.params.province;

    
        console.log(`New GET to /apartment-occupancy-surveys/${ciudad}/${año}`);
        db.find({province : ciudad,year : año}, function(err, data){
            if(err){
                console.log(`Error geting /apartment-occupancy-surveys/${ciudad}/${año}: ${err}`);
                response.sendStatus(500);
            }else{
                if(data.length!=0){
                    console.log(`data returned ${data.length}`);
                    delete data[0]._id;
                    response.json(data[0]);
                }
                else{
                    console.log(`Data not found /apartment-occupancy-surveys/${ciudad}/${año}: ${err}`);
                    response.status(404).send("Data not found");
                }
            }
        });
    });

    app.post(BASE_API_URL+"/apartment-occupancy-surveys", (request,response) => {
        var newFile = request.body;

        if(!newFile.province || !newFile.year || !newFile.traveler || !newFile.overnight_stay || !newFile.average_stay){
            console.log(`Error fields`);
            response.status(400).send("Bad Request");
        }
        else{
            db.find({province: newFile.province, year:newFile.year}, function(err, data){
                if(err){
                    console.log(`Error posting /apartment-occupancy-surveys: ${err}`);
                    response.sendStatus(500);
                }
                else{
                    if(data.length!=0){
                        response.status(409).send("This resource already exists");
                    }
                    else{
                        db.insert(newFile, function(err, data){
                            if(err){
                                console.log(`Error posting /apartment-occupancy-surveys: ${err}`);
                                response.sendStatus(500);
                            }
                            else{
                                console.log(`newFile = ${JSON.stringify(newFile,null,2)}`);
                                console.log("New POST to /apartment-occupancy-surveys");
                                response.status(201).send("Created");
                            }
                        });
                    }
                }
            });
            
        }        
    });

    app.put(BASE_API_URL + "/apartment-occupancy-surveys",(request,response)=>{
        response.sendStatus(405, "Method not allowed");
    });

    app.put(BASE_API_URL + "/apartment-occupancy-surveys/:province",(request,response)=>{
        response.sendStatus(405, "Method not allowed");
    });

    app.post(BASE_API_URL+"/apartment-occupancy-surveys/:province/:year",(request,response)=>{
        response.sendStatus(405, "Method not allowed");
    });

    app.post(BASE_API_URL+"/apartment-occupancy-surveys/:province",(request,response)=>{
        response.sendStatus(405, "Method not allowed");
    });

    app.put(BASE_API_URL+"/apartment-occupancy-surveys/:province/:year", (request,response) => {
        var newFile = request.body;
        var ciudad = request.params.province;
        var año = parseInt(request.params.year);

        if(!newFile.province || !newFile.year || !newFile.traveler || !newFile.overnight_stay || !newFile.average_stay){
            console.log(`Error fields`);
            response.status(400).send("Bad Request");
        }else{
            db.update({$and: [{province:ciudad}, {year:año}]}, {$set: newFile},function(err, data){
                if(err){
                    console.log(`Error put /apartment-occupancy-surveys/${ciudad}/${año}: ${err}`);
                    response.sendStatus(500);
                }
                else{
                    if(data==0){
                        console.log(`Bad Request`);
                        response.sendStatus(400);  
                    }
                    else{
                        console.log(`Files updated: ${data}`);
                        response.sendStatus(200);  
                    }
                    }
            });
        }
    });

    app.delete(BASE_API_URL +"/apartment-occupancy-surveys",(request, response)=>{
        db.remove({}, {multi:true},function (err, dbRemoved){
            if(err){
                console.log(`Error deleting /apartment-occupancy-surveys: ${err}`);
                response.sendStatus(500);
            }else{
                if(dbRemoved==0){
                    response.status(404).send("Not Found");
                }
                else{
                    console.log(`Files removed ${dbRemoved}`);
                    response.sendStatus(200);
                }               
            }
        });
    });

    app.delete(BASE_API_URL +"/apartment-occupancy-surveys/:province/:year",(request, response)=>{
        var ciudad = request.params.province;
        var año = parseInt(request.params.year);

        console.log(`New DELETE to /apartment-occupancy-surveys/${ciudad}/${año}`);

        db.remove({province:ciudad, year:año},{multi:true},function (err, dbRemoved){
            if(err){
                console.log(`Error deleting /apartment-occupancy-surveys/${ciudad}/${año}: ${err}`);
                response.sendStatus(500);
            }else{
                if(dbRemoved!=0){
                    console.log(`Files removed ${dbRemoved}`);
                    response.sendStatus(200);
                }
                else{
                    response.status(404).send("Not Found");
                }               
            }
        });
    });

    app.delete(BASE_API_URL +"/apartment-occupancy-surveys/:province",(request, response)=>{
        var ciudad = request.params.province;

        console.log(`New DELETE to /apartment-occupancy-surveys/${ciudad}`);

        db.remove({province:ciudad},{multi:true},function (err, dbRemoved){
            if(err){
                console.log(`Error deleting /apartment-occupancy-surveys/${ciudad}: ${err}`);
                response.sendStatus(500);
            }else{
                if(dbRemoved==0){
                    response.status(404).send("Not Found");
                }
                else{
                    console.log(`Files removed ${dbRemoved}`);
                    response.sendStatus(200);
                }              
            }
        });
    });

    app.delete(BASE_API_URL +"/apartment-occupancy-surveys//:year",(request, response)=>{
        var año = parseInt(request.params.year);

        console.log(`New DELETE to /apartment-occupancy-surveys//${año}`);

        db.remove({year:año},{multi:true},function (err, dbRemoved){
            if(err){
                console.log(`Error deleting /apartment-occupancy-surveys//${año}: ${err}`);
                response.sendStatus(500);
            }else{
                if(dbRemoved==0){
                    response.status(404).send("Not Found");
                }
                else{
                    console.log(`Files removed ${dbRemoved}`);
                    response.sendStatus(200);
                }                               
            }
        });
    });
    
    app.get(BASE_API_URL+"/dataName", (request, response)=>{
        console.log(`New GET to /dataNames`);
        let array = new Array();
        db.find({}, function(err,data){
            if(err){
                console.log(`Error geting /dataNames: ${err}`);
                response.sendStatus(500);
            }
            else{
                for(let i=0; i<data.length; i++){
                    let dato = data[i]["province"]+", "+ data[i]["year"];
                    array.push(dato);
                }
                response.send(JSON.stringify(array,null,2));
            }
        })
    });

    app.get(BASE_API_URL+"/dataTravelers", (request, response)=>{
        console.log(`New GET to /dataTravelers`);
        let array = new Array();
        db.find({}, function(err,data){
            if(err){
                console.log(`Error geting /Travelers: ${err}`);
                response.sendStatus(500);
            }
            else{
                for(let i=0; i<data.length; i++){
                    let dato = data[i]["traveler"];
                    array.push(dato);
                }
                response.send(JSON.stringify(array,null,2));
            }
        })
    });

    app.get(BASE_API_URL+"/dataOvernightStay", (request, response)=>{
        console.log(`New GET to /dataOvernightStay`);
        let array = new Array();
        db.find({}, function(err,data){
            if(err){
                console.log(`Error geting /dataOvernightStay: ${err}`);
                response.sendStatus(500);
            }
            else{
                for(let i=0; i<data.length; i++){
                    let dato = data[i]["overnight_stay"];
                    array.push(dato);
                }
                response.send(JSON.stringify(array,null,2));
            }
        })
    });

    app.get(BASE_API_URL+"/dataAverageStay", (request, response)=>{
        console.log(`New GET to /dataAverageStay`);
        let array = new Array();
        db.find({}, function(err,data){
            if(err){
                console.log(`Error geting /dataAverageStay: ${err}`);
                response.sendStatus(500);
            }
            else{
                for(let i=0; i<data.length; i++){
                    let dato = data[i]["average_stay"];
                    array.push(dato);
                }
                response.send(JSON.stringify(array,null,2));
            }
        })
    });
};

function paginacion(req, lista){

    var res = [];
    const limit = req.query.limit;
    const offset = req.query.offset;
    
    if(limit < 1 || offset < 0 || offset > lista.length){
        res.push("ERROR IN PARAMETERS LIMIT / OFFSET");
        return res;
    }
    res = lista.slice(offset,parseInt(limit)+parseInt(offset));
    return res;

};

/*
     Slice: Devuelve una copia de una parte del array dentro
            de un nuevo array empezando por inicio hasta fin.
            El array original no se modificará.
*/



export {loadBackend_cris_v2};