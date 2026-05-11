

export const downloadQRCode = (qrCodeId: string, animalName: string) => {
  const elementId = `qr-gen-${qrCodeId}`
  const qrCanvas = document.getElementById(
    elementId
  ) as HTMLCanvasElement | null

  if (!qrCanvas) {
    console.error(`QR Canvas with ID ${elementId} not found.`)
    return
  }

  try {
    // 1. Convert to Data URL
    const pngUrl = qrCanvas.toDataURL("image/png")

    // 2. Create the download anchor
    const downloadLink = document.createElement("a")
    downloadLink.href = pngUrl

    // 3. Format filename: "Bruno-VET-8821.png"
    const safeName = animalName.replace(/[^a-z0-9]/gi, "_").toLowerCase()
    downloadLink.download = `${safeName}-${qrCodeId}.png`

    // 4. Trigger and Cleanup
    document.body.appendChild(downloadLink)
    downloadLink.click()
    document.body.removeChild(downloadLink)
  } catch (err) {
    console.error("Failed to download QR Code:", err)
  }
}



export const printQRCode = (qrCodeId: string, animalName: string) => {
  const elementId = `qr-gen-${qrCodeId}`;
  const qrCanvas = document.getElementById(elementId) as HTMLCanvasElement | null;

  if (!qrCanvas) {
    console.error("QR Canvas not found");
    return;
  }

  const qrDataUrl = qrCanvas.toDataURL("image/png");


  const printWindow = window.open("", "_blank", "width=600,height=600");

  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Tag - ${animalName}</title>
          <style>
            @page { size: auto; margin: 0; }
            body { 
              font-family: sans-serif; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              height: 100vh; 
              margin: 0;
            }
            .tag-container {
              border: 2px solid #e2e8f0;
              padding: 20px;
              border-radius: 12px;
              text-align: center;
              width: 250px;
            }
            .animal-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 4px;
              color: #0f172a;
            }
            .qr-id {
              font-family: monospace;
              font-size: 14px;
              color: #64748b;
              margin-bottom: 16px;
            }
            img {
              width: 200px;
              height: 200px;
            }
            .footer {
              margin-top: 12px;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 1px;
              color: #94a3b8;
            }
          </style>
        </head>
        <body>
          <div class="tag-container">
            <div class="animal-name">${animalName}</div>
            <div class="qr-id">${qrCodeId}</div>
            <img src="${qrDataUrl}" />
            <div class="footer">Official Animal Registry</div>
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

