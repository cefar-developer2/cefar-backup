// Get all videos
var video =  document.querySelectorAll('.ab-background-video');

// Add source to video tag
function addSourceToVideo(element, src) {
  var source = document.createElement('source');
  source.src = src;
  source.type = 'video/mp4';
  element.appendChild(source);
}

// Determine screen size and select mobile or desktop vid
function whichSizeVideo(element, src) {
	var windowWidth = window.innerWidth ? window.innerWidth : $(window).width();
	if (windowWidth >= 1024 ) {
		addSourceToVideo( element, src.dataset.desktopVid);
	} else {
		addSourceToVideo(element, src.dataset.mobileVid);
	}
}

// init only if page has videos
function videoSize() {
	if (video !== undefined) {
	video.forEach(function(element, index) {
			whichSizeVideo(
				element, //element
				element  //src locations
			);
		});
	}
}
videoSize();
