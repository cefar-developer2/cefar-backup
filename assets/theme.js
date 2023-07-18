window.theme = window.theme || {};

theme.icons = {
  left: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
  right: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
  close: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>',
  chevronLeft: '<svg fill="#000000" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M 14.51,6.51 14,6 8,12 14,18 14.51,17.49 9.03,12 Z"></path></svg>',
  chevronRight: '<svg fill="#000000" viewBox="0 0 24 24" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M 10,6 9.49,6.51 14.97,12 9.49,17.49 10,18 16,12 Z"></path></svg>',
  chevronDown: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/><path d="M0-.75h24v24H0z" fill="none"/></svg>',
  tick: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
};

theme.Sections = new function(){
  var _ = this;
  
  var sections = [];
  var instances = [];
  
  _.init = function(){
    $(document).on('shopify:section:load', function(e){
      // load a new section
      var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
      if(target) {
        _.sectionLoad(target);
      }
    }).on('shopify:section:unload', function(e){
      // unload existing section
      var target = _._themeSectionTargetFromShopifySectionTarget(e.target);
      if(target) {
        _.sectionUnload(target);
      }
    });
  }
  
  // register a type of section
  _.register = function(type, section){
    sections.push({ type: type, section: section });
    $('[data-section-type="'+type+'"]').each(function(){
      _.sectionLoad(this);
    });
  }
  
  // load in a section
  _.sectionLoad = function(target){
    var target = target;
    var section = _._sectionForTarget(target);
    if(section !== false) {
      instances.push({
        target: target,
        section: section
      });
      section.onSectionLoad(target);
      $(target).on('shopify:block:select', function(e){
        _._callWith(section, 'onBlockSelect', e.target);
      }).on('shopify:block:deselect', function(e){
        _._callWith(section, 'onBlockDeselect', e.target);
      });
    }
  }
  
  // unload a section
  _.sectionUnload = function(target){
    var instanceIndex = -1;
    for(var i=0; i<instances.length; i++) {
      if(instances[i].target == target) {
        instanceIndex = i;
      }
    }
    if(instanceIndex > -1) {
      $(target).off('shopify:block:select shopify:block:deselect');
      _._callWith(instances[instanceIndex].section, 'onSectionUnload', target);
      instances.splice(instanceIndex);
    }
  }
  
  // helpers
  _._callWith = function(object, method, param) {
    if(typeof object[method] === 'function') {
      object[method](param);
    }
  }
  
  _._themeSectionTargetFromShopifySectionTarget = function(target){
    var $target = $('[data-section-type]:first', target);
    if($target.length > 0) {
      return $target[0];
    } else {
      return false;
    }
  }
  
  _._sectionForTarget = function(target) {
    var type = $(target).attr('data-section-type');
    for(var i=0; i<sections.length; i++) {
      if(sections[i].type == type) {
        return sections[i].section;
      }
    }
    return false;
  }
}

theme.ProductTemplateSection = new function(){
  this.onSectionLoad = function(target){
    theme.initToggleTargets();
    
    /// Main product dropdown
    $('select[name="id"]', target).trigger('optionate');
    
    /// Slideshows
    $('.slideshow', target).each(function(){
      $(this).slick({
        autoplay: $(this).hasClass('auto-play'),
        fade: false,
        infinite: true,
        useTransform: true,
        arrows: false,
        // prevArrow: '<button type="button" class="slick-prev">'+theme.icons.chevronLeft+'</button>',
        // nextArrow: '<button type="button" class="slick-next">'+theme.icons.chevronRight+'</button>',
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              dots: true,
              lazyLoad: $(this).find('[data-lazy]').length > 0 ? 'progressive' : null
            }
          }
        ],
        lazyLoad: $(this).find('[data-lazy]').length > 0 ? 'ondemand' : null, // to avoid loading all on desktop product page
        autoplaySpeed: 7000 // milliseconds to wait between slides
      });
    });
    
    theme.ProductBlockManager.loadImages(target);
    
    
  }
  
  this.onSectionUnload = function(target){
    $('.slick-slider', target).slick('unslick');
  }
}

theme.BlogTemplateSection = new function(){
  this.onSectionLoad = function(target){
    theme.initToggleTargets();
  }
}

theme.CartTemplateSection = new function(){
  this.onSectionLoad = function(target){
    // terms and conditions checkbox
    if($('#cartform input#terms', target).length > 0) {
      $(document).on('click.cartTemplateSection', '#cartform [name="checkout"], #additional-checkout-buttons input, a[href="/checkout"]', function() {
        if($('#cartform input#terms:checked').length == 0) {
          alert("You must agree to the terms and conditions before continuing.");
          return false;
        }
      });
    }
  }
  
  this.onSectionUnload = function(target){
    $(document).off('.cartTemplateSection');
  }
}

theme.CollectionTemplateSection = new function(){
  this.onSectionLoad = function(target){
    theme.initToggleTargets();
    
    /// Stream/grid view - saved setting
    if($('#view-as-stream, #view-as-tiles', target).length > 0 && theme.getGridStreamChoice() != null) {
      if(theme.getGridStreamChoice() == 'stream') {
        $('#view-as-stream').trigger('click');
      } else {
        $('#view-as-tiles').trigger('click');
      }
    }

    /// Stream view 
    // awaken images
    if($('.collection-listing-stream', target).length) {
      theme.awakenImagesFromSlumber($('.collection-listing-stream', target));
    }
    // process dropdowns
    $('.collection-listing-stream select[name="id"]', target).trigger('optionate');

    /// Collection sorting
    var $sortBy = $('#sort-by', target);
    if($sortBy.length > 0) {
      var queryParams = {};
      if (location.search.length) {
        for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
          aKeyValue = aCouples[i].split('=');
          if (aKeyValue.length > 1) {
            queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
          }
        }
      }
      $sortBy.val($sortBy.data('initval')).on('change', function() {
        queryParams.sort_by = $(this).val();
        location.search = $.param(queryParams);
      });
    }
    
    /// If a tag is active in a group, other tags within that group must be links to that tag only, within that group.
    $('.multi-tag-row .tags', target).each(function(){
      var $active = $(this).find('li.active');
      $(this).find('li:not(.active) a').each(function(){
        var href = $(this).attr('href');
        $active.each(function(){
          var tag = $(this).data('tag');
          href = href.replace('+'+tag, '').replace(tag+'+', ''); //Collection
          href = href.replace('%2B'+tag, '').replace(tag+'%2B', ''); //Vendor
        });
        $(this).attr('href', href);
      });
    });
    
    theme.ProductBlockManager.loadImages(target);
    
    
  }
  
  this.onSectionUnload = function(target){
    $('#sort-by', target).off('change');
    
    // Clear grid/stream preference
    theme.saveGridStreamChoice(null);
  }
}

