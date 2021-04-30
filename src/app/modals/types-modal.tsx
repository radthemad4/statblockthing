import React, { ChangeEvent } from 'react';
import { CreatureModifier } from '../app';
import { SetCreatureType, isSetCreatureType, CreatureType, creatureTypes, SetCreatureSubtype, isSetCreatureSubtype, SetCreatureSubtypeEffectType, CreatureSubtype, creatureSubtypes } from '../effects/creature-types';
import { Modal } from '../modal';
import { transparentButton } from '../styles';

export interface TypesModalProps {
    show: boolean,
    modifiers: CreatureModifier[],
    handleChangeModifiers: (newModifiers: CreatureModifier[]) => void,
    getCreatureType: () => string,
    getCreatureSubtypes: () => string[],
    handleDismissModal: () => void,
}

export const TypesModal: React.FC<TypesModalProps> = (props) => {

    return <Modal
        show={props.show}
        interior={
            <div>
                <h3>Type</h3>
                {
                    (() => {

                        let setCreatureTypeEffects: {
                            modifierIndex: number,
                            effectIndex: number,
                            effect: SetCreatureType
                        }[] = [];

                        for (const modifierIndex in props.modifiers) {
                            const modifier = props.modifiers[modifierIndex];
                            for (const effectIndex in modifier.effects) {
                                const effect = modifier.effects[effectIndex];
                                if (isSetCreatureType(effect)) {
                                    setCreatureTypeEffects.push({
                                        modifierIndex: parseInt(modifierIndex),
                                        effectIndex: parseInt(effectIndex),
                                        effect: effect
                                    });
                                }
                            }
                        }
                        return (
                            <div>
                                {setCreatureTypeEffects.map(({ modifierIndex, effectIndex, effect }) =>
                                    <div
                                        key={`m${modifierIndex}e${effectIndex}`}
                                        style={{
                                            opacity: (props.modifiers[modifierIndex].active && effect.active) ? 1 : 0.5,
                                        }}
                                    >
                                        <input
                                            type="text"
                                            list="creatureTypesList"
                                            value={effect.creatureType}
                                            onChange={(event) => {
                                                event.persist();
                                                props.handleChangeModifiers(props.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                                                    ...element,
                                                    effects: props.modifiers[i].effects.map((effect, effectIndex1) => effectIndex1 !== effectIndex ? effect : {
                                                        ...effect,
                                                        creatureType: (event.target.value as CreatureType)
                                                            ? event.target.value as CreatureType : event.target.value
                                                    })
                                                })));
                                            }}
                                        />
                                        <input type='checkbox' checked={effect.active} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                            props.handleChangeModifiers(props.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                                                ...element,
                                                effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                                                    effectIndex1 !== effectIndex ? effect : { ...effect, active: !effect.active }
                                                )
                                            })));
                                        }} />

                                        <datalist id="creatureTypesList">
                                            {creatureTypes.map((creatureType, index) => <option key={index}>{creatureType}</option>)}
                                        </datalist>
                                        <input
                                            style={{ marginLeft: '20px' }}
                                            value={props.modifiers[modifierIndex].name}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                event.persist();
                                                props.handleChangeModifiers(props.modifiers.map((element, i) => (
                                                    (i !== modifierIndex) ? element : { ...element, name: event.target.value }
                                                )));
                                            }}
                                        />
                                        <input
                                            type='checkbox'
                                            checked={props.modifiers[modifierIndex].active}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                props.handleChangeModifiers(props.modifiers.map((element, i) => (
                                                    (i !== modifierIndex) ? element : { ...element, active: !element.active })
                                                ));
                                            }}
                                        />
                                    </div>)}
                                <button className={transparentButton} onClick={() => {
                                    props.handleChangeModifiers([...props.modifiers, {
                                        name: '', active: true, showEffects: true, effects: [
                                            {
                                                creatureType: '',
                                                active: true
                                            }
                                        ]
                                    }]);
                                }}>➕</button>
                                <div style={{ paddingTop: '20px' }}>{props.getCreatureType()}</div>
                            </div>
                        )
                    })()
                }

                <h3>Subtypes</h3>
                {
                    (() => {

                        let setCreatureSubtypeEffects: {
                            modifierIndex: number,
                            effectIndex: number,
                            effect: SetCreatureSubtype
                        }[] = [];

                        for (const modifierIndex in props.modifiers) {
                            const modifier = props.modifiers[modifierIndex];
                            for (const effectIndex in modifier.effects) {
                                const effect = modifier.effects[effectIndex];
                                if (isSetCreatureSubtype(effect)) {
                                    setCreatureSubtypeEffects.push({
                                        modifierIndex: parseInt(modifierIndex),
                                        effectIndex: parseInt(effectIndex),
                                        effect: effect
                                    });
                                }
                            }
                        }
                        return (
                            <div>
                                {setCreatureSubtypeEffects.map(({ modifierIndex, effectIndex, effect }) =>
                                    <div
                                        key={`m${modifierIndex}e${effectIndex}`}
                                        style={{
                                            opacity: (props.modifiers[modifierIndex].active && effect.active) ? 1 : 0.5,
                                        }}
                                    >
                                        <select
                                            value={effect.effectType === SetCreatureSubtypeEffectType.add ? "Add Subtype" : "Remove Subtype"}
                                            onChange={(event: React.ChangeEvent<HTMLSelectElement>) => {
                                                event.persist();
                                                props.handleChangeModifiers(props.modifiers.map((modifier, i) => (i !== modifierIndex ? modifier : {
                                                    ...modifier,
                                                    effects: props.modifiers[i].effects.map((effect, effectIndex1) => effectIndex1 !== effectIndex ? effect : {
                                                        ...effect,
                                                        effectType: (event.target.selectedIndex === 0)
                                                            ? SetCreatureSubtypeEffectType.add
                                                            : SetCreatureSubtypeEffectType.remove
                                                    })
                                                })));
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
                                                    effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                                                        (effectIndex1 !== effectIndex) ? effect : {
                                                            ...effect,
                                                            creatureSubtype: (event.target.value as CreatureSubtype)
                                                                ? event.target.value as CreatureSubtype
                                                                : event.target.value
                                                        }
                                                    )
                                                })));
                                            }}
                                        />
                                        <input type='checkbox' checked={effect.active} onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                            props.handleChangeModifiers(props.modifiers.map((element, i) => (i !== modifierIndex ? element : {
                                                ...element,
                                                effects: props.modifiers[i].effects.map((effect, effectIndex1) =>
                                                    (effectIndex1 !== effectIndex) ? effect : { ...effect, active: !effect.active }
                                                )
                                            })));
                                        }}></input>

                                        <datalist id="creatureSubtypesList">
                                            {creatureSubtypes.map((creatureSubtype, index) => <option key={index}>{creatureSubtype}</option>)}
                                        </datalist>
                                        <input
                                            style={{ marginLeft: '20px' }}
                                            value={props.modifiers[modifierIndex].name}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                event.persist();
                                                props.handleChangeModifiers(props.modifiers.map((element, i) => (
                                                    (i !== modifierIndex) ? element : { ...element, name: event.target.value }
                                                )));
                                            }}
                                        />
                                        <input
                                            type='checkbox'
                                            checked={props.modifiers[modifierIndex].active}
                                            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                props.handleChangeModifiers(props.modifiers.map((element, i) => (
                                                    (i !== modifierIndex) ? element : { ...element, active: !element.active }
                                                )));
                                            }}
                                        />
                                    </div>)}
                                <button className={transparentButton} onClick={() => {
                                    props.handleChangeModifiers([...props.modifiers, {
                                        name: '', active: true, showEffects: true, effects: [
                                            {
                                                creatureSubtype: '',
                                                effectType: SetCreatureSubtypeEffectType.add,
                                                active: true
                                            }
                                        ]
                                    }]);
                                }}>➕</button>
                                <div style={{ paddingTop: '20px' }}>{props.getCreatureSubtypes().join(', ')}</div>
                            </div>
                        )
                    })()
                }
            </div>}
        onDismiss={() => {
            props.handleDismissModal();
        }}
    />
}