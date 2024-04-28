import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import {
    Container, Grid, Paper, Box, Typography, TextField, Button
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

const CustomButton = styled(Button)({
    marginTop: 8,
    marginBottom: 8,
    padding: '6px 16px',
    '&:hover': {
        backgroundColor: '#5a98f2',
    },
});

const UserProfile = () => {
    const { user, setUser } = useContext(Context);
    const [editInfo, setEditInfo] = useState({
        name: "",
        phone: "",
        password: ""
    });

    const [isEditing, setIsEditing] = useState({
        name: false,
        phone: false,
        password: false
    });
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const [passwordFields, setPasswordFields] = useState({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
    });
    useEffect(() => {
        setEditInfo({
            name: user.name || "",
            phone: user.phone || "",
            password: "" // We don't populate the password for security reasons
        });
    }, [user]);

    const handleEdit = (field) => {
        setIsEditing({ ...isEditing, [field]: true });
    };

    const handleChange = (e) => {
        setEditInfo({ ...editInfo, [e.target.name]: e.target.value });
    };

    const handleUpdate = async (field) => {
        try {
            const updateData = { [field]: editInfo[field] };
            const response = await axios.put(`http://localhost:4000/api/v1/user/updateprofile`, updateData, {
                withCredentials: true
            });
            setUser({ ...user, [field]: response.data[field] });
            toast.success("Informations mises à jour avec succès.");
            setIsEditing({ ...isEditing, [field]: false });
        } catch (error) {
            toast.error(error.response?.data?.message || "Une erreur s'est produite.");
        }
    };
    const handlePasswordDialogToggle = () => {
        setShowPasswordDialog(!showPasswordDialog);
      };
    
      const handlePasswordFieldChange = (e) => {
        setPasswordFields({
          ...passwordFields,
          [e.target.name]: e.target.value
        });
      };
      const handlePasswordUpdate = async () => {
        // Validate the new passwords match
        if (passwordFields.newPassword !== passwordFields.confirmNewPassword) {
          toast.error("Les nouveaux mots de passe ne correspondent pas.");
          return;
        }
        
        try {
          // Update the password using the API
          const response = await axios.put('http://localhost:4000/api/v1/user/updatepassword', {
            currentPassword: passwordFields.currentPassword,
            newPassword: passwordFields.newPassword
          }, {
            withCredentials: true
          });
          
          if (response.data.success) {
            toast.success("Mot de passe mis à jour avec succès.");
            handlePasswordDialogToggle();
          } else {
            toast.error(response.data.message);
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Une erreur s'est produite.");
        }
      };
    return (
        <Container component="main" maxWidth="sm">
            <Paper elevation={6} sx={{ my: 3, p: 3 }}>
                <Box display="flex" flexDirection="column" alignItems="center" marginBottom={2}>
                    <Typography component="h1" variant="h5">
                        Mon Profil
                    </Typography>
                </Box>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Nom
                        </Typography>
                        <TextField
                            name="name"
                            fullWidth
                            value={editInfo.name}
                            disabled={!isEditing.name}
                            onChange={handleChange}
                            variant="outlined"
                            margin="dense"
                        />
                        <CustomButton
                            variant="contained"
                            color="primary"
                            onClick={() => isEditing.name ? handleUpdate('name') : handleEdit('name')}
                            startIcon={isEditing.name ? <SaveIcon /> : <EditIcon />}
                        >
                            {isEditing.name ? 'Sauvegarder' : 'Modifier'}
                        </CustomButton>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Numéro de téléphone
                        </Typography>
                        <TextField
                            name="phone"
                            fullWidth
                            value={editInfo.phone}
                            disabled={!isEditing.phone}
                            onChange={handleChange}
                            variant="outlined"
                            margin="dense"
                        />
                        <CustomButton
                            variant="contained"
                            color="primary"
                            onClick={() => isEditing.phone ? handleUpdate('phone') : handleEdit('phone')}
                            startIcon={isEditing.phone ? <SaveIcon /> : <EditIcon />}
                        >
                            {isEditing.phone ? 'Sauvegarder' : 'Modifier'}
                        </CustomButton>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Mot de passe
                        </Typography>
                        <TextField
                            name="password"
                            fullWidth
                            type="password"
                            value={editInfo.password}
                            disabled={!isEditing.password}
                            onChange={handleChange}
                            variant="outlined"
                            margin="dense"
                            helperText="Laissez vide pour conserver le mot de passe actuel"
                        />
                        <CustomButton
                            variant="contained"
                            color="primary"
                            onClick={() => isEditing.password ? handleUpdate('password') : handleEdit('password')}
                            startIcon={isEditing.password ? <SaveIcon /> : <EditIcon />}
                        >
                            {isEditing.password ? 'Sauvegarder' : 'Modifier'}
                        </CustomButton>
                    </Grid>

                    {/* Email and Role are read-only */}
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Email
                        </Typography>
                        <TextField
                            fullWidth
                            value={user.email || ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                            margin="dense"
                            onClick={() => toast.info("Changement d'email n'est pas autorisé.")}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle1" gutterBottom>
                            Rôle
                        </Typography>
                        <TextField
                            fullWidth
                            value={user.role || ""}
                            InputProps={{
                                readOnly: true,
                            }}
                            variant="outlined"
                            margin="dense"
                            onClick={() => toast.info("Changement de rôle n'est pas autorisé.")}
                        />
                    </Grid>
                </Grid>
                
            </Paper>
            
        </Container>
        
    );
};

export default UserProfile;
