// Анимация Hero блока
function heroShow() {
    $('.hero__mask').addClass('visible');
    $('.hero__inner').addClass('visible');
}
setTimeout(heroShow, 1000);

function parallax(event) {
    this.querySelectorAll('.parallax__layer').forEach(layer => {
        let speed = layer.getAttribute('data-speed');
        layer.style.transform = `translateX(${event.clientX*speed/1500}px)`;
    });
}

document.addEventListener('mousemove', parallax);


// Запрос галереи при загрузке страницы

let pictures = [];
$(function() {
    let gallery = $('.gallery__content');
    
    $.ajax({
        url: '/getgallery',
        method: 'get',
        success: function(data) {
           console.log(data); 
           data.forEach(item => {
            gallery.append(createPictureItem(item));
           });
           
        }
    });
    
    $('.add-form__button').click(function(e) {
        e.preventDefault();
        let fd = new FormData();
        fd.append('imgUrl', $('#add-form__picture')[0].files[0]);
        fd.append('author', $('.add-form__input[name="author"]').val());
        fd.append('address', $('.add-form__input[name="address"]').val());
        $.ajax({
            url: '/upload',
            data: fd,
            type: 'POST',
            processData: false,
            contentType: false,
            success: function(data) {
                gallery.append(createPictureItem(data));
            }
        });
    });
   
});



let createPictureItem = function(picture) {
    return `
            <div class="gallery__item">
                <div class="gallery__item-wrapper">
                    <img class="gallery__img" src='img/gallery/${picture.url}' alt="">
                    <div class="gallery__info">
                        <span class="gallery__place">${picture.address}</span>
                        <span class="gallery__author">${picture.author}</span>
                    </div>
                </div>
            </div>
    `;
};





