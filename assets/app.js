/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./mix/app.js":
/*!********************!*\
  !*** ./mix/app.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports) {

    Shopify.money_format = "£{{amount}}";

    Shopify.formatMoney = function (cents, format) {
      if (typeof cents == 'string') {
        cents = cents.replace('.', '');
      }

      var value = '';
      var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
      var formatString = format || this.money_format;

      function defaultOption(opt, def) {
        return typeof opt == 'undefined' ? def : opt;
      }

      function formatWithDelimiters(number, precision, thousands, decimal) {
        precision = defaultOption(precision, 2);
        thousands = defaultOption(thousands, ',');
        decimal = defaultOption(decimal, '.');

        if (isNaN(number) || number == null) {
          return 0;
        }

        number = (number / 100.0).toFixed(precision);
        var parts = number.split('.'),
            dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
            cents = parts[1] ? decimal + parts[1] : '';
        return dollars + cents;
      }

      switch (formatString.match(placeholderRegex)[1]) {
        case 'amount':
          value = formatWithDelimiters(cents, 2);
          break;

        case 'amount_no_decimals':
          value = formatWithDelimiters(cents, 0);
          break;

        case 'amount_with_comma_separator':
          value = formatWithDelimiters(cents, 2, '.', ',');
          break;

        case 'amount_no_decimals_with_comma_separator':
          value = formatWithDelimiters(cents, 0, '.', ',');
          break;
      }

      return formatString.replace(placeholderRegex, value);
    };

    $(function () {
      /*
       * Header
       */
      $('.js-toggle-mobile-menu').click(function (e) {
        $('.js-mobile-screen').toggleClass('hidden');
      });
      /*
       * Misc
       */

      $('.js-slick').slick({
        slidesToShow: 3,
        nextArrow: '<button type="button" class="slick-next"><i class="fal fa-chevron-right"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="fal fa-chevron-left"></i></button>'
      });
      $('.js-related-carousel').slick({
        slidesToShow: 2,
        nextArrow: '<button type="button" class="slick-next"><i class="fal fa-chevron-right"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="fal fa-chevron-left"></i></button>',
        responsive: [{
          breakpoint: 1280,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }, {
          breakpoint: 1024,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        }]
      });
      $('.js-popup-carousel').slick({
        slidesToShow: 2,
        nextArrow: '<button type="button" class="slick-next"><i class="fal fa-chevron-right"></i></button>',
        prevArrow: '<button type="button" class="slick-prev"><i class="fal fa-chevron-left"></i></button>'
      });

      if ($(window).width() < 1024) {
        $('.js-wide-row-carousel').slick({
          "dots": true,
          "nav": false,
          "arrows": false,
          "autoplay": true,
          "autoplaySpeed": 3000
        });
        $('.js-related-products-carousel').slick({
          "slidesToShow": 2,
          nextArrow: '<button type="button" class="slick-next"><i class="fal fa-chevron-right"></i></button>',
          prevArrow: '<button type="button" class="slick-prev"><i class="fal fa-chevron-left"></i></button>'
        });
      }

      $('.js-faq-category').on('click', function (e) {
        e.preventDefault()

        
        if ($(this).hasClass('active')) {
          return false;
        }

        $('.js-faq-category.active').find('i').first().toggleClass('fa-chevron-right fa-arrow-right');
        $('.js-faq-category.active').toggleClass('bg-black text-white active hover:text-pink hover:border-pink');
        $(this).find('i').first().toggleClass('fa-chevron-right fa-arrow-right');
        $(this).toggleClass('bg-black text-white active hover:text-pink hover:border-pink');
        $('.js-faq-container').addClass('hidden');
        var category = $(this).data('type');
        $('.js-faq-container').filter(function () {
          return $(this).data('type') == category;
        }).removeClass('hidden');
      });
      $('.js-faq').on('click', function () {
        $(this).parent().find('.js-answer').toggleClass('hidden');
        $(this).find('i').toggleClass('fa-plus fa-minus');
      });
      $('.js-add-to-cart').on('submit', function (e) {
        e.preventDefault(); // var image = $(this).closest('.flex.flex-col').find('img').attr('src');

        console.log("adding to cart");
        var quantity = 1;

        if ($(this).find('input[name=quantity]').length) {
          quantity = $(this).find('input[name=quantity]').val();
        }

        let id = null;
        const thisInput = this.querySelector('input[name=id]');
        const thisSelect = this.querySelector('select[name=id]');

        if (thisInput) {
          id = thisInput.value;
        } else {
          id = thisSelect.value;
        }

        $.post('/cart/add.js', {
          items: [{
            id: id,
            quantity: quantity
          }]
        }, function (response) {
          $('.js-cart-popup-items').empty();
          $('.js-cart-popup-items').append('<div class=""><img class="w-full" src="' + response.items[0].featured_image.url + '"><p class="mt-0 mb-1 text-base font-bold mb-8">' + response.items[0].product_title + '</p></div>');
          displayCartPopup();
        }, 'json');
        return false;
      });

      function displayCartPopup() {
        $.get('/cart.js', function (data) {
          console.log(data);
          $('.js-cart-count').text('(' + data.items.length + ')');
          $('.js-popup-carousel').slick('slickUnfilter');
          $('.js-popup-carousel').slick('slickFilter', function (index, slide) {
            console.log(index + 'index');
            console.log(slide + 'slide');
            return !data.items.map(function (prod) {
              return prod.product_id;
            }).includes($(slide).data('product'));
          });
        }, 'json');
        $('.js-cart-popup-cover').removeClass('pointer-events-none opacity-0');
        $('.cart-popup').toggleClass('left-[-300px] left-0');
      }

      $('.js-cart-popup-cover').on('click', function (e) {
        if ($(e.target).hasClass('js-cart-popup-cover') || $(e.target).hasClass('js-close-cart-popup')) {
          e.preventDefault();
          $('.js-cart-popup-cover').addClass('pointer-events-none opacity-0');
          $('.cart-popup').toggleClass('left-[-300px] left-0');
        }
      });
      /*
       * Cart
       */

      $('.js-remove-item').on('click', function () {
        var id = $(this).closest('tr').data('line-id');
        updateLineItem(0, id, this);
      });
      $('.js-search').on('click', function () {
        $(this).closest('form').find('input').focus();
      });
      $('.js-quantity').on('click', function () {
        console.log($(this).data('modifier'));
        console.log($('.js-quantity-input').val());
        $('.js-quantity-input').val(Math.max(1, Number($('.js-quantity-input').val()) + Number($(this).data('modifier'))));
      });
      $('.js-update-quantity').on('click', function () {
        $(this).closest('table').addClass('quantity-updating');
        var q = $(this).parent().find('.js-quantity').text();
        var id = $(this).closest('tr').data('line-id');
        q = Number(q) + $(this).data('amount');
        updateLineItem(q, id, this);
      });
      $('.js-update-main-image').on('click', function () {
        $('.product-carousel').slick('slickGoTo', $(this).data('img') - 2);
      });
      $(document).on('mouseover', '.js-show-subscription-info', function () {
        $('.js-subscription-tooltip').removeClass('opacity-0');
      });
      $(document).on('mouseleave', '.js-show-subscription-info', function () {
        $('.js-subscription-tooltip').addClass('opacity-0');
      });
      var addToCartBannerVisible = false;

      if ($('.js-add-to-cart-banner').length > 0) {
        $(window).on('scroll', function () {
          if ($(window).scrollTop() > $('#add_to_cart_button').offset().top) {
            if (!addToCartBannerVisible) {
              $('.js-add-to-cart-banner').removeClass('-bottom-20').addClass('bottom-0');
              addToCartBannerVisible = true;
            }
          } else {
            if (addToCartBannerVisible) {
              $('.js-add-to-cart-banner').removeClass('bottom-0').addClass('-bottom-20');
              addToCartBannerVisible = false;
            }
          }
        });
      }

      if ($('.js-bought-today').length > 0) {
        var date = new Date();
        var time = date.getTime();
        date.setUTCHours(0, 0, 0, 0);
        var dayStartTime = date.getTime();
        date.setUTCHours(23, 59, 59, 999);
        var dayEndTime = date.getTime();
        var percentOfDay = (time - dayStartTime) / (dayEndTime - dayStartTime);
        var bought_today = Math.ceil(percentOfDay * Number(bought_per_day - min_bought_per_day)) + Number(min_bought_per_day);
        $('.js-bought-today').text(bought_today);
      }

      function updateLineItem(q, id, self) {
        $.post('/cart/change.js', {
          'id': id,
          'quantity': q
        }, function (data) {
          var line_item = data.items.filter(function (item) {
            return item.id == id;
          });

          if (!line_item.length) {
            $(self).closest('tr').remove(); // TODO check whether all are gone, and then display empty cart text
          } else {
            $(self).parent().find('.js-quantity').text(line_item[0].quantity);
            $(self).closest('tr').find('.js-line-total').html(Shopify.formatMoney(line_item[0].line_price));
          }

          $('table.quantity-updating').removeClass('quantity-updating');

          if (!$('.table tbody td').length) {
            window.location.reload();
          }

          $('.js-total').html(Shopify.formatMoney(data.items_subtotal_price));
        }, 'json');
      }
    });

    /***/ }),

    /***/ "./mix/app.scss":
    /*!**********************!*\
      !*** ./mix/app.scss ***!
      \**********************/
    /*! no static exports found */
    /***/ (function(module, exports) {

    // removed by extract-text-webpack-plugin

    /***/ }),

    /***/ 0:
    /*!*****************************************!*\
      !*** multi ./mix/app.js ./mix/app.scss ***!
      \*****************************************/
    /*! no static exports found */
    /***/ (function(module, exports, __webpack_require__) {

    __webpack_require__(/*! C:\ShopifyWebsites\plumpit\mix\app.js */"./mix/app.js");
    module.exports = __webpack_require__(/*! C:\ShopifyWebsites\plumpit\mix\app.scss */"./mix/app.scss");


    /***/ })

    /******/ });
