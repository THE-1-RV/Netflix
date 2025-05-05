// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navbar background change on scroll
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Toggle between grid and list views
    const gridViewBtn = document.querySelector('.grid-view');
    const listViewBtn = document.querySelector('.list-view');
    const content = document.querySelector('.my-list-content');
    
    if (gridViewBtn && listViewBtn && content) {
        // Save current items
        let items = document.querySelectorAll('.item-card');
        
        gridViewBtn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                this.classList.add('active');
                listViewBtn.classList.remove('active');
                
                // Switch to grid view
                let container = document.querySelector('.items-grid, .items-list');
                if (container) {
                    // Save current content
                    items = container.querySelectorAll('.item-card, .list-item');
                    
                    // Create new grid container
                    const gridContainer = document.createElement('div');
                    gridContainer.className = 'items-grid';
                    
                    // Convert list items to grid items if necessary
                    items.forEach(item => {
                        if (item.classList.contains('list-item')) {
                            // Get data from list item
                            const imgSrc = item.querySelector('img').src;
                            const title = item.querySelector('.list-item-title').textContent;
                            const meta = item.querySelector('.list-item-meta').textContent;
                            
                            // Create grid item
                            const gridItem = document.createElement('div');
                            gridItem.className = 'item-card';
                            gridItem.innerHTML = `
                                <img src="${imgSrc}" alt="${title}">
                                <div class="item-info">
                                    <h3>${title}</h3>
                                    <div class="meta">
                                        <span>${meta}</span>
                                    </div>
                                    <p class="item-description">
                                        ${title} - Watch now or add to your list.
                                    </p>
                                    <div class="card-buttons">
                                        <button class="card-btn"><i class="fas fa-play"></i></button>
                                        <button class="card-btn"><i class="fas fa-check"></i></button>
                                        <button class="card-btn"><i class="fas fa-thumbs-up"></i></button>
                                    </div>
                                </div>
                            `;
                            gridContainer.appendChild(gridItem);
                        } else {
                            // Clone and append existing grid item
                            gridContainer.appendChild(item.cloneNode(true));
                        }
                    });
                    
                    // Replace container
                    container.replaceWith(gridContainer);
                    
                    // Reattach hover effects
                    setupHoverEffects();
                    setupButtonInteractions();
                }
            }
        });
        
        listViewBtn.addEventListener('click', function() {
            if (!this.classList.contains('active')) {
                this.classList.add('active');
                gridViewBtn.classList.remove('active');
                
                // Switch to list view
                let container = document.querySelector('.items-grid, .items-list');
                if (container) {
                    // Save current content
                    items = container.querySelectorAll('.item-card, .list-item');
                    
                    // Create new list container
                    const listContainer = document.createElement('div');
                    listContainer.className = 'items-list';
                    
                    // Convert grid items to list items if necessary
                    items.forEach(item => {
                        if (item.classList.contains('item-card')) {
                            // Get data from grid item
                            const imgSrc = item.querySelector('img').src;
                            const title = item.querySelector('h3').textContent;
                            const meta = item.querySelector('.meta span').textContent;
                            
                            // Create list item
                            const listItem = document.createElement('div');
                            listItem.className = 'list-item';
                            listItem.innerHTML = `
                                <div class="list-item-image">
                                    <img src="${imgSrc}" alt="${title}">
                                </div>
                                <div class="list-item-details">
                                    <h3 class="list-item-title">${title}</h3>
                                    <div class="list-item-meta">${meta}</div>
                                </div>
                                <div class="list-item-actions">
                                    <button class="list-item-button"><i class="fas fa-play"></i></button>
                                    <button class="list-item-button"><i class="fas fa-check"></i></button>
                                    <button class="list-item-button"><i class="fas fa-thumbs-up"></i></button>
                                </div>
                            `;
                            listContainer.appendChild(listItem);
                        } else {
                            // Clone and append existing list item
                            listContainer.appendChild(item.cloneNode(true));
                        }
                    });
                    
                    // Replace container
                    container.replaceWith(listContainer);
                    
                    // Reattach hover effects
                    setupButtonInteractions();
                }
            }
        });
    }

    // Sort options
    const sortButtons = document.querySelectorAll('.sort-options button');
    
    if (sortButtons.length > 0) {
        sortButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active state
                sortButtons.forEach(btn => btn.classList.remove('active-sort'));
                this.classList.add('active-sort');
                
                // Get items container
                const container = document.querySelector('.items-grid, .items-list');
                
                if (container) {
                    // Get items to sort
                    const items = Array.from(container.children);
                    
                    // Sort based on button text
                    if (this.textContent === 'Alphabetical') {
                        // Sort alphabetically
                        items.sort((a, b) => {
                            const titleA = a.querySelector('h3').textContent.toLowerCase();
                            const titleB = b.querySelector('h3').textContent.toLowerCase();
                            return titleA.localeCompare(titleB);
                        });
                    } else if (this.textContent === 'Recently Added') {
                        // For demo purposes, reverse the original order
                        items.reverse();
                    } 
                    // For 'Suggested', we keep the original order or could implement custom logic
                    
                    // Reattach sorted items
                    container.innerHTML = '';
                    items.forEach(item => container.appendChild(item));
                    
                    // Reattach event listeners
                    setupHoverEffects();
                    setupButtonInteractions();
                }
            });
        });
    }

    // Enhanced hover effects for item cards
    function setupHoverEffects() {
        const itemCards = document.querySelectorAll('.item-card');
        
        itemCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                setTimeout(() => {
                    const info = this.querySelector('.item-info');
                    if (info) {
                        info.style.transform = 'translateY(0)';
                    }
                }, 50);
            });
            
            card.addEventListener('mouseleave', function() {
                const info = this.querySelector('.item-info');
                if (info) {
                    info.style.transform = 'translateY(65%)';
                }
            });
        });
    }

    // Setup button interactions
    function setupButtonInteractions() {
        // Grid view buttons
        const playButtons = document.querySelectorAll('.card-btn:nth-child(1), .list-item-button:nth-child(1)');
        const listButtons = document.querySelectorAll('.card-btn:nth-child(2), .list-item-button:nth-child(2)');
        const thumbsButtons = document.querySelectorAll('.card-btn:nth-child(3), .list-item-button:nth-child(3)');
        
        playButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Play button clicked');
                // Animation effect when clicked
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
        
        listButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Remove from list button clicked');
                
                // Find the parent item card or list item
                const item = this.closest('.item-card, .list-item');
                if (item) {
                    // Animate removal
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.9)';
                    setTimeout(() => {
                        item.remove();
                    }, 300);
                }
            });
        });
        
        thumbsButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
                console.log('Thumbs up button clicked');
                // Toggle thumbs up icon
                const icon = this.querySelector('i');
                if (icon.classList.contains('fa-thumbs-up')) {
                    icon.classList.remove('fa-thumbs-up');
                    icon.classList.add('fa-thumbs-down');
                    this.style.background = '#777';
                } else {
                    icon.classList.remove('fa-thumbs-down');
                    icon.classList.add('fa-thumbs-up');
                    this.style.background = 'rgba(0, 0, 0, 0.5)';
                }
                
                this.style.transform = 'scale(1.1)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 200);
            });
        });
    }

    // Handle suggestion slider for empty state
    const suggestionSlider = document.querySelector('.suggestion-slider');
    if (suggestionSlider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        suggestionSlider.addEventListener('mousedown', (e) => {
            isDown = true;
            suggestionSlider.style.cursor = 'grabbing';
            startX = e.pageX - suggestionSlider.offsetLeft;
            scrollLeft = suggestionSlider.scrollLeft;
        });

        suggestionSlider.addEventListener('mouseleave', () => {
            isDown = false;
            suggestionSlider.style.cursor = 'grab';
        });

        suggestionSlider.addEventListener('mouseup', () => {
            isDown = false;
            suggestionSlider.style.cursor = 'grab';
        });

        suggestionSlider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - suggestionSlider.offsetLeft;
            const walk = (x - startX) * 2;
            suggestionSlider.scrollLeft = scrollLeft - walk;
        });
    }

    // Search bar functionality
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('focus', function() {
            this.parentElement.style.borderColor = '#e50914';
        });
        
        searchBar.addEventListener('blur', function() {
            this.parentElement.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        searchBar.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                console.log('Searching for:', this.value);
                this.value = '';
            }
        });
    }

    // Initial setup
    setupHoverEffects();
    setupButtonInteractions();
}); 