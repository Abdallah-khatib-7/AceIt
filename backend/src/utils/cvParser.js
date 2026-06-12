const PDFParser = require('pdf2json');

const extractTextFromPdf = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const text = pdfData.Pages.map((page) =>
        page.Texts.map((t) => decodeURIComponent(t.R[0].T)).join(' ')
      ).join('\n');
      resolve(text);
    });

    pdfParser.on('pdfParser_dataError', (err) => {
      reject(err);
    });

    pdfParser.parseBuffer(buffer);
  });
};

module.exports = { extractTextFromPdf };