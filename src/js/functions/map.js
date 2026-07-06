// Данные: несколько точек в одном городе
const locationsData = [
    // Санкт-Петербург - 1 точка
    {
        id: 18,
        cityId: 2,
        cityName: "Санкт-Петербург",
        coords: [59.897226, 30.334005],
        name: "Офис на Лиговском",
        address: "Лиговский проспект, 283 лит А",
        description: "Офис рядом с гипермаркетом Лента.",
    },

    // Казань - 4 точки
    {
        id: 11,
        cityId: 3,
        cityName: "Казань",
        coords: [55.796967, 49.208445],
        name: "Офис на Космонавтов",
        address: "ул. Космонавтов, 67а",
        description: "Офис в Советском районе Казани.",
    },
    {
        id: 12,
        cityId: 3,
        cityName: "Казань",
        coords: [55.849140, 49.193083],
        name: "Офис на Поперечно-Ноксинской",
        address: "Поперечно-Ноксинская ул., 5 к8",
        description: "Офис в Советском районе.",
    },
    {
        id: 13,
        cityId: 3,
        cityName: "Казань",
        coords: [55.725194, 49.173195],
        name: "Офис на Гареева",
        address: "ул. Рауиса Гареева, 110",
        description: "Офис в Приволжском районе Казани.",
    },
    {
        id: 14,
        cityId: 3,
        cityName: "Казань",
        coords: [55.749836, 49.186175],
        name: "Офис на Камая",
        address: "ул. Профессора Камая, 2Б",
        description: "Офис в Приволжском районе.",
    },

    // Новосибирск - 4 точки
    {
        id: 15,
        cityId: 4,
        cityName: "Новосибирск",
        coords: [55.021622, 82.917223],
        name: "Офис на Советской",
        address: "Советская ул., 5",
        description: "Офис в Железнодорожном районе.",
    },
    {
        id: 16,
        cityId: 4,
        cityName: "Новосибирск",
        coords: [55.110239, 82.941037],
        name: "Офис на Гребенщикова",
        address: "ул. Гребенщикова, 8к1",
        description: "Офис в Калининском районе.",
    },
    {
        id: 17,
        cityId: 4,
        cityName: "Новосибирск",
        coords: [55.100726, 82.932781],
        name: "Офис на Тамбовской",
        address: "Тамбовская ул., 41а",
        description: "Офис в Калининском районе.",
    },
    {
        id: 30,
        cityId: 4,
        cityName: "Новосибирск",
        coords: [55.029203, 83.011258],
        name: "Офис на Высоцкого",
        address: "ул. Высоцкого, 1а",
        description: "Офис в Октябрьском районе.",
    },

    // Екатеринбург - 3 точки
    {
        id: 31,
        cityId: 5,
        cityName: "Екатеринбург",
        coords: [56.922442, 60.608605],
        name: "Офис на Космонавтов (91г)",
        address: "проспект Космонавтов, 91г",
        description: "Офис в ЖК «Моменты».",
    },
    {
        id: 32,
        cityId: 5,
        cityName: "Екатеринбург",
        coords: [56.922241, 60.609862],
        name: "Офис на Космонавтов (91Б)",
        address: "проспект Космонавтов, 91Б",
        description: "Офис в ЖК «Новатор».",
    },
    {
        id: 33,
        cityId: 5,
        cityName: "Екатеринбург",
        coords: [56.922241, 60.609862],
        name: "Офис на Космонавтов (91в)",
        address: "проспект Космонавтов, 91в",
        description: "Офис в ЖК «Новатор», соседний корпус.",
    },

    // Воронеж - 1 точка
    {
        id: 19,
        cityId: 6,
        cityName: "Воронеж",
        coords: [51.7322, 39.1777],
        name: "Офис на Московском проспекте",
        address: "Московский проспект, 145",
        description: "Офис в Воронеже.",
    },

    // Пермь - 2 точки
    {
        id: 20,
        cityId: 7,
        cityName: "Пермь",
        coords: [57.955572, 56.227251],
        name: "Офис на Васильева",
        address: "ул. Василия Васильева, 13а",
        description: "Офис в Свердловском районе Перми.",
    },
    {
        id: 21,
        cityId: 7,
        cityName: "Пермь",
        coords: [58.006493, 56.293215],
        name: "Офис на Лумумбы",
        address: "проспект Патриса Лумумбы, 2",
        description: "Офис в Мотовилихинском районе Перми.",
    },

    // Ставропольский край - 1 точка
    {
        id: 22,
        cityId: 8,
        cityName: "Ставропольский край",
        coords: [45.047775, 41.615264],
        name: "Офис в Сенгилеевском",
        address: "с. Сенгилеевское, пл. Ленина, 8а",
        description: "Офис в Ставропольском крае.",
    },

    // Махачкала - 2 точки
    {
        id: 23,
        cityId: 9,
        cityName: "Махачкала",
        coords: [42.974696, 47.409047],
        name: "Офис на Казбекова",
        address: "проспект Казбекова, 32",
        description: "Офис в пос. Семендер.",
    },
    {
        id: 24,
        cityId: 9,
        cityName: "Махачкала",
        coords: [42.970000, 47.412900],
        name: "Офис на Акушинского",
        address: "проспект Али-Гаджи Акушинского, 383",
        description: "Офис в Советском районе Махачкалы.",
    },

    // Республика Коми - 4 точки
    {
        id: 25,
        cityId: 10,
        cityName: "Республика Коми",
        coords: [67.495, 63.72],
        name: "Офис в пгт Заполярный",
        address: "пгт Заполярный, СП «Печорская ЦОФ»",
        description: "Объект в Заполярном.",
    },
    {
        id: 26,
        cityId: 10,
        cityName: "Республика Коми",
        coords: [67.496600, 64.063000],
        name: "Офис на Энгельса (Воркута)",
        address: "ул. Энгельса, 3, Воркута",
        description: "Офис в Воркуте.",
    },
    {
        id: 27,
        cityId: 10,
        cityName: "Республика Коми",
        coords: [67.4986, 64.0609],
        name: "Офис на Ленина (Воркута)",
        address: "ул. Ленина, 44, Воркута",
        description: "Офис в центре Воркуты.",
    },
    {
        id: 28,
        cityId: 10,
        cityName: "Республика Коми",
        coords: [67.585166, 63.795360],
        name: "Офис в пгт Воргашор",
        address: "ул. Катаева, 29, пгт Воргашор",
        description: "Офис в поселке Воргашор.",
    },

    // Ульяновск - 8 точек
    {
        id: 34,
        cityId: 11,
        cityName: "Ульяновск",
        coords: [54.312711, 48.393313],
        name: "Офис на Льва Толстого, 95",
        address: "ул. Льва Толстого, 95",
        description: "Офис в Ульяновске.",
    },
    {
        id: 35,
        cityId: 11,
        cityName: "Ульяновск",
        coords: [54.311000, 48.386100],
        name: "Офис на Льва Толстого, 32",
        address: "ул. Льва Толстого, 32",
        description: "Офис в Ульяновске.",
    },
    {
        id: 36,
        cityId: 11,
        cityName: "Ульяновск",
        coords: [54.328943, 48.389882],
        name: "Офис на Орлова",
        address: "ул. Орлова, 21",
        description: "Офис в Ульяновске.",
    },
    {
        id: 37,
        cityId: 11,
        cityName: "Ульяновск",
        coords: [54.301075, 48.319355],
        name: "Офис на пл. Горького",
        address: "пл. Горького, 11а",
        description: "Офис в Ульяновске.",
    },
    {
        id: 38,
        cityId: 11,
        cityName: "Ульяновск",
        coords: [54.277089, 48.288561],
        name: "Офис на Камышинской, 39",
        address: "ул. Камышинская, 39",
        description: "Офис в Ульяновске.",
    },
    {
        id: 39,
        cityId: 11,
        cityName: "Ульяновск",
        coords: [54.277373, 48.286881],
        name: "Офис на Камышинской, 41",
        address: "ул. Камышинская, 41",
        description: "Офис в Ульяновске.",
    },
    {
        id: 40,
        cityId: 11,
        cityName: "Ульяновск",
        coords: [54.288258, 48.282794],
        name: "Офис на Ефремова",
        address: "ул. Ефремова, 52в",
        description: "Офис в Ульяновске.",
    },
    {
        id: 41,
        cityId: 11,
        cityName: "Ульяновск",
        coords: [54.320399, 48.397284],
        name: "Офис на Карла Маркса",
        address: "ул. Карла Маркса, 13аК2",
        description: "Офис в Ульяновске.",
    },

    // Челябинск - 2 точки
    {
        id: 42,
        cityId: 12,
        cityName: "Челябинск",
        coords: [55.154, 61.429],
        name: "Офис на Городской",
        address: "Городская ул., 2Б",
        description: "Офис в Курчатовском районе Челябинска.",
    },
    {
        id: 43,
        cityId: 12,
        cityName: "Челябинск",
        coords: [55.190000, 61.355700],
        name: "Офис на Победы",
        address: "проспект Победы, 290",
        description: "Офис в Курчатовском районе Челябинска.",
    }
];

