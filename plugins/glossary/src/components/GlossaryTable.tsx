/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Chip,
} from '@material-ui/core';
import { Edit, Delete, Add } from '@material-ui/icons';
import { useApi } from '@backstage/core-plugin-api';
import { useAsync } from 'react-use';
import { glossaryApiRef } from '../api';
import { GlossaryTerm, CreateGlossaryTermRequest } from '@backstage/plugin-glossary-common';
import { stringifyEntityRef, CompoundEntityRef } from '@backstage/catalog-model';

interface GlossaryTableProps {
  entityRef?: string;
  showEntityColumn?: boolean;
  title?: string;
}

export const GlossaryTable = ({ entityRef, showEntityColumn = false, title }: GlossaryTableProps) => {
  const glossaryApi = useApi(glossaryApiRef);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTerm, setEditingTerm] = useState<GlossaryTerm | null>(null);
  const [formData, setFormData] = useState({
    term: '',
    definition: '',
    entityRef: { kind: 'Component', namespace: 'default', name: '' } as CompoundEntityRef,
  });

  const { value: termsData, loading, error, execute: refetch } = useAsync(async () => {
    return glossaryApi.getGlossaryTerms({ entityRef });
  }, [entityRef]);

  const handleOpenDialog = (term?: GlossaryTerm) => {
    if (term) {
      setEditingTerm(term);
      setFormData({
        term: term.term,
        definition: term.definition,
        entityRef: term.entityRef,
      });
    } else {
      setEditingTerm(null);
      setFormData({
        term: '',
        definition: '',
        entityRef: { kind: 'Component', namespace: 'default', name: '' },
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTerm(null);
  };

  const handleSave = async () => {
    try {
      if (editingTerm) {
        await glossaryApi.updateGlossaryTerm(editingTerm.id, formData);
      } else {
        await glossaryApi.createGlossaryTerm(formData as CreateGlossaryTermRequest);
      }
      await refetch();
      handleCloseDialog();
    } catch (err) {
      console.error('Failed to save glossary term:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await glossaryApi.deleteGlossaryTerm(id);
      await refetch();
    } catch (err) {
      console.error('Failed to delete glossary term:', err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  const terms = termsData?.terms || [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Typography variant="h6">{title || 'Glossary Terms'}</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Add Term
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Term</TableCell>
              <TableCell>Definition</TableCell>
              {showEntityColumn && <TableCell>Entity</TableCell>}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {terms.map((term) => (
              <TableRow key={term.id}>
                <TableCell>
                  <Typography variant="body2" style={{ fontWeight: 'bold' }}>
                    {term.term}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{term.definition}</Typography>
                </TableCell>
                {showEntityColumn && (
                  <TableCell>
                    <Chip 
                      label={stringifyEntityRef(term.entityRef)} 
                      variant="outlined" 
                      size="small"
                    />
                  </TableCell>
                )}
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(term)} size="small">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(term.id)} size="small">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingTerm ? 'Edit Term' : 'Add New Term'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Term"
            value={formData.term}
            onChange={(e) => setFormData({ ...formData, term: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Definition"
            value={formData.definition}
            onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
            margin="normal"
            multiline
            rows={4}
          />
          <TextField
            fullWidth
            label="Entity Kind"
            value={formData.entityRef.kind}
            onChange={(e) => setFormData({ 
              ...formData, 
              entityRef: { ...formData.entityRef, kind: e.target.value }
            })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Entity Namespace"
            value={formData.entityRef.namespace}
            onChange={(e) => setFormData({ 
              ...formData, 
              entityRef: { ...formData.entityRef, namespace: e.target.value }
            })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Entity Name"
            value={formData.entityRef.name}
            onChange={(e) => setFormData({ 
              ...formData, 
              entityRef: { ...formData.entityRef, name: e.target.value }
            })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {editingTerm ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};