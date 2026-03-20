// Khởi tạo biến toàn cục
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const cartBadge = document.querySelector('.badge');
// Event listener cho nút đặt hàng
document.querySelectorAll('.order-btn').forEach(btn => {
    btn.addEventListener('click', handleAddToCart);
});
// Cập nhật badge khi tải trang
document.addEventListener('DOMContentLoaded', function() {
    updateCartBadge();
    setupEventListeners();
    // Hiển thị section mặc định (home)
    showSection('home');
});
// Xử lý gửi form liên hệ
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Ở đây bạn sẽ thêm code để xử lý việc gửi form
    // Ví dụ: gửi dữ liệu đến server hoặc hiển thị thông báo
    alert('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!');
    this.reset(); // Reset form sau khi gửi
});

// Thiết lập các event listeners
function setupEventListeners() {
    // Event listeners cho navbar links
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
    // Event listener cho nút đặt hàng
    document.querySelectorAll('.order-btn').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Event listener cho icon giỏ hàng
    const cartIcon = document.getElementById('cartIcon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            showCartSection();
        });
    }
    const closeCartBtn = document.getElementById('closeCart');
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCart);
    }

    // Event listener cho nút tìm kiếm trong menu
    const searchInput = document.getElementById('menuSearch');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Event listeners cho menu filters
    document.querySelectorAll('.menu-filters .btn').forEach(btn => {
        btn.addEventListener('click', handleFilterClick);
    });

    // Event listeners cho navbar links
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
}



function updateActiveNavLink(sectionId) {
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    const activeLink = document.querySelector(`.navbar-nav .nav-link[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
}

// Xử lý thêm vào giỏ hàng
function handleAddToCart(e) {
    const card = this.closest('.card');
    const imgSrc = card.querySelector('.card-img-top').getAttribute('src'); // Lấy đường dẫn ảnh đầy đủ
    
    const item = {
        id: Date.now(),
        name: card.querySelector('.card-title').textContent,
        price: card.querySelector('.card-price, .card-text strong').textContent,
        image: imgSrc, // Sử dụng đường dẫn ảnh đầy đủ
        quantity: 1
    };

    addToCart(item);
    createAddToCartAnimation(this);
    showToast(`Đã thêm ${item.name} vào giỏ hàng!`);
}

// Thêm vào giỏ hàng
function addToCart(item) {
    const existingItem = cart.find(cartItem => cartItem.name === item.name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(item);
    }

    updateCartBadge();
    saveCart();
}

// Cập nhật số lượng badge
function updateCartBadge() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'inline' : 'none';
}

// Lưu giỏ hàng vào localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Hiển thị section giỏ hàng
function showCartSection() {
    const cartOverlay = document.getElementById('cartOverlay');
    cartOverlay.style.display = 'flex';
    document.body.classList.add('modal-open'); // Thêm class khi mở giỏ hàng
    renderCart();
}
function closeCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.style.display = 'none';
        document.body.classList.remove('modal-open'); // Xóa class khi đóng giỏ hàng
    }
}
document.addEventListener('DOMContentLoaded', function() {
    const cartOverlay = document.getElementById('cartOverlay');
    const cartModal = document.getElementById('cartModal');

    if (cartOverlay && cartModal) {
        cartOverlay.addEventListener('click', function(e) {
            if (e.target === cartOverlay) {
                closeCart();
            }
        });
    }
});
// Render giỏ hàng
function renderCart() {
    const cartContent = document.getElementById('cartContent');
    const cartSummary = document.getElementById('cartSummary');

    if (!cart.length) {
        cartContent.innerHTML = `
            <div class="text-center py-5">
                <h3>Giỏ hàng trống</h3>
                <button class="btn btn-primary mt-3" onclick="continueShopping()">
                    Tiếp tục mua sắm
                </button>
            </div>
        `;
        cartSummary.innerHTML = '';
        return;
    }

    cartContent.innerHTML = `
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map((item, index) => generateCartItemHTML(item, index)).join('')}
                </tbody>
            </table>
        </div>
    `;

    renderCartSummary();
}
function closeCart() {
    const cartOverlay = document.getElementById('cartOverlay');
    if (cartOverlay) {
        cartOverlay.style.display = 'none';
    }
}
// Tạo HTML cho item trong giỏ hàng
function generateCartItemHTML(item, index) {
    return `
        <tr>
            <td>
                <div class="d-flex align-items-center">
                    <img src="${item.image}" 
                         alt="${item.name}" 
                         style="width: 50px; height: 50px; object-fit: cover;"
                         onerror="this.src='images/placeholder.jpg'"> <!-- Thêm ảnh dự phòng -->
                    <span class="ms-2">${item.name}</span>
                </div>
            </td>
            <td>${item.price}</td>
            <td>
                <div class="btn-group">
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, -1)">-</button>
                    <span class="btn btn-sm">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </td>
            <td>${calculateItemTotal(item)}</td>
            <td>
                <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `;
}

// Render tổng giỏ hàng
function renderCartSummary() {
    const cartSummary = document.getElementById('cartSummary');
    const subtotal = calculateSubtotal();
    const shipping = 30000; // Phí ship cố định
    const total = subtotal + shipping;

    cartSummary.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Tổng đơn hàng</h4>
                <div class="d-flex justify-content-between mb-2">
                    <span>Tạm tính:</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển:</span>
                                        <span>${formatPrice(shipping)}</span>
                </div>
                <div class="d-flex justify-content-between fw-bold">
                    <span>Tổng cộng:</span>
                    <span>${formatPrice(total)}</span>
                </div>
                <button class="btn btn-primary w-100 mt-3" onclick="checkout()">
                    Thanh toán
                </button>
            </div>
        </div>
    `;
}

