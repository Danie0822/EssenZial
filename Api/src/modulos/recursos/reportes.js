const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generarReportePDF({ items, username, titulo, columnas, nombreArchivo }, res) {
    try {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        const margin = 50; // Márgenes de la página en puntos (1 punto = 1/72 pulgadas)
        const rowHeight = 30;
        const tableHeaderColor = rgb(0.25, 0.5, 0.75);
        const contentWidth = 612 - 2 * margin;
        const colWidths = columnas.map(() => contentWidth / columnas.length);

        const logoPath = path.resolve(__dirname, '../../../uploads/logo/logo.jpeg');
        let logoImage;
        try {
            const logoBytes = fs.readFileSync(logoPath);
            logoImage = await pdfDoc.embedJpg(logoBytes);
        } catch (error) {
            console.error('Error al cargar el logo:', error.message);
            return res.status(500).send('Error al cargar el logo.');
        }
        const logoDims = logoImage.scale(0.15);

        function addPage() {
            const page = pdfDoc.addPage([612, 792]); // Tamaño carta en puntos (1 punto = 1/72 pulgadas)
            const pageHeight = page.getHeight();

            // Encabezado
            const headerColor = rgb(0.15, 0.35, 0.55);
            page.drawRectangle({
                x: 0,
                y: pageHeight - margin - 100,
                width: page.getWidth(),
                height: 100,
                color: headerColor,
            });

            // Logo
            page.drawImage(logoImage, {
                x: margin,
                y: pageHeight - margin - 80,
                width: logoDims.width,
                height: logoDims.height,
            });

            // Título centrado
            page.drawText(titulo, {
                x: (page.getWidth() - font.widthOfTextAtSize(titulo, 30)) / 2,
                y: pageHeight - margin - 50,
                size: 30,
                font: font,
                color: rgb(1, 1, 1),
            });

            // Información adicional centrada
            const now = new Date();
            const formattedDate = now.toLocaleDateString();
            const formattedTime = now.toLocaleTimeString();

            const userInfoY = pageHeight - margin - 45 - 5 - 25;

            page.drawText(`Fecha: ${formattedDate} ${formattedTime}`, {
                x: (page.getWidth() - font.widthOfTextAtSize(`Fecha: ${formattedDate} ${formattedTime}`, 12)) / 2,
                y: userInfoY,
                size: 12,
                font: font,
                color: rgb(1, 1, 1),
            });

            page.drawText(`Usuario: ${username}`, {
                x: (page.getWidth() - font.widthOfTextAtSize(`Usuario: ${username}`, 12)) / 2,
                y: userInfoY - 15,
                size: 12,
                font: font,
                color: rgb(1, 1, 1),
            });

            // Espacio entre la información y la tabla
            const tableSpace = 20;

            // Tabla
            const tableTop = pageHeight - margin - 130 - tableSpace;
            let y = tableTop;

            // Encabezado de tabla
            page.drawRectangle({
                x: margin,
                y: y,
                width: contentWidth,
                height: rowHeight,
                color: tableHeaderColor,
            });

            columnas.forEach((header, i) => {
                page.drawText(header.label, {
                    x: margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
                    y: y + 7,
                    size: 12,
                    font: font,
                    color: rgb(1, 1, 1),
                    bold: true,
                });
            });

            y -= rowHeight;

            return { page, y, tableTop };
        }

        let { page, y, tableTop } = addPage();

        items.forEach((item, index) => {
            if (y < margin + 20) { // Check if there's enough space for another row
                ({ page, y, tableTop } = addPage());
            }

            const bgColor = index % 2 === 0 ? rgb(1, 1, 1) : rgb(0.95, 0.95, 0.95);
            page.drawRectangle({
                x: margin,
                y: y,
                width: contentWidth,
                height: rowHeight,
                color: bgColor,
                borderColor: rgb(0.8, 0.8, 0.8),
                borderWidth: 0.5,
            });

            columnas.forEach((col, i) => {
                const text = item[col.key].toString();
                page.drawText(text, {
                    x: margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
                    y: y + 7,
                    size: 11,
                    font: font,
                    color: rgb(0, 0, 0),
                });
            });

            y -= rowHeight;
        });

        // Pie de página moderno, alineado al fondo
        const numberOfPages = pdfDoc.getPageCount();
        for (let i = 0; i < numberOfPages; i++) {
            const currentPage = pdfDoc.getPage(i);
            const footerY = 20; // Altura del pie de página
            const footerColor = rgb(0.15, 0.35, 0.55);
            currentPage.drawRectangle({
                x: 0,
                y: footerY,
                width: currentPage.getWidth(),
                height: footerY,
                color: footerColor,
            });

            currentPage.drawText(`Página ${i + 1} de ${numberOfPages}`, {
                x: currentPage.getWidth() - margin - 100,
                y: footerY + 5,
                size: 12,
                font: font,
                color: rgb(1, 1, 1),
            });
        }

        const pdfBytes = await pdfDoc.save();
        res.setHeader('Content-disposition', `attachment; filename=${nombreArchivo}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(Buffer.from(pdfBytes));
    } catch (error) {
        console.error('Error generando el reporte PDF:', error);
        res.status(500).send('Error generando el reporte PDF.');
    }
}

module.exports = {
    generarReportePDF,
};
