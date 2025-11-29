(function ($) {
    "use strict";


    // Document Ready
    $(document).ready(function () {


        // hero_slider
        new Swiper(".hero_slider", {
            slidesPerView: 1,
            navigation: {
                prevEl: ".swipper-arrow-prev",
                nextEl: ".swipper-arrow-next",
            },
            speed: 1200,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper_pagination",
                clickable: true,
            },
        });

        // image_slider
        new Swiper(".image_slider", {
            navigation: {
                prevEl: ".swipper-arrow-prev",
                nextEl: ".swipper-arrow-next",
            },
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            speed: 1200,
            spaceBetween: 16,
            pagination: {
                el: ".swiper_pagination",
                clickable: true,
            },
            breakpoints: {
                // when window width is >= 575
                0: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                    loop: true,
                },
                // when window width is >= 575
                575: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                    loop: true,
                },
                // when window width is >= 768px
                768: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                    loop: false
                },
                // when window width is >= 992
                992: {
                    slidesPerView: 'auto',
                    spaceBetween: 16,
                    loop: false
                }
            }
        });

        // image_card
        $(document).ready(function () {
            // When an image card is clicked
            $('.image_card').on('click', function (e) {
                e.preventDefault();
                let imgSrc = $(this).find('.image_slide').attr('src');
                $('.popup_image').attr('src', imgSrc);
                $('.image_popup').addClass('active');
            });

            // Close popup when clicking the close button
            $('.close_popup').on('click', function () {
                $('.image_popup').removeClass('active');
            });

            // Optional: close when clicking outside the image
            $('.image_popup').on('click', function (e) {
                if (!$(e.target).is('.popup_image, .close_popup')) {
                    $('.image_popup').removeClass('active');
                }
            });
        });

    });

})(jQuery);
