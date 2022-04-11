const muiStyleOverrides = {
  MuiAppBar: {
    styleOverrides: {
      colorDefault: {
        backgroundColor: '#fff',
        color: '#333',
      },
    },
  },
  MuiBottomNavigationAction: {
    styleOverrides: {
      root: {
        minWidth: '60px',
      },
    },
  },
  MuiButton: {
    styleOverrides: {
      root: {
        userSelect: 'none',
        '@media print': {
          color: '#fff',
        },
      },
    },
  },
  MuiDropzonePreviewList: {
    styleOverrides: {
      image: {
        maxWidth: 'auto',
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      root: {
        marginBottom: '-.5rem',
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        outline: 'none !important',
      },
      textColorPrimary: {
        textTransform: 'none',
      },
    },
  },
  MuiToolbar: {
    styleOverrides: {
      root: {
        padding: 0,
        flexDirection: 'unset',
      },
      regular: {
        minHeight: '48px !important',
      },
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: {
        fontSize: '14px',
      },
    },
  },
};

export default muiStyleOverrides;
