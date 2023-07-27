const wrapper = document.querySelector('#section-product-images');

if (wrapper !== undefined) {
  wrapper.addEventListener('click', (event) => {

    const isImage = event.target.nodeName === 'IMG';
    if (!isImage) {
      return;
    }

    const target = event.target.id;

    // Get the modal
    var modal = document.querySelector(".gallery-modal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById(target);
    var modalImg = modal.querySelector(".gallery-modal-content");

    // Display the modal
    modalImg.src = img.src;
    modal.style.display = "block";

    // Get the <span> element that closes the modal
    var span = modal.querySelector(".close");

    // When the user clicks on <span> (x), close the modal
    span.addEventListener('click', (event) => {
      modal.style.display = "none";
    })

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }

    // When escape key pressed, close the modal
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        modal.style.display = "none";
      }
    })
  })
}
