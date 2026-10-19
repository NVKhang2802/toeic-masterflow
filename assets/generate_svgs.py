import os

assets_dir = r"e:\Toeic_Speaking_Writing\assets"
os.makedirs(assets_dir, exist_ok=True)

# 1. Office Scene SVG
office_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="windowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#818cf8" stop-opacity="0.1"/>
    </linearGradient>
    <linearGradient id="tableGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#475569"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#bgGrad)"/>
  
  <!-- Back Wall & Windows -->
  <rect x="50" y="40" width="220" height="180" rx="8" fill="url(#windowGrad)" stroke="#475569" stroke-width="2"/>
  <line x1="160" y1="40" x2="160" y2="220" stroke="#475569" stroke-width="2"/>
  <line x1="50" y1="130" x2="270" y2="130" stroke="#475569" stroke-width="2"/>

  <!-- Presentation Screen -->
  <rect x="320" y="50" width="300" height="170" rx="10" fill="#0b1120" stroke="#00d2ff" stroke-width="3"/>
  <rect x="340" y="70" width="120" height="15" rx="3" fill="#38bdf8"/>
  <line x1="340" y1="105" x2="450" y2="105" stroke="#94a3b8" stroke-width="3"/>
  <line x1="340" y1="125" x2="420" y2="125" stroke="#94a3b8" stroke-width="3"/>
  <line x1="340" y1="145" x2="460" y2="145" stroke="#94a3b8" stroke-width="3"/>
  <!-- Bar chart on screen -->
  <rect x="490" y="140" width="20" height="50" fill="#10b981" rx="2"/>
  <rect x="520" y="110" width="20" height="80" fill="#00d2ff" rx="2"/>
  <rect x="550" y="80" width="20" height="110" fill="#6366f1" rx="2"/>
  <rect x="580" y="125" width="20" height="65" fill="#f59e0b" rx="2"/>

  <!-- Presentation Stand -->
  <line x1="470" y1="220" x2="470" y2="280" stroke="#475569" stroke-width="6"/>
  <line x1="430" y1="280" x2="510" y2="280" stroke="#475569" stroke-width="6"/>

  <!-- Meeting Table -->
  <ellipse cx="400" cy="380" rx="350" ry="90" fill="url(#tableGrad)" stroke="#64748b" stroke-width="2"/>
  
  <!-- Laptops on Table -->
  <rect x="220" y="340" width="70" height="40" rx="3" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <polygon points="210,380 300,380 290,390 220,390" fill="#64748b"/>
  <rect x="520" y="340" width="70" height="40" rx="3" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>
  <polygon points="510,380 600,380 590,390 520,390" fill="#64748b"/>

  <!-- Notepads and Coffee cups -->
  <rect x="360" y="355" width="40" height="50" rx="2" fill="#f8fafc"/>
  <circle cx="430" cy="370" r="10" fill="#f59e0b"/>
  <circle cx="430" cy="370" r="7" fill="#78350f"/>

  <!-- Person 1: Presenter (Standing Right) -->
  <circle cx="680" cy="180" r="30" fill="#fdba74"/>
  <path d="M 640 280 C 640 220, 720 220, 720 280 Z" fill="#2563eb"/>
  <line x1="645" y1="230" x2="600" y2="160" stroke="#fdba74" stroke-width="12" stroke-linecap="round"/>
  <rect x="650" y="280" width="60" height="140" fill="#1e293b"/>

  <!-- Person 2: Colleague Left (Seated) -->
  <circle cx="150" cy="270" r="28" fill="#fcd34d"/>
  <path d="M 110 380 C 110 310, 190 310, 190 380 Z" fill="#059669"/>

  <!-- Person 3: Colleague Middle Left (Seated) -->
  <circle cx="280" cy="260" r="28" fill="#fdba74"/>
  <path d="M 240 370 C 240 300, 320 300, 320 370 Z" fill="#7c3aed"/>

  <!-- Person 4: Colleague Middle Right (Seated) -->
  <circle cx="480" cy="260" r="28" fill="#fbcfe8"/>
  <path d="M 440 370 C 440 300, 520 300, 520 370 Z" fill="#db2777"/>

  <!-- Caption text bar -->
  <rect x="0" y="460" width="800" height="40" fill="#000000" opacity="0.6"/>
  <text x="400" y="485" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-weight="600" font-size="16">
    SCENE 1: Business Conference & Presentation Room
  </text>
