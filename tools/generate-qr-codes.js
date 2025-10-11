#!/usr/bin/env node

/**
 * Generate QR codes for the first 3 museums
 * 
 * This script generates QR codes that link directly to each museum's page
 * on the MuseumCheck website.
 */

const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

// Museum data for the first 3 museums
const museums = [
    {
        id: 'forbidden-city',
        name: '故宫博物院',
        url: 'https://museumcheck.cn/?museum=forbidden-city',
        filename: 'qr-forbidden-city.png'
    },
    {
        id: 'national-museum',
        name: '中国国家博物馆',
        url: 'https://museumcheck.cn/?museum=national-museum',
        filename: 'qr-national-museum.png'
    },
    {
        id: 'shanghai-museum',
        name: '上海博物馆',
        url: 'https://museumcheck.cn/?museum=shanghai-museum',
        filename: 'qr-shanghai-museum.png'
    }
];

// QR code generation options
const qrOptions = {
    errorCorrectionLevel: 'M',
    type: 'png',
    quality: 0.92,
    margin: 1,
    width: 400,
    color: {
        dark: '#000000',
        light: '#FFFFFF'
    }
};

async function generateQRCodes() {
    console.log('🔍 Generating QR codes for museums...');
    console.log('=====================================\n');
    
    for (const museum of museums) {
        try {
            const filePath = path.join(__dirname, '..', museum.filename);
            
            // Generate QR code as PNG file
            await QRCode.toFile(filePath, museum.url, qrOptions);
            
            console.log(`✅ Generated QR code for: ${museum.name}`);
            console.log(`   URL: ${museum.url}`);
            console.log(`   File: ${museum.filename}\n`);
        } catch (error) {
            console.error(`❌ Error generating QR code for ${museum.name}:`, error);
        }
    }
    
    console.log('🎉 All QR codes generated successfully!');
    console.log('\n📋 Generated files:');
    museums.forEach(m => console.log(`   • ${m.filename}`));
}

// Run the generator
generateQRCodes().catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
