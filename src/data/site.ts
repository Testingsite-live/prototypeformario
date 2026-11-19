/**
 * Central content for Kerf & Cedar Woodworks.
 * Every name, price, size, wood, and line of copy here is an editable placeholder
 * that the owner should confirm before launch.
 */
import heroPoster from "@/assets/hero-poster.webp";
import studioSanding from "@/assets/studio-sanding.webp";
import workbenchTools from "@/assets/workbench-tools.webp";
import engravingCloseup from "@/assets/engraving-closeup.webp";
import grainMacro from "@/assets/grain-macro.webp";
import careOil from "@/assets/care-oil.webp";
import collectionBoards from "@/assets/collection-boards.webp";
import collectionBoxes from "@/assets/collection-boxes.webp";
import collectionHoliday from "@/assets/collection-holiday.webp";
import everydayBoard from "@/assets/everyday-board.webp";
import endGrainBlock from "@/assets/end-grain-butcher-block.webp";
import charcuteriePlank from "@/assets/charcuterie-plank.webp";
import keepsakeBox from "@/assets/keepsake-box.webp";
import teaTreasureBox from "@/assets/tea-treasure-box.webp";
import heirloomJewelryBox from "@/assets/heirloom-jewelry-box.webp";
import engravedOrnament from "@/assets/engraved-ornament.webp";
import holidayGiftSet from "@/assets/holiday-gift-set.webp";
import seasonalServingBoard from "@/assets/seasonal-serving-board.webp";

/* ---------- Brand ---------- */
export const BRAND = {
  name: "Kerf & Cedar Woodworks",
  shortName: "Kerf & Cedar",
  tagline: "Handmade cutting boards, designer boxes, and holiday gifts, personalized with laser engraving.",
  location: "Dupont, Washington",
  locationShort: "Dupont, WA",
  locality: "Dupont",
  region: "WA",
  // Leave empty until the owner supplies them. Empty values are hidden across the site.
  email: "",
  phone: "",
  social: [] as { label: string; href: string }[],
  // Public site URL once known (used for structured data only).
  url: "",
};

export const HERO = {
  // Licensed MP4 (H.264, 6–12s, under ~4 MB). Empty = poster image only.
  videoSrc: "",
  videoSrcWebm: "",
  poster: heroPoster,
  posterWidth: 1536,
  posterHeight: 1024,
  posterAlt: "Walnut and maple end grain cutting board on a dark workbench in warm side light, with wood shavings nearby",
};

export const IMAGES = {
  heroPoster,
  studioSanding,
  workbenchTools,
  engravingCloseup,
  grainMacro,
  careOil,
};

/* ---------- Navigation ---------- */
export type CollectionSlug = "cutting-boards" | "designer-boxes" | "holiday-gifts";

export interface Collection {
  slug: CollectionSlug;
  name: string;
  label: string;
  title: string;
  intro: string;
  tileCopy: string;
  linkLabel: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  imageAlt: string;
  detailFocus: string;
  metaTitle: string;
  metaDescription: string;
}

