// ConfirmModal.tsx
import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material';

interface ConfirmLoginProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  email: string;
  defaultEmail: string;
}

export const ConfirmLogin: React.FC<ConfirmLoginProps> = ({
  open,
  onConfirm,
  onCancel,
  email,
  defaultEmail,
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>ログイン確認</DialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>
          この端末では以前に <strong>{defaultEmail}</strong> が使用されていました。
        </Typography>
        <Typography gutterBottom>
           <strong>{email}</strong> にログインしてもよろしいですか？
        </Typography>
        <Typography variant="body2" color="error">
          ※データが破損する恐れがあります。
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="error">
          いいえ
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          はい
        </Button>
      </DialogActions>
    </Dialog>
  );
};
