# VCF Viewer

A modern, client-side web application for viewing and analyzing VCF (Variant Call Format) files. Built with Svelte 4 and designed to run entirely in the browser without requiring server infrastructure.

## 🌟 Live Demo

**Try it now:** [https://yxuil.github.io/vcfview](https://yxuil.github.io/vcfview)

No installation required! Just click the link above to start analyzing VCF files immediately.

## Features

- **Client-side VCF Processing**: Upload and analyze VCF files directly in your browser
- **Multiple Loading Methods**: Upload files, load from URLs, or use sample data
- **Excel-like Interface**: Professional data grid with sorting, filtering, and pagination
- **Hierarchical Column Management**: Expand/collapse INFO and sample columns for detailed analysis
  - **INFO Column Expansion**: Toggle between compact VCF format and individual INFO field columns
  - **Sample Column Expansion**: Toggle between FORMAT strings and separate sub-columns per sample
  - **Interactive Headers**: Click ▶/▼ icons in headers to expand/collapse sections independently
- **File Format Support**: Handles both .vcf and .vcf.gz files (local and remote)
- **Advanced Filtering**: Column-specific filters with text, numeric, and range operations
- **Multi-format Export**: Export filtered data as VCF, CSV, or JSON
- **Optimized Column Sizing**: Smart initial widths with auto-sizing functionality
- **Performance Optimized**: Handles large datasets with virtual scrolling
- **Responsive Design**: Works on desktop and tablet devices
- **Sample Data**: Includes demonstration datasets for immediate exploration

## Getting Started

### 🚀 Quick Deploy to GitHub Pages

Want to deploy your own instance immediately? Here's the fastest way:

1. **Click "Use this template" or Fork this repository**
2. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Under "Source", select "GitHub Actions"
3. **Wait for deployment** (check the Actions tab)
4. **Access your app** at `https://yxuil.github.io/vcfview`

That's it! Your VCF viewer is now live and ready to use.

### 💻 Local Development

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

#### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `build` directory, ready for deployment to any static hosting service.

## Usage

### Loading Data

1. **Choose loading method**: Select between "Upload File" or "Load from URL" 
2. **Upload a VCF file**: Click "Upload File" or drag and drop a .vcf or .vcf.gz file
3. **Load from URL**: Enter a direct URL to a VCF file (must support CORS)
4. **Load sample data**: Click "Load Sample Data" to explore with demonstration data

### Exploring VCF Data

Once your data is loaded, you'll see a professional data grid with standard VCF columns:

**Base Columns (always visible):**
- Chromosome, Position, ID, Reference, Alternative, Quality, Filter

**INFO Column Management:**
- **Collapsed (default)**: Shows INFO data in original VCF format (`AC=2;AF=1.00;AN=2`)
- **Expanded**: Click the ▶ icon in INFO header to show individual columns for each INFO field
- **Collapse back**: Click the ▼ icon in the expanded INFO header to return to compact format

**Sample Column Management:**
- **Collapsed (default)**: Shows sample data in original FORMAT format (`1/1:0,26:26:78`)
- **Expanded**: Click the ▶ icon in any sample header to show individual FORMAT sub-columns (GT, AD, DP, etc.)
- **Collapse back**: Click the ▼ icon in the expanded sample header to return to compact format
- **Independent control**: Each sample can be expanded/collapsed separately

### Data Grid Features

- **Sorting**: Click any column header to sort data
- **Filtering**: Use the filter icon in column headers for advanced filtering
- **Column Resizing**: Drag column borders to adjust widths
- **Auto-sizing**: Click "Auto-size Columns" to fit all columns to screen width
- **Row Selection**: Click checkboxes to select specific variants
- **Pagination**: Navigate through large datasets with built-in pagination

### Export Options

1. **Select data**: Choose specific rows or use "Select All" 
2. **Export format**: Choose from VCF, CSV, or JSON formats
3. **Download**: Filtered and selected data will be exported
4. **Export results**: Select rows and export filtered data in your preferred format

### Visual Design Features

**Interactive Column Headers:**
- 🔽 **Expand Icons (▶)**: Indicates collapsed columns that can be expanded
- 🔼 **Collapse Icons (▼)**: Indicates expanded sections that can be collapsed  
- **Color Coding**: Gray backgrounds for INFO sections, blue backgrounds for sample sections
- **Hover Effects**: Headers highlight on hover to show interactivity

**Data Formats:**
- **Original VCF Format**: Maintains data integrity with standard VCF field formatting
- **Expanded Analysis**: Individual columns allow for precise filtering and sorting of specific metrics
- **Best of Both Worlds**: Switch between compact view for overview and detailed view for analysis

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

## Deployment

### GitHub Pages (Recommended)

This repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages:

#### Setup Instructions:

1. **Fork or clone this repository**

2. **Enable GitHub Pages:**
   - Go to your repository's Settings
   - Navigate to "Pages" in the sidebar
   - Under "Source", select "GitHub Actions"

3. **Push to main branch:**
   ```bash
   git push origin main
   ```

4. **Your app will be available at:**
   ```
   https://yxuil.github.io/vcfview
   ```

#### How it works:
- The workflow automatically triggers on pushes to the `main` branch
- It builds the application using `npm run build`
- Deploys the `build` directory to GitHub Pages
- Your site updates automatically with each push

#### Troubleshooting:
- **404 Error:** Make sure GitHub Pages is enabled and set to "GitHub Actions"
- **Build Failed:** Check the Actions tab for error details
- **Site not updating:** Wait 1-2 minutes after pushing changes
- **Permission errors:** Ensure your repository has Actions enabled

### Other Deployment Options

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
- Hierarchical column grouping with dynamic rendering
- Optimized column sizing and auto-fit algorithms
- Custom header components for interactive UI elements

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
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
