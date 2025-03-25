import React from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const ExportToExcel = ({ apiData, fileName }) => {
    const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (apiData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(apiData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        console.log(data);
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    return (
        <button
            className='bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition flex items-center gap-2 w-full sm:w-auto justify-center'
            onClick={(e) => exportToCSV(apiData, fileName)}>
            <span className='fa fa-file-export'>&nbsp;</span>
            Xuất file Excel
        </button>
    );
};

export default ExportToExcel;
