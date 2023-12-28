// ------------------------------------------
// global variables
// ------------------------------------------
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`;
const gridContainer = document.querySelector('.main-container');
const overlay = document.querySelector('.overlay');
const modalContainer = document.querySelector('.modal-content');
const modalClose = document.querySelector('.modal-close');

// ------------------------------------------
// fetch functions
// ------------------------------------------
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err));

// ------------------------------------------
// functions
// ------------------------------------------
function displayEmployees(employeeData) {
    employees = employeeData;
    let employeeHTML = '';
    employees.forEach((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;
        employeeHTML += `
            <div class="card" data-index="${index}">
                <img class="avatar" src="${picture.large}" alt>
                <div class="text-container">
                    <h2 class="name">${name.first} ${name.last}</h2>
                    <p class="email">${email}</p>
                    <p class="address">${city}</p>
                </div>
            </div>
        `;
    });
    gridContainer.innerHTML = employeeHTML;
};

function displayModal(index) {
    let {name, dob, phone, email, location: {city, street, state, postcode}, picture} = employees[index];
    let date = new Date(dob.date);
    const modalHTML = `
        <img class="avatar" src="${picture.large}" alt>
        <div class="text-container" data-index="${index}">
            <h2 class="name">${name.first} ${name.last}</h2>
            <p class="email">${email}</p>
            <p class="address">${city}</p>
            <hr>
            <p class="phone">${phone}</p>
            <p class="address">${street.number} ${street.name}, ${state} ${postcode}</p>
            <p class="dob">Birthday: ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
        </div>
    `;
    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
};

// ------------------------------------------
// event listeners
// ------------------------------------------

gridContainer.addEventListener('click', e => {
    if (e.target !== gridContainer) {
        const card = e.target.closest('.card');
        const index = card.getAttribute('data-index');
        displayModal(index);
    }   
});

modalClose.addEventListener('click', e => {
    overlay.classList.add('hidden');
});

// ------------------------------------------
// search bar function
// ------------------------------------------
const searchBox = document.getElementById('user-field');

searchBox.onkeyup = function() {
    let input = searchBox.value;
    input = input.toLowerCase();
    let cards = document.querySelectorAll('.card');
    for (let i = 0; i < cards.length; i++) {
        if (!cards[i].childNodes[3].childNodes[1].innerHTML.toLowerCase().includes(input)) {
            cards[i].style.display = 'none';
        } else {
            cards[i].style.display = 'flex';
        }
    }
}

// ------------------------------------------
// modal lightbox controls
// ------------------------------------------
const next = document.querySelector('.next');
const previous = document.querySelector('.prev');

next.addEventListener('click', (e) => {
    let index = e.target.previousElementSibling.previousElementSibling.childNodes[3].getAttribute('data-index');
    index = +index;
    if (index >= 11) {
        index = -1 // because index will increase by 1 when 'displayModal' runs and index starts at 0
    }
    displayModal(index + 1); // index increases by 1 when function runs
});
previous.addEventListener('click', (e) => {
    let index = e.target.previousElementSibling.childNodes[3].getAttribute('data-index');
    index = +index;
    if (index < 1) {
        index = 12
    }
    displayModal(index - 1);
});