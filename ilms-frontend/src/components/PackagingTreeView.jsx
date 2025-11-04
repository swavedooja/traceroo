import React from 'react';
import { Box, Typography } from '@mui/material';

function LevelBox({ level, totalBaseItems, children }) {
  return (
    <Box sx={{
      border: '2px solid #94a3b8',
      borderRadius: 1,
      p: 2,
      m: 1,
      background: '#fff',
    }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{level.levelName} ({level.levelCode})</Typography>
      <Typography variant="caption" color="text.secondary">Contains: {level.containedQuantity}</Typography><br />
      <Typography variant="caption" color="text.secondary">Total items: {totalBaseItems}</Typography>
      <Box sx={{ mt: 1 }}>{children}</Box>
    </Box>
  );
}

export default function PackagingTreeView({ levels = [] }) {
  // levels are levelIndex ascending (1=innermost). Build nested from outermost downwards
  const computeTotals = (idx) => {
    let total = 1;
    for (let j = idx; j >= 0; j--) {
      const q = levels[j].containedQuantity || 1;
      total *= j === 0 ? 1 : q;
    }
    return total;
  };

  const renderNested = (i) => {
    const level = levels[i];
    const total = computeTotals(i);
    if (i === 0) {
      return (
        <LevelBox key={level.levelIndex} level={level} totalBaseItems={total} />
      );
    }
    return (
      <LevelBox key={level.levelIndex} level={level} totalBaseItems={total}>
        {renderNested(i - 1)}
      </LevelBox>
    );
  };

  if (!levels?.length) return null;
  return (
    <Box>
      {renderNested(levels.length - 1)}
    </Box>
  );
}
