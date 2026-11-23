import mongoose from "mongoose";
import Product from "./schema/productSchema.js";
import User from "./schema/userSchema.js";
import Review from "./schema/reviewSchema.js";
import { hashPassword } from "./utils/hashing.js";

const perfumes = [
  // MIDDLE EASTERN
  {
    name: "Khamrah Qahwa",
    brand: "Lattafa",
    category: "Middle Eastern",
    scentFamily: "Gourmand Spicy Amber",
    description: "An opulent, decadent Middle Eastern masterpiece. Blends rich Arabic coffee, warm cinnamon, praline, candied dates, and tonka bean for an intoxicating cold-weather projection.",
    notes: {
      top: ["Ginger", "Cinnamon", "Cardamom"],
      middle: ["Praline", "Candied Fruit", "White Flowers"],
      base: ["Arabic Coffee", "Tonka Bean", "Benzoin", "Vanilla", "Oud"]
    },
    samplePrices: { twoMl: 350, fiveMl: 750, tenMl: 1350 },
    price: 750,
    quantity: 65,
    image: "/images/middle-eastern/Lattafa_Khamrah_Qahwa.jpg",
    rating: 4.9,
    reviewsCount: 38,
    badge: "Bestseller",
    inStock: true
  },
  {
    name: "Asad Bourbon",
    brand: "Lattafa",
    category: "Middle Eastern",
    scentFamily: "Warm Spicy Bourbon Vanilla",
    description: "A dark, magnetic powerhouse blend. Opens with cracked black pepper, tobacco, and pineapple before revealing a rich bourbon vanilla, coffee, and roasted tonka bean drydown.",
    notes: {
      top: ["Black Pepper", "Tobacco", "Pineapple"],
      middle: ["Coffee", "Patchouli", "Iris"],
      base: ["Bourbon Vanilla", "Amber", "Dry Woods", "Benzoin"]
    },
    samplePrices: { twoMl: 320, fiveMl: 700, tenMl: 1290 },
    price: 700,
    quantity: 70,
    image: "/images/middle-eastern/Lattafa_Asad_Bourbon.jpg",
    rating: 4.9,
    reviewsCount: 36,
    badge: "New Arrival",
    inStock: true
  },
  {
    name: "9 PM Pour Homme",
    brand: "Afnan",
    category: "Middle Eastern",
    scentFamily: "Sweet Oriental Vanilla",
    description: "The ultimate evening clubbing scent. Fresh green apple and wild lavender opening that settles into warm cinnamon, orange blossom, and an alluring bourbon vanilla trail.",
    notes: {
      top: ["Wild Apple", "Cinnamon", "Wild Lavender", "Bergamot"],
      middle: ["Orange Blossom", "Lily of the Valley"],
      base: ["Vanilla", "Tonka Bean", "Amber", "Cedarwood"]
    },
    samplePrices: { twoMl: 300, fiveMl: 650, tenMl: 1200 },
    price: 650,
    quantity: 80,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 42,
    badge: "Trending",
    inStock: true
  },
  {
    name: "Hawas for Him",
    brand: "Rasasi",
    category: "Middle Eastern",
    scentFamily: "Fresh Aquatic Amber",
    description: "Dubai's most famous fresh beast-mode fragrance. Combines Italian citrus, crisp apple, aquatic marine chords with rich ambergris and driftwood that lasts through hot summer days.",
    notes: {
      top: ["Italian Bergamot", "Apple", "Cinnamon", "Lemon"],
      middle: ["Watery Notes", "Plum", "Orange Blossom", "Cardamom"],
      base: ["Ambergris", "Musk", "Patchouli", "Driftwood"]
    },
    samplePrices: { twoMl: 400, fiveMl: 850, tenMl: 1550 },
    price: 850,
    quantity: 50,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 29,
    badge: "Summer Hit",
    inStock: true
  },
  {
    name: "Club de Nuit Intense Man (Pure Parfum)",
    brand: "Armaf",
    category: "Middle Eastern",
    scentFamily: "Smoky Fruity Woody",
    description: "A legendary powerhouse. Opens with crisp lemon and blackcurrant, evolving into a sophisticated heart of birch smoke and jasmine, finishing on ambergris and patchouli.",
    notes: {
      top: ["Lemon", "Pineapple", "Blackcurrant", "Bergamot"],
      middle: ["Birch", "Jasmine", "Rose"],
      base: ["Ambergris", "Musk", "Patchouli", "Vanilla"]
    },
    samplePrices: { twoMl: 350, fiveMl: 750, tenMl: 1390 },
    price: 750,
    quantity: 90,
    image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewsCount: 56,
    badge: "Classic",
    inStock: true
  },

  // DESIGNER
  {
    name: "Sauvage Elixir",
    brand: "Dior",
    category: "Designer",
    scentFamily: "Dark Spicy Woody",
    description: "An extraordinarily concentrated fragrance steeped in the iconic freshness of Sauvage with an intoxicating heart of spices, rich organic lavender essence, and a blend of rich woods.",
    notes: {
      top: ["Nutmeg", "Cinnamon", "Cardamom", "Grapefruit"],
      middle: ["Lavender Essence"],
      base: ["Licorice", "Sandalwood", "Amber", "Patchouli", "Haitian Vetiver"]
    },
    samplePrices: { twoMl: 850, fiveMl: 1950, tenMl: 3600 },
    price: 1950,
    quantity: 40,
    image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 64,
    badge: "Iconic",
    inStock: true
  },
  {
    name: "Noir Extreme",
    brand: "Tom Ford",
    category: "Designer",
    scentFamily: "Warm Amber Woody",
    description: "An amber-drenched, woody oriental fragrance with a tantalizing and delectable heart of Indian Kulfi, infused with pistachio and rose water.",
    notes: {
      top: ["Cardamom", "Nutmeg", "Saffron", "Mandarin Orange", "Neroli"],
      middle: ["Kulfi", "Rose", "Mastic", "Orange Blossom", "Jasmine"],
      base: ["Vanilla", "Amber", "Woody Notes", "Sandalwood"]
    },
    samplePrices: { twoMl: 890, fiveMl: 2100, tenMl: 3850 },
    price: 2100,
    quantity: 35,
    image: "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 31,
    badge: "Luxury Date",
    inStock: true
  },
  {
    name: "Bleu de Chanel Parfum",
    brand: "Chanel",
    category: "Designer",
    scentFamily: "Aromatic Woody",
    description: "The pinnacle of sophistication. Pure, clean cedarwood and creamy New Caledonian sandalwood enveloped in fresh zesty citrus and aromatic mint.",
    notes: {
      top: ["Lemon Zest", "Bergamot", "Mint", "Artemisia"],
      middle: ["Lavender", "Geranium", "Green Notes", "Pineapple"],
      base: ["Sandalwood", "Cedar", "Amberwood", "Iso E Super", "Tonka Bean"]
    },
    samplePrices: { twoMl: 750, fiveMl: 1750, tenMl: 3200 },
    price: 1750,
    quantity: 45,
    image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 47,
    badge: "Signature",
    inStock: true
  },
  {
    name: "La Nuit de L'Homme",
    brand: "Yves Saint Laurent",
    category: "Designer",
    scentFamily: "Spicy Aromatic Wood",
    description: "A dark, seductive cardamomic elixir designed for intimate encounters. Warm, spicy, subtly sweet, and unforgettable.",
    notes: {
      top: ["Cardamom"],
      middle: ["French Lavender", "Virginia Cedar", "Bergamot"],
      base: ["Vetiver", "Caraway"]
    },
    samplePrices: { twoMl: 650, fiveMl: 1450, tenMl: 2650 },
    price: 1450,
    quantity: 55,
    image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewsCount: 35,
    badge: "Intimate",
    inStock: true
  },

  // NICHE
  {
    name: "Baccarat Rouge 540 Extrait",
    brand: "Maison Francis Kurkdjian",
    category: "Niche",
    scentFamily: "Amber Floral Woody",
    description: "The crown jewel of niche perfumery. Grandiflorum jasmine from Egypt, powdery bitter almond from Morocco, and radiant ambergris with cedar wood accord.",
    notes: {
      top: ["Bitter Almond", "Saffron"],
      middle: ["Egyptian Jasmine Grandiflorum", "Cedar"],
      base: ["Ambergris", "Woody Notes", "Musk"]
    },
    samplePrices: { twoMl: 1450, fiveMl: 3350, tenMl: 6200 },
    price: 3350,
    quantity: 25,
    image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 82,
    badge: "Ultra Luxury",
    inStock: true
  },
  {
    name: "Layton",
    brand: "Parfums de Marly",
    category: "Niche",
    scentFamily: "Warm Spicy Vanilla Gourmand",
    description: "A sensory voyage framed by royal French courts. Seductive vanilla, caramelized green apple, spicy cardamom, and noble guaiac wood.",
    notes: {
      top: ["Apple", "Lavender", "Bergamot", "Mandarin Orange"],
      middle: ["Cardamom", "Geranium", "Jasmine"],
      base: ["Bourbon Vanilla", "Pepper", "Guaiac Wood", "Patchouli", "Sandalwood"]
    },
    samplePrices: { twoMl: 1200, fiveMl: 2750, tenMl: 5100 },
    price: 2750,
    quantity: 30,
    image: "/images/niche/PDM_Layton.jpg",
    rating: 4.9,
    reviewsCount: 51,
    badge: "Masterpiece",
    inStock: true
  },
  {
    name: "Aventus",
    brand: "Creed",
    category: "Niche",
    scentFamily: "Chypre Fruity Birch",
    description: "The historical benchmark of luxury fragrances. Sensual, audacious, and contemporary, celebrating strength, power, and success.",
    notes: {
      top: ["Lemon", "Pink Pepper", "Apple", "Bergamot", "Blackcurrant"],
      middle: ["Pineapple", "Jasmine", "Indonesian Patchouli"],
      base: ["Birch", "Ambergris", "Cedarwood", "Oakmoss", "Musk"]
    },
    samplePrices: { twoMl: 1350, fiveMl: 3100, tenMl: 5800 },
    price: 3100,
    quantity: 20,
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewsCount: 76,
    badge: "Holy Grail",
    inStock: true
  },
  {
    name: "1861 Naxos",
    brand: "Xerjoff",
    category: "Niche",
    scentFamily: "Aromatic Honey Tobacco",
    description: "A tribute to the grandeur and glamour of Italy. Sweet Sicilian honey, golden tobacco leaf, calming lavender, and rich tonka bean.",
    notes: {
      top: ["Lavender", "Bergamot", "Lemon"],
      middle: ["Honey", "Cinnamon", "Cashmeran", "Jasmine Sambac"],
      base: ["Tobacco Leaf", "Tonka Bean", "Vanilla"]
    },
    samplePrices: { twoMl: 1300, fiveMl: 2950, tenMl: 5450 },
    price: 2950,
    quantity: 22,
    image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
    rating: 5.0,
    reviewsCount: 43,
    badge: "Connoisseur",
    inStock: true
  }
];

