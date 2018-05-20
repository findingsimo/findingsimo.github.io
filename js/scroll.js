window.addEventListener('scroll', function () {
	  document.body.classList[
		window.scrollY > 20 ? 'add': 'remove'
	  ]('scrolled');
	});