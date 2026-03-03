// Данные: несколько точек в одном городе
const locationsData = [
    // Москва - 3 точки
    {
        id: 1,
        cityId: 1,
        cityName: "Москва",
        coords: [55.7558, 37.6173],
        name: "Офис на Красной площади",
        address: "Красная площадь, 1",
        description: "Главный офис компании в историческом центре Москвы.",
        photo: "https://images.unsplash.com/photo-1547448520-180de2f0092e?w=800",
        phone: "+7 (495) 123-45-67",
        hours: "Пн-Пт: 9:00 - 18:00",
        url: "/moscow-center"
    },
    {
        id: 2,
        cityId: 1,
        cityName: "Москва",
        coords: [55.7415, 37.6205],
        name: "Офис на Павелецкой",
        address: "ул. Летниковская, 10",
        description: "Современный офис в деловом районе.",
        photo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
        phone: "+7 (495) 123-45-68",
        hours: "Пн-Пт: 9:00 - 18:00",
        url: "/moscow-paveletskaya"
    },
    {
        id: 3,
        cityId: 1,
        cityName: "Москва",
        coords: [55.7961, 37.7123],
        name: "Офис в Сокольниках",
        address: "Сокольнический вал, 1",
        description: "Офис рядом с парком Сокольники.",
        photo: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=800",
        phone: "+7 (495) 123-45-69",
        hours: "Пн-Пт: 9:00 - 18:00",
        url: "/moscow-sokolniki"
    },

    // Санкт-Петербург - 2 точки
    {
        id: 4,
        cityId: 2,
        cityName: "Санкт-Петербург",
        coords: [59.9343, 30.3351],
        name: "Офис на Невском",
        address: "Невский проспект, 28",
        description: "Офис в самом центре Санкт-Петербурга.",
        photo: "https://images.unsplash.com/photo-1556610961-2fecc5927174?w=800",
        phone: "+7 (812) 123-45-67",
        hours: "Пн-Пт: 9:00 - 18:00",
        url: "/spb-nevsky"
    },
    {
        id: 5,
        cityId: 2,
        cityName: "Санкт-Петербург",
        coords: [59.8944, 30.2642],
        name: "Офис на Московском",
        address: "Московский проспект, 100",
        description: "Офис в южной части города.",
        photo: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800",
        phone: "+7 (812) 123-45-68",
        hours: "Пн-Пт: 9:00 - 18:00",
        url: "/spb-moskovsky"
    },

    // Казань - 2 точки
    {
        id: 6,
        cityId: 3,
        cityName: "Казань",
        coords: [55.8304, 49.0661],
        name: "Офис на Баумана",
        address: "ул. Баумана, 15",
        description: "Офис на главной пешеходной улице Казани.",
        photo: "https://images.unsplash.com/photo-1598894994155-5c754f2ae591?w=800",
        phone: "+7 (843) 123-45-67",
        hours: "Пн-Пт: 9:00 - 18:00",
        url: "/kazan-baumana"
    },
    {
        id: 7,
        cityId: 3,
        cityName: "Казань",
        coords: [55.7961, 49.1061],
        name: "Офис в центре",
        address: "ул. Пушкина, 20",
        description: "Современный офис в деловом центре.",
        photo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
        phone: "+7 (843) 123-45-68",
        hours: "Пн-Пт: 9:00 - 18:00",
        url: "/kazan-center"
    },

    // Новосибирск - 1 точка
    {
        id: 8,
        cityId: 4,
        cityName: "Новосибирск",
        coords: [55.0084, 82.9357],
        name: "Главный офис",
        address: "Красный проспект, 50",
        description: "Крупнейший офис компании в Сибири.",
        photo: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
        phone: "+7 (383) 123-45-67",
        hours: "Пн-Пт: 9:00 - 18:00",
        url: "/novosibirsk"
    },

    // Екатеринбург - 2 точки
    {
        id: 9,
        cityId: 5,
        cityName: "Екатеринбург",
        coords: [56.8389, 60.6057],
        name: "Офис на Ленина",
        address: "проспект Ленина, 30",
        description: "Офис в деловом центре Екатеринбурга.",
        photo: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?w=800",
        phone: "+7 (343) 123-45-67",
        hours: "Пн-Пт: 9:00 - 18:00",
        url: "/ekb-lenina"
    },
    {
        id: 10,
        cityId: 5,
        cityName: "Екатеринбург",
        coords: [56.8519, 60.6289],
        name: "Офис на Малышева",
        address: "ул. Малышева, 51",
        description: "Офис в центре города.",
        photo: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800",
        phone: "+7 (343) 123-45-68",
        hours: "Пн-Пт: 9:00 - 18:00",
        url: "/ekb-malysheva"
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

    document.getElementById('modalImage').src = location.photo;
    document.getElementById('modalCity').textContent = location.cityName;
    document.getElementById('modalLocation').innerHTML = `📍 ${location.name} — ${location.address}`;
    document.getElementById('modalDescription').textContent = location.description;
    document.getElementById('modalPhone').textContent = location.phone;
    document.getElementById('modalHours').textContent = location.hours;
    document.getElementById('modalButton').href = location.url;

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
