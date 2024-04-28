import { useState, useEffect } from "react";
import axios from 'axios';
import { Box, useTheme, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Paper } from '@mui/material';
import Header from "../../components/Admin/Header";
import { DataGrid } from "@mui/x-data-grid";
import toast from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


const Utilisateurs = () => {
    const theme = useTheme();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/v1/admin/users', {
                withCredentials: true,
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            setUsers(response.data.users);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Une erreur s’est produite');
            setLoading(false);
            toast.error('Échec de la récupération des utilisateurs');
        }
    };
    useEffect(() => {

        fetchUsers();
    }, []);

    const handleOpenUpdateDialog = (user) => {
        setCurrentUser(user);
        setOpenUpdate(true);
    };

    const handleOpenDeleteDialog = (id) => {
        setCurrentUser({ id });
        setOpenDelete(true);
    };

    const handleCloseDialogs = () => {
        setOpenUpdate(false);
        setOpenDelete(false);
    };

    const handleUpdateUser = async () => {
        try {
            await axios.put(`http://localhost:4000/api/v1/admin/users/${currentUser._id}`, currentUser, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            toast.success('Utilisateur mis à jour avec succès');
            handleCloseDialogs();
            fetchUsers();
        } catch (error) {
            toast.error('Échec de la mise à jour de l’utilisateur');
        }
    };

    const handleDeleteUser = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/v1/admin/users/${currentUser.id}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            toast.success('Utilisateur supprimé avec succès');
            handleCloseDialogs();
            fetchUsers();
        } catch (error) {
            toast.error('Échec de la suppression de l’utilisateur');
        }
    };

    const columns = [
        { field: "name", headerName: "Nom", flex: 1 },
        { field: "email", headerName: "Email", flex: 1 },
        { field: "phone", headerName: "Numéro de téléphone", flex: 1 },
        { field: "role", headerName: "Rôle", flex: 1 },
        { field: "createdAt", headerName: "Date de création", flex: 1, type: "date" },
        {
            field: "actions",
            headerName: "Actions",
            flex: 1,
            sortable: false,
            renderCell: (params) => (
                <>
                    <Button startIcon={<EditIcon />} onClick={() => handleOpenUpdateDialog(params.row)}>Modifier</Button>
                    <Button startIcon={<DeleteIcon />} onClick={() => handleOpenDeleteDialog(params.id)} color="error">Supprimer</Button>
                </>
            ),
        }
    ];

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur : {error}</div>;

    return (
        <Box sx={{ margin: '1.5rem' }}>
            <Header title="UTILISATEURS" subtitle="Gérer les comptes utilisateurs" />
            <Paper elevation={2} sx={{ mt: 2, p: 2, height: '75vh' }}>
                <DataGrid
                    loading={loading}
                    rows={users}
                    columns={columns}
                    getRowId={(row) => row._id}
                    sx={{
                        "& .MuiDataGrid-root": { border: "none" },
                        "& .MuiDataGrid-cell": { borderBottom: "none" },
                        "& .MuiDataGrid-columnHeaders": {
                            backgroundColor: theme.palette.background.paper,
                            color: theme.palette.text.secondary,
                        },
                        "& .MuiDataGrid-virtualScroller": { backgroundColor: theme.palette.background.default },
                        "& .MuiDataGrid-footerContainer": { borderTop: "none" },
                    }}
                />
            </Paper>
            {/* Update Dialog */}
            <Dialog open={openUpdate} onClose={handleCloseDialogs}>
                <DialogTitle>Mettre à jour l’utilisateur</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Nom" type="text" fullWidth variant="standard" value={currentUser.name || ''} onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })} />
                    <TextField margin="dense" label="Adresse Email" type="email" fullWidth variant="standard" value={currentUser.email || ''} onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })} />
                    <TextField margin="dense" label="Numéro de téléphone" type="tel" fullWidth variant="standard" value={currentUser.phoneNumber || ''} onChange={(e) => setCurrentUser({ ...currentUser, phoneNumber: e.target.value })} />
                    <TextField margin="dense" label="Rôle" type="text" fullWidth variant="standard" value={currentUser.role || ''} onChange={(e) => setCurrentUser({ ...currentUser, role: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs}>Annuler</Button>
                    <Button onClick={handleUpdateUser}>Mettre à jour</Button>
                </DialogActions>
            </Dialog>
            {/* Delete Dialog */}
            <Dialog open={openDelete} onClose={handleCloseDialogs}>
                <DialogTitle>Supprimer l’utilisateur</DialogTitle>
                <DialogContent>
                    <Typography>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs}>Annuler</Button>
                    <Button onClick={handleDeleteUser} color="error">Supprimer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Utilisateurs;
