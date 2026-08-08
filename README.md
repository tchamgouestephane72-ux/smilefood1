# Tar Restaurant - Restaurant Website

A static Bootstrap restaurant website customized for **Tar Restaurant** in **Bonaberi, Douala, Cameroon**.

## Pages

- `index.html` - home page with hero, featured Cameroonian dishes, story, and opening hours
- `menu.html` - menu tabs for starters, main courses, drinks, wine, whiskeys, and desserts
- `gallery.html` - gallery with lightbox modal
- `reservation.html` - reservation form and Bonaberi map embed
- Floating WhatsApp button - opens a direct WhatsApp message to the restaurant
- Floating chatbot - appears on every page and answers common restaurant questions

## Restaurant Details

- Name: Tar Restaurant
- Location: Bonaberi, Douala, Cameroon
- Phone: 650770957
- Email: tarjoeltar@gmail.com
- Cuisine: Purely Cameroon based meals and drinks

## Editing Notes

- Update visible contact details in the footers of all HTML files if the phone number changes.
- Replace the placeholder Formspree endpoint in `reservation.html` with a real form ID before using the reservation form in production.
- Replace placeholder images from `https://placehold.co/` with real restaurant photos when available.
- Edit the WhatsApp number inside `initWhatsAppButton()` in `js/script.js` if the contact changes.
- Edit the restaurant facts, menu answers, and keyword rules inside `initRestaurantChatbot()` in `js/script.js`.

## Files

- `css/style.css` contains the visual styling and brand colors.
- `js/script.js` handles navbar highlighting, gallery lightbox behavior, reservation form submission, the WhatsApp button, and the rule-based chatbot.
