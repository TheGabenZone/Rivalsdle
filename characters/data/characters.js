const charactersList = [
    "Hulk",
    "Punisher",
    "Storm",
    "Loki",
    "Doctor Strange",
    "Mantis",
    "Captain America",
    "Rocket Raccoon",
    "Hela",
    "Black Panther",
    "Groot",
    "Magik",
    "Luna Snow",
    "Iron Man",
    "Venom",
    "Spider Man",
    "Magneto",
    "Scarlet Witch",
    "Thor",
    "Winter Soldier",
    "Peni Parker",
    "Star Lord",
    "Namor",
    "Adam Warlock",
    "Jeff the Land Shark",
    "Psylocke",
    "Moon Knight",
    "Hawkeye"
];

// AI-generated keywords for each character
const characterKeywords = {
    "Hulk": [
        ["Gamma", "Banner", "Scientist"],
        ["Rage", "Unstoppable", "Transformation"],
        ["Sakaar", "Champion", "Berserker"]
    ],
    "Punisher": [
        ["Vigilante", "Marine", "Castle"],
        ["Skull", "Arsenal", "Vengeance"],
        ["Microchip", "Metro", "Tactical"]
    ],
    "Storm": [
        ["Weather", "Wakanda", "Goddess"],
        ["Lightning", "Mohawk", "Claustrophobic"],
        ["Cairo", "Elemental", "Windrider"]
    ],
    "Loki": [
        ["Trickster", "Frost", "Odin"],
        ["Mischief", "Shapeshifter", "Asgardian"],
        ["Tesseract", "Variant", "Scepter"]
    ],
    "Doctor Strange": [
        ["Sorcerer", "Surgeon", "Mystic"],
        ["Sanctum", "Dormammu", "Kamar-Taj"],
        ["Ancient", "Astral", "Multiverse"]
    ],
    "Mantis": [
        ["Empath", "Celestial", "Antenna"],
        ["Sleeping", "Guardian", "Psychic"],
        ["Ego", "Innocent", "Sensitive"]
    ],
    "Captain America": [
        ["Serum", "Brooklyn", "Shield"],
        ["Nomad", "Hydra", "Peggy"],
        ["Vibranium", "Howling", "Commandos"]
    ],
    "Rocket Raccoon": [
        ["Cybernetic", "Halfworld", "Bounty"],
        ["Engineer", "Mercenary", "Blaster"],
        ["Milano", "Explosive", "Trigger"]
    ],
    "Hela": [
        ["Executioner", "Fenris", "Niflheim"],
        ["Odinsdottir", "Death", "Eternal"],
        ["Necroswords", "Valkyrie", "Conquest"]
    ],
    "Black Panther": [
        ["Heart-Shaped", "Herb", "Dora"],
        ["Milaje", "Killmonger", "Jabari"],
        ["Shuri", "Ancestral", "Bashenga"]
    ],
    "Groot": [
        ["Flora", "Colossus", "Regeneration"],
        ["Monarch", "Planet X", "Sacrifice"],
        ["Spores", "Photosynthesis", "Branches"]
    ],
    "Magik": [
        ["Darkchylde", "Limbo", "Soulsword"],
        ["Rasputin", "Demon", "Sorceress"],
        ["Belasco", "Portal", "Mystical"]
    ],
    "Luna Snow": [
        ["K-Pop", "Cryokinetic", "Synthesizer"],
        ["Seoul", "Performer", "Crystalline"],
        ["Artemis", "Melody", "Frost"]
    ],
    "Iron Man": [
        ["Reactor", "Jarvis", "Philanthropist"],
        ["Nanotech", "Extremis", "Malibu"],
        ["Friday", "Bleeding Edge", "Mark"]
    ],
    "Venom": [
        ["Symbiote", "Klyntar", "Reporter"],
        ["Lethal", "Protector", "Anti-Hero"],
        ["Toxin", "Host", "Appetite"]
    ],
    "Spider Man": [
        ["Arachnid", "Parker", "Webshooter"],
        ["Responsibility", "Oscorp", "Radioactive"],
        ["Spectacular", "Queens", "Spinneret"]
    ],
    "Magneto": [
        ["Holocaust", "Brotherhood", "Genosha"],
        ["Lehnsherr", "Magnetic", "Asteroid"],
        ["Omega", "Helmet", "Polaris"]
    ],
    "Scarlet Witch": [
        ["Chaos", "Hex", "Romani"],
        ["Reality", "Vision", "Darkhold"],
        ["Nexus", "Westview", "Coven"]
    ],
    "Thor": [
        ["Mjolnir", "Worthy", "Lightning"],
        ["Stormbreaker", "Norseman", "Odinson"],
        ["Ragnarok", "Allfather", "Valhalla"]
    ],
    "Winter Soldier": [
        ["Hydra", "Soviet", "Assassin"],
        ["Zemo", "Conditioning", "Longing"],
        ["Siberia", "Manchurian", "Cyborg"]
    ],
    "Peni Parker": [
        ["Mecha", "Neural", "SP//dr"],
        ["Anime", "Psychic", "Radioactive"],
        ["Synthetic", "Pilot", "Companion"]
    ],
    "Star Lord": [
        ["Celestial", "Walkman", "Ravager"],
        ["Milano", "Element", "Spartax"],
        ["Outlaw", "Knowhere", "Quadrant"]
    ],
    "Namor": [
        ["Atlantean", "Talokan", "Imperius"],
        ["Amphibian", "Sovereign", "Vibranium"],
        ["Kukulkan", "Submariner", "Winged"]
    ],
    "Adam Warlock": [
        ["Cocoon", "Soul", "Sovereign"],
        ["Magus", "Infinity", "Perfect"],
        ["Quantum", "Counter-Earth", "Karmic"]
    ],
    "Jeff the Land Shark": [
        ["Gwenpool", "Aquatic", "Companion"],
        ["Deadpool", "Puppy", "Carnivorous"],
        ["West Coast", "Avenger", "Pet"]
    ],
    "Psylocke": [
        ["Telekinesis", "Cloth", "Sword"],
        ["Kitty", "Psycho", "Kiss"],
        ["Bendis", "X-Men", "Kitty Pryde"]
    ],
    "Moon Knight": [
        ["Egyptian", "Mask", "Assassin"],
        ["Khonshu", "Moon", "God"],
        ["Klaw", "Midnight", "Mansion"]
    ],
    "Hawkeye": [
        ["Arrow", "Quiver", "Bow"],
        ["Clint Barton", "Ronin", "Avenger"],
        ["Hawkeye", "Quiver", "Arrow"]
    ]
};