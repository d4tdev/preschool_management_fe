import React from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const ExportToExcel = ({ apiData, fileName }) => {
    const fileType =
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToExcel = (apiData, fileName) => {
        try {
            // Kiểm tra dữ liệu đầu vào
            if (!apiData || !Array.isArray(apiData) || apiData.length === 0) {
                alert(
                    'Dữ liệu trống hoặc không hợp lệ! Vui lòng kiểm tra lại.'
                );
                return;
            }

            // Map dữ liệu để chỉ lấy các trường cần thiết
            const mappedData = apiData.map((attendance) => ({
                first_name: attendance.student_id?.first_name || 'N/A', // Tên học sinh
                last_name: attendance.student_id?.last_name || 'N/A', // Họ học sinh
                status: attendance?.status == 'arrived' ? 'Đã đến' : 'Đã về', // Trạng thái
                date: attendance?.date || 'N/A', // Ngày
                arrived_at: attendance?.arrived_at || 'N/A', // Thời gian đến
                left_at: attendance?.left_at || 'Chưa về', // Thời gian về
                created_by:
                    attendance?.created_by?.first_name +
                        ' ' +
                        attendance?.created_by?.last_name || 'N/A', // Người tạo
            }));

            // Chuyển dữ liệu đã map thành worksheet
            const ws = XLSX.utils.json_to_sheet(mappedData);
            const wb = { Sheets: { data: ws }, SheetNames: ['data'] };

            // Tạo buffer và Blob
            const excelBuffer = XLSX.write(wb, {
                bookType: 'xlsx',
                type: 'array',
            });
            const data = new Blob([excelBuffer], { type: fileType });

            // Lưu file
            FileSaver.saveAs(data, fileName + fileExtension);
        } catch (error) {
            console.error('Lỗi khi xuất file Excel:', error);
            alert(
                'Có lỗi xảy ra khi xuất file Excel. Vui lòng kiểm tra console để biết chi tiết.'
            );
        }
    };

    return (
        <button
            className='bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition flex items-center gap-2 w-full sm:w-auto justify-center'
            onClick={(e) => exportToExcel(apiData, fileName)}>
            <span className='fa fa-file-export'> </span>
            Xuất file Excel
        </button>
    );
};

export default ExportToExcel;
