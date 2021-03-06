import React, { ChangeEvent } from 'react';
import { CreatureModifier } from '../app';
import { BABProgression, babProgressions, HPFromHDCalculation, SaveProgression } from '../progressions';
import { numberPicker, transparentButton } from '../styles';
import { BonusType, EffectBonusSpan } from './bonus';
import { CreatureStat, creatureStats, EffectStatSelect, isModifyCreatureStat, ModifyCreatureStat } from "./creature-stats";
import { SetCreatureType, SetCreatureSubtype, isSetCreatureType, SetCreatureSubtypeEffectType, CreatureType, creatureTypes, isSetCreatureSubtype, CreatureSubtype, creatureSubtypes } from './creature-types';

export enum HitDiceBasedBonusType {
    bab = "babFromHD",
    ref = "refFromHD",
    fort = "fortFromHD",
    will = "willFromHD",
    level = 'level',
    hp = 'hpFromHD',
}

export interface AddHitDice {
    active: boolean,
    hitDice: {
        numberOfHitDice: number,
        hitDiceSize: number,
        hpFromHD: string,
        babFromHD: string,
        fortFromHD: string,
        refFromHD: string,
        willFromHD: string,
    },
}

export const hitDiceBasedBonusTypes = [
    HitDiceBasedBonusType.bab,
    HitDiceBasedBonusType.ref,
    HitDiceBasedBonusType.fort,
    HitDiceBasedBonusType.will,
    HitDiceBasedBonusType.level,
    HitDiceBasedBonusType.hp,
];

export function isAddHitDice(effect: any): effect is AddHitDice {
    return (effect as AddHitDice).hitDice !== undefined;
}

export type Effect = ModifyCreatureStat | SetCreatureType | SetCreatureSubtype | AddHitDice;

export enum EffectType {
    modifyStat = "Modify Stat",
    setCreatureType = "Set Creature Type",
    setCreatureSubtype = "Set Creature Subtype",
    addHitDice = "Add Hit Dice",
}

export const effectTypes = [
    EffectType.modifyStat,
    EffectType.setCreatureType,
    EffectType.setCreatureSubtype,
    EffectType.addHitDice,
];

export enum HitDiceModifierPropField {
    levels,
    hitDieSize,
    hp,
    bab,
    fort,
    ref,
    will
}

export interface HitDiceModifierProps {
    effect: AddHitDice,
    effectIndex: number,
    modifierIndex: number,
    modifiers: CreatureModifier[],
    handleChangeModifiers: (newModifiers: CreatureModifier[]) => void,
    fieldsToShow: HitDiceModifierPropField[],
}

