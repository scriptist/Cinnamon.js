Cinnamon.js
====================

What is it?
---------------------

Cinnamon.js is an easy and convenient way to make a slideshow of cinemagraphs (though it will work just as well with any other videos or images).

It supports HTML5 videos, GIF animations, and also static image formats.

How do I make it work?
---------------------

	<section class="slideshow">
		<video>
			<source src="/vid/bg1.mp4">
		</video>
		<img src="/vid/bg3.gif" alt="">
	</section>
	<script>
		cinnamon.init('.slideshow');
		if (!cinnamon.support)
			alert('Your browser is not supported - should probably display some fallback content.');
	</script>


Support
---------------------

Cinnamon.js makes use of the following properties:

- background-size: cover (for images)
- min-height & min-width (also for images)
- HTML5 videos (for videos)

As a result, it supports IE8+ for images, and IE9+ for HTML5 videos.


Awesome!
---------------------

You think it's awesome? Thanks.