var mongoose = require('./mongodb');

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }

    return a;
};

var poketype = {
    "Normal": { "immunes": ["Ghost"], "weaknesses": ["Rock", "Steel"], "strengths": [] },
    "Fire": { "immunes": [], "weaknesses": ["Fire", "Water", "Rock", "Dragon"], "strengths": ["Grass", "Ice", "Bug", "Steel"] },
    "Water": { "immunes": [], "weaknesses": ["Water", "Grass", "Dragon"], "strengths": ["Fire", "Ground", "Rock"] },
    "Electric": { "immunes": ["Ground"], "weaknesses": ["Electric", "Grass", "Dragon"], "strengths": ["Water", "Flying"] },
    "Grass": { "immunes": [], "weaknesses": ["Fire", "Grass", "Poison", "Flying", "Bug", "Dragon", "Steel"], "strengths": ["Water", "Ground", "Rock"] },
    "Ice": { "immunes": [], "weaknesses": ["Fire", "Water", "Ice", "Steel"], "strengths": ["Grass", "Ground", "Flying", "Dragon"] },
    "Fighting": { "immunes": ["Ghost"], "weaknesses": ["Poison", "Flying", "Psychic", "Bug", "Fairy"], "strengths": ["Normal", "Ice", "Rock", "Dark", "Steel"] },
    "Poison": { "immunes": ["Steel"], "weaknesses": ["Poison", "Ground", "Rock", "Ghost"], "strengths": ["Grass", "Fairy"] },
    "Ground": { "immunes": ["Flying"], "weaknesses": ["Grass", "Bug"], "strengths": ["Fire", "Electric", "Poison", "Rock", "Steel"] },
    "Flying": { "immunes": [], "weaknesses": ["Electric", "Rock", "Steel"], "strengths": ["Grass", "Fighting", "Bug"] },
    "Psychic": { "immunes": ["Dark"], "weaknesses": ["Psychic", "Steel"], "strengths": ["Fighting", "Poison"] },
    "Bug": { "immunes": [], "weaknesses": ["Fire", "Fighting", "Poison", "Flying", "Ghost", "Steel", "Fairy"], "strengths": ["Grass", "Psychic", "Dark"] },
    "Rock": { "immunes": [], "weaknesses": ["Fighting", "Ground", "Steel"], "strengths": ["Fire", "Ice", "Flying", "Bug"] },
    "Ghost": { "immunes": ["Normal"], "weaknesses": ["Dark"], "strengths": ["Psychic", "Ghost"] },
    "Dragon": { "immunes": ["Fairy"], "weaknesses": ["Steel"], "strengths": ["Dragon"] },
    "Dark": { "immunes": [], "weaknesses": ["Fighting", "Dark", "Fairy"], "strengths": ["Psychic", "Ghost"] },
    "Steel": { "immunes": [], "weaknesses": ["Fire", "Water", "Electric", "Steel"], "strengths": ["Ice", "Rock", "Fairy"] },
    "Fairy": { "immunes": [], "weaknesses": ["Fire", "Poison", "Steel"], "strengths": ["Fighting", "Dragon", "Dark"] }
};

