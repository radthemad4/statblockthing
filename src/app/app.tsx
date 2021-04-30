import { evaluate } from "mathjs";
import React, { ChangeEvent } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactDOM from 'react-dom';
import { BonusType, Bonus, bonusTypes, addBonuses, EffectBonusSpan } from "./effects/bonus";
import { CreatureStat, creatureStatDisplayNames, creatureStats, EffectStatSelect, isModifyCreatureStat, ModifyCreatureStat } from "./effects/creature-stats";
import { CreatureType, isSetCreatureType, SetCreatureSubtypeEffectType, creatureTypes, isSetCreatureSubtype, CreatureSubtype, creatureSubtypes, SetCreatureType, SetCreatureSubtype } from "./effects/creature-types";
import { Effect, EffectModifierDiv, EffectType, effectTypes, HitDiceBasedBonusType, hitDiceBasedBonusTypes, isAddHitDice } from "./effects/effect";
import { initialState } from './initial-state';
import { Modal } from './modal';
import { StatModal } from './modals/stat-modal';
import { TypesModal } from './modals/types-modal';
import { sizeName } from "./progressions";
import { numberPicker, transparentButton, statblockLeft } from "./styles";

export interface CreatureModifier {
    name: string,
    active: boolean,
    showEffects: boolean,
    effects: Effect[]
};

export interface AppState {
    modifiers: CreatureModifier[],
    statModalStat?: CreatureStat,
    showStatModal: boolean,
    showTypesModal: boolean,
}

