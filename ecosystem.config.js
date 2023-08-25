module.exports = {
  apps: [{
    script: 'dev-server.js',
    watch: ['dev-server.js', './src_server'],

    // Delay between restart
    watch_delay: 1000,
    ignore_watch: ["node_modules", "\\.git"],
  }]
};
