const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../public');
const destDir = path.join(__dirname, '../dist');

// Create dist if it doesn't exist (though expo export should create it)
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
            if (!fs.existsSync(destPath)) {
                fs.mkdirSync(destPath);
            }
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
            console.log(`Copied ${entry.name} to dist/`);
        }
    }
}

console.log('Starting PWA assets copy...');
try {
    copyDir(srcDir, destDir);
    console.log('PWA assets copy complete!');
} catch (err) {
    console.error('Error copying PWA assets:', err);
    process.exit(1);
}
