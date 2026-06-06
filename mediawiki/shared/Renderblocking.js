// For [[Module:CSS]]; [[T:CSS]] dependency
document.addEventListener("DOMContentLoaded", function () {
  // Select all matching span elements
  var importSpans = document.querySelectorAll("span.import-css");

  // Iterate over each span found
  importSpans.forEach(function (span) {
    var cssContent = span.getAttribute("data-css");

    // Safety check: ensure there is CSS content
    if (cssContent) {
      // Create a new <style> element (Replaces mw.util.addCSS)
      var style = document.createElement("style");
      style.textContent = cssContent;
      document.head.appendChild(style);

      // Add the class
      style.classList.add("import-css");

      // Copy attributes from the current span to the new style tag
      var hash = span.getAttribute("data-css-hash");
      var from = span.getAttribute("data-from");

      if (hash) style.setAttribute("data-css-hash", hash);
      if (from) style.setAttribute("data-from", from);
    }
  });
});