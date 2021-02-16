function makeFoldersArray() {
    return [
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
    ];
  }
  
  /*function makeMaliciousFolder() {
    const maliciousFolder = {
      id: 911,
      name: 'Naughty naughty very naughty <script>alert("xss");</script>',
    };
    const expectedFolder = {
      ...maliciousFolder,
      name:
      'Naughty naughty very naughty <script>alert("xss");</script>',
    };
    return {
      maliciousFolder,
      expectedFolder,
    };
  }*/
  
  module.exports = {
    makeFoldersArray,
    //makeMaliciousFolder,
  };
  