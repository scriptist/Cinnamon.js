// Slideshow for cinemagraphs
// Supports image & video elements

cinnamon = (function() {
	/* ---------- Modernizr ---------- */
	/* Modernizr 2.6.2 (Custom Build) | MIT & BSD
	 * Build: http://modernizr.com/download/#-video-teststyles-css_backgroundsizecover
	 */
	var Modernizr;
	Modernizr=function(a,b,c){function u(a){i.cssText=a}function v(a,b){return u(prefixes.join(a+";")+(b||""))}function w(a,b){return typeof a===b}function x(a,b){return!!~(""+a).indexOf(b)}function y(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:w(f,"function")?f.bind(d||b):f}return!1}var d="2.6.2",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l={},m={},n={},o=[],p=o.slice,q,r=function(a,c,d,e){var h,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:g+(d+1),l.appendChild(j);return h=["&#173;",'<style id="s',g,'">',a,"</style>"].join(""),l.id=g,(m?l:n).innerHTML+=h,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=f.style.overflow,f.style.overflow="hidden",f.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),f.style.overflow=k),!!i},s={}.hasOwnProperty,t;!w(s,"undefined")&&!w(s.call,"undefined")?t=function(a,b){return s.call(a,b)}:t=function(a,b){return b in a&&w(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=p.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(p.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(p.call(arguments)))};return e}),l.video=function(){var a=b.createElement("video"),c=!1;try{if(c=!!a.canPlayType)c=new Boolean(c),c.ogg=a.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),c.h264=a.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),c.webm=a.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(d){}return c};for(var z in l)t(l,z)&&(q=z.toLowerCase(),e[q]=l[z](),o.push((e[q]?"":"no-")+q));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)t(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},u(""),h=j=null,e._version=d,e.testStyles=r,e}(this,this.document),Modernizr.testStyles("#modernizr{background-size:cover}",function(a){var b=window.getComputedStyle?window.getComputedStyle(a,null):a.currentStyle;Modernizr.addTest("bgsizecover",b.backgroundSize=="cover")});

	/* ---------- Default settings ---------- */
	var defaults = {
		autoAdvance: 8000,
		fadeDuration: 800,
		selectors: {
			item: 'img, video'
		},
		parentClass: 'cinnamon'
	};
	var namespace = 'cinnamon',
		transparent_image = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
		support = (function() {
			var support = {};
			// IE6 and below don't work at all
			if (/\bMSIE [0-6][\. ]/.test(navigator.userAgent) && !window.opera) {
				return false;
			}

			support.gif = Modernizr.bgsizecover;
			support.video = Modernizr.video;

			if (!support.gif && !support.video)
				return false;

			return support;
		})();

	/* ---------- Private functions ---------- */
	// Sets data to an element
	function _setData($element, data) {
		return $element.data(namespace, data);
	}
	// Gets data from an element
	function _getData($element) {
		return $element.data(namespace);
	}
	// Returns all sideshow items inside $element
	function _getItems($element, settings) {
		if (!settings) {
			var data = _getData($element);
			settings = data.settings;
		}
		return $element.find(settings.selectors.item);
	}
	// Resizes video to fit full screen
	function _resizeVideo($elements) {
		$elements.each( function() {
			var $this = $(this),
				$parent = $this.parent(),
				parentHeight = $parent.height(),
				parentWidth = $parent.width(),
				videoRatio = this.videoWidth / this.videoHeight,
				parentRatio = parentWidth / parentHeight,
				offsetX = 0, offsetY = 0,
				width, height;

			if (!videoRatio || !parentRatio)
				return;

			if (videoRatio > parentRatio) {
				height = parentHeight;
				width = height * videoRatio;
				offsetX = (parentWidth - width) / 2;
			} else {
				width = parentWidth;
				height = width / videoRatio
				offsetY = (parentHeight - height) / 2;
			}

			$this.css({
				height: height,
				width: width,
				left: offsetX,
				top: offsetY
			});
		});
	}
	// Start videos playing
	function _initVideo($elements) {
		$elements
			// .attr('autoplay', true)
			.attr('loop', true)
			.css({
				display: 'block',
				position: 'absolute',
				top: 0,
				left: 0
			})
			.hide();
		_resizeVideo($elements);
		$(window).on('resize.' + namespace, function() {
			_resizeVideo($elements);
		});
		$elements.each( function() {
			var $this = $(this);
			$this.on('loadedmetadata.' + namespace, function() {
				_resizeVideo($this);
			});
		});
	}
	// Initialise GIF images
	function _initImg($elements) {
		$elements.each( function() {
			var $this = $(this);
			$this.css({
				backgroundImage: 'url(' + $this.attr('src') + ')'
			});
		});
		$elements.css({
			backgroundPosition: 'center',
			backgroundRepeat: 'no-repeat',
			backgroundSize: 'cover',
			minHeight: '100%',
			minWidth: '100%',
			height: 0,
			width: 0,
			position: 'absolute',
			top: 0,
			right: 0,
			bottom: 0,
			left: 0
		}).attr('src', transparent_image).hide();
	}
	// Initialise the parent element
	function _initParent($element) {
		$element.css({
			overflow: 'hidden'
		});
	}

	/* ---------- Public functions ---------- */
	// Initialise cinnamon
	function init(element, options) {
		var $element = $(element);
		if (!support || !$element.length)
			return false;

		// Initialise data
		var settings = $.extend({}, defaults, options),
			$items = _getItems($element, settings);
		data = {
			settings: settings,
			$items: $items,
			max: $items.length - 1
		}
		_setData($element, data);

		$element.addClass(settings.parentClass);

		// Begin video
		_initParent($element);
		_initVideo($items.filter('video'));
		_initImg($items.filter('img'));
		to(element, 0);

		// Start auto-advance
		start(element);

		return true;
	}
	// Show next item
	function next(element) {
		var $element = $(element);
		if (!support || !$element.length)
			return false;

		var data = _getData($element);
		if (!('current' in data) || data.current >= data.max)
			to(element, 0);
		else
			to(element, data.current + 1)
	}
	// Show previous item
	function prev(element) {
		var $element = $(element);
		if (!support || !$element.length)
			return false;

		var data = _getData($element);
		if (!('current' in data) || data.current <= 0)
			to(element, data.max);
		else
			to(element, data.current - 1)
	}
	// Go to any item
	function to(element, item) {
		var $element = $(element);
		if (!support || !$element.length)
			return false;

		// Get item to transition to
		var data = _getData($element),
			$to = null,
			to_num = null;

		if (typeof item == 'number') {
			if (item > data.max)
				return false;
			$to = $(data.$items.get(item));
			to_num = item;
		} else {
			$to = $(item);
			if ($to.length != 1)
				return false;
			to_num = 123;
		}

		// Get item to transition from
		var $from = $();
		if ('current' in data)
			$from = $(data.$items.get(data.current));

		if ($from[0] == $to[0])
			return false;

		// Handle video playing and pausing
		var callback;
		if ($to.is('video')) {
			$to[0].play();
		}
		if ($from.is('video')) {
			callback = function() {
				$from[0].pause();
			}
		}

		// Now perform the transition
		$to.css('z-index', '8').show();
		$from.css('z-index', '10').fadeOut(data.settings.fadeDuration, callback);

		data.current = to_num;

		return $to;
	}
	// Start auto-advance
	function start(element) {
		var $element = $(element);
		if (!support || !$element.length)
			return false;

		var data = _getData($element);

		data.interval = setInterval(function() {
			next(element);
		}, data.settings.autoAdvance);

		_setData($element, data);
	}

	/* Return object */
	return {
		init: init,
		next: next,
		prev: prev,
		to: to,
		start: start,
		support: support
	};
})();