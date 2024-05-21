import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const GenerateAndDownload = ({ groupedData, selectedGroups }) => {
  const generatePDF = async () => {
    const pdf = new jsPDF();
    const charts = document.querySelectorAll('.chart-container canvas');

    for (let i = 0; i < charts.length; i++) {
      const canvas = charts[i];
      const imgData = canvas.toDataURL('image/png');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (i > 0) {
        pdf.addPage();
      }
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    }

    return pdf;
  };

  const downloadAllCharts = async () => {
    const zip = new JSZip();

    // Generate overall.pdf
    const overallPdf = await generatePDF();
    zip.file('overall.pdf', overallPdf.output('blob'));

    // Generate group PDFs
    for (const groupKey of selectedGroups) {
      const groupFolder = zip.folder(groupKey);

      for (const groupName of Object.keys(groupedData.current.groups)) {
        const groupPdf = await generatePDF();
        groupFolder.file(`${groupName}.pdf`, groupPdf.output('blob'));
      }
    }

    zip.generateAsync({ type: 'blob' }).then(content => {
      saveAs(content, 'charts.zip');
    });
  };

  return (
    <div>
      <button onClick={downloadAllCharts}>Download Charts</button>
    </div>
  );
};

export default GenerateAndDownload;
