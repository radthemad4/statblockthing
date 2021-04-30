import React from 'react';
import { Bonus } from './bonus';

export enum CreatureStat {

    size = "size",
    hp = "hp",
    bab = "bab",
    fort = 'fort',
    ref = 'ref',
    will = 'will',

    str = "strScore",
    dex = "dexScore",
    con = "conScore",
    int = "intScore",
    wis = "wisScore",
    cha = "chaScore",
}

export const creatureStatDisplayNames = {
    [CreatureStat.size]: "Size",
    [CreatureStat.hp]: "Hit Points",
    [CreatureStat.bab]: "BAB",
    [CreatureStat.fort]: "Fort",
    [CreatureStat.ref]: "Ref",
    [CreatureStat.will]: "Will",

    [CreatureStat.str]: "Strength",
    [CreatureStat.dex]: "Dexterity",
    [CreatureStat.con]: "Constitution",
    [CreatureStat.int]: "Intelligence",
    [CreatureStat.wis]: "Wisdom",
    [CreatureStat.cha]: "Charisma",
};

export const creatureStats = [

    CreatureStat.size,
    CreatureStat.hp,
    CreatureStat.bab,
    CreatureStat.fort,
    CreatureStat.ref,
    CreatureStat.will,

    CreatureStat.str,
    CreatureStat.dex,
    CreatureStat.con,
    CreatureStat.int,
    CreatureStat.wis,
    CreatureStat.cha,

];

export interface ModifyCreatureStat {
    active: boolean,
    stat: CreatureStat,
    bonus: Bonus,
}

export function isModifyCreatureStat(effect: any): effect is ModifyCreatureStat {
    return (effect as ModifyCreatureStat).stat !== undefined && (effect as ModifyCreatureStat).bonus !== undefined;
}

export const EffectStatSelect: React.FC<{ effect: { stat: CreatureStat }, effectIndex: number, modifierIndex: number, handleChange: (event: React.ChangeEvent<HTMLSelectElement>) => void }> = (props) => {
    const modifierIndex = props.modifierIndex;
    const effectIndex = props.effectIndex;
    const effect = props.effect;

    return <select value={effect.stat} onChange={props.handleChange}>
        {creatureStats.map((element, statIndex) => <option key={statIndex}>{element}</option>)}
    </select>
};