import React, {useState, useEffect, Dispatch, SetStateAction} from "react";
import { TextField, Card, CardContent, Box, Typography, Button, Grid } from '@mui/material';
import axios from 'axios';
import { useUser } from "../UserContext";

export default function ChangeLabel() {
    const { userId } = useUser();
    
    const [categories, setCategories] = useState<{ name: string, color: string, id: number }[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [popupTitle, setPopupTitle] = useState("");
    const [color, setColor] = useState("#000000");
    const [labelName, setLabelName] = useState<string>("");
    const [labelId, setLabelId] = useState<number>(0);

    const presetColors = ["#1C1F26", "#2B2F36", "#3A3F4B", "#4A4F5C", "#6B7180", "#888D99", "#A1A5B0", "#C5C7CC"];

    useEffect(() => {
        axios.get(`http://localhost:8080/labels`) 
            .then(response => {
            setCategories(response.data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const openPopup = (title: string, label?: { id: number, name: string, color: string }) => {
        setPopupTitle(title);
        setLabelName(label?.name || "");
        setColor(label?.color || "#000000");
        setPopupOpen(true);
        setLabelId(label?.id || 0);
    };

    const handleSave = async () => {
        if(!userId) return;
        try {
            if(labelId) {
                setCategories(prevCategories =>
                    prevCategories.map(label =>
                        label.id === labelId ? { ...label, name: labelName, color } : label
                    )
                );
                await axios.post(`http://localhost:8080/label/update-label-setting`, {
                    labelName: labelName,
                    color,
                    labelId: labelId
                });
            } else {
                setCategories((prev) => [...prev, {name: labelName, color: color, id: labelId || categories.length + 1}])
                await axios.post(`http://localhost:8080/label/update-label-setting`, {
                    labelName: labelName,
                    color
                });
            }
        } catch(error) {
            console.error("Error update labels", error);
        }
        
        setPopupOpen(false);
    };

    return (
        <div>
            <Card>
            <CardContent>
            <Typography
                variant="h6" 
                sx={{
                marginBottom: 2
                }}>
                Label Colors
            </Typography>
            {categories.map((label, index) => (
            <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                key={index}
                sx={{
                    border: "1px solid #ddd",
                    borderRadius: 1,
                    marginBottom: 1,
                    padding: 1.5,
                    gap: 3
                }}
            >
                <Grid item sx={{ display: "flex", alignItems: "center" }}>
                <Box
                    sx={{
                    width: 20,
                    height: 20,
                    backgroundColor: label.color === "primary" ? 'lightblue' : label.color,
                    borderRadius: 1,
                    marginRight: 2,
                    }}
                />
                <Typography>{label.name}</Typography>
                </Grid>
                <Grid item>
                <Button variant="outlined"
                    size="small"
                    sx={{ backgroundColor: "#fbfcfc", color: "black", borderColor:"black", textTransform: "none" }}
                    onClick={() => openPopup("Edit Label Color", label)}
                    >
                    Change
                </Button>
                </Grid>
            </Grid>
            ))}
            <Button sx={{textTransform: "none", color: "black"}} onClick={() => openPopup("Add New Label")}> + Add New Label</Button>
            </CardContent>
        </Card>

        {popupOpen && (
            <LabelPopup 
                title={popupTitle} 
                label={labelName} 
                color={color} 
                setColor={setColor} 
                presetColors={presetColors} 
                onClose={() => setPopupOpen(false)} 
                onSave={handleSave} 
                setLabel={setLabelName}
                categories={categories}
                labelId={labelId}
            />
            )}
        </div>
    )
}

interface LabelPopupProps {
    title: string;
    label: string;
    color: string;
    setColor: (color: string) => void;
    presetColors: string[];
    onClose: () => void;
    onSave: () => void;
    setLabel: Dispatch<SetStateAction<string>>;
    categories: {
        name: string;
        color: string;
        id: number;
    }[];
    labelId: number;
}

function  LabelPopup({ title, label, color, setColor, presetColors, onClose, onSave, setLabel, categories, labelId }: LabelPopupProps) {
    const [isDuplicate, setIsDuplicate] = useState<boolean>(false); 
    return (
        <form onSubmit={(e) => {
            e.preventDefault();

            const isDuplicate = categories.some((cat) => cat.name.toLowerCase() === label.toLowerCase());
            const isChangedFunction = categories.some((cat) => cat.id === labelId);

            if (isDuplicate && !isChangedFunction) {
                setIsDuplicate(true);
                return; 
            }

            onSave();
        }}>
            <div className='overlay'>
                <div className='popup'>
                    <div className='content_popup'>
                    <h2>{title}</h2>
                    <Typography variant="subtitle1">Label Name</Typography>
                    <input id="task_name" defaultValue={label || ""} onChange={(e) => setLabel(e.target.value)}  required />
                    {isDuplicate && <Typography variant="caption" color="error">Duplicate Label Name</Typography>}
                    <Typography variant="subtitle1">Select Color</Typography>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Box sx={{ width: 40, height: 40, backgroundColor: color === "primary" ? 'lightblue' : color, borderRadius: 1, border: "1px solid #ccc" }} />
                        </Grid>
                        <Grid item>
                            <TextField type="color" value={color === "primary" ? '#ADD8E6' : color} onChange={(e) => {setColor(e.target.value)}} variant="outlined" sx={{ width: "80px" }} size="small" />
                        </Grid>
                    </Grid>

                    <Typography variant="subtitle1">Preset Colors</Typography>
                    <Grid container spacing={3} sx={{ marginBottom: 2 }}>
                        {presetColors.map((preset, index) => (
                            <Grid item key={index}>
                                <Box sx={{ width: 25, height: 25, backgroundColor: preset, borderRadius: "50%", border: color === preset ? "2px solid black" : "2px solid transparent", cursor: "pointer" }} onClick={() => setColor(preset)} />
                            </Grid>
                        ))}
                    </Grid>
                    <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                        <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none", marginRight: '10px' }}>Cancel</Button>
                        <Button type="submit" variant="contained" sx={{ textTransform: "none", backgroundColor: "black", "&:hover": { backgroundColor: "#333" } }}>Save Changes</Button>
                    </div>
                </div>
                </div>
            </div>
        </form>
    );
}   
