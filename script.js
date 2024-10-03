document.addEventListener('DOMContentLoaded', function() {
    console.log('Script loaded'); // Add this line

    const urlParams = new URLSearchParams(window.location.search);
    const version = urlParams.get('v') || 'default_version'; // Use 'default_version' if 'v' is not present
    const isDev = urlParams.get('dev') === 'true';

    // Log the dev parameter and version for debugging
    console.log('isDev:', isDev);
    console.log('Version:', version);

    // Set the version in the footer
    document.getElementById('version').textContent = version;

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log('Data loaded:', data); // Log the fetched data
            const image = document.getElementById('image');
            document.getElementById('image').src = data.image;
            const map = document.getElementById('image-map');

            data.zones.forEach(zone => {
                const area = document.createElement('area');
                area.shape = zone.shape;
                area.coords = zone.coords;
                area.href = '#';
                area.dataset.tooltip = zone.tooltip;
                area.style.cursor = 'default'; // Change the cursor to the default arrow

                if (isDev) {
                    // Add a border or background color to make the areas visible
                    const highlight = document.createElement('div');
                    highlight.style.position = 'absolute';
                    highlight.style.border = '2px solid red';
                    highlight.style.pointerEvents = 'none';

                    const coords = zone.coords.split(',').map(Number);
                    const imageRect = image.getBoundingClientRect();
                    const imageOffsetLeft = image.offsetLeft;
                    const imageOffsetTop = image.offsetTop;

                    console.log('Zone coords:', coords); // Log the coordinates
                    if (zone.shape === 'rect') {
                        highlight.style.left = `${imageRect.left + window.scrollX + coords[0]}px`;
                        highlight.style.top = `${imageRect.top + window.scrollY + coords[1]}px`;
                        highlight.style.width = `${coords[2] - coords[0]}px`;
                        highlight.style.height = `${coords[3] - coords[1]}px`;
                    } else if (zone.shape === 'circle') {
                        highlight.style.left = `${imageRect.left + window.scrollX + coords[0] - coords[2]}px`;
                        highlight.style.top = `${imageRect.top + window.scrollY + coords[1] - coords[2]}px`;
                        highlight.style.width = `${coords[2] * 2}px`;
                        highlight.style.height = `${coords[2] * 2}px`;
                        highlight.style.borderRadius = '50%';
                    }

                    console.log('Highlight element:', highlight); // Log the highlight element
                    document.body.appendChild(highlight);
                }

                area.addEventListener('click', function(event) {
                    event.preventDefault();
                    const tooltip = document.getElementById('tooltip');
                    tooltip.innerHTML = this.dataset.tooltip;
                    tooltip.style.display = 'block';
                    tooltip.style.left = `${event.pageX}px`;
                    tooltip.style.top = `${event.pageY}px`;
                });
                map.appendChild(area);
            });
        })
        .catch(error => console.error('Error fetching data:', error));

    document.addEventListener('click', function(event) {
        if (!event.target.closest('area')) {
            document.getElementById('tooltip').style.display = 'none';
        }
    });
});
