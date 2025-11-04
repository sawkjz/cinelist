import React from 'react';

interface TableProps {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children }) => {
  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  return <table style={tableStyle}>{children}</table>;
};

export const TableHead: React.FC<TableProps> = ({ children }) => {
  return <thead>{children}</thead>;
};

export const TableBody: React.FC<TableProps> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

export const TableRow: React.FC<TableProps> = ({ children }) => {
  const rowStyle: React.CSSProperties = {
    borderBottom: '1px solid #e5e7eb',
  };

  return <tr style={rowStyle}>{children}</tr>;
};

interface TableCellProps {
  children: React.ReactNode;
  isHeader?: boolean;
}

export const TableCell: React.FC<TableCellProps> = ({ children, isHeader }) => {
  const cellStyle: React.CSSProperties = {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '14px',
    color: isHeader ? '#111827' : '#4b5563',
    fontWeight: isHeader ? '600' : '400',
    backgroundColor: isHeader ? '#f9fafb' : 'transparent',
  };

  return isHeader ? <th style={cellStyle}>{children}</th> : <td style={cellStyle}>{children}</td>;
};
