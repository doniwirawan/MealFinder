const search = document.querySelector('#search'),
	submit = document.querySelector('#submit'),
	random = document.querySelector('#random'),
	// mealsEl = document.querySelector('#meals'),
	drinksEl = document.querySelector('#drinks'),
	resultHeading = document.querySelector('#result-heading'),

	// Modal Sudah Work
	modal = document.querySelector('#modal'),
	modalBtn = document.querySelector('#modal-btn'),

	// modal  masih belum work
	modalBtnItem = document.querySelectorAll('.modal-btn'),


	modalText = document.querySelector('#modal-text'),
	// single_mealEl = document.querySelector('#single-meal'),
	single_drinkEl = document.querySelector('#single-drink'),
	filter = document.querySelector('.filter'),
	container = document.querySelector('.container');






console.log(modalBtnItem);




//search meal and fetch from API
function searchDrink(e) {
	e.preventDefault();

	//clear single meal
	single_drinkEl.innerHTML = '';

	//term
	const term = search.value;
	console.log(term)


	//check for empty
	if (term.trim()) {
		fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
			.then(res => res.json())
			.then(data => {
				console.log(data);
				resultHeading.innerHTML = `<h4 class='mt-4'>Hasil pencarian dari '${term}' : </h4>`;
				if (data.drinks === null) {
					resultHeading.innerHTML = ``;
					showModal('block', `Pencarian untuk ${term} kosong, coba lagi !`);
				} else {
					drinksEl.innerHTML = data.drinks.map(drink =>
						`<div class="drink rounded">
						<img src="${drink.strDrinkThumb}" alt="${drink.strDrink}" class="rounded"/>

						<div class="drink-info rounded" data-drinkID="${drink.idDrink}">
							<h3>${drink.strDrink}</h3>
						</div>
					</div>`
					)
						.join('');
				}
			});
		//clear search text
		search.value = '';

	} else {
		showModal('block', `Tolong Masukkan Kata Kunci`);
	}

}

//fetch meal by ID function
function getDrinkById(drinkID) {
	fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`)
		.then(res => res.json())
		.then(data => {
			const drink = data.drinks[0];
			addDrinktoDOM(drink);
		})
}

//fetch random meal
function getRandomDrink() {
	//clear meals and heading
	drinksEl.innerHTML = '';
	resultHeading.innerHTML = '';

	fetch(`https://www.thecocktaildb.com/api/json/v1/1/random.php`)
		.then(res => res.json())
		.then(data => {
			const drink = data.drinks[0];
			addDrinktoDOM(drink);
		})
}


//add meal to DOM
function addDrinktoDOM(drink) {
	const ingredients = [];
	for (let i = 1; i <= 20; i++) {
		if (drink[`strIngredient${i}`]) {
			ingredients.push(`${drink[`strIngredient${i}`]} - ${drink[`strMeasure${i}`]}`);
		} else {
			break;
		}
	}


	single_drinkEl.innerHTML = `
	<div class="modal2 text-dark" id="exampleModalLong" tabindex="-1" role="dialog">
		<div class="modal-dialog" role="document" >
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title">${drink.strDrink}</h1>
					<button type="button" class="close modal-btn"  id="modal-btn">
					<span aria-hidden="true" onclick="closeModalItem()">&times;</span>
					</button>
				</div>
				<div class="modal-body">
					<img src="${drink.strDrinkThumb}" alt="${drink.strDrink}"/>
					<div class"single-drink-info">
						${drink.strCategory ? `<h3>${drink.strCategory}</h3>` : ''}
						${drink.strIBA ? `<h5>${drink.strIBA}</h5>` : ''}
						${drink.strAlcoholic ? `<h5>${drink.strAlcoholic}</h5>` : ''}
						${drink.strArea ? `<p class="mb-3">${drink.strArea}</p>` : ''}
					</div>
					<div class="main">
						<p>${drink.strInstructions}</p>
						<h3 class="mt-2">Ingredients :</h3>
						<ul >
							${ingredients.map(ing => `<li>${ing}</li>`).join('')}
						</ul>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary modal-btn" onclick="closeModalItem()">Close</button>
				</div>
			</div>
		</div>
	</div>
	`;
}


function showModal(display, text) {
	filter.style.display = 'block';
	modal.style.display = `${display}`;
	modalText.innerHTML = `${text}`;
	setTimeout(() => {
		filter.style.display = 'none';
		modal.style.display = 'none';
	}, 1400);
}

function closeModal() {
	modalBtn.addEventListener('click', function () {
		modal.style.display = 'none';
		filter.style.display = 'none';

	})
}
closeModal();


function closeModalItem() {
	// console.log('clicked');
	document.querySelector('#exampleModalLong').style.display = 'none';
	filter.style.display = 'none';

}


//event listener
submit.addEventListener('submit', searchDrink);

random.addEventListener('click', getRandomDrink);


drinksEl.addEventListener('click', e => {
	filter.style.display = 'block';

	const drinkInfo = e.path.find(item => {
		if (item.classList) {
			return item.classList.contains('drink-info');
		} else {
			return false;
		}
	});
	if (drinkInfo) {
		const drinkID = drinkInfo.getAttribute('data-drinkid');
		getDrinkById(drinkID)
		// closeModalItem();
	}

});