theme.SlideshowSection = new function(){
  this.onSectionLoad = function(target){
    /// Slideshows
    $('.slideshow', target).each(function(){
      $(this).slick({
        autoplay: $(this).hasClass('auto-play'),
        fade: false,
        infinite: true,
        useTransform: true,
        arrows: false,
        // prevArrow: '<button type="button" class="slick-prev">'+theme.icons.chevronLeft+'</button>',
        // nextArrow: '<button type="button" class="slick-next">'+theme.icons.chevronRight+'</button>',
        responsive: [
          {
            breakpoint: 768,
            settings: {
              arrows: false,
              dots: true,
              lazyLoad: $(this).find('[data-lazy]').length > 0 ? 'progressive' : null
            }
          }
        ],
        lazyLoad: $(this).find('[data-lazy]').length > 0 ? 'ondemand' : null, // to avoid loading all on desktop product page
        autoplaySpeed: 7000 // milliseconds to wait between slides
      });
    });
    
    theme.resizeScalingTextFromColumn(target);
  }
  
  this.onSectionUnload = function(target){
    $('.slick-slider', target).slick('unslick');
  }
  
  this.onBlockSelect = function(target){
    $(target).closest('.slick-slider')
      .slick('slickGoTo', $(target).data('slick-index'))
      .slick('slickPause');
  }
  
  this.onBlockDeselect = function(target){
    $(target).closest('.slick-slider')
      .slick('slickPlay');
  }
}

theme.InstagramSection = new function(){
  this.onSectionLoad = function(target){
    $('.willstagram:not(.willstagram-placeholder)', target).each(function(){
      var user_id = $(this).data('user_id');
      var tag = $(this).data('tag');
      var access_token = $(this).data('access_token');
      var count = $(this).data('count') || 10;
      var $willstagram = $(this);
      var url = '';
      if(typeof user_id != 'undefined') {
        url = 'https://api.instagram.com/v1/users/' + user_id + '/media/recent?count='+count;
      } else if(typeof tag != 'undefined') {
        url = 'https://api.instagram.com/v1/tags/' + tag + '/media/recent?count='+count;
      }
      $.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: url
        + (typeof access_token == 'undefined'? '' : ('&access_token='+access_token)),
        success: function(res) {
          if(typeof res.data != 'undefined') {
            var $itemContainer = $('<div class="items">').appendTo($willstagram);
            var limit = Math.min(20, res.data.length);
            for(var i = 0; i < limit; i++) {
              var photo_url = res.data[i].images.low_resolution.url.replace('http:', '');
              var link = res.data[i].link;
              var caption = res.data[i].caption != null ? res.data[i].caption.text : '';
              $itemContainer.append('<div class="item"><a target="_blank" href="'+link+'"><img src="'+photo_url+'" /></a><div class="desc">'+caption+'</div></div>');
            }
            $willstagram.trigger('loaded.willstagram');
          } else if(typeof res.meta !== 'undefined' && typeof res.meta.error_message !== 'undefined') {
            $willstagram.append('<div class="willstagram__error">'+res.meta.error_message+'</div>');
          }
      	}
      });
    });
    
    $('.willstagram-placeholder', target).trigger('loaded.willstagram');
  }
}

// Lightbox
theme.fbOpts = { overlayColor: '#fff', padding: 1, margin: 60, overlayOpacity: 0.9 };

// Loading third party scripts
theme.scriptsLoaded = [];
theme.loadScriptOnce = function(src, callback) {
  if(theme.scriptsLoaded.indexOf(src) < 0) {
    theme.scriptsLoaded.push(src);
    var tag = document.createElement('script');
    tag.src = src;
    
    if(typeof callback == 'function') {
      if (tag.readyState) { // IE, incl. IE9
        tag.onreadystatechange = function() {
          if (tag.readyState == "loaded" || tag.readyState == "complete") {
            tag.onreadystatechange = null;
            callback();
          }
        };
      } else {
        tag.onload = function() { // Other browsers
          callback();
        };
      }
    }
    
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    return true;
  } else {
    if(typeof callback == 'function') {
      callback();
    }
    return false;
  }
}

