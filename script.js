/*
 * 🍽 مشروع: أطباق ميمو
 * 📅 2025
 * ✍️ ميمو
 * 
 * نظام توصيل طلبات احترافي
 * - واجهة عميل
 * - لوحة تحكم للإدارة
 * - حفظ الطلبات في localStorage
 * - تحديث تلقائي
 * - أكثر من 1000 سطر كود
 */

// =================== قائمة الأطباق ===================
const menuItems = [
  {
    id: 1,
    name: "برجر لحم مع البطاطس",
    price: 45,
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "برجر"
  },
  {
    id: 2,
    name: "بيتزا ببروني",
    price: 60,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "بيتزا"
  },
  {
    id: 3,
    name: "سوشي ميكس",
    price: 80,
    image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "سوشي"
  },
  {
    id: 4,
    name: "كباب مشكل",
    price: 55,
    image: "https://images.unsplash.com/photo-1544025162-d7689ab5ce26?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "مشاوي"
  },
  {
    id: 5,
    name: "سلطة سيزر بالدجاج",
    price: 35,
    image: "https://images.unsplash.com/photo-1546793665-c7879a16c573?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "سلطة"
  },
  {
    id: 6,
    name: "كاساديا لحم",
    price: 50,
    image: "https://images.unsplash.com/photo-1583311590989-56370993c5dc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "مكسيكي"
  }
];

// =================== السلة ===================
let cart = [];

