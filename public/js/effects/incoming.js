// Observer is used to detect if user has loaded the page
const observer = new
IntersectionObserver((entries) => {
  entries.forEach(entry => {
    // if user is loading the element areas
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      entry.target.classList.remove("reversed");
    } else 
    {
      //Does that in reverse
      entry.target.classList.remove("show");
      entry.target.classList.add("reversed")
    }
  });
  // Set the threshold
}, { threshold: 0.2 });

// Gets all the elements with the specific className
document.querySelectorAll('.fade-in-d').forEach(el => observer.observe(el));