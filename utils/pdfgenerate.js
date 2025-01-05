import { PDFDocument, rgb } from 'pdf-lib';
import * as fontkit from 'fontkit';
import fs from 'fs';
import path from 'path';

export async function createBillPDF(billDetails) {
    const pdfDoc = await PDFDocument.create();
    
    // Register fontkit
    pdfDoc.registerFontkit(fontkit);

    // Load custom font
    const fontPath = path.resolve('./fonts/Roboto-Regular.ttf');

    if (!fs.existsSync(fontPath)) {
        throw new Error('Font file not found at the specified path.');
    }

    const fontBytes = fs.readFileSync(fontPath);
    const customFont = await pdfDoc.embedFont(fontBytes);

    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { 
        shopName, 
        gstNumber, 
        contactDetails, 
        ownerName, 
        createdBy, 
        products, 
        totalAmount, 
        billDate 
    } = billDetails;

    // Set margins
    const margin = 50;

    // Add header
    page.drawText(shopName, {
        x: margin,
        y: page.getHeight() - margin,
        size: 18,
        font: customFont,
        color: rgb(0, 0, 0),
    });

    page.drawText(`GST Number: ${gstNumber}`, {
        x: margin,
        y: page.getHeight() - margin - 20,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Contact: ${contactDetails}`, {
        x: margin,
        y: page.getHeight() - margin - 40,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Owner: ${ownerName}`, {
        x: margin,
        y: page.getHeight() - margin - 60,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Bill Created By: ${createdBy}`, {
        x: margin,
        y: page.getHeight() - margin - 80,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
    });

    page.drawText(`Date: ${billDate}`, {
        x: margin,
        y: page.getHeight() - margin - 100,
        size: 12,
        font: customFont,
        color: rgb(0, 0, 0),
    });

    // Add table header
    let currentY = page.getHeight() - margin - 140;

    page.drawText('S.No', { x: margin, y: currentY, size: 12, font: customFont });
    page.drawText('Product Name', { x: margin + 50, y: currentY, size: 12, font: customFont });
    page.drawText('Price', { x: margin + 300, y: currentY, size: 12, font: customFont });
    page.drawText('Quantity', { x: margin + 380, y: currentY, size: 12, font: customFont });
    page.drawText('Total', { x: margin + 460, y: currentY, size: 12, font: customFont });

    currentY -= 20;

    // Add products
    products.forEach((product, index) => {
        const { name, price, quantity } = product;
        const total = price * quantity;

        page.drawText(`${index + 1}`, { x: margin, y: currentY, size: 12, font: customFont });
        page.drawText(name, { x: margin + 50, y: currentY, size: 12, font: customFont });
        page.drawText(price.toFixed(2), { x: margin + 300, y: currentY, size: 12, font: customFont });
        page.drawText(`${quantity}`, { x: margin + 380, y: currentY, size: 12, font: customFont });
        page.drawText(total.toFixed(2), { x: margin + 460, y: currentY, size: 12, font: customFont });

        currentY -= 20;
    });

    // Add total amount
    currentY -= 20;

    page.drawText(`Total Amount: ₹${totalAmount.toFixed(2)}`, {
        x: margin,
        y: currentY,
        size: 14,
        font: customFont,
        color: rgb(0.8, 0, 0),
    });

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const filePath = './uploads/bills/bill.pdf';
    fs.writeFileSync(filePath, pdfBytes);

    return filePath;
}