export const HitDiceModifierDiv: React.FC<HitDiceModifierProps> = (props) => {

    const modifierIndex = props.modifierIndex;
    const effectIndex = props.effectIndex;
    const effect = props.effect;

    return <div style={{ paddingLeft: '2px' }}>
        {!props.fieldsToShow.includes(HitDiceModifierPropField.levels) ? '' : <div>
            Levels: <input
                className={numberPicker}
                type='number'
                value={effect.hitDice.numberOfHitDice}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    event.persist();

                    const replacementEffect = { ...effect, hitDice: { ...effect.hitDice, numberOfHitDice: parseInt(event.target.value) } };

                    props.handleChangeModifiers(props.modifiers.map((modifier, i) => (i !== modifierIndex ? modifier : {
                        ...modifier,
                        effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                            effectIndex1 !== effectIndex ? effect : replacementEffect
                        )
                    })));
                }}
            />
        </div>}

        {!props.fieldsToShow.includes(HitDiceModifierPropField.hitDieSize) ? '' : <div>
            Hit Die Size: <input
                className={numberPicker}
                type='number'
                value={effect.hitDice.hitDiceSize}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    event.persist();

                    const replacementEffect = { ...effect, hitDice: { ...effect.hitDice, hitDiceSize: parseInt(event.target.value) } };

                    props.handleChangeModifiers(props.modifiers.map((modifier, i) => (i !== modifierIndex ? modifier : {
                        ...modifier,
                        effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                            effectIndex1 !== effectIndex ? effect : replacementEffect
                        )
                    })));
                }}
            />
        </div>}

        {(() => {

            const hpTuples: [string, string][] = [
                [HPFromHDCalculation.Average, 'Average'],
                [HPFromHDCalculation.AverageMaxFirst, 'Average, Max First'],
                [HPFromHDCalculation.Max, 'Max'],
            ];

            const hpButtonSpan = <span>
                {hpTuples.map((tuple) => {

                    const [progression, label] = tuple;

                    return <button
                        key={progression}
                        onClick={() => {
                            const replacementEffect = { ...effect, hitDice: { ...effect.hitDice, [HitDiceBasedBonusType.hp]: progression } };
                            props.handleChangeModifiers(props.modifiers.map((modifier, i) => (i !== modifierIndex ? modifier : {
                                ...modifier,
                                effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                                    effectIndex1 !== effectIndex ? effect : replacementEffect
                                )
                            })));
                        }}
                    >{label}</button>;
                })}
            </span>

            const babTuples: [string, string][] = [
                [BABProgression.None, 'None'],
                [BABProgression.Poor, 'Poor'],
                [BABProgression.Average, 'Average'],
                [BABProgression.Good, 'Good'],
            ];

            const babButtonSpan = <span>
                {babTuples.map((tuple) => {

                    const [progression, label] = tuple;

                    return <button
                        key={progression}
                        onClick={() => {
                            const replacementEffect = { ...effect, hitDice: { ...effect.hitDice, [HitDiceBasedBonusType.bab]: progression } };
                            props.handleChangeModifiers(props.modifiers.map((modifier, i) => (i !== modifierIndex ? modifier : {
                                ...modifier,
                                effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                                    effectIndex1 !== effectIndex ? effect : replacementEffect
                                )
                            })));
                        }}
                    >{label}</button>;
                })}
            </span>

            const saveTuples: [string, string][] = [
                [SaveProgression.None, 'None'],
                [SaveProgression.Poor, 'Poor'],
                [SaveProgression.Good, 'Good'],
            ];

            const [fortButtonSpan, refButtonSpan, willButtonSpan] = [
                HitDiceBasedBonusType.fort,
                HitDiceBasedBonusType.ref,
                HitDiceBasedBonusType.will,
            ].map((saveType) => {
                {
                    return <span>
                        {saveTuples.map((tuple) => {

                            const [progression, label] = tuple;

                            return <button
                                key={progression}
                                onClick={() => {
                                    const replacementEffect = { ...effect, hitDice: { ...effect.hitDice, [saveType]: progression } };
                                    props.handleChangeModifiers(props.modifiers.map((modifier, i) => (i !== modifierIndex ? modifier : {
                                        ...modifier,
                                        effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                                            effectIndex1 !== effectIndex ? effect : replacementEffect
                                        )
                                    })));
                                }}
                            >{label}</button>;
                        })}
                    </span>
                }
            });

            const tuples: [string, string, JSX.Element, HitDiceModifierPropField][] = [
                [HitDiceBasedBonusType.hp, 'HP', hpButtonSpan, HitDiceModifierPropField.hp],
                [HitDiceBasedBonusType.bab, 'BAB', babButtonSpan, HitDiceModifierPropField.bab],
                [HitDiceBasedBonusType.fort, 'Fort', fortButtonSpan, HitDiceModifierPropField.fort],
                [HitDiceBasedBonusType.ref, 'Ref', refButtonSpan, HitDiceModifierPropField.ref],
                [HitDiceBasedBonusType.will, 'Will', willButtonSpan, HitDiceModifierPropField.will],
            ];

            return tuples.map(([hdBasedBonusType, label, buttonSpan, hdModPropField]) => {

                return !props.fieldsToShow.includes(hdModPropField) ? <span key={hdBasedBonusType}></span> : (
                    <div key={hdBasedBonusType}>
                        {label}: <input
                            value={effect.hitDice[hdBasedBonusType]}
                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                event.persist();

                                const replacementEffect = { ...effect, hitDice: { ...effect.hitDice, [hdBasedBonusType]: event.target.value } };

                                props.handleChangeModifiers(props.modifiers.map((modifier, i) => (i !== modifierIndex ? modifier : {
                                    ...modifier,
                                    effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                                        effectIndex1 !== effectIndex ? effect : replacementEffect
                                    )
                                })));
                            }} />
                        {buttonSpan}
                    </div>
                )
            });
        })()}
    </div>;
}

