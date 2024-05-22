import React from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const GenerateAndDownload = ({ groupedData, selectedGroups }) => {
  const generatePDF = async (title, questionContainers) => {
    const pdf = new jsPDF();
    let yOffset = 10;
    pdf.text(title, 10, yOffset);
    yOffset += 10;

    for (const container of questionContainers) {
      const questionTitle = container.querySelector('h4')?.textContent || '';
      if (questionTitle) {
        pdf.text(questionTitle, 10, yOffset);
        yOffset += 10;
      }

      const canvas = container.querySelector('canvas');
      if (canvas) {
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = pdf.internal.pageSize.getWidth();
        const imgWidth = pageWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (yOffset + imgHeight > pdf.internal.pageSize.getHeight()) {
          pdf.addPage();
          yOffset = 10;
        }

        pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);
        yOffset += imgHeight + 10;
      }
    }

    return pdf;
  };

  const downloadAllCharts = async () => {
    const zip = new JSZip();

    for (const groupKey of selectedGroups) {
      const groupFolder = zip.folder(groupKey);

      // Generate overall PDF for the grouping column
      const overallContainer = document.querySelector(`#group-${groupKey}-overall`);
      if (overallContainer) {
        const overallPdf = await generatePDF(`${groupKey} Overall Charts`, overallContainer.querySelectorAll('.chart-container'));
        groupFolder.file(`${groupKey}-overall.pdf`, overallPdf.output('blob'));
      }

      // Generate PDFs for each group
      if (groupedData[groupKey] && groupedData[groupKey].current && groupedData[groupKey].current.groups) {
        for (const groupName of Object.keys(groupedData[groupKey].current.groups)) {
          const groupContainer = document.querySelector(`#group-${groupKey}-${groupName}`);
          if (groupContainer) {
            const groupPdf = await generatePDF(`${groupKey} Charts for Group: ${groupName}`, groupContainer.querySelectorAll('.chart-container'));
            groupFolder.file(`${groupKey}-${groupName}.pdf`, groupPdf.output('blob'));
          }
        }
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
