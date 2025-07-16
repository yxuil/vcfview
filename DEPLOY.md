# Quick Deployment Guide

## Direct Repository Access (Recommended)

### Setup
1. Clone this repository
2. Run `npm install`
3. Run `npm run build:direct`
4. Commit the generated `index.html` and `_app/` files
5. Push to GitHub

### Access your app
- **Fast CDN**: `https://cdn.jsdelivr.net/gh/YOUR_USERNAME/YOUR_REPO@main/index.html`
- **GitHub Raw**: `https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/index.html`

### Example URLs
```
# If your GitHub username is 'johndoe' and repo is 'vcfview'
https://cdn.jsdelivr.net/gh/johndoe/vcfview@main/index.html
https://raw.githubusercontent.com/johndoe/vcfview/main/index.html
```

## GitHub Pages (Alternative)

1. Enable GitHub Pages in repository settings
2. Use the GitHub Actions workflow in `.github/workflows/deploy.yml`
3. Your app will be at `https://USERNAME.github.io/REPOSITORY`

## Loading VCF Files from GitHub

You can load VCF files directly from GitHub repositories:

```
# GitHub Raw URL
https://raw.githubusercontent.com/USERNAME/REPO/BRANCH/path/to/file.vcf

# jsDelivr CDN URL (faster)
https://cdn.jsdelivr.net/gh/USERNAME/REPO@BRANCH/path/to/file.vcf
```

## Benefits of Direct Repository Access

- ✅ No GitHub Pages setup required
- ✅ Works immediately after pushing
- ✅ CDN delivery via jsDelivr
- ✅ Can be embedded in other pages
- ✅ No build process needed for users
- ✅ Just share the URL and it works