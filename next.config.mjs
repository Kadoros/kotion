/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains:[
            "files.edgestore.dev"
        ]
    },
    webpack: (config, options) => {
      // Apply raw-loader only to .node files in specific modules
      config.module.rules.push({
        test: /\.node$/,
        use: 'raw-loader',
        // include: [
        //   /node_modules\/canvas\/build\/Release/,
        //   /node_modules\/canvas\/lib/,
        //   /node_modules\/pdfjs-dist\/build/,
        //   /node_modules\/@react-pdf-viewer\/core\/lib/
        // ],
      });
    
      return config;
    }
}
    

export default nextConfig;
