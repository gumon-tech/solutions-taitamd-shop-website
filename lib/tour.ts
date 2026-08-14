// The rooms of the shop, in the order you meet them walking in.
//
// Kru Nok's brief (2026-08-13, via Kom): "ลูกค้าอยากทำ Gallery พร้อมคำบรรยายด้วยครับ
// จุดประสงค์คืออยากให้ดูบรรยากาศของร้าน" — she wants a visitor to see what the place
// feels like. The shop is on the ground floor of a terrace on Caledonian Road, and you
// cannot see in from the pavement, so this page does the job the window cannot.
//
// Every photograph here is a real photograph of these rooms. D-W22 (Legal, 2026-08-10)
// forbids AI imagery anywhere the picture is a factual claim about the premises or the
// people — a venue gallery is the clearest case of that there is. Nothing on this page
// may be generated, extended, or have its contents altered. Adjusting exposure, contrast
// and sharpness is fine; adding, removing or inventing anything in the frame is not.
//
// Captions describe what is actually in the frame. No "the most luxurious in King's
// Cross", no review quotes, no star ratings — there is no source to point at for any of
// it. If Marketing supplies sourced quotes later, they go somewhere else, not here.

export type TourShot = {
  src: string;
  alt: string;
  caption: string;
  /** Portrait shots dominate — the grid gives them the room they need. */
  orientation: "portrait" | "landscape";
};

export type TourZone = {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  shots: TourShot[];
};

export const TOUR: TourZone[] = [
  {
    id: "arrival",
    kicker: "Outside",
    title: "The green front on Caledonian Road",
    intro:
      "Six minutes on foot from King's Cross and St Pancras, on the row of shops running north from the station.",
    shots: [
      {
        src: "/images/tour/shopfront-caledonian-road.jpg",
        alt: "The green shopfront of Taitam-D on Caledonian Road, seen from the pavement with a street tree in front",
        caption: "The shopfront, from the pavement outside.",
        orientation: "portrait",
      },
    ],
  },
  {
    id: "lounge",
    kicker: "Where you wait",
    title: "A painted shore, indoors",
    intro:
      "The front lounge is painted wall to wall with a tropical coast. Leather armchairs, a low table, and somewhere to put your bag down before anything begins.",
    shots: [
      {
        src: "/images/tour/lounge-beach-mural-wide.jpg",
        alt: "The waiting lounge with a wall-to-wall painted tropical beach, leather armchairs and a console table",
        caption: "The lounge, painted from one wall to the next.",
        orientation: "landscape",
      },
      {
        src: "/images/tour/corridor-orchids.jpg",
        alt: "White orchids on a stand at the turn from the lounge into the treatment corridor",
        caption: "White orchids at the turn into the corridor.",
        orientation: "portrait",
      },
    ],
  },
  {
    id: "massage",
    kicker: "Massage",
    title: "Rooms that each look like somewhere else",
    intro:
      "No two treatment rooms share a wall. One faces a lagoon, one an autumn forest, one is panelled in wood and lit by a single lamp.",
    shots: [
      {
        src: "/images/tour/thai-room-twin-beds.jpg",
        alt: "The couples' Thai massage room with twin beds, purple covers and gold Thai silk runners",
        caption: "The couples' room — twin beds, purple covers, gold Thai silk.",
        orientation: "portrait",
      },
      {
        src: "/images/tour/treatment-room-wood-warm.jpg",
        alt: "A single treatment room panelled in dark wood with a warm lamp on the side table",
        caption: "A single room in dark wood, one warm lamp.",
        orientation: "portrait",
      },
      {
        src: "/images/tour/treatment-room-forest-mural.jpg",
        alt: "A treatment room with a stone wall and a mural of an autumn forest behind the bed",
        caption: "This one faces an autumn forest.",
        orientation: "portrait",
      },
    ],
  },
  {
    id: "beauty",
    kicker: "Face & skin",
    title: "Close work, close light",
    intro:
      "Facials, brows and skin treatments happen in their own rooms, with the trolley within reach of the bed and the light where it needs to be.",
    shots: [
      {
        src: "/images/tour/treatment-room-floral.jpg",
        alt: "A facial treatment room with a floral wall mural and a product trolley beside the bed",
        caption: "Facial room, trolley within arm's reach of the bed.",
        orientation: "portrait",
      },
      {
        src: "/images/tour/consultation-desk.jpg",
        alt: "A consultation desk with a ring light and magnifying lamp against a stone wall, with flowers on the counter",
        caption: "The consultation desk, ring light and all.",
        orientation: "portrait",
      },
    ],
  },
  {
    id: "nails",
    kicker: "Hands & feet",
    title: "The pedicure row",
    intro:
      "Reclining chairs along the wall, each with its own footbath, towels set out before you sit down.",
    shots: [
      {
        src: "/images/tour/pedicure-spa-chairs.jpg",
        alt: "Two black pedicure spa chairs with cushions and green towels, mirrors and a styling station behind",
        caption: "Pedicure chairs, cushions and towels ready.",
        orientation: "portrait",
      },
      {
        src: "/images/tour/pedicure-row.jpg",
        alt: "A row of white reclining pedicure chairs along a corridor with stone and wood-panelled walls",
        caption: "The row, running back along stone and wood.",
        orientation: "portrait",
      },
      {
        src: "/images/tour/pedicure-room-daylight.jpg",
        alt: "The front pedicure room with white reclining chairs, daylight through the window onto the street, flowers in the foreground",
        caption: "The front room, with daylight off the street.",
        orientation: "portrait",
      },
    ],
  },
  {
    id: "hair",
    kicker: "Hair",
    title: "A lavender field at the back",
    intro: "The styling chair sits against a printed lavender field, with a treatment bed in the same room.",
    shots: [
      {
        src: "/images/tour/salon-lavender-mural.jpg",
        alt: "A salon styling chair in front of a wall-length photographic mural of a lavender field with a bicycle",
        caption: "The styling chair, against the lavender wall.",
        orientation: "landscape",
      },
    ],
  },
  {
    id: "through",
    kicker: "In between",
    title: "The way through",
    intro: "Stone underfoot, a mural along the wall, and the stairs to the rooms above.",
    shots: [
      {
        src: "/images/tour/infrared-sauna.jpg",
        alt: "The wooden infrared sauna cabin with its door open, bench inside and a lit control panel",
        caption: "The infrared sauna, door open.",
        orientation: "portrait",
      },
      {
        src: "/images/tour/hallway-stairs-mural.jpg",
        alt: "A hallway with a stone floor, a painted sea mural along one wall and stairs leading up",
        caption: "Stone floor, mural, stairs up.",
        orientation: "portrait",
      },
    ],
  },
];

export const TOUR_SHOT_COUNT = TOUR.reduce((n, z) => n + z.shots.length, 0);
