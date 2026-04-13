document.querySelectorAll(".js-toggle").forEach(trigger => {
  trigger.addEventListener("click", (e) => {
    
    const selectors = trigger.dataset.toggle;
    if (!selectors) return;

    selectors.split(",").forEach(selector => {
      selector = selector.trim();

      let elements;

      if (selector === "this") {
        elements = [trigger];

      } 
      
      else if (selector.startsWith("this ")) {
        const localSelector = selector.replace("this ", "");
        elements = trigger.querySelectorAll(localSelector);
        
      } else {
        elements = document.querySelectorAll(selector);
      }

      elements.forEach(el => {
        el.classList.toggle("active");
      });
    });
  });
});