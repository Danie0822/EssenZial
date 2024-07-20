const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const MARGEN = 50;
const ROW_HEIGHT = 30;
const TABLE_HEADER_COLOR = rgb(0.25, 0.5, 0.75);
const PAGE_WIDTH = 612;
const PAGE_HEIGHT = 792;
const HEADER_HEIGHT = 100;
const FOOTER_HEIGHT = 20;
const HEADER_COLOR = rgb(0.15, 0.35, 0.55);
const FOOTER_COLOR = rgb(0.15, 0.35, 0.55);
const TITLE_COLOR = rgb(0.0, 0.0, 0.0);  
const PADDING_TITULO_TABLA = 10;
async function cargarLogo(pdfDoc) {
    const logoPath = path.resolve(__dirname, '../../../uploads/logo/logo.jpeg');
    try {
        const logoBytes = fs.readFileSync(logoPath);
        return await pdfDoc.embedJpg(logoBytes);
    } catch (error) {
        console.error('Error al cargar el logo:', error.message);
        throw new Error('Error al cargar el logo.');
    }
}

function dibujarEncabezado(page, font, titulo, username, logoImage) {
    const pageHeight = page.getHeight();
    const logoDims = logoImage.scale(0.15);

    page.drawRectangle({
        x: 0,
        y: pageHeight - MARGEN - HEADER_HEIGHT,
        width: page.getWidth(),
        height: HEADER_HEIGHT,
        color: HEADER_COLOR,
    });

    page.drawImage(logoImage, {
        x: MARGEN,
        y: pageHeight - MARGEN - 80,
        width: logoDims.width,
        height: logoDims.height,
    });

    page.drawText(titulo, {
        x: (page.getWidth() - font.widthOfTextAtSize(titulo, 30)) / 2,
        y: pageHeight - MARGEN - 50,
        size: 30,
        font: font,
        color: rgb(1, 1, 1),
    });

    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString();

    const userInfoY = pageHeight - MARGEN - 45 - 5 - 25;

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
}

function dibujarPieDePagina(pdfDoc, font) {
    const numberOfPages = pdfDoc.getPageCount();
    for (let i = 0; i < numberOfPages; i++) {
        const currentPage = pdfDoc.getPage(i);
        currentPage.drawRectangle({
            x: 0,
            y: FOOTER_HEIGHT,
            width: currentPage.getWidth(),
            height: FOOTER_HEIGHT,
            color: FOOTER_COLOR,
        });

        currentPage.drawText(`Página ${i + 1} de ${numberOfPages}`, {
            x: currentPage.getWidth() - MARGEN - 100,
            y: FOOTER_HEIGHT + 5,
            size: 12,
            font: font,
            color: rgb(1, 1, 1),
        });
    }
}

async function generarReportePDF({ secciones, username, titulo, columnas, nombreArchivo }, res) {
    try {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const logoImage = await cargarLogo(pdfDoc);
        const contentWidth = PAGE_WIDTH - 2 * MARGEN;
        const colWidths = columnas.map(() => contentWidth / columnas.length);

        function addPage() {
            const page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
            dibujarEncabezado(page, font, titulo, username, logoImage);
            return page;
        }

        let page = addPage();
        let y = PAGE_HEIGHT - MARGEN - HEADER_HEIGHT - 20;

        for (const seccion of secciones) {
            // Título de la sección
            const tituloAncho = font.widthOfTextAtSize(seccion.titulo, 18);
            const paginaAncho = page.getWidth();
            
            page.drawText(seccion.titulo, {
                x: (paginaAncho - tituloAncho) / 2, // Centra el título
                y: y,
                size: 18,
                font: font,
                color: TITLE_COLOR,
            });
        
            y -= ROW_HEIGHT; // Espacio para el título
            y -= PADDING_TITULO_TABLA; // Espacio adicional entre el título y la tabla
        
            // Dibujar encabezado de la tabla
            page.drawRectangle({
                x: MARGEN,
                y: y,
                width: contentWidth,
                height: ROW_HEIGHT,
                color: TABLE_HEADER_COLOR,
            });
        
            columnas.forEach((header, i) => {
                page.drawText(header.label, {
                    x: MARGEN + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
                    y: y + 7,
                    size: 12,
                    font: font,
                    color: rgb(1, 1, 1),
                });
            });
        
            y -= ROW_HEIGHT;
        
            for (const item of seccion.items) {
                if (y < MARGEN + FOOTER_HEIGHT + ROW_HEIGHT) {
                    page = addPage();
                    y = PAGE_HEIGHT - MARGEN - HEADER_HEIGHT - 20;
                }
        
                const bgColor = item.estado_cliente === 'Activo' ? rgb(1, 1, 1) : rgb(0.95, 0.95, 0.95);
                page.drawRectangle({
                    x: MARGEN,
                    y: y,
                    width: contentWidth,
                    height: ROW_HEIGHT,
                    color: bgColor,
                    borderColor: rgb(0.8, 0.8, 0.8),
                    borderWidth: 0.5,
                });
        
                columnas.forEach((col, i) => {
                    const text = item[col.key].toString();
                    page.drawText(text, {
                        x: MARGEN + colWidths.slice(0, i).reduce((a, b) => a + b, 0) + 5,
                        y: y + 7,
                        size: 11,
                        font: font,
                        color: rgb(0, 0, 0),
                    });
                });
        
                y -= ROW_HEIGHT;
            }
        
            y -= ROW_HEIGHT * 1.5; // Espacio entre secciones
        }

        dibujarPieDePagina(pdfDoc, font);

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
