// ===== PARTS DATA =====
// Prices are rough SGD estimates

const parts = {

  // ----- CPUs -----
  cpu: [
    { id: "cpu1", name: "AMD Ryzen 5 5600", price: 169, socket: "AM4", cores: 6, watts: 65 },
    { id: "cpu2", name: "AMD Ryzen 5 7600", price: 279, socket: "AM5", cores: 6, watts: 65 },
    { id: "cpu3", name: "AMD Ryzen 7 7800X3D", price: 599, socket: "AM5", cores: 8, watts: 120 },
    { id: "cpu4", name: "Intel Core i5-13400F", price: 289, socket: "LGA1700", cores: 10, watts: 65 },
    { id: "cpu5", name: "Intel Core i7-14700K", price: 589, socket: "LGA1700", cores: 20, watts: 125 },
  ],

  // ----- Motherboards -----
  motherboard: [
    { id: "mb1", name: "MSI B550 Tomahawk", price: 219, socket: "AM4", ramType: "DDR4", size: "ATX" },
    { id: "mb2", name: "ASUS TUF Gaming B650-Plus", price: 289, socket: "AM5", ramType: "DDR5", size: "ATX" },
    { id: "mb3", name: "MSI B650 Tomahawk WiFi", price: 329, socket: "AM5", ramType: "DDR5", size: "ATX" },
    { id: "mb4", name: "Gigabyte B760M DS3H DDR4", price: 169, socket: "LGA1700", ramType: "DDR4", size: "mATX" },
    { id: "mb5", name: "ASUS Prime Z790-P", price: 339, socket: "LGA1700", ramType: "DDR5", size: "ATX" },
  ],

  // ----- RAM -----
  ram: [
    { id: "ram1", name: "Kingston Fury Beast 16GB", price: 59, ramType: "DDR4", size: "16GB", speed: "3200MHz" },
    { id: "ram2", name: "Corsair Vengeance LPX 32GB", price: 99, ramType: "DDR4", size: "32GB", speed: "3600MHz" },
    { id: "ram3", name: "Corsair Vengeance 32GB", price: 159, ramType: "DDR5", size: "32GB", speed: "6000MHz" },
    { id: "ram4", name: "G.Skill Flare X5 32GB", price: 169, ramType: "DDR5", size: "32GB", speed: "6000MHz" },
  ],

  // ----- GPUs -----
  gpu: [
    { id: "gpu1", name: "NVIDIA RTX 4060", price: 449, vram: "8GB", watts: 115 },
    { id: "gpu2", name: "AMD RX 7800 XT", price: 749, vram: "16GB", watts: 263 },
    { id: "gpu3", name: "NVIDIA RTX 4070 Super", price: 899, vram: "12GB", watts: 220 },
    { id: "gpu4", name: "NVIDIA RTX 4080 Super", price: 1499, vram: "16GB", watts: 320 },
    { id: "gpu5", name: "NVIDIA RTX 4090", price: 2899, vram: "24GB", watts: 450 },
  ],

  // ----- Power supplies -----
  psu: [
    { id: "psu1", name: "Corsair CV550", price: 79, wattage: 550, rating: "Bronze" },
    { id: "psu2", name: "MSI MAG A650BN", price: 89, wattage: 650, rating: "Bronze" },
    { id: "psu3", name: "Corsair RM750e", price: 149, wattage: 750, rating: "Gold" },
    { id: "psu4", name: "Seasonic Focus GX-850", price: 199, wattage: 850, rating: "Gold" },
    { id: "psu5", name: "Corsair RM1000x", price: 279, wattage: 1000, rating: "Gold" },
  ],
}

export default parts