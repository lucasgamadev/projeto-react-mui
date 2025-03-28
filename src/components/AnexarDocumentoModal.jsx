import { Close as CloseIcon } from '@mui/icons-material';
import { DocumentScanner as DocumentScannerIcon } from '@mui/icons-material';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { useState } from 'react';

const AnexarDocumentoModal = ({ open, onClose, onAnexar }) => {
  const [documento, setDocumento] = useState(null);

  const handleAnexar = () => {
    if (documento) {
      onAnexar(documento);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ borderBottom: 1, borderColor: 'divider', pb: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <DocumentScannerIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6">ANEXAR DOCUMENTO</Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box component="form" noValidate sx={{ mt: 2 }}>
          <TextField
            type="file"
            fullWidth
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.type === 'application/pdf') {
                setDocumento(file);
              } else {
                alert('Por favor, selecione um arquivo PDF.');
                e.target.value = '';
              }
            }}
            inputProps={{ accept: '.pdf' }}
            helperText="Apenas arquivos PDF são permitidos"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: 1, borderColor: "divider" }}>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button onClick={handleAnexar} variant="contained" color="primary">
          Anexar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

AnexarDocumentoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onAnexar: PropTypes.func.isRequired
};

export default AnexarDocumentoModal;