// Уникальные города для селекта
const cities = [...new Set(locationsData.map(loc => loc.cityName))].map((name, index) => ({
    id: index + 1,
    name: name
}));

let myMap;
let placemarks = [];
let activeLocationId = null;

// Инициализация карты
ymaps.ready(init);

function init() {
    myMap = new ymaps.Map("map", {
        center: [55.7558, 37.6173],
        zoom: 5,
        controls: ['zoomControl']
    });

    // Добавляем маркеры
    locationsData.forEach(location => {
        const placemark = new ymaps.Placemark(
            location.coords,
            {
                hintContent: location.name,
                balloonContent: `<strong>${location.name}</strong><br>${location.address}`
            },
            {
                preset: 'islands#dotIcon',
                iconColor: '#ff6f31'
            }
        );

        placemark.events.add('click', () => openModal(location));
        myMap.geoObjects.add(placemark);
        placemarks.push({ location: location, placemark: placemark });
    });

    // Заполняем select городами
    const select = document.getElementById('citySelect');
    cities.forEach(city => {
        const option = document.createElement('option');
        option.value = city.id;
        option.textContent = city.name;
        select.appendChild(option);
    });

    // Обработчик изменения select
    select.addEventListener('change', (e) => {
        if (e.target.value) {
            const city = cities.find(c => c.id == e.target.value);
            const cityLocations = locationsData.filter(loc => loc.cityName === city.name);

            if (cityLocations.length > 0) {
                // Центрируем на первой точке города
                myMap.setCenter(cityLocations[0].coords, 12);
                // openModal(cityLocations[0]);
            }
        } else {
            myMap.setCenter([55.7558, 37.6173], 5);
            closeModal();
        }
    });
}

