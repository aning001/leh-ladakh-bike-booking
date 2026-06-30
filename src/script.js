/**
 * Leh Ladakh Bike Booking - Ladakh Mountain Adventures Interactive Controller
 * Native ES6 JavaScript (No frameworks, perfectly optimized for local hosting)
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initPageSwitcher();
  initBikeTiltEffects();
  initInteractiveMap();
  initBookingSystem();
  initAvailabilityTickers();
  initFloatingChatbot();
  initChecklistTracker();
  initArticlesSection();
  initAddonsSection();
});

/* ==========================================
   1. NAVIGATION & MOBILE HAMBURGER
   ========================================== */
function initNavigation() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky header on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = hamburger.querySelector('svg');
      if (icon) {
        // Toggle lucide menu/x icon if present
        if (navMenu.classList.contains('active')) {
          icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
        } else {
          icon.innerHTML = '<line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line>';
        }
      }
    });
  }

  // Close mobile menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu) navMenu.classList.remove('active');
      const icon = hamburger ? hamburger.querySelector('svg') : null;
      if (icon) {
        icon.innerHTML = '<line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line>';
      }
    });
  });
}

/* ==========================================
   2. SINGLE-PAGE / MULTI-PAGE ROUTING
   ========================================== */
function initPageSwitcher() {
  const navLinks = document.querySelectorAll('.nav-link, .btn-nav-book, .btn-primary, .btn-secondary, .btn-card-book, .footer-link');
  const pages = document.querySelectorAll('.page-section');

  function switchPage(targetId) {
    const activePage = document.querySelector('.page-section.active');
    
    // Validate target exists
    const targetPage = document.getElementById(targetId);
    if (!targetPage) return;

    // Remove active from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
      if (link.getAttribute('href') === `#${targetId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    if (activePage) {
      // Fade out current page
      activePage.style.opacity = '0';
      activePage.style.transform = 'translateY(15px)';
      
      setTimeout(() => {
        activePage.classList.remove('active');
        
        // Fade in target page
        targetPage.classList.add('active');
        // Trigger reflow
        targetPage.offsetHeight;
        targetPage.style.opacity = '1';
        targetPage.style.transform = 'translateY(0)';
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    } else {
      // Direct activate
      targetPage.classList.add('active');
      targetPage.style.opacity = '1';
      targetPage.style.transform = 'translateY(0)';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  // Router listener on element clicks
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const targetId = href.substring(1);
        switchPage(targetId);
        
        // Update URL hash without jumping
        history.pushState(null, null, href);
      }
    });
  });

  // Back/Forward support & direct linking
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash || '#home';
    switchPage(hash.substring(1));
  });

  // Initial load navigation
  const initialHash = window.location.hash || '#home';
  switchPage(initialHash.substring(1));
}

/* ==========================================
   3. 3D CARD TILT EFFECT (MOUSEMOVE SENSOR)
   ========================================== */
function initBikeTiltEffects() {
  const cards = document.querySelectorAll('.bike-card');
  
  // Apply 3D tilt calculations
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within card
      const y = e.clientY - rect.top;  // y position within card
      
      const width = rect.width;
      const height = rect.height;
      
      // Calculate rotation factors (-10deg to 10deg max)
      const rotateY = ((x / width) - 0.5) * 15;
      const rotateX = (((y / height) - 0.5) * -15);
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    
    // Reset position on leave
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    card.addEventListener('mouseenter', () => {
      card.style.transition = 'none'; // snappy tracking while mouse inside
    });
  });
}

/* ==========================================
   4. INTERACTIVE ROUTE MAP & TOURIST SPOTS
   ========================================== */
const ROUTE_DATA = {
  pangong: {
    title: "Leh to Pangong Tso Circuit",
    sub: "Pristine Saltwater Alpine Lake Explorer",
    distance: "160 Km",
    duration: "5.5 Hours",
    altitude: "14,270 ft",
    difficulty: "Challenging",
    spots: ["Chang La Pass (17,688 ft)", "Tangtse", "Spangmik", "Pangong Lake"],
    desc: "Embark on an epic adventure crossing the mighty Chang La, the third highest motorable pass in the world. Traverse winding gravel switchbacks and high-altitude valleys to behold the iconic, changing turquoise-blue waters of Pangong Tso. A classic Ladakh bullet trek."
  },
  khardungla: {
    title: "The Khardung La High Climb",
    sub: "Scale the Roof of the Motorable World",
    distance: "40 Km",
    duration: "2 Hours",
    altitude: "17,582 ft",
    difficulty: "Extreme Climb",
    spots: ["Leh Base", "South Pullu Guard post", "Khardung La Top", "North Pullu"],
    desc: "Conquer the crown jewel of motorcycle treks! Climb from Leh directly to Khardung La Pass at 17,582 ft. The steep altitude gains and rugged glacial snowmelt pathways demand a highly capable motorcycle with good ground clearance like the Royal Enfield Himalayan."
  },
  nubra: {
    title: "Nubra Valley & Sand Dunes Route",
    sub: "Double-Humped Camels & Cold Desert Oasis",
    distance: "125 Km",
    duration: "4.5 Hours",
    altitude: "10,000 ft",
    difficulty: "Moderate",
    spots: ["Khardung La", "Hunder Sand Dunes", "Diskit Monastery", "Turtuk"],
    desc: "Descend from the high passes into the magnificent, sprawling cold desert of Nubra. Ride along the Shyok River, glide over the desert sands of Hunder on your bike, and observe the giant Buddha of Diskit. Recommended for a comfortable, multi-day adventure."
  },
  magnetic: {
    title: "Magnetic Hill & Sham Valley Loop",
    sub: "Gravity Defying Wonders & Sangam Confluence",
    distance: "50 Km",
    duration: "1.5 Hours",
    altitude: "11,000 ft",
    difficulty: "Easy / Cruising",
    spots: ["Spituk Monastery", "Magnetic Hill", "Indus-Zanskar Sangam", "Gurudwara Pathar Sahib"],
    desc: "A beautifully paved, smooth cruising highway loop. Stand witness to the gravity-defying Magnetic Hill and marvel at the breathtaking emerald-green confluence of the Indus and Zanskar rivers. Ideal for Classic Bullet cruising and acclimatization."
  }
};

function initInteractiveMap() {
  const mapNodes = document.querySelectorAll('.map-node');
  const mapRoutes = document.querySelectorAll('.map-route-line');
  const routePills = document.querySelectorAll('.btn-route-select');
  
  const rTitle = document.getElementById('r-title');
  const rSub = document.getElementById('r-sub');
  const rDistance = document.getElementById('r-distance');
  const rDuration = document.getElementById('r-duration');
  const rAltitude = document.getElementById('r-altitude');
  const rDifficulty = document.getElementById('r-difficulty');
  const rDesc = document.getElementById('r-desc');
  const rSpotsContainer = document.getElementById('r-spots');

  function updateRouteUI(routeKey) {
    const data = ROUTE_DATA[routeKey];
    if (!data) return;

    // 1. Update active states on map nodes & lines
    mapNodes.forEach(node => {
      if (node.getAttribute('data-route') === routeKey) {
        node.classList.add('active');
      } else {
        node.classList.remove('active');
      }
    });

    mapRoutes.forEach(route => {
      if (route.getAttribute('data-route') === routeKey) {
        route.classList.add('active');
      } else {
        route.classList.remove('active');
      }
    });

    routePills.forEach(pill => {
      if (pill.getAttribute('data-route') === routeKey) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // 2. Animate and update text elements
    const elementsToAnimate = [rTitle, rSub, rDistance, rDuration, rAltitude, rDifficulty, rDesc, rSpotsContainer];
    elementsToAnimate.forEach(el => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(6px)';
        el.style.transition = 'all 0.3s ease';
      }
    });

    setTimeout(() => {
      if (rTitle) rTitle.textContent = data.title;
      if (rSub) rSub.textContent = data.sub;
      if (rDistance) rDistance.textContent = data.distance;
      if (rDuration) rDuration.textContent = data.duration;
      if (rAltitude) rAltitude.textContent = data.altitude;
      if (rDifficulty) rDifficulty.textContent = data.difficulty;
      if (rDesc) rDesc.textContent = data.desc;

      // Update spot tags
      if (rSpotsContainer) {
        rSpotsContainer.innerHTML = '';
        data.spots.forEach(spot => {
          const tag = document.createElement('span');
          tag.className = 'spot-tag';
          tag.textContent = spot;
          rSpotsContainer.appendChild(tag);
        });
      }

      elementsToAnimate.forEach(el => {
        if (el) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
        }
      });
    }, 200);
  }

  // Event handlers for Map nodes click
  mapNodes.forEach(node => {
    node.addEventListener('click', () => {
      const routeKey = node.getAttribute('data-route');
      if (routeKey) updateRouteUI(routeKey);
    });
  });

  // Event handlers for Map route lines click
  mapRoutes.forEach(route => {
    route.addEventListener('click', () => {
      const routeKey = route.getAttribute('data-route');
      if (routeKey) updateRouteUI(routeKey);
    });
  });

  // Quick Select buttons
  routePills.forEach(pill => {
    pill.addEventListener('click', () => {
      const routeKey = pill.getAttribute('data-route');
      if (routeKey) updateRouteUI(routeKey);
    });
  });

  // Initialize with Pangong
  updateRouteUI('pangong');
}

/* ==========================================
   5. REAL-TIME BOOKING PRICER & WHATSAPP
   ========================================== */
const BIKE_PRICES = {
  himalayan450: { name: "Royal Enfield Himalayan 450", price: 2100 },
  himalayan411: { name: "Royal Enfield Himalayan 411", price: 1800 },
  bullet500: { name: "Royal Enfield Bullet 500 Classic", price: 1600 },
  bullet350: { name: "Royal Enfield Bullet 350 Standard", price: 1300 },
  scram411: { name: "Royal Enfield Scram 411", price: 1500 },
  xpulse200: { name: "Hero XPulse 200 4V", price: 1400 },
  hunter350: { name: "Royal Enfield Hunter 350", price: 1200 },
  ktm390: { name: "KTM 390 Adventure", price: 2200 },
  bmw310: { name: "BMW G310 GS", price: 2400 }
};

const ADDON_PRICES = {
  pillionHelmet: 150,
  saddleBags: 200,
  ridingGears: 350,
  goproMount: 100
};

function initBookingSystem() {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const bikeSelect = document.getElementById('formBike');
  const startDateInput = document.getElementById('formStartDate');
  const endDateInput = document.getElementById('formEndDate');
  const quantityInput = document.getElementById('formQuantity');
  const addonsCheckboxes = document.querySelectorAll('.addon-checkbox');

  // Summary Elements
  const summaryBike = document.getElementById('sumBike');
  const summaryDuration = document.getElementById('sumDuration');
  const summaryDailyRate = document.getElementById('sumDailyRate');
  const summaryAddons = document.getElementById('sumAddons');
  const summaryTotal = document.getElementById('sumTotal');

  // Pre-fill fields when booking button from catalog is clicked
  const selectBikeButtons = document.querySelectorAll('.btn-card-book, .btn-primary');
  selectBikeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetBike = btn.getAttribute('data-bike');
      if (targetBike && bikeSelect) {
        bikeSelect.value = targetBike;
        updatePricing();
      }
    });
  });

  // Set default dates (tomorrow to +5 days)
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const endDefault = new Date(tomorrow);
  endDefault.setDate(endDefault.getDate() + 5);

  if (startDateInput && endDateInput) {
    startDateInput.min = today.toISOString().split('T')[0];
    startDateInput.value = tomorrow.toISOString().split('T')[0];
    endDateInput.min = tomorrow.toISOString().split('T')[0];
    endDateInput.value = endDefault.toISOString().split('T')[0];
  }

  function updatePricing() {
    if (!bikeSelect || !startDateInput || !endDateInput || !quantityInput) return;

    const bikeKey = bikeSelect.value;
    const qty = parseInt(quantityInput.value) || 1;
    const startVal = startDateInput.value;
    const endVal = endDateInput.value;

    const bikeInfo = BIKE_PRICES[bikeKey] || BIKE_PRICES.himalayan450;
    const dailyPrice = bikeInfo.price;

    // Calculate duration
    let days = 1;
    if (startVal && endVal) {
      const start = new Date(startVal);
      const end = new Date(endVal);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      days = diffDays > 0 ? diffDays : 1;
    }

    // Addons Cost
    let dailyAddonsPrice = 0;
    const activeAddonsNames = [];
    addonsCheckboxes.forEach(cb => {
      if (cb.checked) {
        const addonKey = cb.value;
        const rate = ADDON_PRICES[addonKey] || 0;
        dailyAddonsPrice += rate;
        activeAddonsNames.push(cb.getAttribute('data-name') || addonKey);
      }
    });

    // Final calculations
    const bikeSubtotal = dailyPrice * days * qty;
    const addonSubtotal = dailyAddonsPrice * days * qty;
    const finalTotal = bikeSubtotal + addonSubtotal;

    // Update Summary panel
    if (summaryBike) summaryBike.textContent = `${bikeInfo.name} (x${qty})`;
    if (summaryDuration) summaryDuration.textContent = `${days} Day${days > 1 ? 's' : ''}`;
    if (summaryDailyRate) summaryDailyRate.textContent = `₹${dailyPrice.toLocaleString()}/day`;
    if (summaryAddons) {
      if (activeAddonsNames.length > 0) {
        summaryAddons.textContent = `₹${dailyAddonsPrice.toLocaleString()}/day (Add-ons)`;
      } else {
        summaryAddons.textContent = "None selected";
      }
    }
    if (summaryTotal) summaryTotal.textContent = `₹${finalTotal.toLocaleString()}`;

    return {
      bikeName: bikeInfo.name,
      qty,
      days,
      startDate: startVal,
      endDate: endVal,
      addons: activeAddonsNames,
      total: finalTotal
    };
  }

  // Add listeners
  if (bikeSelect) bikeSelect.addEventListener('change', updatePricing);
  if (startDateInput) startDateInput.addEventListener('change', () => {
    if (endDateInput) {
      endDateInput.min = startDateInput.value;
      if (new Date(endDateInput.value) < new Date(startDateInput.value)) {
        const nextDay = new Date(startDateInput.value);
        nextDay.setDate(nextDay.getDate() + 1);
        endDateInput.value = nextDay.toISOString().split('T')[0];
      }
    }
    updatePricing();
  });
  if (endDateInput) endDateInput.addEventListener('change', updatePricing);
  if (quantityInput) quantityInput.addEventListener('change', updatePricing);
  addonsCheckboxes.forEach(cb => cb.addEventListener('change', updatePricing));

  // WhatsApp Submition
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('formName').value.trim();
    const phone = document.getElementById('formPhone').value.trim();
    const route = document.getElementById('formRoute').value;

    if (!name || !phone) {
      alert("Please enter your name and phone number to request booking details.");
      return;
    }

    const priceData = updatePricing();
    if (!priceData) return;

    // Build elegant, professional message layout for WhatsApp
    const message = `🏔️ *LEH LADAKH BIKE BOOKING - RESERVATION REQUEST* 🏔️
-----------------------------------
👤 *Rider:* ${name}
📞 *Contact Number:* ${phone}

🏍️ *Selected Motorcycle:* ${priceData.bikeName}
🔢 *Number of Bikes:* ${priceData.qty} unit(s)

📅 *Rental Duration:* ${priceData.days} Day(s)
🏁 *Adventure Tour Start:* ${formatDate(priceData.startDate)}
🏁 *Adventure Tour Return:* ${formatDate(priceData.endDate)}

🛣️ *Planned Ladakh Route:* ${route}
🎒 *Riding Accessories Selected:* ${priceData.addons.length > 0 ? priceData.addons.join(', ') : 'None'}

💰 *Estimated Mountain Quote:* ₹${priceData.total.toLocaleString()}
-----------------------------------
*Hey, I would like to block this ride with Leh Ladakh Bike Booking for my mountain trip! Please confirm real-time availability.*`;

    // Encode URI
    const encodedMsg = encodeURIComponent(message);
    
    // Professional Ladakh contact line (e.g. +91 62871 68644 placeholder, or live user input)
    // Using a clear professional default number
    const targetPhone = "916287168644";
    const waUrl = `https://wa.me/${targetPhone}?text=${encodedMsg}`;

    // Smooth opening
    window.open(waUrl, '_blank');
  });

  // Helper date formatter
  function formatDate(dateStr) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  }

  // Initialize calculations
  updatePricing();
}

