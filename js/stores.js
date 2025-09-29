// Sample bakery data for demonstration
const sampleStores = [
  {
    id: 1,
    name: "Artisan Boulangerie",
    address: {
      street: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zip: "94102",
      coordinates: { lat: 37.7749, lng: -122.4194 }
    },
    contact: {
      phone: "(415) 555-0123",
      website: "https://artisanboulangerie.com",
      email: "hello@artisanboulangerie.com"
    },
    hours: {
      monday: "7:00 AM - 6:00 PM",
      tuesday: "7:00 AM - 6:00 PM",
      wednesday: "7:00 AM - 6:00 PM",
      thursday: "7:00 AM - 6:00 PM",
      friday: "7:00 AM - 7:00 PM",
      saturday: "8:00 AM - 7:00 PM",
      sunday: "8:00 AM - 5:00 PM"
    },
    pricing: "$$",
    rating: 4.8,
    reviewCount: 127,
    specialties: ["sourdough", "croissants", "baguettes"],
    dietary: {
      glutenFree: true,
      vegan: true,
      organic: true
    },
    offerings: {
      bread: true,
      pastries: true,
      coffee: true,
      sandwiches: true
    },
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"],
    description: "Traditional French bakery with modern twists. Our sourdough is made with a 50-year-old starter.",
    languages: ["en", "fr"],
    distance: 0.3
  },
  {
    id: 2,
    name: "Golden Crust Bakery",
    address: {
      street: "456 Oak Avenue",
      city: "San Francisco",
      state: "CA",
      zip: "94103",
      coordinates: { lat: 37.7849, lng: -122.4094 }
    },
    contact: {
      phone: "(415) 555-0456",
      website: "https://goldencrust.com",
      email: "info@goldencrust.com"
    },
    hours: {
      monday: "6:00 AM - 8:00 PM",
      tuesday: "6:00 AM - 8:00 PM",
      wednesday: "6:00 AM - 8:00 PM",
      thursday: "6:00 AM - 8:00 PM",
      friday: "6:00 AM - 9:00 PM",
      saturday: "7:00 AM - 9:00 PM",
      sunday: "7:00 AM - 6:00 PM"
    },
    pricing: "$",
    rating: 4.2,
    reviewCount: 89,
    specialties: ["whole wheat", "rye", "multigrain"],
    dietary: {
      glutenFree: false,
      vegan: false,
      organic: false
    },
    offerings: {
      bread: true,
      pastries: false,
      coffee: true,
      sandwiches: false
    },
    images: ["https://images.unsplash.com/photo-1549931319-a545dcf3bc73?w=400"],
    description: "Family-owned bakery specializing in healthy, whole grain breads. Fresh baked daily.",
    languages: ["en"],
    distance: 0.7
  },
  {
    id: 3,
    name: "Le Petit Pain",
    address: {
      street: "789 Market Street",
      city: "San Francisco",
      state: "CA",
      zip: "94104",
      coordinates: { lat: 37.7949, lng: -122.3994 }
    },
    contact: {
      phone: "(415) 555-0789",
      website: "https://lepetitpain.com",
      email: "bonjour@lepetitpain.com"
    },
    hours: {
      monday: "6:30 AM - 5:00 PM",
      tuesday: "6:30 AM - 5:00 PM",
      wednesday: "6:30 AM - 5:00 PM",
      thursday: "6:30 AM - 5:00 PM",
      friday: "6:30 AM - 6:00 PM",
      saturday: "7:00 AM - 6:00 PM",
      sunday: "Closed"
    },
    pricing: "$$$",
    rating: 4.9,
    reviewCount: 203,
    specialties: ["pain au chocolat", "macarons", "eclairs"],
    dietary: {
      glutenFree: true,
      vegan: true,
      organic: true
    },
    offerings: {
      bread: true,
      pastries: true,
      coffee: true,
      sandwiches: false
    },
    images: ["https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400"],
    description: "Authentic French patisserie bringing the taste of Paris to San Francisco. Award-winning pastries.",
    languages: ["en", "fr"],
    distance: 1.2
  },
  {
    id: 4,
    name: "Rise & Shine Bakery",
    address: {
      street: "321 Pine Street",
      city: "San Francisco",
      state: "CA",
      zip: "94105",
      coordinates: { lat: 37.8049, lng: -122.3894 }
    },
    contact: {
      phone: "(415) 555-0321",
      website: "https://riseandshinebakery.com",
      email: "hello@riseandshinebakery.com"
    },
    hours: {
      monday: "5:00 AM - 2:00 PM",
      tuesday: "5:00 AM - 2:00 PM",
      wednesday: "5:00 AM - 2:00 PM",
      thursday: "5:00 AM - 2:00 PM",
      friday: "5:00 AM - 2:00 PM",
      saturday: "6:00 AM - 3:00 PM",
      sunday: "6:00 AM - 2:00 PM"
    },
    pricing: "$",
    rating: 4.0,
    reviewCount: 156,
    specialties: ["donuts", "muffins", "bagels"],
    dietary: {
      glutenFree: false,
      vegan: false,
      organic: false
    },
    offerings: {
      bread: true,
      pastries: true,
      coffee: true,
      sandwiches: true
    },
    images: ["https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400"],
    description: "Early morning bakery perfect for breakfast. Famous for our fresh donuts and coffee.",
    languages: ["en"],
    distance: 0.9
  },
  {
    id: 5,
    name: "Gluten-Free Goodness",
    address: {
      street: "654 Valencia Street",
      city: "San Francisco",
      state: "CA",
      zip: "94110",
      coordinates: { lat: 37.8149, lng: -122.3794 }
    },
    contact: {
      phone: "(415) 555-0654",
      website: "https://glutenfreegoodness.com",
      email: "info@glutenfreegoodness.com"
    },
    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 6:00 PM",
      friday: "8:00 AM - 7:00 PM",
      saturday: "9:00 AM - 7:00 PM",
      sunday: "9:00 AM - 5:00 PM"
    },
    pricing: "$$",
    rating: 4.6,
    reviewCount: 94,
    specialties: ["gluten-free bread", "celiac-safe", "almond flour"],
    dietary: {
      glutenFree: true,
      vegan: true,
      organic: true
    },
    offerings: {
      bread: true,
      pastries: true,
      coffee: true,
      sandwiches: true
    },
    images: ["https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=400"],
    description: "100% gluten-free bakery with celiac-safe practices. Delicious breads for everyone.",
    languages: ["en"],
    distance: 1.5
  },
  {
    id: 6,
    name: "Sourdough Central",
    address: {
      street: "987 Castro Street",
      city: "San Francisco",
      state: "CA",
      zip: "94114",
      coordinates: { lat: 37.8249, lng: -122.3694 }
    },
    contact: {
      phone: "(415) 555-0987",
      website: "https://sourdoughcentral.com",
      email: "hello@sourdoughcentral.com"
    },
    hours: {
      monday: "7:00 AM - 5:00 PM",
      tuesday: "7:00 AM - 5:00 PM",
      wednesday: "7:00 AM - 5:00 PM",
      thursday: "7:00 AM - 5:00 PM",
      friday: "7:00 AM - 6:00 PM",
      saturday: "8:00 AM - 6:00 PM",
      sunday: "8:00 AM - 4:00 PM"
    },
    pricing: "$$",
    rating: 4.7,
    reviewCount: 178,
    specialties: ["sourdough", "artisan loaves", "fermented breads"],
    dietary: {
      glutenFree: false,
      vegan: false,
      organic: true
    },
    offerings: {
      bread: true,
      pastries: false,
      coffee: true,
      sandwiches: false
    },
    images: ["https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400"],
    description: "San Francisco's premier sourdough bakery. Using traditional methods and local ingredients.",
    languages: ["en"],
    distance: 2.1
  }
];

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = sampleStores;
}
