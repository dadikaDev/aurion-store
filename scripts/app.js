let stores = [];
let activeStoreId = null;
let map;
let markers = [];

const container = document.getElementById("store-results");
const searchInput = document.getElementById("searchInput");

fetch("stores.json")
    .then((res) => res.json())
    .then((data) => {
        stores = data;
        renderStores(stores);
        if (map) createMarkers(stores);
    })
    .catch((err) => console.error("Failed to load stores.json", err));

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 39.8283, lng: -98.5795 },
        zoom: 4,
    });

    if (stores.length) createMarkers(stores);
}

function createMarkers(list) {
    markers.forEach((m) => m.setMap(null));
    markers = [];

    list.forEach((store) => {
        const normalSize = 40;
        const hoverSize = 50;

        const marker = new google.maps.Marker({
            position: { lat: store.lat, lng: store.lng },
            map,
            title: store.name,
            icon: {
                url: "/assets/images/icons/find-store-icons/logo.png",
                scaledSize: new google.maps.Size(normalSize, normalSize),
                anchor: new google.maps.Point(normalSize / 2, normalSize / 2),
            },
        });

        let tooltipOverlay = null;

        function showTooltip() {
            const div = document.createElement("div");
            div.innerText = store.name;
            Object.assign(div.style, {
                position: "absolute",
                background: "black",
                color: "white",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                pointerEvents: "none",
                whiteSpace: "nowrap",
            });

            tooltipOverlay = new google.maps.OverlayView();
            tooltipOverlay.onAdd = function () {
                this.getPanes().floatPane.appendChild(div);
                this.div = div;
            };
            tooltipOverlay.draw = function () {
                const projection = this.getProjection();
                if (!projection) return;
                const pos = projection.fromLatLngToDivPixel(
                    marker.getPosition(),
                );
                div.style.left = pos.x - div.offsetWidth / 2 + "px";
                div.style.top = pos.y - hoverSize - 10 + "px";
            };
            tooltipOverlay.onRemove = function () {
                if (div.parentNode) div.parentNode.removeChild(div);
            };
            tooltipOverlay.setMap(map);
        }

        function hideTooltip() {
            if (tooltipOverlay) {
                tooltipOverlay.setMap(null);
                tooltipOverlay = null;
            }
        }

        marker.addListener("mouseover", () => {
            marker.setIcon({
                url: "/assets/images/icons/find-store-icons/logo.png",
                scaledSize: new google.maps.Size(hoverSize, hoverSize),
                anchor: new google.maps.Point(hoverSize / 2, hoverSize / 2),
            });
            showTooltip();
        });

        marker.addListener("mouseout", () => {
            marker.setIcon({
                url: "/assets/images/icons/find-store-icons/logo.png",
                scaledSize: new google.maps.Size(normalSize, normalSize),
                anchor: new google.maps.Point(normalSize / 2, normalSize / 2),
            });
            hideTooltip();
        });

        marker.addListener("click", () => {
            setActiveStore(store.id);
            centerOnStore(store);
        });

        markers.push(marker);
    });
}

function renderStores(list) {
    const container = document.querySelector(".store-results");
    container.innerHTML = "";

    list.forEach((store) => {
        const card = document.createElement("div");
        card.className = "store-card";
        card.dataset.id = store.id;

        card.innerHTML = `
            <h3>
                <img class="logo-icon" src="/assets/images/icons/find-store-icons/logo.svg" alt="">
                ${store.name}
            </h3>
            <div class="store-info">
                <p class="status">${store.status}</p>
                <p class="address">${store.address}, ${store.city}, ${store.state}</p>
                <button>Book an appointment</button>
            </div>
        `;

        card.addEventListener("mouseenter", () => {
            const marker = markers.find((m) => m.title === store.name);
            if (marker) marker.setAnimation(google.maps.Animation.BOUNCE);
        });
        card.addEventListener("mouseleave", () => {
            const marker = markers.find((m) => m.title === store.name);
            if (marker) marker.setAnimation(null);
        });

        card.addEventListener("click", () => {
            setActiveStore(store.id);
            centerOnStore(store);
        });

        container.appendChild(card);
    });
}

function setActiveStore(id) {
    activeStoreId = id;

    document.querySelectorAll(".store-card").forEach((card) => {
        card.classList.toggle("active", Number(card.dataset.id) === id);
    });
}

function centerOnStore(store) {
    if (map) {
        map.panTo({ lat: store.lat, lng: store.lng });
        map.setZoom(12);
    }
    console.log("CENTER ON:", store.city, store.lat, store.lng);
}
