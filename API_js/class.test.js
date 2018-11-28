require('supertest');

// v1/classes

/**
 * GET /classes
 */

// se l'array è vuoto, ritorno 404

// se l'array è popolato, ritornare il json /classes

test('test GET /classes', () => {
});

/**
 * POST /classes
 */

// se nel body della post non c'è class.name (required) ritornare errore 400

// se nel body della post non c'è class.participants (required) ritornare errore 400

// se il body è corretto, creare nuovo elemento e restituirlo

test('test POST /classes', () => {
});

/**
 * DELETE /classes
 */

// ritorno l'array vuoto

test('test DELETE /classes', () => {
});

// v1/classes/{classId}

/**
 * GET /classes/{classId}
 */

// se id non è un numero, ritornare 400

// se id è nullo, ritornare 400

// se id è minore di 0, ritornare 400

// se id non è intero, ritornare 400

// se l'id non corrisponde a nessun elemento nel DB, ritornare 404

// se l'id corrisponde a un elemento nel DB, ritornare 200 e restituire l'elemento

test('test GET /classes/{classId}', () => {
});

/**
 * PUT /classes/{classId}
 */

// se id non è un numero, ritornare 400

// se id è nullo, ritornare 400

// se id è minore di 0, ritornare 400

// se id non è intero, ritornare 400

// se l'id non corrisponde a nessun elemento nel DB, ritornare 404

// se class.name non è una stringa, ritornare 400

// se class.participants non è un array di utente, ritornare 400

// se l'id corrisponde a un elemento nel DB, e name è una stringa e/o participants è un array di utenti, ritornare 200 e restituire l'elemento modificato

test('test PUT /classes/{classId}', () => {
});

/**
 * DELETE /classes/{classId}
 */

// se id non è un numero, ritornare 400

// se id è nullo, ritornare 400

// se id è minore di 0, ritornare 400

// se id non è intero, ritornare 400

// se l'id non corrisponde a nessun elemento nel DB, ritornare 404

// se l'id corrisponde a un elemento nel DB, eliminarlo e ritornare 204

test('test DELETE /classes/{classId}', () => {
});