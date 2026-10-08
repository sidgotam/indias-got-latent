/**
 * INDIA'S GOT LATENT - OFFICIAL SERIES & EPISODE METADATA
 * 
 * Video streaming is abstracted through the application's unified streaming layer:
 * Endpoint: /api/video/:episodeId (Stream) or /api/video/:episodeId/embed (Cinema Embed)
 * Storage provider configuration is kept securely server-side.
 */

export const DEFAULT_SERIES_INFO = {
  title: "INDIA'S GOT LATENT",
  subtitle: "Hosted by Samay Raina • Complete Season 1, Season 2 & VIP Vault",
  genre: "Comedy • Latent Talent • Roast Show • Reality TV",
  rating: "9.9 / 10",
  seasonsCount: 2,
  totalEpisodes: 30,
  synopsis: "India's wildest comedy talent show where contestants put their bizarre and latent talents on the line in front of Samay Raina and an all-star comic panel! Stream every episode with full unedited cuts, zero downloads, and direct cinema player.",
  heroBanner: "/assets/hero_banner.webp",
  season1Banner: "/assets/hero_banner.webp",
  season2Banner: "/assets/season_two_banner.webp",
  premiumBanner: "/assets/premium_vault_banner.webp",
  developerQr: "/assets/qr.jpg",
  developerUpi: "siddharthakumar109-2@okhdfcbank"
};

