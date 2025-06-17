
import { DonorRecord, getSettings } from './database';
import { formatCurrency, formatRiceWeight, ijabQabul, zakatIntentions } from './zakatUtils';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

// Helper function to create a receipt for thermal printing
export const createThermalReceipt = (donor: DonorRecord): string => {
  const settings = getSettings();
  const currentDate = new Date(donor.paymentDate);
  const time = donor.paymentTime || currentDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace('.', ':');
  const date = currentDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  // Calculate line width based on paper width and margins for 52mm printer (26-28 chars)
  const lineWidth = 24; // Reduced width to prevent text wrapping
  const marginLeft = ''; // Remove margin for maximum space utilization
  
  // Helper function to center text with optional bold effect
  const centerText = (text: string, bold: boolean = false) => {
    const maxWidth = lineWidth - 2; // Account for margins
    
    // If text is longer than maxWidth, split it into multiple lines
    if (text.length > maxWidth) {
      const words = text.split(' ');
      let lines = [];
      let currentLine = '';
      
      for (const word of words) {
        if ((currentLine + ' ' + word).length <= maxWidth) {
          currentLine = currentLine ? currentLine + ' ' + word : word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      
      return lines.map(line => {
        const padding = Math.max(0, Math.floor((lineWidth - line.length) / 2));
        const paddedText = ' '.repeat(padding) + line;
        return bold ? paddedText.toUpperCase() : paddedText;
      }).join('\n');
    }
    
    const padding = Math.max(0, Math.floor((lineWidth - text.length) / 2));
    const paddedText = ' '.repeat(padding) + text;
    return bold ? paddedText.toUpperCase() : paddedText;
  };
  
  // Helper function to format label and value with dynamic width
  const formatRow = (label: string, value: string) => {
    const maxLabelWidth = 11; // Reduced label width to prevent text wrapping
    const paddedLabel = label.padEnd(maxLabelWidth, ' ');
    const maxValueWidth = lineWidth - maxLabelWidth - 2; // -2 for ': '
    const wrappedValue = value.length > maxValueWidth
      ? value.substring(0, maxValueWidth - 3) + '...'
      : value;
    return marginLeft + paddedLabel + ': ' + wrappedValue;
  };
  
  // Create a receipt string formatted for thermal printer
  let receipt = '';
  
  // Header with bold text and proper spacing
  receipt += '\n';
  receipt += centerText('*'.repeat(lineWidth)) + '\n';
  receipt += centerText(settings.mosqueName, true) + '\n';
  receipt += centerText(settings.address) + '\n';
  receipt += centerText('*'.repeat(lineWidth)) + '\n';
  receipt += centerText('BUKTI PEMBAYARAN', true) + '\n';
  receipt += centerText('ZAKAT FITRAH', true) + '\n';
  receipt += centerText('*'.repeat(lineWidth)) + '\n';
  
  // Transaction details with compact format
  receipt += formatRow('Tanggal', date) + '\n';
  receipt += formatRow('Waktu', time.replace('.', ':')) + '\n';
  receipt += formatRow('Nama KK', donor.headOfFamily) + '\n';
  receipt += formatRow('Jumlah', `${donor.familyCount} Jiwa`) + '\n';
  receipt += formatRow('RT/RW', `${donor.rtNumber}/${donor.rwNumber || '-'}`) + '\n';
  receipt += formatRow('Petugas', donor.collectorName || '-') + '\n';
  receipt += formatRow('Metode', donor.paymentMethod === 'cash' ? 
    donor.paymentType === 'tunai' ? 'Tunai' :
    donor.paymentType === 'transfer' ? 'Transfer' :
    'QRIS' : 'Beras') + '\n\n';
  
  // Payment details
  receipt += marginLeft + '-'.repeat(lineWidth) + '\n';
  if (donor.paymentMethod === 'cash') {
    // Zakat Fitrah details
    receipt += formatRow('Zakat Fitrah', `${formatCurrency(donor.cashAmount / donor.familyCount)} x ${donor.familyCount} jiwa`) + '\n';
    receipt += formatRow('Total Zakat', formatCurrency(donor.cashAmount)) + '\n';
    
    // Infaq Baznas details
    receipt += formatRow('Infaq Baznas', `${formatCurrency(donor.infaqAmount)} x ${donor.familyCount} jiwa`) + '\n';
    receipt += formatRow('Total Baznas', formatCurrency(donor.infaqAmount * donor.familyCount)) + '\n';
    
    // Infaq Masjid details
    receipt += formatRow('Infaq Masjid', `${formatCurrency(donor.infaqAmount2)} x ${donor.familyCount} jiwa`) + '\n';
    receipt += formatRow('Total Masjid', formatCurrency(donor.infaqAmount2 * donor.familyCount)) + '\n';
    
    receipt += marginLeft + '-'.repeat(lineWidth) + '\n';
    // Total pembayaran
    receipt += '\n' + centerText('TOTAL PEMBAYARAN', true) + '\n';
    const totalAmount = donor.cashAmount + (donor.infaqAmount * donor.familyCount) + (donor.infaqAmount2 * donor.familyCount);
    receipt += centerText(formatCurrency(totalAmount)) + '\n';
  } else {
    receipt += formatRow('Zakat Fitrah (Beras) per Jiwa', formatRiceWeight(donor.riceAmount / donor.familyCount)) + '\n';
    receipt += formatRow('Total Zakat Fitrah', formatRiceWeight(donor.riceAmount)) + '\n';
  }
  receipt += marginLeft + '-'.repeat(lineWidth) + '\n\n';
  
  // Footer with improved spacing and separators
  receipt += '\n' + centerText('*'.repeat(lineWidth)) + '\n';
  receipt += centerText('Terima Kasih', true) + '\n';
  receipt += centerText('Semoga Menjadi', true) + '\n';
  receipt += centerText('Amal Ibadah', true) + '\n\n';
  receipt += centerText('Panitia Zakat Fitrah', true) + '\n';
  receipt += centerText(settings.mosqueName, true) + '\n';
  receipt += centerText('*'.repeat(lineWidth)) + '\n\n';
  
  return receipt;
};

// Function to print thermal receipt
export const printThermalReceipt = async (donor: DonorRecord, copies: number = 1): Promise<void> => {
  const receipt = createThermalReceipt(donor);
  const settings = getSettings();
  
  // Try to print using bluetooth printer first
  const bluetoothPrinter = (await import('./bluetoothPrinter')).bluetoothPrinter;
  const connectedPrinter = bluetoothPrinter.getConnectedPrinter();

  if (connectedPrinter) {
    for (let i = 0; i < copies; i++) {
      const success = await bluetoothPrinter.printReceipt(donor);
      if (!success) break;
    }
    return;
  }

  // Fallback to regular printing if bluetooth fails or not available
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none';
  document.body.appendChild(iframe);
  
  // Write receipt content to iframe
  iframe.contentDocument!.open();
  iframe.contentDocument!.write(`
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @page {
            size: 52mm auto;
            margin: 0;
            width: 52mm;
          }
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          html, body {
            width: 52mm;
            min-height: 100%;
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @media print {
            html, body {
              width: 52mm !important;
              height: fit-content !important;
              margin: 0 !important;
              padding: 0 !important;
              zoom: 100% !important;
              transform-origin: top left;
              page-break-inside: avoid;
            }
            @page {
              size: 52mm 100%;
              margin: 0;
            }
          }
          body {
            font-family: "Courier New", monospace;
            font-size: 9pt;
            line-height: 1.2;
            text-transform: none;
            letter-spacing: 0.02em;
            font-weight: 700;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            background: white;
            transform-origin: top left;
            zoom: 100%;
            color: black;
            -webkit-font-smoothing: antialiased;
          }
          pre {
            white-space: pre-wrap;
            margin: 0;
            padding: 4px;
            font-family: inherit;
            font-size: inherit;
            width: 100%;
            overflow: visible;
          }
          .receipt-container {
            width: 52mm;
            padding: 0;
            margin: 0;
            page-break-after: always;
          }
        </style>
      </head>
      <body>
        ${Array(copies).fill(`<div class="receipt-container"><pre>${receipt}</pre></div>`).join('\n')}
      </body>
    </html>
  `);
  iframe.contentDocument!.close();
  
  // Tambahkan delay yang lebih lama dan pastikan konten dimuat dengan sempurna
  setTimeout(() => {
    try {
      // Pastikan iframe sudah dimuat dengan benar
      if (!iframe.contentDocument || !iframe.contentWindow) {
        console.error('Iframe belum dimuat dengan benar');
        return;
      }

      // Fokuskan ke iframe dan tunggu sebentar
      iframe.contentWindow.focus();
      
      // Tambahkan event listener untuk mendeteksi status pencetakan
      const beforePrint = () => {
        console.log('Mempersiapkan pencetakan...');
      };
      
      const afterPrint = () => {
        console.log('Pencetakan selesai');
        // Hapus iframe dan event listeners
        document.body.removeChild(iframe);
        window.removeEventListener('beforeprint', beforePrint);
        window.removeEventListener('afterprint', afterPrint);
      };

      window.addEventListener('beforeprint', beforePrint);
      window.addEventListener('afterprint', afterPrint);
      
      // Mulai proses pencetakan
      iframe.contentWindow.print();
    } catch (error) {
      console.error('Terjadi kesalahan saat mencetak:', error);
      // Hapus iframe jika terjadi kesalahan
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    }
  }, 1500); // Tambah delay menjadi 1.5 detik untuk memastikan konten dimuat sempurna
};

// Function to create PDF receipt
export const createPdfReceipt = (donor: DonorRecord): void => {
  const settings = getSettings();
  const doc = new jsPDF({
    format: [52, 210], // 52mm width like thermal receipt
    unit: 'mm',
    orientation: 'portrait'
  });
  doc.setFont('Courier'); // Use monospace font like thermal receipt
  
  // Set up document with thermal receipt style
  const pageWidth = doc.internal.pageSize.width;
  const centerX = pageWidth / 2;
  let currentY = 5; // Start closer to top
  const lineHeight = 4; // Smaller line height for compact layout
  const marginX = 2; // Smaller margins like thermal receipt
  
  // Helper function to add centered text
  const addCenteredText = (text: string, fontSize: number = 8, isBold: boolean = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('Courier', isBold ? 'bold' : 'normal');
    if (isBold) text = text.toUpperCase();
    doc.text(text, centerX, currentY, { align: 'center', maxWidth: pageWidth - (marginX * 2) });
    currentY += lineHeight;
  };
  
  // Helper function to add left-aligned text with label formatting
  const addLeftText = (label: string, value: string, fontSize: number = 8) => {
    doc.setFontSize(fontSize);
    doc.setFont('Courier', 'normal');
    const maxLabelWidth = 10;
    const paddedLabel = label.padEnd(maxLabelWidth, ' ');
    doc.text(`${paddedLabel}: ${value}`, marginX, currentY, { maxWidth: pageWidth - (marginX * 2) });
    currentY += lineHeight;
  };
  
  // Helper function to add separator line
  const addSeparator = () => {
    doc.setFontSize(8);
    doc.text('-'.repeat(32), marginX, currentY);
    currentY += lineHeight;
  };
  
  // Header with thermal receipt style
  currentY += 2;
  addCenteredText('*'.repeat(32), 8);
  addCenteredText(settings.mosqueName, 10, true);
  addCenteredText(settings.address, 8);
  addCenteredText('*'.repeat(32), 8);
  addCenteredText('BUKTI PEMBAYARAN', 10, true);
  addCenteredText('ZAKAT FITRAH', 10, true);
  addCenteredText('*'.repeat(32), 8);
  
  // Transaction details
  const currentDate = new Date(donor.paymentDate);
  const time = donor.paymentTime || currentDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace('.', ':');
  const date = currentDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  addLeftText('Tanggal', date);
  addLeftText('Waktu', time);
  addLeftText('Nama KK', donor.headOfFamily);
  addLeftText('Jumlah', `${donor.familyCount} Jiwa`);
  addLeftText('RT/RW', `${donor.rtNumber}/${donor.rwNumber || '-'}`);
  addLeftText('Petugas', donor.collectorName || '-');
  addLeftText('Metode', donor.paymentMethod === 'cash' ? 
    donor.paymentType === 'tunai' ? 'Tunai' :
    donor.paymentType === 'transfer' ? 'Transfer' :
    'QRIS' : 'Beras');
  
  currentY += 2;
  addSeparator();
  
  // Payment details
  if (donor.paymentMethod === 'cash') {
    addLeftText('Zakat Fitrah', `${formatCurrency(donor.cashAmount / donor.familyCount)} x ${donor.familyCount} jiwa`);
    addLeftText('Total Zakat', formatCurrency(donor.cashAmount));
    
    addLeftText('Infaq Baznas', `${formatCurrency(donor.infaqAmount)} x ${donor.familyCount} jiwa`);
    addLeftText('Total Baznas', formatCurrency(donor.infaqAmount * donor.familyCount));
    
    addLeftText('Infaq Masjid', `${formatCurrency(donor.infaqAmount2)} x ${donor.familyCount} jiwa`);
    addLeftText('Total Masjid', formatCurrency(donor.infaqAmount2 * donor.familyCount));
    
    addSeparator();
    currentY += 1;
    addCenteredText('TOTAL PEMBAYARAN', 10, true);
    const totalAmount = donor.cashAmount + (donor.infaqAmount * donor.familyCount) + (donor.infaqAmount2 * donor.familyCount);
    addCenteredText(formatCurrency(totalAmount), 8);
  } else {
    addLeftText('Zakat Fitrah (Beras) per Jiwa', formatRiceWeight(donor.riceAmount / donor.familyCount));
    addLeftText('Total Zakat Fitrah', formatRiceWeight(donor.riceAmount));
  }
  
  addSeparator();
  currentY += 2;
  
  // Footer with thermal receipt style
  currentY += 1;
  addCenteredText('*'.repeat(32), 8);
  addCenteredText('Terima Kasih', 8, true);
  addCenteredText('Semoga Menjadi', 8, true);
  addCenteredText('Amal Ibadah', 8, true);
  currentY += 1;
  addCenteredText('Panitia Zakat Fitrah', 8, true);
  addCenteredText(settings.mosqueName, 8, true);
  addCenteredText('*'.repeat(32), 8);
  
  // Print the PDF
  doc.autoPrint();
  doc.output('dataurlnewwindow');
};

// Function to generate a full report PDF
export const generateReportPdf = (
  donors: DonorRecord[],
  rtSummary: any[],
  distribution: any,
  mode: 'download' | 'print' = 'download'
): void => {
  const doc = new jsPDF();
  const settings = getSettings();
  
  // Header
  doc.setFontSize(16);
  doc.text('LAPORAN ZAKAT FITRAH', doc.internal.pageSize.width / 2, 20, { align: 'center' });
  doc.text(settings.mosqueName, doc.internal.pageSize.width / 2, 30, { align: 'center' });
  doc.setFontSize(12);
  doc.text(settings.address, doc.internal.pageSize.width / 2, 40, { align: 'center' });
  
  // Rekapitulasi per RT
  doc.setFontSize(14);
  doc.text('Rekapitulasi per RT', 14, 60);
  
  const rtTableData = rtSummary.map(rt => [
    `RT ${rt.rtNumber}`,
    rt.totalFamilies,
    rt.totalIndividuals,
    rt.cashDonors,
    formatCurrency(rt.totalCash),
    rt.riceDonors,
    formatRiceWeight(rt.totalRice),
    formatCurrency(rt.totalInfaqBaznas),
    formatCurrency(rt.totalInfaqMasjid)
  ]);
  
  doc.autoTable({
    startY: 65,
    head: [[
      'RT',
      'Total KK',
      'Total Jiwa',
      'Pembayar Uang',
      'Total Uang',
      'Pembayar Beras',
      'Total Beras',
      'Infaq Baznas',
      'Infaq Masjid'
    ]],
    body: rtTableData,
    theme: 'grid',
    headStyles: { fillColor: [76, 175, 80] },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 20 },
      4: { cellWidth: 30 },
      6: { cellWidth: 25 },
      7: { cellWidth: 30 },
      8: { cellWidth: 30 }
    }
  });
  
  // Rekapitulasi Keseluruhan
  const finalY = (doc as any).lastAutoTable.finalY || 150;
  doc.setFontSize(14);
  doc.text('Rekapitulasi Keseluruhan', 14, finalY + 20);
  
  const totalSummary = rtSummary.reduce((acc, rt) => ({
    totalFamilies: acc.totalFamilies + rt.totalFamilies,
    totalIndividuals: acc.totalIndividuals + rt.totalIndividuals,
    cashDonors: acc.cashDonors + rt.cashDonors,
    totalCash: acc.totalCash + rt.totalCash,
    riceDonors: acc.riceDonors + rt.riceDonors,
    totalRice: acc.totalRice + rt.totalRice,
    totalInfaqBaznas: acc.totalInfaqBaznas + rt.totalInfaqBaznas,
    totalInfaqMasjid: acc.totalInfaqMasjid + rt.totalInfaqMasjid
  }), {
    totalFamilies: 0,
    totalIndividuals: 0,
    cashDonors: 0,
    totalCash: 0,
    riceDonors: 0,
    totalRice: 0,
    totalInfaqBaznas: 0,
    totalInfaqMasjid: 0
  });
  
  doc.autoTable({
    startY: finalY + 25,
    head: [[
      'Total KK',
      'Total Jiwa',
      'Pembayar Uang',
      'Total Uang',
      'Pembayar Beras',
      'Total Beras',
      'Total Infaq Baznas',
      'Total Infaq Masjid'
    ]],
    body: [[
      totalSummary.totalFamilies,
      totalSummary.totalIndividuals,
      totalSummary.cashDonors,
      formatCurrency(totalSummary.totalCash),
      totalSummary.riceDonors,
      formatRiceWeight(totalSummary.totalRice),
      formatCurrency(totalSummary.totalInfaqBaznas),
      formatCurrency(totalSummary.totalInfaqMasjid)
    ]],
    theme: 'grid',
    headStyles: { fillColor: [76, 175, 80] },
    styles: { fontSize: 8, cellPadding: 2 }
  });
  
  // Footer
  const printDate = new Date();
  const dateStr = printDate.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  doc.setFontSize(10);
  doc.text(`Dicetak pada: ${dateStr}`, 14, doc.internal.pageSize.height - 20);
  
  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(`LAPORAN PENGUMPULAN & DISTRIBUSI ZAKAT FITRAH`, 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(settings.mosqueName, 105, 30, { align: 'center' });
  doc.text(settings.address, 105, 37, { align: 'center' });
  doc.text(`Tahun ${new Date().getFullYear()}`, 105, 44, { align: 'center' });

  // Summary Table
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Rekapitulasi Pengumpulan Zakat Fitrah', 20, 60);

  const summaryData = rtSummary.map(rt => [
    `RT ${rt.rtNumber}`,
    rt.totalFamilies,
    rt.totalIndividuals,
    formatCurrency(rt.totalCash),
    `${formatRiceWeight(rt.totalRice)} kg`
  ]);

  (doc as any).autoTable({
    startY: 65,
    head: [['RT', 'KK', 'Jiwa', 'Uang', 'Beras']],
    body: summaryData,
    theme: 'grid',
    headStyles: { fillColor: [0, 128, 0] },
    styles: { fontSize: 10 }
  });

  // Distribution Table
  const currentY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Rencana Distribusi Zakat Fitrah', 20, currentY);

  const distributionData = [
    ['Fakir Miskin', `${distribution.fakirMiskin}%`, formatCurrency(distribution.fakirMiskinAmount), `${formatRiceWeight(distribution.fakirMiskinRice)} kg`],
    ['Fi Sabilillah', `${distribution.fiSabilillah}%`, formatCurrency(distribution.fiSabilillahAmount), `${formatRiceWeight(distribution.fiSabilillahRice)} kg`],
    ['Amil DKM', `${distribution.amilinDKM}%`, formatCurrency(distribution.amilinDKMAmount), `${formatRiceWeight(distribution.amilinDKMRice)} kg`],
    ['Amil Desa', `${distribution.amilinDesa}%`, formatCurrency(distribution.amilinDesaAmount), `${formatRiceWeight(distribution.amilinDesaRice)} kg`],
    ['Amil Kecamatan', `${distribution.amilinKecamatan}%`, formatCurrency(distribution.amilinKecamatanAmount), `${formatRiceWeight(distribution.amilinKecamatanRice)} kg`],
    ['Total', '100%', formatCurrency(distribution.totalCashAmount), `${formatRiceWeight(distribution.totalRiceAmount)} kg`]
  ];

  (doc as any).autoTable({
    startY: currentY + 5,
    head: [['Kategori', 'Persentase', 'Uang', 'Beras']],
    body: distributionData,
    theme: 'grid',
    headStyles: { fillColor: [0, 128, 0] },
    styles: { fontSize: 10 }
  });

  // Donor List Table
  const donorY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Daftar Muzakki', 20, donorY);

  const donorData = donors.map(donor => [
    donor.headOfFamily,
    donor.rtNumber,
    donor.familyCount,
    donor.paymentMethod === 'cash' ? formatCurrency(donor.cashAmount) : '-',
    donor.paymentMethod === 'rice' ? `${formatRiceWeight(donor.riceAmount)} kg` : '-',
    formatCurrency(donor.infaqAmount)
  ]);

  (doc as any).autoTable({
    startY: donorY + 5,
    head: [['Nama KK', 'RT', 'Jiwa', 'Uang', 'Beras', 'Infaq']],
    body: donorData,
    theme: 'grid',
    headStyles: { fillColor: [0, 128, 0] },
    styles: { fontSize: 10 }
  });

  // Footer
  doc.setFontSize(10);
  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 20, doc.internal.pageSize.height - 10);

  // Save or print based on mode
  if (mode === 'download') {
    doc.save(`laporan_zakat_fitrah_${new Date().toISOString().split('T')[0]}.pdf`);
  } else {
    doc.autoPrint();
    doc.output('dataurlnewwindow');
  }
  doc.setFontSize(14);
  doc.text(`${settings.mosqueName}`, 105, 28, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`${settings.address}`, 105, 35, { align: 'center' });
  doc.text(`Tahun ${new Date().getFullYear()}`, 105, 42, { align: 'center' });
  
  doc.line(20, 45, 190, 45);
  
  // Total collections
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Rekapitulasi Pengumpulan Zakat Fitrah`, 20, 55);
  
  const totalIndividuals = donors.reduce((sum, donor) => sum + donor.familyCount, 0);
  const totalFamilies = donors.length;
  const totalCash = donors.filter(d => d.paymentMethod === 'cash').reduce((sum, d) => sum + d.cashAmount, 0);
  const totalRice = donors.filter(d => d.paymentMethod === 'rice').reduce((sum, d) => sum + d.riceAmount, 0);
  const totalInfaq = donors.reduce((sum, d) => sum + d.infaqAmount, 0);
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Total Keluarga: ${totalFamilies}`, 20, 65);
  doc.text(`Total Jiwa: ${totalIndividuals}`, 20, 72);
  doc.text(`Total Zakat Uang: ${formatCurrency(totalCash)}`, 20, 79);
  doc.text(`Total Zakat Beras: ${formatRiceWeight(totalRice)}`, 20, 86);
  doc.text(`Total Infaq/Sodaqoh: ${formatCurrency(totalInfaq)}`, 20, 93);
  
  // RT Summary
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Pengumpulan Per-RT`, 20, 105);
  
  // RT Summary Table
  (doc as any).autoTable({
    startY: 110,
    head: [['RT', 'Keluarga', 'Jiwa', 'Zakat Uang', 'Zakat Beras', 'Infaq']],
    body: rtSummary.map(rt => [
      rt.rtNumber,
      rt.totalFamilies,
      rt.totalIndividuals,
      formatCurrency(rt.totalCash),
      formatRiceWeight(rt.totalRice),
      formatCurrency(rt.totalInfaq)
    ])
  });
  
  // Distribution
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Distribusi Zakat Fitrah`, 20, (doc as any).lastAutoTable.finalY + 15);
  
  // Distribution Table
  (doc as any).autoTable({
    startY: (doc as any).lastAutoTable.finalY + 20,
    head: [['Kategori', 'Persentase', 'Jumlah Uang', 'Jumlah Beras']],
    body: [
      ['Fakir Miskin', '75%', formatCurrency(distribution.fakirMiskin.cash), formatRiceWeight(distribution.fakirMiskin.rice)],
      ['Amil DKM/RT/RW', '8%', formatCurrency(distribution.amilinDKM.cash), formatRiceWeight(distribution.amilinDKM.rice)],
      ['Fi Sabilillah', '12.5%', formatCurrency(distribution.fiSabilillah.cash), formatRiceWeight(distribution.fiSabilillah.rice)],
      ['Amil Desa', '2.5%', formatCurrency(distribution.amilinDesa.cash), formatRiceWeight(distribution.amilinDesa.rice)],
      ['Amil Kecamatan', '2%', formatCurrency(distribution.amilinKecamatan.cash), formatRiceWeight(distribution.amilinKecamatan.rice)]
    ]
  });
  
  // Committee Members
  doc.addPage();
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`Panitia Zakat Fitrah ${settings.mosqueName}`, 105, 20, { align: 'center' });
  
  // Committee Table
  (doc as any).autoTable({
    startY: 30,
    head: [['Nama', 'Jabatan', 'No. Telepon']],
    body: settings.committeeMembers.map(member => [
      member.name,
      member.position,
      member.phoneNumber
    ])
  });
  
  // Footer
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Dicetak pada: ${dateStr}`, 20, 280);
  
  // Save or print based on mode
  if (mode === 'download') {
    doc.save(`laporan_zakat_fitrah_${printDate.toISOString().split('T')[0]}.pdf`);
  } else {
    doc.autoPrint();
    doc.output('dataurlnewwindow');
  }
}