/* ==========================================
   6. REAL-TIME AVAILABILITY TICKER
   ========================================== */
function initAvailabilityTickers() {
  const dots = document.querySelectorAll('.avail-dot');
  
  // Slightly randomize bike counts over time to show "real-time dynamic vibe"
  setInterval(() => {
    dots.forEach(dot => {
      const badge = dot.closest('.bike-availability');
      if (badge) {
        const textNode = badge.querySelector('.avail-text');
        if (textNode) {
          // Parse current count
          const match = textNode.textContent.match(/(\d+)/);
          if (match) {
            let count = parseInt(match[1]);
            
            // Randomly fluctuate slightly
            const change = Math.random() > 0.65 ? (Math.random() > 0.5 ? 1 : -1) : 0;
            count = Math.max(1, Math.min(6, count + change));
            
            textNode.textContent = `${count} Bike${count > 1 ? 's' : ''} Left`;
            
            // Toggle danger styling if critical
            if (count <= 2) {
              dot.classList.add('low');
            } else {
              dot.classList.remove('low');
            }
          }
        }
      }
    });
  }, 12000); // Check every 12s
}

/* ==========================================
   7. FLOATING AI CHATBOT INTERACTIVE CONTROLLER
   ========================================== */
function initFloatingChatbot() {
  const toggleBtn = document.getElementById('btnAiChatbotToggle');
  const chatWindow = document.getElementById('aiChatWindow');
  const closeBtn = document.getElementById('btnChatClose');
  const chatForm = document.getElementById('chatInputForm');
  const chatInput = document.getElementById('chatInputField');
  const chatMessages = document.getElementById('chatMessages');
  const suggestionChips = document.querySelectorAll('.suggestion-chip');

  if (!toggleBtn || !chatWindow) return;

  // Toggle chat window visibility
  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    chatWindow.classList.toggle('active');
    
    // Auto focus input when active
    if (chatWindow.classList.contains('active') && chatInput) {
      setTimeout(() => chatInput.focus(), 300);
    }
  });

  // Close chat window
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      chatWindow.classList.remove('active');
    });
  }

  // Prevent closing when clicking inside the chat window
  chatWindow.addEventListener('click', (e) => {
    e.stopPropagation();
  });

  // Close when clicking anywhere else on page
  document.addEventListener('click', () => {
    chatWindow.classList.remove('active');
  });

  // Send message helper
  function appendMessage(text, sender) {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.innerHTML = text;
    chatMessages.appendChild(bubble);
    
    // Smooth scroll to bottom
    setTimeout(() => {
      chatMessages.scrollTo({
        top: chatMessages.scrollHeight,
        behavior: 'smooth'
      });
    }, 50);
  }

  // AI response engine with simulated thinking delay
  function getAiResponse(userQuery) {
    const query = userQuery.toLowerCase().trim();
    let reply = "";

    if (query.includes('best') || query.includes('himalayan') || query.includes('bullet') || query.includes('steed') || query.includes('which bike')) {
      reply = "The <strong>Royal Enfield Himalayan 450</strong> is the undisputed king of Ladakh. With its 230mm ground clearance, liquid-cooled Sherpa engine, and custom mountain carburetor tuning, it floats over river crossings and loose gravel.<br><br>If you prefer a steady, comfortable, nostalgic thumping cruise, our legendary <strong>Bullet 500 Classic</strong> is perfect for the Leh-Srinagar Highway.";
    } else if (query.includes('altitude') || query.includes('sickness') || query.includes('ams') || query.includes('sick') || query.includes('rest') || query.includes('acclimatize')) {
      reply = "Jullay! 🏔️ Rule number one of Ladakh: <strong>Acclimatization is non-negotiable</strong>. Leh is at 11,500 ft. You must strictly rest for the first 36-48 hours. No mountain passes on Day 1 or Day 2.<br><br>Keep hydrated, avoid caffeine/alcohol, and carry portable oxygen canisters (which we offer for booking as an addon!).";
    } else if (query.includes('fuel') || query.includes('petrol') || query.includes('gas') || query.includes('backup') || query.includes('canister')) {
      reply = "Yes, absolute safety is our motto! We provide custom heavy-duty, leakage-proof metal fuel canisters mounted directly onto our saddle frame rigs. This is essential because there are <strong>no petrol pumps</strong> on the Leh-Kardhung La-Nubra-Pangong-Karu stretch except one at Karu!";
    } else if (query.includes('permit') || query.includes('ilp') || query.includes('pass') || query.includes('inner line')) {
      reply = "Absolutely! Visiting Khardung La, Chang La, Pangong Tso, Nubra Valley, or Turtuk requires an <strong>Inner Line Permit (ILP)</strong> for Indian nationals and a protected area permit for foreigners.<br><br>Just share your details via our Booking Form, and our desk can arrange your verified physical permits in Leh in under 2 hours!";
    } else if (query.includes('price') || query.includes('cost') || query.includes('rent') || query.includes('how much') || query.includes('rate')) {
      reply = "Our rentals are highly competitive and include mechanical back-up assurance:<br>🏍️ <strong>Bullet 350 Standard:</strong> ₹1,400/day<br>🏍️ <strong>Bullet 500 Classic:</strong> ₹1,600/day<br>🏍️ <strong>Himalayan 411:</strong> ₹1,800/day<br>🏍️ <strong>Himalayan 450:</strong> ₹2,100/day<br><br>Discounts are automatically applied in our booking panel for trips longer than 6 days!";
    } else if (query.includes('included') || query.includes('include') || query.includes('free') || query.includes('accessory') || query.includes('helmet')) {
      reply = "Every single motorcycle rental comes with:<br>✅ 1 Premium Double-Visor Helmet for the rider<br>✅ Heavy-duty waterproof carrier racks<br>✅ Toolkit & spare clutch/accelerator cables<br>✅ SpO2 pulse oximeter wellness test at pickup<br><br>Optional professional riding armor, saddlebags, and oxygen cylinders are easily added during checkout!";
    } else {
      reply = "Jullay! That's an excellent question. For custom mountain itineraries, special route conditions, or booking confirmations, click the <strong>WhatsApp</strong> button on the left to connect directly with Leh Ladakh Bike Booking's personal desk!";
    }

    // Simulate typing delay
    setTimeout(() => {
      appendMessage(reply, 'bot');
    }, 850);
  }

  // Handle Form Submission
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    appendMessage(messageText, 'user');
    chatInput.value = '';

    getAiResponse(messageText);
  });

  // Handle Suggestion Chips Clicks
  suggestionChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const question = chip.getAttribute('data-question');
      if (question) {
        appendMessage(question, 'user');
        getAiResponse(question);
      }
    });
  });
}

