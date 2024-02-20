const state = {
	breweries: [],
	stateFilter: "",
	typeFilter: "",
};

const BreweryTypes = {
	Micro: "micro",
	Brewpub: "brewpub",
	Regional: "regional",
};

function formatStateInput(string) {
	return string.replace(/\s+/g, "_").toLowerCase();
}

function setupTypeFilter() {
	const filterByType = document.getElementById("filter-by-type");
	filterByType.addEventListener("change", (event) => {
		state.typeFilter = event.target.value;
	});
}

function setupStateFilter() {
	const selectStateForm = document.getElementById("select-state-form");
	const selectState = document.getElementById("select-state");
	selectStateForm.addEventListener("submit", (event) => {
		event.preventDefault();

		state.stateFilter = formatStateInput(selectState.value);

		getBreweriesByState();
		console.log(state);
	});
}

function setupEventListeners() {
	setupStateFilter();
	setupTypeFilter();
}

function createBreweryInfo(brewery) {
	const breweryItemLi = document.createElement("li");

	const breweryName = document.createElement("h2");
	const typeDiv = document.createElement("div");

	const addressSection = document.createElement("section");
	const addressTitle = document.createElement("h3");
	const street = document.createElement("p");
	const city = document.createElement("p");
	const cityStrong = document.createElement("strong");

	const phoneSection = document.createElement("section");
	const phoneTitle = document.createElement("h3");
	const phoneNr = document.createElement("p");

	const websiteSection = document.createElement("section");
	const websiteLink = document.createElement("a");

	breweryName.textContent = brewery.name;

	typeDiv.classList.add("type");
	typeDiv.textContent = brewery.brewery_type;

	addressSection.classList.add("adress");
	addressTitle.textContent = "Address:";
	street.textContent = brewery.street;
	cityStrong.textContent = `${brewery.city}, ${brewery.postal_code}`;

	phoneSection.classList.add("phone");

	phoneTitle.textContent = "Phone:";
	if (brewery.phone === null) {
		phoneNr.textContent = "N/A";
	} else {
		phoneNr.textContent = `+${brewery.phone}`;
	}

	websiteSection.classList.add("link");
	websiteLink.href = brewery.website_url;
	websiteLink.target = "_blanks";
	websiteLink.textContent = "Visit Website";

	breweryItemLi.appendChild(breweryName);
	breweryItemLi.appendChild(typeDiv);
	breweryItemLi.appendChild(addressSection);

	addressSection.appendChild(addressTitle);
	addressSection.appendChild(street);
	addressSection.appendChild(city);
	city.appendChild(cityStrong);

	breweryItemLi.appendChild(phoneSection);
	phoneSection.appendChild(phoneTitle);
	phoneSection.appendChild(phoneNr);

	breweryItemLi.appendChild(websiteSection);

	websiteSection.appendChild(websiteLink);

	return breweryItemLi;
}

function filterByType(breweries) {
	if (state.typeFilter === "") {
		return breweries;
	}

	let filteredBreweries = [];

	filteredBreweries = breweries.filter(
		(brewery) => brewery.brewery_type === state.typeFilter
	);

	return filteredBreweries;
}

function renderBreweries() {
	clearListOfBreweries();

	const breweriesList = document.getElementById("breweries-list");

	let filteredBreweries = [];

	filteredBreweries = state.breweries.filter(
		(brewery) =>
			brewery.brewery_type === BreweryTypes.Micro ||
			brewery.brewery_type === BreweryTypes.Regional ||
			brewery.brewery_type === BreweryTypes.Brewpub
	);

	filteredBreweries = filterByType(filteredBreweries);

	filteredBreweries.forEach((brewery) => {
		breweriesList.appendChild(createBreweryInfo(brewery));
	});
}

function clearListOfBreweries() {
	const breweriesList = document.getElementById("breweries-list");
	breweriesList.innerHTML = "";
}

function getBreweriesByState() {
	fetch(
		`https://api.openbrewerydb.org/v1/breweries?by_state=${state.stateFilter}&per_page=100`,
		{}
	)
		.then((response) => response.json())
		.then((breweries) => {
			state.breweries = breweries;
			renderBreweries();
		});
}

function main() {
	setupEventListeners();
}

main();