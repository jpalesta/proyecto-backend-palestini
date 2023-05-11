function getCookie() {
    fetch('/getCookie')
      .then(response => response.text())
      .then(cookie => console.log(cookie))
  }