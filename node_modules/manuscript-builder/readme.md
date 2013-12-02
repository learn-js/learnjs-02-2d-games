# manuscript builder
> create a one-file manuscript from a bunch of chapters.

I mostly use it for concatenating chapters of a book into a readme for the book's github repo.

It's designed to work with [leanpub](http://leanpub.com) books, but could work for other stuff as well.

## usage example:

```
var ReadmeBuilder = require('manuscript-builder');

var readme = new ReadmeBuilder({
  target: '/test-readme.md',
  exclude: ['huh.txt'],
  include: ['preface.md'],
  bookDir: '/test-manuscript/',
  tableOfContents: '/test-manuscript/Book.txt'
});

readme.build();
```
