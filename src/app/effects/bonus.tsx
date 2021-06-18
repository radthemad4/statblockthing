import { evaluate } from 'mathjs';
import React from 'react';
import { numberPicker } from '../styles';

export enum BonusType {
    untyped = 'Untyped',
    baseAbilityScore = 'Base Ability Score',

    abilityModifier = 'Ability Modifier',
    alchemical = 'Alchemical',
    armor = 'Armor',
    circumstance = 'Circumstance',
    competence = 'Competence',
    deflection = 'Deflection',
    dodge = 'Dodge',
    enhancement = 'Enhancement',
    insight = 'Insight',
    luck = 'Luck',
    morale = 'Morale',
    profane = 'Profane',
    racial = 'Racial',
    resistance = 'Resistance',
    sacred = 'Sacred',
    shield = 'Shield',
    size = 'Size',

    naturalArmor = 'Natural Armor',
    stacksWithNaturalArmor = 'Stacks with Natural Armor'
}

export interface Bonus {
    amount: number | string,
    type: BonusType | string
};

export function addBonuses(bonusArray: Bonus[], scope?: { [key: string]: number }, bonusTypesToInclude: Set<BonusType|string> = new Set(bonusTypes)): number {
    let output = 0;
    
    let bonusMap: Map<string, number[]>;

    bonusMap = bonusArray.reduce((prev: Map<string, number[]>, element: Bonus) => {
        let output: number;
        if (typeof element.amount === 'number') {
            output = element.amount;
        } else {
            try {
                output = evaluate(element.amount, scope);
            } catch (error) {
                output = null;
            }
        }

        if(bonusTypesToInclude.has(element.type)) {
            if (prev.has(element.type)) {
                prev.get(element.type).push(output);
            } else {
                prev.set(element.type, [output]);
            }
        }

        return prev;
    }, new Map<string, number[]>());

    for (let [type, numbers] of bonusMap) {
        if (stackingBonuses.has(type as BonusType)) {
            output += numbers.reduce((previousValue, currentNumber) => {
                if (currentNumber == null) {
                    return null;
                }
                return previousValue + currentNumber;
            }, 0);
        } else {
            let lowestPenalty = Infinity;
            let highestBonus = -Infinity;

            for (let number of numbers) {
                if (number == null) {
                    return null;
                }
                else if (number >= 0) {
                    highestBonus = Math.max(highestBonus, number);
                } else {
                    lowestPenalty = Math.min(lowestPenalty, number);
                }
            }

            if (lowestPenalty != Infinity) {
                output += lowestPenalty;
            }

            if (highestBonus != -Infinity) {
                output += highestBonus;
            }

        }
    }

    return output;
}

export const bonusTypes = [
    BonusType.untyped,
    BonusType.baseAbilityScore,

    BonusType.abilityModifier,
    BonusType.alchemical,
    BonusType.armor,
    BonusType.circumstance,
    BonusType.competence,
    BonusType.deflection,
    BonusType.dodge,
    BonusType.enhancement,
    BonusType.insight,
    BonusType.luck,
    BonusType.morale,
    BonusType.profane,
    BonusType.racial,
    BonusType.resistance,
    BonusType.sacred,
    BonusType.shield,
    BonusType.size,

    BonusType.naturalArmor,
    BonusType.stacksWithNaturalArmor,
];

export const stackingBonuses = new Set<BonusType>([
    BonusType.untyped,
    BonusType.circumstance,
    BonusType.dodge,
    BonusType.racial,
    BonusType.stacksWithNaturalArmor,
]);

interface EffectBonusSpanProps {
    effect: { bonus: Bonus, active: boolean },
    effectIndex: number,
    modifierIndex: number,
    handleBonusAmountChange: (newBonusAmount: number | string) => void,
    handleBonusTypeChange: (newBonusType: string) => void,
}

export const EffectBonusSpan: React.FC<EffectBonusSpanProps> = (props) => {

    const modifierIndex = props.modifierIndex;
    const effectIndex = props.effectIndex;
    const effect = props.effect;

    const bonus = props.effect.bonus;

    return <span>
        <select
            value={typeof bonus.amount === 'number' && isNaN(bonus.amount) ? '—' : typeof bonus.amount === 'string' ? 'fn' : '#'}
            onChange={(event) => {
                let oldVal: number | string = bonus.amount;
                let newVal: number | string;
                switch (event.target.value) {
                    case '—':
                        newVal = NaN;
                        break;
                    case '#':
                        newVal = 0;
                        if (typeof (oldVal) === 'string') {
                            try {
                                newVal = evaluate(oldVal);
                            } catch (error) { }
                        }
                        break;
                    case 'fn':
                        newVal = '0'
                        if (typeof (oldVal) === 'number') {
                            newVal = `${oldVal}`
                        }

                        break;
                }

                props.handleBonusAmountChange(newVal);

            }}
        >
            <option value="#">#</option>
            <option value='fn'>fn</option>
            <option value="—">—</option>
        </select>

        {typeof bonus.amount === 'number' && isNaN(bonus.amount) ? '' : <span>
            <input
                value={bonus.amount}
                type={typeof bonus.amount === 'number' ? 'number' : 'text'}
                className={typeof bonus.amount === 'number' ? numberPicker : ''}
                onChange={(event) => {
                    event.persist();

                    props.handleBonusAmountChange(typeof bonus.amount === 'number' ? parseInt(event.target.value) : event.target.value);
                }}
            />

            <input
                type="text"
                list="bonusTypesList"
                value={bonus.type}
                onChange={(event) => {
                    event.persist();

                    props.handleBonusTypeChange((event.target.value as BonusType) ? event.target.value as BonusType : event.target.value);
                }}
            />

            <datalist id="bonusTypesList">
                {bonusTypes.map((bonusType, index) => <option key={index}>{bonusType}</option>)}
            </datalist>
        </span>}
    </span>
};