// Manage videos
theme.VideoManager = new function(){
  var _ = this;
  
  // Youtube
  _.youtubeVars = {
    incrementor: 0,
    apiReady: false,
    videoData: {},
    toProcessSelector: '.video-container[data-video-type="youtube"]:not(.video--init)'
  };
  
  _.youtubeApiReady = function() {
    _.youtubeVars.apiReady = true;
    _._loadYoutubeVideos();
  }
  
  _._loadYoutubeVideos = function(container) {
    if($(_.youtubeVars.toProcessSelector, container).length) {
      if(_.youtubeVars.apiReady) {
        // play those videos
        $(_.youtubeVars.toProcessSelector, container).addClass('video--init').each(function(){
          _.youtubeVars.incrementor++;
          var containerId = 'theme-yt-video-'+_.youtubeVars.incrementor;
          var videoElement = $('<div>').attr('id', containerId).appendTo(this);
          var player = new YT.Player(containerId, {
            height: '390',
            width: '640',
            videoId: $(this).data('video-id'),
            playerVars: {
              iv_load_policy: 3,
              modestbranding: 1,
              autoplay: !!$(this).data('video-autoplay') ? 1 : 0,
              rel: 0
            },
            events: {
              onReady: _._onYoutubePlayerReady,
              onStateChange: _._onYoutubePlayerStateChange
            }
          });
          _.youtubeVars.videoData[player.h.id] = {
            id: containerId,
            container: this,
            videoElement: videoElement,
            player: player
          };
        });
      } else {
        // load api
        theme.loadScriptOnce('https://www.youtube.com/iframe_api');
      }
    }
  }
  
  _._onYoutubePlayerReady = function(event) {
    event.target.setPlaybackQuality('hd1080');
  }
       
  _._onYoutubePlayerStateChange = function(event) {
  }
    
  _._getYoutubeVideoData = function(event) {
    return _.youtubeVars.videoData[event.target.h.id];
  }
  
  _._unloadYoutubeVideos = function(container) {
    for(var dataKey in _.youtubeVars.videoData) {
      var data = _.youtubeVars.videoData[dataKey];
      if($(container).find(data.container).length) {
        data.player.destroy();
        delete _.youtubeVars.videoData[dataKey];
        return;
      }
    }
  }
  
  // Vimeo
  _.vimeoVars = {
    incrementor: 0,
    apiReady: false,
    videoData: {},
    toProcessSelector: '.video-container[data-video-type="vimeo"]:not(.video--init)'
  };
  
  _.vimeoApiReady = function() {
    _.vimeoVars.apiReady = true;
    _._loadVimeoVideos();
  }
  
  _._loadVimeoVideos = function(container) {
    if($(_.vimeoVars.toProcessSelector, container).length) {
      if(_.vimeoVars.apiReady) {
        // play those videos
        $(_.vimeoVars.toProcessSelector, container).addClass('video--init').each(function(){
          _.vimeoVars.incrementor++;
          var $this = $(this);
          var containerId = 'theme-vi-video-'+_.vimeoVars.incrementor;
          var videoElement = $('<div>').attr('id', containerId).appendTo(this);
          var autoplay = !!$(this).data('video-autoplay');
          var player = new Vimeo.Player(containerId, {
            id: $(this).data('video-id'),
            width: 640,
            loop: false,
            autoplay: autoplay
          });
          player.ready().then(function(){
            if(player.element && player.element.width && player.element.height) {
              var ratio = parseInt(player.element.height) / parseInt(player.element.width);
              $this.css('padding-bottom', (ratio*100) + '%');
            }
          });
          _.vimeoVars.videoData[containerId] = {
            id: containerId,
            container: this,
            videoElement: videoElement,
            player: player,
            autoPlay: autoplay
          };
        });
      } else {
        // load api
        theme.loadScriptOnce('https://player.vimeo.com/api/player.js', function(){
          _.vimeoVars.apiReady = true;
          _._loadVimeoVideos();
        });
      }
    }
  }
  
  _._unloadVimeoVideos = function(container) {
    for(var dataKey in _.vimeoVars.videoData) {
      var data = _.vimeoVars.videoData[dataKey];
      if($(container).find(data.container).length) {
        data.player.unload();
        delete _.vimeoVars.videoData[dataKey];
        return;
      }
    }
  }
  
  // Compatibility with Sections
  this.onSectionLoad = function(container){
    _._loadYoutubeVideos(container);
    _._loadVimeoVideos(container);
  }
  
  this.onSectionUnload = function(container){
    _._unloadYoutubeVideos(container);
    _._unloadVimeoVideos(container);
  }
}

// Youtube API callback
function onYouTubeIframeAPIReady() {
  theme.VideoManager.youtubeApiReady();
}

theme.TextImageOverlaySection = new function(){
  this.onSectionLoad = function(container){
    theme.resizeScalingTextFromColumn(container);
  }
}

theme.CustomRowSection = new function(){
  this.onSectionLoad = function(container){
    theme.VideoManager.onSectionLoad(container);
    
    theme.resizeScalingTextFromColumn(container);
  }
  
  this.onSectionUnload = function(container){
    theme.VideoManager.onSectionUnload(container);
  }
}

theme.FeaturedCollectionSection = new function(){
  this.onSectionLoad = function(container){
    
    
    theme.loadCarousels(container);
    
    theme.ProductBlockManager.loadImages(container);
  }
  
  this.onSectionUnload = function(container){
    theme.unloadCarousels(container);
  }
}

theme.FeaturedCollectionsSection = new function(){
  this.onSectionLoad = function(container){
    theme.loadCarousels(container);
    
    theme.ProductBlockManager.loadImages(container);
  }
  
  this.onSectionUnload = function(container){
    theme.unloadCarousels(container);
  }
}

theme.ListCollectionsTemplateSection = new function(){
  this.onSectionLoad = function(container){
    theme.ProductBlockManager.loadImages(container);
  }
}

theme.FeaturedBlogSection = new function(){
  this.onSectionLoad = function(container){
    /// Aspect-ratio image crop
    $('[data-crop-img]', container).each(function(){
      var viewRatio = $(this).outerWidth() / $(this).outerHeight();
      var $img = $(this).find('img');
      $img.imagesLoaded(function(){
        var imgRatio = $img.width() / $img.height();
        if(imgRatio < viewRatio) {
          $img.css({
            top:  - (viewRatio / (imgRatio * 2) - 0.5) * 100 + '%',
            left: 0,
            width: '100%',
            height: 'auto',
            minWidth: '0',
            minHeight: '0',
            maxWidth: 'none',
            maxHeight: 'none'
          });
        } else {
          $img.css({
            top: 0,
            left: - (imgRatio / (viewRatio * 2) - 0.5) * 100 + '%',
            width: 'auto',
            height: '100%',
            minWidth: '0',
            minHeight: '0',
            maxWidth: 'none',
            maxHeight: 'none'
          });
        }
      });
    });
  }
}

theme.HeaderSection = new function(){
  this.onSectionLoad = function(container){
    /// Show expander plusses
    $('.multi-level-nav ul li a:not(.has-children)', container).each(function(){
      var $siblingUL = $(this).siblings('ul');
      if($siblingUL.length > 0) {
        if($siblingUL.hasClass('listed')) {
          	$(this).addClass('has-children listing-title');
        } else {
        	$(this).addClass('has-children').append('<span class="exp"><span>+</span>'+theme.icons.chevronDown+'</span>');
        }
      }
  	});
    
    /// Expand to current page
    if($('#main-nav.autoexpand', container).length) {
      theme.recursiveNavClicker();
    }
  }
}

