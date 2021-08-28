"use strict"

const spollersArray = document.querySelectorAll('[data-spollers]');
if(spollersArray.length > 0){
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
        return !item.dataset.spollers.split(",")[0];
    });

    if(spollersRegular.length > 0) {
        initSpollers(spollersRegular);
    }

    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
        return item.dataset.spollers.split(",")[0];
    });

    if(spollersMedia.length > 0){
        const breakpointsArray = [];
        spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(',');
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : 'max';
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
        })

        let mediaQueries = breakpointsArray.map(function (item) {
            return  '(' + item.type + '-width: ' + item.value + "px)," + item.value + "," + item.type; 
        });
        
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        })

        mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(',');
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);


            const spollersArray = breakpointsArray.filter(function (item) {
                if(item.value === mediaBreakpoint && item.type === mediaType) {
                    return true;
                }
            });

            console.log(spollersArray);

            matchMedia.addEventListener('change', function () {
                initSpollers(spollersArray, matchMedia);
            });

            initSpollers(spollersArray, matchMedia)
        })
    }

    function initSpollers(spollersArray, matchMedia = false) {
        spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            // console.log(spollersBlock);
            if(matchMedia.matches || !matchMedia){
                spollersBlock.classList.add('_init');
                initSpollerBody(spollersBlock);
                spollersBlock.addEventListener('click', setSpollerAction);

            }else{
                spollersBlock.classList.remove('_init');
                initSpollerBody(spollersBlock, false);
                spollersBlock.removeEventListener("click", setSpollerAction);
            }
        })
    }

    function initSpollerBody(spollersBlock,hideSpollerBody = true) {
        const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
        if(spollerTitles.length > 0){
            spollerTitles.forEach(spollerTitle => {
                if(hideSpollerBody){
                    spollerTitle.removeAttribute('tabindex');
                    if(!spollerTitle.classList.contains('_active')){
                        spollerTitle.nextElementSibling.hidden = true;
                    }

                    
                }else{
                    spollerTitle.setAttribute('tabindex', '-1')
                    spollerTitle.nextElementSibling.hidden = false;
                }
            })
        }
    }

    function setSpollerAction(e) {
        const el = e.target;
        if(el.hasAttribute('data-spoller') || el.closest('[data-spoller]')){
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if(!spollersBlock.querySelectorAll('._slide').length){
                if(oneSpoller && !spollerTitle.classList.contains('_active')){
                    hideSpollersBody(spollersBlock);
                }
                spollerTitle.classList.toggle('_active');
                _slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }

    function hideSpollersBody(spollersBlock) {
        const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
        if(spollerActiveTitle){
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
        }
    }
}


let _slideUp = (target, duration = 500) =>{
    if(!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = '0';
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() =>{
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');

        }, duration);
    }
}

let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if(target.hidden){
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');

        }, duration);
    }
}

let _slideToggle = (target, duration = 500) =>{
    if(target.hidden){
        return _slideDown(target, duration);
    }else{
        return _slideUp(target, duration);
    }
};
function testWebP(callback) {

	var webP = new Image();
	webP.onload = webP.onerror = function () {
		callback(webP.height == 2);
	};
	webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
}

testWebP(function (support) {

	if (support == true) {
		document.querySelector('body').classList.add('webp');
	} else {
		document.querySelector('body').classList.add('no-webp');
	}
});
//-------------------------------------------------------------------------------------------------------------------
//ПЕРЕМЕННЫЕ------------------------------------------------------------------
const headerHidden = document.querySelector('.header__hidden');
const headerContacts = document.querySelector('.header__contacts');
const headerContent = document.querySelector('.header__content');
const headerIcon = document.querySelector('.header__icon');
const burgerIcon = document.querySelector('.burger__icon');
const headerHidden2 = document.querySelector('.header__hidden2');
const body = document.querySelector('body');


//ХЕДЕР + БУРГЕР---------------------------------------------------------------
document.addEventListener('click', (e) => {
	if (e.target.closest('.header__contacts') && e.target.closest('.header__hidden') !== headerHidden) {
		headerContacts.classList.toggle('active-number');
	}
	if (!e.target.closest('.header__hidden') && !e.target.closest('.header__contacts')) {
		headerContacts.classList.remove('active-number');
	}
})

