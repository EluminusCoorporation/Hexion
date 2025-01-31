const observer = new
IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      entry.target.classList.remove("reversed")
    } else {
      entry.target.classList.remove("show");
      entry.target.classList.add("reversed")
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.fade-in-d').forEach(el => observer.observe(el));