// Manage option dropdowns
theme.OptionManager = new function(){
  var _ = this;

  _.selectors = {
    container: '.product-detail',
    gallery: '.gallery',
    priceArea: '.price-area',
    submitButton: 'input[type=submit], button[type=submit]',
    multiOption: '.option-selectors'
  };
  
  _.strings = {
    priceNonExistent: "Unavailable",
    priceSoldOut: '[PRICE] <span class="productlabel soldout"><span>'+"Sold Out"+'</span></span>',
    buttonDefault: "Add to Cart",
    buttonNoStock: "Out of stock",
    buttonNoVariant: "Unavailable"
  };
  
  _._getString = function(key, variant){
    var string = _.strings[key];
    if(variant) {
      string = string.replace('[PRICE]', Shopify.formatMoney(variant.price, theme.money_format));
    }
    return string;
  }
  
  _.getProductData = function($form) {
    return theme.productData[$form.data('product-id')];
  }
  
  	function getSearchParameters() 
  	{ 
    	var prmstr = window.location.search.substr(1);
    
      	return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : "";
	}

	function transformToAssocArray(prmstr) 
  	{
        var additional_params = "";
      
        var prmarr = prmstr.split("&");
      
      	if (prmstr.length > 0)
        {
            for ( var i = 0; i < prmarr.length; i++) 
            {
                var tmparr = prmarr[i].split("=");

                if (tmparr[0] != 'variant')
                {
                    additional_params += "&" + prmarr[i];
                }
            }
        }
      
        return additional_params;
	}
  
  	_.addVariantUrlToHistory = function(variant) 
  	{
    	if (variant) 
        {
      		var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
      
			var search_parameters = getSearchParameters();
      
          	if (search_parameters != "")
            {
      			newurl += search_parameters;
            }
      
      		window.history.replaceState({path: newurl}, '', newurl);
    	}
  	}
  
  
  _.updateSku = function(variant, $container){
    $container.find('.sku .sku__value').html( variant ? variant.sku : '' );
    $container.find('.sku').toggleClass('sku--no-sku', !variant || !variant.sku);
  }
  
  _.updateBarcode = function(variant, $container){
    $container.find('.barcode .barcode__value').html( variant ? variant.barcode : '' );
    $container.find('.barcode').toggleClass('barcode--no-barcode', !variant || !variant.barcode);
  }
  
  _.updateBackorder = function(variant, $container){
    var $backorder = $container.find('.backorder');
    if($backorder.length) {
      if (variant.available) {
        if (variant.inventory_management && variant.inventory_quantity <= 0) {
          var productData = _.getProductData($backorder.closest('form'));
          $backorder.find('.selected-variant').html(productData.title + (variant.title.indexOf('Default') >= 0 ? '' : ' - '+variant.title) );
          $backorder.show();
        } else {
          $backorder.hide();
        }
      } else {
        $backorder.hide();
      }
    }
  }
  
  _.updatePrice = function(variant, $container) {
    var $priceArea = $container.find(_.selectors.priceArea);
    $priceArea.removeClass('on-sale');
    
    if(variant && variant.available == true) {
      var $newPriceArea = $('<div>');
      if(variant.compare_at_price > variant.price) {
        $('<span class="was-price">').html(Shopify.formatMoney(variant.compare_at_price, theme.money_format)).appendTo($newPriceArea);
        $newPriceArea.append(' ');
        $priceArea.addClass('on-sale');
      }
      $('<span class="current-price">').html(Shopify.formatMoney(variant.price, theme.money_format)).appendTo($newPriceArea);
      $priceArea.html($newPriceArea.html());
    } else {
      if(variant) {
        $priceArea.html(_._getString('priceSoldOut', variant));
      } else {
        $priceArea.html(_._getString('priceNonExistent', variant));
      }
    }
  }
  
  _._updateButtonText = function($button, string, variant) {
    $button.each(function(){
      var newVal;
      newVal = _._getString('button' + string, variant);
      if(newVal !== false) {
        if($(this).is('input')) {
          $(this).val(newVal);
        } else {
          $(this).html(newVal);
        }
      }
    });
  }
  
  _.updateButtons = function(variant, $container) {
    var $button = $container.find(_.selectors.submitButton);
    
    if(variant && variant.available == true) {
      $button.removeAttr('disabled');
      _._updateButtonText($button, 'Default', variant);
    } else {
      $button.attr('disabled', 'disabled');
      if(variant) {
        _._updateButtonText($button, 'NoStock', variant);
      } else {
        _._updateButtonText($button, 'NoVariant', variant);
      }
    }
  }
  
  _.initProductOptions = function(originalSelect) {
    $(originalSelect).not('.theme-init').addClass('theme-init').each(function(){
      var $originalSelect = $(this);
      var productData = _.getProductData($originalSelect.closest('form'));
      
      // change state for original dropdown
      $originalSelect.on('change', function(e, variant){
        if($(this).is('input[type=radio]:not(:checked)')) {
          return; // handle radios - only update for checked
        }
        var variant = variant;
        if(!variant && variant !== false) {
          for(var i=0; i<productData.variants.length; i++) {
            if(productData.variants[i].id == $(this).val()) {
              variant = productData.variants[i];
            }
          }
        }
        var $container = $(this).closest(_.selectors.container);
        
        // update price
        _.updatePrice(variant, $container);
        
        // update buttons
        _.updateButtons(variant, $container);

        // variant images
        if (variant && variant.featured_image) {
          $container.find(_.selectors.gallery).trigger('variantImageSelected', variant);
        }

        // extra details
        _.updateBarcode(variant, $container);
        _.updateSku(variant, $container);
        _.updateBackorder(variant, $container);

        // variant urls
        var $form = $(this).closest('form');
        if($form.data('enable-history-state')) {
          _.addVariantUrlToHistory(variant);
        }

        // multi-currency
        if(typeof Currency != 'undefined' && typeof Currency.convertAll != 'undefined' && $('[name=currencies]').length) {
          Currency.convertAll(shopCurrency, $('[name=currencies]').first().val());
          $('.selected-currency').text(Currency.currentCurrency);
        }
      });

      // split-options wrapper
      $originalSelect.closest(_.selectors.container).find(_.selectors.multiOption).on('change', 'select', function(){
        var selectedOptions = [];
        $(this).closest(_.selectors.multiOption).find('select').each(function(){
          selectedOptions.push($(this).val());
        });
        // find variant
        var variant = false;
        for(var i=0; i<productData.variants.length; i++) {
          var v = productData.variants[i];
          var matches = true;
          for(var j=0; j<selectedOptions.length; j++) {
            if(v.options.indexOf(selectedOptions[j]) < 0) {
              matches = false;
            }
          }
          if(matches) {
            variant = v;
            break;
          }
        }
        // trigger change
        if(variant) {
          $originalSelect.val(variant.id);
        }
        $originalSelect.trigger('change', variant);
      });
      
      // first-run
      $originalSelect.trigger('change');
    });
  }
}

