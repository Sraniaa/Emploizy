import { useState, useEffect } from "react";
import axios from 'axios';
import { Box, useTheme, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, Paper } from '@mui/material';
import Header from "../../components/Admin/Header";
import { DataGrid } from "@mui/x-data-grid";
import toast from 'react-hot-toast';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const Emplois = () => {
    const theme = useTheme();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentJob, setCurrentJob] = useState({});
    const [openUpdate, setOpenUpdate] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [jobDetails, setJobDetails] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:4000/api/v1/admin/jobs', { withCredentials: true });
                setJobs(response.data.jobs);
                setLoading(false);
            } catch (err) {
                setError(err.toString());
                setLoading(false);
                toast.error('Échec du chargement des offres d\'emploi');
            }
        };
        fetchJobs();
    }, []);

    const handleOpenUpdateDialog = (job) => {
        setCurrentJob(job);
        setOpenUpdate(true);
    };

    const handleOpenDeleteDialog = (jobId) => {
        setCurrentJob({ id: jobId });
        setOpenDelete(true);
    };

    const handleCloseDialogs = () => {
        setOpenUpdate(false);
        setOpenDelete(false);
        setOpenDetails(false);
    };

    const handleUpdateJob = async () => {
        try {
            await axios.put(`http://localhost:4000/api/v1/admin/jobs/${currentJob._id}`, currentJob, { withCredentials: true });
            toast.success('Offre d\'emploi mise à jour avec succès');
            handleCloseDialogs();
        } catch (error) {
            toast.error('Échec de la mise à jour de l\'offre d\'emploi');
        }
    };

    const handleDeleteJob = async () => {
        try {
            await axios.delete(`http://localhost:4000/api/v1/admin/jobs/${currentJob.id}`, { withCredentials: true });
            toast.success('Offre d\'emploi supprimée avec succès');
            handleCloseDialogs();
        } catch (error) {
            toast.error('Échec de la suppression de l\'offre d\'emploi');
        }
    };

    const handleDetailsClick = async (jobId) => {
        try {
            const response = await axios.get(`http://localhost:4000/api/v1/admin/jobs/${jobId}`, { withCredentials: true });
            setJobDetails(response.data.job);
            setOpenDetails(true);
        } catch (error) {
            toast.error('Échec du chargement des détails de l\'offre d\'emploi');
        }
    };

    const columns = [
        { field: "title", headerName: "Titre", flex: 1 },
        { field: "country", headerName: "Pays", flex: 1 },
        { field: "salaryFrom", headerName: "Salaire à partir de", type: "number", flex: 1 },
        { field: "salaryTo", headerName: "Salaire jusqu'à", type: "number", flex: 1 },
        { field: "jobPostedOn", headerName: "Publié le", type: "date", flex: 1 },
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
        },
        {
            field: 'details',
            headerName: 'Détails',
            sortable: false,
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    style={{ marginLeft: 16 }}
                    onClick={() => handleDetailsClick(params.id)}
                >
                    Détails
                </Button>
            ),
        },
    ];

    return (
        <Box sx={{ margin: '1.5rem' }}>
            <Header title="OFFRES D'EMPLOI" subtitle="Consultez les offres d'emploi disponibles" />
            <Paper elevation={2} sx={{ mt: 2, p: 2, height: '75vh' }}>
                <DataGrid
                    loading={loading}
                    rows={jobs}
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
                <DialogTitle>Mettre à jour l&apos;offre d&apos;emploi</DialogTitle>
                <DialogContent>
                    <TextField autoFocus margin="dense" label="Titre" type="text" fullWidth variant="standard" value={currentJob.title || ''} onChange={(e) => setCurrentJob({ ...currentJob, title: e.target.value })} />
                    <TextField margin="dense" label="Description" type="text" fullWidth variant="standard" value={currentJob.description || ''} onChange={(e) => setCurrentJob({ ...currentJob, description: e.target.value })} />
                    <TextField margin="dense" label="Pays" type="text" fullWidth variant="standard" value={currentJob.country || ''} onChange={(e) => setCurrentJob({ ...currentJob, country: e.target.value })} />
                    <TextField margin="dense" label="Salaire à partir de" type="number" fullWidth variant="standard" value={currentJob.salaryFrom || ''} onChange={(e) => setCurrentJob({ ...currentJob, salaryFrom: e.target.value })} />
                    <TextField margin="dense" label="Salaire jusqu'à" type="number" fullWidth variant="standard" value={currentJob.salaryTo || ''} onChange={(e) => setCurrentJob({ ...currentJob, salaryTo: e.target.value })} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs}>Annuler</Button>
                    <Button onClick={() => handleUpdateJob(currentJob._id, currentJob)}>Mettre à jour</Button>
                </DialogActions>
            </Dialog>
            {/* Delete Dialog */}
            <Dialog open={openDelete} onClose={handleCloseDialogs}>
                <DialogTitle>Supprimer l&apos;offre d&apos;emploi</DialogTitle>
                <DialogContent>
                    <Typography>Êtes-vous sûr de vouloir supprimer cette offre d&apos;emploi ?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs}>Annuler</Button>
                    <Button onClick={handleDeleteJob} color="error">Supprimer</Button>
                </DialogActions>
            </Dialog>
            {/* Details Dialog */}
            <Dialog open={openDetails} onClose={handleCloseDialogs} maxWidth="md" fullWidth>
                <DialogTitle>Détails de l&apos;offre d&apos;emploi</DialogTitle>
                <DialogContent>
                    {jobDetails ? (
                        <>
                            <Typography variant="h6" gutterBottom>{jobDetails.title}</Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                <strong>Catégorie:</strong> {jobDetails.category}
                            </Typography>
                            <Typography paragraph>
                                <strong>Description:</strong> {jobDetails.description}
                            </Typography>
                            <Typography paragraph>
                                <strong>Lieu:</strong> {`${jobDetails.city}, ${jobDetails.country}`}
                            </Typography>
                            <Typography paragraph>
                                <strong>Détails du lieu:</strong> {jobDetails.location}
                            </Typography>
                            <Typography paragraph>
                                <strong>Fourchette salariale:</strong> {jobDetails.salaryFrom} - {jobDetails.salaryTo}
                            </Typography>
                            <Typography paragraph>
                                <strong>Salaire fixe:</strong> {jobDetails.fixedSalary || 'Non spécifié'}
                            </Typography>
                            <Typography paragraph>
                                <strong>Date de publication:</strong> {new Date(jobDetails.jobPostedOn).toLocaleDateString()}
                            </Typography>
                            <Typography paragraph>
                                <strong>Statut de l&apos;emploi:</strong> {jobDetails.expired ? 'Expiré' : 'Actif'}
                            </Typography>
                        </>
                    ) : (
                        <Typography>Chargement...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialogs}>Fermer</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Emplois;
