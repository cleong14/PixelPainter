// jQuery Notes

// $(run);

// function run () {
//   init();
//   createSidebar();
//   createGrid();
// }

// $(createSidebar);
// $(createGrid);

// function createSidebar () {
//   console.log('create sidebar');
// }

// function createGrid () {
//   console.log('create grid');
// }

// ========================================================
$(function () {
  $(init);

  var pixelPainterContainer;
  var cellElement;
  var currentColor;
  var currentCell;
  var targetCell;
  var targetColor;
  var painter;
  // basic color array
  var basicColors = ['red', 'yellow', 'blue', 'green', 'orange', 'purple', 'black', 'gray', 'magenta'];

  function init () {
    pixelPainterContainer = $('#pixelPainter');
    var swatches = ['cornflowerblue'];
    // drawSwatches(swatches);
    // creates color selector grid
    // drawGrid(3, 3, 'colorGrid', 1, 'colorCell');

    // creates grid to 'paint'
    // drawGrid(5, 5, 'paintGrid', 1, 'paintCell');

    // creates 'erase' button
    // drawButton('eraseButton', 'Erase');

    // creates clear button
    // drawButton('clearButton', 'Clear');

    // creates save button
    // drawButton('saveButton', 'Save');

    // fill selector grid with colors
    baseColors(1);

    addColor();

    erase();

    clear();

    save();
  }

  // accept an array of colors to generate our swatches
  function drawSwatches (swatches) {
    // get my swatch color
    var swatch = swatches[0];

    // create div for my swatch
    var swatchElement = $('<div class ="swatch"></div>');

    // set my swatch's background color
    swatchElement.css('background-color', swatch);

    // create click handler for this swatch
    swatchElement.on('click', function (event) {
      var targetColor = swatchElement.css('background-color');
      $('.cell').css('background-color', targetColor);
    });

    // append swatch to the pixel painter container
    pixelPainterContainer.append(swatchElement);
  }

  // accept an array of colors to generate our grid
  function drawGrid (x, y, gridId, cellId, idText) {
    // create grid and grid containter
    var grid = [];
    var gridContainer = $('<div />');

    gridContainer.attr('id', gridId);
    gridContainer.addClass('container');

    for (var column = 0; column < y; column++) {
      var rowArray = [];
      var rowContainer = $('<div />');
      for (var row = 0; row < x; row++) {

        // create cell and cell container
        cellElement = $('<div />');

        if (cellId) {
          cellElement.attr('id', idText + cellId++);
        }

        cellElement.addClass('cell');
        rowArray.push(null);
        rowContainer.append(cellElement);
      }
      grid.push(rowArray);
      gridContainer.append(rowContainer);
    }
    pixelPainterContainer.append(gridContainer);
  }

  // create buttons
  function drawButton (id, text) {
    // create div for my button
    var buttonElement = $('<br>' + '<button name"button" id=' + id + ' class ="button"></button>');

    // button text
    $(buttonElement).text(text);

    // append button to the pixel painter container
    pixelPainterContainer.append(buttonElement);
  }

  // fill colors of color grid
  function baseColors (cellId) {
    // loop over cells and add color to each cell
    for (var color = 0; color < basicColors.length; color++) {
      currentColor = basicColors[color];
      currentCell = $('#colorCell' + cellId++);

      currentCell.css('background-color', currentColor);

      currentCell.on('click', function (event) {
        targetColor = $(this).css('background-color');
        $(this).css('background-color', targetColor);
        console.log(this);
      });
    }
  }

  // add click to select color and paint color in paintGrid
  function addColor () {
    painter = $('#paintGrid');

    painter.click(function (event) {
      var target = $(event.target);
      if (target.hasClass('cell')) {
        target.css('background-color', targetColor);
      }
    });
  }

  // function to erase color
  function erase () {
    var eraserButton = $('#eraseButton');

    eraserButton.click(function (event) {
      targetColor = '';
    });
  }

  function clear () {
    var clearButton = $('#clearButton');

    clearButton.click(function (event) {
      $('#paintGrid .cell').css('background-color', '');
    });
  }

  // var paintInfo = $("form :input");

  function save () {
    var saveButton = $('#saveButton');

    saveButton.click(function (event) {
      var paintCell = $('#paintGrid .cell');
      var saveInfo = paintCell.map(function (index, cell) {

        var paintCell = {};
        // giving paintCell obj key of cell.id with prop cell background-color
        paintCell[cell.id] = cell.style['background-color'];
        return paintCell;
      });

      var paintInfo = $("form :input");

      $.ajax({
        type: 'POST',
        url: '/save',
        data: JSON.stringify({ "painting": saveInfo, "author": paintInfo[0].value, "description": paintInfo[1].value}),
        dataType: 'json',
        contentType: 'application/json',
        success: function (data) {
          console.log(data);
        }
      });
      console.log('saving...');
    });
  }
});