let creatureStatsMemo: { [key: string]: number }[][];

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = initialState;
        this.updateCreatureStatsMemo(this.state.modifiers);
    }

    handleChangeModifiers = (newModifiers: CreatureModifier[]) => {
        this.setState((state) => {
            this.updateCreatureStatsMemo(newModifiers);
            return {
                modifiers: newModifiers,
            };
        });
    }

    handleBonusAmountChange = (effectIndex: number, modifierIndex: number) => {
        return (newBonusAmount: number | string) => {
            this.setState((state) => {
                const modifiers = state.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                    ...element,
                    effects: state.modifiers[i].effects.map((effect, effectIndex1) =>
                        (effectIndex1 !== effectIndex) ? effect : { ...effect, bonus: { ...(effect as ModifyCreatureStat).bonus, amount: newBonusAmount } })
                }));
                this.updateCreatureStatsMemo(modifiers);
                return {
                    modifiers,
                };
            });
        };
    };

    updateCreatureStatsMemo(modifiers: CreatureModifier[]) {

        creatureStatsMemo = [];

        let statToBonusMap: { [key: string]: Bonus[] } = {};
        let hitDiceBasedNumbersMap: { [key: string]: number } = {};

        for (const stat of creatureStats) {
            statToBonusMap[stat] = [];
        }

        for (const hdBasedBonusType of hitDiceBasedBonusTypes) {
            hitDiceBasedNumbersMap[hdBasedBonusType] = 0;
        }

        let lastCreatureStatsMemoEntry = {};

        for (let modifierIndex = 0; modifierIndex < modifiers.length; modifierIndex++) {
            if (modifiers[modifierIndex].active == false) {
                continue;
            }
            creatureStatsMemo[modifierIndex] = [];

            for (let effectIndex = 0; effectIndex < modifiers[modifierIndex].effects.length; effectIndex++) {

                const effect = modifiers[modifierIndex].effects[effectIndex];

                if (effect.active == false) {
                    continue;
                }

                creatureStatsMemo[modifierIndex][effectIndex] = {};

                if (isAddHitDice(effect)) {
                    hitDiceBasedNumbersMap[HitDiceBasedBonusType.level] += effect.hitDice.numberOfHitDice;

                    for (const hitDiceBasedBonusType of hitDiceBasedBonusTypes) {
                        if (hitDiceBasedBonusType == HitDiceBasedBonusType.level) {
                            continue;
                        }

                        try {
                            hitDiceBasedNumbersMap[hitDiceBasedBonusType] += evaluate(
                                effect.hitDice[hitDiceBasedBonusType], { 'hdSize': effect.hitDice.hitDiceSize, 'hd': effect.hitDice.numberOfHitDice }
                            );
                            // console.log(`${hitDiceBasedBonusType}: ${hitDiceBasedNumbersMap[hitDiceBasedBonusType]}`);
                        } catch (error) {
                            hitDiceBasedNumbersMap[hitDiceBasedBonusType] = NaN;
                            // console.log(`${hitDiceBasedBonusType}`);
                        }
                    }
                }

                for (const hdBasedBonusType of hitDiceBasedBonusTypes) {
                    creatureStatsMemo[modifierIndex][effectIndex][hdBasedBonusType] = hitDiceBasedNumbersMap[hdBasedBonusType];
                }

                if (isModifyCreatureStat(effect)) {
                    if (!statToBonusMap.hasOwnProperty(effect.stat)) {
                        statToBonusMap[effect.stat] = [];
                    }
                    statToBonusMap[effect.stat].push(effect.bonus);

                    for (const key in statToBonusMap) {
                        let bonusTotal = addBonuses(statToBonusMap[key], lastCreatureStatsMemoEntry);
                        creatureStatsMemo[modifierIndex][effectIndex][key] = bonusTotal;
                    }
                } else {
                    for (const key in statToBonusMap) {
                        creatureStatsMemo[modifierIndex][effectIndex][key] = lastCreatureStatsMemoEntry[key];
                    }
                }

                for (const stat of [
                    (CreatureStat.str),
                    (CreatureStat.dex),
                    (CreatureStat.con),
                    (CreatureStat.int),
                    (CreatureStat.wis),
                    (CreatureStat.cha),
                ]) {
                    creatureStatsMemo[modifierIndex][effectIndex][`${stat.substr(0, 3)}Mod`] = Math.floor(0.5 * (creatureStatsMemo[modifierIndex][effectIndex][stat] - 10));
                }

                lastCreatureStatsMemoEntry = creatureStatsMemo[modifierIndex][effectIndex];

            }
        }

        console.log(creatureStatsMemo);
    }

    handleBonusTypeChange = (effectIndex: number, modifierIndex: number) => {
        return (newBonusType: string) => {
            this.setState((state) => ({
                modifiers: state.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                    ...element,
                    effects: state.modifiers[i].effects.map((effect, effectIndex1) => effectIndex1 !== effectIndex ? effect : {
                        ...effect, bonus: {
                            ...(effect as ModifyCreatureStat).bonus, type: newBonusType
                        }
                    })
                })),
            }));
        };
    }

    getCreatureStat(creatureStat: CreatureStat): number {
        return creatureStatsMemo[creatureStatsMemo.length - 1][creatureStatsMemo[creatureStatsMemo.length - 1].length - 1][creatureStat] ?? NaN;
    }

    getCreatureType(): string {
        let creatureTypeName = '';

        for (const modifier of this.state?.modifiers ?? []) {
            if (modifier.active) {
                for (const effect of modifier.effects) {
                    if (isSetCreatureType(effect) && effect.active) {
                        creatureTypeName = effect.creatureType;
                    }
                }
            }
        }

        return creatureTypeName;
    }

    getCreatureSubtypes(): string[] {
        let creatureSubtypesSet: Set<string> = new Set<string>();

        for (const modifier of this.state?.modifiers ?? []) {
            if (modifier.active) {
                for (const effect of modifier.effects) {
                    if (isSetCreatureSubtype(effect) && effect.active) {
                        if (effect.effectType === SetCreatureSubtypeEffectType.add) {
                            creatureSubtypesSet.add(effect.creatureSubtype);
                        } else {
                            creatureSubtypesSet.delete(effect.creatureSubtype);
                        }
                    }
                }
            }
        }

        return [...creatureSubtypesSet].sort();
    }

    getHitDiceBasedBonus(bonusType: HitDiceBasedBonusType): number {
        return creatureStatsMemo[creatureStatsMemo.length - 1][creatureStatsMemo[creatureStatsMemo.length - 1].length - 1][bonusType] ?? NaN;
    }

    getHitDiceString(): string {
        let hitDiceArray: number[] = [];
        let hitDiceMap = new Map<number, number>();

        for (const modifier of this.state.modifiers) {
            if (modifier.active) {
                for (const effect of modifier.effects) {
                    if (effect.active && isAddHitDice(effect)) {
                        if (hitDiceMap.has(effect.hitDice.hitDiceSize)) {
                            hitDiceMap.set(effect.hitDice.hitDiceSize, hitDiceMap.get(effect.hitDice.hitDiceSize) + effect.hitDice.numberOfHitDice);
                        } else {
                            hitDiceMap.set(effect.hitDice.hitDiceSize, effect.hitDice.numberOfHitDice);
                            hitDiceArray.push(effect.hitDice.hitDiceSize);
                        }
                    }
                }
            }
        }


        let hitDiceString = hitDiceArray.map((hd) => {
            return `${hitDiceMap.get(hd)}d${hd}`
        }).join('+');

        return hitDiceString;
    }

    render() {

        return <div>

            <StatModal
                show={this.state.showStatModal}
                stat={this.state.statModalStat}
                modifiers={this.state.modifiers}
                handleChangeModifiers={this.handleChangeModifiers}
                handleBonusAmountChange={this.handleBonusAmountChange}
                handleBonusTypeChange={this.handleBonusTypeChange}
                getStat={() => this.getCreatureStat(this.state.statModalStat)}
                handleDismissModal={() => {
                    this.setState({ showStatModal: false });
                }}
            />

            <TypesModal
                show={this.state.showTypesModal}
                modifiers={this.state.modifiers}
                handleChangeModifiers={(newModifiers) => {
                    this.setState((state) => {
                        return {
                            modifiers: newModifiers,
                        };
                    });
                }}
                getCreatureType={this.getCreatureType}
                getCreatureSubtypes={this.getCreatureSubtypes}
                handleDismissModal={() => {
                    this.setState({ showTypesModal: false });
                }}
            />

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'auto auto',
                alignItems: 'start',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'max-content max-content',
                    gap: '0 10px',
                }}>
                    <div className={statblockLeft}>Size/Type:</div>
                    <div>
                        <span style={{ cursor: 'pointer' }} onClick={() => {
                            this.setState({ showStatModal: true, statModalStat: CreatureStat.size });
                        }}>
                            {sizeName(this.getCreatureStat(CreatureStat.size))}
                        </span>
                        &nbsp;
                        <span style={{ cursor: 'pointer' }} onClick={() => {
                            this.setState({ showTypesModal: true });
                        }}>
                            {this.getCreatureType()}

                            {(() => {
                                let subtypes = this.getCreatureSubtypes();

                                if (subtypes.length > 0) {
                                    return ` (${subtypes.join(', ')})`;
                                }
                            })()}
                        </span>
                    </div>

                    <div className={statblockLeft}>Hit Dice:</div>
                    <div>
                        <span style={{ cursor: 'pointer' }} onClick={() => {
                            this.setState({ showStatModal: true, statModalStat: CreatureStat.hp });
                        }}>
                            {(() => {
                                const hp = this.getCreatureStat(CreatureStat.hp);

                                if (isNaN(hp)) {
                                    return '—';
                                }

                                const hpFromHD = this.getHitDiceBasedBonus(HitDiceBasedBonusType.hp);

                                const difference = hp - hpFromHD;

                                if (difference == 0) {
                                    return `${this.getHitDiceString()} (${this.getCreatureStat(CreatureStat.hp)} hp)`;
                                } else if (difference > 0) {
                                    return `${this.getHitDiceString()}+${difference} (${this.getCreatureStat(CreatureStat.hp)} hp)`;
                                } else {
                                    return `${this.getHitDiceString()}${difference} (${this.getCreatureStat(CreatureStat.hp)} hp)`;
                                }


                            })()}
                        </span>
                    </div>

                    <div className={statblockLeft}>Initiative:</div><div>To do</div>
                    <div className={statblockLeft}>Speed:</div><div>To do</div>
                    <div className={statblockLeft}>Armor Class:</div><div>To do</div>

                    <div className={statblockLeft}>Base Attack/Grapple:</div>
                    <div>
                        <span style={{ cursor: 'pointer' }} onClick={() => {
                            this.setState({ showStatModal: true, statModalStat: CreatureStat.bab });
                        }}>
                            {(() => {
                                let bab = this.getCreatureStat(CreatureStat.bab);
                                return isNaN(bab) ? '—' :
                                    bab > 0 ? `+${bab}` : bab;
                            })()}
                        </span>/To do
                    </div>

                    <div className={statblockLeft}>Attack:</div><div>To do</div>
                    <div className={statblockLeft}>Full Attack:</div><div>To do</div>
                    <div className={statblockLeft}>Space/Reach:</div><div>To do</div>
                    <div className={statblockLeft}>Special Attacks:</div><div>To do</div>
                    <div className={statblockLeft}>Special Qualities:</div><div>To do</div>
                    <div className={statblockLeft}>Saves:</div>{(() => {
                        return <div>
                            {[(CreatureStat.fort),
                            (CreatureStat.ref),
                            (CreatureStat.will),].map((stat, index) => {
                                return (<span
                                    key={index}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        this.setState({ showStatModal: true, statModalStat: stat });
                                    }}
                                >
                                    {creatureStatDisplayNames[stat]} {(() => {
                                        let creatureStat = this.getCreatureStat(stat);
                                        return isNaN(creatureStat) ? '—' :
                                            creatureStat > 0 ? `+${creatureStat}` : creatureStat;
                                    })()}{index == 2 ? '' : <span>,&nbsp;</span>}
                                </span>)
                            })}
                        </div>;
                    })()}

                    <div className={statblockLeft}>Abilities:</div>{(() => {
                        return <div>
                            {[(CreatureStat.str),
                            (CreatureStat.dex),
                            (CreatureStat.con),
                            (CreatureStat.int),
                            (CreatureStat.wis),
                            (CreatureStat.cha),].map((stat, index) => {
                                return (<span
                                    key={index}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => {
                                        this.setState({ showStatModal: true, statModalStat: stat });
                                    }}
                                >
                                    {creatureStatDisplayNames[stat].substring(0, 3)} {(() => {
                                        let creatureStat = this.getCreatureStat(stat);
                                        return isNaN(creatureStat) ? '—' : creatureStat;
                                    })()}{index == 5 ? '' : <span>,&nbsp;</span>}
                                </span>)
                            })}
                        </div>;
                    })()}

                    <div className={statblockLeft}>Skills:</div><div>To do</div>
                    <div className={statblockLeft}>Feats:</div><div>To do</div>
                    <div style={{ backgroundColor: 'black', height: '1px', gridColumn: '1 / span 2', marginTop: '5px', marginBottom: '2.5px' }}></div>
                    <div className={statblockLeft}>Environment:</div><div>To do</div>
                    <div className={statblockLeft}>Organization:</div><div>To do</div>
                    <div className={statblockLeft}>Challenge Rating:</div><div>To do</div>
                    <div className={statblockLeft}>Treasure:</div><div>To do</div>
                    <div className={statblockLeft}>Alignment:</div><div>To do</div>
                    <div className={statblockLeft}>Advancement:</div><div>To do</div>
                    <div className={statblockLeft}>Level Adjustment:</div><div>To do</div>

                </div>
                <div>
                    <DragDropContext
                        onDragEnd={(result, provided) => {

                            const { destination, source, draggableId, type } = result;

                            if (destination != null) {

                                if (type === 'modifier') {
                                    this.setState((state) => {

                                        let modifiers = [...state.modifiers];
                                        modifiers.splice(source.index, 1);
                                        modifiers.splice(destination.index, 0, state.modifiers[source.index]);

                                        return {
                                            modifiers: modifiers,
                                        };
                                    });
                                } else if (type === 'effect') {
                                    let sourceModifierIndex = +source.droppableId.replace('effectContainer', '');
                                    let destinationModifierIndex = +destination.droppableId.replace('effectContainer', '');

                                    let sourceEffectIndex = source.index;
                                    let destinationEffectIndex = destination.index;

                                    this.setState((state) => {

                                        let modifiers = [...state.modifiers];

                                        if (sourceModifierIndex === destinationModifierIndex) {
                                            let effects = [...modifiers[sourceModifierIndex].effects];
                                            effects.splice(sourceEffectIndex, 1);
                                            effects.splice(destinationEffectIndex, 0, state.modifiers[sourceModifierIndex].effects[sourceEffectIndex]);
                                            modifiers[sourceModifierIndex].effects = effects;
                                        } else {

                                            let effect = state.modifiers[sourceModifierIndex].effects[sourceEffectIndex];

                                            modifiers[sourceModifierIndex].effects.splice(sourceEffectIndex, 1);
                                            modifiers[destinationModifierIndex].effects.splice(destinationEffectIndex, 0, effect);
                                        }



                                        return {
                                            modifiers: modifiers,
                                        };
                                    })
                                }
                            }
                        }}
                    >
                        <Droppable
                            droppableId='modifierContainer'
                            direction='vertical'
                            type='modifier'
                        >
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    {this.state.modifiers.map(({ name, active, effects }, modifierIndex) =>
                                        <Draggable
                                            draggableId={`${modifierIndex}`}
                                            index={modifierIndex}
                                            key={modifierIndex}
                                            isDragDisabled={false}
                                        >
                                            {(provided) => (
                                                <div
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    ref={provided.innerRef}
                                                    style={{
                                                        paddingBottom: '15px',
                                                        opacity: active ? 1 : 0.5,
                                                        ...provided.draggableProps.style
                                                    }}
                                                    key={modifierIndex}
                                                >
                                                    <div>
                                                        <input value={name} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                            event.persist();
                                                            this.setState((state) => {

                                                                const modifiers = state.modifiers.map((element, i) => (
                                                                    (i !== modifierIndex) ? element : { ...element, name: event.target.value }
                                                                ));

                                                                this.updateCreatureStatsMemo(modifiers);

                                                                return {
                                                                    modifiers,
                                                                };
                                                            });
                                                            event.target.checked;
                                                        }}></input>
                                                        <button className={transparentButton} style={{ opacity: this.state.modifiers[modifierIndex].showEffects ? 1 : 0.2 }} onClick={() => {
                                                            this.setState((state) => ({
                                                                modifiers: state.modifiers.map((element, i) => (
                                                                    (i !== modifierIndex) ? element : { ...element, showEffects: !element.showEffects }
                                                                )),
                                                            }));
                                                        }}>👁️</button>
                                                        <input type='checkbox' checked={active} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                            this.setState((state) => {
                                                                const modifiers = state.modifiers.map((element, i) => (
                                                                    (i !== modifierIndex) ? element : { ...element, active: !element.active }
                                                                ));
                                                                this.updateCreatureStatsMemo(modifiers);
                                                                return {
                                                                    modifiers,
                                                                };
                                                            });
                                                            event.target.checked;
                                                        }}></input>
                                                        <button className={transparentButton} onClick={() => {
                                                            this.setState((state) => ({
                                                                modifiers: [
                                                                    ...state.modifiers.slice(0, modifierIndex),
                                                                    ...state.modifiers.slice(modifierIndex + 1, state.modifiers.length)
                                                                ]
                                                            }));
                                                        }}>➖</button>
                                                    </div>

                                                    {!this.state.modifiers[modifierIndex].showEffects ? '' :
                                                        <Droppable
                                                            droppableId={`effectContainer${modifierIndex}`}
                                                            direction='vertical'
                                                            type='effect'
                                                        >
                                                            {(provided) => (
                                                                <div
                                                                    {...provided.droppableProps}
                                                                    ref={provided.innerRef}
                                                                    style={{ paddingLeft: '10px', }}
                                                                >
                                                                    {effects.map((effect, effectIndex) =>
                                                                        <Draggable
                                                                            draggableId={`m${modifierIndex}e${effectIndex}`}
                                                                            index={effectIndex}
                                                                            key={effectIndex}
                                                                            isDragDisabled={false}
                                                                        >
                                                                            {(provided) => (
                                                                                <div
                                                                                    {...provided.draggableProps}
                                                                                    {...provided.dragHandleProps}
                                                                                    ref={provided.innerRef}
                                                                                    style={{ ...provided.draggableProps.style }}
                                                                                >
                                                                                    <EffectModifierDiv
                                                                                        effect={effect}
                                                                                        effectIndex={effectIndex}
                                                                                        modifierIndex={modifierIndex}
                                                                                        key={effectIndex}
                                                                                        modifiers={this.state.modifiers}
                                                                                        handleChangeModifiers={this.handleChangeModifiers}
                                                                                        handleBonusAmountChange={this.handleBonusAmountChange(effectIndex, modifierIndex)}
                                                                                        handleBonusTypeChange={this.handleBonusTypeChange(effectIndex, modifierIndex)}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </Draggable>
                                                                    )}
                                                                    {provided.placeholder}
                                                                    <button className={transparentButton} onClick={() => {
                                                                        this.setState((state) => ({
                                                                            modifiers: state.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                                                                                ...element,
                                                                                effects: [
                                                                                    ...effects,
                                                                                    {
                                                                                        stat: creatureStats[0],
                                                                                        active: true,
                                                                                        bonus: { type: BonusType.untyped, amount: 0 }
                                                                                    }
                                                                                ]
                                                                            })),
                                                                        }));
                                                                    }}>➕</button>
                                                                </div>
                                                            )}
                                                        </Droppable>
                                                    }

                                                </div>
                                            )}

                                        </Draggable>

                                    )}
                                    {provided.placeholder}
                                    <button className={transparentButton} onClick={() => {
                                        this.setState((state) => ({
                                            modifiers: [...state.modifiers, { name: '', active: true, showEffects: true, effects: [] }]
                                        }));
                                    }}>➕</button>
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>

            </div >
        </div>
    }
}

ReactDOM.render(
    <App />,
    document.getElementById("root")
);