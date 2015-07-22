var express = require('express');


var routes = function(Book) {
    var bookRouter = express.Router();
//create a couple of routes
    bookRouter. route('/')
        //get route

        //POST cu care adaug informatii
        .post(function(req, res){
            var book = new Book(req.body); // de tipul Book aleia din bookModel->din mongoose

            //console.log(book);
            book.save();
            res.status(201).send(book);

        })
        .get(function(req, res){
            var query = {};
            if(req.query.genre)
            {
                query.genre = req.query.genre;
            }

            //send some data back
            Book.find(query, function (err, books) {
                if (err)
                    res.status(500).send(err);
                else
                    res.json(books);

            });

        });

    bookRouter.use('/:bookId', function(req, res, next){  //This is a middleware
        Book.findById(req.params.bookId, function(err, book){
            if(err)
                res.status(500).send(err);
            else if (book)  //daca cartea exista
            {
               req.book = book;//adaugam requestul la book
               next();
            }
            else{
                res.status(404).send('no book found');
            }

        });


    });
    bookRouter.route('/:bookId')

        //GET care imi aduce datele/iau informatii
        .get(function(req, res){
            //var query = {};
            //if(req.query.genre)
            //{
            //    query.genre = req.query.genre;
            //}
            //send some data back

            res.json(req.book); //daca nu gaseste cartea nu ajunge pana aici. Daca gaseste, da ca raspuns un json cu o carte care a fost ceruta

        })

        //PUT care imi face update sau imi inlocuieste doar la o parte din resursa
        .put(function(req, res){
                //Book.findById(req.params.bookId, function(err, book){ //nu mai am nevoie de astea
                //    if(err)
                //        res.status(500).send(err);
                //    else
                    req.book.title = req.body.title; //tot ce era in req.book a fost inlocuit cu ce era in req.body
                    req.book.author = req.body.author;
                    req.book.genre = req.body.genre;
                    req.book.read = req.body.read;
                    req.book.save(function(err){
                        if(err)
                            res.status(500).send(err);
                        else{
                            res.json(req.book);

                        }
                    });
                        res.json(req.book);

        })

        //PATCH ->care face update doar la o parte din resursa
        .patch(function(req, res){//vrem sa updatam req.book cu itemii din req.body care sunt acolo
              //if(req.body.title) //nu folosim asta because this would become very painful, ci vom folosi for in loop pt ca e mai avantajos
              //{
              //    req.book.title = req.body.title;
              //}
                if(req.body._id)//nu vrem sa updatam si id
                    delete req.body._id;
            //for every key in req.body = for in loop //e e chivalent cu if-urile alea, dar ar fi trebuit sa fac pt fiecare atribut
                for(var p in req.body)
                    {

                        req.book[p] = req.body[p];
                     }
               req.book.save(function(err){
                   if(err)
                     res.status(500).send(err);
                   else{
                       res.json(req.book);

                   }
               });

        })

        //DELETE -> care imi sterge
        .delete(function(req, res){
            req.book.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed'); //204 inseamna ca a fost sters
                }

            });

        });   //avem un .get si un .put pt ruta noastra, acum trebuie sa adaugam .patch

    return bookRouter;
}; //return value for this module

module.exports = routes;