</svg>'''

# 2. Cafe Scene SVG
cafe_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="cafeBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#292524"/>
      <stop offset="100%" stop-color="#1c1917"/>
    </linearGradient>
    <linearGradient id="counterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78350f"/>
      <stop offset="100%" stop-color="#451a03"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#cafeBg)"/>

  <!-- Menu Board on Wall -->
  <rect x="180" y="40" width="240" height="140" rx="6" fill="#0c0a09" stroke="#d97706" stroke-width="3"/>
  <text x="300" y="70" text-anchor="middle" fill="#fbbf24" font-family="sans-serif" font-weight="bold" font-size="18">CAFE MENU</text>
  <line x1="200" y1="90" x2="400" y2="90" stroke="#78716c" stroke-width="1"/>
  <text x="200" y="115" fill="#f5f5f4" font-family="sans-serif" font-size="13">Espresso ................. $3.50</text>
  <text x="200" y="135" fill="#f5f5f4" font-family="sans-serif" font-size="13">Latte / Cappuccino ... $4.50</text>
  <text x="200" y="155" fill="#f5f5f4" font-family="sans-serif" font-size="13">Fresh Pastries ........ $3.00</text>

  <!-- Espresso Machine -->
  <rect x="520" y="160" width="160" height="120" rx="8" fill="#64748b" stroke="#94a3b8" stroke-width="2"/>
  <circle cx="560" cy="190" r="14" fill="#38bdf8"/>
  <circle cx="600" cy="190" r="14" fill="#10b981"/>
  <rect x="540" y="230" width="30" height="40" fill="#334155"/>
  <rect x="610" y="230" width="30" height="40" fill="#334155"/>

  <!-- Bar Counter -->
  <rect x="120" y="270" width="680" height="230" fill="url(#counterGrad)" stroke="#92400e" stroke-width="2"/>

  <!-- Pastry Display Glass Case -->
  <polygon points="140,270 320,270 300,200 160,200" fill="#38bdf8" opacity="0.25" stroke="#7dd3fc" stroke-width="2"/>
  <!-- Croissants & Muffins -->
  <circle cx="200" cy="245" r="14" fill="#d97706"/>
  <circle cx="240" cy="245" r="14" fill="#b45309"/>
  <circle cx="275" cy="245" r="12" fill="#d97706"/>

  <!-- Barista behind counter -->
  <circle cx="580" cy="110" r="28" fill="#fed7aa"/>
  <!-- Barista Apron -->
  <path d="M 540 270 L 540 180 C 540 145, 620 145, 620 180 L 620 270 Z" fill="#15803d"/>
  <rect x="560" y="145" width="40" height="45" fill="#f8fafc"/>

  <!-- Customer in Foreground (Left) -->
  <circle cx="80" cy="280" r="32" fill="#fdba74"/>
  <path d="M 20 480 C 20 370, 140 370, 140 480 Z" fill="#0284c7"/>
  <!-- Hand paying credit card -->
  <line x1="120" y1="360" x2="200" y2="330" stroke="#fdba74" stroke-width="12" stroke-linecap="round"/>
  <rect x="195" y="320" width="35" height="22" rx="3" fill="#fbbf24"/>

  <!-- Coffee Cups on Counter -->
  <path d="M 400 240 L 415 270 L 385 270 Z" fill="#f8fafc"/>
  <rect x="385" y="235" width="30" height="6" rx="2" fill="#ef4444"/>

  <!-- Caption -->
  <rect x="0" y="460" width="800" height="40" fill="#000000" opacity="0.6"/>
  <text x="400" y="485" text-anchor="middle" fill="#fbbf24" font-family="sans-serif" font-weight="600" font-size="16">
    SCENE 2: Coffee Shop Counter & Barista Service
  </text>
</svg>'''

