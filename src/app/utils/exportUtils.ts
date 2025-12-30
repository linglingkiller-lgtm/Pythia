// Export & Print Utilities for Pythia

export interface ExportOptions {
  title: string;
  subtitle?: string;
  content: string | HTMLElement;
  footer?: string;
  includeTimestamp?: boolean;
  includeBranding?: boolean;
}

/**
 * Generate print-friendly HTML with Pythia branding
 */
export function generatePrintHTML(options: ExportOptions): string {
  const {
    title,
    subtitle,
    content,
    footer,
    includeTimestamp = true,
    includeBranding = true
  } = options;

  const timestamp = new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const contentHTML = typeof content === 'string' 
    ? content 
    : content.outerHTML || content.innerHTML;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Pythia Report</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1f2937;
      background: white;
      padding: 0;
    }
    
    @page {
      margin: 0.75in;
      size: letter;
    }
    
    .page-header {
      border-bottom: 3px solid #991b1b;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    
    .branding {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .logo-box {
      width: 60px;
      height: 60px;
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 50%, #1e40af 100%);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      color: white;
      letter-spacing: 2px;
    }
    
    .branding-text h1 {
      font-size: 28px;
      font-weight: 700;
      color: #991b1b;
      letter-spacing: 3px;
      text-transform: uppercase;
      margin-bottom: 2px;
    }
    
    .branding-text p {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }
    
    .report-title {
      font-size: 24px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 5px;
    }
    
    .report-subtitle {
      font-size: 14px;
      color: #6b7280;
      margin-bottom: 10px;
    }
    
    .timestamp {
      font-size: 10px;
      color: #9ca3af;
      font-style: italic;
    }
    
    .report-content {
      margin: 30px 0;
    }
    
    .page-footer {
      border-top: 2px solid #e5e7eb;
      padding-top: 15px;
      margin-top: 40px;
      font-size: 9px;
      color: #9ca3af;
      text-align: center;
    }
    
    /* Content styling */
    h2 {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 25px 0 12px 0;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 8px;
    }
    
    h3 {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin: 15px 0 8px 0;
    }
    
    p {
      margin-bottom: 10px;
    }
    
    ul, ol {
      margin-left: 20px;
      margin-bottom: 15px;
    }
    
    li {
      margin-bottom: 5px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      font-size: 10px;
    }
    
    th {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      padding: 8px;
      text-align: left;
      font-weight: 600;
      color: #374151;
    }
    
    td {
      border: 1px solid #e5e7eb;
      padding: 8px;
    }
    
    tr:nth-child(even) {
      background: #f9fafb;
    }
    
    .metric-box {
      display: inline-block;
      padding: 10px 15px;
      background: #f3f4f6;
      border-left: 4px solid #991b1b;
      margin: 10px 10px 10px 0;
      border-radius: 4px;
    }
    
    .metric-label {
      font-size: 10px;
      color: #6b7280;
      text-transform: uppercase;
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .metric-value {
      font-size: 20px;
      font-weight: 700;
      color: #111827;
    }
    
    .status-badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
    }
    
    .status-success {
      background: #d1fae5;
      color: #065f46;
    }
    
    .status-warning {
      background: #fef3c7;
      color: #92400e;
    }
    
    .status-danger {
      background: #fee2e2;
      color: #991b1b;
    }
    
    .status-info {
      background: #dbeafe;
      color: #1e40af;
    }
    
    @media print {
      body {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      
      .page-break {
        page-break-before: always;
      }
      
      table {
        page-break-inside: avoid;
      }
      
      h2, h3 {
        page-break-after: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="page-header">
    ${includeBranding ? `
      <div class="branding">
        <div class="logo-box">Π</div>
        <div class="branding-text">
          <h1>PYTHIA</h1>
          <p>Echo Canyon Consulting</p>
        </div>
      </div>
    ` : ''}
    
    <div class="report-title">${title}</div>
    ${subtitle ? `<div class="report-subtitle">${subtitle}</div>` : ''}
    ${includeTimestamp ? `<div class="timestamp">Generated on ${timestamp}</div>` : ''}
  </div>
  
  <div class="report-content">
    ${contentHTML}
  </div>
  
  ${footer || includeBranding ? `
    <div class="page-footer">
      ${footer || ''}
      ${includeBranding ? `
        <p style="margin-top: 10px;">
          <strong>PYTHIA</strong> | Government Relations Intelligence Platform | Echo Canyon Consulting<br>
          Confidential & Proprietary Information
        </p>
      ` : ''}
    </div>
  ` : ''}
</body>
</html>
  `;
}

/**
 * Open print dialog with formatted content
 */
export function printDocument(options: ExportOptions): void {
  const html = generatePrintHTML(options);
  
  // Create temporary iframe for printing
  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  
  document.body.appendChild(iframe);
  
  const iframeDoc = iframe.contentWindow?.document;
  if (!iframeDoc) return;
  
  iframeDoc.open();
  iframeDoc.write(html);
  iframeDoc.close();
  
  // Wait for content to load then print
  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    
    // Clean up after print dialog closes
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  }, 250);
}

/**
 * Download as PDF (simulated - in production would use server-side PDF generation)
 */
export function downloadAsPDF(options: ExportOptions): void {
  // In production, this would call an API endpoint to generate PDF
  // For now, we'll open print dialog with instructions
  alert('Print to PDF:\n\n1. Use the print dialog (opening now)\n2. Select "Save as PDF" as the destination\n3. Click "Save" to download');
  printDocument(options);
}

/**
 * Export as HTML file
 */
export function exportAsHTML(options: ExportOptions): void {
  const html = generatePrintHTML(options);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${options.title.replace(/\s+/g, '_')}_${new Date().getTime()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Format content helpers
 */
export function formatMetric(label: string, value: string | number): string {
  return `
    <div class="metric-box">
      <div class="metric-label">${label}</div>
      <div class="metric-value">${value}</div>
    </div>
  `;
}

export function formatTable(headers: string[], rows: string[][]): string {
  return `
    <table>
      <thead>
        <tr>
          ${headers.map(h => `<th>${h}</th>`).join('')}
        </tr>
      </thead>
      <tbody>
        ${rows.map(row => `
          <tr>
            ${row.map(cell => `<td>${cell}</td>`).join('')}
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}

export function formatStatusBadge(label: string, variant: 'success' | 'warning' | 'danger' | 'info'): string {
  return `<span class="status-badge status-${variant}">${label}</span>`;
}

export function formatSection(title: string, content: string): string {
  return `
    <div class="section">
      <h2>${title}</h2>
      ${content}
    </div>
  `;
}
