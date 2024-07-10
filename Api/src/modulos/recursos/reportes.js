const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function generarReportePDF({ items, username, titulo, columnas, nombreArchivo }, res) {
    try {
        const pdfDoc = await PDFDocument.create();
        // Tamaño carta en puntos (8.5 x 11 pulgadas)
        const page = pdfDoc.addPage([612, 792]); 

        // Configuración de márgenes y dimensiones
        const margin = 42.5; // 1.5 cm ~ 42.5 puntos
        const contentWidth = page.getWidth() - 2 * margin;
        const contentHeight = page.getHeight() - 2 * margin;

        // Encabezado y Pie de página
        const headerHeight = 50;
        const footerHeight = 50;

        // Cargar logo de la empresa
        const logoPath = path.resolve(__dirname, '../../../uploads/logo/logo.jpeg'); // Ruta del logo
        let logoImage;
        try {
            const logoBytes = fs.readFileSync(logoPath);
            logoImage = await pdfDoc.embedJpg(logoBytes);
        } catch (error) {
            console.error('Error al cargar el logo:', error.message);
            return res.status(500).send('Error al cargar el logo.');
        }
        const logoDims = logoImage.scale(0.1);

        // Dibujar logo en la esquina superior derecha
        page.drawImage(logoImage, {
            x: page.getWidth() - margin - logoDims.width,
            y: page.getHeight() - margin - logoDims.height,
            width: logoDims.width,
            height: logoDims.height,
        });

        // Fecha y hora del sistema
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();

        // Dibujar encabezado
        page.drawText(`Fecha: ${formattedDate} ${formattedTime}`, {
            x: margin,
            y: page.getHeight() - margin - 20,
            size: 12,
        });

        page.drawText(`Usuario: ${username}`, {
            x: margin,
            y: page.getHeight() - margin - 40,
            size: 12,
        });

        // Cargar fuente antes de usarla
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Título centrado
        page.drawText(titulo, {
            x: (page.getWidth() - font.widthOfTextAtSize(titulo, 20)) / 2,
            y: page.getHeight() - margin - headerHeight - 20,
            size: 20,
            color: rgb(0, 0, 0),
            font: font, // Usar la fuente cargada
        });

        // Configuración de fuente
        const fontSize = 10;

        // Dibujar la tabla
        const tableTop = page.getHeight() - margin - headerHeight - 60;
        let y = tableTop;
        const rowHeight = 20;

        // Calcular el ancho de las columnas dinámicamente
        const colWidths = columnas.map(col => contentWidth / columnas.length);

        // Dibujar encabezado de la tabla con fondo azul claro
        page.drawRectangle({
            x: margin,
            y: y - rowHeight,
            width: contentWidth,
            height: rowHeight,
            color: rgb(0.8, 0.9, 1),
        });

        columnas.forEach((header, i) => {
            page.drawText(header.label, {
                x: margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
                y: y - 15,
                size: fontSize,
                font: font, // Usar la fuente cargada
                color: rgb(0, 0, 0),
            });
        });

        y -= rowHeight;

        // Dibujar datos de la tabla
        items.forEach((item, index) => {
            const bgColor = index % 2 === 0 ? rgb(1, 1, 1) : rgb(0.95, 0.95, 0.95);
            page.drawRectangle({
                x: margin,
                y: y - rowHeight,
                width: contentWidth,
                height: rowHeight,
                color: bgColor,
            });

            columnas.forEach((col, i) => {
                const text = item[col.key].toString();
                page.drawText(text, {
                    x: margin + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
                    y: y - 15,
                    size: fontSize,
                    font: font, // Usar la fuente cargada
                    color: rgb(0, 0, 0),
                });
            });

            y -= rowHeight;
        });

        // Dibujar pie de página con fondo azul
        const footerY = margin - footerHeight;
        page.drawRectangle({
            x: 0,
            y: footerY,
            width: page.getWidth(),
            height: footerHeight,
            color: rgb(0.8, 0.9, 1),
        });

        // Número de página
        const numberOfPages = pdfDoc.getPageCount();
        for (let i = 0; i < numberOfPages; i++) {
            const currentPage = pdfDoc.getPage(i);
            currentPage.drawText(`Página ${i + 1} de ${numberOfPages}`, {
                x: (page.getWidth() / 2) - 20,
                y: footerY + 15,
                size: 12,
                font: font, // Usar la fuente cargada
                color: rgb(0, 0, 0),
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
