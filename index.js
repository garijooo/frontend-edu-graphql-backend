const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { readFileSync } = require("fs");
const { notes, authors } = require('./utils/api');

const schemaString = readFileSync('./schema.graphql', { encoding: 'utf-8'});
const schema = buildSchema(schemaString);


const root = {
    getAllNotesByAuthor: (params) => {
        return notes.filter(({ authorId }) => params.id === authorId);
    },
    getNote: (params) => {
        return notes.find(({ id }) => params.id === id);
    },
    addNote: (params) => {
        notes.push({
            id: notes.length, 
            ...params.note,
            authorId: params.authorId,
        });
        return true;
    },
}

const PORT = 6006 || process.env.PORT;
const app = express();
app.use(
    '/graphql',
    graphqlHTTP({
        schema: schema,
        rootValue: root,
        graphiql: true,
    })
);
app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`)
});