<<<<<<< HEAD
# VCF Viewer

A modern, client-side web application for viewing and analyzing VCF (Variant Call Format) files. Built with Svelte 4 and designed to run entirely in the browser without requiring server infrastructure.

## Features

- **Client-side VCF Processing**: Upload and analyze VCF files directly in your browser
- **Multiple Loading Methods**: Upload files, load from URLs, or use sample data
- **Excel-like Interface**: Professional data grid with sorting, filtering, and pagination
- **File Format Support**: Handles both .vcf and .vcf.gz files (local and remote)
- **Advanced Filtering**: Column-specific filters with text, numeric, and range operations
- **Multi-format Export**: Export filtered data as VCF, CSV, or JSON
- **Performance Optimized**: Handles large datasets with virtual scrolling
- **Responsive Design**: Works on desktop and tablet devices
- **Sample Data**: Includes demonstration datasets for immediate exploration

## Getting Started

### Option 1: Use Directly from GitHub (No Setup Required)

You can use the VCF Viewer directly from GitHub without any setup:

**Using jsDelivr CDN:**
```
https://cdn.jsdelivr.net/gh/YOUR_USERNAME/vcfview@main/index.html
```

**Using GitHub Raw (slower):**
```
https://raw.githubusercontent.com/YOUR_USERNAME/vcfview/main/index.html
```

### Option 2: Local Development Setup

#### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

#### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd vcfview
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

#### Option A: Standard Build (for hosting services)

To create a production build:

```bash
npm run build
```

The built files will be in the `build` directory, ready for deployment to any static hosting service.

#### Option B: Direct Repository Build (for GitHub direct access)

To build for direct repository access:

```bash
npm run build:direct
```

This creates `index.html` and `_app/` in the root directory that can be accessed directly from GitHub.

## Usage

1. **Choose loading method**: Select between "Upload File" or "Load from URL" 
2. **Upload a VCF file**: Click "Upload File" or drag and drop a .vcf or .vcf.gz file
3. **Load from URL**: Enter a direct URL to a VCF file (must support CORS)
4. **Load sample data**: Click "Load Sample Data" to explore with demonstration data
5. **Explore the data**: Use the data grid to sort, filter, and analyze variants
6. **Export results**: Select rows and export filtered data in your preferred format

### Loading from URL

When using the URL loading feature:
- The URL must point directly to a VCF file (.vcf or .vcf.gz)
- The server hosting the file must support CORS (Cross-Origin Resource Sharing)
- Both HTTP and HTTPS URLs are supported
- Compressed files (.vcf.gz) are automatically detected and decompressed

**Example URLs:**
```
https://example.com/data/variants.vcf
https://example.com/data/variants.vcf.gz
https://ftp.example.com/pub/genomics/sample.vcf
```

**CORS Limitations:**
If you encounter CORS errors, the server doesn't allow cross-origin requests. In this case:
- Download the file manually and use the file upload feature instead
- Or use a CORS proxy service (not recommended for sensitive data)

### Loading VCF Files from GitHub Repositories

You can load VCF files directly from GitHub repositories using the URL loading feature:

**GitHub Raw URLs:**
```
https://raw.githubusercontent.com/USERNAME/REPOSITORY/BRANCH/path/to/file.vcf
https://raw.githubusercontent.com/USERNAME/REPOSITORY/BRANCH/path/to/file.vcf.gz
```

**jsDelivr CDN URLs (faster and more reliable):**
```
https://cdn.jsdelivr.net/gh/USERNAME/REPOSITORY@BRANCH/path/to/file.vcf
https://cdn.jsdelivr.net/gh/USERNAME/REPOSITORY@BRANCH/path/to/file.vcf.gz
```

**Examples:**
```
https://raw.githubusercontent.com/johndoe/genomics-data/main/samples/variants.vcf
https://cdn.jsdelivr.net/gh/johndoe/genomics-data@main/samples/variants.vcf.gz
```

**Tips for GitHub VCF files:**
- Use jsDelivr CDN URLs for better performance and reliability
- GitHub raw files work but may be slower for large files
- Both compressed (.vcf.gz) and uncompressed (.vcf) files are supported
- Make sure your repository is public or the files are accessible

## Deployment Options

### Option 1: GitHub Pages (Recommended)

1. Enable GitHub Pages in your repository settings
2. Use the provided GitHub Actions workflow
3. Your app will be available at `https://USERNAME.github.io/REPOSITORY`

### Option 2: Direct Repository Access

**Quick Setup:**
```bash
# Clone and setup
git clone https://github.com/USERNAME/vcfview.git
cd vcfview
npm install

# Build for direct access
npm run build:direct

# Commit the generated files
git add index.html _app/
git commit -m "Add direct access build files"
git push
```

**Access your app:**
- **jsDelivr CDN**: `https://cdn.jsdelivr.net/gh/USERNAME/REPOSITORY@main/index.html`
- **GitHub Raw**: `https://raw.githubusercontent.com/USERNAME/REPOSITORY/main/index.html`

**Benefits:**
- ✅ No GitHub Pages setup required
- ✅ Works immediately after pushing
- ✅ CDN delivery via jsDelivr
- ✅ Can be embedded in other pages

### Option 3: Other Static Hosting

Deploy the `build` directory to any static hosting service:
- Netlify
- Vercel  
- AWS S3
- Azure Static Web Apps
- Firebase Hosting

## Technical Details

### Architecture

- **Frontend**: Svelte 4 + SvelteKit
- **UI Components**: Tailwind CSS + AG-Grid Community
- **Data Processing**: Custom VCF parser with fflate for compression
- **Export**: Papa Parse for CSV, native JSON, and VCF format support

### Performance Features

- Virtual scrolling for large datasets
- Progressive file parsing with progress indicators
- Client-side filtering and sorting
- Memory-efficient data structures

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (standard hosting)
- `npm run build:direct` - Build for direct repository access
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript checks

### Project Structure

```
src/
├── lib/
│   ├── components/          # Svelte components
│   ├── services/           # VCF parsing and export services
│   ├── stores/             # State management
│   └── types/              # TypeScript definitions
├── routes/                 # SvelteKit routes
└── app.css                 # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Run `npm run check` to ensure code quality
6. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Svelte](https://svelte.dev) and [SvelteKit](https://kit.svelte.dev)
- Uses [AG-Grid](https://ag-grid.com) for data visualization
- VCF parsing inspired by genomics community standards
=======
# vcfview
testing pyscript
>>>>>>> origin/main
