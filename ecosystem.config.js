module.exports = {
  apps: [
    {
      name: 'kaspataxi-client',
      script: 'npm',
      args: 'run start',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'kaspataxi-server',
      script: 'npm',
      args: 'run start:server',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
