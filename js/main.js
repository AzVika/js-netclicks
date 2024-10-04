window.onload = function () {

	const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';
	const SERVER = 'https://api.themoviedb.org/3';
	const API_KEY = '2956e07681aeb04a3ff3a86aaf27e36f';
	
	// menu
	const leftMenu = document.querySelector('.left-menu'),
		hamburger = document.querySelector('.hamburger'),
		tvShowsList = document.querySelector('.tv-shows__list'),
		modal = document.querySelector('.modal'),
		tvShows = document.querySelector('.tv-shows'),
		tvCardImg = document.querySelector('.tv-card__img'),
		modalTitle = document.querySelector('.modal__title'),
		tvCardImgModal = document.querySelector('.modal__content .tv-card__img'),
		genresList = document.querySelector('.genres-list'),
		rating = document.querySelector('.rating'),
		yearTv = document.querySelector('.year'),
		description = document.querySelector('.description'),
		modalLink = document.querySelector('.modal__link'),
		searchForm = document.querySelector('.search__form'),
		searchFormInput = document.querySelector('.search__form-input'),
		preloader = document.querySelector('.preloader'),
		dropdown = document.querySelectorAll('.dropdown'),
		tvShowsHead = document.querySelector('.tv-shows__head'),
		posterWrapper = document.querySelector('.poster__wrapper'),
		modalContent = document.querySelector('.modal__content'),
		pagination = document.querySelector('.pagination'),
		headTrailer = document.querySelector('.modal__head-trailer'),
		trailer = document.querySelector('.modal__trailer'),
		popular = document.getElementById('popular');


	const loading = document.createElement('div');
	loading.className = 'loading';
	searchFormInput.focus();


	class DBService {
		
		constructor () {
			this.SERVER = 'https://api.themoviedb.org/3';
			this.API_KEY = '2956e07681aeb04a3ff3a86aaf27e36f';
		}

		lastQuery = null;

		getData = async (url, changeLastQuery) => {
			const res = await fetch(url);
			
			if(changeLastQuery) {
				this.lastQuery = url;
			}

			if(res.ok) {
				return res.json();
			} else {
				throw new Error(`Неможливо отримати дані за адресою ${url}`);
			}
		}

		// getTestData = () => {
		// 	return this.getData('test.json');
		// }

		// getTestCard = () => {
		// 	return this.getData('card.json');
		// }

		getSearchResult = query => {
			const tempUrl = `${this.SERVER}/search/tv?api_key=${this.API_KEY}&query=${query}&language=uk-UK`;
			return this.getData(tempUrl, true);
		}

		getNextPage = page => {
			const tempUrl = this.lastQuery + '&page=' + page;
			return this.getData(tempUrl, true);
		}

		getTvShow = id => {
			const tempUrl = `${this.SERVER}/tv/${id}?api_key=${this.API_KEY}&language=uk-UK`;
			return this.getData(tempUrl, false);
		}

		getCategory = category => {
			const tempUrl = `${this.SERVER}/tv/${category}?api_key=${this.API_KEY}&language=uk-UK`;
			return this.getData(tempUrl, true);
		}

		getVideo = id => {
			const tempUrl = `${this.SERVER}/tv/${id}/videos?api_key=${this.API_KEY}&language=uk-UK`;
			return this.getData(tempUrl, false);
		}
	}

	const dbService = new DBService();


	const renderCard = (response, target) => {
		tvShowsList.textContent = '';

		if(!response.total_results) {
			tvShowsHead.textContent = 'На ваш запит нічого не знайдено!';
			tvShowsHead.style.color = 'red';
			pagination.textContent = '';
			loading.remove();
			return;
		}

		tvShowsHead.textContent = target ? target.textContent + ':' : 'Результат пошуку:';
		tvShowsHead.style.color = 'green';

		response.results.forEach(item => {
			const {
				backdrop_path: backdrop,
				name: title,
				poster_path: poster,
				vote_average: vote,
				id
			} = item;

			const posterIMG = poster ? IMG_URL + poster : '../img/no-poster.jpg';
			const backdropIMG = backdrop ? IMG_URL + backdrop : '';
			const voteElem = vote ? `<span class="tv-card__vote">${vote}</span>` : '';

			const card = document.createElement('li');
			card.className = 'tv-shows__item';
			card.innerHTML = `
				<a href="#" id="${id}" class="tv-card">
                    ${voteElem}
                    <img class="tv-card__img"
                         src="${posterIMG}"
                         data-backdrop="${backdropIMG}"
                         alt="${title}">
                    <h4 class="tv-card__head">${title}</h4>
                </a>
			`;

			loading.remove();
			tvShowsList.append(card);
			menuDefault();
		});

		pagination.textContent = '';

		let maxPages = 20;
		const thisPage = response.page;

		if (response.total_pages <= maxPages)  maxPages = response.total_pages;

		if(response.total_pages > 1) {
			for (let i = 1; i <= maxPages; i++) {
				if(i === thisPage) {
					pagination.innerHTML += `<li><a href="#" class="pages active-page">${i}</a></li>`;
				} else {
					pagination.innerHTML += `<li><a href="#" class="pages">${i}</a></li>`;
				}
			}
			window.scrollTo(0, 0);
		}
	};

	// start popular films
	dbService.getCategory('popular').then((response) => renderCard(response, popular));


	// search from DB
	const searchFromDB = event => {
		event.preventDefault();
		const value = searchFormInput.value.trim();
		if (value || value >= 2) {
			tvShows.append(loading);
			dbService.getSearchResult(value).then(renderCard);
		} else {
			searchFormInput.focus();
		}
		searchFormInput.value = '';
	};



	const closeDropdown = () => {
		dropdown.forEach(item => {
			item.classList.remove('active');
		});
	};


	// function close menu
	const menuDefault = () => {
		leftMenu.classList.remove('openMenu');
		hamburger.classList.remove('open');
		closeDropdown();
	};


	// change image
	const changeImage = event => {
		const card = event.target.closest('.tv-shows__item');

		if(card) {
			const img = card.querySelector('.tv-card__img');
			if(img.dataset.backdrop) {
				[img.src, img.dataset.backdrop] = [img.dataset.backdrop, img.src];
			}	
		}
	};


	// after open modal window - show info about tv item
	renderModalInfo = event => {
		event.preventDefault();

		const target = event.target;
		const card = target.closest('.tv-card');

		if(card) {

			preloader.style.display = 'block';


			dbService.getTvShow(card.id)
				.then( (response) => {

					const { 
					poster_path: posterPath,
					name: title, 
					genres, 
					vote_average: voteAverage,
					overview,
					homepage,
					first_air_date: firstDate
					} = response;
					
					if (!posterPath) {
						posterWrapper.style.display = 'none';
						modalContent.style.paddingLeft = '25px';
					} else {
						tvCardImgModal.src = IMG_URL + posterPath;
						tvCardImgModal.alt = title;
						posterWrapper.style.display = '';
						modalContent.style.paddingLeft = '';
					}

					modalTitle.textContent = title;
					// genresList.innerHTML = data.genres.reduce( (acc, item) => {
					// 	return `${acc}<li>${item.name}</li>`;
					// }, '');
					genresList.textContent = '';
					for(const item of genres) {
						genresList.innerHTML += `<li>${item.name}</li>`;
					}

					yearTv.textContent = firstDate.slice(0, 4);

					rating.textContent = voteAverage;
					description.textContent = overview;
					modalLink.href = homepage || '#';
					return response.id;
				})
				.then(dbService.getVideo)
				.then( response => {
					headTrailer.classList.add('hide');
					trailer.textContent = '';

					if(response.results.length) {
						headTrailer.classList.remove('hide');
						response.results.forEach(item => {
							const treilerItem = document.createElement('li');

							treilerItem.innerHTML =`
								<div class="modal__video-wrapper">
									<iframe
										class="modal__video-iframe"
										src="https://www.youtube.com/embed/${item.key}"
										frameborder="0"
										allowfullscreen>
									</iframe>
								</div>
								<h4>${item.name}</h4>
							`;

							trailer.append(treilerItem);
						});
					}
				})
				.then( () => {
					document.body.style.overflow = 'hidden';
					modal.classList.remove('hide');
				})
				.finally( () => {
					preloader.style.display = '';
				});
		}
	};



	searchForm.addEventListener('submit', searchFromDB);

	
	// open / close menu
	hamburger.addEventListener('click', () => {
		leftMenu.classList.toggle('openMenu');
		hamburger.classList.toggle('open');
		closeDropdown();
	});


	// 	close menu when click outside the menu
	document.addEventListener('click', event => {
		if(!event.target.closest('.left-menu')) {
			menuDefault();
		}
	});


	// handled actions inside menu items
	leftMenu.addEventListener('click', event => {
		event.preventDefault();
		const target = event.target;
		const dropdown = target.closest('.dropdown');
		if(dropdown) {
			dropdown.classList.toggle('active');
			leftMenu.classList.add('openMenu');
			hamburger.classList.add('open');
		}


		if(target.closest('#top-rated')) {
			dbService.getCategory('top_rated').then((response) => renderCard(response, target));
		}

		if(target.closest('#popular')) {
			dbService.getCategory('popular').then((response) => renderCard(response, target));
		}

		if(target.closest('#week')) {
			dbService.getCategory('on_the_air').then((response) => renderCard(response, target));
		}

		if(target.closest('#today')) {
			dbService.getCategory('airing_today').then((response) => renderCard(response, target));
		}

		if(target.closest('#search')) {
			tvShowsList.textContent = '';
			tvShowsHead.textContent = '';
			pagination.textContent = '';
			searchFormInput.focus();
			menuDefault();
			window.scrollTo(0, 0);
		}
	});


	// open modal windows
	tvShowsList.addEventListener('click', renderModalInfo);


	// close modal windows
	modal.addEventListener('click', event => {
		const target = event.target;
		if(target.closest('.cross') ||
			target.classList.contains('modal')) {
				document.body.style.overflow = '';
				modal.classList.add('hide');
		}
	});


	// change of picture item tv
	tvShowsList.addEventListener('mouseover', changeImage);
	tvShowsList.addEventListener('mouseout', changeImage);

	
	pagination.addEventListener('click', event => {
		event.preventDefault();
		const target = event.target;
		
		if(target.classList.contains('pages')) {
			tvShows.append(loading);
			dbService.getNextPage(target.textContent).then(renderCard);
		}
	});


}