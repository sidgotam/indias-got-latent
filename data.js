// =========================================================================
// 🎬 INDIA'S GOT LATENT - VIDEO STREAM DATA & LINKS
// =========================================================================
//
// 📌 HOW TO ADD / UPDATE VIDEOS:
// - Episodes are managed through the internal storage layer (server/storageConfig.js).
// - Storage references are mapped server-side for abstracted OTT video streaming.
// - If left unmapped, the episode displays as "Coming Soon".
//
// =========================================================================

var VIDEO_STREAM_LINKS = {
    // =========================================================================
    // 📺 SEASON 1 EPISODES (Episodes 1 - 12)
    // =========================================================================
    "s1-e01": "1bccMfHnHgSuegozF_5qp78vWwSVcwrIq", // Ep 1: Pilot Chaos (Tanmay Bhat & Nishant Suri)
    "s1-e02": "1EZ7-DvvGynEnxpBCHO93NmaD-Yesw1FU", // Ep 2: Roast & Latents (Kunal Kamra & Atul Khatri)
    "s1-e03": "1Fe1SkaCv7b2d2C4FWuS9gt18ygdIm3pu", // Ep 3: Neuroscience & Beats (Dr. Sidharth Warrier)
    "s1-e04": "1gHvFlD5dBFc63NaMQQSudfm6PySmXpDs", // Episode 4: Paste link here to auto-add!
    "s1-e05": "1xq7nmLIcp4Wnn17F8s1diDFdIrK1WA43",
    
  "s1-e06": "1rwaSaBCdyPE4zIwM5qbrE3YxiNQMU3vS", // Episode 6: Paste link here to auto-add!
    "s1-e07": "19nq5G7BNghO36Kti6a5ZBunJ97LkCmTd", // Episode 7: Paste link here to auto-add!
    "s1-e08": "1u6ad12iHKHmhR4jBSERc7fiLecGzNLP8", // Episode 8: Paste link here to auto-add!
    "s1-e09": "", // Episode 9: Paste link here to auto-add!
    "s1-e10": "", // Episode 10: Paste link here to auto-add!
    "s1-e11": "", // Episode 11: Paste link here to auto-add!
    "s1-e12": "", // Episode 12: Paste link here to auto-add!

    // =========================================================================
    // 🔥 SEASON 2 EPISODES (Episodes 1 - 12)
    // =========================================================================
    "s2-e01": "", // S2 • Ep 1: Season 2 Premiere
    "s2-e02": "", // S2 • Ep 2: Gen-Z Influencers
    "s2-e03": "", // S2 • Ep 3: Hypnotism & Mentalism
    "s2-e04": "", // S2 • Ep 4: Regional Roast
    "s2-e05": "", // S2 • Ep 5: Danger Latents
    "s2-e06": "", // S2 • Ep 6: Musical Chaos
    "s2-e07": "", // S2 • Ep 7: Wild Card Entry
    "s2-e08": "", // S2 • Ep 8: Meme Royalty
    "s2-e09": "", // S2 • Ep 9: Ventriloquist Roast
    "s2-e10": "", // S2 • Ep 10: Rapid Fire Buzzers
    "s2-e11": "", // S2 • Ep 11: Semi-Final Latent Showdown
    "s2-e12": "", // S2 • Ep 12: Grand Finale & Trophy

    // =========================================================================
    // 💎 VIP UNCUT SPECIALS (100% Free)
    // =========================================================================
    "vip-e01": "", // VIP 1: The Dark Humor Auditions
    "vip-e02": "", // VIP 2: Uncensored Green Room & Judges Roasts
    "vip-e03": "", // VIP 3: Contestants Who Sued The Show
    "vip-e04": "", // VIP 4: The Midnight Roasting Sessions
    "vip-e05": "", // VIP 5: Never-Seen-Before Eliminations
    "vip-e06": ""  // VIP 6: Samay's Unfiltered Standup Warmups
};

// Optional: Add any extra bonus episodes here
var EXTRA_EPISODES = [
    // { title: "Special Bonus", link: "https://...", season: 1 }
];

var DEFAULT_SERIES_INFO = {
    title: "INDIA'S GOT LATENT",
    subtitle: "Hosted by Samay Raina • Complete Season 1, Season 2 & VIP Vault",
    genre: "Comedy • Latent Talent • Roast Show • Reality TV",
    rating: "9.9 / 10",
    seasonsCount: 2,
    totalEpisodes: 30,
    synopsis: "India's wildest comedy talent show where contestants put their bizarre and latent talents on the line in front of Samay Raina and an all-star comic panel! Stream every episode with full unedited cuts, zero downloads, and direct cinema player.",
    heroBanner: "assets/hero_banner.webp",
    season1Banner: "assets/hero_banner.webp",
    season2Banner: "assets/season_two_banner.webp",
    premiumBanner: "assets/premium_vault_banner.webp",
    developerQr: "assets/qr.jpg",
    developerUpi: "siddharthakumar109-2@okhdfcbank"
};

var DEFAULT_EPISODES = [
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
        driveId: "1bccMfHnHgSuegozF_5qp78vWwSVcwrIq",
        isStreamReady: true,
        fileSize: "605.9 MB",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "1EZ7-DvvGynEnxpBCHO93NmaD-Yesw1FU",
        isStreamReady: true,
        fileSize: "916.4 MB",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "1Fe1SkaCv7b2d2C4FWuS9gt18ygdIm3pu",
        isStreamReady: true,
        fileSize: "739.4 MB",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s1_thumb.webp",
        tags: ["Season Finale", "Jackpot Winner", "Mega Panel", "All-Stars"],
        isPremium: false,
        releaseYear: "2024"
    },

    // =========================================================================
    // SEASON 2 (Episodes 1 to 12) - Unhinged Chaos & New Latents
    // =========================================================================
    {
        id: "s2-e01",
        season: 2,
        episodeNum: 1,
        title: "Episode 1: Season 2 Grand Premiere • The Latent Returns",
        description: "India's Got Latent is back bigger, bolder, and more unhinged! New scoring twists, revamped red buzzers, and a wild mentalist audition to start the season.",
        duration: "55 min",
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/s2_thumb.webp",
        tags: ["Grand Finale", "Champion", "Jackpot", "All-Stars"],
        isPremium: false,
        releaseYear: "2025"
    },

    // =========================================================================
    // VIP VAULT: UNCUT SPECIALS & BACKSTAGE ROASTS (100% Free Access)
    // =========================================================================
    {
        id: "vip-sp01",
        season: "VIP",
        episodeNum: 1,
        title: "VIP Uncut: Samay & Tanmay 45-Min Green Room Roast",
        description: "Uncensored green room banter between Samay Raina and Tanmay Bhat before show taping. Full of hilarious unscripted jokes, chai talks, and set gossip.",
        duration: "45 min",
        driveId: "",
        thumbnail: "assets/thumbnails/vip_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/vip_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/vip_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/vip_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/vip_thumb.webp",
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
        driveId: "",
        thumbnail: "assets/thumbnails/vip_thumb.webp",
        tags: ["Season 3 Sneak Peek", "Exclusive Lore", "Free VIP"],
        isPremium: true,
        releaseYear: "Exclusive"
    }
];

if (typeof window !== 'undefined') {
    window.VIDEO_STREAM_LINKS = VIDEO_STREAM_LINKS;
    window.EXTRA_EPISODES = EXTRA_EPISODES;
    window.DEFAULT_SERIES_INFO = DEFAULT_SERIES_INFO;
    window.DEFAULT_EPISODES = DEFAULT_EPISODES;
    window.DRIVE_CONFIG = DRIVE_CONFIG;
}
