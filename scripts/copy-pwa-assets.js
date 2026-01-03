const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public');
const destDir = path.join(__dirname, '../dist');
const indexHtmlPath = path.join(destDir, 'index.html');

console.log('Starting PWA assets copy and HTML injection...');

// 1. Copy Assets
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (let entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            if (!fs.existsSync(destPath)) fs.mkdirSync(destPath);
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${entry.name}`);
        }
    }
}
copyDir(srcDir, destDir);

// 2. Inject PWA Tags into index.html
if (fs.existsSync(indexHtmlPath)) {
    let html = fs.readFileSync(indexHtmlPath, 'utf8');

    // Check if already injected to avoid duplicates
    if (!html.includes('link rel="manifest"')) {
        const pwaHeadTags = `
    <!-- PWA Injection -->
    <link rel="manifest" href="/manifest.json">
    <link rel="apple-touch-icon" href="/logo.png">
    <meta name="theme-color" content="#7c3aed">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="ExpenseTracker">
    `;

        const swScript = `
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js');
        });
      }
    </script>
    `;

        // Inject into HEAD
        html = html.replace('</head>', `${pwaHeadTags}</head>`);

        // Inject into BODY
        html = html.replace('</body>', `${swScript}</body>`);

        fs.writeFileSync(indexHtmlPath, html);
        console.log('Injected PWA tags into index.html');
    }
}

console.log('PWA setup complete!');
