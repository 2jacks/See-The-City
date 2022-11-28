function parallax(event) {
    this.querySelectorAll('.parallax__layer').forEach(layer => {
        let speed = layer.getAttribute('data-speed');
        layer.style.transform = `translate(${event.clientX*speed/1000}px,${event.clientY*speed/1000}px)`;
    });
}

document.addEventListener('mousemove', parallax);