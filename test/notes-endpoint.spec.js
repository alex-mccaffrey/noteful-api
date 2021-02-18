const knex = require("knex");
const { makeNotesArray, makeMaliciousNote } = require("./notes.fixtures");
const app = require("../src/app");
const store = require("../src/store");
const supertest = require("supertest");

describe("Notes Endpoints", () => {
  let notesCopy, db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => db("noteful_notes").truncate());

  afterEach("cleanup", () => db("noteful_notes").truncate());

  beforeEach("copy the notes", () => {
    notesCopy = store.notes.slice();
  });

  afterEach("restore the notes", () => {
    store.notes = notesCopy;
  });

  describe(`Unauthorized requests`, () => {
    it(`responds with 401 Unauthorized for GET /notes`, () => {
      return supertest(app)
        .get("/api/notes")
        .expect(401, { error: "Unauthorized request" });
    });

    it(`responds with 401 Unauthorized for POST /notes`, () => {
      return supertest(app)
        .post("/api/notes")
        .send({
          name: "test-note",
          modified: "2021-02-13 17:00:00",
          folder_id: 1,
          content: "this is a test note. lets see if this works",
        })
        .expect(401, { error: "Unauthorized request" });
    });

    it(`responds with 401 Unauthorized for GET /notes/:id`, () => {
      const secondNote = store.notes[1];
      return supertest(app)
        .get(`/api/notes/${secondNote.id}`)
        .expect(401, { error: "Unauthorized request" });
    });

    it(`responds with 401 Unauthorized for DELETE /notes/:id`, () => {
      const aNote = store.notes[1];
      return supertest(app)
        .delete(`/api/notes/${aNote.id}`)
        .expect(401, { error: "Unauthorized request" });
    });
  });

  describe("GET /api/notes", () => {
    context(`Given no notes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/notes")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200, []);
      });
    });

    context("Given there are notes in the database", () => {
      const testNotes = makeNotesArray();
      beforeEach("insert notes", () => {
        return db.into("noteful_notes").insert(testNotes)
      });

      it("gets the notes from the store", () => {
        return supertest(app)
          .get("/api/notes")
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200, testNotes);
      });
    });
  });

  describe("GET /api/notes/:id", () => {
    context(`Given no notes`, () => {
      it(`responds 404 when note doesn't exist`, () => {
        return supertest(app)
          .get(`/api/notes/123`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Note Not Found` },
          });
      });
    });

    context("Given there are notes in the database", () => {
      const testNotes = makeNotesArray();

      beforeEach("insert notes", () => {
        return db.into("noteful_notes").insert(testNotes);
      });

      it("responds with 200 and the specified note", () => {
        const noteId = 2;
        const expectedNote = testNotes[noteId - 1];
        return supertest(app)
          .get(`/api/notes/${noteId}`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200, expectedNote);
      });
    });
  });

  describe("DELETE /api/notes/:id", () => {
    context(`Given no notes`, () => {
      it(`responds 404 whe note doesn't exist`, () => {
        return supertest(app)
          .delete(`/api/notes/123`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(404, {
            error: { message: `Note Not Found` },
          });
      });
    });

    context("Given there are notes in the database", () => {
      const testNotes = makeNotesArray();

      beforeEach("insert notes", () => {
        return db.into("noteful_notes").insert(testNotes);
      });

      it("removes the note by ID from the store", () => {
        const idToRemove = 2;
        const expectedNotes = testNotes.filter((nt) => nt.id !== idToRemove);
        return supertest(app)
          .delete(`/api/notes/${idToRemove}`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then(() =>
            supertest(app)
              .get(`/api/notes`)
              .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedNotes)
          );
      });
    });
  });

  describe("POST /api/notes", () => {
    it(`responds with 400 missing 'name' if not supplied`, () => {
      const newNoteMissingName = {
        // name: 'test-name',
        modified: 2021 - 02 - 13,
        folder_id: 2,
        content: "this is some test content",
      };
      return supertest(app)
        .post(`/api/notes`)
        .send(newNoteMissingName)
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(400, {
          error: { message: `'name' is required` },
        });
    });

    it(`responds with 400 missing 'modified' if not supplied`, () => {
      const newNoteMissingFolder = {
        name: "test-name",
        //modified: 2021-02-13,
        folder_id: 2,
        content: "this is some test content",
      };
      return supertest(app)
        .post(`/api/notes`)
        .send(newNoteMissingFolder)
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(400, {
          error: { message: `'modified' is required` },
        });
    });

    it(`responds with 400 missing 'folder_id' if not supplied`, () => {
      const newNoteMissingFolder = {
        name: "test-name",
        modified: 2021 - 02 - 13,
        //folder_id: 2,
        content: "this is some test content",
      };
      return supertest(app)
        .post(`/api/notes`)
        .send(newNoteMissingFolder)
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(400, {
          error: { message: `'folder_id' is required` },
        });
    });

    it(`responds with 400 missing 'content' if not supplied`, () => {
      const newNoteMissingContent = {
        name: "test-name",
        modified: 2021 - 02 - 13,
        folder_id: 2,
        //content: "this is some test content",
      };
      return supertest(app)
        .post(`/api/notes`)
        .send(newNoteMissingContent)
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(400, {
          error: { message: `'content' is required` },
        });
    });

    it("creates a note, responding with 201 and the new note", () => {
      const newNote = {
        name: "test-name",
        modified: "2021-02-13T00:00:00.000Z",
        folder_id: 2,
        content: "this is some test content",
      };
      return supertest(app)
        .post(`/api/notes`)
        .send(newNote)
        .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
        .expect(201)
        .expect((res) => {
          expect(res.body.name).to.eql(newNote.name);
          expect(res.body.modified).to.eql(newNote.modified);
          expect(res.body.folder_id).to.eql(newNote.folder_id);
          expect(res.body.content).to.eql(newNote.content);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/notes/${res.body.id}`);
        })
        .then((res) =>
          supertest(app)
            .get(`/api/notes/${res.body.id}`)
            .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
            .expect(res.body)
        );
    });

    context(`Given an XSS attack note`, () => {
      const { maliciousNote, expectedNote } = makeMaliciousNote();

      beforeEach("insert malicious note", () => {
        return db.into("noteful_notes").insert([maliciousNote]);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/notes/${maliciousNote.id}`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.name).to.eql(expectedNote.name);
            expect(res.body.content).to.eql(expectedNote.content);
          });
      });
    });
  });

  describe(`PATCH /api/notes/:note_id`, () => {
    context(`Given no notes`, () => {
      it(`responds with 404`, () => {
        const noteId = 123456;
        return supertest(app)
          .patch(`/api/notes/${noteId}`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(404, { error: { message: `Note Not Found` } });
      });
    });
    context("Given there are notes in the database", () => {
      const testNotes = makeNotesArray();

      beforeEach("insert notes", () => {
        return db.into("noteful_notes").insert(testNotes);
      });

      it("responds with 204 and updates the note", () => {
        const idToUpdate = 2;
        const updateNote = {
          name: "updated note name",
          folder_id: 1,
          content: "updated note content",
        };
        const expectedNote = {
          ...testNotes[idToUpdate - 1],
          ...updateNote,
        };
        return supertest(app)
          .patch(`/api/notes/${idToUpdate}`)
          .send(updateNote)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/notes/${idToUpdate}`)
              .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedNote)
          );
      });
      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/notes/${idToUpdate}`)
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .send({ irrelevantField: "foo" })
          .expect(400, {
            error: {
              message: `Request body must contain either 'name', 'folder_id', 'content'`,
            },
          });
      });
      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateNote = {
          name: "updated note name",
        };
        const expectedNote = {
          ...testNotes[idToUpdate - 1],
          ...updateNote,
        };

        return supertest(app)
          .patch(`/api/notes/${idToUpdate}`)
          .send({
            ...updateNote,
            fieldToIgnore: "should not be in GET response",
          })
          .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/notes/${idToUpdate}`)
              .set("Authorization", `Bearer ${process.env.API_TOKEN}`)
              .expect(expectedNote)
          );
      });
    });
  });
});
