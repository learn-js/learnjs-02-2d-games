var ReadmeBuilder = require('./index');

var readme = new ReadmeBuilder({
  target: '/test-readme.md',
  //exclude: ['huh.txt'],
  include: ['preface.md'],
  bookDir: '/test-manuscript/',
  tableOfContents: '/test-manuscript/Book.txt'
});

readme.build();