var pokemonRawDate = [{
    "id": 1,
    "num": "001",
    "name": "Bulbasaur",
    "img": "assets/images/pokemons/001.png",
    "type": ["Grass", "Poison"],
    "height": "0.71 m",
    "weight": "6.9 kg",
    "candy": "Bulbasaur Candy",
    "candy_count": "25",
    "egg": "2",
    "multipliers": 1.58,
    "weaknesses": [
        "Fire",
        "Ice",
        "Flying",
        "Psychic"
    ],
    "next_evolution": [{
        "num": "002",
        "name": "Ivysaur"
    }, {
            "num": "003",
            "name": "Venusaur"
        }]
}, {
        "id": 2,
        "num": "002",
        "name": "Ivysaur",
        "img": "assets/images/pokemons/002.png",
        "type": ["Grass", "Poison"],
        "height": "0.99 m",
        "weight": "13.0 kg",
        "candy": "Bulbasaur Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": [
            1.2,
            1.6
        ],
        "weaknesses": [
            "Fire",
            "Ice",
            "Flying",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "001",
            "name": "Bulbasaur"
        }],
        "next_evolution": [{
            "num": "003",
            "name": "Venusaur"
        }]
    }, {
        "id": 3,
        "num": "003",
        "name": "Venusaur",
        "img": "assets/images/pokemons/003.png",
        "type": ["Grass", "Poison"],
        "height": "2.01 m",
        "weight": "100.0 kg",
        "candy": "Bulbasaur Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Ice",
            "Flying",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "001",
            "name": "Bulbasaur"
        }, {
                "num": "002",
                "name": "Ivysaur"
            }]
    }, {
        "id": 4,
        "num": "004",
        "name": "Charmander",
        "img": "assets/images/pokemons/004.png",
        "type": ["Fire"],
        "height": "0.61 m",
        "weight": "8.5 kg",
        "candy": "Charmander Candy",
        "candy_count": "25",
        "egg": "2",
        "multipliers": 1.65,
        "weaknesses": [
            "Water",
            "Ground",
            "Rock"
        ],
        "next_evolution": [{
            "num": "005",
            "name": "Charmeleon"
        }, {
                "num": "006",
                "name": "Charizard"
            }]
    }, {
        "id": 5,
        "num": "005",
        "name": "Charmeleon",
        "img": "assets/images/pokemons/005.png",
        "type": ["Fire"],
        "height": "1.09 m",
        "weight": "19.0 kg",
        "candy": "Charmander Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": 1.79,
        "weaknesses": [
            "Water",
            "Ground",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "004",
            "name": "Charmander"
        }],
        "next_evolution": [{
            "num": "006",
            "name": "Charizard"
        }]
    }, {
        "id": 6,
        "num": "006",
        "name": "Charizard",
        "img": "assets/images/pokemons/006.png",
        "type": ["Fire", "Flying"],
        "height": "1.70 m",
        "weight": "90.5 kg",
        "candy": "Charmander Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Electric",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "004",
            "name": "Charmander"
        }, {
                "num": "005",
                "name": "Charmeleon"
            }]
    }, {
        "id": 7,
        "num": "007",
        "name": "Squirtle",
        "img": "assets/images/pokemons/007.png",
        "type": ["Water"],
        "height": "0.51 m",
        "weight": "9.0 kg",
        "candy": "Squirtle Candy",
        "candy_count": "25",
        "egg": "2",
        "multipliers": 2.1,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "next_evolution": [{
            "num": "008",
            "name": "Wartortle"
        }, {
                "num": "009",
                "name": "Blastoise"
            }]
    }, {
        "id": 8,
        "num": "008",
        "name": "Wartortle",
        "img": "assets/images/pokemons/008.png",
        "type": ["Water"],
        "height": "0.99 m",
        "weight": "22.5 kg",
        "candy": "Squirtle Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": 1.4,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "prev_evolution": [{
            "num": "007",
            "name": "Squirtle"
        }],
        "next_evolution": [{
            "num": "009",
            "name": "Blastoise"
        }]
    }, {
        "id": 9,
        "num": "009",
        "name": "Blastoise",
        "img": "assets/images/pokemons/009.png",
        "type": ["Water"],
        "height": "1.60 m",
        "weight": "85.5 kg",
        "candy": "Squirtle Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "prev_evolution": [{
            "num": "007",
            "name": "Squirtle"
        }, {
                "num": "008",
                "name": "Wartortle"
            }]
    }, {
        "id": 10,
        "num": "010",
        "name": "Caterpie",
        "img": "assets/images/pokemons/010.png",
        "type": ["Bug"],
        "height": "0.30 m",
        "weight": "2.9 kg",
        "candy": "Caterpie Candy",
        "candy_count": "12",
        "egg": "2",
        "multipliers": 1.05,
        "weaknesses": [
            "Fire",
            "Flying",
            "Rock"
        ],
        "next_evolution": [{
            "num": "011",
            "name": "Metapod"
        }, {
                "num": "012",
                "name": "Butterfree"
            }]
    }, {
        "id": 11,
        "num": "011",
        "name": "Metapod",
        "img": "assets/images/pokemons/011.png",
        "type": ["Bug"],
        "height": "0.71 m",
        "weight": "9.9 kg",
        "candy": "Caterpie Candy",
        "candy_count": "50",
        "egg": "0",
        "multipliers": [
            3.55,
            3.79
        ],
        "weaknesses": [
            "Fire",
            "Flying",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "010",
            "name": "Caterpie"
        }],
        "next_evolution": [{
            "num": "012",
            "name": "Butterfree"
        }]
    }, {
        "id": 12,
        "num": "012",
        "name": "Butterfree",
        "img": "assets/images/pokemons/012.png",
        "type": ["Bug", "Flying"],
        "height": "1.09 m",
        "weight": "32.0 kg",
        "candy": "Caterpie Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Electric",
            "Ice",
            "Flying",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "010",
            "name": "Caterpie"
        }, {
                "num": "011",
                "name": "Metapod"
            }]
    }, {
        "id": 13,
        "num": "013",
        "name": "Weedle",
        "img": "assets/images/pokemons/013.png",
        "type": ["Bug", "Poison"],
        "height": "0.30 m",
        "weight": "3.2 kg",
        "candy": "Weedle Candy",
        "candy_count": "12",
        "egg": "2",
        "multipliers": [
            1.01,
            1.09
        ],
        "weaknesses": [
            "Fire",
            "Flying",
            "Psychic",
            "Rock"
        ],
        "next_evolution": [{
            "num": "014",
            "name": "Kakuna"
        }, {
                "num": "015",
                "name": "Beedrill"
            }]
    }, {
        "id": 14,
        "num": "014",
        "name": "Kakuna",
        "img": "assets/images/pokemons/014.png",
        "type": ["Bug", "Poison"],
        "height": "0.61 m",
        "weight": "10.0 kg",
        "candy": "Weedle Candy",
        "candy_count": "50",
        "egg": "0",
        "multipliers": [
            3.01,
            3.41
        ],
        "weaknesses": [
            "Fire",
            "Flying",
            "Psychic",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "013",
            "name": "Weedle"
        }],
        "next_evolution": [{
            "num": "015",
            "name": "Beedrill"
        }]
    }, {
        "id": 15,
        "num": "015",
        "name": "Beedrill",
        "img": "assets/images/pokemons/015.png",
        "type": ["Bug", "Poison"],
        "height": "0.99 m",
        "weight": "29.5 kg",
        "candy": "Weedle Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Flying",
            "Psychic",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "013",
            "name": "Weedle"
        }, {
                "num": "014",
                "name": "Kakuna"
            }]
    }, {
        "id": 16,
        "num": "016",
        "name": "Pidgey",
        "img": "assets/images/pokemons/016.png",
        "type": ["Normal", "Flying"],
        "height": "0.30 m",
        "weight": "1.8 kg",
        "candy": "Pidgey Candy",
        "candy_count": "12",
        "egg": "2",
        "multipliers": [
            1.71,
            1.92
        ],
        "weaknesses": [
            "Electric",
            "Rock"
        ],
        "next_evolution": [{
            "num": "017",
            "name": "Pidgeotto"
        }, {
                "num": "018",
                "name": "Pidgeot"
            }]
    }, {
        "id": 17,
        "num": "017",
        "name": "Pidgeotto",
        "img": "assets/images/pokemons/017.png",
        "type": ["Normal", "Flying"],
        "height": "1.09 m",
        "weight": "30.0 kg",
        "candy": "Pidgey Candy",
        "candy_count": "50",
        "egg": "0",
        "multipliers": 1.79,
        "weaknesses": [
            "Electric",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "016",
            "name": "Pidgey"
        }],
        "next_evolution": [{
            "num": "018",
            "name": "Pidgeot"
        }]
    }, {
        "id": 18,
        "num": "018",
        "name": "Pidgeot",
        "img": "assets/images/pokemons/018.png",
        "type": ["Normal", "Flying"],
        "height": "1.50 m",
        "weight": "39.5 kg",
        "candy": "Pidgey Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "016",
            "name": "Pidgey"
        }, {
                "num": "017",
                "name": "Pidgeotto"
            }]
    }, {
        "id": 19,
        "num": "019",
        "name": "Rattata",
        "img": "assets/images/pokemons/019.png",
        "type": ["Normal"],
        "height": "0.30 m",
        "weight": "3.5 kg",
        "candy": "Rattata Candy",
        "candy_count": "25",
        "egg": "2",
        "multipliers": [
            2.55,
            2.73
        ],
        "weaknesses": [
            "Fighting"
        ],
        "next_evolution": [{
            "num": "020",
            "name": "Raticate"
        }]
    }, {
        "id": 20,
        "num": "020",
        "name": "Raticate",
        "img": "assets/images/pokemons/020.png",
        "type": ["Normal"],
        "height": "0.71 m",
        "weight": "18.5 kg",
        "candy": "Rattata Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ],
        "prev_evolution": [{
            "num": "019",
            "name": "Rattata"
        }]
    }, {
        "id": 21,
        "num": "021",
        "name": "Spearow",
        "img": "assets/images/pokemons/021.png",
        "type": ["Normal", "Flying"],
        "height": "0.30 m",
        "weight": "2.0 kg",
        "candy": "Spearow Candy",
        "candy_count": "50",
        "egg": "2",
        "multipliers": [
            2.66,
            2.68
        ],
        "weaknesses": [
            "Electric",
            "Rock"
        ],
        "next_evolution": [{
            "num": "022",
            "name": "Fearow"
        }]
    }, {
        "id": 22,
        "num": "022",
        "name": "Fearow",
        "img": "assets/images/pokemons/022.png",
        "type": ["Normal", "Flying"],
        "height": "1.19 m",
        "weight": "38.0 kg",
        "candy": "Spearow Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "021",
            "name": "Spearow"
        }]
    }, {
        "id": 23,
        "num": "023",
        "name": "Ekans",
        "img": "assets/images/pokemons/023.png",
        "type": ["Poison"],
        "height": "2.01 m",
        "weight": "6.9 kg",
        "candy": "Ekans Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.21,
            2.27
        ],
        "weaknesses": [
            "Ground",
            "Psychic"
        ],
        "next_evolution": [{
            "num": "024",
            "name": "Arbok"
        }]
    }, {
        "id": 24,
        "num": "024",
        "name": "Arbok",
        "img": "assets/images/pokemons/024.png",
        "type": ["Poison"],
        "height": "3.51 m",
        "weight": "65.0 kg",
        "candy": "Ekans Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Ground",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "023",
            "name": "Ekans"
        }]
    }, {
        "id": 25,
        "num": "025",
        "name": "Pikachu",
        "img": "assets/images/pokemons/025.png",
        "type": ["Electric"],
        "height": "0.41 m",
        "weight": "6.0 kg",
        "candy": "Pikachu Candy",
        "candy_count": "50",
        "egg": "2",
        "multipliers": 2.34,
        "weaknesses": [
            "Ground"
        ],
        "next_evolution": [{
            "num": "026",
            "name": "Raichu"
        }]
    }, {
        "id": 26,
        "num": "026",
        "name": "Raichu",
        "img": "assets/images/pokemons/026.png",
        "type": ["Electric"],
        "height": "0.79 m",
        "weight": "30.0 kg",
        "candy": "Pikachu Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Ground"
        ],
        "prev_evolution": [{
            "num": "025",
            "name": "Pikachu"
        }]
    }, {
        "id": 27,
        "num": "027",
        "name": "Sandshrew",
        "img": "assets/images/pokemons/027.png",
        "type": ["Ground"],
        "height": "0.61 m",
        "weight": "12.0 kg",
        "candy": "Sandshrew Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 2.45,
        "weaknesses": [
            "Water",
            "Grass",
            "Ice"
        ],
        "next_evolution": [{
            "num": "028",
            "name": "Sandslash"
        }]
    }, {
        "id": 28,
        "num": "028",
        "name": "Sandslash",
        "img": "assets/images/pokemons/028.png",
        "type": ["Ground"],
        "height": "0.99 m",
        "weight": "29.5 kg",
        "candy": "Sandshrew Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Grass",
            "Ice"
        ],
        "prev_evolution": [{
            "num": "027",
            "name": "Sandshrew"
        }]
    }, {
        "id": 29,
        "num": "029",
        "name": "Nidoran♀",
        "img": "assets/images/pokemons/029.png",
        "type": ["Poison"],
        "height": "0.41 m",
        "weight": "7.0 kg",
        "candy": "Nidoran♀ Candy",
        "candy_count": "25",
        "egg": "5",
        "multipliers": [
            1.63,
            2.48
        ],
        "weaknesses": [
            "Ground",
            "Psychic"
        ],
        "next_evolution": [{
            "num": "030",
            "name": "Nidorina"
        }, {
                "num": "031",
                "name": "Nidoqueen"
            }]
    }, {
        "id": 30,
        "num": "030",
        "name": "Nidorina",
        "img": "assets/images/pokemons/030.png",
        "type": ["Poison"],
        "height": "0.79 m",
        "weight": "20.0 kg",
        "candy": "Nidoran♀ Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": [
            1.83,
            2.48
        ],
        "weaknesses": [
            "Ground",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "029",
            "name": "Nidoran♀"
        }],
        "next_evolution": [{
            "num": "031",
            "name": "Nidoqueen"
        }]
    }, {
        "id": 31,
        "num": "031",
        "name": "Nidoqueen",
        "img": "assets/images/pokemons/031.png",
        "type": ["Poison", "Ground"],
        "height": "1.30 m",
        "weight": "60.0 kg",
        "candy": "Nidoran♀ Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Ice",
            "Ground",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "029",
            "name": "Nidoran♀"
        }, {
                "num": "030",
                "name": "Nidorina"
            }]
    }, {
        "id": 32,
        "num": "032",
        "name": "Nidoran♂",
        "img": "assets/images/pokemons/032.png",
        "type": ["Poison"],
        "height": "0.51 m",
        "weight": "9.0 kg",
        "candy": "Nidoran♂ Candy",
        "candy_count": "25",
        "egg": "5",
        "multipliers": [
            1.64,
            1.7
        ],
        "weaknesses": [
            "Ground",
            "Psychic"
        ],
        "next_evolution": [{
            "num": "033",
            "name": "Nidorino"
        }, {
                "num": "034",
                "name": "Nidoking"
            }]
    }, {
        "id": 33,
        "num": "033",
        "name": "Nidorino",
        "img": "assets/images/pokemons/033.png",
        "type": ["Poison"],
        "height": "0.89 m",
        "weight": "19.5 kg",
        "candy": "Nidoran♂ Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": 1.83,
        "weaknesses": [
            "Ground",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "032",
            "name": "Nidoran♂"
        }],
        "next_evolution": [{
            "num": "034",
            "name": "Nidoking"
        }]
    }, {
        "id": 34,
        "num": "034",
        "name": "Nidoking",
        "img": "assets/images/pokemons/034.png",
        "type": ["Poison", "Ground"],
        "height": "1.40 m",
        "weight": "62.0 kg",
        "candy": "Nidoran♂ Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Ice",
            "Ground",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "032",
            "name": "Nidoran♂"
        }, {
                "num": "033",
                "name": "Nidorino"
            }]
    }, {
        "id": 35,
        "num": "035",
        "name": "Clefairy",
        "img": "assets/images/pokemons/035.png",
        "type": ["Fairy"],
        "height": "0.61 m",
        "weight": "7.5 kg",
        "candy": "Clefairy Candy",
        "candy_count": "50",
        "egg": "2",
        "multipliers": [
            2.03,
            2.14
        ],
        "weaknesses": [
            "Fighting"
        ],
        "next_evolution": [{
            "num": "036",
            "name": "Clefable"
        }]
    }, {
        "id": 36,
        "num": "036",
        "name": "Clefable",
        "img": "assets/images/pokemons/036.png",
        "type": ["Fairy"],
        "height": "1.30 m",
        "weight": "40.0 kg",
        "candy": "Clefairy Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ],
        "prev_evolution": [{
            "num": "035",
            "name": "Clefairy"
        }]
    }, {
        "id": 37,
        "num": "037",
        "name": "Vulpix",
        "img": "assets/images/pokemons/037.png",
        "type": ["Fire"],
        "height": "0.61 m",
        "weight": "9.9 kg",
        "candy": "Vulpix Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.74,
            2.81
        ],
        "weaknesses": [
            "Water",
            "Ground",
            "Rock"
        ],
        "next_evolution": [{
            "num": "038",
            "name": "Ninetales"
        }]
    }, {
        "id": 38,
        "num": "038",
        "name": "Ninetales",
        "img": "assets/images/pokemons/038.png",
        "type": ["Fire"],
        "height": "1.09 m",
        "weight": "19.9 kg",
        "candy": "Vulpix Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Ground",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "037",
            "name": "Vulpix"
        }]
    }, {
        "id": 39,
        "num": "039",
        "name": "Jigglypuff",
        "img": "assets/images/pokemons/039.png",
        "type": ["Normal"],
        "height": "0.51 m",
        "weight": "5.5 kg",
        "candy": "Jigglypuff Candy",
        "candy_count": "50",
        "egg": "2",
        "multipliers": 1.85,
        "weaknesses": [
            "Fighting"
        ],
        "next_evolution": [{
            "num": "040",
            "name": "Wigglytuff"
        }]
    }, {
        "id": 40,
        "num": "040",
        "name": "Wigglytuff",
        "img": "assets/images/pokemons/040.png",
        "type": ["Normal"],
        "height": "0.99 m",
        "weight": "12.0 kg",
        "candy": "Jigglypuff Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ],
        "prev_evolution": [{
            "num": "039",
            "name": "Jigglypuff"
        }]
    }, {
        "id": 41,
        "num": "041",
        "name": "Zubat",
        "img": "assets/images/pokemons/041.png",
        "type": ["Poison", "Flying"],
        "height": "0.79 m",
        "weight": "7.5 kg",
        "candy": "Zubat Candy",
        "candy_count": "50",
        "egg": "2",
        "multipliers": [
            2.6,
            3.67
        ],
        "weaknesses": [
            "Electric",
            "Ice",
            "Psychic",
            "Rock"
        ],
        "next_evolution": [{
            "num": "042",
            "name": "Golbat"
        }]
    }, {
        "id": 42,
        "num": "042",
        "name": "Golbat",
        "img": "assets/images/pokemons/042.png",
        "type": ["Poison", "Flying"],
        "height": "1.60 m",
        "weight": "55.0 kg",
        "candy": "Zubat Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Ice",
            "Psychic",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "041",
            "name": "Zubat"
        }]
    }, {
        "id": 43,
        "num": "043",
        "name": "Oddish",
        "img": "assets/images/pokemons/043.png",
        "type": ["Grass", "Poison"],
        "height": "0.51 m",
        "weight": "5.4 kg",
        "candy": "Oddish Candy",
        "candy_count": "25",
        "egg": "5",
        "multipliers": 1.5,
        "weaknesses": [
            "Fire",
            "Ice",
            "Flying",
            "Psychic"
        ],
        "next_evolution": [{
            "num": "044",
            "name": "Gloom"
        }, {
                "num": "045",
                "name": "Vileplume"
            }]
    }, {
        "id": 44,
        "num": "044",
        "name": "Gloom",
        "img": "assets/images/pokemons/044.png",
        "type": ["Grass", "Poison"],
        "height": "0.79 m",
        "weight": "8.6 kg",
        "candy": "Oddish Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": 1.49,
        "weaknesses": [
            "Fire",
            "Ice",
            "Flying",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "043",
            "name": "Oddish"
        }],
        "next_evolution": [{
            "num": "045",
            "name": "Vileplume"
        }]
    }, {
        "id": 45,
        "num": "045",
        "name": "Vileplume",
        "img": "assets/images/pokemons/045.png",
        "type": ["Grass", "Poison"],
        "height": "1.19 m",
        "weight": "18.6 kg",
        "candy": "Oddish Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Ice",
            "Flying",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "043",
            "name": "Oddish"
        }, {
                "num": "044",
                "name": "Gloom"
            }]
    }, {
        "id": 46,
        "num": "046",
        "name": "Paras",
        "img": "assets/images/pokemons/046.png",
        "type": ["Bug", "Grass"],
        "height": "0.30 m",
        "weight": "5.4 kg",
        "candy": "Paras Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 2.02,
        "weaknesses": [
            "Fire",
            "Ice",
            "Poison",
            "Flying",
            "Bug",
            "Rock"
        ],
        "next_evolution": [{
            "num": "047",
            "name": "Parasect"
        }]
    }, {
        "id": 47,
        "num": "047",
        "name": "Parasect",
        "img": "assets/images/pokemons/047.png",
        "type": ["Bug", "Grass"],
        "height": "0.99 m",
        "weight": "29.5 kg",
        "candy": "Paras Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Ice",
            "Poison",
            "Flying",
            "Bug",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "046",
            "name": "Paras"
        }]
    }, {
        "id": 48,
        "num": "048",
        "name": "Venonat",
        "img": "assets/images/pokemons/048.png",
        "type": ["Bug", "Poison"],
        "height": "0.99 m",
        "weight": "30.0 kg",
        "candy": "Venonat Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            1.86,
            1.9
        ],
        "weaknesses": [
            "Fire",
            "Flying",
            "Psychic",
            "Rock"
        ],
        "next_evolution": [{
            "num": "049",
            "name": "Venomoth"
        }]
    }, {
        "id": 49,
        "num": "049",
        "name": "Venomoth",
        "img": "assets/images/pokemons/049.png",
        "type": ["Bug", "Poison"],
        "height": "1.50 m",
        "weight": "12.5 kg",
        "candy": "Venonat Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Flying",
            "Psychic",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "048",
            "name": "Venonat"
        }]
    }, {
        "id": 50,
        "num": "050",
        "name": "Diglett",
        "img": "assets/images/pokemons/050.png",
        "type": ["Ground"],
        "height": "0.20 m",
        "weight": "0.8 kg",
        "candy": "Diglett Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 2.69,
        "weaknesses": [
            "Water",
            "Grass",
            "Ice"
        ],
        "next_evolution": [{
            "num": "051",
            "name": "Dugtrio"
        }]
    }, {
        "id": 51,
        "num": "051",
        "name": "Dugtrio",
        "img": "assets/images/pokemons/051.png",
        "type": ["Ground"],
        "height": "0.71 m",
        "weight": "33.3 kg",
        "candy": "Diglett Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Grass",
            "Ice"
        ],
        "prev_evolution": [{
            "num": "050",
            "name": "Diglett"
        }]
    }, {
        "id": 52,
        "num": "052",
        "name": "Meowth",
        "img": "assets/images/pokemons/052.png",
        "type": ["Normal"],
        "height": "0.41 m",
        "weight": "4.2 kg",
        "candy": "Meowth Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 1.98,
        "weaknesses": [
            "Fighting"
        ],
        "next_evolution": [{
            "num": "053",
            "name": "Persian"
        }]
    }, {
        "id": 53,
        "num": "053",
        "name": "Persian",
        "img": "assets/images/pokemons/053.png",
        "type": ["Normal"],
        "height": "0.99 m",
        "weight": "32.0 kg",
        "candy": "Meowth Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ],
        "prev_evolution": [{
            "num": "052",
            "name": "Meowth"
        }]
    }, {
        "id": 54,
        "num": "054",
        "name": "Psyduck",
        "img": "assets/images/pokemons/054.png",
        "type": ["Water"],
        "height": "0.79 m",
        "weight": "19.6 kg",
        "candy": "Psyduck Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 2.27,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "next_evolution": [{
            "num": "055",
            "name": "Golduck"
        }]
    }, {
        "id": 55,
        "num": "055",
        "name": "Golduck",
        "img": "assets/images/pokemons/055.png",
        "type": ["Water"],
        "height": "1.70 m",
        "weight": "76.6 kg",
        "candy": "Psyduck Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "prev_evolution": [{
            "num": "054",
            "name": "Psyduck"
        }]
    }, {
        "id": 56,
        "num": "056",
        "name": "Mankey",
        "img": "assets/images/pokemons/056.png",
        "type": ["Fighting"],
        "height": "0.51 m",
        "weight": "28.0 kg",
        "candy": "Mankey Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.17,
            2.28
        ],
        "weaknesses": [
            "Flying",
            "Psychic",
            "Fairy"
        ],
        "next_evolution": [{
            "num": "057",
            "name": "Primeape"
        }]
    }, {
        "id": 57,
        "num": "057",
        "name": "Primeape",
        "img": "assets/images/pokemons/057.png",
        "type": ["Fighting"],
        "height": "0.99 m",
        "weight": "32.0 kg",
        "candy": "Mankey Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Flying",
            "Psychic",
            "Fairy"
        ],
        "prev_evolution": [{
            "num": "056",
            "name": "Mankey"
        }]
    }, {
        "id": 58,
        "num": "058",
        "name": "Growlithe",
        "img": "assets/images/pokemons/058.png",
        "type": ["Fire"],
        "height": "0.71 m",
        "weight": "19.0 kg",
        "candy": "Growlithe Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.31,
            2.36
        ],
        "weaknesses": [
            "Water",
            "Ground",
            "Rock"
        ],
        "next_evolution": [{
            "num": "059",
            "name": "Arcanine"
        }]
    }, {
        "id": 59,
        "num": "059",
        "name": "Arcanine",
        "img": "assets/images/pokemons/059.png",
        "type": ["Fire"],
        "height": "1.91 m",
        "weight": "155.0 kg",
        "candy": "Growlithe Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Ground",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "058",
            "name": "Growlithe"
        }]
    }, {
        "id": 60,
        "num": "060",
        "name": "Poliwag",
        "img": "assets/images/pokemons/060.png",
        "type": ["Water"],
        "height": "0.61 m",
        "weight": "12.4 kg",
        "candy": "Poliwag Candy",
        "candy_count": "25",
        "egg": "5",
        "multipliers": [
            1.72,
            1.73
        ],
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "next_evolution": [{
            "num": "061",
            "name": "Poliwhirl"
        }, {
                "num": "062",
                "name": "Poliwrath"
            }]
    }, {
        "id": 61,
        "num": "061",
        "name": "Poliwhirl",
        "img": "assets/images/pokemons/061.png",
        "type": ["Water"],
        "height": "0.99 m",
        "weight": "20.0 kg",
        "candy": "Poliwag Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": 1.95,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "prev_evolution": [{
            "num": "060",
            "name": "Poliwag"
        }],
        "next_evolution": [{
            "num": "062",
            "name": "Poliwrath"
        }]
    }, {
        "id": 62,
        "num": "062",
        "name": "Poliwrath",
        "img": "assets/images/pokemons/062.png",
        "type": ["Water", "Fighting"],
        "height": "1.30 m",
        "weight": "54.0 kg",
        "candy": "Poliwag Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass",
            "Flying",
            "Psychic",
            "Fairy"
        ],
        "prev_evolution": [{
            "num": "060",
            "name": "Poliwag"
        }, {
                "num": "061",
                "name": "Poliwhirl"
            }]
    }, {
        "id": 63,
        "num": "063",
        "name": "Abra",
        "img": "assets/images/pokemons/063.png",
        "type": ["Psychic"],
        "height": "0.89 m",
        "weight": "19.5 kg",
        "candy": "Abra Candy",
        "candy_count": "25",
        "egg": "5",
        "multipliers": [
            1.36,
            1.95
        ],
        "weaknesses": [
            "Bug",
            "Ghost",
            "Dark"
        ],
        "next_evolution": [{
            "num": "064",
            "name": "Kadabra"
        }, {
                "num": "065",
                "name": "Alakazam"
            }]
    }, {
        "id": 64,
        "num": "064",
        "name": "Kadabra",
        "img": "assets/images/pokemons/064.png",
        "type": ["Psychic"],
        "height": "1.30 m",
        "weight": "56.5 kg",
        "candy": "Abra Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": 1.4,
        "weaknesses": [
            "Bug",
            "Ghost",
            "Dark"
        ],
        "prev_evolution": [{
            "num": "063",
            "name": "Abra"
        }],
        "next_evolution": [{
            "num": "065",
            "name": "Alakazam"
        }]
    }, {
        "id": 65,
        "num": "065",
        "name": "Alakazam",
        "img": "assets/images/pokemons/065.png",
        "type": ["Psychic"],
        "height": "1.50 m",
        "weight": "48.0 kg",
        "candy": "Abra Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Bug",
            "Ghost",
            "Dark"
        ],
        "prev_evolution": [{
            "num": "063",
            "name": "Abra"
        }, {
                "num": "064",
                "name": "Kadabra"
            }]
    }, {
        "id": 66,
        "num": "066",
        "name": "Machop",
        "img": "assets/images/pokemons/066.png",
        "type": ["Fighting"],
        "height": "0.79 m",
        "weight": "19.5 kg",
        "candy": "Machop Candy",
        "candy_count": "25",
        "egg": "5",
        "multipliers": [
            1.64,
            1.65
        ],
        "weaknesses": [
            "Flying",
            "Psychic",
            "Fairy"
        ],
        "next_evolution": [{
            "num": "067",
            "name": "Machoke"
        }, {
                "num": "068",
                "name": "Machamp"
            }]
    }, {
        "id": 67,
        "num": "067",
        "name": "Machoke",
        "img": "assets/images/pokemons/067.png",
        "type": ["Fighting"],
        "height": "1.50 m",
        "weight": "70.5 kg",
        "candy": "Machop Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": 1.7,
        "weaknesses": [
            "Flying",
            "Psychic",
            "Fairy"
        ],
        "prev_evolution": [{
            "num": "066",
            "name": "Machop"
        }],
        "next_evolution": [{
            "num": "068",
            "name": "Machamp"
        }]
    }, {
        "id": 68,
        "num": "068",
        "name": "Machamp",
        "img": "assets/images/pokemons/068.png",
        "type": ["Fighting"],
        "height": "1.60 m",
        "weight": "130.0 kg",
        "candy": "Machop Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Flying",
            "Psychic",
            "Fairy"
        ],
        "prev_evolution": [{
            "num": "066",
            "name": "Machop"
        }, {
                "num": "067",
                "name": "Machoke"
            }]
    }, {
        "id": 69,
        "num": "069",
        "name": "Bellsprout",
        "img": "assets/images/pokemons/069.png",
        "type": ["Grass", "Poison"],
        "height": "0.71 m",
        "weight": "4.0 kg",
        "candy": "Bellsprout Candy",
        "candy_count": "25",
        "egg": "5",
        "multipliers": 1.57,
        "weaknesses": [
            "Fire",
            "Ice",
            "Flying",
            "Psychic"
        ],
        "next_evolution": [{
            "num": "070",
            "name": "Weepinbell"
        }, {
                "num": "071",
                "name": "Victreebel"
            }]
    }, {
        "id": 70,
        "num": "070",
        "name": "Weepinbell",
        "img": "assets/images/pokemons/070.png",
        "type": ["Grass", "Poison"],
        "height": "0.99 m",
        "weight": "6.4 kg",
        "candy": "Bellsprout Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": 1.59,
        "weaknesses": [
            "Fire",
            "Ice",
            "Flying",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "069",
            "name": "Bellsprout"
        }],
        "next_evolution": [{
            "num": "071",
            "name": "Victreebel"
        }]
    }, {
        "id": 71,
        "num": "071",
        "name": "Victreebel",
        "img": "assets/images/pokemons/071.png",
        "type": ["Grass", "Poison"],
        "height": "1.70 m",
        "weight": "15.5 kg",
        "candy": "Bellsprout Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Ice",
            "Flying",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "069",
            "name": "Bellsprout"
        }, {
                "num": "070",
                "name": "Weepinbell"
            }]
    }, {
        "id": 72,
        "num": "072",
        "name": "Tentacool",
        "img": "assets/images/pokemons/072.png",
        "type": ["Water", "Poison"],
        "height": "0.89 m",
        "weight": "45.5 kg",
        "candy": "Tentacool Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 2.52,
        "weaknesses": [
            "Electric",
            "Ground",
            "Psychic"
        ],
        "next_evolution": [{
            "num": "073",
            "name": "Tentacruel"
        }]
    }, {
        "id": 73,
        "num": "073",
        "name": "Tentacruel",
        "img": "assets/images/pokemons/073.png",
        "type": ["Water", "Poison"],
        "height": "1.60 m",
        "weight": "55.0 kg",
        "candy": "Tentacool Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Ground",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "072",
            "name": "Tentacool"
        }]
    }, {
        "id": 74,
        "num": "074",
        "name": "Geodude",
        "img": "assets/images/pokemons/074.png",
        "type": ["Rock", "Ground"],
        "height": "0.41 m",
        "weight": "20.0 kg",
        "candy": "Geodude Candy",
        "candy_count": "25",
        "egg": "2",
        "multipliers": [
            1.75,
            1.76
        ],
        "weaknesses": [
            "Water",
            "Grass",
            "Ice",
            "Fighting",
            "Ground",
            "Steel"
        ],
        "next_evolution": [{
            "num": "075",
            "name": "Graveler"
        }, {
                "num": "076",
                "name": "Golem"
            }]
    }, {
        "id": 75,
        "num": "075",
        "name": "Graveler",
        "img": "assets/images/pokemons/075.png",
        "type": ["Rock", "Ground"],
        "height": "0.99 m",
        "weight": "105.0 kg",
        "candy": "Geodude Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": [
            1.64,
            1.72
        ],
        "weaknesses": [
            "Water",
            "Grass",
            "Ice",
            "Fighting",
            "Ground",
            "Steel"
        ],
        "prev_evolution": [{
            "num": "074",
            "name": "Geodude"
        }],
        "next_evolution": [{
            "num": "076",
            "name": "Golem"
        }]
    }, {
        "id": 76,
        "num": "076",
        "name": "Golem",
        "img": "assets/images/pokemons/076.png",
        "type": ["Rock", "Ground"],
        "height": "1.40 m",
        "weight": "300.0 kg",
        "candy": "Geodude Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Grass",
            "Ice",
            "Fighting",
            "Ground",
            "Steel"
        ],
        "prev_evolution": [{
            "num": "074",
            "name": "Geodude"
        }, {
                "num": "075",
                "name": "Graveler"
            }]
    }, {
        "id": 77,
        "num": "077",
        "name": "Ponyta",
        "img": "assets/images/pokemons/077.png",
        "type": ["Fire"],
        "height": "0.99 m",
        "weight": "30.0 kg",
        "candy": "Ponyta Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            1.48,
            1.5
        ],
        "weaknesses": [
            "Water",
            "Ground",
            "Rock"
        ],
        "next_evolution": [{
            "num": "078",
            "name": "Rapidash"
        }]
    }, {
        "id": 78,
        "num": "078",
        "name": "Rapidash",
        "img": "assets/images/pokemons/078.png",
        "type": ["Fire"],
        "height": "1.70 m",
        "weight": "95.0 kg",
        "candy": "Ponyta Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Ground",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "077",
            "name": "Ponyta"
        }]
    }, {
        "id": 79,
        "num": "079",
        "name": "Slowpoke",
        "img": "assets/images/pokemons/079.png",
        "type": ["Water", "Psychic"],
        "height": "1.19 m",
        "weight": "36.0 kg",
        "candy": "Slowpoke Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 2.21,
        "weaknesses": [
            "Electric",
            "Grass",
            "Bug",
            "Ghost",
            "Dark"
        ],
        "next_evolution": [{
            "num": "080",
            "name": "Slowbro"
        }]
    }, {
        "id": 80,
        "num": "080",
        "name": "Slowbro",
        "img": "assets/images/pokemons/080.png",
        "type": ["Water", "Psychic"],
        "height": "1.60 m",
        "weight": "78.5 kg",
        "candy": "Slowpoke Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass",
            "Bug",
            "Ghost",
            "Dark"
        ],
        "prev_evolution": [{
            "num": "079",
            "name": "Slowpoke"
        }]
    }, {
        "id": 81,
        "num": "081",
        "name": "Magnemite",
        "img": "assets/images/pokemons/081.png",
        "type": ["Electric"],
        "height": "0.30 m",
        "weight": "6.0 kg",
        "candy": "Magnemite Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.16,
            2.17
        ],
        "weaknesses": [
            "Fire",
            "Water",
            "Ground"
        ],
        "next_evolution": [{
            "num": "082",
            "name": "Magneton"
        }]
    }, {
        "id": 82,
        "num": "082",
        "name": "Magneton",
        "img": "assets/images/pokemons/082.png",
        "type": ["Electric"],
        "height": "0.99 m",
        "weight": "60.0 kg",
        "candy": "Magnemite Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Water",
            "Ground"
        ],
        "prev_evolution": [{
            "num": "081",
            "name": "Magnemite"
        }]
    }, {
        "id": 83,
        "num": "083",
        "name": "Farfetch'd",
        "img": "assets/images/pokemons/083.png",
        "type": ["Normal", "Flying"],
        "height": "0.79 m",
        "weight": "15.0 kg",
        "candy": "Farfetch'd Candy",
        "egg": "5",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Rock"
        ],
        "location": "Asia"
    }, {
        "id": 84,
        "num": "084",
        "name": "Doduo",
        "img": "assets/images/pokemons/084.png",
        "type": ["Normal", "Flying"],
        "height": "1.40 m",
        "weight": "39.2 kg",
        "candy": "Doduo Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.19,
            2.24
        ],
        "weaknesses": [
            "Electric",
            "Rock"
        ],
        "next_evolution": [{
            "num": "085",
            "name": "Dodrio"
        }]
    }, {
        "id": 85,
        "num": "085",
        "name": "Dodrio",
        "img": "assets/images/pokemons/085.png",
        "type": ["Normal", "Flying"],
        "height": "1.80 m",
        "weight": "85.2 kg",
        "candy": "Doduo Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "084",
            "name": "Doduo"
        }]
    }, {
        "id": 86,
        "num": "086",
        "name": "Seel",
        "img": "assets/images/pokemons/086.png",
        "type": ["Water"],
        "height": "1.09 m",
        "weight": "90.0 kg",
        "candy": "Seel Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            1.04,
            1.96
        ],
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "next_evolution": [{
            "num": "087",
            "name": "Dewgong"
        }]
    }, {
        "id": 87,
        "num": "087",
        "name": "Dewgong",
        "img": "assets/images/pokemons/087.png",
        "type": ["Water", "Ice"],
        "height": "1.70 m",
        "weight": "120.0 kg",
        "candy": "Seel Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass",
            "Fighting",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "086",
            "name": "Seel"
        }]
    }, {
        "id": 88,
        "num": "088",
        "name": "Grimer",
        "img": "assets/images/pokemons/088.png",
        "type": ["Poison"],
        "height": "0.89 m",
        "weight": "30.0 kg",
        "candy": "Grimer Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 2.44,
        "weaknesses": [
            "Ground",
            "Psychic"
        ],
        "next_evolution": [{
            "num": "089",
            "name": "Muk"
        }]
    }, {
        "id": 89,
        "num": "089",
        "name": "Muk",
        "img": "assets/images/pokemons/089.png",
        "type": ["Poison"],
        "height": "1.19 m",
        "weight": "30.0 kg",
        "candy": "Grimer Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Ground",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "088",
            "name": "Grimer"
        }]
    }, {
        "id": 90,
        "num": "090",
        "name": "Shellder",
        "img": "assets/images/pokemons/090.png",
        "type": ["Water"],
        "height": "0.30 m",
        "weight": "4.0 kg",
        "candy": "Shellder Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 2.65,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "next_evolution": [{
            "num": "091",
            "name": "Cloyster"
        }]
    }, {
        "id": 91,
        "num": "091",
        "name": "Cloyster",
        "img": "assets/images/pokemons/091.png",
        "type": ["Water", "Ice"],
        "height": "1.50 m",
        "weight": "132.5 kg",
        "candy": "Shellder Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass",
            "Fighting",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "090",
            "name": "Shellder"
        }]
    }, {
        "id": 92,
        "num": "092",
        "name": "Gastly",
        "img": "assets/images/pokemons/092.png",
        "type": ["Ghost", "Poison"],
        "height": "1.30 m",
        "weight": "0.1 kg",
        "candy": "Gastly Candy",
        "candy_count": "25",
        "egg": "5",
        "multipliers": 1.78,
        "weaknesses": [
            "Ground",
            "Psychic",
            "Ghost",
            "Dark"
        ],
        "next_evolution": [{
            "num": "093",
            "name": "Haunter"
        }, {
                "num": "094",
                "name": "Gengar"
            }]
    }, {
        "id": 93,
        "num": "093",
        "name": "Haunter",
        "img": "assets/images/pokemons/093.png",
        "type": ["Ghost", "Poison"],
        "height": "1.60 m",
        "weight": "0.1 kg",
        "candy": "Gastly Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": [
            1.56,
            1.8
        ],
        "weaknesses": [
            "Ground",
            "Psychic",
            "Ghost",
            "Dark"
        ],
        "prev_evolution": [{
            "num": "092",
            "name": "Gastly"
        }],
        "next_evolution": [{
            "num": "094",
            "name": "Gengar"
        }]
    }, {
        "id": 94,
        "num": "094",
        "name": "Gengar",
        "img": "assets/images/pokemons/094.png",
        "type": ["Ghost", "Poison"],
        "height": "1.50 m",
        "weight": "40.5 kg",
        "candy": "Gastly Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Ground",
            "Psychic",
            "Ghost",
            "Dark"
        ],
        "prev_evolution": [{
            "num": "092",
            "name": "Gastly"
        }, {
                "num": "093",
                "name": "Haunter"
            }]
    }, {
        "id": 95,
        "num": "095",
        "name": "Onix",
        "img": "assets/images/pokemons/095.png",
        "type": ["Rock", "Ground"],
        "height": "8.79 m",
        "weight": "210.0 kg",
        "candy": "Onix Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Grass",
            "Ice",
            "Fighting",
            "Ground",
            "Steel"
        ]
    }, {
        "id": 96,
        "num": "096",
        "name": "Drowzee",
        "img": "assets/images/pokemons/096.png",
        "type": ["Psychic"],
        "height": "0.99 m",
        "weight": "32.4 kg",
        "candy": "Drowzee Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.08,
            2.09
        ],
        "weaknesses": [
            "Bug",
            "Ghost",
            "Dark"
        ],
        "next_evolution": [{
            "num": "097",
            "name": "Hypno"
        }]
    }, {
        "id": 97,
        "num": "097",
        "name": "Hypno",
        "img": "assets/images/pokemons/097.png",
        "type": ["Psychic"],
        "height": "1.60 m",
        "weight": "75.6 kg",
        "candy": "Drowzee Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Bug",
            "Ghost",
            "Dark"
        ],
        "prev_evolution": [{
            "num": "096",
            "name": "Drowzee"
        }]
    }, {
        "id": 98,
        "num": "098",
        "name": "Krabby",
        "img": "assets/images/pokemons/098.png",
        "type": ["Water"],
        "height": "0.41 m",
        "weight": "6.5 kg",
        "candy": "Krabby Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.36,
            2.4
        ],
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "next_evolution": [{
            "num": "099",
            "name": "Kingler"
        }]
    }, {
        "id": 99,
        "num": "099",
        "name": "Kingler",
        "img": "assets/images/pokemons/099.png",
        "type": ["Water"],
        "height": "1.30 m",
        "weight": "60.0 kg",
        "candy": "Krabby Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "prev_evolution": [{
            "num": "098",
            "name": "Krabby"
        }]
    }, {
        "id": 100,
        "num": "100",
        "name": "Voltorb",
        "img": "assets/images/pokemons/100.png",
        "type": ["Electric"],
        "height": "0.51 m",
        "weight": "10.4 kg",
        "candy": "Voltorb Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.01,
            2.02
        ],
        "weaknesses": [
            "Ground"
        ],
        "next_evolution": [{
            "num": "101",
            "name": "Electrode"
        }]
    }, {
        "id": 101,
        "num": "101",
        "name": "Electrode",
        "img": "assets/images/pokemons/101.png",
        "type": ["Electric"],
        "height": "1.19 m",
        "weight": "66.6 kg",
        "candy": "Voltorb Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Ground"
        ],
        "prev_evolution": [{
            "num": "100",
            "name": "Voltorb"
        }]
    }, {
        "id": 102,
        "num": "102",
        "name": "Exeggcute",
        "img": "assets/images/pokemons/102.png",
        "type": ["Grass", "Psychic"],
        "height": "0.41 m",
        "weight": "2.5 kg",
        "candy": "Exeggcute Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.70,
            3.18
        ],
        "weaknesses": [
            "Fire",
            "Ice",
            "Poison",
            "Flying",
            "Bug",
            "Ghost",
            "Dark"
        ],
        "next_evolution": [{
            "num": "103",
            "name": "Exeggutor"
        }]
    }, {
        "id": 103,
        "num": "103",
        "name": "Exeggutor",
        "img": "assets/images/pokemons/103.png",
        "type": ["Grass", "Psychic"],
        "height": "2.01 m",
        "weight": "120.0 kg",
        "candy": "Exeggcute Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Ice",
            "Poison",
            "Flying",
            "Bug",
            "Ghost",
            "Dark"
        ],
        "prev_evolution": [{
            "num": "102",
            "name": "Exeggcute"
        }]
    }, {
        "id": 104,
        "num": "104",
        "name": "Cubone",
        "img": "assets/images/pokemons/104.png",
        "type": ["Ground"],
        "height": "0.41 m",
        "weight": "6.5 kg",
        "candy": "Cubone Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 1.67,
        "weaknesses": [
            "Water",
            "Grass",
            "Ice"
        ],
        "next_evolution": [{
            "num": "105",
            "name": "Marowak"
        }]
    }, {
        "id": 105,
        "num": "105",
        "name": "Marowak",
        "img": "assets/images/pokemons/105.png",
        "type": ["Ground"],
        "height": "0.99 m",
        "weight": "45.0 kg",
        "candy": "Cubone Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Grass",
            "Ice"
        ],
        "prev_evolution": [{
            "num": "104",
            "name": "Cubone"
        }]
    }, {
        "id": 106,
        "num": "106",
        "name": "Hitmonlee",
        "img": "assets/images/pokemons/106.png",
        "type": ["Fighting"],
        "height": "1.50 m",
        "weight": "49.8 kg",
        "candy": "Hitmonlee Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Flying",
            "Psychic",
            "Fairy"
        ]
    }, {
        "id": 107,
        "num": "107",
        "name": "Hitmonchan",
        "img": "assets/images/pokemons/107.png",
        "type": ["Fighting"],
        "height": "1.40 m",
        "weight": "50.2 kg",
        "candy": "Hitmonchan Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Flying",
            "Psychic",
            "Fairy"
        ]
    }, {
        "id": 108,
        "num": "108",
        "name": "Lickitung",
        "img": "assets/images/pokemons/108.png",
        "type": ["Normal"],
        "height": "1.19 m",
        "weight": "65.5 kg",
        "candy": "Lickitung Candy",
        "egg": "5",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ]
    }, {
        "id": 109,
        "num": "109",
        "name": "Koffing",
        "img": "assets/images/pokemons/109.png",
        "type": ["Poison"],
        "height": "0.61 m",
        "weight": "1.0 kg",
        "candy": "Koffing Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 1.11,
        "weaknesses": [
            "Ground",
            "Psychic"
        ],
        "next_evolution": [{
            "num": "110",
            "name": "Weezing"
        }]
    }, {
        "id": 110,
        "num": "110",
        "name": "Weezing",
        "img": "assets/images/pokemons/110.png",
        "type": ["Poison"],
        "height": "1.19 m",
        "weight": "9.5 kg",
        "candy": "Koffing Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Ground",
            "Psychic"
        ],
        "prev_evolution": [{
            "num": "109",
            "name": "Koffing"
        }]
    }, {
        "id": 111,
        "num": "111",
        "name": "Rhyhorn",
        "img": "assets/images/pokemons/111.png",
        "type": ["Ground", "Rock"],
        "height": "0.99 m",
        "weight": "115.0 kg",
        "candy": "Rhyhorn Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 1.91,
        "weaknesses": [
            "Water",
            "Grass",
            "Ice",
            "Fighting",
            "Ground",
            "Steel"
        ],
        "next_evolution": [{
            "num": "112",
            "name": "Rhydon"
        }]
    }, {
        "id": 112,
        "num": "112",
        "name": "Rhydon",
        "img": "assets/images/pokemons/112.png",
        "type": ["Ground", "Rock"],
        "height": "1.91 m",
        "weight": "120.0 kg",
        "candy": "Rhyhorn Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Grass",
            "Ice",
            "Fighting",
            "Ground",
            "Steel"
        ],
        "prev_evolution": [{
            "num": "111",
            "name": "Rhyhorn"
        }]
    }, {
        "id": 113,
        "num": "113",
        "name": "Chansey",
        "img": "assets/images/pokemons/113.png",
        "type": ["Normal"],
        "height": "1.09 m",
        "weight": "34.6 kg",
        "candy": "Chansey Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ]
    }, {
        "id": 114,
        "num": "114",
        "name": "Tangela",
        "img": "assets/images/pokemons/114.png",
        "type": ["Grass"],
        "height": "0.99 m",
        "weight": "35.0 kg",
        "candy": "Tangela Candy",
        "egg": "5",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Ice",
            "Poison",
            "Flying",
            "Bug"
        ]
    }, {
        "id": 115,
        "num": "115",
        "name": "Kangaskhan",
        "img": "assets/images/pokemons/115.png",
        "type": ["Normal"],
        "height": "2.21 m",
        "weight": "80.0 kg",
        "candy": "Kangaskhan Candy",
        "egg": "5",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ],
        "location": "Australia"
    }, {
        "id": 116,
        "num": "116",
        "name": "Horsea",
        "img": "assets/images/pokemons/116.png",
        "type": ["Water"],
        "height": "0.41 m",
        "weight": "8.0 kg",
        "candy": "Horsea Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": 2.23,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "next_evolution": [{
            "num": "117",
            "name": "Seadra"
        }]
    }, {
        "id": 117,
        "num": "117",
        "name": "Seadra",
        "img": "assets/images/pokemons/117.png",
        "type": ["Water"],
        "height": "1.19 m",
        "weight": "25.0 kg",
        "candy": "Horsea Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "prev_evolution": [{
            "num": "116",
            "name": "Horsea"
        }]
    }, {
        "id": 118,
        "num": "118",
        "name": "Goldeen",
        "img": "assets/images/pokemons/118.png",
        "type": ["Water"],
        "height": "0.61 m",
        "weight": "15.0 kg",
        "candy": "Goldeen Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.15,
            2.2
        ],
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "next_evolution": [{
            "num": "119",
            "name": "Seaking"
        }]
    }, {
        "id": 119,
        "num": "119",
        "name": "Seaking",
        "img": "assets/images/pokemons/119.png",
        "type": ["Water"],
        "height": "1.30 m",
        "weight": "39.0 kg",
        "candy": "Goldeen Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "prev_evolution": [{
            "num": "118",
            "name": "Goldeen"
        }]
    }, {
        "id": 120,
        "num": "120",
        "name": "Staryu",
        "img": "assets/images/pokemons/120.png",
        "type": ["Water"],
        "height": "0.79 m",
        "weight": "34.5 kg",
        "candy": "Staryu Candy",
        "candy_count": "50",
        "egg": "5",
        "multipliers": [
            2.38,
            2.41
        ],
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "next_evolution": [{
            "num": "121",
            "name": "Starmie"
        }]
    }, {
        "id": 121,
        "num": "121",
        "name": "Starmie",
        "img": "assets/images/pokemons/121.png",
        "type": ["Water", "Psychic"],
        "height": "1.09 m",
        "weight": "80.0 kg",
        "candy": "Staryu Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass",
            "Bug",
            "Ghost",
            "Dark"
        ],
        "prev_evolution": [{
            "num": "120",
            "name": "Staryu"
        }]
    }, {
        "id": 122,
        "num": "122",
        "name": "Mr. Mime",
        "img": "assets/images/pokemons/122.png",
        "type": ["Psychic"],
        "height": "1.30 m",
        "weight": "54.5 kg",
        "candy": "Mr. Mime Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Bug",
            "Ghost",
            "Dark"
        ],
        "location": "Europe"
    }, {
        "id": 123,
        "num": "123",
        "name": "Scyther",
        "img": "assets/images/pokemons/123.png",
        "type": ["Bug", "Flying"],
        "height": "1.50 m",
        "weight": "56.0 kg",
        "candy": "Scyther Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Electric",
            "Ice",
            "Flying",
            "Rock"
        ]
    }, {
        "id": 124,
        "num": "124",
        "name": "Jynx",
        "img": "assets/images/pokemons/124.png",
        "type": ["Ice", "Psychic"],
        "height": "1.40 m",
        "weight": "40.6 kg",
        "candy": "Jynx Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Bug",
            "Rock",
            "Ghost",
            "Dark",
            "Steel"
        ]
    }, {
        "id": 125,
        "num": "125",
        "name": "Electabuzz",
        "img": "assets/images/pokemons/125.png",
        "type": ["Electric"],
        "height": "1.09 m",
        "weight": "30.0 kg",
        "candy": "Electabuzz Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Ground"
        ]
    }, {
        "id": 126,
        "num": "126",
        "name": "Magmar",
        "img": "assets/images/pokemons/126.png",
        "type": ["Fire"],
        "height": "1.30 m",
        "weight": "44.5 kg",
        "candy": "Magmar Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Ground",
            "Rock"
        ]
    }, {
        "id": 127,
        "num": "127",
        "name": "Pinsir",
        "img": "assets/images/pokemons/127.png",
        "type": ["Bug"],
        "height": "1.50 m",
        "weight": "55.0 kg",
        "candy": "Pinsir Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Flying",
            "Rock"
        ]
    }, {
        "id": 128,
        "num": "128",
        "name": "Tauros",
        "img": "assets/images/pokemons/128.png",
        "type": ["Normal"],
        "height": "1.40 m",
        "weight": "88.4 kg",
        "candy": "Tauros Candy",
        "egg": "5",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ],
        "location": "North America"
    }, {
        "id": 129,
        "num": "129",
        "name": "Magikarp",
        "img": "assets/images/pokemons/129.png",
        "type": ["Water"],
        "height": "0.89 m",
        "weight": "10.0 kg",
        "candy": "Magikarp Candy",
        "candy_count": "400",
        "egg": "2",
        "multipliers": [
            10.1,
            11.8
        ],
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "next_evolution": [{
            "num": "130",
            "name": "Gyarados"
        }]
    }, {
        "id": 130,
        "num": "130",
        "name": "Gyarados",
        "img": "assets/images/pokemons/130.png",
        "type": ["Water", "Flying"],
        "height": "6.50 m",
        "weight": "235.0 kg",
        "candy": "Magikarp Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "129",
            "name": "Magikarp"
        }]
    }, {
        "id": 131,
        "num": "131",
        "name": "Lapras",
        "img": "assets/images/pokemons/131.png",
        "type": ["Water", "Ice"],
        "height": "2.49 m",
        "weight": "220.0 kg",
        "candy": "Lapras Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass",
            "Fighting",
            "Rock"
        ]
    }, {
        "id": 132,
        "num": "132",
        "name": "Ditto",
        "img": "assets/images/pokemons/132.png",
        "type": ["Normal"],
        "height": "0.30 m",
        "weight": "4.0 kg",
        "candy": "None",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ],
        "location": "Unavailable"
    }, {
        "id": 133,
        "num": "133",
        "name": "Eevee",
        "img": "assets/images/pokemons/133.png",
        "type": ["Normal"],
        "height": "0.30 m",
        "weight": "6.5 kg",
        "candy": "Eevee Candy",
        "candy_count": "25",
        "egg": "10",
        "multipliers": [
            2.02,
            2.64
        ],
        "weaknesses": [
            "Fighting"
        ],
        "next_evolution": [{
            "num": "134",
            "name": "Vaporeon"
        }, {
                "num": "135",
                "name": "Jolteon"
            }, {
                "num": "136",
                "name": "Flareon"
            }]
    }, {
        "id": 134,
        "num": "134",
        "name": "Vaporeon",
        "img": "assets/images/pokemons/134.png",
        "type": ["Water"],
        "height": "0.99 m",
        "weight": "29.0 kg",
        "candy": "Eevee Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass"
        ],
        "prev_evolution": [{
            "num": "133",
            "name": "Eevee"
        }]
    }, {
        "id": 135,
        "num": "135",
        "name": "Jolteon",
        "img": "assets/images/pokemons/135.png",
        "type": ["Electric"],
        "height": "0.79 m",
        "weight": "24.5 kg",
        "candy": "Eevee Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Ground"
        ],
        "prev_evolution": [{
            "num": "133",
            "name": "Eevee"
        }]
    }, {
        "id": 136,
        "num": "136",
        "name": "Flareon",
        "img": "assets/images/pokemons/136.png",
        "type": ["Fire"],
        "height": "0.89 m",
        "weight": "25.0 kg",
        "candy": "Eevee Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Ground",
            "Rock"
        ],
        "prev_evolution": [{
            "num": "133",
            "name": "Eevee"
        }]
    }, {
        "id": 137,
        "num": "137",
        "name": "Porygon",
        "img": "assets/images/pokemons/137.png",
        "type": ["Normal"],
        "height": "0.79 m",
        "weight": "36.5 kg",
        "candy": "Porygon Candy",
        "egg": "5",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ]
    }, {
        "id": 138,
        "num": "138",
        "name": "Omanyte",
        "img": "assets/images/pokemons/138.png",
        "type": ["Rock", "Water"],
        "height": "0.41 m",
        "weight": "7.5 kg",
        "candy": "Omanyte Candy",
        "candy_count": "50",
        "egg": "10",
        "multipliers": 2.12,
        "weaknesses": [
            "Electric",
            "Grass",
            "Fighting",
            "Ground"
        ],
        "next_evolution": [{
            "num": "139",
            "name": "Omastar"
        }]
    }, {
        "id": 139,
        "num": "139",
        "name": "Omastar",
        "img": "assets/images/pokemons/139.png",
        "type": ["Rock", "Water"],
        "height": "0.99 m",
        "weight": "35.0 kg",
        "candy": "Omanyte Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass",
            "Fighting",
            "Ground"
        ],
        "prev_evolution": [{
            "num": "138",
            "name": "Omanyte"
        }]
    }, {
        "id": 140,
        "num": "140",
        "name": "Kabuto",
        "img": "assets/images/pokemons/140.png",
        "type": ["Rock", "Water"],
        "height": "0.51 m",
        "weight": "11.5 kg",
        "candy": "Kabuto Candy",
        "candy_count": "50",
        "egg": "10",
        "multipliers": [
            1.97,
            2.37
        ],
        "weaknesses": [
            "Electric",
            "Grass",
            "Fighting",
            "Ground"
        ],
        "next_evolution": [{
            "num": "141",
            "name": "Kabutops"
        }]
    }, {
        "id": 141,
        "num": "141",
        "name": "Kabutops",
        "img": "assets/images/pokemons/141.png",
        "type": ["Rock", "Water"],
        "height": "1.30 m",
        "weight": "40.5 kg",
        "candy": "Kabuto Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Electric",
            "Grass",
            "Fighting",
            "Ground"
        ],
        "prev_evolution": [{
            "num": "140",
            "name": "Kabuto"
        }]
    }, {
        "id": 142,
        "num": "142",
        "name": "Aerodactyl",
        "img": "assets/images/pokemons/142.png",
        "type": ["Rock", "Flying"],
        "height": "1.80 m",
        "weight": "59.0 kg",
        "candy": "Aerodactyl Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Electric",
            "Ice",
            "Rock",
            "Steel"
        ]
    }, {
        "id": 143,
        "num": "143",
        "name": "Snorlax",
        "img": "assets/images/pokemons/143.png",
        "type": ["Normal"],
        "height": "2.11 m",
        "weight": "460.0 kg",
        "candy": "Snorlax Candy",
        "egg": "10",
        "multipliers": null,
        "weaknesses": [
            "Fighting"
        ]
    }, {
        "id": 144,
        "num": "144",
        "name": "Articuno",
        "img": "assets/images/pokemons/144.png",
        "type": ["Ice", "Flying"],
        "height": "1.70 m",
        "weight": "55.4 kg",
        "candy": "None",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Fire",
            "Electric",
            "Rock",
            "Steel"
        ],
        "location": "Unavailable"
    }, {
        "id": 145,
        "num": "145",
        "name": "Zapdos",
        "img": "assets/images/pokemons/145.png",
        "type": ["Electric", "Flying"],
        "height": "1.60 m",
        "weight": "52.6 kg",
        "candy": "None",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Ice",
            "Rock"
        ],
        "location": "Unavailable"
    }, {
        "id": 146,
        "num": "146",
        "name": "Moltres",
        "img": "assets/images/pokemons/146.png",
        "type": ["Fire", "Flying"],
        "height": "2.01 m",
        "weight": "60.0 kg",
        "candy": "None",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Water",
            "Electric",
            "Rock"
        ],
        "location": "Unavailable"
    }, {
        "id": 147,
        "num": "147",
        "name": "Dratini",
        "img": "assets/images/pokemons/147.png",
        "type": ["Dragon"],
        "height": "1.80 m",
        "weight": "3.3 kg",
        "candy": "Dratini Candy",
        "candy_count": "25",
        "egg": "10",
        "multipliers": [
            1.83,
            1.84
        ],
        "weaknesses": [
            "Ice",
            "Dragon",
            "Fairy"
        ],
        "next_evolution": [{
            "num": "148",
            "name": "Dragonair"
        }, {
                "num": "149",
                "name": "Dragonite"
            }]
    }, {
        "id": 148,
        "num": "148",
        "name": "Dragonair",
        "img": "assets/images/pokemons/148.png",
        "type": ["Dragon"],
        "height": "3.99 m",
        "weight": "16.5 kg",
        "candy": "Dratini Candy",
        "candy_count": "100",
        "egg": "0",
        "multipliers": 2.05,
        "weaknesses": [
            "Ice",
            "Dragon",
            "Fairy"
        ],
        "next_evolution": [{
            "num": "149",
            "name": "Dragonite"
        }],
        "prev_evolution": [{
            "num": "147",
            "name": "Dratini"
        }]
    }, {
        "id": 149,
        "num": "149",
        "name": "Dragonite",
        "img": "assets/images/pokemons/149.png",
        "type": ["Dragon", "Flying"],
        "height": "2.21 m",
        "weight": "210.0 kg",
        "candy": "Dratini Candy",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Ice",
            "Rock",
            "Dragon",
            "Fairy"
        ],
        "prev_evolution": [{
            "num": "147",
            "name": "Dratini"
        }, {
                "num": "148",
                "name": "Dragonair"
            }]
    }, {
        "id": 150,
        "num": "150",
        "name": "Mewtwo",
        "img": "assets/images/pokemons/150.png",
        "type": ["Psychic"],
        "height": "2.01 m",
        "weight": "122.0 kg",
        "candy": "None",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Bug",
            "Ghost",
            "Dark"
        ],
        "location": "Unavailable"
    }, {
        "id": 151,
        "num": "151",
        "name": "Mew",
        "img": "assets/images/pokemons/151.png",
        "type": ["Psychic"],
        "height": "0.41 m",
        "weight": "4.0 kg",
        "candy": "None",
        "egg": "0",
        "multipliers": null,
        "weaknesses": [
            "Bug",
            "Ghost",
            "Dark"
        ],
        "location": "Unavailable"
    }];

var pokemonSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: String,
    img: String,
    type: [String],
    candy: String,
    candy_count: Number,
    egg: Number,
    multipliers: Number,
    immunes: [String],
    weaknesses: [String],
    strengths: [String],
    next_evolution: [Number],
    prev_evolution: [Number],
    location: String
});

pokemonSchema.virtual('keywords').get(function () {
    return [this.name, ("000" + this.id).slice(-3), this.type, this.egg + 'km', this.location];
});

pokemonSchema.set('toObject', {
    virtuals: true
});
pokemonSchema.set('toJSON', {
    virtuals: true
});

var pokemon = [];
for (var i = 0; i < pokemonRawDate.length; i++) {
    var p = {
        id: pokemonRawDate[i].id,
        name: pokemonRawDate[i].name,
        img: pokemonRawDate[i].img,
        type: pokemonRawDate[i].type,
        candy: pokemonRawDate[i].candy,
        candy_count: 0,
        immunes: [],
        strengths: [],
        weaknesses: [],
        egg: +pokemonRawDate[i].egg,
        next_evolution: [],
        prev_evolution: [],
        location: ''
    };

    for (var j = 0; j < p.type.length; j++) {
        p.strengths = p.strengths.concat(poketype[p.type[j]].strengths).unique();
        p.weaknesses = p.weaknesses.concat(poketype[p.type[j]].weaknesses).unique();
        p.weaknesses = p.weaknesses.concat(poketype[p.type[j]].immunes).unique();
    }

    if ('next_evolution' in pokemonRawDate[i]) {
        for (var j = 0; j < pokemonRawDate[i].next_evolution.length; j++) {
            p.next_evolution.push(+pokemonRawDate[i].next_evolution[j].num);
        }
    }
    if ('prev_evolution' in pokemonRawDate[i]) {
        for (var j = 0; j < pokemonRawDate[i].prev_evolution.length; j++) {
            p.prev_evolution.push(+pokemonRawDate[i].prev_evolution[j].num);
        }

        p.candy_count = pokemonRawDate.filter(function (obj) { return obj.id === p.prev_evolution[p.prev_evolution.length - 1]; })[0].candy_count;
    }
    if ('location' in pokemonRawDate[i]) {
        p.location = pokemonRawDate[i].location;
    }

    pokemon.push(p);
}

var PokemonDB = mongoose.model('Pokemon', pokemonSchema);
PokemonDB.collection.remove({});
PokemonDB.create(pokemon, function (err) {
    if (err) {
        console.log(err);
    } else {
        PokemonDB.count({}, function (err, count) {
            if (err) console.log(err);
            console.log('%d pokemons were successfully loaded in PokemonDB.', count);
        });
    }
});

var getPokemon = function () {
    if (arguments.length === 1) {
        var callback = arguments[0];
        PokemonDB.find(function (err, pokemon) {
            if (err) callback(err);
            else callback(null, pokemon);
        });
    }
    else if (arguments.length === 2) {
        var id = arguments[0];
        var callback = arguments[1];
        PokemonDB.findOne({ 'id': id }, function (err, pokemon) {
            if (err) callback(err);
            else callback(null, pokemon);
        });
    }
};

module.exports.get = getPokemon;