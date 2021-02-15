'use strict';

module.exports = {
  test_page: 'tests/index.html?hidepassed',
  disable_watching: true,
  launch_in_ci: [
    'Chrome'
  ],
  launch_in_dev: [
    'Chrome'
  ],
  browser_start_timeout: 120,
  browser_args: {
    Chrome: {
      dev: ['--touch-events',
        '--remote-debugging-port=9222'
      ],
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.TRAVIS ? '--no-sandbox' : null,
        '--touch-events',
        '--headless',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=9222',
        '--window-size=1440,900'
      ].filter(Boolean)
    }
  }
};
