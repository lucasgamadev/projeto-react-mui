import { AccountCircle, Security } from "@mui/icons-material";
import { Box, Card, CardContent, Container, Tab, Tabs, Typography, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import ChangePassword from "./ChangePassword";
import ProfileEdit from "./ProfileEdit";
import ProfileView from "./ProfileView";

// Componente TabPanel para organizar o conteúdo das tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const ProfilePage = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const [value, setValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Perfil do Usuário
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualize e edite suas informações pessoais
        </Typography>
      </Box>

      <Card
        sx={{
          borderRadius: 2,
          boxShadow: theme.shadows[3],
          overflow: "visible"
        }}
      >
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="profile tabs"
              indicatorColor="primary"
              textColor="primary"
              sx={{ px: 2 }}
            >
              <Tab
                icon={<AccountCircle />}
                label="Informações Pessoais"
                id="profile-tab-0"
                aria-controls="profile-tabpanel-0"
              />
              <Tab
                icon={<Security />}
                label="Segurança"
                id="profile-tab-1"
                aria-controls="profile-tabpanel-1"
              />
            </Tabs>
          </Box>

          <TabPanel value={value} index={0}>
            {isEditing ? (
              <ProfileEdit onCancel={handleEditToggle} onSave={handleEditToggle} user={user} />
            ) : (
              <ProfileView onEdit={handleEditToggle} user={user} />
            )}
          </TabPanel>

          <TabPanel value={value} index={1}>
            <ChangePassword />
          </TabPanel>
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
