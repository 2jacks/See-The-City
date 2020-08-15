let pictures = [];
$('.gallery__item').each(function (index) {
    pictures.push(
        {
            imgUrl: $(this).find('.gallery__img').attr("src"),
            author: $(this).find('.gallery__author').text(),
            address: $(this).find('.gallery__place').text()
        }
    );
});

$('.add-form__button').on('click', (event) => {
    event.preventDefault();
    let newPicture = {};
    $('.add-form').find('input').each((index, element) => {
        newPicture[$(element).attr('name')] =  $(element).val();
    });
    pictures.push(newPicture);
    $('.gallery__content').append(createPictureItem(newPicture));
    $('.map').empty();
    ymaps.ready(init);
});

let createPictureItem = function(picture) {
    return `
            <div class="gallery__item">
                <div class="gallery__item-wrapper">
                    <img class="gallery__img" src=${picture.imgUrl} alt="">
                    <div class="gallery__info">
                        <span class="gallery__place">${picture.address}</span>
                        <span class="gallery__author">${picture.author}</span>
                    </div>
                </div>
            </div>
    `;
};

ymaps.ready(init);
function init(){
    let myMap = new ymaps.Map("map", {
        center: [54.7431, 55.9678],
        zoom: 10
    });
    let cluster = new ymaps.Clusterer(
        {clusterDisableClickZoom: true}
    );

    let myGeocoder;

    pictures.forEach(picture => {
        myGeocoder = ymaps.geocode(picture.address);
        myGeocoder.then(function(res) {
            let firstGeoObject = res.geoObjects.get(0);
            let coords = firstGeoObject.geometry.getCoordinates();
            cluster.add(createPlacemark(coords, picture));
        });
    });
    myMap.geoObjects.add(cluster);
    function createPlacemark(coords, item) {
        return new ymaps.Placemark(coords,
            {
                preset: 'islands#violetDotIconWithCaption',
                balloonContentHeader: item.address,
                balloonContentBody: `<img class="gallery__img gallery__img--in-balloon" src="../${item.imgUrl}" alt="placePhoto"/>`
            },
            {
                balloonContentLayout: ymaps.templateLayoutFactory.createClass(
                    `<img class="gallery__img gallery__img--in-balloon" src="../${item.imgUrl}" alt="placePhoto"/>`
                ),

            },
        )
    }

}

