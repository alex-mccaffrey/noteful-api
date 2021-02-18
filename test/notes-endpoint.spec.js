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
    
  });
});
