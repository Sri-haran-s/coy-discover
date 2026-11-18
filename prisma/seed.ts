// Seeds one demo user, 32 mock profiles, and a few PRIVATE incoming likes.
// Re-running this script rebuilds everything from scratch (it also clears swipes/matches).
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const DEMO_USER_ID = process.env.DEMO_USER_ID ?? "demo-user";

type Gender = "women" | "men";
type Presence = "online" | "recent" | "offline";

interface SeedProfile {
  name: string;
  age: number;
  gender: Gender;
  portrait: number; // index on randomuser.me (stable, realistic portraits)
  city: string;
  college?: string;
  bio: string;
  interests: string[];
  presence: Presence;
  likesYou?: boolean; // a PRIVATE incoming like — never exposed by the API
}

const profiles: SeedProfile[] = [
  { name: "Meera Iyer", age: 24, gender: "women", portrait: 44, city: "Coimbatore", college: "PSG Tech",
    bio: "Product designer by day, filter-coffee snob always. Looking for someone to walk Race Course Road with at 6 a.m.",
    interests: ["Design", "Filter coffee", "Morning walks", "Typography"], presence: "online" },
  { name: "Rohan Kapoor", age: 27, gender: "men", portrait: 32, city: "Mumbai",
    bio: "Sunday-league footballer and amateur ramen chef. My broth takes eleven hours; my patience takes less.",
    interests: ["Football", "Cooking", "Ramen", "Podcasts"], presence: "recent" },
  { name: "Ananya Rao", age: 25, gender: "women", portrait: 68, city: "Bengaluru", college: "IISc",
    bio: "Researcher who talks about proteins way too much. Will trade fun facts for trail recommendations.",
    interests: ["Science", "Hiking", "Board games", "Chai"], presence: "online", likesYou: true },
  { name: "Kabir Malhotra", age: 28, gender: "men", portrait: 41, city: "Delhi",
    bio: "Street photographer chasing golden hour through the lanes of Old Delhi. Will stop mid-walk for a good shadow.",
    interests: ["Photography", "Street food", "Cycling", "Film"], presence: "offline" },
  { name: "Sofia Marchetti", age: 26, gender: "women", portrait: 12, city: "Pune",
    bio: "Italian-Indian. Cooks pasta at midnight and apologises to the neighbours later.",
    interests: ["Cooking", "Travel", "Indie music", "Pottery"], presence: "recent" },
  { name: "Arjun Nair", age: 29, gender: "men", portrait: 22, city: "Kochi",
    bio: "Marine biologist. Yes, I've met a whale. No, it wasn't impressed.",
    interests: ["Diving", "Marine life", "Sailing", "Reading"], presence: "online", likesYou: true },
  { name: "Isha Verma", age: 23, gender: "women", portrait: 85, city: "Jaipur", college: "MNIT",
    bio: "Architecture student sketching the city one chhatri at a time. Always carrying a pencil, rarely an eraser.",
    interests: ["Sketching", "Architecture", "Chai", "Heritage walks"], presence: "online" },
  { name: "Dev Patel", age: 26, gender: "men", portrait: 52, city: "Ahmedabad",
    bio: "Startup ops by trade, garba enthusiast by season. Ask me about my spreadsheet for planning trips.",
    interests: ["Travel", "Garba", "Spreadsheets", "Cricket"], presence: "recent" },
  { name: "Nisha Fernandes", age: 27, gender: "women", portrait: 26, city: "Goa",
    bio: "Surf instructor who gets weirdly competitive at Scrabble. Sunsets are non-negotiable.",
    interests: ["Surfing", "Scrabble", "Sunsets", "Beach clean-ups"], presence: "offline", likesYou: true },
  { name: "Vikram Singh", age: 30, gender: "men", portrait: 64, city: "Chandigarh",
    bio: "Ex-cricketer turned sports physio. Will fix your posture within five minutes of meeting you.",
    interests: ["Cricket", "Fitness", "Road trips", "Dhabas"], presence: "recent" },
  { name: "Tara Menon", age: 25, gender: "women", portrait: 65, city: "Chennai", college: "Loyola",
    bio: "Carnatic vocalist and secret K-drama fan. Come for the ragas, stay for the plot twists.",
    interests: ["Carnatic music", "K-dramas", "Journaling", "Beach walks"], presence: "online", likesYou: true },
  { name: "Aditya Joshi", age: 28, gender: "men", portrait: 77, city: "Hyderabad",
    bio: "Backend engineer who bakes sourdough to feel something. The starter is named Gordon.",
    interests: ["Sourdough", "Open source", "Chess", "Cycling"], presence: "online" },
  { name: "Priya Sharma", age: 24, gender: "women", portrait: 90, city: "Kolkata", college: "Presidency University",
    bio: "Poetry slams, rooftop adda, and far too many second-hand books. Recommend me something sad.",
    interests: ["Poetry", "Books", "Adda", "Theatre"], presence: "recent" },
  { name: "Omar Haddad", age: 27, gender: "men", portrait: 58, city: "Dubai",
    bio: "Product manager and weekend sandwich architect. Convinced the perfect croissant exists; still searching.",
    interests: ["Coffee", "Hiking", "Brunch", "Chess"], presence: "offline" },
  { name: "Lena Fischer", age: 26, gender: "women", portrait: 17, city: "Berlin",
    bio: "Moved from Munich for the techno, stayed for the bike lanes. Fluent in sarcasm and mediocre Hindi.",
    interests: ["Techno", "Cycling", "Languages", "Vintage markets"], presence: "recent", likesYou: true },
  { name: "Sameer Khan", age: 29, gender: "men", portrait: 11, city: "Lucknow",
    bio: "Storyteller, podcast host, biryani purist. Will argue about it respectfully for hours.",
    interests: ["Storytelling", "Podcasts", "Biryani", "Cricket"], presence: "online" },
  { name: "Riya Banerjee", age: 22, gender: "women", portrait: 2, city: "Bhubaneswar", college: "XIM University",
    bio: "Final-year MBA kid with a bullet-journal habit and a plan for everything except Friday nights.",
    interests: ["Bullet journaling", "Odissi", "Cafés", "Planners"], presence: "online" },
  { name: "Neil D'Souza", age: 27, gender: "men", portrait: 4, city: "Mumbai",
    bio: "Jazz bassist playing small bars you'd never find on your own. Takes requests if you tip in chai.",
    interests: ["Jazz", "Bass guitar", "Vinyl", "Chai"], presence: "recent" },
  { name: "Kavya Reddy", age: 28, gender: "women", portrait: 51, city: "Hyderabad",
    bio: "Pediatric nurse with a soft spot for dogs and truly terrible parallel parking.",
    interests: ["Dogs", "Volunteering", "Baking", "Road trips"], presence: "recent", likesYou: true },
  { name: "Harsh Agarwal", age: 25, gender: "men", portrait: 81, city: "Indore",
    bio: "Aspiring chef who has perfected exactly one dish: poha. Open to feedback and better food opinions.",
    interests: ["Cooking", "Street food", "Gaming", "Cricket"], presence: "offline" },
  { name: "Zoya Ali", age: 26, gender: "women", portrait: 75, city: "Bhopal",
    bio: "Documentary filmmaker telling stories about craftspeople. Currently obsessed with block printing.",
    interests: ["Documentaries", "Crafts", "Travel", "Photography"], presence: "online" },
  { name: "Rahul Desai", age: 31, gender: "men", portrait: 88, city: "Pune",
    bio: "Weekend trekker, weekday data nerd. Can name every Sahyadri fort reachable before 7 a.m.",
    interests: ["Trekking", "Data", "Forts", "Coffee"], presence: "recent" },
  { name: "Sana Qureshi", age: 24, gender: "women", portrait: 60, city: "Mysuru",
    bio: "Yoga teacher who owns three plants named after Marvel characters. Slow mornings, loud laughs.",
    interests: ["Yoga", "Plants", "Marvel", "Slow living"], presence: "online" },
  { name: "Tejas Kulkarni", age: 27, gender: "men", portrait: 92, city: "Nashik",
    bio: "A winemaker's son and wannabe sommelier. Will happily lose a pub quiz to talk about tannins.",
    interests: ["Wine", "Pub quizzes", "Vineyards", "Cycling"], presence: "offline", likesYou: true },
  { name: "Aisha Rahman", age: 25, gender: "women", portrait: 47, city: "Mangaluru",
    bio: "Ocean person and anxious over-packer. Beach cafés, long sunsets, and the world's best fish curry.",
    interests: ["Beaches", "Seafood", "Travel", "Reading"], presence: "recent" },
  { name: "Karthik Subramanian", age: 26, gender: "men", portrait: 19, city: "Coimbatore", college: "Amrita",
    bio: "ML engineer who runs half-marathons on weekends. Will talk about gradients; will not talk about my PR.",
    interests: ["Running", "Machine learning", "Filter coffee", "Chess"], presence: "online" },
  { name: "Diya Kapoor", age: 23, gender: "women", portrait: 79, city: "Delhi", college: "Lady Shri Ram College",
    bio: "Stand-up open-micer testing material on strangers. Laugh once and I'll fall a little.",
    interests: ["Stand-up comedy", "Writing", "Theatre", "Thrifting"], presence: "online" },
  { name: "Ishaan Bose", age: 28, gender: "men", portrait: 72, city: "Kolkata",
    bio: "Documentary sound recordist. I hear things you don't. Probably your fridge humming.",
    interests: ["Field recording", "Film", "Football", "Cooking"], presence: "recent", likesYou: true },
  { name: "Pooja Nambiar", age: 27, gender: "women", portrait: 32, city: "Thiruvananthapuram",
    bio: "Kathak dancer, part-time baker. Dance by evening, banana bread by default.",
    interests: ["Kathak", "Baking", "Reading", "Beaches"], presence: "offline" },
  { name: "Rishi Gupta", age: 29, gender: "men", portrait: 33, city: "Gurugram",
    bio: "Climbing-gym regular, rubbish at small talk, great at carrying heavy things on hikes.",
    interests: ["Bouldering", "Hiking", "Board games", "Coffee"], presence: "recent" },
  { name: "Mira Choudhury", age: 26, gender: "women", portrait: 9, city: "Guwahati",
    bio: "Tea-estate kid turned travel writer. Ask me about the monsoon in Assam.",
    interests: ["Travel writing", "Tea", "Monsoons", "Photography"], presence: "online" },
  { name: "Yash Thakur", age: 24, gender: "men", portrait: 85, city: "Shimla",
    bio: "Mountain-born, city-tired. Cooking Himachali dhaam on Sundays and hunting for the next trail.",
    interests: ["Trekking", "Cooking", "Folk music", "Photography"], presence: "offline" },
];

async function main() {
  // Rebuild from a clean slate so the seed is repeatable.
  await prisma.match.deleteMany();
  await prisma.swipe.deleteMany();
  await prisma.profileLike.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      id: DEMO_USER_ID,
      name: "Demo User",
      photoUrl: "https://randomuser.me/api/portraits/men/36.jpg",
    },
  });

  let incomingLikes = 0;
  for (const [index, p] of profiles.entries()) {
    const created = await prisma.profile.create({
      data: {
        name: p.name,
        age: p.age,
        photoUrl: `https://randomuser.me/api/portraits/${p.gender}/${p.portrait}.jpg`,
        bio: p.bio,
        city: p.city,
        college: p.college ?? null,
        interests: JSON.stringify(p.interests),
        presence: p.presence,
        position: index,
      },
    });

    if (p.likesYou) {
      await prisma.profileLike.create({
        data: { profileId: created.id, userId: DEMO_USER_ID },
      });
      incomingLikes++;
    }
  }

  console.log(
    `Seeded 1 demo user, ${profiles.length} profiles and ${incomingLikes} private incoming likes.`,
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