# 3. Airport Scene SVG
airport_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="terminalBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e293b"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#terminalBg)"/>

  <!-- Big Glass Window to Tarmac -->
  <rect x="60" y="40" width="680" height="220" fill="#0284c7" opacity="0.15" stroke="#475569" stroke-width="3"/>
  <line x1="280" y1="40" x2="280" y2="260" stroke="#334155" stroke-width="4"/>
  <line x1="520" y1="40" x2="520" y2="260" stroke="#334155" stroke-width="4"/>

  <!-- Airplane Silhouette outside -->
  <path d="M 320 160 L 460 140 L 470 120 L 485 120 L 475 140 L 510 135 L 525 125 L 535 125 L 530 145 L 475 155 L 430 190 L 415 190 L 435 160 Z" fill="#94a3b8" opacity="0.6"/>

  <!-- Flight Information Board (FIDS) -->
  <rect x="250" y="20" width="300" height="100" rx="6" fill="#000000" stroke="#f59e0b" stroke-width="2"/>
  <text x="400" y="45" text-anchor="middle" fill="#fbbf24" font-family="monospace" font-weight="bold" font-size="14">DEPARTURES / FLIGHTS</text>
  <text x="270" y="70" fill="#38bdf8" font-family="monospace" font-size="12">VN 310  TOKYO     10:45  ON TIME</text>
  <text x="270" y="90" fill="#34d399" font-family="monospace" font-size="12">KE 682  SEOUL     11:15  BOARDING</text>
  <text x="270" y="110" fill="#f87171" font-family="monospace" font-size="12">QR 971  DOHA      11:40  GATE 12</text>

  <!-- Floor -->
  <rect x="0" y="260" width="800" height="240" fill="#334155"/>
  <line x1="0" y1="360" x2="800" y2="360" stroke="#475569" stroke-width="2"/>

  <!-- Travelers Waiting on Seats -->
  <rect x="100" y="320" width="220" height="10" fill="#64748b"/>
  <line x1="120" y1="330" x2="120" y2="390" stroke="#64748b" stroke-width="6"/>
  <line x1="300" y1="330" x2="300" y2="390" stroke="#64748b" stroke-width="6"/>

  <!-- Seated Traveler -->
  <circle cx="160" cy="270" r="22" fill="#fdba74"/>
  <path d="M 135 340 C 135 295, 185 295, 185 340 Z" fill="#4f46e5"/>

  <!-- Traveler 2 Walking with Suitcase -->
  <circle cx="580" cy="240" r="24" fill="#fcd34d"/>
  <path d="M 550 350 C 550 290, 610 290, 610 350 Z" fill="#e11d48"/>
  <line x1="565" y1="350" x2="555" y2="430" stroke="#1e293b" stroke-width="10"/>
  <line x1="595" y1="350" x2="615" y2="430" stroke="#1e293b" stroke-width="10"/>
  
  <!-- Rolling Luggage / Suitcase -->
  <rect x="640" y="340" width="45" height="75" rx="5" fill="#0284c7" stroke="#0369a1" stroke-width="2"/>
  <line x1="662" y1="340" x2="662" y2="280" stroke="#64748b" stroke-width="4"/>
  <circle cx="650" cy="420" r="6" fill="#0f172a"/>
  <circle cx="675" cy="420" r="6" fill="#0f172a"/>

  <!-- Caption -->
  <rect x="0" y="460" width="800" height="40" fill="#000000" opacity="0.6"/>
  <text x="400" y="485" text-anchor="middle" fill="#38bdf8" font-family="sans-serif" font-weight="600" font-size="16">
    SCENE 3: Airport Departure Lounge & Boarding Gate
  </text>
</svg>'''

# 4. Warehouse Scene SVG
warehouse_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="whBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#whBg)"/>

  <!-- High Industrial Shelves (Left & Right) -->
  <rect x="50" y="40" width="180" height="380" fill="none" stroke="#f59e0b" stroke-width="6"/>
  <line x1="50" y1="140" x2="230" y2="140" stroke="#f59e0b" stroke-width="4"/>
  <line x1="50" y1="240" x2="230" y2="240" stroke="#f59e0b" stroke-width="4"/>
  <line x1="50" y1="340" x2="230" y2="340" stroke="#f59e0b" stroke-width="4"/>

  <!-- Cardboard Boxes on Left Shelves -->
  <rect x="65" y="80" width="65" height="55" rx="3" fill="#b45309" stroke="#78350f" stroke-width="2"/>
  <rect x="140" y="70" width="75" height="65" rx="3" fill="#d97706" stroke="#78350f" stroke-width="2"/>
  <rect x="70" y="170" width="140" height="65" rx="3" fill="#d97706" stroke="#78350f" stroke-width="2"/>
  <rect x="65" y="275" width="70" height="60" rx="3" fill="#b45309" stroke="#78350f" stroke-width="2"/>
  <rect x="145" y="280" width="70" height="55" rx="3" fill="#d97706" stroke="#78350f" stroke-width="2"/>

  <!-- Right Shelves -->
  <rect x="570" y="40" width="180" height="380" fill="none" stroke="#f59e0b" stroke-width="6"/>
  <line x1="570" y1="140" x2="750" y2="140" stroke="#f59e0b" stroke-width="4"/>
  <line x1="570" y1="240" x2="750" y2="240" stroke="#f59e0b" stroke-width="4"/>
  <line x1="570" y1="340" x2="750" y2="340" stroke="#f59e0b" stroke-width="4"/>

  <!-- Boxes on Right Shelves -->
  <rect x="585" y="80" width="140" height="55" rx="3" fill="#d97706"/>
  <rect x="590" y="170" width="70" height="65" rx="3" fill="#b45309"/>
  <rect x="670" y="180" width="65" height="55" rx="3" fill="#d97706"/>

  <!-- Warehouse Floor -->
  <rect x="0" y="420" width="800" height="80" fill="#334155"/>
  <line x1="380" y1="420" x2="420" y2="500" stroke="#fbbf24" stroke-width="6" stroke-dasharray="16,12"/>

  <!-- Forklift (Center Left) -->
  <rect x="270" y="330" width="100" height="70" rx="5" fill="#f59e0b"/>
  <circle cx="295" cy="405" r="16" fill="#0f172a" stroke="#64748b" stroke-width="4"/>
  <circle cx="355" cy="405" r="16" fill="#0f172a" stroke="#64748b" stroke-width="4"/>
  <polygon points="370,360 410,360 410,400 370,400" fill="#64748b"/>

  <!-- Warehouse Inspector / Worker (Center Right) -->
  <circle cx="480" cy="250" r="24" fill="#fdba74"/>
  <!-- Hard Hat -->
  <path d="M 452 245 C 452 220, 508 220, 508 245 Z" fill="#fbbf24"/>
  <!-- Safety Vest -->
  <path d="M 445 370 C 445 295, 515 295, 515 370 Z" fill="#16a34a"/>
  <rect x="460" y="295" width="40" height="75" fill="#facc15"/>
  
  <!-- Clipboard in Worker Hand -->
  <rect x="420" y="290" width="30" height="45" rx="2" fill="#f8fafc" stroke="#334155" stroke-width="2"/>
  <line x1="425" y1="300" x2="445" y2="300" stroke="#334155" stroke-width="2"/>
  <line x1="425" y1="310" x2="445" y2="310" stroke="#334155" stroke-width="2"/>

  <!-- Caption -->
  <rect x="0" y="460" width="800" height="40" fill="#000000" opacity="0.6"/>
  <text x="400" y="485" text-anchor="middle" fill="#facc15" font-family="sans-serif" font-weight="600" font-size="16">
    SCENE 4: Logistics Warehouse & Inventory Inspection
  </text>
</svg>'''

