Add-Type -AssemblyName System.Drawing

$sourcePath = "assets\logo-original-backup.png"
$destPath = "assets\logo-fixed.png"
$size = 1024

try {
    # Load original image
    $image = [System.Drawing.Image]::FromFile($sourcePath)
    
    # Create new bitmap with target size
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graph = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # High quality settings
    $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graph.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    
    # Draw resize
    $graph.DrawImage($image, 0, 0, $size, $size)
    
    # Save as simpler PNG
    $bitmap.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Cleanup
    $graph.Dispose()
    $bitmap.Dispose()
    $image.Dispose()
    
    Write-Host "Image resized successfully to $destPath"
} catch {
    Write-Error "Failed to resize image: $_"
    exit 1
}