export const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scentSampleNepal";
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing
    await Product.deleteMany({});
    await User.deleteMany({});
    await Review.deleteMany({});

    // Seed products
    const insertedProducts = await Product.insertMany(perfumes);
    console.log(`Seeded ${insertedProducts.length} luxury perfume decants!`);

    // Seed Admin and Demo User
    const adminPassword = await hashPassword("admin123");
    const userPassword = await hashPassword("user123");

    await User.create([
      {
        name: "Scent Nepal Admin",
        email: "admin@scentsample.np",
        password: adminPassword,
        role: "admin",
      },
      {
        name: "Aayush Sharma",
        email: "aayush@gmail.com",
        password: userPassword,
        role: "customer",
      },
    ]);
    console.log("Seeded Admin & Customer accounts!");

    // Seed sample reviews for Khamrah and Baccarat Rouge
    const khamrah = insertedProducts.find((p) => p.name.includes("Khamrah"));
    const br540 = insertedProducts.find((p) => p.name.includes("Baccarat"));

    if (khamrah) {
      await Review.create([
        {
          productId: khamrah._id,
          userName: "Prabin Shrestha (Kathmandu)",
          rating: 5,
          comment: "Insane value for money! The 5ml decant lasts for weeks. The cinnamon and coffee drydown is unbelievable for Kathmandu winters.",
          scentLongevity: "10+ Hours",
        },
        {
          productId: khamrah._id,
          userName: "Sujan Karki (Pokhara)",
          rating: 5,
          comment: "Authentic juice and high quality spray atomizer. 100% recommended instead of blind buying full bottles.",
          scentLongevity: "9 Hours",
        },
      ]);
    }

    if (br540) {
      await Review.create([
        {
          productId: br540._id,
          userName: "Anisha Thapa (Lalitpur)",
          rating: 5,
          comment: "Truly heavenly. Could never justify Rs. 65,000 for a full bottle, but the 2ml sample lets me wear it for all my special events!",
          scentLongevity: "12+ Hours",
        },
      ]);
    }

    console.log("Sample reviews seeded successfully.");
    console.log("Database successfully seeded!");
  } catch (error) {
    console.error("Seeding error:", error);
  }
};

// If run directly:
if (process.argv[1] && process.argv[1].endsWith("seedData.js")) {
  seedDatabase().then(() => {
    mongoose.connection.close();
  });
}
