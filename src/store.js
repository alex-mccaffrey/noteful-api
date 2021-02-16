
const notes = [
  {
    id: 1,
    name: "Dogs",
    modified: "2018-08-15T17:00:00.000Z",
    folder_id: 1,
    content: "This is a test note. Note number one.",
  },
  {
    id: 2,
    name: "Cats",
    modified: "2018-08-15T17:00:00.000Z",
    folder_id: 2,
    content: "This is a test note. Note number two.",
  },
  {
    id: 3,
    name: "Pigs",
    modified: "2018-08-15T17:00:00.000Z",
    folder_id: 3,
    content: "This is a test note. Note number three.",
  },
];

const folders = [
    {
        id: 1,
        name: "Important"
      },
      {
        id: 2,
        name: "Super"
      },
      {
        id: 3,
        name: "ToDo",
      },
      {
        id: 4,
        name: "Work",
      },
]

module.exports = { notes, folders };