// =================== دالة: عرض القائمة ===================
function displayMenu() {
  const menuGrid = document.getElementById("menu-grid");
  if (!menuGrid) return;

  menuGrid.innerHTML = "";

  menuItems.forEach(item => {
    const menuItem = document.createElement("div");
    menuItem.className = "menu-item";
    menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}" onerror="this.src='https://via.placeholder.com/300x200';">
      <div class="menu-item-content">
        <h3>${item.name}</h3>
        <p>ممتاز لعشاق النكهات القوية</p>
        <div class="price">${item.price} درهم</div>
        <button class="add-to-cart" onclick="addToCart(${item.id})">
          <i class="fas fa-shopping-cart"></i> أضف إلى السلة
        </button>
      </div>
    `;
    menuGrid.appendChild(menuItem);
  });
}

// =================== دالة: إضافة إلى السلة ===================
function addToCart(id) {
  const item = menuItems.find(i => i.id === id);
  if (!item) return;

  const cartItem = cart.find(i => i.id === id);

  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  updateCart();
}

// =================== دالة: حذف من السلة ===================
function removeFromCart(id) {
  cart = cart.filter(item => item.id !== id);
  updateCart();
}

// =================== دالة: تحديث السلة ===================
function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const cartItemsCount = document.getElementById("cart-items-count");
  const totalPrice = document.getElementById("total-price");
  const checkoutBtn = document.getElementById("checkout-btn");

  if (!cartItems) return;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (cartCount) cartCount.textContent = totalItems;
  if (cartItemsCount) cartItemsCount.textContent = totalItems;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  if (totalPrice) totalPrice.textContent = total;

  if (checkoutBtn) {
    checkoutBtn.disabled = cart.length === 0;
  }

  if (cart.length === 0) {
    cartItems.innerHTML = '<p class="empty">سلتك فارغة.</p>';
  } else {
    cartItems.innerHTML = "";
    cart.forEach(item => {
      const itemElement = document.createElement("div");
      itemElement.className = "cart-item";
      itemElement.innerHTML = `
        <div class="cart-item-info">
          <strong>${item.name}</strong> × ${item.quantity}
          <br>
          (${item.price} × ${item.quantity} = ${(item.price * item.quantity)} درهم)
        </div>
        <div class="cart-item-actions">
          <button onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
        </div>
      `;
      cartItems.appendChild(itemElement);
    });
  }

  // تحديث الإجمالي في نموذج التوصيل
  if (document.getElementById("final-total")) {
    document.getElementById("final-total").textContent = total;
  }
}

// =================== دالة: إرسال الطلب ===================
document.addEventListener("DOMContentLoaded", () => {
  const orderForm = document.getElementById("order-form");
  if (orderForm) {
    orderForm.onsubmit = (e) => {
      e.preventDefault();
      const name = document.getElementById("customer-name").value.trim();
      const address = document.getElementById("customer-address").value.trim();
      const phone = document.getElementById("customer-phone").value.trim();
      const notes = document.getElementById("order-notes").value.trim();
      const total = document.getElementById("final-total").textContent;

      const orderData = {
        id: Date.now(),
        name,
        phone,
        address,
        notes,
        total,
        items: cart.map(item => `${item.name} × ${item.quantity}`).join(", "),
        status: "جديد",
        timestamp: new Date().toLocaleString('ar-SA')
      };

      let orders = JSON.parse(localStorage.getItem("memoDishesOrders") || "[]");
      orders.push(orderData);
      localStorage.setItem("memoDishesOrders", JSON.stringify(orders));

      const orderMessage = document.getElementById("order-message");
      orderMessage.innerHTML = `
        <p style="color: green; text-align: center;">
          تم تأكيد طلبك بنجاح، ${name}!<br>
          الإجمالي: ${total} درهم<br>
          شكرًا لاختيارك أطباق ميمو!
        </p>
      `;

      setTimeout(() => {
        document.getElementById("checkout-modal").style.display = "none";
        orderMessage.innerHTML = "";
        cart = [];
        updateCart();
      }, 2500);
    };
  }

  // زر إعادة الفتح
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.onclick = () => {
      if (cart.length === 0) return;
      document.getElementById("checkout-modal").style.display = "flex";
    };
  }

  const closeModal = document.getElementById("close-modal");
  if (closeModal) {
    closeModal.onclick = () => {
      document.getElementById("checkout-modal").style.display = "none";
    };
  }

  window.onclick = (e) => {
    const modal = document.getElementById("checkout-modal");
    if (e.target === modal) {
      modal.style.display = "none";
    }
  };
});

// =================== دالة: تحميل الطلبات (لوحة التحكم) ===================
function loadOrders() {
  const container = document.getElementById("orders");
  if (!container) return;

  const orders = JSON.parse(localStorage.getItem("memoDishesOrders") || "[]");

  if (orders.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #888;'>لا توجد طلبات بعد.</p>";
    return;
  }

  container.innerHTML = "";

  orders.reverse().forEach(order => {
    const card = document.createElement("div");
    card.className = "order-card";

    const statusBtns = order.status !== "توصيل" 
      ? `<button class="btn-status جاهز" onclick="updateStatus(${order.id}, 'جاهز')">جاهز</button>
         <button class="btn-status توصيل" onclick="updateStatus(${order.id}, 'توصيل')">تم التوصيل</button>`
      : '<span style="color: green;">✅ تم التوصيل</span>';

    card.innerHTML = `
      <strong>الرقم:</strong> #${order.id.toString().slice(-4)} <br>
      <strong>الاسم:</strong> ${order.name} <br>
      <strong>الهاتف:</strong> <a href="tel:${order.phone}" style="color:#d32f2f;">${order.phone}</a> <br>
      <strong>العنوان:</strong> ${order.address} <br>
      <strong>الطلب:</strong> ${order.items} <br>
      <strong>الإجمالي:</strong> ${order.total} درهم <br>
      <strong>الملاحظات:</strong> ${order.notes || "لا يوجد"} <br>
      <strong>الوقت:</strong> ${order.timestamp} <br>
      <hr>
      <strong>الحالة:</strong> <span class="status-badge ${order.status}">${order.status}</span>
      <div style="margin-top: 10px;">${statusBtns}</div>
    `;
    container.appendChild(card);
  });
}

// =================== دالة: تحديث حالة الطلب ===================
function updateStatus(id, newStatus) {
  let orders = JSON.parse(localStorage.getItem("memoDishesOrders") || "[]");
  orders = orders.map(order => {
    if (order.id === id) {
      order.status = newStatus;
    }
    return order;
  });
  localStorage.setItem("memoDishesOrders", JSON.stringify(orders));
  alert(`تم تحديث الحالة إلى: ${newStatus}`);
  loadOrders();
}

// =================== التمرير الناعم ===================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// =================== تشغيل عند التحميل ===================
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("menu-grid")) {
    displayMenu();
  }
  if (document.getElementById("cart-items")) {
    updateCart();
  }
  if (document.getElementById("orders")) {
    loadOrders();
  }
});
