var fs = require('fs');

module.exports = ManuscriptBuilder;

function ManuscriptBuilder(options){
  var dir = process.cwd() || options.dir;
  this.target = dir + options.target || dir + '/readme.md';
  this.tableOfContents = dir + options.tableOfContents || dir + '/manuscript/Book.txt';
  this.bookDir = dir + options.bookDir || dir + '/manuscript/';
  this.include = options.include || [];
  this.exclude = options.exclude || [];
  this.exclude = this.exclude.concat(['frontmatter:', 'mainmatter:', 'backmatter:']);
  this.separator = options.separator || '\n\n\n';
}

ManuscriptBuilder.prototype.build = function(){
  this.readChapterList();
};

ManuscriptBuilder.prototype.readChapterList = function(){
  var self = this;

  var readList = fs.createReadStream(this.tableOfContents);

  readList.on('data', function(data){
    self.source = self.prepareSources(data, this.include);

    self.regenFile(this.source);
  });
};

ManuscriptBuilder.prototype.regenFile = function(arr){
  var self = this;
  var source = arr;

  fs.exists(this.target, function(exists){
    if (exists){
      fs.unlink(self.target, function(){
        self.compileChapters(self.source);
      });
    } else {
      self.compileChapters(self.source);
    }
  });
};

ManuscriptBuilder.prototype.prepareSources = function(main, include){
  var self = this;

  var main = main.toString()
    .split('\n')
    .filter(function(item){
      return isNot(self.exclude, item);
    })
    .map(function(item){
      return self.bookDir + item;
    }
  );

  return this.include.concat(main);
};

ManuscriptBuilder.prototype.compileChapters = function(arr){
  var self = this;

  arr.forEach(function(chapter){
    data = fs.readFileSync(chapter);
    data = data.toString().replace(/~~~~~~~~/gi, '```') + self.separator;
    fs.appendFileSync(self.target, data)
  });
};

function isNot(arr, data){
  var str = data.toString();
  if (str != 0 && arr.indexOf(str) === -1 && str != undefined){
    return data;
  }
}