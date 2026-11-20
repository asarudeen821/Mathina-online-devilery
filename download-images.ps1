# Chicken Lollipop Images Download Script
# Run this script from the frontend directory to download placeholder images

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Chicken Lollipop Images Downloader" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Create directory
$targetDir = "public\images\products"
Write-Host "Creating directory: $targetDir" -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path $targetDir | Out-Null
Write-Host "✓ Directory created" -ForegroundColor Green
Write-Host ""

# Define images
$images = @(
    @{
        Url = "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&h=600&fit=crop"
        File = "chicken-lollipop-main.jpg"
        Desc = "Main showcase image (800x600)"
    },
    @{
        Url = "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop"
        File = "chicken-lollipop-1.jpg"
        Desc = "Thumbnail 1 (400x300)"
    },
    @{
        Url = "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=400&h=300&fit=crop"
        File = "chicken-lollipop-2.jpg"
        Desc = "Thumbnail 2 (400x300)"
    },
    @{
        Url = "https://images.unsplash.com/photo-1606491956689-2ea28c6746f5?w=400&h=300&fit=crop"
        File = "chicken-lollipop-3.jpg"
        Desc = "Thumbnail 3 (400x300)"
    }
)

# Download each image
foreach ($img in $images) {
    Write-Host "Downloading $($img.Desc)..." -ForegroundColor Yellow
    $filePath = Join-Path $targetDir $img.File
    
    try {
        Invoke-WebRequest -Uri $img.Url -OutFile $filePath -UseBasicParsing
        Write-Host "  ✓ Downloaded: $($img.File)" -ForegroundColor Green
    }
    catch {
        Write-Host "  ✗ Failed to download $($img.File)" -ForegroundColor Red
        Write-Host "    Error: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Download Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# List downloaded files
Write-Host "Downloaded files:" -ForegroundColor Cyan
Get-ChildItem -Path $targetDir -Filter "*.jpg" | ForEach-Object {
    $size = "{0:N1} KB" -f ($_.Length / 1KB)
    Write-Host "  ✓ $($_.Name) - $size" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1. Run: npm run dev" -ForegroundColor White
Write-Host "  2. Navigate to Chicken Lollipop section" -ForegroundColor White
Write-Host "  3. Verify images display correctly" -ForegroundColor White
Write-Host ""
