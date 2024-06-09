import { faker } from "@faker-js/faker";

const touristSpots = [
  {
    images: [
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
    ],
    name: "Statue of Liberty",
    fb: "https://facebook.com/statueoflibertynyc",
    web: "https://www.nps.gov/stli/index.htm",
    location: "https://goo.gl/maps/123456789", // Replace with actual location
  },
  {
    images: [
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
    ],
    name: "Big Ben",
    fb: "https://facebook.com/bigbenlondon",
    web: "https://www.visitlondon.com/things-to-do/sightseeing/london-attraction/big-ben",
    location: "https://goo.gl/maps/987654321", // Replace with actual location
  },
  {
    images: [
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
    ],
    name: "Taj Mahal",
    fb: "https://facebook.com/tajmahal",
    web: "https://www.tajmahal.gov.in/",
    location: "https://goo.gl/maps/456789123", // Replace with actual location
  },
  {
    images: [
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
    ],
    name: "Pyramids of Giza",
    fb: "https://facebook.com/pyramidsofgiza",
    web: "http://www.sca-egypt.org/eng/SITE_Giza_pyramids.htm",
    location: "https://goo.gl/maps/321098765", // Replace with actual location
  },
  {
    images: [
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
    ],
    name: "Santorini",
    fb: "https://facebook.com/santoriniofficial",
    web: "https://www.visitgreece.gr/places/santorini/",
    location: "https://goo.gl/maps/890123456", // Replace with actual location
  },
  {
    images: [
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
    ],
    name: "Machu Picchu",
    fb: "https://facebook.com/machupicchu",
    web: "https://www.machupicchu.gob.pe/",
    location: "https://goo.gl/maps/678901234", // Replace with actual location
  },
  {
    images: [
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
    ],
    name: "Maasai Mara National Reserve",
    fb: "https://facebook.com/maasaimarareserve",
    web: "https://www.maasaimara.com/",
    location: "https://goo.gl/maps/567890123", // Replace with actual location
  },
  {
    images: [
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
    ],
    name: "Yellowstone National Park",
    fb: "https://facebook.com/yellowstonenps",
    web: "https://www.nps.gov/yell/index.htm",
    location: "https://goo.gl/maps/345678901", // Replace with actual location
  },
  {
    images: [
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
    ],
    name: "Mount Everest Base Camp",
    fb: "https://facebook.com/everestbasecamp",
    web: "https://www.lonelyplanet.com/nepal/mount-everest",
    location: "https://goo.gl/maps/234567890", // Replace with actual location
  },
  {
    images: [
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
      faker.image.urlLoremFlickr({ category: "park" }),
    ],
    name: "Northern Lights",
    fb: "https://facebook.com/northernlights",
    web: "https://www.aurorawatch.is/",
    location: "https://goo.gl/maps/123456789", // Replace with actual location
  },
];

export default touristSpots;
