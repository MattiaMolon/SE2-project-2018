// Group: SiamoVeramenteEuforici
// Author: Tommaso

const express = require('express')
var bodyParser = require ('body-parser')
const app = express()

app.use( bodyParser.json() )
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000

var reviewsList = [
    {
        id: 0,
        submission: 1,
        uniNumber: 185431,
        feedback: 'Good exam',
        mark: 24
    },
    {
        id: 1,
        submission: 4,
        uniNumber: 123456,
        feedback: 'Bad exam',
        mark: 18
    },
    {
        id: 2,
        submission: 7,
        uniNumber: 987234,
        feedback: 'Quite perfect exam',
        mark: 28
    }
]

app.get('/', (req, res) => {
    res.send('Hello, I am Toby, your personal assistant. Welcome to the home page')
});

app.get('/reviews', (req, res) => {
    if (reviewsList.length == 0) {
        res.status(404);
        console.log('Sorry, no review found - error 404');
    } else {
        res.status(200);
        res.json(reviewsList);
        console.log('Print of all the reviews successfully executed');
    }
});

app.get('/reviews/:reviewId', (req, res) => {
    var review = reviewsList.find(tmp => tmp.id === parseInt(req.params.reviewId));

    if (review == null) {
        res.status(404);
        console.log('We are sorry, review not found - error 404');
    } else if (review.error) {
        res.status(400);
        console.log('We are sorry, there was a general error - bad request');
    } else {
        res.status(200);
        res.json(review);
        console.log('Print of the review successfully executed');
    }

});

app.post('/reviews', (req, res) => {
    const newId = reviewsList.length

    const newSubmission = req.body.submission;
    const newUniNumber = req.body.uniNumber;
    const newFeedback = req.body.feedback;
    const newMark = req.body.mark;

    if (newSubmission == null) {
        res.status(400);
        console.log('Ops, there was an error with the submission. Please try again - bad request');
    } else if (newUniNumber == null) {
        res.status(400);
        console.log('Ops, there was an error with the uniNumber. Please try again - bad request');
    } else if (newFeedback == null) {
        res.status(400);
        console.log('Ops, there was an error with the feedback. Please try again - bad request');
    } else {
        const newReview = {
            id: newId,
            submission: newSubmission,
            uniNumber: newUniNumber,
            feedback: newFeedback,
            mark: newMark
        };

        reviewsList.push(newReview);

        res.status(201);
        res.json(reviewsList);
        console.log('Review created successfully');
    }
});

app.put('/reviews/:reviewsId', (req, res) => {
    const reviewCurrent = reviewsList.find(tmp => tmp.id === parseInt(req.params.reviewId));

    if (reviewCurrent == null) {
        res.status(404);
        console.log('We are sorry, review not found - error 404');
    } else {
        const index = reviewsList.indexOf(reviewCurrent);

        const newSubmission = req.body.submission;
        const newUniNumber = req.body.uniNumber;
        const newFeedback = req.body.feedback;
        const newMark = req.body.mark;

        const updateReview = {
            id: reviewsList[index].id,
            submission: reviewsList[index].submission,
            uniNumber: reviewsList[index].uniNumber,
            feedback: reviewsList[index].feedback,
            mark: reviewsList[index].mark
        };

        if (newSubmission != null) {
            updateReview.submission = newSubmission;
        }
        if (newUniNumber != null) {
            updateReview.uniNumber = newUniNumber;
        }
        if (newFeedback != null) {
            updateReview.feedback = newFeedback;
        }
        if (newMark != null) {
            updateReview.mark = newMark;
        }

        res.status(200);
        // qui devo farmi ritornare solo l'oggeto modificato
        res.json(app.get(updateReview[index].id));
        console.log('Review updated successfully');
    }
});

app.delete('/reviews', (req, res) => {

    if (reviewsList.error) {
        res.status(400);
        console.log('Ops, something went wrong - bad request 400');
    } else {
        reviewsList = [];

        res.status(204);
        console.log('All the reviews have been deleted successfully');
    }
});

app.delete('/reviews/:reviewsId', (req, res) => {
    const review = reviewsList.find(tmp => tmp.id === parseInt(req.params.reviewId));

    if (review == null) {
        res.status(404);
        console.log('We are sorry, user not found - error 404');
    } else {
        const index = reviewsList.indexOf(review);
        console.log('Sto eliminando ', req.params.reviewId);
        reviewsList.splice(index, 1);
        console.log('Ora gli utente attuamenti registrati sono: ', reviewsList);
        res.status(204);
    }
});

module.exports = {app}

app.listen(PORT, () => console.log('sto ascoltando sulla porta '+ PORT))