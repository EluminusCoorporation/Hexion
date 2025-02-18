document.querySelectorAll('.donation-btn').forEach(button => {
  button.addEventListener('click', function() {
    let amount = this.getAttribute('data-amount');
    if (amount) {
      document.getElementById('custom-amount').style.display = 'none';
    } else {
      document.getElementById('custom-amount').style.display = 'block';
    }
  });
});

document.getElementById('donate-now').addEventListener('click', function() {
  document.getElementById('thanks-message').style.display = 'block';
});