theme.loadCarousels = function(container) {
  /// Carousels
  $('.carousel', container).each(function(){
    var $this = $(this);
    $this.closest('.collection-slider').on('click.themeCarousel', '.prev, .next', function(e){
      e.preventDefault();
      var carousel = $(this).closest('.collection-slider').find('.owl-carousel').data('owlCarousel');
      if($(this).hasClass('prev')) {
        carousel.prev();
      } else {
        carousel.next();
      }
    });
    var carouselOptions;
    if($(this).hasClass('fixed-mode')) {
      carouselOptions = {
        margin: 16,
        loop: false,
        autoWidth: false,
        items: 5,
        center: false,
        nav: false,
        dots: false,
        responsive: {
          0: {
            items: 2
          },
          480: {
            items: 3
          },
          767: {
            items: 4
          },
          1000: {
            items: 5
          }
        }
      };
    } else {
      carouselOptions = {
        margin: 0,
        loop: true,
        autoWidth: true,
        items: 4,
        center: true,
        nav: false,
        dots: false
      };
    }
    var loadCarousel = function(){
      $this.on('initialized.owl.carousel', function(){
        // ensure clones are processed from scratch
        theme.ProductBlockManager.loadImages($this.closest('[data-section-type]'));
        // recalculate widths, after the above's async calls
        setTimeout(function(){
          $this.data('owlCarousel')._invalidated.width = true;
          $this.trigger('refresh.owl.carousel');
        }, 10);
      });
      $this.on('initialized.owl.carousel resized.owl.carousel', function(){
        setTimeout(function(){
          // fixes
          var currentWidth = $this.find('.owl-stage').width();
          if(currentWidth > $this.width()) {
            $this.find('.owl-stage').css({
              width: currentWidth + 40, // fix rounding error
              paddingLeft: '',
              margin: ''
            });
          } else {
            // centre-align using css, if not full
            $this.find('.owl-stage').css({
              width: currentWidth + 40, // fix rounding error
              paddingLeft: 40, // offset rounding error fix
              margin: '0 auto',
              transform: ''
            });
          }
        }, 10);
      }).owlCarousel(carouselOptions);
    };
    if($this.find('img').length) {
      $this.imagesLoaded(loadCarousel);
    } else {
      loadCarousel();
    }
  });
}

theme.unloadCarousels = function(container) {
  $('.collection-slider', container).off('.themeCarousel');
  $('.slick-slider', container).slick('unslick');
}

/// Text that scales down - scale it up/down based on column width
theme.resizeScalingTextFromColumn = function(container) {
  var container = container;
  if(typeof container === 'undefined') {
    container = $('body');
  }
  $('.scaled-text', container).each(function(){
    var $base = $(this).closest('.scaled-text-base');
    var naturalContainerWidth = 1080,
        mult = 1;
    if($base.data('scaled-text-multiplier')) {
      mult = parseFloat($base.data('scaled-text-multiplier'));
    }
    var scale = mult * $base.width() / naturalContainerWidth; // largest container size
    $(this).css('font-size', (scale * 100) + '%');
  });
};

// run asap
theme.resizeScalingTextFromColumn();


    
// Show a quick generic text popup above an element
theme.showQuickPopup = function(message, $origin){
  var $popup = $('<div>').addClass('simple-popup');
  var offs = $origin.offset();
  $popup.html(message).css({ 'left':offs.left, 'top':offs.top }).hide();
  $('body').append($popup);
  $popup.css('margin-top', - $popup.outerHeight() - 10);
  $popup.fadeIn(200).delay(3500).fadeOut(400, function(){
    $(this).remove();
  });
};

theme.saveGridStreamChoice = function(type) {
  var cfg = { expires:1, path:'/', domain:window.location.hostname };
  $.cookie('gridstream', type, cfg);
}

theme.getGridStreamChoice = function() {
  return $.cookie('gridstream');
}

// Enables any images inside a container
theme.awakenImagesFromSlumber = function($cont) {
  $cont.find('img[data-src]').each(function(){
    $(this).replaceImageWithOneOfNewSrc($(this).data('src'));
  });
};

// Sort out expanded nav. Recursively.
theme.recursiveNavClicker = function(sanity) {
  if(typeof sanity == 'undefined') {
    sanity = 0;
  }
  var $topLI = $('#main-nav.autoexpand > .multi-level-nav > div:last > ul > li:has(.active)').first();
  if($topLI.length > 0) {
    var $child = $topLI.children('a');
    if(!$child.hasClass('expanded')) {
      $child.trigger('clickinstant');
      if(sanity < 100) {
        theme.recursiveNavClicker(sanity + 1);
      }
    }
  }
  return false;
}

// Process product block layout
theme.ProductBlockManager = new function(){
  var _ = this;
  
  _.loadImages = function(container){
    var container = container;
    if(typeof container === 'undefined') {
      container = $('body');
    }
    
    // Load in images
    $('.product-block', container).each(function(){
      var $cont = $(this);
      var $img = $(this).find('.image-cont img');
      if($img.length == 0) {
        $cont.addClass('main-image-loaded');
      } else {
        $img.imagesLoaded(function(obj){
          $cont.addClass('main-image-loaded');
        });
      }
    });
    
    // Once all images are loaded, check on alignment
    $('.product-block', container).imagesLoaded(function(){
      _.afterImagesResized(container);
    });
  }
  
  _.afterImagesResized = function(container){
    var container = container;
    if(typeof container === 'undefined') {
      container = $('body');
    }
    
    // Titles must not get wider than image, when in variable-width mode
    $('.product-block.main-image-loaded:not(.fixed-width):not(.onboarding)').each(function(){
      var w = $('.image-cont img', this).width() - 10; // matches margin on parent
      var $inner = $('.product-info .inner', this);
      if($inner.width() != w && w > 140) { // usable min, and catch load err
        $inner.width(w);
        $(this).closest('.owl-carousel').trigger('refresh.owl.carousel resize.owl.carousel');
      }
    });
    
    // All titles must line up
    $('.collection-listing .product-list', container).each(function(){
      if($(window).width() >= 768 || $(this).closest('.carousel').length > 0 ) {
        var tallest = 0;
        $(this).find('.product-block.detail-mode-permanent .image-cont img').each(function(){
          if($(this).height() > tallest) tallest = $(this).height();
        });
        $(this).find('.product-block.detail-mode-permanent .image-cont').css('min-height', tallest);
      } else {
        $(this).find('.product-block.detail-mode-permanent .image-cont').css('min-height', '');
      }
    });

    // All product blocks must be the same height, for quick-buy alignment
    $('.collection-listing .product-list', container).each(function(){
      if($(window).width() >= 768 || $(this).closest('.carousel').length > 0 ) {
        var tallest = 0;
        $(this).find('.product-block .block-inner .product-link').each(function(){
          if($(this).height() > tallest) tallest = $(this).height();
        });
        $(this).find('.product-block .block-inner').css('min-height', tallest);
      } else {
        $(this).find('.product-block .block-inner').css('min-height', '');
      }
    });
  }
}

theme.initToggleTargets = function(container) {
  $('a[data-toggle-target]:not(.toggle-init)', container).addClass('toggle-init').each(function(){
    var $target = $($(this).data('toggle-target'));
    $(this).find('.state').html( ($target.is(':visible') && !$target.hasClass('height-hidden')) ? '-' : '+' );
  });
}

