const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");
const { readFileSync } = require("fs");
const cors = require("cors");
const { notes, authors } = require('./utils/api');

const schemaString = readFileSync('./schema.graphql', { encoding: 'utf-8'});
const schema = buildSchema(schemaString);


const root = {
    getAllNotesByAuthor: (params) => {
        return notes.filter(({ authorId }) => params.id === authorId);
    },
    getAllNotes: () => {
        return notes;
    },
    getNotesAmount: () => {
        return notes.length;
    },
    getNote: (params) => {
        return notes.find(({ id }) => params.id === id);
    },
    addNote: (params) => {
        notes.push({
            ...params.note,
            authorId: params.authorId,
        });
        return true;
    },
    editNote: (params) => {
        notes.forEach(
            (item, id, array) => {
                if (item.id === params.note.id)
                    array[id] = { ...item, title: params.note.title, text: params.note.text }
            }
        )
        return true;
    },
    getAuthor: (params) => {
        return authors.find(({ id }) => params.id === id);
    },
}

const PORT = 6006 || process.env.PORT;
const app = express();
app.use(cors());
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