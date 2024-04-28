import React, { useState, useContext } from 'react';
import axios from 'axios';
import { TextField, Button, Box } from '@mui/material';
import toast from 'react-hot-toast';
import { Context } from '../../main';

const CreateAdminAccount = () => {
    const [adminData, setAdminData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'Admin'  // Automatically set the role to Admin
    });
    
    const { setUser, setIsAuthorized } = useContext(Context);

    const handleChange = (e) => {
        setAdminData({ ...adminData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting with data:", adminData);
        try {
            const response = await axios.post('http://localhost:4000/api/v1/admin/create-admin', adminData, {
                withCredentials: true
            });
            toast.success(response.data.message);
            setIsAuthorized(true);
            setUser(response.data.user);
        } catch (error) {
            console.error('Failed to create admin account', error);
            toast.error(error.response.data.message);
            setIsAuthorized(false);
        }
    };

    return (
        <Box m="1.5rem 2.5rem">
            <h1>Créer un Compte Administrateur</h1>
            <form onSubmit={handleSubmit}>
                <Box mt={4} display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Nom"
                        name="name"
                        value={adminData.name}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Email"
                        name="email"
                        value={adminData.email}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Numéro de Téléphone"
                        name="phone"
                        value={adminData.phone}
                        onChange={handleChange}
                        fullWidth
                    />
                    <TextField
                        label="Mot de passe"
                        name="password"
                        type="password"
                        value={adminData.password}
                        onChange={handleChange}
                        fullWidth
                    />
                    {/* Remove the role selection from the UI */}
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ alignSelf: "flex-start" }}
                    >
                        Créer Compte
                    </Button>
                </Box>
            </form>
        </Box>
    );
};

export default CreateAdminAccount;
