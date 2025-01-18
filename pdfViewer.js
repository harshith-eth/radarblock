let pdfViewer = null;

function openPDFViewer(pdfUrl) {
    // Create background overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;

    // Create the modal container with scrolling
    const container = document.createElement('div');
    container.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.95);
        width: 90%;
        height: 80%;
        z-index: 2001;
        background: #fff;
        border-radius: 12px;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.3);
        transition: transform 0.3s ease;
    `;

    // Create container for PDF pages
    const pagesContainer = document.createElement('div');
    pagesContainer.style.cssText = `
        width: 100%;
        height: auto;
        padding: 20px;
        box-sizing: border-box;
    `;

    // Add individual page images with correct indexing
    const pages = ['page0.png', 'page1.png', 'page2.png']; // Using actual file names
    pages.forEach((page, index) => {
        const pageImg = document.createElement('img');
        pageImg.src = page;
        pageImg.alt = `Resume Page ${index + 1}`;
        pageImg.onerror = function() {
            this.style.display = 'none'; // Hide if image fails to load
            console.error(`Failed to load ${page}`);
        };
        pageImg.onload = function() {
            this.style.display = 'block'; // Show only when loaded
        };
        pageImg.style.cssText = `
            width: 100%;
            height: auto;
            margin-bottom: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: none; // Start hidden until loaded
        `;
        pagesContainer.appendChild(pageImg);
    });

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        background: #81cc9d;
        border: none;
        border-radius: 50%;
        color: #000;
        font-size: 24px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2002;
        box-shadow: 0 0 15px rgba(129, 204, 157, 0.5);
    `;
    closeButton.onclick = closePDFViewer;

    // Assemble the viewer
    container.appendChild(pagesContainer);
    container.appendChild(closeButton);
    document.body.appendChild(overlay);
    document.body.appendChild(container);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
        overlay.style.opacity = '1';
        container.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    // Store references
    pdfViewer = {
        overlay,
        container
    };

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePDFViewer();
        }
    });
}

function closePDFViewer() {
    if (pdfViewer) {
        // Animate out
        pdfViewer.overlay.style.opacity = '0';
        pdfViewer.container.style.transform = 'translate(-50%, -50%) scale(0.95)';
        
        // Remove after animation
        setTimeout(() => {
            pdfViewer.overlay.remove();
            pdfViewer.container.remove();
            pdfViewer = null;
            document.body.style.overflow = '';
        }, 300);
    }
}

// Make functions available globally
window.openPDFViewer = openPDFViewer;
window.closePDFViewer = closePDFViewer; 