// Cập nhật số lượng sản phẩm
function updateQuantity(index, change) {
    const item = cart[index];
    const newQuantity = item.quantity + change;

    if (newQuantity > 0) {
        item.quantity = newQuantity;
        saveCart();
        updateCartBadge();
        renderCart();
    } else if (newQuantity === 0) {
        removeItem(index);
    }
}

// Xóa sản phẩm khỏi giỏ hàng
function removeItem(index) {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        cart.splice(index, 1);
        saveCart();
        updateCartBadge();
        renderCart();
    }
}

// Tính tổng tiền của một sản phẩm
function calculateItemTotal(item) {
    const price = parseInt(item.price.replace(/\D/g, ''));
    return formatPrice(price * item.quantity);
}

// Tính tổng tiền giỏ hàng
function calculateSubtotal() {
    return cart.reduce((sum, item) => {
        const price = parseInt(item.price.replace(/\D/g, ''));
        return sum + (price * item.quantity);
    }, 0);
}

// Format giá tiền
function formatPrice(price) {
    return price.toLocaleString('vi-VN') + 'đ';
}

// Hiệu ứng thêm vào giỏ hàng
function createAddToCartAnimation(button) {
    const card = button.closest('.card');
    const img = card.querySelector('.card-img-top');
    const cartIcon = document.querySelector('.fa-shopping-cart');

    if (!img || !cartIcon) return;

    const imgClone = img.cloneNode(true);
    const imgRect = img.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    imgClone.style.cssText = `
        position: fixed;
        top: ${imgRect.top}px;
        left: ${imgRect.left}px;
        width: ${imgRect.width}px;
        height: ${imgRect.height}px;
        z-index: 1000;
        transition: all 0.8s ease;
        pointer-events: none;
    `;

    document.body.appendChild(imgClone);

    requestAnimationFrame(() => {
        imgClone.style.cssText += `
            top: ${cartRect.top}px;
            left: ${cartRect.left}px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            opacity: 0;
        `;
    });

    setTimeout(() => imgClone.remove(), 800);
}

// Hiển thị thông báo
function showToast(message) {
    const toastContainer = document.getElementById('toastContainer') || createToastContainer();
    
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `
        <div class="toast-header">
            <strong class="me-auto">Thông báo</strong>
            <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">
            ${message}
        </div>
    `;

    toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Tạo container cho toast
function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1050;
    `;
    document.body.appendChild(container);
    return container;
}

// Xử lý thanh toán
function checkout() {
    const checkoutModal = `
        <div class="modal fade" id="checkoutModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Thông tin thanh toán</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="checkoutForm">
                            <div class="mb-3">
                                <label class="form-label">Họ tên</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Số điện thoại</label>
                                <input type="tel" class="form-control" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Địa chỉ</label>
                                <textarea class="form-control" required></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Phương thức thanh toán</label>
                                <select class="form-select" required>
                                    <option value="">Chọn phương thức thanh toán</option>
                                    <option value="cod">Thanh toán khi nhận hàng</option>
                                    <option value="banking">Chuyển khoản ngân hàng</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                        <button type="button" class="btn btn-primary" onclick="processOrder()">Đặt hàng</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Thêm modal vào body nếu chưa tồn tại
    if (!document.getElementById('checkoutModal')) {
        document.body.insertAdjacentHTML('beforeend', checkoutModal);
    }

    const modal = new bootstrap.Modal(document.getElementById('checkoutModal'));
    modal.show();
}

// Xử lý đặt hàng
function processOrder() {
    const form = document.getElementById('checkoutForm');
    if (form.checkValidity()) {
        // Xử lý đơn hàng
        cart = [];
        localStorage.removeItem('cart');
        updateCartBadge();
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
        modal.hide();
        
        showToast('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
        renderCart();
    } else {
        form.reportValidity();
    }
}

// Xử lý tìm kiếm
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach(item => {
        const title = item.querySelector('.card-title').textContent.toLowerCase();
        const description = item.querySelector('.card-text').textContent.toLowerCase();
        const matches = title.includes(searchTerm) || description.includes(searchTerm);
        item.style.display = matches ? '' : 'none';
    });
}

