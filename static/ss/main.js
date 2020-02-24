$(document).ready(() => {
  app = new semanticSegmentationApp();
  app.readyUIComponents();
});

$(window).load(() => {
  app.windowsLoadExtra();
  app.main();
});