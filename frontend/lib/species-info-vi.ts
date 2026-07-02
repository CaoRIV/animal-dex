import type { Language } from "@/lib/i18n";
import type { SpeciesInfo } from "@/lib/types";

const SPECIES_NAMES_VI: Record<string, string> = {
  antelope: "Linh d\u01b0\u01a1ng",
  badger: "L\u1eedng",
  bat: "D\u01a1i",
  bear: "G\u1ea5u",
  bee: "Ong",
  beetle: "B\u1ecd c\u00e1nh c\u1ee9ng",
  bison: "B\u00f2 r\u1eebng bizon",
  boar: "L\u1ee3n r\u1eebng",
  butterfly: "B\u01b0\u1edbm",
  cat: "M\u00e8o",
  caterpillar: "S\u00e2u b\u01b0\u1edbm",
  chimpanzee: "Tinh tinh",
  cockroach: "Gi\u00e1n",
  cow: "B\u00f2",
  coyote: "S\u00f3i \u0111\u1ed3ng c\u1ecf",
  crab: "Cua",
  crow: "Qu\u1ea1",
  deer: "H\u01b0\u01a1u",
  dog: "Ch\u00f3",
  dolphin: "C\u00e1 heo",
  donkey: "L\u1eeba",
  dragonfly: "Chu\u1ed3n chu\u1ed3n",
  duck: "V\u1ecbt",
  eagle: "\u0110\u1ea1i b\u00e0ng",
  elephant: "Voi",
  flamingo: "H\u1ed3ng h\u1ea1c",
  fly: "Ru\u1ed3i",
  fox: "C\u00e1o",
  goat: "D\u00ea",
  goldfish: "C\u00e1 v\u00e0ng",
  goose: "Ng\u1ed7ng",
  gorilla: "Kh\u1ec9 \u0111\u1ed9t",
  grasshopper: "Ch\u00e2u ch\u1ea5u",
  hamster: "Chu\u1ed9t hamster",
  hare: "Th\u1ecf r\u1eebng",
  hedgehog: "Nh\u00edm gai",
  hippopotamus: "H\u00e0 m\u00e3",
  hornbill: "Chim h\u1ed3ng ho\u00e0ng",
  horse: "Ng\u1ef1a",
  hummingbird: "Chim ru\u1ed3i",
  hyena: "Linh c\u1ea9u",
  jellyfish: "S\u1ee9a",
  kangaroo: "Kangaroo",
  koala: "G\u1ea5u koala",
  ladybugs: "B\u1ecd r\u00f9a",
  leopard: "B\u00e1o hoa mai",
  lion: "S\u01b0 t\u1eed",
  lizard: "Th\u1eb1n l\u1eb1n",
  lobster: "T\u00f4m h\u00f9m",
  mosquito: "Mu\u1ed7i",
  moth: "B\u01b0\u1edbm \u0111\u00eam",
  mouse: "Chu\u1ed9t nh\u1eaft",
  octopus: "B\u1ea1ch tu\u1ed9c",
  okapi: "Okapi",
  orangutan: "\u0110\u01b0\u1eddi \u01b0\u01a1i",
  otter: "R\u00e1i c\u00e1",
  owl: "C\u00fa m\u00e8o",
  ox: "B\u00f2 \u0111\u1ef1c",
  oyster: "H\u00e0u",
  panda: "G\u1ea5u tr\u00fac",
  parrot: "V\u1eb9t",
  pelecaniformes: "Chim b\u1ed3 n\u00f4ng",
  penguin: "Chim c\u00e1nh c\u1ee5t",
  pig: "L\u1ee3n",
  pigeon: "B\u1ed3 c\u00e2u",
  porcupine: "Nh\u00edm",
  possum: "Th\u00fa t\u00fai possum",
  raccoon: "G\u1ea5u m\u00e8o",
  rat: "Chu\u1ed9t c\u1ed1ng",
  reindeer: "Tu\u1ea7n l\u1ed9c",
  rhinoceros: "T\u00ea gi\u00e1c",
  sandpiper: "Chim choi choi",
  seahorse: "C\u00e1 ng\u1ef1a",
  seal: "H\u1ea3i c\u1ea9u",
  shark: "C\u00e1 m\u1eadp",
  sheep: "C\u1eebu",
  snake: "R\u1eafn",
  sparrow: "Chim s\u1ebb",
  squid: "M\u1ef1c",
  squirrel: "S\u00f3c",
  starfish: "Sao bi\u1ec3n",
  swan: "Thi\u00ean nga",
  tiger: "H\u1ed5",
  turkey: "G\u00e0 t\u00e2y",
  turtle: "R\u00f9a",
  whale: "C\u00e1 voi",
  wolf: "S\u00f3i",
  wombat: "G\u1ea5u t\u00fai m\u0169i tr\u1ea7n",
  woodpecker: "Chim g\u00f5 ki\u1ebfn",
  zebra: "Ng\u1ef1a v\u1eb1n"
};

