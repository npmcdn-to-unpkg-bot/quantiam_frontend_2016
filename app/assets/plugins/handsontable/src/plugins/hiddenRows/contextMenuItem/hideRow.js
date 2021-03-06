import {rangeEach} from 'handsontable/helpers/number';

export function hideRowItem(hiddenRowsPlugin) {
  return {
    key: 'hidden_rows_hide',
    name: 'Hide row',
    callback: function() {
      let {from, to} = this.getSelectedRange();
      let start = Math.min(from.row, to.row);
      let end = Math.max(from.row, to.row);

      rangeEach(start, end, (i) => hiddenRowsPlugin.hideRow(i));

      this.render();
      this.view.wt.wtOverlays.adjustElementsSize(true);

    },
    disabled: false,
    hidden: function() {
      return !this.selection.selectedHeader.rows;
    }
  };
}