// Xử lý filter menu
function handleFilterClick(e) {
    e.preventDefault();
    const filterValue = this.getAttribute('data-filter');
    const menuItems = document.querySelectorAll('.menu-item');

    document.querySelectorAll('.menu-filters .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    this.classList.add('active');

    menuItems.forEach(item => {
        if (filterValue === 'all' || item.dataset.category === filterValue) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// Thêm hàm để hiển thị section menu và reset filter
function showMenuSection() {
    showSection('menu');

    // Reset filter to show all items
    const allFilterBtn = document.querySelector('.menu-filters .btn[data-filter="all"]');
    if (allFilterBtn) {
        allFilterBtn.click();
    }

    // Clear search input
    const searchInput = document.getElementById('menuSearch');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }
}

// Hàm để hiển thị section được chọn
function showSection(sectionId) {
    // Ẩn tất cả các section
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    // Hiển thị section được chọn
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
        selectedSection.classList.add('active');
        
        // Cuộn đến section được chọn
        window.scrollTo({
            top: selectedSection.offsetTop - document.querySelector('.navbar').offsetHeight,
            behavior: 'smooth'
        });
    }

    // Cập nhật trạng thái active cho các liên kết trong navbar
    updateActiveNavLink(sectionId);
}

// Thêm hàm để xử lý sự kiện khi người dùng nhấn nút "Tiếp tục mua sắm"
function continueShopping() {
    console.log('Continuing shopping...'); // Log để debug
    closeCart(); // Đóng giỏ hàng
    showMenuSection(); // Hiển thị section menu
}

function renderCart() {
    const cartContent = document.getElementById('cartContent');
    const cartSummary = document.getElementById('cartSummary');

    if (!cart.length) {
        cartContent.innerHTML = `
            <div class="text-center py-5">
                <h3>Giỏ hàng trống</h3>
                <button class="btn btn-primary mt-3" onclick="continueShopping()">
                    Tiếp tục mua sắm
                </button>
            </div>
        `;
        cartSummary.innerHTML = '';
        return;
    }

    cartContent.innerHTML = `
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${cart.map((item, index) => generateCartItemHTML(item, index)).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Cập nhật phần cartSummary để bao gồm nút "Tiếp tục mua sắm"
    const subtotal = calculateSubtotal();
    const shipping = 30000; // Phí ship cố định
    const total = subtotal + shipping;

    cartSummary.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">Tổng đơn hàng</h4>
                <div class="d-flex justify-content-between mb-2">
                    <span>Tạm tính:</span>
                    <span>${formatPrice(subtotal)}</span>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển:</span>
                    <span>${formatPrice(shipping)}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between fw-bold mb-3">
                    <span>Tổng cộng:</span>
                    <span>${formatPrice(total)}</span>
                </div>
                <div class="d-grid gap-2">
                    <button class="btn btn-primary" onclick="checkout()">
                        <i class="fas fa-shopping-cart me-2"></i>Thanh toán
                    </button>
                    <button class="btn btn-outline-secondary" onclick="continueShopping()">
                        <i class="fas fa-arrow-left me-2"></i>Tiếp tục mua sắm
                    </button>
                </div>
            </div>
        </div>
    `;
}
// Thêm hàm để xử lý việc đóng modal checkout
function closeCheckoutModal() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('checkoutModal'));
    if (modal) {
        modal.hide();
    }
}

// Cập nhật hàm processOrder để đóng modal sau khi đặt hàng thành công
function processOrder() {
    const form = document.getElementById('checkoutForm');
    if (form.checkValidity()) {
        // Xử lý đơn hàng
        cart = [];
        localStorage.removeItem('cart');
        updateCartBadge();
        
        closeCheckoutModal();
        
        showToast('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
        showSection('home'); // Chuyển về trang chủ sau khi đặt hàng
    } else {
        form.reportValidity();
    }
}
                    // Thêm vào file scripts.js
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (email) {
        alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi ưu đãi đến ' + email);
        this.reset();
    }
});
// Xử lý form newsletter
document.querySelector('.newsletter-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (email) {
        alert('Cảm ơn bạn đã đăng ký! Chúng tôi sẽ gửi ưu đãi đến ' + email);
        this.reset();
    }
});

// Đảm bảo các section được hiển thị khi tải trang
document.addEventListener('DOMContentLoaded', function() {
    const sections = [
        'testimonials',
        'blog-posts',
        'events',
        'location',
        'newsletter'
    ];

    sections.forEach(section => {
        const element = document.querySelector('.' + section);
        if (element) {
            element.style.display = 'block';
            element.style.visibility = 'visible';
        }
    });
});