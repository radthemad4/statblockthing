import React, { ChangeEvent } from "react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { CreatureModifier } from '../app';
import { Bonus, BonusType, EffectBonusSpan } from "../effects/bonus";
import { CreatureStat, isModifyCreatureStat } from "../effects/creature-stats";
import { Effect } from '../effects/effect';
import { Modal } from '../modal';
import { sizeName } from "../progressions";
import { transparentButton } from "../styles";

export interface StatModalProps {
    show: boolean,
    stat: CreatureStat,
    modifiers: CreatureModifier[],
    handleChangeModifiers: (newModifiers: CreatureModifier[]) => void,
    handleBonusAmountChange: (effectIndex: number, modifierIndex: number) => ((newBonusAmount: string | number) => void);
    handleBonusTypeChange: (effectIndex: number, modifierIndex: number) => ((newBonusType: string) => void);
    getStat: () => number,
    handleDismissModal: () => void,
}

export const StatModal: React.FC<StatModalProps> = (props) => {

    return <Modal
        show={props.show}
        interior={
            <div>
                <h3>{props.stat}</h3>
                {
                    (() => {

                        let statEffects: {
                            modifierIndex: number,
                            effectIndex: number,
                            effect: {
                                stat: CreatureStat,
                                bonus: Bonus,
                                active: boolean
                            }
                        }[] = [];

                        for (const modifierIndex in props.modifiers) {
                            const modifier = props.modifiers[modifierIndex];
                            for (const effectIndex in modifier.effects) {
                                const effect = modifier.effects[effectIndex];
                                if (isModifyCreatureStat(effect) && effect.stat === props.stat) {
                                    statEffects.push({
                                        modifierIndex: parseInt(modifierIndex),
                                        effectIndex: parseInt(effectIndex),
                                        effect: effect
                                    });
                                }
                            }
                        }

                        return <DragDropContext
                            onDragEnd={(result, provided) => {

                                const { destination, source, draggableId, type } = result;

                                if (destination != null) {

                                    let modifiers = [...props.modifiers];
                                    modifiers.splice(statEffects[source.index].modifierIndex, 1);
                                    modifiers.splice(statEffects[destination.index].modifierIndex, 0, props.modifiers[statEffects[source.index].modifierIndex]);

                                    props.handleChangeModifiers(modifiers);
                                }
                            }}
                        >
                            <Droppable
                                droppableId='sizeEffects'
                            >
                                {(provided) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        {statEffects.map(({ modifierIndex, effectIndex, effect }, sizeEffectIndex) =>
                                            <Draggable
                                                key={`m${modifierIndex}e${effectIndex}`}
                                                draggableId={`m${modifierIndex}e${effectIndex}`}
                                                index={sizeEffectIndex}
                                            >
                                                {(provided) => (
                                                    <div
                                                        key={`m${modifierIndex}e${effectIndex}`}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        style={{
                                                            opacity: (props.modifiers[modifierIndex].active && effect.active) ? 1 : 0.5,
                                                            ...provided.draggableProps.style
                                                        }}
                                                    >
                                                        <EffectBonusSpan
                                                            modifierIndex={modifierIndex}
                                                            effectIndex={effectIndex}
                                                            effect={effect}
                                                            handleBonusAmountChange={props.handleBonusAmountChange(effectIndex, modifierIndex)}
                                                            handleBonusTypeChange={props.handleBonusTypeChange(effectIndex, modifierIndex)}
                                                        />
                                                        <input type='checkbox' checked={effect.active} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                            props.handleChangeModifiers(props.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                                                                ...element,
                                                                effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                                                                    (effectIndex1 !== effectIndex) ? effect : { ...effect, active: !effect.active }
                                                                )
                                                            })));
                                                        }}></input>
                                                        <input style={{ marginLeft: '20px' }} value={props.modifiers[modifierIndex].name} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                            event.persist();
                                                            props.handleChangeModifiers(props.modifiers.map((element, i) => (
                                                                (i !== modifierIndex) ? element : { ...element, name: event.target.value }
                                                            )));
                                                        }}></input>
                                                        <input type='checkbox' checked={props.modifiers[modifierIndex].active} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                            props.handleChangeModifiers(props.modifiers.map((element, i) => (
                                                                (i !== modifierIndex) ? element : { ...element, active: !element.active }
                                                            )));
                                                        }}></input>
                                                    </div>
                                                )}
                                            </Draggable>
                                        )}

                                        {provided.placeholder}

                                        <button className={transparentButton} onClick={() => {
                                            props.handleChangeModifiers([...props.modifiers, {
                                                name: '', active: true, showEffects: true, effects: [
                                                    {
                                                        stat: props.stat,
                                                        bonus: {
                                                            type: BonusType.untyped,
                                                            amount: 0
                                                        },
                                                        active: true
                                                    }
                                                ]
                                            }]);
                                        }}>➕</button>
                                        <div style={{ paddingTop: '20px' }}>{
                                            props.stat === CreatureStat.size ? sizeName(props.getStat()) : props.getStat()
                                        }</div>
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    })()
                }
            </div>}
        onDismiss={() => {
            props.handleDismissModal();
        }}
    />
}