const path = require('path')
const nextConfig = {
    sassOptions: {
      includePaths: [path.join(__dirname, 'styles')],
    },
    reactStrictMode: false,
}

export default nextConfig;