burgerIcon.addEventListener('click', () => {
	headerHidden2.classList.toggle('active-menu');
})
headerIcon.addEventListener('click', () => {
	headerContent.classList.toggle('active-menu');
	headerIcon.classList.toggle('active-burger');
	body.classList.toggle('no-scroll');
});

burgerIcon.addEventListener('click', () => {
	burgerIcon.classList.toggle('active-icon');
})

//СВАЙПЕР----------------------------------------------------

const swiper = new Swiper('.main-swiper', {

	pagination: {
		el: '.swiper-pagination-two',
		clickable: true,
		type: 'bullets',
	},
	spaceBetween: 60,
	centeredSlides: true,
	initialSlide: 1,
	slidesPerView: 1,
	breakpoints: {
		1: {
			slidesPerView: 1,
		},
		1285: {
			slidesPerView: 1.1,
		},
		1374: {
			slidesPerView: 1.15,
		},
		1474: {
			slidesPerView: 1.25,
		},
		1674: {
			slidesPerView: 1.35,
		},
		1774: {
			slidesPerView: 1.45,
		},
		1900: {
			slidesPerView: 1.5,
		},
	}


});

$(document).ready(function () {
	$('.service__content').masonry({
		// указываем элемент-контейнер в котором расположены блоки для динамической верстки
		itemSelector: '.card',
		// указываем класс элемента являющегося блоком в нашей сетке
		singleMode: true,
		// true - если у вас все блоки одинаковой ширины
		isResizable: true,
		// перестраивает блоки при изменении размеров окна
		isAnimated: true,
		// columnWidth: 10,
		gutter: 16,
		horizontalOrder: true,
		isFitWidth: true,
		// анимируем перестроение блоков
		animationOptions: {
			queue: false,
			duration: 500
		}
		// опции анимации - очередь и продолжительность анимации
	});

	const mediaQuery = window.matchMedia('(max-width: 1312px)')
	function handleTabletChange(e) {
		if (e.matches) {
			$('.service__content').masonry('destroy');
		} else {
			$('.service__content').masonry({
				// указываем элемент-контейнер в котором расположены блоки для динамической верстки
				itemSelector: '.card',
				// указываем класс элемента являющегося блоком в нашей сетке
				singleMode: true,
				// true - если у вас все блоки одинаковой ширины
				isResizable: true,
				// перестраивает блоки при изменении размеров окна
				isAnimated: true,
				// columnWidth: 10,
				gutter: 16,
				horizontalOrder: true,
				isFitWidth: true,
				// анимируем перестроение блоков
				animationOptions: {
					queue: false,
					duration: 500
				}
				// опции анимации - очередь и продолжительность анимации
			});
		}
	}
	mediaQuery.addEventListener("change", handleTabletChange);
	handleTabletChange(mediaQuery);
});


const swiperDoc = new Swiper('.doc', {
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	spaceBetween: 60,
	centeredSlides: true,
	initialSlide: 0,
	slidesPerView: 1,

});

const swiperBlog = new Swiper('.swiper-blog', {

	// If we need pagination
	pagination: {
		el: '.swiper-pagination',
	},
	autoHeight: true,
	spaceBetween: 30,

});

const contacts = document.querySelector('.contacts');
const medlazText = document.querySelector('.medlaz__text');
const medlazVisa = document.querySelector('.medlaz__visa');
const medlaz = document.querySelector('.medlaz');
const contactsSeo = document.querySelector('.contacts__seo');
const contactsBlock = document.querySelector('.contacts__block')
if (window.innerWidth < 700) {
	contacts.prepend(medlazText);
	medlaz.append(contactsSeo);

}
window.addEventListener('resize', () => {

	if (window.innerWidth < 700) {

		contacts.prepend(medlazText);
		medlaz.append(contactsSeo);


	} else if (window.innerWidth > 700 && medlazText.closest('.contacts') == contacts) {

		medlazVisa.insertAdjacentElement('afterend', medlazText);
		contactsBlock.insertAdjacentElement('afterend', contactsSeo);

	}

})
