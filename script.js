/* =====================================================================
   TAR RESTAURANT - Restaurant Website JavaScript
   This file is beginner-friendly: every function has a comment above
   it explaining what it does and why, in plain English.
   ===================================================================== */

/* ---------------------------------------------------------------------
   1. NAVBAR SHRINK-ON-SCROLL
   What it does: when the visitor scrolls down more than 50 pixels,
   we add the class "navbar-scrolled" to the <nav> element. The CSS
   for that class (in style.css) makes the navbar shorter and adds a
   shadow, so it feels "compact" once the page is scrolled.
--------------------------------------------------------------------- */
function handleNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return; // safety check in case this page has no navbar

  if (window.scrollY > 50) {
    navbar.classList.add('navbar-scrolled');
  } else {
    navbar.classList.remove('navbar-scrolled');
  }
}

/* ---------------------------------------------------------------------
   2. ACTIVE NAV-LINK HIGHLIGHTING
   What it does: looks at the current page's file name (e.g. "menu.html")
   and adds the "active" class to the matching link in the navbar, so
   the visitor can see which page they are on.
--------------------------------------------------------------------- */
function highlightActiveNavLink() {
  // Get just the file name from the URL, e.g. "menu.html".
  // If the URL ends in "/", we treat that as "index.html".
  let currentPage = window.location.pathname.split('/').pop();
  if (currentPage === '') {
    currentPage = 'index.html';
  }

  const navLinks = document.querySelectorAll('.navbar .nav-link');
  navLinks.forEach(function (link) {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ---------------------------------------------------------------------
   3. GALLERY LIGHTBOX
   What it does: when a visitor clicks a small gallery thumbnail, we
   copy that image's "src" and "alt" into the Bootstrap Modal's <img>
   tag, so the modal shows a bigger version of the exact photo that
   was clicked. This only runs on gallery.html (it safely does nothing
   on other pages because it checks that the elements exist first).
--------------------------------------------------------------------- */
function initGalleryLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item img');
  const modalImage = document.getElementById('lightboxImage');
  const modalCaption = document.getElementById('lightboxCaption');

  if (!galleryItems.length || !modalImage) return; // not the gallery page

  galleryItems.forEach(function (thumbnail) {
    thumbnail.addEventListener('click', function () {
      // Use the large version stored in data-full if present,
      // otherwise fall back to the thumbnail's own src.
      modalImage.src = thumbnail.getAttribute('data-full') || thumbnail.src;
      modalImage.alt = thumbnail.alt;
      if (modalCaption) {
        modalCaption.textContent = thumbnail.alt;
      }
    });
  });
}

/* ---------------------------------------------------------------------
   4. RESERVATION FORM VALIDATION + FORMSPREE SUBMISSION
   What it does:
   a) Stops the browser from submitting the form if required fields
      are empty or invalid (Bootstrap's "was-validated" styling shows
      red borders + error messages under each field).
   b) If the form IS valid, sends the data to Formspree using fetch()
      instead of a normal page reload. This lets us show a friendly
      "Thank you" alert on the same page instead of redirecting the
      visitor away to Formspree's own confirmation page.
--------------------------------------------------------------------- */
function initReservationForm() {
  const form = document.getElementById('reservationForm');
  if (!form) return; // not the reservation page

  const successAlert = document.getElementById('formSuccessAlert');
  const errorAlert = document.getElementById('formErrorAlert');
  const submitButton = document.getElementById('reservationSubmitBtn');

  form.addEventListener('submit', function (event) {
    // Always stop the default browser submission first. We decide
    // manually below whether to send the data with fetch().
    event.preventDefault();
    event.stopPropagation();

    // Hide any old alerts from a previous attempt.
    if (successAlert) successAlert.classList.add('d-none');
    if (errorAlert) errorAlert.classList.add('d-none');

    // Bootstrap validation: if the browser says any field is invalid,
    // add "was-validated" so the red borders / feedback text appear,
    // and stop here without contacting Formspree.
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    form.classList.add('was-validated');

    // Show a "Sending..." state on the button so the user knows
    // something is happening.
    const originalButtonText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    const formData = new FormData(form);

    fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        // Asking Formspree for a JSON response (instead of an HTML
        // redirect page) is what lets us stay on this page.
        Accept: 'application/json'
      }
    })
      .then(function (response) {
        if (response.ok) {
          // Success: show the thank-you alert and reset the form.
          if (successAlert) successAlert.classList.remove('d-none');
          form.reset();
          form.classList.remove('was-validated');
        } else {
          // Formspree responded, but with an error (e.g. bad form ID).
          if (errorAlert) errorAlert.classList.remove('d-none');
        }
      })
      .catch(function () {
        // Network error (e.g. no internet connection).
        if (errorAlert) errorAlert.classList.remove('d-none');
      })
      .finally(function () {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      });
  });
}

