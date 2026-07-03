import toast from 'react-hot-toast';

export const exportToCsv = (filename: string, data: any[]) => {
  if (data.length === 0) {
    toast.error('Không có dữ liệu để xuất.');
    return;
  }

  const header = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).map(value => {
    if (Array.isArray(value)) return `"${value.join('; ')}"`;
    if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
    return String(value);
  }).join(','));

  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đã xuất báo cáo thành công (CSV)!');
  } else {
    toast.error('Trình duyệt không hỗ trợ tải xuống tự động.');
  }
};

export const exportToJson = (filename: string, data: any[]) => {
  if (data.length === 0) {
    toast.error('Không có dữ liệu để xuất.');
    return;
  }

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Đã xuất báo cáo thành công (JSON)!');
  } else {
    toast.error('Trình duyệt không hỗ trợ tải xuống tự động.');
  }
};