# 5. Park Scene SVG
park_svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="100%" height="100%">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#38bdf8"/>
    </linearGradient>
  </defs>
  <rect width="800" height="500" fill="url(#skyGrad)"/>

  <!-- Distant City Skyline -->
  <polygon points="60,250 90,200 120,250" fill="#64748b" opacity="0.4"/>
  <rect x="130" y="160" width="50" height="120" fill="#64748b" opacity="0.4"/>
  <rect x="190" y="140" width="60" height="140" fill="#64748b" opacity="0.4"/>
  <rect x="620" y="150" width="55" height="130" fill="#64748b" opacity="0.4"/>

  <!-- Trees -->
  <circle cx="100" cy="220" r="60" fill="#15803d"/>
  <rect x="90" y="260" width="20" height="80" fill="#78350f"/>

  <circle cx="700" cy="210" r="70" fill="#16a34a"/>
  <rect x="690" y="260" width="20" height="80" fill="#78350f"/>

  <!-- Grassy Hill -->
  <ellipse cx="400" cy="400" rx="460" ry="160" fill="#22c55e"/>

  <!-- Curved Pathway -->
  <path d="M 0 450 Q 400 320 800 440 L 800 500 L 0 500 Z" fill="#e2e8f0"/>

  <!-- Park Bench -->
  <rect x="200" y="360" width="120" height="10" rx="3" fill="#92400e"/>
  <line x1="220" y1="370" x2="220" y2="400" stroke="#334155" stroke-width="6"/>
  <line x1="300" y1="370" x2="300" y2="400" stroke="#334155" stroke-width="6"/>

  <!-- Person Sitting Reading Newspaper -->
  <circle cx="260" cy="300" r="20" fill="#fcd34d"/>
  <path d="M 235 365 C 235 325, 285 325, 285 365 Z" fill="#0284c7"/>
  <polygon points="250,330 280,325 285,350 255,355" fill="#f8fafc"/>

  <!-- Person Jogging / Running (Right) -->
  <circle cx="560" cy="310" r="20" fill="#fdba74"/>
  <path d="M 540 370 C 540 335, 580 335, 580 370 Z" fill="#ef4444"/>
  <!-- Running Legs -->
  <line x1="550" y1="370" x2="530" y2="420" stroke="#1e293b" stroke-width="7"/>
  <line x1="570" y1="370" x2="595" y2="415" stroke="#1e293b" stroke-width="7"/>

  <!-- Caption -->
  <rect x="0" y="460" width="800" height="40" fill="#000000" opacity="0.6"/>
  <text x="400" y="485" text-anchor="middle" fill="#15803d" font-family="sans-serif" font-weight="600" font-size="16">
    SCENE 5: Outdoor City Park & Recreational Walkway
  </text>
</svg>'''

files = {
    "pic_office.svg": office_svg,
    "pic_cafe.svg": cafe_svg,
    "pic_airport.svg": airport_svg,
    "pic_warehouse.svg": warehouse_svg,
    "pic_park.svg": park_svg
}

for fname, content in files.items():
    p = os.path.join(assets_dir, fname)
    with open(p, "w", encoding="utf-8") as f:
        f.write(content.strip())
    print(f"Created {p}")

print("All SVG assets successfully created.")