export const DEFAULT_EPISODES = [
  // =========================================================================
  // SEASON 1 (Episodes 1 to 12) - The OG Auditions & Iconic Guest Panels
  // =========================================================================
  {
    id: "s1-e01",
    season: 1,
    episodeNum: 1,
    title: "Episode 1: The Pilot Chaos • Tanmay Bhat & Nishant Suri",
    description: "Samay Raina launches India's Got Latent! The pilot kicks off with mind readers, a bizarre beatboxer, and a contestant who boldly self-rates 10/10 with an unexpected ending.",
    duration: "52 min",
    panel: ["Raftaar", "Samay Raina", "Balraj Singh Ghai", "Sahil Kale"],
    isStreamReady: true,
    fileSize: "605.9 MB",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Tanmay Bhat", "Pilot", "Self Score: 10/10", "Uncut"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e02",
    season: 1,
    episodeNum: 2,
    title: "Episode 2: Roast & Latents • Kunal Kamra, Atul Khatri & Raunaq",
    description: "Political satire meets wild latent talent. Atul Khatri and Kunal Kamra roast an off-beat mimicry artist while Samay tests the red buzzer on a deadpan poet.",
    duration: "48 min",
    panel: ["GamerFleet", "Samay Raina", "Balraj Singh Ghai", "Nishant Tanwar", "Karan Singh"],
    isStreamReady: true,
    fileSize: "916.4 MB",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Kunal Kamra", "Atul Khatri", "Buzzer Hit", "Mimicry"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e03",
    season: 1,
    episodeNum: 3,
    title: "Episode 3: The Neuroscience of Latent • Sidharth Warrier & Ashish Solanki",
    description: "Dr. Sidharth Warrier analyzes contestant brains while Ashish Solanki brings brutal roasts. An extreme flexibility contortionist leaves the panel speechless.",
    duration: "50 min",
    panel: ["Urfi Javed", "Samay Raina", "Balraj Singh Ghai", "Aashish Solanki", "Yashraj Mukhate"],
    isStreamReady: true,
    fileSize: "739.4 MB",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Dr. Sidharth Warrier", "Ashish Solanki", "Contortion", "1080p"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e04",
    season: 1,
    episodeNum: 4,
    title: "Episode 4: Desi Hip-Hop Cypher • Seedhe Maut & Tanmay Bhat",
    description: "Encore ABJ and Calm from Seedhe Maut join the judges table! Underground rappers and freestyle poets showcase their latent rhymes against harsh comic scores.",
    duration: "58 min",
    panel: ["Maheep Singh", "Samay Raina", "Balraj Singh Ghai", "Amit Tandon", "Neeti Palta"],
    isStreamReady: true,
    fileSize: "662.8 MB",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Seedhe Maut", "Tanmay Bhat", "Rap Cypher", "Raw"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e05",
    season: 1,
    episodeNum: 5,
    title: "Episode 5: The Unhinged Panel • Poonam Pandey & Vipul Goyal",
    description: "Pure viral mayhem! Poonam Pandey and Vipul Goyal face a contestant who claims they can guess anyone's ATM pin code and a bizarre speed-eating latent.",
    duration: "54 min",
    panel: ["Kunal Kamra", "Samay Raina", "Balraj Singh Ghai", "Atul Khatri"],
    isStreamReady: true,
    fileSize: "712.5 MB",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Poonam Pandey", "Vipul Goyal", "Viral", "18+ Unfiltered"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e06",
    season: 1,
    episodeNum: 6,
    title: "Episode 6: The Roadies Treatment • Raghu Ram & Sugandha Mishra",
    description: "Raghu Ram brings the vintage brutal Roadies grilling energy to the latent stage. Intense contestant standoffs, dramatic buzzers, and unbelievable scoring tension.",
    duration: "56 min",
    panel: ["Vipul Goyal", "Samay Raina", "Balraj Singh Ghai", "Nishant Tanwar", "Sonali Thakker"],
    isStreamReady: true,
    fileSize: "680.1 MB",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Raghu Ram", "Roadies Vibe", "Brutal Roasts", "Buzzers"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e07",
    season: 1,
    episodeNum: 7,
    title: "Episode 7: Uncle Maheep's Verdict • Maheep Singh & Vivek Samtani",
    description: "Maheep Singh's deadpan reactions steal the show as contestants present bizarre magic tricks, a whistle-symphony, and a 1-out-of-10 self-rating gamble.",
    duration: "47 min",
    panel: ["Ravi Gupta", "Samay Raina", "Rahgir", "Comic Saurabh"],
    isStreamReady: true,
    fileSize: "645.2 MB",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Maheep Singh", "Vivek Samtani", "Magic", "Deadpan"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e08",
    season: 1,
    episodeNum: 8,
    title: "Episode 8: The Bollywood Hitmaker • Badshah & Raunaq Rajani",
    description: "Badshah enters the latent arena! A surprise flute-trap performer and an aspiring playback singer try to match the judges' average score for the cash prize.",
    duration: "55 min",
    panel: ["Poonam Pandey", "Samay Raina", "Vidit Gujrathi", "Sagar Shah", "Vivek Desai"],
    isStreamReady: true,
    fileSize: "690.3 MB",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Badshah", "Music Latent", "Cash Prize", "Bloopers"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e09",
    season: 1,
    episodeNum: 9,
    title: "Episode 9: North vs West Banter • Harsh Gujral & Gaurav Kapoor",
    description: "Harsh Gujral and Gaurav Kapoor deliver non-stop relatable Delhi and Mumbai roasts. A contestant shows off impossible hand whistling and card tricks.",
    duration: "51 min",
    panel: ["Deepak Kalal", "Samay Raina", "Balraj Singh Ghai", "Manan Desai", "Agu Stanley"],
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Harsh Gujral", "Gaurav Kapoor", "Delhi Banter", "Card Tricks"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e10",
    season: 1,
    episodeNum: 10,
    title: "Episode 10: Haq Se Latent • Zakir Khan & Biswa Kalyan Rath",
    description: "Comedy royalty assemble! Zakir Khan and Biswa Kalyan Rath bring poetic critiques and existential laughs as a hyper-speed human calculator tests the panel.",
    duration: "1 hr 02 min",
    panel: ["Tanmay Bhat", "Samay Raina", "Balraj Singh Ghai", "Raghu Ram", "Sid Warrier"],
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Zakir Khan", "Biswa Kalyan Rath", "Math Latent", "Masterpiece"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e11",
    season: 1,
    episodeNum: 11,
    title: "Episode 11: Late Night Binge • Anubhav Singh Bassi & Munawar Faruqui",
    description: "Bassi and Munawar join Samay for an electric, laugh-a-minute episode. An aspiring stand-up comic attempts to roast the entire panel to their face.",
    duration: "59 min",
    panel: ["Bharti Singh", "Samay Raina", "Haarsh Limbachiyaa", "Tony Kakkar", "Drew Hicks"],
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Anubhav Bassi", "Munawar Faruqui", "Roast Battle", "Uncut"],
    isPremium: false,
    releaseYear: "2024"
  },
  {
    id: "s1-e12",
    season: 1,
    episodeNum: 12,
    title: "Episode 12: Season 1 Mega Finale • The Grand Jackpot Showdown",
    description: "The monumental Season 1 finale! The highest rated contestants return for the ultimate jackpot round, surprise guest appearances, and Samay's grand roast.",
    duration: "1 hr 15 min",
    panel: ["Rakhi Sawant", "Samay Raina", "Aashish Solanki", "Maheep Singh"],
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s1_thumb.webp",
    tags: ["Season Finale", "Jackpot Winner", "Mega Panel", "All-Stars"],
    isPremium: false,
    releaseYear: "2024"
  },

  // =========================================================================
  // SEASON 2 (Episodes 1 to 12) - Unhinged Chaos & New Latent Challenges
  // =========================================================================
  {
    id: "s2-e01",
    season: 2,
    episodeNum: 1,
    title: "Episode 1: Season 2 Grand Premiere • The Latent Returns",
    description: "India's Got Latent is back bigger, bolder, and more unhinged! New scoring twists, revamped red buzzers, and a wild mentalist audition to start the season.",
    duration: "55 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Season 2 Premiere", "Mentalist", "New Rules", "4K Ultra"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e02",
    season: 2,
    episodeNum: 2,
    title: "Episode 2: The Speedcuber & Hypnotist Special",
    description: "A Rubik's cube speedcuber solves 3 cubes blindfolded while a self-proclaimed hypnotist attempts to put Samay Raina to sleep on live stage.",
    duration: "49 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Speedcube", "Hypnosis", "Buzzer Drama"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e03",
    season: 2,
    episodeNum: 3,
    title: "Episode 3: Underground Beatbox & Sitar Trap",
    description: "A jaw-dropping fusion of classical Indian sitar and modern trap 808s that stuns the panel, followed by a mouth-popping beatbox duel.",
    duration: "52 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Sitar Trap", "Beatbox", "Score: 9/10"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e04",
    season: 2,
    episodeNum: 4,
    title: "Episode 4: The Extreme Stunt & Fire Latent",
    description: "Heart-stopping moments as a daredevil swallows fire torches on set. Samay grabs the fire extinguisher as the judges prepare the red buzzers.",
    duration: "46 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Fire Stunts", "High Stakes", "Adrenaline"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e05",
    season: 2,
    episodeNum: 5,
    title: "Episode 5: The Master of Impressions • Bollywood Mimicry",
    description: "Flawless rapid-fire impressions of Nana Patekar, Amitabh Bachchan, Shah Rukh Khan, and PM Modi in a mock panel debate that cracks everyone up.",
    duration: "53 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Mimicry", "Bollywood", "Laughter Riot"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e06",
    season: 2,
    episodeNum: 6,
    title: "Episode 6: The Rare Perfect 10/10 Latent Score",
    description: "History is made! A contestant's self-predicted score miraculously synchronizes with the judges' average score for the biggest cash win of Season 2.",
    duration: "57 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Perfect 10/10", "Cash Jackpot", "Emotional Moment"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e07",
    season: 2,
    episodeNum: 7,
    title: "Episode 7: The Unfiltered Ventriloquist Puppet Show",
    description: "A puppet with no filter relentlessly roasts Samay Raina's chess career and every judge on the desk before demanding a 10/10 score.",
    duration: "48 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Ventriloquism", "Puppet Roast", "Uncensored"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e08",
    season: 2,
    episodeNum: 8,
    title: "Episode 8: Reverse Roast • Contestant vs The Panel",
    description: "A contestant turns the entire show upside down, rating each judge on their latent judging abilities with hilarious slide presentations.",
    duration: "50 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Reverse Roast", "Powerplay", "Comic Gold"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e09",
    season: 2,
    episodeNum: 9,
    title: "Episode 9: The Human Calendar & Memory Wonder",
    description: "Contestant calculates any day of the week across 500 years in 0.5 seconds and memorizes an entire deck of cards in front of the audience.",
    duration: "45 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Human Calendar", "Memory Genius", "Mind Blown"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e10",
    season: 2,
    episodeNum: 10,
    title: "Episode 10: Hyper-Realistic Foley Sound Effects",
    description: "Using only vocal cords and household props, the performer creates an entire action movie soundtrack live on the microphone.",
    duration: "54 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Foley Art", "Sound FX", "Standing Ovation"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e11",
    season: 2,
    episodeNum: 11,
    title: "Episode 11: Semifinal Clash • Top 6 Latents Battle",
    description: "The top 6 highest-scoring latent talents from Season 2 clash head-to-head in an elimination bracket to earn their ticket to the finale.",
    duration: "1 hr 05 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Semifinals", "Elimination", "High Tension"],
    isPremium: false,
    releaseYear: "2025"
  },
  {
    id: "s2-e12",
    season: 2,
    episodeNum: 12,
    title: "Episode 12: Season 2 Grand Finale • Latent Champion",
    description: "The spectacular Season 2 Finale! Crowning India's ultimate Latent Talent Champion with a mega cash prize, trophy, and an all-star comedy roast.",
    duration: "1 hr 18 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/s2_thumb.webp",
    tags: ["Grand Finale", "Champion", "Jackpot", "All-Stars"],
    isPremium: false,
    releaseYear: "2025"
  },

  // =========================================================================
  // VIP UNCUT VAULT (Episodes 1 to 6) - Backstage Roasts & Special Edits (100% Free)
  // =========================================================================
  {
    id: "vip-sp01",
    season: "VIP",
    episodeNum: 1,
    title: "VIP Uncut: Samay & Tanmay 45-Min Green Room Roast",
    description: "Uncensored green room banter between Samay Raina and Tanmay Bhat before show taping. Full of hilarious unscripted jokes, chai talks, and set gossip.",
    duration: "45 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/vip_thumb.webp",
    tags: ["Green Room", "Uncut", "Tanmay & Samay", "100% Free"],
    isPremium: true,
    releaseYear: "Exclusive"
  },
  {
    id: "vip-sp02",
    season: "VIP",
    episodeNum: 2,
    title: "VIP Vault: The Bizarre Rejected Auditions Hall of Fame",
    description: "The audition tapes that were too absurd, chaotic, or unhinged to make the main broadcast. Pure unfiltered comedy madness.",
    duration: "40 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/vip_thumb.webp",
    tags: ["Rejected Auditions", "Too Wild", "Free Access"],
    isPremium: true,
    releaseYear: "Exclusive"
  },
  {
    id: "vip-sp03",
    season: "VIP",
    episodeNum: 3,
    title: "VIP Special: Ultimate Red Buzzer Smash Compilation",
    description: "Every single time the judges furiously hammered the red buzzers across Season 1 and Season 2, with slow-motion replays and hilarious reactions.",
    duration: "35 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/vip_thumb.webp",
    tags: ["Red Buzzer", "Compilation", "Outrageous"],
    isPremium: true,
    releaseYear: "Exclusive"
  },
  {
    id: "vip-sp04",
    season: "VIP",
    episodeNum: 4,
    title: "VIP Extended: Raghu Ram vs Contestant Uncut Deliberation",
    description: "Full raw 30-minute argument between Raghu Ram and a stubborn contestant who refused to accept a score below 10/10.",
    duration: "38 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/vip_thumb.webp",
    tags: ["Raghu Ram", "Extended Cut", "Heated Debate"],
    isPremium: true,
    releaseYear: "Exclusive"
  },
  {
    id: "vip-sp05",
    season: "VIP",
    episodeNum: 5,
    title: "VIP Documentary: Behind The Latent • Making of The Show",
    description: "Exclusive behind-the-scenes documentary exploring how the India's Got Latent stage was designed, how contestants are scouted, and backstage prep.",
    duration: "42 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/vip_thumb.webp",
    tags: ["Making-Of", "Behind The Scenes", "Crew Special"],
    isPremium: true,
    releaseYear: "Exclusive"
  },
  {
    id: "vip-sp06",
    season: "VIP",
    episodeNum: 6,
    title: "VIP Sneak Peek: Season 3 Prospective Latent Tapes",
    description: "Exclusive preview clips of prospective contestants, potential celebrity guest judges, and surprise new scoring mechanics coming in Season 3.",
    duration: "28 min",
    isStreamReady: false,
    fileSize: "Coming Soon",
    thumbnail: "/assets/thumbnails/vip_thumb.webp",
    tags: ["Season 3 Sneak Peek", "Exclusive Lore", "Free VIP"],
    isPremium: true,
    releaseYear: "Exclusive"
  }
];

/**
 * Checks if an episode is stream-ready
 */
export function isEpisodeStreamReady(ep) {
  if (!ep) return false;
  return Boolean(ep.isStreamReady);
}

/**
 * Returns the application embed player endpoint for an episode.
 * The frontend embeds our own endpoint (/api/video/:id/embed), NOT an external storage URL.
 */
export function getVideoStreamUrl(episodeId) {
  if (!episodeId) return '';
  return `/api/video/${encodeURIComponent(episodeId)}/embed`;
}

/**
 * Returns the direct media stream endpoint for an episode.
 */
export function getVideoDirectStreamUrl(episodeId) {
  if (!episodeId) return '';
  return `/api/video/${encodeURIComponent(episodeId)}`;
}