/* ==========================================
   8. PACKING & PREPARATION CHECKLIST STATE MANAGER (DURABLE STORAGE)
   ========================================== */
function initChecklistTracker() {
  const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');
  
  if (checkboxes.length === 0) return;

  // Load saved states from localstorage
  checkboxes.forEach(chk => {
    const isSaved = localStorage.getItem(`leh_ladakh_checklist_${chk.id}`) === 'true';
    chk.checked = isSaved;
  });

  // Save state on change
  checkboxes.forEach(chk => {
    chk.addEventListener('change', () => {
      localStorage.setItem(`leh_ladakh_checklist_${chk.id}`, chk.checked);
    });
  });
}

/* ==========================================
   9. ARTICLES SECTION FILTERING & MODAL VIEWER
   ========================================== */
const articlesData = {
  "water-crossing": {
    title: "Water Crossing (Nalla) Mastery: Surviving Pagal Nalla & Shyok",
    tag: "Safety Protocol",
    tagClass: "tag-safety",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1200",
    content: `
      <p>In Ladakh, melting glaciers create temporary torrents across major roadways, locally referred to as <strong>Nallas</strong>. Notorious crossings like Pagal Nalla, Shyok Nalla, and Tsaga Nalla are steep, icy, and can easily submerge or stall a motorcycle.</p>
      
      <h4>1. The Glacial Sun Cycle</h4>
      <p>Glaciers melt rapidly under direct midday heat. This means water levels are at their lowest in the early morning (6:00 AM to 9:00 AM) and highest/most turbulent in the late afternoon (2:00 PM to 6:00 PM). <strong>Always plan your daily itinerary to clear high-risk crossings before noon.</strong></p>

      <h4>2. Safe Crossings Stance & Strategy</h4>
      <ul>
        <li><strong>Low Gear, High RPM:</strong> Remain strictly in 1st gear. Slip your clutch in its friction zone to maintain high engine revs so water doesn't travel up your exhaust tailpipe.</li>
        <li><strong>Don't Look Down:</strong> Watching the rapid water flow beneath you causes instant vertigo and loss of balance. Keep your eyes locked firmly on the dry exit bank across the stream.</li>
        <li><strong>Commit and Follow Through:</strong> Select a line with the least jagged boulders (often the slightly deeper, sandier section is easier to navigate than grease-covered stones), keep constant throttle, and do not brake mid-crossing.</li>
      </ul>

      <h4>3. Recovery Mode if Engine Stalls</h4>
      <p>If your engine stalls in deep cold water, <strong>do not try to immediately restart it while the exhaust tailpipe is submerged</strong>. This can pull cold water straight into the spark plugs and cylinder head, cracking the motor block or causing hydraulic locking. Push the bike onto dry banks first and clear the spark plug.</p>
    `
  },
  "pangong-tso": {
    title: "Pangong Tso: The Infinite Deep Blue Salt Lake at 13,940 Feet",
    tag: "Tourist Places",
    tagClass: "tag-places",
    image: "https://images.unsplash.com/photo-1626082895617-2c6de3476af7?q=80&w=1200",
    content: `
      <p>Pangong Tso is a legendary saltwater lake located at nearly 14,000 feet. Spanning 134 kilometers across the Indo-Tibetan border, its saline waters act like a massive glass prism, transforming between striking turquoise, emerald green, and deep midnight cobalt as the sun travels.</p>

      <h4>1. Escaping the Spangmik Crowds</h4>
      <p>The vast majority of tourists stop at Spangmik for selfies with yellow scooters. If you want pristine, untouched mountain tranquility, ride further along the dirt roads to the peaceful villages of <strong>Maan, Merak, or Chushul</strong>. The high-altitude lakeside cliffs here offer breathtaking photographic vistas without commercial noise.</p>

      <h4>2. Overnight Survival and Staying Warm</h4>
      <ul>
        <li><strong>Insulated Cabins:</strong> Night temperatures drop below freezing even in high summer. Opt for wooden, insulated cabins or local homestays instead of basic thin nylon tents.</li>
        <li><strong>Resource Consciousness:</strong> Electricity is supplied solely via eco-friendly generators that shut off strictly at 11:00 PM. Charge your phone, camera batteries, and portable oximeters beforehand.</li>
      </ul>

      <h4>3. Oxygen Conservation Guidelines</h4>
      <p>Sleeping at 13,940 feet places exceptional demand on your heart and lungs. Avoid sleeping flat on your back (prop your head up with two pillows), keep fully hydrated with warm fluids, and strictly avoid alcohol or sleeping pills which depress respiration.</p>
    `
  },
  "acclimatization": {
    title: "The Altitude Sickness Guide: How to Acclimatize in Leh Safely",
    tag: "Safety Protocol",
    tagClass: "tag-safety",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1200",
    content: `
      <p>Leh is located at an altitude of 11,500 feet. Flying directly into Leh from low-altitude plains or driving up too rapidly from Manali instantly deprives your body of atmospheric oxygen pressure, which can easily trigger Acute Mountain Sickness (AMS).</p>

      <h4>1. The Golden 36-Hour Absolute Rest Protocol</h4>
      <p>Your body is incredibly adaptive, but it requires time to produce the red blood cells needed to transport oxygen in thin air. <strong>Your first 36 hours in Leh must be spent lying down or sitting.</strong> Avoid walking up steep hotel stairs, carrying heavy luggage bags, or taking hot baths on Day 1.</p>

      <h4>2. Preventive Aids & Medicine</h4>
      <ul>
        <li><strong>Acclimatization Aids:</strong> Consult a doctor before your trip. Acetazolamide (Diamox) is a respiratory stimulant that assists your body in oxygenating blood quicker.</li>
        <li><strong>Natural Hydration:</strong> Drink 4 to 5 liters of water daily. Garlic water and ginger tea are ancient, highly effective local remedies that promote deep circulation.</li>
        <li><strong>Avoid Sedatives:</strong> Sleeping pills or heavy alcohol consumption will slow down your breathing rhythm, worsening oxygen drops while you sleep.</li>
      </ul>

      <h4>3. HAPE & HACE Warning Indicators</h4>
      <p>If you or your riding buddy develop a persistent dry cough, gurgling chest sounds, extreme shortness of breath while completely resting, or slurred speech, these are severe symptoms of HAPE (high-altitude pulmonary edema). <strong>Do not wait for morning. Administer oxygen immediately and descend to a lower altitude.</strong></p>
    `
  },
  "nubra-valley": {
    title: "Nubra Valley & Turtuk: Biking Through Cold Deserts to the Baltic Border",
    tag: "Tourist Places",
    tagClass: "tag-places",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=1200",
    content: `
      <p>Riding north from Leh across Khardung La leads you into Nubra Valley—a gorgeous desert basin resting at a slightly lower 10,000 feet. Here, the glacial waters of the Shyok and Nubra rivers flow through sweeping white sand dunes home to wild Bactrian camels.</p>

      <h4>1. Riding Safely on Loose Sand</h4>
      <p>Hunder dunes are incredibly soft. Riding a heavy adventure motorcycle onto deep, dry sand will immediately trap your rear wheel or wash out your front forks, resulting in tip-overs and twisted ankles. Always park strictly on solid tarmac road edges before exploring the dunes.</p>

      <h4>2. Journeying to Historic Turtuk</h4>
      <ul>
        <li><strong>Balti Culture Heritage:</strong> Turtuk was under Pakistan's administrative control until the 1971 war when Indian forces recaptured it. It is uniquely Balti, filled with lush apricot orchards, stone houses, and cold streams.</li>
        <li><strong>The LOC Viewpoint:</strong> With military clearance, you can ride your motorcycle to the final high outpost overlooking the Line of Control.</li>
      </ul>

      <h4>3. Khardung La Crossing Guide</h4>
      <p>Khardung La (17,582 ft) is a grueling pass. The north-bound descent is prone to black ice sheets and slushy landslide streams. Keep a loose, relaxed grip on your handlebars, rely heavily on your rear brakes, and do not stop for more than 15 minutes at the cold summit.</p>
    `
  },
  "carburetor-tuning": {
    title: "Carburetor vs FI: How to Tune Your RE Bike for Umling La Pass",
    tag: "Biking Hacks",
    tagClass: "tag-biking",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1200",
    content: `
      <p>Umling La rests at a spectacular 19,300 feet—making it the highest motorable paved road in the world. At this extreme altitude, atmospheric oxygen levels are reduced by nearly 50%, choking the ignition cycle of any motorcycle engine.</p>

      <h4>1. The Fuel Injection (FI) Advantage</h4>
      <p>Modern motorcycles like the <strong>Royal Enfield Himalayan 450</strong> are equipped with digital Electronic Fuel Injection. Their ambient air pressure sensors automatically instruct the ECU to lean out fuel spray patterns. No mechanical tuning or jet adjustments are needed to climb!</p>

      <h4>2. Tuning a Classic Carburetor Bullet</h4>
      <ul>
        <li><strong>Manually Leaning the Air Screw:</strong> Older Bullet 350/500 models will choke and sputter due to excessively rich mixtures. Locate your carburetor air screw and turn it outwards in 1/4-turn increments to allow more air intake.</li>
        <li><strong>Spark Plug soot Cleaning:</strong> A rich running engine leaves heavy, wet black carbon soot on spark plugs. Clean them regularly with sandpaper to prevent cold-misfires.</li>
        <li><strong>Airstream Expansion:</strong> Temporarily removing the secondary sponge pre-filter lets your engine draw in the maximum volume of thin mountain air possible.</li>
      </ul>

      <h4>3. Save Your Clutch Plates</h4>
      <p>When the engine loses power at 19,000 feet, riders often make the mistake of slipping the clutch excessively in higher gears. This will overheat and burn your clutch plates in minutes, leaving you stranded. Shift down to 1st gear and crawl patiently.</p>
    `
  },
  "hanle-tso-moriri": {
    title: "Hanle Dark Sky Reserve & Tso Moriri: Ladakh's Untamed East",
    tag: "Tourist Places",
    tagClass: "tag-places",
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=1200",
    content: `
      <p>The high-altitude plains of Changthang in Eastern Ladakh are vast, desolate, and pristine. Bordering Tibet, this wild frontier region demands rugged motorcycle preparation and highly resilient riding skills.</p>

      <h4>1. Hanle: India's Cosmic Star Sanctuary</h4>
      <p>At 14,760 feet, Hanle's atmosphere is cloudless, dry, and entirely free from light pollution. Hosting the Indian National Astronomical Observatory, it was designated India's first official <strong>Dark Sky Reserve</strong>. Riding here rewards you with stellar naked-eye views of the Milky Way core.</p>

      <h4>2. Pristine Alpine Tso Moriri</h4>
      <ul>
        <li><strong>Highland Nomads:</strong> Tso Moriri is home to the Changpa nomads who graze Pashmina goats. It is a highly protected wetland reserve.</li>
        <li><strong>Challenging Sand Tracks:</strong> The direct route from Pangong to Tso Moriri along the LAC is 150 km of deep loose gravel, sand, and unpaved mountain tracks. Carry supplementary backup fuel canisters and a reliable tire patch kit.</li>
      </ul>

      <h4>3. Army Checkpoint Clearances</h4>
      <p>Riding near active border posts in Chushul, Loma, or Mahe requires physical copies of your Inner Line Permit (ILP) signed and stamped in Leh. Carry at least 6 physical photocopies as army checkposts will collect them.</p>
    `
  }
};

