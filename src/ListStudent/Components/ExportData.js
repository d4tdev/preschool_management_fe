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
            const mappedData = apiData.map((student) => ({
                first_name: student.first_name || 'N/A', // Tên học sinh
                last_name: student.last_name || 'N/A', // Họ học sinh
                gender: student.gender || 'N/A', // Giới tính
                birthday: student.birthday || 'N/A', // Ngày sinh
                class: student.class_id?.name || 'N/A', // Tên lớp học
                parent: student.parent_id?.name || 'N/A', // Tên phụ huynh
                created_at: student.created_at || 'N/A', // Ngày tạo
                updated_at: student.updated_at || 'N/A', // Ngày cập nhật
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