// Открытие модального окна
function openModal(location) {
    activeLocationId = location.id;

    document.getElementById('modalCity').textContent = location.cityName;
    document.getElementById('modalLocation').textContent = `${location.name} — ${location.address}`;
    document.getElementById('modalDescription').textContent = location.description;


    // Список всех точек этого города
    const cityLocations = locationsData.filter(loc => loc.cityName === location.cityName);
    const locationsList = document.getElementById('locationsList');

    if (cityLocations.length > 1) {
        locationsList.innerHTML = `
            <div class="locations-title">Другие офисы в городе</div>
            ${cityLocations.map(loc => `
                <div class="location-item ${loc.id === location.id ? 'active' : ''}"
                      onclick="switchLocation(${loc.id})">
                    <div class="location-name">${loc.name}</div>
                    <div class="location-address">${loc.address}</div>
                </div>
            `).join('')}
        `;
        locationsList.style.display = 'block';
    } else {
        locationsList.style.display = 'none';
    }

    document.getElementById('modalOverlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Переключение между точками города
function switchLocation(locationId) {
    const location = locationsData.find(loc => loc.id === locationId);
    if (location) {
        myMap.setCenter(location.coords, 14);
        openModal(location);
    }
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
    document.body.style.overflow = '';
    activeLocationId = null;
}

// Закрытие по клику вне модального окна
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) {
        closeModal();
    }
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

window.openModal = openModal;
window.switchLocation = switchLocation;
window.closeModal = closeModal;
