describe('HiddenColumns', function() {
  var id = 'testContainer';

  function getMultilineData(rows, cols) {
    var data = Handsontable.helper.createSpreadsheetData(rows, cols);

    // Column C
    data[0][2] += '\nline';
    data[1][2] += '\nline\nline';

    return data;
  }

  beforeEach(function() {
    this.$container = $('<div id="' + id + '"></div>').appendTo('body');
  });

  afterEach(function() {
    if (this.$container) {
      destroy();
      this.$container.remove();
    }
  });

  it('should hide columns if the "hiddenColumns" property is set', function() {
    var hot = handsontable({
      data: Handsontable.helper.createSpreadsheetData(5, 10),
      hiddenColumns: {
        columns: [2, 4]
      },
      cells: function(row, col) {
        var meta = {};

        if (col === 2) {
          meta.type = 'date';
        }

        return meta;
      },
      width: 500,
      height: 300
    });

    expect(hot.getColWidth(1)).toBeGreaterThan(0);
    expect(hot.getColWidth(2)).toEqual(0.1);
    expect(hot.getColWidth(4)).toEqual(0.1);
    expect(hot.getColWidth(5)).toBeGreaterThan(0);
  });

  it('should return to default state after calling the disablePlugin method', function() {
    var hot = handsontable({
      data: getMultilineData(5, 10),
      hiddenColumns: {
        columns: [2, 4]
      },
      cells: function(row, col) {
        var meta = {};

        if (col === 2) {
          meta.type = 'date';
        }

        return meta;
      },
      width: 500,
      height: 300
    });
    hot.getPlugin('hiddenColumns').disablePlugin();

    expect(hot.getColWidth(1)).toBe(50);
    expect(hot.getCell(0, 2).clientHeight).toBe(22);
    expect(hot.getColWidth(2)).toBe(50);
    expect(hot.getCell(0, 4).clientHeight).toBe(22);
    expect(hot.getColWidth(4)).toBe(50);
    expect(hot.getColWidth(5)).toBe(50);
  });

  it('should hide columns after calling the enablePlugin method', function() {
    var hot = handsontable({
      data: getMultilineData(5, 10),
      hiddenColumns: {
        columns: [2, 4]
      },
      cells: function(row, col) {
        var meta = {};

        if (col === 2) {
          meta.type = 'date';
        }

        return meta;
      },
      width: 500,
      height: 300
    });
    hot.getPlugin('hiddenColumns').disablePlugin();
    hot.getPlugin('hiddenColumns').enablePlugin();

    expect(hot.getColWidth(1)).toBe(50);
    expect(hot.getCell(0, 2).clientHeight).toBe(22);
    expect(hot.getColWidth(2)).toBe(0.1);
    expect(hot.getCell(0, 4).clientHeight).toBe(22);
    expect(hot.getColWidth(4)).toBe(0.1);
    expect(hot.getColWidth(5)).toBe(50);
  });

  it('should initialize the plugin after setting it up with the "updateSettings" method', function() {
    var hot = handsontable({
      data: getMultilineData(5, 10),
      colHeaders: true,
      width: 500,
      height: 300
    });

    expect(hot.getPlugin('hiddenColumns').enabled).toEqual(false);

    hot.updateSettings({
      hiddenColumns: {
        columns: [2, 4],
        indicators: true
      }
    });

    expect(hot.getPlugin('hiddenColumns').enabled).toEqual(true);
    expect($('.beforeHiddenColumn').size()).toBeGreaterThan(0);

  });

  it('should hide column after calling the hideColumn method', function() {
    var hot = handsontable({
      data: getMultilineData(5, 10),
      hiddenColumns: true,
      width: 500,
      height: 300
    });

    expect(hot.getCell(0, 2).clientHeight).toBe(42);
    expect(hot.getColWidth(2)).toBe(50);

    hot.getPlugin('hiddenColumns').hideColumn(2);
    hot.render();

    expect(hot.getCell(0, 2).clientHeight).toBe(22);
    expect(hot.getColWidth(2)).toBe(0.1);
  });

  it('should show column after calling the showColumn method', function() {
    var hot = handsontable({
      data: getMultilineData(5, 10),
      hiddenColumns: {
        columns: [2]
      },
      width: 500,
      height: 300
    });

    expect(hot.getCell(0, 2).clientHeight).toBe(22);
    expect(hot.getColWidth(2)).toBe(0.1);

    hot.getPlugin('hiddenColumns').showColumn(2);
    hot.render();

    expect(hot.getCell(0, 2).clientHeight).toBe(42);
    expect(hot.getColWidth(2)).toBe(50);
  });

  it('should show the hidden column indicators if the "indicators" property is set to true', function() {
    var hot = handsontable({
      data: Handsontable.helper.createSpreadsheetData(5, 10),
      hiddenColumns: {
        columns: [2, 4],
        indicators: true
      },
      colHeaders: true,
      width: 500,
      height: 300
    });

    var tHeadTRs = hot.view.wt.wtTable.THEAD.childNodes[0].childNodes;

    expect(Handsontable.Dom.hasClass(tHeadTRs[3], 'afterHiddenColumn')).toBe(true);
    expect(Handsontable.Dom.hasClass(tHeadTRs[5], 'afterHiddenColumn')).toBe(true);

    expect(Handsontable.Dom.hasClass(tHeadTRs[1], 'beforeHiddenColumn')).toBe(true);
    expect(Handsontable.Dom.hasClass(tHeadTRs[3], 'beforeHiddenColumn')).toBe(true);
  });

  describe('copy-paste functionality', function() {

    it('should allow to copy hidden columns, when "copyPasteEnabled" property is not set', function() {
      var hot = handsontable({
        data: getMultilineData(5, 10),
        hiddenColumns: {
          columns: [
            2,
            4
          ]
        },
        width: 500,
        height: 300
      });

      selectCell(0, 0, 4, 9);
      keyDownUp(Handsontable.helper.KEY_CODES.COMMAND_LEFT);

      var copyPasteTextarea = $('textarea.copyPaste');

      expect(copyPasteTextarea.val()).toEqual(
          'A1	B1	"C1' + '\n' +
          'line"	D1	E1	F1	G1	H1	I1	J1' + '\n' +
          'A2	B2	"C2' + '\n' +
          'line' + '\n' +
          'line"	D2	E2	F2	G2	H2	I2	J2' + '\n' +
          'A3	B3	C3	D3	E3	F3	G3	H3	I3	J3' + '\n' +
          'A4	B4	C4	D4	E4	F4	G4	H4	I4	J4' + '\n' +
          'A5	B5	C5	D5	E5	F5	G5	H5	I5	J5' + '\n'
      );
    });

    it('should allow to copy hidden columns, when "copyPasteEnabled" property is set to true', function() {
      var hot = handsontable({
        data: getMultilineData(5, 10),
        hiddenColumns: {
          columns: [2, 4],
          copyPasteEnabled: true
        },
        width: 500,
        height: 300
      });

      selectCell(0, 0, 4, 9);
      keyDownUp(Handsontable.helper.KEY_CODES.COMMAND_LEFT);

      var copyPasteTextarea = $('textarea.copyPaste');

      expect(copyPasteTextarea.val()).toEqual(
          'A1	B1	"C1' + '\n' +
          'line"	D1	E1	F1	G1	H1	I1	J1' + '\n' +
          'A2	B2	"C2' + '\n' +
          'line' + '\n' +
          'line"	D2	E2	F2	G2	H2	I2	J2' + '\n' +
          'A3	B3	C3	D3	E3	F3	G3	H3	I3	J3' + '\n' +
          'A4	B4	C4	D4	E4	F4	G4	H4	I4	J4' + '\n' +
          'A5	B5	C5	D5	E5	F5	G5	H5	I5	J5' + '\n'
      );
    });

    it('should skip hidden columns, while copying data, when "copyPasteEnabled" property is set to false', function() {
      var hot = handsontable({
        data: getMultilineData(5, 10),
        hiddenColumns: {
          columns: [2, 4],
          copyPasteEnabled: false
        },
        width: 500,
        height: 300
      });

      selectCell(0, 0, 4, 9);
      keyDownUp(Handsontable.helper.KEY_CODES.COMMAND_LEFT);

      var copyPasteTextarea = $('textarea.copyPaste');

      expect(copyPasteTextarea.val()).toEqual(
          'A1	B1	D1	F1	G1	H1	I1	J1' + '\n' +
          'A2	B2	D2	F2	G2	H2	I2	J2' + '\n' +
          'A3	B3	D3	F3	G3	H3	I3	J3' + '\n' +
          'A4	B4	D4	F4	G4	H4	I4	J4' + '\n' +
          'A5	B5	D5	F5	G5	H5	I5	J5' + '\n'
      );
    });

    it('should skip hidden columns, while pasting data, when "copyPasteEnabled" property is set to false', function() {
      var hot = handsontable({
        data: Handsontable.helper.createSpreadsheetData(5, 10),
        hiddenColumns: {
          columns: [2, 4],
          copyPasteEnabled: false
        },
        width: 500,
        height: 300
      });

      selectCell(0, 0);

      var copyPasteTextarea = $('textarea.copyPaste');
      copyPasteTextarea.val('a\tb\tc\td\te\nf\tg\th\ti\tj');

      hot.copyPaste.onPaste(copyPasteTextarea.val());

      expect(getDataAtRow(0)).toEqual(["a", "b", "C1", "c", "E1", "d", "e", "H1", "I1", "J1"]);
      expect(getDataAtRow(1)).toEqual(["f", "g", "C2", "h", "E2", "i", "j", "H2", "I2", "J2"]);
    });
  });

  describe('navigation', function() {
    it('should ignore hidden columns while navigating by arrow keys', function() {
      var hot = handsontable({
        data: getMultilineData(5, 10),
        hiddenColumns: {
          columns: [
            2,
            4
          ]
        },
        width: 500,
        height: 300
      });

      selectCell(0, 0, 0, 0);
      keyDownUp(Handsontable.helper.KEY_CODES.ARROW_RIGHT);

      expect(getSelected()).toEqual([0, 1, 0, 1]);

      keyDownUp(Handsontable.helper.KEY_CODES.ARROW_RIGHT);

      expect(getSelected()).toEqual([0, 3, 0, 3]);

      keyDownUp(Handsontable.helper.KEY_CODES.ARROW_RIGHT);

      expect(getSelected()).toEqual([0, 5, 0, 5]);
    });
  });
});
