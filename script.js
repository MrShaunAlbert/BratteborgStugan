document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Data loaded:', data);
            document.getElementById('image').src = data.image;
            const map = document.getElementById('image-map');
            data.zones.forEach(zone => {
                const area = document.createElement('area');
                area.shape = zone.shape;
                area.coords = zone.coords;
                area.href = '#';
                area.dataset.tooltip = zone.tooltip;
                area.style.cursor = 'default'; // Change the cursor to the default arrow
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
        });

    document.addEventListener('click', function(event) {
        if (!event.target.closest('area')) {
            document.getElementById('tooltip').style.display = 'none';
        }
    });
});
