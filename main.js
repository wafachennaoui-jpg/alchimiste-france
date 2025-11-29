(function ($) {
    "use strict";

    //Scroll back to top
    $(document).ready(function () {

        var progressPath = document.querySelector('.progress-wrap path');
        var pathLength = progressPath.getTotalLength();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'none';
        progressPath.style.strokeDasharray = pathLength + ' ' + pathLength;
        progressPath.style.strokeDashoffset = pathLength;
        progressPath.getBoundingClientRect();
        progressPath.style.transition = progressPath.style.WebkitTransition = 'stroke-dashoffset 10ms linear';
        var updateProgress = function () {
            var scroll = $(window).scrollTop();
            var height = $(document).height() - $(window).height();
            var progress = pathLength - (scroll * pathLength / height);
            progressPath.style.strokeDashoffset = progress;
        }
        updateProgress();
        $(window).scroll(updateProgress);
        var offset = 50;
        var duration = 550;
        jQuery(window).on('scroll', function () {
            if (jQuery(this).scrollTop() > offset) {
                jQuery('.progress-wrap').addClass('active-progress');
            } else {
                jQuery('.progress-wrap').removeClass('active-progress');
            }
        });
        jQuery('.progress-wrap').on('click', function (event) {
            event.preventDefault();
            jQuery('html, body').animate({ scrollTop: 0 }, duration);
            return false;
        })

    });

    // Document Ready
    $(document).ready(function () {

        // menu_toggle
        $('.menu_toggle').on('click', function (event) {
            event.preventDefault();
            $("body").toggleClass('menu_active');
        });

        $('.menu_link').on('click', function (event) {
            $("body").removeClass('menu_active');
        });

        $(document).ready(function () {
            function toggleSticky() {
                if ($(window).scrollTop() >= 100) {
                    $(".site_header").addClass("sticky");
                } else {
                    $(".site_header").removeClass("sticky");
                }
            }

            // Run once on page load (handles refresh case)
            toggleSticky();

            // Run on scroll
            $(window).on("scroll", function () {
                toggleSticky();
            });
        });


        // $(document).on("click", ".video_opener", function () {
        //     let card = $(this).closest(".card_wrapper");
        //     card.addClass("opened");

        //     let video = card.find("video").get(0); // get the raw video element

        //     if (video) {
        //         video.play();
        //     }
        // });

        $(document).on("mouseenter", ".project_img", function () {
            let card = $(this).closest(".card_wrapper");
            card.addClass("video_resumed");

            let video = card.find("video").get(0);
            if (video) {
                video.currentTime = 0; // restart from beginning (optional)
                video.play();
            }
        });

        $(document).on("mouseleave", ".project_img", function () {
            let card = $(this).closest(".card_wrapper");
            card.removeClass("video_resumed");

            let video = card.find("video").get(0);
            if (video) {
                video.pause();
            }
        });



        // hide_popup
        $(document).on("click", ".hide_popup", function () {
            let card = $(this).closest(".card_wrapper");
            let video = card.find("video").get(0);
            card.removeClass("opened");
            if (video) {
                video.pause();
            }
        });


        // news_slider
        new Swiper('.news_slider', {
            loop: true,
            spaceBetween: 0,
            slidesPerView: 'auto',
            speed: 1200,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false, 
            },
            // Navigation arrows
            navigation: {
                nextEl: '.news_area .swiper-button-next',
                prevEl: '.news_area .swiper-button-prev',
            },
            // autoplay: { delay: 4000, disableOnInteraction: false },
            a11y: true,
        });

        // blog_slider
        new Swiper('.blog_slider', {
            loop: true,
            spaceBetween: 0,
            slidesPerView: 'auto',
            speed: 1200,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false, 
            },
            // Navigation arrows
            navigation: {
                nextEl: '.blog_area .swiper-button-next',
                prevEl: '.blog_area .swiper-button-prev',
            },
            // autoplay: { delay: 4000, disableOnInteraction: false },
            a11y: true,
        });

        // popup_togle
        $(function () {
            // Open popup
            $(document).on("click", ".popup_togle", function () {
                let target = $(this).data("popup"); // get data-popup attribute

                if (target) {
                    $("#" + target).addClass("video_opened");
                }
                // If clicked inside popup (overlay or close button), close it
                else {
                    $(this).closest(".video_popup").removeClass("video_opened");
                }
            });

            // Open popup
            $(document).on("click", ".news_box.popup_togle, .blog_box.popup_togle", function () {
                let target = $(this).data("popup");

                if (target) {
                    let video = $("#" + target).find("video").get(0);
                    if (video) {
                        video.play();
                    }
                }
            });

            $(document).on("click", ".popup_togle.close_popup, .hide_overlay.popup_togle", function () {
                let target = $(this).data("popup");

                if (target) {
                    let video = $("#" + target).find("video").get(0);
                    if (video) {
                        video.pause();
                    }
                }
            });

        });


        // ScrollSpy
        var headerHeight = $('.site_header:visible').outerHeight() || $('.fixed-top:visible').outerHeight() || 0;
        $('.main_menu').scrollSpy({
            linkSelector: '.menu_link',
            offset: headerHeight,
            activeClass: 'active'
        });

        // AOS
        AOS.init({
            duration: 800,
            offset: 120,
            easing: 'ease-in-out',
            once: true,
            // disable: 'mobile' 
        });


        // ================= asib khan ======================= //

        // data bg color
        $("[data-bg-color]").each(function () {
            $(this).css("background-color", $(this).attr("data-bg-color"))
        })
        // data color
        $("[data-color]").each(function () {
            $(this).css("color", $(this).attr("data-color"))
        })

        new Swiper(".band-icon-slider-active", {
            slidesPerView: 1,
            speed: 1200,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false, 
            },
            navigation: {
                prevEl: ".band-arrow-prev",
                nextEl: ".band-arrow-next",
            },

            pagination: {
                el: ".band_swiper_pagination",
                clickable: true,
            },
        });
        new Swiper(".testimonial-slider-active", {
            speed: 1200,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false, 
            },
            slidesPerView: 1,
            navigation: {
                prevEl: ".testimonial-arrow-prev",
                nextEl: ".testimonial-arrow-next",
            },
        });



    });

})(jQuery);