/* ---------------------------------------------------------------------
   5. FLOATING WHATSAPP BUTTON
   What it does: creates a direct WhatsApp contact button on every page.
   WhatsApp links need the international number format without "+".
--------------------------------------------------------------------- */
function initWhatsAppButton() {
  if (document.getElementById('whatsappFloatButton')) return;

  const whatsappNumber = '237683408547';
  const message = encodeURIComponent('Hello Smile Food, I would like to make an inquiry.');
  const whatsappButton = document.createElement('a');

  whatsappButton.id = 'whatsappFloatButton';
  whatsappButton.className = 'whatsapp-float';
  whatsappButton.href = `https://wa.me/${whatsappNumber}?text=${message}`;
  whatsappButton.target = '_blank';
  whatsappButton.rel = 'noopener noreferrer';
  whatsappButton.setAttribute('aria-label', 'Chat with Smile Restaurant on WhatsApp');
  whatsappButton.innerHTML = '<i class="bi bi-whatsapp" aria-hidden="true"></i>';

  document.body.appendChild(whatsappButton);
}

/* ---------------------------------------------------------------------
   6. RULE-BASED RESTAURANT CHATBOT
   What it does: creates a floating chatbot on every page and answers
   common guest questions using local restaurant facts. It does not call
   an AI service or external API, so it works as a simple static-site
   feature.
--------------------------------------------------------------------- */
function initRestaurantChatbot() {
  if (document.getElementById('restaurantChatbot')) return;

  const restaurant = {
    name: 'Smile Food',
    location: 'Bonaberi, Douala, Cameroon',
    phone: '683408547',
    email: 'tchamgouestephane72@gmail.com',
    cuisine: 'Cameroon based meals, drinks, wines, and whiskeys',
    hours: [
      { day: 'Sunday', open: '10:00 AM', close: '9:00 PM', open24: 10, close24: 21 },
      { day: 'Monday', open: '11:00 AM', close: '10:00 PM', open24: 11, close24: 22 },
      { day: 'Tuesday', open: '11:00 AM', close: '10:00 PM', open24: 11, close24: 22 },
      { day: 'Wednesday', open: '11:00 AM', close: '10:00 PM', open24: 11, close24: 22 },
      { day: 'Thursday', open: '11:00 AM', close: '10:00 PM', open24: 11, close24: 22 },
      { day: 'Friday', open: '11:00 AM', close: '11:30 PM', open24: 11, close24: 23.5 },
      { day: 'Saturday', open: '10:00 AM', close: '11:30 PM', open24: 10, close24: 23.5 }
    ],
    menu: {
      starters: [
        { name: 'Plantain Chips & Pepper Dip', price: '1,500 FCFA', desc: 'Thin-fried plantain chips with a smoked tomato-pepper dip.' },
        { name: 'Koki Corn Bites', price: '1,800 FCFA', desc: 'Steamed corn and palm oil bites served with pepper sauce.' },
        { name: 'Boiled Groundnuts', price: '2,000 FCFA', desc: 'Warm salted groundnuts, served with fresh pepper and onions.' },
        { name: 'Smoked Fish Fritters', price: '2,500 FCFA', desc: 'Flaked smoked fish fritters, served with a spicy pepper dip.' }
      ],
      mains: [
        { name: 'Grilled Tilapia', price: '4,500 FCFA', desc: 'Whole tilapia grilled with pepper sauce, served with miondo or fried plantain.' },
        { name: 'Beef Suya', price: '3,800 FCFA', desc: 'Cameroon-style beef skewers grilled with suya spice, onions, and pepper.' },
        { name: 'Ndole & Plantains', price: '4,200 FCFA', desc: 'Bitterleaf stew with groundnuts, beef, and prawns, served with ripe plantains.' },
        { name: 'Poulet DG', price: '4,000 FCFA', desc: 'Chicken, ripe plantains, carrots, peppers, and onions in a rich Cameroon sauce.' },
        { name: 'Achu Soup', price: '3,500 FCFA', desc: 'Yellow soup with tender meat, cow skin, and pounded cocoyam.' }
      ],
      drinks: [
        { name: 'Bissap Ginger', price: '1,200 FCFA', desc: 'House-made hibiscus drink infused with fresh ginger, served chilled.' },
        { name: 'Fresh Pineapple Juice', price: '1,000 FCFA', desc: 'Pressed to order, no added sugar.' },
        { name: 'Cameroon Beer', price: '1,500 FCFA', desc: '33cl bottle, served ice cold.' },
        { name: 'Folly', price: '1,500 FCFA', desc: 'Traditional palm wine, served fresh when available.' }
      ],
      wine: [
        { name: 'House Red Wine', price: '2,500 FCFA', desc: 'Smooth red wine served by the glass.' },
        { name: 'House White Wine', price: '2,500 FCFA', desc: 'Crisp white wine served chilled by the glass.' },
        { name: 'Sweet Red Bottle', price: '12,000 FCFA', desc: 'A table bottle for grilled fish, chicken, and spicy dishes.' },
        { name: 'Sparkling Wine', price: '15,000 FCFA', desc: 'Light sparkling wine for celebrations and group tables.' }
      ],
      whiskeys: [
        { name: 'House Whiskey Shot', price: '2,000 FCFA', desc: 'Single measure served neat or on ice.' },
        { name: 'Premium Whiskey Shot', price: '3,500 FCFA', desc: 'Premium single measure served neat or with a mixer.' },
        { name: 'Whiskey & Soda', price: '3,000 FCFA', desc: 'Whiskey poured with soda and ice.' },
        { name: 'Whiskey Bottle Service', price: '25,000 FCFA', desc: 'Bottle service with ice and mixers for the table.' }
      ],
      desserts: [
        { name: 'Puff-Puff & Pepper Syrup', price: '1,500 FCFA', desc: 'Fresh puff-puff served warm with a light peppered syrup.' },
        { name: 'Caramelized Banana', price: '2,000 FCFA', desc: 'Sweet banana finished with groundnuts and cream.' },
        { name: 'Coconut Rice Pudding', price: '1,800 FCFA', desc: 'Warm rice pudding finished with toasted coconut flakes.' }
      ]
    }
  };

  const quickReplies = [
    'Popular dishes',
    'Opening hours',
    'Book a table',
    'Location',
    'Drinks',
    'Contact'
  ];

  const chat = document.createElement('section');
  chat.id = 'restaurantChatbot';
  chat.className = 'chatbot';
  chat.setAttribute('aria-label', 'Smile Food chatbot');
  chat.innerHTML = `
    <button class="chatbot-toggle" type="button" aria-label="Open chat" aria-expanded="false">
      <i class="bi bi-chat-dots-fill" aria-hidden="true"></i>
      <span class="chatbot-notification" aria-hidden="true"></span>
    </button>
    <div class="chatbot-window" role="dialog" aria-modal="false" aria-labelledby="chatbotTitle" hidden>
      <div class="chatbot-header">
        <div>
          <p class="chatbot-kicker mb-0">Smile Food</p>
          <h2 id="chatbotTitle">Guest Assistant</h2>
        </div>
        <button class="chatbot-close" type="button" aria-label="Close chat">
          <i class="bi bi-x-lg" aria-hidden="true"></i>
        </button>
      </div>
      <div class="chatbot-messages" role="log" aria-live="polite"></div>
      <div class="chatbot-quick-replies" aria-label="Quick questions"></div>
      <form class="chatbot-form">
        <label class="visually-hidden" for="chatbotInput">Ask  a question to Smile Restaurant</label>
        <input id="chatbotInput" class="chatbot-input" type="text" autocomplete="off" placeholder="Ask about menu, hours, booking...">
        <button class="chatbot-send" type="submit" aria-label="Send message">
          <i class="bi bi-send-fill" aria-hidden="true"></i>
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(chat);

  const toggle = chat.querySelector('.chatbot-toggle');
  const close = chat.querySelector('.chatbot-close');
  const windowEl = chat.querySelector('.chatbot-window');
  const messagesEl = chat.querySelector('.chatbot-messages');
  const quickRepliesEl = chat.querySelector('.chatbot-quick-replies');
  const form = chat.querySelector('.chatbot-form');
  const input = chat.querySelector('.chatbot-input');

  function normalize(text) {
    return text.toLowerCase().replace(/[^a-z0-9\s&-]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  function includesAny(text, words) {
    return words.some(function (word) {
      return text.includes(word);
    });
  }

  function allMenuItems() {
    return Object.keys(restaurant.menu).reduce(function (items, category) {
      return items.concat(restaurant.menu[category].map(function (item) {
        return Object.assign({ category: category }, item);
      }));
    }, []);
  }

  function formatItems(items) {
    return items.map(function (item) {
      return `<strong>${item.name}</strong> - ${item.price}<br><span>${item.desc}</span>`;
    }).join('<br><br>');
  }

  function getTodayHours() {
    return restaurant.hours[new Date().getDay()];
  }

  function getOpenStatus() {
    const now = new Date();
    const today = getTodayHours();
    const currentHour = now.getHours() + (now.getMinutes() / 60);
    const isOpen = currentHour >= today.open24 && currentHour < today.close24;
    const status = isOpen ? `We are open now until ${today.close}.` : `We are closed right now. Today we open ${today.open} - ${today.close}.`;
    return `${status}<br><br>Regular hours:<br>${restaurant.hours.map(function (day) {
      return `${day.day}: ${day.open} - ${day.close}`;
    }).join('<br>')}`;
  }

  function findMenuMatches(message) {
    const text = normalize(message);
    return allMenuItems().filter(function (item) {
      const itemText = normalize(`${item.name} ${item.desc} ${item.category}`);
      return itemText.split(' ').some(function (word) {
        return word.length > 3 && text.includes(word);
      }) || text.includes(normalize(item.name));
    });
  }

  function answerQuestion(message) {
    const text = normalize(message);
    const menuMatches = findMenuMatches(message);

    if (includesAny(text, ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'])) {
      return `Hello. I can help with ${restaurant.cuisine}, prices, opening hours, reservations, location, and contact details.`;
    }

    if (includesAny(text, ['open', 'opening', 'hours', 'time', 'close', 'closing', 'today'])) {
      return getOpenStatus();
    }

    if (includesAny(text, ['reserve', 'reservation', 'book', 'booking', 'table', 'seat'])) {
      return `You can book a table on the reservation page. We ask for your name, email, phone, number of guests, date, time, and any special requests.<br><br><a href="reservation.html">Open reservation form</a><br><br>You can also call ${restaurant.phone}.`;
    }

    if (includesAny(text, ['location', 'address', 'where', 'map', 'directions', 'bonaberi', 'douala'])) {
      return `${restaurant.name} is in ${restaurant.location}. The reservation page includes a map for Bonaberi, Douala.<br><br><a href="reservation.html">View map</a>`;
    }

    if (includesAny(text, ['phone', 'call', 'email', 'contact', 'whatsapp'])) {
      return `Contact ${restaurant.name}:<br>Phone: <a href="tel:${restaurant.phone}">${restaurant.phone}</a><br>Email: <a href="mailto:${restaurant.email}">${restaurant.email}</a>`;
    }

    if (includesAny(text, ['popular', 'recommend', 'best', 'favorite', 'special', 'signature'])) {
      return `Guest favorites include:<br><br>${formatItems([
        restaurant.menu.mains[0],
        restaurant.menu.mains[2],
        restaurant.menu.mains[1],
        restaurant.menu.drinks[0]
      ])}`;
    }

    if (includesAny(text, ['starter', 'appetizer', 'small chop', 'snack'])) {
      return `Starters:<br><br>${formatItems(restaurant.menu.starters)}`;
    }

    if (includesAny(text, ['main', 'meal', 'food', 'dish', 'dishes', 'lunch', 'dinner', 'cameroon food'])) {
      return `Main courses:<br><br>${formatItems(restaurant.menu.mains)}<br><br><a href="menu.html">See full menu</a>`;
    }

    if (includesAny(text, ['drink', 'juice', 'beer', 'bissap', 'folly', 'palm wine'])) {
      return `Drinks:<br><br>${formatItems(restaurant.menu.drinks)}`;
    }

    if (includesAny(text, ['wine', 'red wine', 'white wine', 'sparkling'])) {
      return `Wine options:<br><br>${formatItems(restaurant.menu.wine)}`;
    }

    if (includesAny(text, ['whiskey', 'whisky', 'shot', 'bottle service', 'soda'])) {
      return `Whiskey options:<br><br>${formatItems(restaurant.menu.whiskeys)}`;
    }

    if (includesAny(text, ['dessert', 'sweet', 'puff', 'banana', 'pudding'])) {
      return `Desserts:<br><br>${formatItems(restaurant.menu.desserts)}`;
    }

    if (menuMatches.length) {
      return `Here is what I found:<br><br>${formatItems(menuMatches.slice(0, 4))}`;
    }

    if (includesAny(text, ['menu', 'price', 'prices', 'cost', 'how much'])) {
      return `Our menu includes starters from 1,500 FCFA, main courses from 3,500 FCFA, drinks from 1,000 FCFA, wine from 2,500 FCFA, whiskeys from 2,000 FCFA, and desserts from 1,500 FCFA.<br><br><a href="menu.html">Open the menu</a>`;
    }

    if (includesAny(text, ['vegetarian', 'vegan', 'allergy', 'allergies', 'halal', 'gluten', 'peanut', 'groundnut'])) {
      return `Please tell the restaurant team about allergies or dietary needs before ordering. Some dishes include fish, beef, prawns, groundnuts, palm oil, pepper, or dairy. For specific confirmation, call ${restaurant.phone}.`;
    }

    if (includesAny(text, ['gallery', 'photo', 'photos', 'picture', 'pictures', 'image'])) {
      return `You can view photos of the dining room, grilled fish, bar area, terrace, dishes, and kitchen team in the gallery.<br><br><a href="gallery.html">Open gallery</a>`;
    }

    if (includesAny(text, ['thank', 'thanks'])) {
      return 'You are welcome. Ask me about bookings, menu prices, drinks, opening hours, or how to find us.';
    }

    return `I can help with menu items, prices, reservations, opening hours, location, gallery photos, and contact details.<br><br>Try asking: "What are your popular dishes?", "Are you open now?", or "How do I book a table?"`;
  }

  function addMessage(content, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chatbot-message chatbot-message-${sender}`;
    bubble.innerHTML = content;
    messagesEl.appendChild(bubble);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function sendUserMessage(message) {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;

    addMessage(cleanMessage.replace(/[<>&]/g, function (char) {
      return { '<': '&lt;', '>': '&gt;', '&': '&amp;' }[char];
    }), 'user');
    addMessage(answerQuestion(cleanMessage), 'bot');
  }

  function openChat() {
    windowEl.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    chat.classList.add('chatbot-open');
    input.focus();
  }

  function closeChat() {
    windowEl.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
    chat.classList.remove('chatbot-open');
    toggle.focus();
  }

  quickReplies.forEach(function (reply) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = reply;
    button.addEventListener('click', function () {
      openChat();
      sendUserMessage(reply);
    });
    quickRepliesEl.appendChild(button);
  });

  toggle.addEventListener('click', function () {
    if (windowEl.hidden) {
      openChat();
    } else {
      closeChat();
    }
  });

  close.addEventListener('click', closeChat);

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    sendUserMessage(input.value);
    input.value = '';
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !windowEl.hidden) {
      closeChat();
    }
  });

  addMessage(`Hello, I am the ${restaurant.name} assistant. Ask me about the menu, prices, opening hours, reservations, or our Bonaberi location.`, 'bot');
}

/* ---------------------------------------------------------------------
   RUN EVERYTHING ONCE THE PAGE HAS LOADED
--------------------------------------------------------------------- */
document.addEventListener('DOMContentLoaded', function () {
  highlightActiveNavLink();
  initGalleryLightbox();
  initReservationForm();
  initWhatsAppButton();
  initRestaurantChatbot();

  // Run once immediately in case the page is already scrolled
  // (e.g. the visitor reloaded mid-page), then keep listening.
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll);
});
