import React from 'react';
import { Container, Grid, Paper, Box, Typography, Avatar } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import PropTypes from 'prop-types';

const Profile = ({ user }) => {
    
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ mt: 4, p: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Box sx={{ mb: 3 }}>
          <Avatar sx={{ mx: 'auto', bgcolor: 'secondary.main', width: 100, height: 100 }}>
            <AccountCircleIcon sx={{ fontSize: '50px' }} />
          </Avatar>
        </Box>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Typography variant="h6" component="div">
              <AccountCircleIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              {user.name}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="div">
              <EmailIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              {user.email}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" component="div">
              <PhoneIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              {user.phone}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phone: PropTypes.string
  }).isRequired
};

export default Profile;