export const COLLECTIONS: Collection[] = [
  {
    slug: "cutting-boards",
    name: "Cutting Boards",
    label: "01 / Cutting Boards",
    title: "Cutting boards built for the counter and the table.",
    intro:
      "Edge grain workhorses, end grain butcher blocks, and charcuterie planks, each glued up, flattened, and sanded by hand. Add a name, a date, or a short message to make one theirs.",
    tileCopy: "Edge grain workhorses, end grain butcher blocks, and charcuterie planks for the table.",
    linkLabel: "Shop Cutting Boards",
    image: collectionBoards,
    imageWidth: 880,
    imageHeight: 1320,
    imageAlt: "Three handmade cutting boards in maple, walnut, and cherry laid out on a dark walnut bench",
    detailFocus: "70% 35%",
    metaTitle: "Custom Cutting Boards",
    metaDescription:
      "Handmade edge grain, end grain, and charcuterie cutting boards with optional laser engraving, made in Dupont, Washington.",
  },
  {
    slug: "designer-boxes",
    name: "Designer Boxes",
    label: "02 / Designer Boxes",
    title: "Boxes with clean joinery and a lid made for engraving.",
    intro:
      "Keepsake, tea, and jewelry boxes in walnut, maple, and cherry. Each one has a flat lid with room for a monogram, a date, or a few words worth keeping.",
    tileCopy: "Keepsake, tea, and jewelry boxes with clean joinery and room for an engraved lid.",
    linkLabel: "Shop Designer Boxes",
    image: collectionBoxes,
    imageWidth: 1536,
    imageHeight: 1024,
    imageAlt: "Two handmade walnut boxes with finger joints, the front lid resting slightly open",
    detailFocus: "15% 75%",
    metaTitle: "Designer Wooden Boxes",
    metaDescription:
      "Handmade keepsake, tea, and jewelry boxes with engraved lids, made to order in Dupont, Washington.",
  },
  {
    slug: "holiday-gifts",
    name: "Holiday Gifts",
    label: "03 / Holiday Gifts",
    title: "Holiday gifts, engraved and ready to wrap.",
    intro:
      "Ornaments, matched gift sets, and seasonal serving boards. Add a name or a year and give something that comes back out every December.",
    tileCopy: "Ornaments, gift sets, and seasonal pieces, engraved and ready to wrap.",
    linkLabel: "Shop Holiday Gifts",
    image: collectionHoliday,
    imageWidth: 1536,
    imageHeight: 1024,
    imageAlt: "Engraved maple and walnut snowflake ornaments beside a small serving board, with warm lights blurred behind",
    detailFocus: "55% 70%",
    metaTitle: "Engraved Holiday Wooden Gifts",
    metaDescription:
      "Engraved wooden ornaments, holiday gift sets, and seasonal serving boards, handmade in Dupont, Washington.",
  },
];

