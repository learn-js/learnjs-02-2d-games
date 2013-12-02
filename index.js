var ReadmeBuilder = require('manuscript-builder');

var readme = new ReadmeBuilder({
  target: '/book.md',
  bookDir: '/book/',
  tableOfContents: '/book/Book.txt'
});

readme.build();