export interface EffectModifierProps {
    effect: Effect,
    effectIndex: number,
    modifierIndex: number,
    modifiers: CreatureModifier[],
    handleChangeModifiers: (newModifiers: CreatureModifier[]) => void,
    handleBonusAmountChange: (newBonusAmount: number | string) => void,
    handleBonusTypeChange: (newBonusType: string) => void,
};

export const EffectModifierDiv: React.FC<EffectModifierProps> = (props) => {

    const modifierIndex = props.modifierIndex;
    const effectIndex = props.effectIndex;
    const effect = props.effect;

    const effectType = isModifyCreatureStat(effect) ? EffectType.modifyStat :
        isSetCreatureType(effect) ? EffectType.setCreatureType :
            isSetCreatureSubtype(effect) ? EffectType.setCreatureSubtype :
                EffectType.addHitDice;

    return <div key={effectIndex}
        style={{ opacity: (effect.active) ? 1 : 0.5 }}
    >
        <div style={{ display: 'flex' }}>
            <div>
                <select value={effectType} onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                    event.persist();

                    let replacementEffectType = (event.target.value as EffectType) ? event.target.value as EffectType : event.target.value;
                    let replacementEffect: Effect;

                    switch (replacementEffectType) {
                        case EffectType.modifyStat:
                            replacementEffect = {
                                active: effect.active,
                                stat: creatureStats[0],
                                bonus: {
                                    amount: 0,
                                    type: BonusType.untyped
                                }
                            };
                            break;
                        case EffectType.setCreatureType:
                            replacementEffect = {
                                active: effect.active,
                                creatureType: ''
                            };
                            break;
                        case EffectType.setCreatureSubtype:
                            replacementEffect = {
                                active: effect.active,
                                creatureSubtype: '',
                                effectType: SetCreatureSubtypeEffectType.add
                            };
                            break;
                        case EffectType.addHitDice:
                            replacementEffect = {
                                active: effect.active,
                                hitDice: {
                                    numberOfHitDice: 1,
                                    hitDiceSize: 4,
                                    hpFromHD: HPFromHDCalculation.Average,
                                    babFromHD: BABProgression.Poor,
                                    fortFromHD: SaveProgression.Poor,
                                    refFromHD: SaveProgression.Poor,
                                    willFromHD: SaveProgression.Poor,
                                },
                            };
                            break;
                    }

                    props.handleChangeModifiers(props.modifiers.map((modifier, i) => (i !== modifierIndex ? modifier : {
                        ...modifier,
                        effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                            effectIndex1 !== effectIndex ? effect : replacementEffect
                        )
                    })));
                }}>
                    {effectTypes.map((effectType, index) => <option key={index}>{effectType}</option>)}
                </select>
            </div>

            <div>
                {
                    isModifyCreatureStat(effect) ? <span>
                        <EffectStatSelect
                            effect={effect}
                            effectIndex={effectIndex}
                            modifierIndex={modifierIndex}
                            handleChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                event.persist();
                                props.handleChangeModifiers(props.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                                    ...element,
                                    effects: props.modifiers[i].effects.map((effect, effectIndex1) => effectIndex1 !== effectIndex ? effect : {
                                        ...effect, stat: creatureStats[event.target.selectedIndex]
                                    })
                                })));
                            }} />
                        <EffectBonusSpan
                            effect={effect}
                            effectIndex={effectIndex}
                            modifierIndex={modifierIndex}
                            handleBonusAmountChange={props.handleBonusAmountChange}
                            handleBonusTypeChange={props.handleBonusTypeChange}
                        />
                    </span> : ''
                }

                {
                    isSetCreatureType(effect) ? <span>
                        <input
                            type="text"
                            list="creatureTypesList"
                            value={effect.creatureType}
                            onChange={(event) => {
                                event.persist();
                                props.handleChangeModifiers(props.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                                    ...element,
                                    effects: props.modifiers[i].effects.map((effect, effectIndex1) => effectIndex1 !== effectIndex ? effect : {
                                        ...effect, creatureType: event.target.value
                                    })
                                })));
                            }}
                        />

                        <datalist id="creatureTypesList">
                            {creatureTypes.map((creatureType, index) => <option key={index}>{creatureType}</option>)}
                        </datalist>
                    </span> : ''
                }

                {
                    isSetCreatureSubtype(effect) ? <span>
                        <select
                            value={effect.effectType === SetCreatureSubtypeEffectType.add ? "Add Subtype" : "Remove Subtype"}
                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                event.persist();

                                props.handleChangeModifiers(
                                    props.modifiers.map((modifier, i) => (i !== modifierIndex ? modifier : {
                                        ...modifier,
                                        effects: props.modifiers[i].effects.map((effect, effectIndex1) => effectIndex1 !== effectIndex ? effect : {
                                            ...effect,
                                            effectType: event.target.selectedIndex === 0 ? SetCreatureSubtypeEffectType.add : SetCreatureSubtypeEffectType.remove
                                        })
                                    })),
                                );
                            }}>
                            <option>Add Subtype</option>
                            <option>Remove Subtype</option>
                        </select>

                        <input
                            type="text"
                            list="creatureSubtypesList"
                            value={effect.creatureSubtype}
                            onChange={(event) => {
                                event.persist();
                                props.handleChangeModifiers(props.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                                    ...element,
                                    effects: props.modifiers[i].effects.map((effect, effectIndex1) => effectIndex1 !== effectIndex ? effect : {
                                        ...effect, creatureSubtype: event.target.value
                                    })
                                })));
                            }}
                        />

                        <datalist id="creatureSubtypesList">
                            {creatureSubtypes.map((creatureSubtype, index) => <option key={index}>{creatureSubtype}</option>)}
                        </datalist>
                    </span> : ''
                }

                {
                    isAddHitDice(effect) ? <HitDiceModifierDiv
                        effect={effect}
                        effectIndex={effectIndex}
                        modifierIndex={modifierIndex}
                        modifiers={props.modifiers}
                        handleChangeModifiers={props.handleChangeModifiers}
                        fieldsToShow={[
                            HitDiceModifierPropField.levels,
                            HitDiceModifierPropField.hitDieSize,
                            HitDiceModifierPropField.hp,
                            HitDiceModifierPropField.bab,
                            HitDiceModifierPropField.fort,
                            HitDiceModifierPropField.ref,
                            HitDiceModifierPropField.will,
                        ]}
                    /> : ''
                }
            </div>

            <div>
                <input type='checkbox' checked={effect.active} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    props.handleChangeModifiers(props.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                        ...element,
                        effects: props.modifiers[i].effects.map((effect, effectIndex1) => effectIndex1 !== effectIndex ? effect : { ...effect, active: !effect.active })
                    })));
                }}></input>

                <button className={transparentButton} onClick={() => {
                    const choice = confirm('Are you sure you want to delete that?');;
                    if (choice === false) {
                        return;
                    }
                    props.handleChangeModifiers(props.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                        ...element,
                        effects: [...props.modifiers[i].effects.slice(0, effectIndex), ...props.modifiers[i].effects.slice(effectIndex + 1, props.modifiers[i].effects.length)]
                    })));
                }}>???????</button>
            </div>



            <br />
        </div>

    </div >
};