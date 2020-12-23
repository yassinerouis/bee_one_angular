import { Injectable } from '@angular/core';

import jsPDF from 'jspdf'
import 'jspdf-autotable'
@Injectable({
  providedIn: 'root'
})

export class ExportService {
  constructor(){
  }
  setTable(table:any){
    this.table = table
  }
  table;
  exportPdf(columns,name) {
    console.log(this.table)
    const doc:any = new jsPDF()
    doc.autoTable({
        body:this.table,
        columns:columns,
    })
    doc.save(name)
  }
  printPdf(columns){
  var doc:any = new jsPDF();
  doc.autoTable({
  body:this.table,
  columns: columns
})
doc.autoPrint();
//This is a key for printing
doc.output('dataurlnewwindow');
  }
  exportExcel(name) {
    import("xlsx").then(xlsx => {
        const worksheet = xlsx.utils.json_to_sheet(this.table);
        const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, name);
    });
}
saveAsExcelFile(buffer: any, fileName: string): void {
  import("file-saver").then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
          type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  });
}
}
