function makeNotesArray() {
  return [
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
}

function makeMaliciousNote() {
  const maliciousNote = {
    id: 911,
    id: 3,
    name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    modified: "2018-08-15 17:00:00",
    folder_id: "3",
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  };
  const expectedNote = {
    ...maliciousNote,
    name:
    'Naughty naughty very naughty <script>alert("xss");</script>',
    content: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
  };
  return {
    maliciousNote,
    expectedNote,
  };
}

module.exports = {
  makeNotesArray,
  makeMaliciousNote,
};
