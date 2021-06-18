import React, { ChangeEvent } from 'react';
import { CreatureModifier } from '../app';
import { BonusType, bonusTypes } from '../effects/bonus';
import { CreatureStat } from '../effects/creature-stats';
import { SetCreatureType, isSetCreatureType, CreatureType, creatureTypes, SetCreatureSubtype, isSetCreatureSubtype, SetCreatureSubtypeEffectType, CreatureSubtype, creatureSubtypes } from '../effects/creature-types';
import { Modal } from '../modal';
import { transparentButton } from '../styles';
import { StatModalInteriorDiv } from './stat-modal';

export interface ArmorClassModalProps {
    show: boolean,
    modifiers: CreatureModifier[],

    touchACBonusTypes: Set<BonusType | string>,
    flatfootedACBonusTypes: Set<BonusType | string>,

    handleChangeTouchACBonusTypes: (newTouchACBonusTypes: Set<BonusType | string>) => void,
    handleChangeFlatfootedACBonusTypes: (newFlatfootedACBonusTypes: Set<BonusType | string>) => void,

    handleChangeModifiers: (newModifiers: CreatureModifier[]) => void,
    handleBonusAmountChange: (effectIndex: number, modifierIndex: number) => ((newBonusAmount: string | number) => void);
    handleBonusTypeChange: (effectIndex: number, modifierIndex: number) => ((newBonusType: string) => void);
    statOutput: () => string,
    handleDismissModal: () => void,
}

export const ArmorClassModal: React.FC<ArmorClassModalProps> = (props) => {

    const tableCellStyle: React.CSSProperties = { display: 'table-cell', padding: '5px', verticalAlign: 'middle' };
    const tableHeaderStyle: React.CSSProperties = { ...tableCellStyle, fontWeight: 700 }

    return <Modal
        show={props.show}
        interior={
            <div>
                <StatModalInteriorDiv
                    creatureStat={CreatureStat.armorClass}
                    {...props}
                />
                <div>
                    <div style={{ display: 'table', borderSpacing: '2px' }}>
                        <div style={{ display: 'table-row' }}>
                            <div style={tableHeaderStyle}>
                                Bonus Type
                            </div>
                            <div style={tableHeaderStyle}>
                                Touch
                            </div>
                            <div style={tableHeaderStyle}>
                                Flatfooted
                            </div>
                        </div>
                        {(() => {

                            return bonusTypes.map((bonusType, index) => {
                                return (
                                    <div style={{ display: 'table-row' }} key={index}>
                                        <div style={tableCellStyle}>
                                            {bonusType}
                                        </div>
                                        <div style={tableCellStyle}>
                                            <input
                                                type='checkbox'
                                                checked={props.touchACBonusTypes.has(bonusType)}
                                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                    let bonusTypes = props.touchACBonusTypes;
                                                    if (props.touchACBonusTypes.has(bonusType)) {
                                                        bonusTypes.delete(bonusType);
                                                    }else{
                                                        bonusTypes.add(bonusType);
                                                    }
                                                    
                                                    props.handleChangeTouchACBonusTypes(bonusTypes);
                                                }}
                                            ></input>
                                        </div>
                                        <div style={tableCellStyle}>
                                            <input
                                                type='checkbox'
                                                checked={props.flatfootedACBonusTypes.has(bonusType)}
                                                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                                                    let bonusTypes = props.flatfootedACBonusTypes;
                                                    if (props.flatfootedACBonusTypes.has(bonusType)) {
                                                        bonusTypes.delete(bonusType);
                                                    }else{
                                                        bonusTypes.add(bonusType);
                                                    }

                                                    props.handleChangeFlatfootedACBonusTypes(bonusTypes);
                                                }}
                                            ></input>
                                        </div>
                                    </div>
                                )
                            })
                        })()}
                    </div>
                </div>
            </div>
        }
        onDismiss={() => {
            props.handleDismissModal();
        }}
    />
}