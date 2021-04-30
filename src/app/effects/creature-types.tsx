export enum CreatureType {
    aberration = "Aberration",
    animal = "Animal",
    construct = "Construct",
    dragon = "Dragon",
    elemental = "Elemental",
    fey = "Fey",
    giant = "Giant",
    humanoid = "Humanoid",
    magicalBeast = "Magical Beast",
    monstrousHumanoid = "Monstrous Humanoid",
    ooze = "Ooze",
    outsider = "Outsider",
    plant = "Plant",
    undead = "Undead",
    vermin = "Vermin",
}

export const creatureTypes = [
    CreatureType.aberration,
    CreatureType.animal,
    CreatureType.construct,
    CreatureType.dragon,
    CreatureType.elemental,
    CreatureType.fey,
    CreatureType.giant,
    CreatureType.humanoid,
    CreatureType.magicalBeast,
    CreatureType.monstrousHumanoid,
    CreatureType.ooze,
    CreatureType.outsider,
    CreatureType.plant,
    CreatureType.undead,
    CreatureType.vermin,
];

export enum CreatureSubtype {
    air = "Air",
    angel = "Angel",
    aquatic = "Aquatic",
    archon = "Archon",
    augmented = "Augmented",
    chaotic = "Chaotic",
    cold = "Cold",
    demon = "Demon",
    devil = "Devil",
    earth = "Earth",
    evil = "Evil",
    extraplanar = "Extraplanar",
    fire = "Fire",
    good = "Good",
    incorporeal = "Incorporeal",
    lawful = "Lawful",
    native = "Native",
    psionic = "Psionic",
    shapechanger = "Shapechanger",
    swarm = "Swarm",
    water = "Water",
}

export const creatureSubtypes = [
    CreatureSubtype.air,
    CreatureSubtype.angel,
    CreatureSubtype.aquatic,
    CreatureSubtype.archon,
    CreatureSubtype.augmented,
    CreatureSubtype.chaotic,
    CreatureSubtype.cold,
    CreatureSubtype.demon,
    CreatureSubtype.devil,
    CreatureSubtype.earth,
    CreatureSubtype.evil,
    CreatureSubtype.extraplanar,
    CreatureSubtype.fire,
    CreatureSubtype.good,
    CreatureSubtype.incorporeal,
    CreatureSubtype.lawful,
    CreatureSubtype.native,
    CreatureSubtype.psionic,
    CreatureSubtype.shapechanger,
    CreatureSubtype.swarm,
    CreatureSubtype.water,
];

export interface SetCreatureType {
    active: boolean,
    creatureType: CreatureType | string
}

export function isSetCreatureType(effect: any): effect is SetCreatureType {
    return (effect as SetCreatureType).creatureType !== undefined;
}

export enum SetCreatureSubtypeEffectType {
    add = "Add",
    remove = "Remove"
}

export interface SetCreatureSubtype {
    active: boolean,
    creatureSubtype: string,
    effectType: SetCreatureSubtypeEffectType
}

export function isSetCreatureSubtype(effect: any): effect is SetCreatureSubtype {
    return (effect as SetCreatureSubtype).creatureSubtype !== undefined && (effect as SetCreatureSubtype).effectType !== undefined;
}