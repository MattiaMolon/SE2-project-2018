const table = 'Review';

// UTILITIES
function errore(res, errorType) {
    let message = {
        statusCode: undefined,
        description: undefined
    }
    
    if(errorType == 400) {
        message.statusCode = errorType;
        message.description = 'Ops! Something went wrong.';
    }
    if(errorType == 404) {
        message.statusCode = errorType;
        message.description = 'We are sorry! No class found.';
    }
    if(errorType == 409) {
        message.statusCode = errorType;
        message.description = 'Ops! There are some conflicts.';
    }

    res.status(errorType).json(message);
}

function isNum(num, res) {
    let corretto = true;

    if(isNaN(num) ) {
        //res.status(400).json(
        corretto = false; ////console.log(1); 
        //console.log('We are sorry, but the ID passed is not a number - bad request 400');
    }
    else if(num == null) {
        //res.status(400).json('We are sorry, but you did\'t pass any ID - bad request 400');
        corretto = false; ////console.log(2);
        //console.log('We are sorry, but you did\'t pass any ID - bad request 400');
    }
    else if(num <= 0  ) {
        //res.status(400).json('We are sorry, but the ID passed is lower than 0 - bad request 400');
        corretto = false; ////console.log(3);
        //console.log('We are sorry, but the ID passed is lower than 0 - bad request 400');
    }
    else if((num % 1) != 0) {
        //res.status(400).json('We are sorry, but the ID passed is not an integer - bad request 400');
        corretto = false; ////console.log(4);
        //console.log(text);
    }

    // console.log('------'+num+'--------'+corretto+'------');
    return corretto;
}

// METHODS IMPLEMENTATION
exports.registerReview = (app, db) =>{
    app.get('/reviews', (req, res) => {

        let reviewsList = db.getAll(table);

        if (reviewsList.length == 0) {
            errore(res, 404, 'We are sorry, user not found - error 404');
            //res.status(404);
            //console.log('Sorry, no review found - error 404');
        } else {
            res.status(200).json(reviewsList);
            //res.json(reviewsList);
            //console.log('Print of all the reviews successfully executed');
        }
    });

    app.get('/reviews/:reviewId', (req, res) => {
        if (isNum(+req.params.reviewId)) {
            let review = db.getById(table, +req.params.reviewId);

            if (review == null) {
                errore(res, 404, 'We are sorry, user not found - error 404');
                // res.status(404);
                //console.log('We are sorry, review not found - error 404');
            } else if (review.error) {
                errore(res, 400, 'We are sorry, there was a general error - bad request 400');
                // res.status(400);
                //console.log('We are sorry, there was a general error - bad request');
            } else {
                res.status(200).json(review);
                //console.log('Print of the review successfully executed');
            }
        } else {
            errore(res, 400, 'We are sorry, but it seems there are some problems with the ID you have requested - bad request 400');
        }
        

    });

    app.post('/reviews', (req, res) => {
        const newId = db.getNewId(table);

        let newSubmission = req.body.submission;
        let newUniNumber = req.body.uniNumber;
        let newFeedback = req.body.feedback;
        let newMark = req.body.mark;

        if (newSubmission == null || (isNaN(newSubmission)) || newSubmission <= 0 || (newSubmission % 1) != 0) {
            errore(res, 400, 'Ops, there was an error with the submission code. Please try again - bad request 400');
            // res.status(400);
            //console.log('Ops, there was an error with the submission. Please try again - bad request');
        } else if (newUniNumber == null || isNaN(newUniNumber) || newUniNumber <= 0 || (newUniNumber % 1) != 0) {
            errore(res, 400, 'Ops, there was an error with the uniNumber. Please try again - bad request 400');
            // res.status(400);
            //console.log('Ops, there was an error with the uniNumber. Please try again - bad request');
        } else if (newFeedback == null || !isNaN(newFeedback)) {
            errore(res, 400, 'Ops, there was an error with the feedback. Please try again - bad request 400');
            // res.status(400);
            //console.log('Ops, there was an error with the feedback. Please try again - bad request');
        } else if (isNaN(newMark) || newMark <= 0 || (newMark % 1) != 0) {
            errore(res, 400, 'Ops, there was an error with the feedback. Please try again - bad request 400');
        } else {
            let newReview = {
                id: newId,
                submission: newSubmission,
                uniNumber: newUniNumber,
                feedback: newFeedback,
                mark: newMark
            };

            db.addItem(table, newReview);

            res.status(201).json(newReview);
            //console.log('Review created successfully');
        }
    });

    app.put('/reviews/:reviewId', (req, res) => {
        // let reviewId = +req.params.reviewsId;

        if (isNum(+req.params.reviewId, res)) {

            let reviewCurrent = db.getById(table, +req.params.reviewId);

            if (reviewCurrent == null) {
                errore(res, 404, 'We are sorry, review not found - error 404');
                // res.status(404);
                //console.log('We are sorry, review not found - error 404');
            } else {
                let update = req.body;
    
                if (update.submission != null) {
                    reviewCurrent.submission = update.submission;
                }
                if (update.uniNumber != null) {
                    reviewCurrent.uniNumber = update.uniNumber;
                }
                if (update.feedback != null) {
                    reviewCurrent.feedback = update.feedback;
                }
                if (update.mark != null) {
                    reviewCurrent.mark = update.mark;
                }

                // controllo se i parametri passati sono validi

                if (isNaN(reviewCurrent.submission) || reviewCurrent.submission <= 0 || (reviewCurrent.submission % 1) != 0) {
                    errore(res, 400, 'We are sorry, you didn\'t enter a valid submission ID - bad request 400');
                } else if (isNaN(reviewCurrent.uniNumber) || reviewCurrent.uniNumber <= 0 || (reviewCurrent.uniNumber % 1) != 0) {
                    errore(res, 400, 'We are sorry, you didn\'t enter a valid uniNumber - bad request 400');
                    //console.log(text);
                } else if (typeof reviewCurrent.feedback !== 'string') {
                    errore(res, 400, 'We are sorry, you didn\'t enter a valid feedback - bad request 400');
                } else if (isNaN(reviewCurrent.mark) || reviewCurrent.mark <= 0 || (reviewCurrent.mark % 1) != 0) {
                    errore(res, 400, 'We are sorry, you didn\'t enter a valid mark - bad request 400');
                } else {
                    db.updateItem(table, reviewCurrent);

                    res.status(200).json(reviewCurrent);
                }
            }
        } else {
            errore(res, 400, 'We are sorry, but it seems there are some problems with the ID you have requested - bad request 400');
        }
        
    });

    app.delete('/reviews', (req, res) => {

        if (db.deleteAll(table)) {
            res.status(200).json('Deleted successful');
            //console.log('Ops, something went wrong - bad request 400');
        } else {
            errore(res, 400);
            //console.log('All the reviews have been deleted successfully');
        }
    });

    app.delete('/reviews/:reviewId', (req, res) => {
        let reviewId = +req.params.reviewId;

        if (isNum(reviewId, res)) {

            let reviewCurrent = db.getById(table, +req.params.reviewId);

            if (reviewCurrent == null) {
                errore(res, 404, 'We are sorry, user not found - error 404');
                // res.status(404);
                //console.log('We are sorry, user not found - error 404');
            } else {
                db.deleteById(table, reviewId);
                res.status(200).json(db.getAll(table));
            }
        } else {
            errore(res, 400, 'We are sorry, but it seems there are some problems with the ID you have requested - bad request 400');
        }
    });
};