// dom ready
$(function($){
  var $ = $; // keep this ref local

  //Return elements that have an ancestor/parent matching the supplied selector
  $.fn.hasAncestor = function(a) {
    return this.filter(function() {
      return $(this).closest(a).length > 0;
    });
  };

  //Side up and remove
  $.fn.slideUpAndRemove = function(speed){
    if(typeof speed == 'undefined') speed = 200;
    $(this).each(function(){
      $(this).slideUp(speed, function(){
        $(this).remove();
      });
    });
  }

  //Fade out image, replace src, fade back in when loaded
  $.fn.fadeToAnotherImage = function(newSrc, callback){
    var $img = $(this);
    if($img.attr('src') != newSrc) {
      $img.animate({opacity:0}, 200, function(){
        var oldHeight = $img.height();
        $img = $img.replaceImageWithOneOfNewSrc(newSrc);
        $img.css({ height: oldHeight, display: 'block' }); //Placeholder height until loaded. d:b required for occupying space in FF
        $img.imagesLoaded(function(){
          $img.css({height: '', display: ''}); //Revert to natural height
          $img.animate({opacity:1}, 200);
          if(callback) callback($img);
        });
      });
    }
    return $img;
  }

  $.fn.replaceImageWithOneOfNewSrc = function(newSrc) {
    //Used in a few places to avoid blank.gif breaking imagesLoaded
    var newTag = $(this).clone().wrap('<div />').parent().html();
    newTag = newTag.replace(/(src=")([^"]*)/gi, "$1" + newSrc);
    var $newTag = $(newTag);
    $(this).after($newTag).remove();
    return $newTag;
  }

  /// Reusable function to expand/contract a div
  $(document).on('click', 'a[data-toggle-target]', function(e){
    var $target = $($(this).data('toggle-target'));
    if($target.hasClass('height-hidden')) {
      $target.hide().removeClass('height-hidden');
    }
    $(this).find('.state').html( $target.is(':visible') ? '+' : '-' );
    $target.slideToggle(200);
    e.preventDefault();
  });

  //Redirect dropdowns
  $(document).on('change', 'select.navdrop', function(){
    window.location = $(this).val();
  });

  //General purpose lightbox
  $('a[rel="fancybox"]').fancybox($.extend({}, theme.fbOpts, { titleShow: false }));

  /// NAV

  //Handle expanding nav
  $(document).on('click clickinstant', '.multi-level-nav a.has-children', function(e){
    var navAnimSpeed = 200;
    if(e.type == 'clickinstant') {
      navAnimSpeed = 0;
    }
      
    //Mobile main nav?
    if($(this).closest('#main-nav').length == 1 && $('#main-nav').css('position') == 'fixed') {
      if($(this).parent().hasClass('mobile-expanded')) {
        $(this).siblings('ul').slideUp(navAnimSpeed, function(){
          $(this).css('display','').parent().removeClass('mobile-expanded');
        });

      } else {
        $(this).siblings('ul').slideDown(navAnimSpeed, function(){
          $(this).css('display','');
        }).parent().addClass('mobile-expanded');
      }
    } else {
      //Large menu
      //Not for list titles
      if($(this).hasClass('listing-title')) return true;

      //Set some useful vars
      var $tierEl = $(this).closest('[class^="tier-"]');
      var $tierCont = $tierEl.parent();
      var targetTierNum = parseInt($tierEl.attr('class').split('-')[1]) + 1;
      var targetTierClass = 'tier-' + targetTierNum;
      var $targetTierEl = $tierCont.children('.' + targetTierClass);

      ///Remove nav for all tiers higher than this one
      $tierCont.children().each(function(){
        if(parseInt($(this).attr('class').split('-')[1]) >= targetTierNum) {
          $(this).slideUpAndRemove(navAnimSpeed);
        }
      });

      //Are we expanding or collapsing
      if($(this).hasClass('expanded')) {
        //Collapsing. Reset state
        $(this).removeClass('expanded').find('.exp span').html('+');
      } else {
        ///Show nav
        //Reset other nav items at this level
        $tierEl.find('a.expanded').removeClass('expanded').find('.exp span').html('+');
        //If next tier div doesn't exist, make it
        if($targetTierEl.length == 0) {
          $targetTierEl = $('<div />').addClass(targetTierClass).appendTo($tierCont).hide();
        }
        $targetTierEl.empty().stop().append($(this).siblings('ul').clone().attr('style','')).slideDown(navAnimSpeed, function(){
          $(this).css('height', ''); //Clear height
        });
        //Mark as expanded
        $(this).addClass('expanded').find('.exp span').html('-');
      }
    }
    return false;
  });

  /// Mobile nav
  $(document).on('click', '.mobile-nav-toggle', function(e){
    e.preventDefault();
    $('body').toggleClass('reveal-mobile-nav');
    $('#main-nav div[class^="tier-"]:not(.tier-1)').remove(); //Remove any expanded rows
  });
  $('<a href="#" class="mobile-nav-toggle" id="mobile-nav-return"></a>').appendTo('body');

  //For fading in images created by js
  var imageFadeInSpeed = 300;
  function fadeInImageWhenReady($el, callback) {
    var $imgs = $el.is('img') ? $el : $el.find('img');
    $imgs.css('opacity', 0).imagesLoaded(function(){
      $imgs.animate({opacity: 1}, imageFadeInSpeed);
      if(callback) {
        callback();
      }
    });
  };


  /// View modes for collection page
  $(document).on('click', '#view-as-tiles', function(){
    if(!$(this).hasClass('active')) {
      $(this).addClass('active');
      $('#view-as-stream').removeClass('active');
      theme.saveGridStreamChoice('grid');
      var $listing = $('.collection-listing-stream').removeClass('collection-listing-stream').addClass('collection-listing');
      $(window).trigger('debouncedresize');
    }
    return false;
  });

  $(document).on('click', '#view-as-stream', function(){
    if(!$(this).hasClass('active')) {
      $(this).addClass('active');
      $('#view-as-tiles').removeClass('active');
      theme.saveGridStreamChoice('stream');
      var $listing = $('.collection-listing').removeClass('collection-listing').addClass('collection-listing-stream');
      //All images enabled in this view (do before optionate, in case it switches images)
      theme.awakenImagesFromSlumber($listing);
      //Close any open doodads & reset 'style=' styling to default
      $listing.find('.product-block').stop().each(function(){
        if($(this).hasClass('expanded')) {
          $(this).removeClass('expanded');
        }
        $(this).add($(this).find('.product-detail').stop()).removeAttr('style', '');
        $(this).find('select[name="id"]').trigger('optionate');
      });
    }
    return false;
  });

  

  /// Collection slider
  jQuery.fn.reverse = [].reverse; //Genius deserves credit: http://stackoverflow.com/questions/1394020/jquery-each-backwards


  /// Event for initialising options
  $(document).on('optionate', 'select[name="id"]', function(){
    theme.OptionManager.initProductOptions(this);
  });

  /// Galleries (inc. product page)
  $(document).on('variantImageSelected', '.gallery', function(e, data){
    // get image src
    var variantSrc = data.featured_image.src.split('?')[0].replace(/http[s]?:/, '');

    // locate matching thumbnail
    var $thumb = $(this).find('.thumbnails a[data-full-size-url^="' + variantSrc + '"]:first');

    // desktop
    $thumb.trigger('select');

    // mobile
    var $toShow = $(this).find('.mobile-slideshow .slick-slide:not(.slick-cloned) [data-full-size-url^="' + variantSrc + '"]').first().closest('.slide');
    var idx = $toShow.index('.slick-slide:not(.slick-cloned)');
    if(idx >= 0) {
      $toShow.closest('.slick-slider').slick('slickGoTo', idx);
    }
  });

  $(document).on('click select', '.gallery .thumbnails a', function(e){
    var newMainImageURL = $(this).attr('href');
    var $mainImageArea = $(this).closest('.gallery').find('.main-image');
    var $mainATag = $mainImageArea.find('a');
    //If this is a change in main image...
    if($mainATag.data('href') != $(this).data('full-size-url')) {
      //Set active class
      $(this).addClass('active').siblings().removeClass('active');
      //Set main image data - so we know which one is selected
      $mainATag.data('href', $(this).data('full-size-url'));
      //Set link if on product page - for lightbox
      if($mainATag.hasClass('shows-lightbox')) {
        $mainATag.attr('href', $(this).data('full-size-url'));
      }
      //Title tag
      $mainATag.attr('title', $(this).attr('title'));
      $mainImageArea.find('img').attr('alt', $(this).attr('title')).fadeToAnotherImage(newMainImageURL, function($img){
        $img.closest('.inner').trigger('changedsize');
      });
    }
    e.preventDefault();
  });
  
    /// Product page
    $(document).on('click', '#main-product-detail .gallery .main-image a', function(){
      
        //Create list of imgs to box, so prev/next works
        var $thumbs = $(this).closest('.gallery').find('.thumbnails');
        if($thumbs.length > 0) {
            //Create dupes, rejig, launch matching link
            var $boxObjs = $thumbs.clone();
            $('body > .t-lightbox-thumbs').remove(); //Tidy
            $boxObjs.addClass('t-lightbox-thumbs').hide().appendTo('body').find('a').each(function(){
                $(this).attr('href', $(this).attr('data-full-size-url'));
            }).attr('rel', 'gallery').fancybox($.extend({}, theme.fbOpts, { cyclic: true })).filter('[href="' + $(this).attr('href') + '"]').trigger('click');
        } else {
            //Create dupe of self and launch - thumbs may be hidden
            $(this).clone().fancybox($.extend({}, theme.fbOpts, { cyclic: true })).trigger('click');
        }
        return false;
    });
    
    
  
  
  // load any images that aren't inside a section
  var $nonSectionedProductLists = $('.product-list, .collection-listing').filter(function(){
    return $(this).closest('[data-section-type]').length == 0;
  });
  if($nonSectionedProductLists.length) {
    theme.ProductBlockManager.loadImages($nonSectionedProductLists);
  }
  $(window).on('debouncedresize', function(){
    setTimeout(function(){
      theme.ProductBlockManager.afterImagesResized(); // empty param req
    }, 100); // after third party stuff
  });
    
  
  /// On page load and section reload
  $(document).on('ready shopify:section:load', function(e){
    
    /// Style any text-only links nicely
    $('.user-content a:not(:has(img)):not(.text-link)', e.target).addClass('text-link');
    
    
    /// Show lightbox for scaled-down images
    var imageKeys = ['_pico.','_icon.','_thumb.','_small.','_compact.','_medium.','_large.','_grande.'];
    $('.lightboximages img[src]', e.target).each(function(){
      if(!$(this).parent().is('a')) {
        var imgurl = $(this).attr('src');
        for(var i = 0; i < imageKeys.length; i++) {
          if(imgurl.indexOf(imageKeys[i]) > -1) {
            imgurl = imgurl.replace(imageKeys[i], '.');
            break;
          }
        }
        var $wrapa = $('<a>').attr('href', imgurl).addClass('fancyboximg');
        $(this).wrap($wrapa);
        $(this).parent().fancybox(theme.fbOpts);
      }
    });
    
  }); // endof ready/section:reload
  
  
  /// Instagram carousel
  $(document).on('loaded.willstagram', '.willstagram', function(){
    $(this).find('.items').owlCarousel({
      margin: $(this).hasClass('willstagram--no-margins') ? 0 : 16,
      loop: false,
      items: 5,
      center: false,
      nav: false,
      dots: false,
      responsive : {
        0: {
          items: 2
        },
        480: {
          items: 3
        },
        767: {
          items: 4
        },
        1000: {
          items: 5
        }
      }
    });
  });
    
  //Quantity inputs - select when focus
  $(document).on('focusin click', 'input.select-on-focus', function(){
    $(this).select();
  }).on('mouseup', 'input.select-on-focus', function(e){
    e.preventDefault(); //Prevent mouseup killing select()
  });

  // forms don't all have correct label attributes
  $('#template label').each(function(){
    var $sibinputs = $(this).siblings('input:not([type="submit"]), textarea');
    if($sibinputs.length == 1 && $sibinputs.attr('id').length > 0) {
      $(this).attr('for', $sibinputs.attr('id'));
    }
  });
  
    //Using JS in our forms?
  $('body').addClass('jsforms');

  // show placeholders instead of labels
  $('#template').find('input, textarea').each(function(){
    var $label = $('label[for='+$(this).attr('id')+']');
    if($label.length) {
      $(this).attr('placeholder', $label.hide().text());
      Placeholders.enable( $(this)[0] );
    }
  });
    
    /// Main search input
    $(document).on('focusin focusout', '#pageheader .search-box input[type="text"]', function(e){
        $(this).closest('.search-box').toggleClass('focus', e.type == 'focusin');
    });
     

    /// Live search
    var preLoadLoadGif = $('<img src="//cdn.shopify.com/s/files/1/0618/8873/t/54/assets/ajax-load.gif?v=39811402700071768841685096460" />');
    var searchTimeoutThrottle = 500;
    var searchTimeoutID = -1;
    var currReqObj = null;
    $(document).on('keyup change', '#pageheader .search-box input[type="text"]', function(){
      var $resultsBox = $('#pageheader .search-box .results-box');
      if($resultsBox.length == 0) {
        $resultsBox = $('<div class="results-box" />').appendTo('#pageheader .search-box');
      }

      //Only search if search string longer than 2, and it has changed
      if($(this).val().length > 2 && $(this).val() != $(this).data('oldval')) {
        //Reset previous value
        $(this).data('oldval', $(this).val());

        // Kill outstanding ajax request
        if(currReqObj != null) currReqObj.abort();

        // Kill previous search
        clearTimeout(searchTimeoutID);

        var $form = $(this).closest('form');

        //Search term
        var term = '*' + $form.find('input[name="q"]').val() + '*';
        
        //Types
        var types = $form.find('input[name="type"]').val();

        //URL for full search page
        var linkURL = $form.attr('action') + '?type=' + types + '&q=' + term;

        //Show loading
        $resultsBox.html('<div class="load"></div>');

        // Do next search (in X milliseconds)
        searchTimeoutID = setTimeout(function(){
          //Ajax hit on search page
          currReqObj = $.ajax({
            url: $form.attr('action'),
            data: {
              type: types,
              view: 'json',
              q: term,
            },
            dataType: "json",
            success: function(data){
              currReqObj = null;
              if(data.results_total == 0) {
                //No results
                $resultsBox.html('<div class="note">'+ "No results found" +'</div>');
              } else {
                //Numerous results
                $resultsBox.empty();
                $.each(data.results, function(index, item){
                  var $row = $('<a></a>').attr('href', item.url);
                  $row.append('<div class="img"><img src="' + item.thumb + '" /></div>');
                  $row.append(item.title);
                  $resultsBox.append($row);
                });
                $resultsBox.append([
                  '<a href="', linkURL, '" class="note">',
                  "See all results",
                  '(', data.results_total, ')</a>'].join(''));
              }
            }
          });
        }, searchTimeoutThrottle);
      } else if ($(this).val().length <= 2) {
        //Deleted text? Clear results
        $resultsBox.empty();
      }
    });
    $(document).on('focusin', '#pageheader .search-box input[type="text"]', function(){
      // show existing results
      $('#pageheader .search-box .results-box').show();
    });
    $(document).on('click', '#pageheader .search-box input[type="text"]', function(e){
      $('#pageheader .search-box .results-box').show();
      return false; // prevent body from receiving click event
    });
    $('body').bind('click', function(){
        //Click anywhere on page, hide results
        $('#pageheader .search-box .results-box').hide();
    });
  
    //Search box should mimic live search string: products only, partial match
    $(document).on('submit', '.search-form, #search-form', function(e){
      e.preventDefault();
      var term = '*' + $(this).find('input[name="q"]').val() + '*';
      var linkURL = $(this).attr('action') + '?type=product&q=' + term;
      window.location = linkURL;
    });
    
    /// Resize scaling text after resize & load
  $(window).on('load debouncedresize', function(){
    theme.resizeScalingTextFromColumn(); // req empty param
  });
      
    /// Showing dropdown signup
    $(document).on('click', '#pageheader .util-area .signup-reveal', function(){
      $(this).parent().toggleClass('show-drop');
      return false;
    });
              
    /// Show newsletter signup response
    if($('.signup-form .signup-form__response').length) {
      $.fancybox($.extend({}, theme.fbOpts, {
        titleShow: false,
        content: $('.signup-form .signup-form__response:first').clone()
          .addClass('fully-spaced-row container')
          .wrap('<div>').parent().html()
      }));
    }
              
  /// Custom share buttons
  $(document).on('click', '.sharing a', function(e){
    var $parent = $(this).parent();
    if($parent.hasClass('twitter')) {
      e.preventDefault();
      var url = $(this).attr('href');
      var width  = 575,
          height = 450,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          opts   = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
          ',width='  + width  +
          ',height=' + height +
          ',top='    + top    +
          ',left='   + left;
      window.open(url, 'Twitter', opts);

    } else if($parent.hasClass('facebook')) {
      e.preventDefault();
      var url = $(this).attr('href');
      var width  = 626,
          height = 256,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          opts   = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
          ',width='  + width  +
          ',height=' + height +
          ',top='    + top    +
          ',left='   + left;
      window.open(url, 'Facebook', opts);

    } else if($parent.hasClass('pinterest')) {
      e.preventDefault();
      var url = $(this).attr('href');
      var width  = 700,
          height = 550,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          opts   = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
          ',width='  + width  +
          ',height=' + height +
          ',top='    + top    +
          ',left='   + left;
      window.open(url, 'Pinterest', opts);

    } else if($parent.hasClass('google')) {
      e.preventDefault();
      var url = $(this).attr('href');
      var width  = 550,
          height = 450,
          left   = ($(window).width()  - width)  / 2,
          top    = ($(window).height() - height) / 2,
          opts   = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' +
          ',width='  + width  +
          ',height=' + height +
          ',top='    + top    +
          ',left='   + left;
      window.open(url, 'Google+', opts);

    }
  });
  
  /// Responsive tables
  $('.responsive-table').on('click', '.responsive-table__cell-head', function(){
    $(this).closest('tr').toggleClass('expanded');
    return false;
  });
  
  /// Register all sections
  theme.Sections.init();
  theme.Sections.register('slideshow', theme.SlideshowSection);
  theme.Sections.register('instagram', theme.InstagramSection);
  theme.Sections.register('video', theme.VideoManager);
  theme.Sections.register('featured-collection', theme.FeaturedCollectionSection);
  theme.Sections.register('featured-collections', theme.FeaturedCollectionsSection);
  theme.Sections.register('featured-blog', theme.FeaturedBlogSection);
  theme.Sections.register('text-image-overlay', theme.TextImageOverlaySection);
  theme.Sections.register('custom-row', theme.CustomRowSection);
  theme.Sections.register('header', theme.HeaderSection);
  theme.Sections.register('product-template', theme.ProductTemplateSection);
  theme.Sections.register('collection-template', theme.CollectionTemplateSection);
  theme.Sections.register('blog-template', theme.BlogTemplateSection);
  theme.Sections.register('cart-template', theme.CartTemplateSection);
  theme.Sections.register('list-collections-template', theme.ListCollectionsTemplateSection);
  theme.Sections.register('page-list-collections-template', theme.ListCollectionsTemplateSection);
});