const GROUP_VI: Record<string, string> = {
  Bird: "Chim",
  Cnidarian: "\u0110\u1ed9ng v\u1eadt ru\u1ed9t khoang",
  Crustacean: "Gi\u00e1p x\u00e1c",
  Echinoderm: "\u0110\u1ed9ng v\u1eadt da gai",
  Fish: "C\u00e1",
  Insect: "C\u00f4n tr\u00f9ng",
  Mammal: "\u0110\u1ed9ng v\u1eadt c\u00f3 v\u00fa",
  Mollusk: "\u0110\u1ed9ng v\u1eadt th\u00e2n m\u1ec1m",
  Reptile: "B\u00f2 s\u00e1t",
  "User label": "Nh\u00e3n ng\u01b0\u1eddi d\u00f9ng",
  Unknown: "Kh\u00f4ng r\u00f5"
};

const DANGER_VI: Record<string, string> = {
  Low: "Th\u1ea5p",
  Medium: "Trung b\u00ecnh",
  High: "Cao",
  Unknown: "Kh\u00f4ng r\u00f5"
};

const GROUP_DETAILS_VI: Record<string, { habitat: string; diet: string }> = {
  Bird: {
    habitat: "R\u1eebng, \u0111\u1ed3ng c\u1ecf, v\u00f9ng n\u01b0\u1edbc, c\u00f4ng vi\u00ean ho\u1eb7c khu v\u1ef1c c\u00f3 c\u00e2y xanh t\u00f9y lo\u00e0i.",
    diet: "H\u1ea1t, qu\u1ea3, c\u00f4n tr\u00f9ng, c\u00e1 nh\u1ecf ho\u1eb7c sinh v\u1eadt th\u1ee7y sinh t\u00f9y lo\u00e0i."
  },
  Cnidarian: {
    habitat: "\u0110\u1ea1i d\u01b0\u01a1ng, v\u00f9ng bi\u1ec3n ven b\u1edd ho\u1eb7c n\u01b0\u1edbc m\u1eb7n.",
    diet: "Sinh v\u1eadt ph\u00f9 du, c\u00e1 nh\u1ecf v\u00e0 c\u00e1c lo\u00e0i th\u1ee7y sinh nh\u1ecf."
  },
  Crustacean: {
    habitat: "Bi\u1ec3n, s\u00f4ng, su\u1ed1i, v\u00f9ng tri\u1ec1u ho\u1eb7c n\u01a1i \u1ea9m \u01b0\u1edbt.",
    diet: "T\u1ea3o, x\u00e1c h\u1eefu c\u01a1, \u0111\u1ed9ng v\u1eadt nh\u1ecf v\u00e0 th\u1ee9c \u0103n c\u00f3 s\u1eb5n trong m\u00f4i tr\u01b0\u1eddng n\u01b0\u1edbc."
  },
  Echinoderm: {
    habitat: "\u0110\u00e1y bi\u1ec3n, r\u1ea1n san h\u00f4 v\u00e0 v\u00f9ng ven b\u1edd.",
    diet: "M\u1ea3nh v\u1ee5n h\u1eefu c\u01a1, nhuy\u1ec5n th\u1ec3 nh\u1ecf ho\u1eb7c sinh v\u1eadt b\u00e1m \u0111\u00e1y."
  },
  Fish: {
    habitat: "S\u00f4ng, h\u1ed3, bi\u1ec3n, r\u1ea1n san h\u00f4 ho\u1eb7c v\u00f9ng n\u01b0\u1edbc ng\u1ecdt t\u00f9y lo\u00e0i.",
    diet: "Sinh v\u1eadt ph\u00f9 du, t\u1ea3o, c\u00f4n tr\u00f9ng n\u01b0\u1edbc, c\u00e1 nh\u1ecf ho\u1eb7c gi\u00e1p x\u00e1c."
  },
  Insect: {
    habitat: "V\u01b0\u1eddn, r\u1eebng, \u0111\u1ed3ng c\u1ecf, khu d\u00e2n c\u01b0 ho\u1eb7c n\u01a1i c\u00f3 th\u1ef1c v\u1eadt.",
    diet: "M\u1eadt hoa, l\u00e1 c\u00e2y, ph\u1ea5n hoa, m\u1ea3nh h\u1eefu c\u01a1 ho\u1eb7c c\u00f4n tr\u00f9ng nh\u1ecf t\u00f9y lo\u00e0i."
  },
  Mammal: {
    habitat: "R\u1eebng, \u0111\u1ed3ng c\u1ecf, n\u00fai, n\u00f4ng tr\u1ea1i, \u0111\u00f4 th\u1ecb ho\u1eb7c v\u00f9ng hoang d\u00e3 t\u00f9y lo\u00e0i.",
    diet: "Th\u1ef1c v\u1eadt, qu\u1ea3, h\u1ea1t, c\u00f4n tr\u00f9ng, c\u00e1 ho\u1eb7c th\u1ecbt t\u00f9y lo\u00e0i."
  },
  Mollusk: {
    habitat: "Bi\u1ec3n, v\u00f9ng tri\u1ec1u, r\u1ea1n \u0111\u00e1, c\u00e1t ho\u1eb7c \u0111\u00e1y n\u01b0\u1edbc.",
    diet: "T\u1ea3o, sinh v\u1eadt ph\u00f9 du, m\u1ea3nh v\u1ee5n h\u1eefu c\u01a1 ho\u1eb7c con m\u1ed3i nh\u1ecf."
  },
  Reptile: {
    habitat: "R\u1eebng, \u0111\u1ed3ng c\u1ecf, sa m\u1ea1c, v\u00f9ng ng\u1eadp n\u01b0\u1edbc ho\u1eb7c ven n\u01b0\u1edbc.",
    diet: "C\u00f4n tr\u00f9ng, c\u00e1, \u0111\u1ed9ng v\u1eadt nh\u1ecf, tr\u1ee9ng ho\u1eb7c th\u1ef1c v\u1eadt t\u00f9y lo\u00e0i."
  }
};