export const NAV_LINKS = [
  { to: "/custom-engraving", label: "Custom Engraving" },
  { to: "/about", label: "About" },
  { to: "/care", label: "Care" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
] as const;

/* ---------- Products ---------- */
export interface PriceOption {
  label: string;
  priceAdd: number;
}

export interface Product {
  slug: string;
  category: CollectionSlug;
  name: string;
  descriptor: string;
  description: string;
  basePrice: number;
  sizes: PriceOption[];
  woods: PriceOption[];
  /** Extra product-specific choice, e.g. the ornament style. */
  variant?: { label: string; choices: PriceOption[] };
  details: string[];
  image: string;
  imageAlt: string;
  detailFocus: string;
  detailAlt: string;
  featured?: boolean;
  featuredOrder?: number;
}

export const ENGRAVING_OPTIONS: PriceOption[] = [
  { label: "No engraving", priceAdd: 0 },
  { label: "Name or monogram", priceAdd: 10 },
  { label: "Custom message", priceAdd: 15 },
  { label: "Upload artwork later", priceAdd: 20 },
];

export const PRODUCTS: Product[] = [
  {
    slug: "everyday-board",
    category: "cutting-boards",
    name: "The Everyday Board",
    descriptor: "Edge grain, juice groove on request",
    description:
      "The board that lives on your counter. Edge grain construction, hand sanded to a soft finish.",
    basePrice: 65,
    sizes: [
      { label: "Small 12 x 9 in", priceAdd: 0 },
      { label: "Medium 16 x 12 in", priceAdd: 20 },
      { label: "Large 20 x 14 in", priceAdd: 40 },
    ],
    woods: [
      { label: "Maple", priceAdd: 0 },
      { label: "Walnut", priceAdd: 10 },
      { label: "Cherry", priceAdd: 10 },
    ],
    details: ["Edge grain construction", "Juice groove available on request (mention it in your notes)", "Sizes: Small 12 x 9 in, Medium 16 x 12 in, Large 20 x 14 in", "Woods: Maple, Walnut, Cherry"],
    image: everydayBoard,
    imageAlt: "Maple edge grain cutting board with a juice groove, shown from above on cream paper",
    detailFocus: "50% 30%",
    detailAlt: "Close crop of the maple grain and juice groove",
    featured: true,
    featuredOrder: 1,
  },
  {
    slug: "end-grain-butcher-block",
    category: "cutting-boards",
    name: "The End Grain Butcher Block",
    descriptor: "Checkered end grain face",
    description:
      "A heavier board with a checkered end grain face. Built for daily chopping and made to be a centerpiece.",
    basePrice: 140,
    sizes: [
      { label: "Medium 14 x 14 in", priceAdd: 0 },
      { label: "Large 18 x 14 in", priceAdd: 40 },
    ],
    woods: [
      { label: "Maple and Walnut checker", priceAdd: 0 },
      { label: "Maple", priceAdd: 0 },
      { label: "Walnut", priceAdd: 15 },
    ],
    details: ["End grain checkered face", "Sizes: Medium 14 x 14 in, Large 18 x 14 in", "Woods: Maple and Walnut checker, Maple, Walnut"],
    image: endGrainBlock,
    imageAlt: "Thick maple and walnut checkerboard end grain butcher block on pale stone",
    detailFocus: "55% 55%",
    detailAlt: "Close crop of the end grain checker pattern",
    featured: true,
    featuredOrder: 2,
  },
  {
    slug: "charcuterie-plank",
    category: "cutting-boards",
    name: "The Charcuterie Plank",
    descriptor: "Serving plank with a handle",
    description:
      "A serving plank with a handle and a clean live edge feel. Made for cheese, fruit, and conversation.",
    basePrice: 55,
    sizes: [
      { label: "Small 14 x 7 in", priceAdd: 0 },
      { label: "Large 20 x 9 in", priceAdd: 25 },
    ],
    woods: [
      { label: "Walnut", priceAdd: 0 },
      { label: "Maple", priceAdd: 0 },
      { label: "Cherry", priceAdd: 0 },
    ],
    details: ["Serving plank with a handle", "Sizes: Small 14 x 7 in, Large 20 x 9 in", "Woods: Walnut, Maple, Cherry"],
    image: charcuteriePlank,
    imageAlt: "Walnut charcuterie plank with a handle, set with cheese, figs, and grapes",
    detailFocus: "75% 75%",
    detailAlt: "Close crop of the walnut grain along the plank's edge",
  },
  {
    slug: "keepsake-box",
    category: "designer-boxes",
    name: "The Keepsake Box",
    descriptor: "Hinged box with a flat engraving lid",
    description:
      "A hinged box with a flat lid made for engraving. Holds letters, tokens, and small things that matter.",
    basePrice: 60,
    sizes: [
      { label: "Small 6 x 4 x 3 in", priceAdd: 0 },
      { label: "Medium 8 x 6 x 3.5 in", priceAdd: 20 },
    ],
    woods: [
      { label: "Walnut", priceAdd: 0 },
      { label: "Maple", priceAdd: 0 },
      { label: "Cherry", priceAdd: 0 },
    ],
    details: ["Hinged lid, flat for engraving", "Sizes: Small 6 x 4 x 3 in, Medium 8 x 6 x 3.5 in", "Woods: Walnut, Maple, Cherry"],
    image: keepsakeBox,
    imageAlt: "Walnut keepsake box with brass hinges and an engraved floral wreath on the lid",
    detailFocus: "52% 38%",
    detailAlt: "Close crop of the engraved floral wreath on the lid",
    featured: true,
    featuredOrder: 3,
  },
  {
    slug: "tea-treasure-box",
    category: "designer-boxes",
    name: "The Tea and Treasure Box",
    descriptor: "Divided box with a sliding lid",
    description:
      "A divided box with a sliding lid. Works for tea, trinkets, or a curated gift set.",
    basePrice: 75,
    sizes: [{ label: "9 x 7 x 4 in", priceAdd: 0 }],
    woods: [
      { label: "Walnut", priceAdd: 0 },
      { label: "Maple", priceAdd: 0 },
    ],
    details: ["Divided interior with a sliding lid", "Size: 9 x 7 x 4 in", "Woods: Walnut, Maple"],
    image: teaTreasureBox,
    imageAlt: "Maple box with its sliding lid partly open over divided compartments of tea",
    detailFocus: "15% 70%",
    detailAlt: "Close crop of the box's corner joinery",
  },
  {
    slug: "heirloom-jewelry-box",
    category: "designer-boxes",
    name: "The Heirloom Jewelry Box",
    descriptor: "Lined, with an engraved lid",
    description:
      "A lined jewelry box with an engraved lid and a soft close feel, made as a gift for keeping.",
    basePrice: 95,
    sizes: [{ label: "8 x 6 x 4 in", priceAdd: 0 }],
    woods: [
      { label: "Walnut", priceAdd: 0 },
      { label: "Cherry", priceAdd: 0 },
    ],
    details: ["Lined interior with compartments", "Size: 8 x 6 x 4 in", "Woods: Walnut, Cherry"],
    image: heirloomJewelryBox,
    imageAlt: "Cherry jewelry box with the lid open, showing a soft cream lined interior",
    detailFocus: "50% 60%",
    detailAlt: "Close crop of the lined compartments",
    featured: true,
    featuredOrder: 4,
  },
  {
    slug: "engraved-ornament",
    category: "holiday-gifts",
    name: "Engraved Wooden Ornament",
    descriptor: "Name, year, or message",
    description:
      "A flat wooden ornament with your name or date. Sold individually or as a set.",
    basePrice: 14,
    sizes: [],
    woods: [
      { label: "Maple", priceAdd: 0 },
      { label: "Walnut", priceAdd: 0 },
    ],
    variant: {
      label: "Ornament option",
      choices: [
        { label: "Name", priceAdd: 0 },
        { label: "Year", priceAdd: 0 },
        { label: "Message", priceAdd: 0 },
      ],
    },
    details: ["Flat wooden ornament with a twine loop", "Options: Name, Year, or Message", "Woods: Maple, Walnut", "Order several for a set (use the quantity selector)"],
    image: engravedOrnament,
    imageAlt: "Three round wooden ornaments in maple and walnut engraved with snowflake and star designs",
    detailFocus: "30% 35%",
    detailAlt: "Close crop of an engraved snowflake ornament",
  },
  {
    slug: "holiday-gift-set",
    category: "holiday-gifts",
    name: "The Holiday Gift Set",
    descriptor: "Board, ornament, and tag",
    description:
      "A small board, an ornament, and a gift tag, engraved to match and ready to wrap.",
    basePrice: 48,
    sizes: [],
    woods: [],
    details: ["Includes a small board, an ornament, and a gift tag", "Engraved to match"],
    image: holidayGiftSet,
    imageAlt: "Small maple board, round ornament, and gift tag engraved with matching pine sprigs, tied with twine",
    detailFocus: "70% 55%",
    detailAlt: "Close crop of the matching engraved ornament and tag",
  },
  {
    slug: "seasonal-serving-board",
    category: "holiday-gifts",
    name: "The Seasonal Serving Board",
    descriptor: "Festive engraved border",
    description:
      "A serving board with a festive engraved border or message for holiday tables.",
    basePrice: 58,
    sizes: [{ label: "Medium 14 x 8 in", priceAdd: 0 }],
    woods: [
      { label: "Maple", priceAdd: 0 },
      { label: "Walnut", priceAdd: 0 },
    ],
    details: ["Festive engraved border or message", "Size: Medium 14 x 8 in", "Woods: Maple, Walnut"],
    image: seasonalServingBoard,
    imageAlt: "Maple serving board with an engraved holly and berry border on cream linen",
    detailFocus: "45% 62%",
    detailAlt: "Close crop of the engraved holly border",
  },
];

export const PRODUCT_IMAGE = { width: 880, height: 1320 };

/* ---------- Home page blocks ---------- */
export const PROCESS_STEPS = [
  { title: "Pick your piece", body: "Choose a board, box, or gift and your wood." },
  { title: "Tell us what to engrave", body: "Add a name, date, message, or send simple artwork." },
  { title: "We make it by hand", body: "Your piece is built, sanded, finished, then engraved." },
  { title: "It ships to you", body: "Carefully packed and sent anywhere in the US." },
];

export const GIFTING = [
  { title: "Weddings and anniversaries", body: "Keepsake boxes and boards with names and a date.", filter: "designer-boxes" },
  { title: "Housewarmings", body: "A board for the new kitchen, engraved with the family name.", collection: "cutting-boards" },
  { title: "Holiday gifts", body: "Ornaments, gift sets, and seasonal serving boards.", collection: "holiday-gifts" },
  { title: "Corporate and client gifts", body: "Small batches with your logo or a short message.", custom: true },
] as { title: string; body: string; filter?: CollectionSlug; collection?: CollectionSlug; custom?: boolean }[];

/* ---------- FAQ ---------- */
export const FAQS = [
  { q: "Can I customize any piece?", a: "Most pieces can be engraved. Tell us what you would like and we will confirm the layout before anything is made." },
  { q: "What can be engraved?", a: "Names, dates, short messages, and simple artwork or logos. Very fine detail depends on the wood and size." },
  { q: "Will I see the design before it is engraved?", a: "Yes. Engraving placement and text are confirmed with you before the laser runs." },
  { q: "What woods do you use?", a: "We work mainly with maple, walnut, and cherry. Available woods are listed on each product." },
  { q: "Are the boards food safe?", a: "Cutting and serving boards are finished for kitchen use. See the care guide for how to keep them in good shape." },
  { q: "Can I order for a business or an event?", a: "Yes. Use the custom inquiry form and tell us the quantity and idea." },
  { q: "How does ordering work?", a: "Add pieces to your cart and send an order request with your engraving details. We confirm the details and total with you before you pay." },
  { q: "Do you ship across the US?", a: "Yes. Shipping details are on the Shipping and Returns page." },
  { q: "What if I need a gift by a certain date?", a: "Tell us the date in your order request and we will let you know what is possible." },
];

/* ---------- Care ---------- */
export const CARE_SECTIONS = [
  { title: "Cleaning cutting boards", body: "Wash by hand with mild soap and warm water, then wipe dry right away. Never soak a board or put it in a dishwasher." },
  { title: "Oiling and conditioning", body: "When the wood starts to look dry or pale, rub in a food safe mineral oil or board conditioner with a soft cloth. Let it soak in, then wipe off the excess." },
  { title: "Storing your pieces", body: "Store boards upright or flat in a dry place, away from direct heat and standing water, so air can reach both sides." },
  { title: "Caring for boxes and gifts", body: "Dust with a soft, dry cloth. Keep boxes and ornaments away from damp places and long periods of direct sunlight." },
  { title: "Caring for engraved areas", body: "Clean engraved areas gently with a soft cloth. Avoid abrasive pads and scrubbing, which can soften the engraved edges." },
];

/* ---------- Forms ---------- */
export const INQUIRY_TYPES = ["Cutting board", "Designer box", "Holiday gift", "Business or bulk order", "Something else"];
export const CONTACT_SUBJECTS = ["Question about a piece", "Custom idea", "Bulk or business order", "Order request follow up"];

export const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

export function pageTitle(title?: string) {
  return title ? `${title} | ${BRAND.name}` : `${BRAND.name} | Handmade Engraved Wood Gifts`;
}

export const DEFAULT_DESCRIPTION =
  "Handmade custom cutting boards, designer boxes, and holiday gifts with laser engraving, made in Dupont, Washington.";
