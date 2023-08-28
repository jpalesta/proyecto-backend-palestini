const { logger } = require('../../utils/logger')

function getCookie() {
    fetch('/getCookie')
      .then(response => response.text())
      .then(cookie => logger.info(cookie))
  }