export function localizeSpeciesInfo(species: SpeciesInfo, language: Language): SpeciesInfo {
  if (language !== "vi") {
    return species;
  }

  const displayName = SPECIES_NAMES_VI[species.class_name] ?? species.display_name;
  const animalGroup = GROUP_VI[species.animal_group] ?? species.animal_group;
  const dangerLevel = DANGER_VI[species.danger_level] ?? species.danger_level;
  const groupDetails = GROUP_DETAILS_VI[species.animal_group] ?? {
    habitat: "M\u00f4i tr\u01b0\u1eddng s\u1ed1ng thay \u0111\u1ed5i theo lo\u00e0i v\u00e0 khu v\u1ef1c.",
    diet: "Th\u1ee9c \u0103n thay \u0111\u1ed5i theo lo\u00e0i v\u00e0 m\u00f4i tr\u01b0\u1eddng s\u1ed1ng."
  };

  return {
    ...species,
    display_name: displayName,
    description: `${displayName} thu\u1ed9c nh\u00f3m ${animalGroup.toLowerCase()}. Th\u00f4ng tin n\u00e0y \u0111\u01b0\u1ee3c hi\u1ec3n th\u1ecb theo ch\u1ebf \u0111\u1ed9 ti\u1ebfng Vi\u1ec7t c\u1ee7a AnimalDex.`,
    habitat: groupDetails.habitat,
    diet: groupDetails.diet,
    animal_group: animalGroup,
    danger_level: dangerLevel,
    fun_fact: `${displayName} c\u00f3 \u0111\u1eb7c \u0111i\u1ec3m sinh h\u1ecdc v\u00e0 h\u00e0nh vi ri\u00eang, gi\u00fap ph\u00e2n bi\u1ec7t v\u1edbi c\u00e1c lo\u00e0i kh\u00e1c trong AnimalDex.`
  };
}

export function localizeSpeciesDisplayName(className: string, fallback: string, language: Language) {
  if (language !== "vi") {
    return fallback;
  }

  return SPECIES_NAMES_VI[className] ?? fallback;
}
