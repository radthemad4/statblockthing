import React from 'react';

export const Modal: React.FC<{ interior: React.ReactNode, show: boolean, onDismiss: () => void }> = (props) => {
    if (!props.show) {
        return null;
    }
    return <div style={{
        position: 'fixed',
        zIndex: 1,
        width: '100%',
        height: '100%',
        overflow: "auto",
        backgroundColor: 'rgba(0,0,0,0.4)',

        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }} onClick={() => {
        props.onDismiss();
    }}>
        <div
            style={{
                backgroundColor: 'white',
                padding: '20px'
            }}
            onClick={(event)=>{event.stopPropagation()}}
        >
            {props.interior}
        </div>

    </div>
}