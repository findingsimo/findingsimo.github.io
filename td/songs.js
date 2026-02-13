// songs.js - Song data for each heart card

const Songs = (() => {
  const songs = [
    null, // index 0 unused
    { artist: "Leonard Cohen", title: "In My Secret Life", url: "https://open.spotify.com/track/31TADh49q4s4jm6lGDeIrd?si=d5d7efdec9c44f44" },
    { artist: "Cigarettes After Sex", title: "Apocalypse", url: "https://open.spotify.com/track/1oAwsWBovWRIp7qLMGPIet?si=832bd1a174d54b40" },
    { artist: "Sabrina Carpenter", title: "Please Please Please", url: "https://open.spotify.com/track/2tHwzyyOLoWSFqYNjeVMzj?si=d3fb5a89dc1445c9" },
    { artist: "Lana Del Rey", title: "Peppers", url: "https://open.spotify.com/track/2Rlso2ZNV0PaWwUYeeBYxx?si=6276d8a7eaff4681" },
    { artist: "Knocked Loose feat. Poppy", title: "Suffocate", url: "https://open.spotify.com/track/6PXYOVPBzO3xojFhQAvmde?si=d6e616eb3d8048bf" },
    { artist: "Cigarettes After Sex", title: "Heavenly", url: "https://open.spotify.com/track/5E02BgqYNN9VzafXrYP6Np?si=67ce95008cc2465a" },
    { artist: "Placebo", title: "Special Needs", url: "https://open.spotify.com/track/0AATuEhrQtGDevnhq9Nx2k?si=8059fa545fce4bbb" },
    { artist: "Matisyahu", title: "One Day", url: "https://open.spotify.com/track/5JlqbEj7Bbh2RdZgcO5kJE?si=45878282514f42f7" },
    { artist: "Whirr", title: "Younger Than You", url: "https://open.spotify.com/track/079RTKdIkyTvNOwBzRvoh7?si=720a8ee6309d4fa8" },
    { artist: "Taylor Swift", title: "The Fate of Ophelia", url: "https://open.spotify.com/track/53iuhJlwXhSER5J2IYYv1W?si=fc962ce6e7dd4bb5" },
    { artist: "Leonard Cohen", title: "Hallelujah", url: "https://open.spotify.com/track/7yzbimr8WVyAtBX3Eg6UL9?si=7de139a80aca428c" },
    { artist: "Lana Del Rey", title: "Love", url: "https://open.spotify.com/track/2Kerz9H9IejzeIpjhDJoYG?si=82b9e7b02b0c4d27" },
    { artist: "Sabrina Carpenter", title: "Man Child", url: "https://open.spotify.com/track/42UBPzRMh5yyz0EDPr6fr1?si=955b4b37bfe34d5f" },
    { artist: "Cloakroom", title: "Bad Larry", url: "https://open.spotify.com/track/23cOMP1AJASMGM2c7oS9Sz?si=0520dec92ad64f00" },
    { artist: "Kindzar", title: "I was all alone till I met you", url: "https://open.spotify.com/track/2Xq0q6jMUfwiDFo9JSR7sa?si=991da3ee8fb14ba1" },
    { artist: "Nicolas Michaux", title: "Amusement Park", url: "https://open.spotify.com/track/6Iw6EcVVKZD7oLpY97t1vd?si=c707e09a47ab4b45" },
    { artist: "Whirr", title: "Sandy", url: "https://open.spotify.com/track/351rZyulXSupAuXM1NaUgQ?si=58f31e446b5e44d0" },
    { artist: "Lola Young", title: "Messy", url: "https://open.spotify.com/track/3SKH53SPQbEnZR4cJPVaz2?si=11f3ec3974cd41ea" },
    { artist: "Lana Del Rey", title: "Ultraviolence", url: "https://open.spotify.com/track/1y3r6RXiJZNBV1EI0NggpS?si=ba8b4b49ec414ea0" },
    { artist: "Yeah Yeah Yeahs feat. Perfume Genius", title: "Spitting Off the Edge of the World", url: "https://open.spotify.com/track/0JX23XA8E7aN1Chj32kgVn?si=8bdb81f994854322" },
    { artist: "Cloakroom", title: "Fear of Being Fixed", url: "https://open.spotify.com/track/1sKiJW6VtkmGXl77rum2yO?si=8c94058c271c45a0" },
    { artist: "Rihanna", title: "Stay", url: "https://open.spotify.com/track/0GNI8K3VATWBABQFAzBAYe?si=326096955520497f" },
    { artist: "Luster", title: "Missing You", url: "https://open.spotify.com/track/4mJz9boLlkYuZFue3Kn6gs?si=532dca783d62423b" },
    { artist: "Drake", title: "Hold On, We're Going Home", url: "https://open.spotify.com/track/6jdOi5U5LBzQrc4c1VT983?si=89e18f2a8537454a" },
    { artist: "System of a Down", title: "Toxicity", url: "https://open.spotify.com/track/0snQkGI5qnAmohLE7jTsTn?si=00e0d7f5ebfd4c13" },
    { artist: "Shaggy", title: "It Wasn't Me", url: "https://open.spotify.com/track/3WkibOpDF7cQ5xntM1epyf?si=8d43b788e5334ca1" },
    { artist: "Slowdive", title: "Sugar for the Pill", url: "https://open.spotify.com/track/0eVz3hV2xOXdneGpnWDFpb?si=e99957c64bfd408b" },
    { artist: "Miley Cyrus", title: "Midnight Sky", url: "https://open.spotify.com/track/4i2qxFEVVUi8yOYoxB8TCX?si=ffea32a5ca024ab3" },
    { artist: "Poppy", title: "As Strange As it Seems", url: "https://open.spotify.com/track/3uVO2YohC10n0AOjFJ1P43?si=b0beddd642294752" },
    { artist: "Cigarettes After Sex", title: "Sesame Syrup", url: "https://open.spotify.com/track/6GcZ4pdtZgbf2ptgHG31bq?si=5221a98c17964422" },
  ];

  function getSong(heartNumber) {
    return songs[heartNumber] || songs[1];
  }

  return { getSong, songs };
})();
