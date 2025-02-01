import React, { useState } from 'react';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

export default function EditType() {
    const [popup, openPopup] = useState<boolean>(false);
    const [types, setTypes] = useState<{ text: string; color: string }[]>([
        { text: '', color: '#007fff' },
    ]);

    const handleAddType = () => {
        if (types.length < 10) {
            setTypes([...types, { text: '', color: '#007fff' }]); // Add a new type with default values
        }
    };

    const handleTypeChange = (index: number, key: 'text' | 'color', value: string) => {
        const updatedTypes = [...types];
        updatedTypes[index][key] = value;
        setTypes(updatedTypes); 
    };

    const handleSave = () => {
        alert(JSON.stringify(types, null, 2));
        openPopup(false); // Close popup after saving
    };

    return (
        <div>
            <Button variant="outlined" startIcon={<SendIcon />} onClick={() => openPopup(true)}>
                Edit Type
            </Button>
            {popup && (
                <div className="overlay">
                    <div className="content_popup" style={{ flexDirection: 'column', alignItems: 'center' }}>
                        {types.map((type, index) => (
                            <div
                                key={index}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    marginBottom: '10px',
                                }}
                            >
                                {/* Color Picker */}
                                <input
                                    type="color"
                                    value={type.color}
                                    onChange={(event) =>
                                        handleTypeChange(index, 'color', event.target.value)
                                    }
                                />
                                {/* Color Preview Box */}
                                <Box
                                    component="div"
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        width: 20,
                                        height: 20,
                                        borderRadius: 2,
                                    }}
                                    style={{ background: type.color }}
                                />
                                {/* Text Field */}
                                <TextField
                                    required
                                    id={`outlined-required-${index}`}
                                    value={type.text}
                                    size="small"
                                    inputProps={{ maxLength: 40 }}
                                    onChange={(e) =>
                                        handleTypeChange(index, 'text', e.target.value)
                                    }
                                />
                            </div>
                        ))}
                        {types.length < 10 && (
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={handleAddType}
                                style={{ marginTop: '10px' }}
                            >
                                Add Type
                            </Button>
                        )}
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                            <Button variant="contained" onClick={() => openPopup(false)}>Close</Button>
                            <Button variant="outlined" onClick={handleSave}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
