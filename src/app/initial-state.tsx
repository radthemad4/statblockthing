import { AppState } from './app';
import { Bonus, BonusType, bonusTypes } from './effects/bonus';
import { CreatureStat } from './effects/creature-stats';
import { CreatureType } from './effects/creature-types';
import { BABProgression, HPFromHDCalculation, SaveProgression } from './progressions';

export const initialState: AppState = {
    modifiers: [
        {
            name: 'Base Ability Scores',
            active: true,
            showEffects: false,
            effects: [
                ...[CreatureStat.str, CreatureStat.dex, CreatureStat.con, CreatureStat.int, CreatureStat.wis, CreatureStat.cha].map((creatureStat) => {
                    return {
                        stat: creatureStat,
                        bonus: {
                            amount: 8,
                            type: BonusType.baseAbilityScore
                        },
                        active: true
                    }
                }),
            ],
        },
        {
            name: 'Human',
            active: true,
            showEffects: false,
            effects: [
                {
                    active: true,
                    creatureType: CreatureType.humanoid
                },
                {
                    stat: CreatureStat.size,
                    bonus: {
                        amount: 0,
                        type: BonusType.racial
                    },
                    active: true
                },
                {
                    stat: CreatureStat.landSpeed,
                    bonus: {
                        amount: 30,
                        type: BonusType.racial
                    },
                    active: true
                },
            ]
        },
        {
            name: 'Commoner',
            active: true,
            showEffects: true,
            effects: [
                {
                    active: true,
                    hitDice: {
                        numberOfHitDice: 1,
                        hitDiceSize: 4,
                        hpFromHD: HPFromHDCalculation.Average,
                        babFromHD: BABProgression.Poor,
                        fortFromHD: SaveProgression.Poor,
                        refFromHD: SaveProgression.Poor,
                        willFromHD: SaveProgression.Poor,
                    },
                }
            ],
        },
        {
            name: 'Enlarge Person',
            active: true,
            showEffects: false,
            effects: [
                {
                    stat: CreatureStat.size,
                    bonus: {
                        amount: 1,
                        type: BonusType.size
                    },
                    active: true
                },
                {
                    stat: CreatureStat.str,
                    bonus: {
                        amount: 2,
                        type: BonusType.size
                    },
                    active: true
                },
                {
                    stat: CreatureStat.dex,
                    bonus: {
                        amount: -2,
                        type: BonusType.size
                    },
                    active: true
                },
            ],
        },
        {
            name: "Bull's Strength",
            active: true,
            showEffects: false,
            effects: [
                {
                    stat: CreatureStat.str,
                    bonus: {
                        amount: 4,
                        type: BonusType.enhancement
                    },
                    active: true
                }
            ],
        },
        {
            name: "Cat's Grace",
            active: true,
            showEffects: false,
            effects: [
                {
                    stat: CreatureStat.dex,
                    bonus: {
                        amount: 4,
                        type: BonusType.enhancement
                    },
                    active: true
                }
            ],
        },
        {
            name: "Aberrate",
            active: true,
            showEffects: false,
            effects: [
                {
                    active: true,
                    creatureType: CreatureType.aberration
                }
            ],
        },
        {
            name: "Mage Armor",
            active: true,
            showEffects: false,
            effects: [
                {
                    active: true,
                    stat: CreatureStat.armorClass,
                    bonus: {
                        amount: 4,
                        type: BonusType.armor
                    },
                },
            ],
        },
        {
            name: "Ring of Deflection",
            active: true,
            showEffects: false,
            effects: [
                {
                    active: true,
                    stat: CreatureStat.armorClass,
                    bonus: {
                        amount: 2,
                        type: BonusType.deflection
                    },
                },
            ],
        },
        {
            name: 'Basics',
            active: true,
            showEffects: false,
            effects: [
                {
                    stat: CreatureStat.hp,
                    bonus: {
                        amount: 'floor(hpFromHD + level * conMod)',
                        type: BonusType.untyped
                    },
                    active: true
                },
                {
                    stat: CreatureStat.bab,
                    bonus: {
                        amount: 'floor(babFromHD)',
                        type: BonusType.untyped
                    },
                    active: true
                },
                {
                    stat: CreatureStat.fort,
                    bonus: {
                        amount: 'floor(fortFromHD + conMod)',
                        type: BonusType.untyped
                    },
                    active: true
                },
                {
                    stat: CreatureStat.ref,
                    bonus: {
                        amount: 'floor(refFromHD + dexMod)',
                        type: BonusType.untyped
                    },
                    active: true
                },
                {
                    stat: CreatureStat.will,
                    bonus: {
                        amount: 'floor(willFromHD + wisMod)',
                        type: BonusType.untyped
                    },
                    active: true
                },
                {
                    stat: CreatureStat.grapple,
                    bonus: {
                        amount: 'bab + size * 4 + strMod',
                        type: BonusType.untyped
                    },
                    active: true
                },
                {
                    stat: CreatureStat.initiative,
                    bonus: {
                        amount: 'dexMod',
                        type: BonusType.untyped
                    },
                    active: true
                },
                {
                    stat: CreatureStat.armorClass,
                    bonus: {
                        amount: '10 + sizeMod',
                        type: BonusType.untyped
                    },
                    active: true
                },
                {
                    stat: CreatureStat.armorClass,
                    bonus: {
                        amount: 'dexMod',
                        type: BonusType.dodge
                    },
                    active: true
                },
                {
                    stat: CreatureStat.baseMeleeAttack,
                    bonus: {
                        amount: 'bab + strMod + sizeMod',
                        type: BonusType.untyped
                    },
                    active: true
                },
                {
                    stat: CreatureStat.baseRangedAttack,
                    bonus: {
                        amount: 'bab + dexMod + sizeMod',
                        type: BonusType.untyped
                    },
                    active: true
                },
            ],
        },

    ],
    showStatModal: false,
    showTypesModal: false,
    showArmorClassModal: false,

    touchACBonusTypes: new Set<BonusType>([BonusType.untyped, BonusType.deflection, BonusType.dodge]),
    flatfootedACBonusTypes: new Set<BonusType>(bonusTypes.filter(bonusType => ![BonusType.dodge].includes(bonusType))),
};