function initArticlesSection() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const articleCards = document.querySelectorAll('.article-card');
  const modal = document.getElementById('articleDetailModal');
  const modalClose = document.getElementById('btnModalClose');
  const modalHeroBg = document.getElementById('modalHeroBg');
  const modalTag = document.getElementById('modalTag');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBodyContent');

  if (!articleCards.length) return;

  // 1. Interactive Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle active filter button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Filter articles with smooth fade transition
      articleCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // 2. Open Article Modal
  articleCards.forEach(card => {
    card.addEventListener('click', () => {
      const articleId = card.getAttribute('data-article-id');
      const article = articlesData[articleId];

      if (!article || !modal) return;

      // Populate content dynamically
      modalTag.innerText = article.tag;
      modalTag.className = `article-tag ${article.tagClass}`;
      modalTitle.innerText = article.title;
      modalHeroBg.style.backgroundImage = `url('${article.image}')`;
      modalBody.innerHTML = article.content;

      // Show modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });
  });

  // 3. Close Modal Events
  if (modalClose && modal) {
    modalClose.addEventListener('click', () => {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    // Close on click outside of modal-content
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ==========================================
   10. ADVENTURE GEARS & ADD-ONS INTERACTIVE LIVE CALCULATOR
   ========================================== */
function initAddonsSection() {
  const toggleBtns = document.querySelectorAll('.btn-addon-toggle');
  const cards = document.querySelectorAll('.addon-showcase-card');
  const selectedCountEl = document.getElementById('calcSelectedCount');
  const totalCostEl = document.getElementById('calcTotalCost');
  const applyBtn = document.getElementById('btnApplyAddonsToForm');
  
  // Get all form checkboxes
  const formCheckboxes = document.querySelectorAll('.addon-checkbox');

  if (!toggleBtns.length) return;

  // Active state set
  const selectedAddons = new Set();

  function updateShowcaseUI() {
    let total = 0;
    
    cards.forEach(card => {
      const id = card.getAttribute('data-addon-id');
      const btn = card.querySelector('.btn-addon-toggle');
      
      if (selectedAddons.has(id)) {
        card.classList.add('selected');
        if (btn) btn.innerText = 'Selected ✓';
        total += parseInt(card.getAttribute('data-addon-price') || '0', 10);
      } else {
        card.classList.remove('selected');
        if (btn) btn.innerText = 'Add to Ride';
      }
    });

    if (selectedCountEl) {
      selectedCountEl.innerText = `${selectedAddons.size} Item${selectedAddons.size !== 1 ? 's' : ''}`;
    }
    if (totalCostEl) {
      totalCostEl.innerText = `₹${total} / day`;
    }
  }

  // Bind showcase button clicks
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.addon-showcase-card');
      if (!card) return;

      const addonId = card.getAttribute('data-addon-id');

      if (selectedAddons.has(addonId)) {
        selectedAddons.delete(addonId);
      } else {
        selectedAddons.add(addonId);
      }

      updateShowcaseUI();
    });
  });

  // Sync checkboxes in booking form BACK to the showcase
  formCheckboxes.forEach(cb => {
    // Initial sync
    if (cb.checked) {
      selectedAddons.add(cb.value);
    }

    cb.addEventListener('change', () => {
      if (cb.checked) {
        selectedAddons.add(cb.value);
      } else {
        selectedAddons.delete(cb.value);
      }
      updateShowcaseUI();
    });
  });

  // Initialize UI once at load
  updateShowcaseUI();

  // Apply button handler
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      // Sync from selectedAddons to form checkboxes
      formCheckboxes.forEach(cb => {
        const value = cb.value;
        const previousState = cb.checked;
        cb.checked = selectedAddons.has(value);
        
        // If changed, dispatch event to trigger price update
        if (cb.checked !== previousState) {
          cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
      });

      // Switch to the booking section using the URL hash switcher
      window.location.hash = '#booking';

      // Highlight the booking form headers
      const formHeader = document.querySelector('.booking-form-header');
      if (formHeader) {
        formHeader.scrollIntoView({ behavior: 'smooth' });
        formHeader.style.transform = 'scale(1.02)';
        formHeader.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        setTimeout(() => {
          formHeader.style.transform = 'scale(1)';
        }, 400);
      }
    });
  }
}


