const baWrapper = document.querySelector('.before-after-slider');

  baWrapper.addEventListener('click', (event) => {

    const isFullscreen = event.target.className === 'fullscreen';
    if (!isFullscreen) {
      return;
    }
  
    // Get the modal and parent elements
    var modal = document.querySelector(".before-after-modal");
    var modalContent = modal.querySelector(".before-after-modal-content");
    var parent = event.target.parentElement;
    
    // Get the image compare element
    var images = parent.querySelector(".image-compare");
    var imageParent = images.parentElement;

    // Display the modal
    modalContent.replaceChildren(images);
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    var span = modal.querySelector(".close");

    // When the user clicks on <span> (x), close the modal
    span.addEventListener('click', (event) => {
      modal.style.display = "none";
      imageParent.insertBefore(images, imageParent.firstChild);
    })

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
        imageParent.insertBefore(images, imageParent.firstChild);
      }
    }

    // When escape key pressed, close the modal
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        modal.style.display = "none";
        imageParent.insertBefore(images, imageParent.firstChild);
      }
    })
  })