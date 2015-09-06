/**
 *  Author: Suryakant
 */
/**
 * Ajax call for fetching local data stored in table.json
 */
// $.when($.ajax('table.json'))
//         .then(function (success) {
//           tableJSON = new table(success.tableData);
//         }, function (error) {
//           console.log(error);
//         });
var tableJSON;
function refreshData(){
    tableJSON = new table(JSON.parse(localStorage.getItem("users")));
}

if(!tableJSON){
  refreshData();
}


/**
 * table is constructor which describes the table data
 * and renders it to tbody.
 * @constructor
 */
function table(tableData) {
  if(!tableData){
    tableData = [];
  }

  this.tableData = tableData;
  this.displayedData = tableData;
  this.pageNumber=1;
  this.itemPerPage = Math.min(tableData.length,10);

  this.render = function(){
    $('tbody').empty();
    this.displayedData.forEach(function (row) {
      $('tbody')
      .append('<tr draggable="true"'+
        ' ondragstart="onDragStart(event)"'+
        ' ondragleave = "onDragLeave(event)"'+
        ' ondragover= "onDragOver(event)"'+
        ' ondragenter= "onDragEnter(event)"'+
        ' ondragend= "onDragEnd(event)"'+
        ' ondrop="onDropTarget(event)">');
      for (var key in row) {
        if (row.hasOwnProperty(key)) {
          $('tbody tr:last').append( '<td><div ondrop="onDropTarget(event)">' + row[key] + '</div></td>');
        }
      }
    });
  };
  this.render();
};

var reverse = false;
/**
 * @method Sort
 * @param {string} params
 * @returns {undefined} renders sorted data based on params
 */
table.prototype.sort = function(params){
  reverse =  !reverse;
  var comparator;
  console.log(this);
  this.tableData.sort(function(a,b){
    if(isNaN(a[params])){
      comparator = a[params].localeCompare(b[params]);
    } else {
      comparator = a[params]-b[params];
    }

    if(comparator > 0){
      if(reverse) return 1;
      if(!reverse) return -1;
    } else {
      if(!reverse) return 1;
      if(reverse) return -1;
    }
  });
  this.paginate();
};


/**
 *
 * @returns {undefined} filtered row based on content of search input box
 */
table.prototype.filter = function(){
  var status = document.getElementById("search").value;
  this.displayedData = this.tableData.map(function(row){
    for(var key in row){
      if(row[key].toUpperCase().indexOf(status.toUpperCase())>-1){
        return row;
      }
    }
    
  });
  this.render();
};

/**
 *
 * @method table for pagination based on input in items per page
 */
table.prototype.paginate = function(){
  var self = this;
  this.itemPerPage = document.getElementById("itemPerPage").value || self.tableData.length;


  //shows current page number
  this.totalNumberOfPages = (function(){
    return Math.ceil(self.tableData.length/self.itemPerPage);
  })();
  $('#pageNumber label').html('Page Number:- '+self.pageNumber+'/'+self.totalNumberOfPages);

  this.displayedData = this.tableData.slice( (self.pageNumber-1)*self.itemPerPage, self.pageNumber*self.itemPerPage);
  this.render();

  //disabling next button
  if(this.pageNumber === this.totalNumberOfPages){
    $("#nextPage").attr('disabled','disabled');
  } else {
    $("#nextPage").removeAttr('disabled');
  }
  //disabling previous button
  if(this.pageNumber === 1){
    $("#previousPage").attr('disabled','disabled');
  } else {
    $("#previousPage").removeAttr('disabled');
  }
};

/**
 *
 * @param {table} table
 * @returns {undefined} paginate table items
 */
function nextPage (table){
  table.pageNumber++;
  table.paginate();
};
function previousPage (table){
  table.pageNumber--;
  table.paginate();
};


function onDropTarget(e) {
  console.log(e);
  e.preventDefault();

  var text = e.dataTransfer.getData("text");
  e.target.innerHTML = text;
  e.dataTransfer.setData("Text/Plain",text);
  console.log(text);
}

function onDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault(); 
  }

  e.dataTransfer.dropEffect = 'copy'; 

  return false;
}

function onDragStart(e) {
  e.target.style.opacity = '0.4';
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  event.dataTransfer.setData("Text", e.target.textContent);
  console.log(event.dataTransfer.files);
  console.log(event.dataTransfer.types);
  console.log(event.dataTransfer.getData('Text'));
}

function onDragEnter(e) {
  e.target.parentElement.classList.add('over');
  var text = event.dataTransfer.getData('Text');
  console.log(text);
  e.target.innerHTML = event.dataTransfer.getData('Text');
}

function onDragLeave(e) {
  e.target.parentElement.classList.remove('over'); 
}

function onDragEnd(e) {
  console.log(e.dataTransfer.files);
  dragSrcEl = this.innerHTML;
  e.target.innerHTML = '<td>'+ event.dataTransfer.getData('text/html')+'</td>';
}